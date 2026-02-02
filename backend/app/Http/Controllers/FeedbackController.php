<?php

namespace App\Http\Controllers;

use App\Mail\NewFeedbackNotification;
use Carbon\Carbon;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Mail;
use App\Models\Feedback;
use App\Http\Controllers\SettingsController;

class FeedbackController extends Controller
{
    /**
     * Transform a feedback model for API response (add status, date alias).
     */
    private function transformFeedback(Feedback $feedback): array
    {
        return [
            'id' => $feedback->id,
            'name' => $feedback->name,
            'email' => $feedback->email,
            'message' => $feedback->message,
            'comment' => $feedback->message,
            'rating' => (int) $feedback->rating,
            'is_approved' => (bool) $feedback->is_approved,
            'status' => $feedback->is_approved ? 'approved' : 'pending',
            'created_at' => $feedback->created_at?->format('c'),
            'date' => $feedback->created_at?->format('c'),
            'updated_at' => $feedback->updated_at?->format('c'),
        ];
    }

    /**
     * List all feedback (admin). Supports limit, sort, order for dashboard.
     */
    public function index(Request $request)
    {
        $sort = $request->query('sort', 'date');
        $order = strtolower($request->query('order', 'desc')) === 'asc' ? 'asc' : 'desc';
        $limit = $request->query('limit');

        $column = $sort === 'rating' ? 'rating' : 'created_at';
        $query = Feedback::orderBy($column, $order);

        if ($limit && (int) $limit > 0) {
            $query->limit((int) $limit);
        }

        $items = $query->get();
        return response()->json($items->map(fn (Feedback $f) => $this->transformFeedback($f)));
    }

    /**
     * List approved feedback only (public). Supports limit, sort, order for home/reviews.
     */
    public function approved(Request $request)
    {
        $sort = $request->query('sort', 'date');
        $order = strtolower($request->query('order', 'desc')) === 'asc' ? 'asc' : 'desc';
        $limit = $request->query('limit');

        $column = $sort === 'rating' ? 'rating' : 'created_at';
        $query = Feedback::where('is_approved', true)->orderBy($column, $order);

        if ($limit && (int) $limit > 0) {
            $query->limit((int) $limit);
        }

        $items = $query->get();
        return response()->json($items->map(fn (Feedback $f) => $this->transformFeedback($f)));
    }

    /**
     * Store new feedback. Enforces allowAnonymousReviews and sends email if enableEmailNotifications.
     */
    public function store(Request $request)
    {
        $settings = SettingsController::getMerged();
        $allowAnonymous = $settings['allowAnonymousReviews'] ?? true;

        $rules = [
            'name' => [$allowAnonymous ? 'nullable' : 'required', 'string', 'max:255', 'min:2'],
            'email' => [$allowAnonymous ? 'nullable' : 'required', 'string', 'email', 'max:255'],
            'message' => ['nullable', 'string', 'min:10', 'max:1000'],
            'comment' => ['nullable', 'string', 'min:10', 'max:1000'],
            'rating' => ['required', 'integer', 'min:1', 'max:5'],
        ];

        $validated = $request->validate($rules);

        $message = $validated['message'] ?? $validated['comment'] ?? $request->input('comment', '');
        if (strlen($message) < 10) {
            return response()->json(['message' => 'The feedback text must be at least 10 characters.'], 422);
        }

        if (! $allowAnonymous) {
            $name = trim($request->input('name', ''));
            if (strlen($name) < 2) {
                return response()->json(['message' => 'Name is required and must be at least 2 characters.'], 422);
            }
            $email = trim($request->input('email', ''));
            if (! $email || ! filter_var($email, FILTER_VALIDATE_EMAIL)) {
                return response()->json(['message' => 'A valid email address is required.'], 422);
            }
        }

        $feedback = Feedback::create([
            'name' => $request->input('name') ?? 'Anonymous',
            'email' => $request->input('email') ?? '',
            'message' => $message,
            'rating' => (int) ($validated['rating'] ?? $request->input('rating', 0)),
        ]);

        if (! empty($settings['enableEmailNotifications'])) {
            $to = $settings['notification_email'] ?? config('mail.from.address');
            if ($to) {
                try {
                    Mail::to($to)->send(new NewFeedbackNotification($feedback));
                } catch (\Throwable $e) {
                    report($e);
                }
            }
        }

        return response()->json($this->transformFeedback($feedback), 201);
    }

    /**
     * Update feedback status (approve / pending).
     */
    public function updateStatus(Request $request, int $id)
    {
        $validated = $request->validate([
            'status' => ['required', 'string', 'in:approved,pending,hidden'],
        ]);

        $feedback = Feedback::findOrFail($id);
        $feedback->is_approved = ($validated['status'] === 'approved');
        $feedback->save();

        return response()->json($this->transformFeedback($feedback->fresh()));
    }

    /**
     * Delete feedback.
     */
    public function destroy(int $id)
    {
        $feedback = Feedback::findOrFail($id);
        $feedback->delete();
        return response()->json(['message' => 'Feedback deleted'], 200);
    }

    /**
     * Get feedback statistics (for dashboard and elsewhere).
     * Returns both legacy keys and dashboard shape: totalFeedback, pendingReviews, approvedReviews, avgRating, thisWeekFeedback, lastWeekFeedback.
     */
    public function stats()
    {
        $total = Feedback::count();
        $approved = Feedback::where('is_approved', true)->count();
        $pending = Feedback::where('is_approved', false)->count();
        $avgRating = (float) Feedback::avg('rating');

        $now = Carbon::now();
        $startThisWeek = $now->copy()->startOfWeek();
        $startLastWeek = $now->copy()->subWeek()->startOfWeek();
        $endLastWeek = $startThisWeek->copy()->subSecond();

        $thisWeekFeedback = Feedback::where('created_at', '>=', $startThisWeek)->count();
        $lastWeekFeedback = Feedback::whereBetween('created_at', [$startLastWeek, $endLastWeek])->count();

        $responseRate = $total > 0 ? round($approved / $total * 100, 1) : 0;

        return response()->json([
            'total' => $total,
            'approved' => $approved,
            'pending' => $pending,
            'average_rating' => round($avgRating, 2),
            'totalFeedback' => $total,
            'pendingReviews' => $pending,
            'approvedReviews' => $approved,
            'avgRating' => round($avgRating, 2),
            'thisWeekFeedback' => $thisWeekFeedback,
            'lastWeekFeedback' => $lastWeekFeedback,
            'totalReviews' => $approved,
            'totalUsers' => $total,
            'responseRate' => $responseRate,
        ]);
    }
}
