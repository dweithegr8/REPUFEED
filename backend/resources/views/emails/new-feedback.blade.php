<!DOCTYPE html>
<html>
<head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>New Feedback - RepuFeed</title>
</head>
<body style="font-family: sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto; padding: 20px;">
    <h2 style="color: #1b1b18;">New Feedback Submitted</h2>
    <p>A new feedback has been submitted on RepuFeed.</p>
    <table style="width: 100%; border-collapse: collapse; margin: 16px 0;">
        <tr><td style="padding: 8px 0; border-bottom: 1px solid #eee;"><strong>Name</strong></td><td style="padding: 8px 0; border-bottom: 1px solid #eee;">{{ $feedback->name }}</td></tr>
        <tr><td style="padding: 8px 0; border-bottom: 1px solid #eee;"><strong>Email</strong></td><td style="padding: 8px 0; border-bottom: 1px solid #eee;">{{ $feedback->email ?: '—' }}</td></tr>
        <tr><td style="padding: 8px 0; border-bottom: 1px solid #eee;"><strong>Rating</strong></td><td style="padding: 8px 0; border-bottom: 1px solid #eee;">{{ $feedback->rating }}/5</td></tr>
        <tr><td style="padding: 8px 0; border-bottom: 1px solid #eee;"><strong>Message</strong></td><td style="padding: 8px 0; border-bottom: 1px solid #eee;">{{ $feedback->message }}</td></tr>
        <tr><td style="padding: 8px 0;"><strong>Date</strong></td><td style="padding: 8px 0;">{{ $feedback->created_at?->format('Y-m-d H:i') }}</td></tr>
    </table>
    <p style="color: #706f6c; font-size: 14px;">— RepuFeed</p>
</body>
</html>
