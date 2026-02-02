import { useState, useEffect } from 'react';
import { Star, MessageSquare, Clock, CheckCircle, TrendingUp, TrendingDown, Loader2 } from 'lucide-react';
import StarRating from '../../components/common/StarRating';
import { feedbackAPI } from '../../services/api';

const Dashboard = () => {
  const [isLoading, setIsLoading] = useState(true);
  
  // Real data state - starts empty, populated by API
  const [stats, setStats] = useState({
    totalFeedback: 0,
    pendingReviews: 0,
    approvedReviews: 0,
    avgRating: 0,
    thisWeekFeedback: 0,
    lastWeekFeedback: 0,
  });

  const [recentReviews, setRecentReviews] = useState([]);

  // Fetch dashboard data on component mount
  useEffect(() => {
    const fetchDashboardData = async () => {
      setIsLoading(true);
      try {
        const [statsResponse, reviewsResponse] = await Promise.all([
          feedbackAPI.getStats(),
          feedbackAPI.getAll({ limit: 5, sort: 'date', order: 'desc' }),
        ]);
        setStats(statsResponse.data);
        setRecentReviews(reviewsResponse.data ?? []);
      } catch (error) {
        console.error('Failed to fetch dashboard data:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchDashboardData();
  }, []);

  const weeklyTrend = stats.lastWeekFeedback > 0 
    ? ((stats.thisWeekFeedback - stats.lastWeekFeedback) / stats.lastWeekFeedback * 100).toFixed(1)
    : '0.0';
  const isTrendPositive = parseFloat(weeklyTrend) >= 0;

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div>
        <h1 className="text-2xl font-bold text-primary-dark">Dashboard</h1>
        <p className="text-neutral-slate">Welcome back! Here's an overview of your feedback system.</p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {/* Total Feedback */}
        <div className="card">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-neutral-slate text-sm font-medium">Total Feedback</p>
              <p className="text-3xl font-bold text-primary-dark mt-1">
                {stats.totalFeedback.toLocaleString()}
              </p>
            </div>
            <div className="w-12 h-12 bg-primary-dark/10 rounded-full flex items-center justify-center">
              <MessageSquare className="w-6 h-6 text-primary-dark" />
            </div>
          </div>
          <div className={`flex items-center gap-1 mt-3 text-sm ${isTrendPositive ? 'text-green-600' : 'text-red-600'}`}>
            {isTrendPositive ? <TrendingUp className="w-4 h-4" /> : <TrendingDown className="w-4 h-4" />}
            <span>{Math.abs(parseFloat(weeklyTrend))}% from last week</span>
          </div>
        </div>

        {/* Pending Reviews */}
        <div className="card">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-neutral-slate text-sm font-medium">Pending Reviews</p>
              <p className="text-3xl font-bold text-primary-orange mt-1">
                {stats.pendingReviews}
              </p>
            </div>
            <div className="w-12 h-12 bg-primary-orange/10 rounded-full flex items-center justify-center">
              <Clock className="w-6 h-6 text-primary-orange" />
            </div>
          </div>
          <p className="text-sm text-neutral-slate mt-3">
            Awaiting moderation
          </p>
        </div>

        {/* Approved Reviews */}
        <div className="card">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-neutral-slate text-sm font-medium">Approved Reviews</p>
              <p className="text-3xl font-bold text-green-600 mt-1">
                {stats.approvedReviews.toLocaleString()}
              </p>
            </div>
            <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center">
              <CheckCircle className="w-6 h-6 text-green-600" />
            </div>
          </div>
          <p className="text-sm text-neutral-slate mt-3">
            Published publicly
          </p>
        </div>

        {/* Average Rating */}
        <div className="card">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-neutral-slate text-sm font-medium">Average Rating</p>
              <p className="text-3xl font-bold text-primary-dark mt-1">
                {stats.avgRating}
              </p>
            </div>
            <div className="w-12 h-12 bg-primary-orange/10 rounded-full flex items-center justify-center">
              <Star className="w-6 h-6 text-primary-orange fill-primary-orange" />
            </div>
          </div>
          <div className="mt-3">
            <StarRating rating={Math.round(stats.avgRating)} readonly size="sm" />
          </div>
        </div>
      </div>

      {/* Recent Reviews */}
      <div className="card">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-lg font-semibold text-primary-dark">Recent Reviews</h2>
          <a
            href="/admin/feedback"
            className="text-sm text-primary-orange hover:text-primary-dark transition-colors"
          >
            View all →
          </a>
        </div>

        {isLoading ? (
          <div className="flex items-center justify-center py-8">
            <Loader2 className="w-6 h-6 animate-spin text-primary-orange" />
          </div>
        ) : recentReviews.length === 0 ? (
          <div className="text-center py-8">
            <MessageSquare className="w-12 h-12 text-neutral-lightGray mx-auto mb-3" />
            <p className="text-neutral-slate">No feedback received yet.</p>
          </div>
        ) : (
          <div className="space-y-4">
            {recentReviews.map((review) => (
              <div
                key={review.id}
                className="flex items-start gap-4 p-4 bg-neutral-offWhite rounded-lg"
              >
                <div className="w-10 h-10 bg-primary-orange/20 rounded-full flex items-center justify-center flex-shrink-0">
                  <span className="text-primary-orange font-semibold">
                    {review.name ? review.name.charAt(0) : 'A'}
                  </span>
                </div>
                <div className="flex-grow min-w-0">
                  <div className="flex items-center gap-3 mb-1">
                    <h4 className="font-medium text-primary-dark">{review.name || 'Anonymous'}</h4>
                    <span
                      className={`px-2 py-0.5 text-xs font-medium rounded-full ${
                        review.status === 'pending'
                          ? 'bg-yellow-100 text-yellow-800'
                          : 'bg-green-100 text-green-800'
                      }`}
                    >
                      {review.status}
                    </span>
                  </div>
                  <StarRating rating={review.rating} readonly size="sm" />
                  <p className="text-neutral-slate text-sm mt-2 truncate">{review.comment || review.message}</p>
                </div>
                <span className="text-xs text-neutral-slate flex-shrink-0">
                  {new Date(review.date || review.created_at).toLocaleDateString()}
                </span>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Dashboard;
