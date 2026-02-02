import { useState, useEffect } from 'react';
import { Save, Loader2, CheckCircle } from 'lucide-react';
import { settingsAPI } from '../../services/api';

const defaultSettings = {
  enablePublicReviews: true,
  requireApproval: true,
  enableEmailNotifications: true,
  showRatingsBreakdown: true,
  allowAnonymousReviews: true,
  minimumRatingToShow: 1,
  notification_email: '',
};

const Settings = () => {
  const [settings, setSettings] = useState(defaultSettings);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);

  useEffect(() => {
    const fetchSettings = async () => {
      try {
        const response = await settingsAPI.get();
        setSettings({ ...defaultSettings, ...response.data });
      } catch (error) {
        console.error('Failed to fetch settings:', error);
      } finally {
        setIsLoading(false);
      }
    };
    fetchSettings();
  }, []);

  const handleToggle = (key) => {
    setSettings((prev) => ({ ...prev, [key]: !prev[key] }));
    setSaveSuccess(false);
  };

  const handleChange = (key, value) => {
    setSettings((prev) => ({ ...prev, [key]: value }));
    setSaveSuccess(false);
  };

  const handleSave = async () => {
    setIsSaving(true);
    setSaveSuccess(false);

    try {
      await settingsAPI.update(settings);
      setSaveSuccess(true);
    } catch (error) {
      console.error('Failed to save settings:', error);
    } finally {
      setIsSaving(false);
    }
  };

  const ToggleSwitch = ({ enabled, onChange, label, description }) => (
    <div className="flex items-center justify-between p-4 bg-neutral-offWhite rounded-lg">
      <div>
        <h4 className="font-medium text-primary-dark">{label}</h4>
        <p className="text-sm text-neutral-slate">{description}</p>
      </div>
      <button
        onClick={onChange}
        className={`relative w-14 h-7 rounded-full transition-colors duration-200 ${
          enabled ? 'bg-primary-orange' : 'bg-neutral-lightGray'
        }`}
      >
        <span
          className={`absolute top-0.5 left-0.5 w-6 h-6 bg-white rounded-full shadow transition-transform duration-200 ${
            enabled ? 'translate-x-7' : 'translate-x-0'
          }`}
        />
      </button>
    </div>
  );

  return (
    <div className="space-y-6 max-w-3xl">
      {/* Page Header */}
      <div>
        <h1 className="text-2xl font-bold text-primary-dark">Settings</h1>
        <p className="text-neutral-slate">Configure your feedback system preferences.</p>
      </div>

      {/* Success Message */}
      {saveSuccess && (
        <div className="flex items-center gap-3 p-4 bg-green-50 border border-green-200 rounded-lg">
          <CheckCircle className="w-5 h-5 text-green-600" />
          <p className="text-green-800 font-medium">Settings saved successfully!</p>
        </div>
      )}

      {/* Public Reviews Settings */}
      <div className="card">
        <h3 className="text-lg font-semibold text-primary-dark mb-6">Public Reviews</h3>
        <div className="space-y-4">
          <ToggleSwitch
            enabled={settings.enablePublicReviews}
            onChange={() => handleToggle('enablePublicReviews')}
            label="Enable Public Reviews"
            description="Show approved reviews on the public reviews page."
          />
          <ToggleSwitch
            enabled={settings.requireApproval}
            onChange={() => handleToggle('requireApproval')}
            label="Require Approval"
            description="Reviews must be approved before appearing publicly."
          />
          <ToggleSwitch
            enabled={settings.showRatingsBreakdown}
            onChange={() => handleToggle('showRatingsBreakdown')}
            label="Show Ratings Breakdown"
            description="Display the star rating distribution on the reviews page."
          />
        </div>
      </div>

      {/* Submission Settings */}
      <div className="card">
        <h3 className="text-lg font-semibold text-primary-dark mb-6">Submission Settings</h3>
        <div className="space-y-4">
          <ToggleSwitch
            enabled={settings.allowAnonymousReviews}
            onChange={() => handleToggle('allowAnonymousReviews')}
            label="Allow Anonymous Reviews"
            description="Users can submit reviews without providing their name or email."
          />
          
          {/* Minimum Rating Dropdown */}
          <div className="flex items-center justify-between p-4 bg-neutral-offWhite rounded-lg">
            <div>
              <h4 className="font-medium text-primary-dark">Minimum Rating to Display</h4>
              <p className="text-sm text-neutral-slate">
                Only show reviews with this rating or higher.
              </p>
            </div>
            <select
              value={settings.minimumRatingToShow}
              onChange={(e) => handleChange('minimumRatingToShow', parseInt(e.target.value))}
              className="px-4 py-2 border border-neutral-lightGray rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-dark bg-white"
            >
              <option value={1}>1 Star & Above</option>
              <option value={2}>2 Stars & Above</option>
              <option value={3}>3 Stars & Above</option>
              <option value={4}>4 Stars & Above</option>
              <option value={5}>5 Stars Only</option>
            </select>
          </div>
        </div>
      </div>

      {/* Notification Settings */}
      <div className="card">
        <h3 className="text-lg font-semibold text-primary-dark mb-6">Notifications</h3>
        <div className="space-y-4">
          <ToggleSwitch
            enabled={settings.enableEmailNotifications}
            onChange={() => handleToggle('enableEmailNotifications')}
            label="Email Notifications"
            description="Receive email alerts when new feedback is submitted."
          />
          <div className="flex flex-col gap-2 p-4 bg-neutral-offWhite rounded-lg">
            <label htmlFor="notification_email" className="block text-sm font-medium text-primary-dark">
              Notification email address
            </label>
            <input
              id="notification_email"
              type="email"
              placeholder="admin@example.com"
              value={settings.notification_email ?? ''}
              onChange={(e) => handleChange('notification_email', e.target.value)}
              className="input-field"
            />
            <p className="text-sm text-neutral-slate">
              Emails are sent here when new feedback is submitted (only if Email Notifications is on).
            </p>
          </div>
        </div>
      </div>

      {/* Save Button */}
      <div className="flex justify-end">
        <button
          onClick={handleSave}
          disabled={isSaving}
          className="bg-primary-dark text-white px-6 py-3 rounded-lg font-semibold hover:opacity-90 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
        >
          {isSaving ? (
            <>
              <Loader2 className="w-5 h-5 animate-spin" />
              Saving...
            </>
          ) : (
            <>
              <Save className="w-5 h-5" />
              Save Settings
            </>
          )}
        </button>
      </div>
    </div>
  );
};

export default Settings;
