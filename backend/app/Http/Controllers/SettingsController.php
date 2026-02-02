<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\Setting;

class SettingsController extends Controller
{
    private const SETTINGS_KEY = 'app_settings';

    /**
     * Default values used when no settings exist (matches frontend Settings.jsx).
     */
    private static function defaults(): array
    {
        return [
            'enablePublicReviews' => true,
            'requireApproval' => true,
            'enableEmailNotifications' => true,
            'showRatingsBreakdown' => true,
            'allowAnonymousReviews' => true,
            'minimumRatingToShow' => 1,
            'notification_email' => config('mail.from.address', ''),
        ];
    }

    /**
     * Return merged settings array (for use in other controllers).
     */
    public static function getMerged(): array
    {
        $row = Setting::where('key', self::SETTINGS_KEY)->first();
        $value = $row ? json_decode($row->value, true) : null;
        $defaults = self::defaults();
        return is_array($value) ? array_merge($defaults, $value) : $defaults;
    }

    /**
     * GET /api/settings/public - Return only settings needed for public/reviews/submission (no auth).
     */
    public function public(): \Illuminate\Http\JsonResponse
    {
        $all = self::getMerged();
        $keys = [
            'enablePublicReviews',
            'requireApproval',
            'showRatingsBreakdown',
            'allowAnonymousReviews',
            'minimumRatingToShow',
        ];
        $public = [];
        foreach ($keys as $key) {
            $public[$key] = $all[$key] ?? self::defaults()[$key];
        }
        return response()->json($public);
    }

    /**
     * GET /api/settings - Return current settings (for admin Settings page).
     */
    public function index()
    {
        $row = Setting::where('key', self::SETTINGS_KEY)->first();
        $value = $row ? json_decode($row->value, true) : null;
        $settings = is_array($value) ? array_merge(self::defaults(), $value) : self::defaults();
        return response()->json($settings);
    }

    /**
     * PUT /api/settings - Update settings (from admin Settings page).
     */
    public function update(Request $request)
    {
        $allowed = [
            'enablePublicReviews',
            'requireApproval',
            'enableEmailNotifications',
            'showRatingsBreakdown',
            'allowAnonymousReviews',
            'minimumRatingToShow',
            'notification_email',
        ];

        $input = $request->only($allowed);
        $input = array_filter($input, fn ($v) => $v !== null);

        $request->validate([
            'enablePublicReviews' => ['sometimes', 'boolean'],
            'requireApproval' => ['sometimes', 'boolean'],
            'enableEmailNotifications' => ['sometimes', 'boolean'],
            'showRatingsBreakdown' => ['sometimes', 'boolean'],
            'allowAnonymousReviews' => ['sometimes', 'boolean'],
            'minimumRatingToShow' => ['sometimes', 'integer', 'min:1', 'max:5'],
            'notification_email' => ['sometimes', 'nullable', 'email', 'max:255'],
        ]);

        $row = Setting::where('key', self::SETTINGS_KEY)->first();
        $current = $row ? json_decode($row->value, true) : null;
        $merged = is_array($current) ? array_merge(self::defaults(), $current, $input) : array_merge(self::defaults(), $input);

        Setting::updateOrCreate(
            ['key' => self::SETTINGS_KEY],
            ['value' => json_encode($merged)]
        );

        return response()->json($merged);
    }
}
