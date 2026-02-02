import { useState, useEffect, useMemo } from 'react';
import { Filter, ArrowUpDown, Calendar, Star, Search, Loader2, MessageSquare } from 'lucide-react';
import StarRating from '../../components/common/StarRating';
import { feedbackAPI, settingsAPI } from '../../services/api';

const PublicReviews = () => {
  const [sortBy, setSortBy] = useState('date'); // 'date' | 'rating'
  const [sortOrder, setSortOrder] = useState('desc'); // 'asc' | 'desc'
  const [filterRating, setFilterRating] = useState(0); // 0 means all
  const [searchQuery, setSearchQuery] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [settings, setSettings] = useState({
    enablePublicReviews: true,
    showRatingsBreakdown: true,
    minimumRatingToShow: 1,
  });

  const [reviews, setReviews] = useState([]);

  useEffect(() => {
    const fetchSettings = async () => {
      try {
        const res = await settingsAPI.getPublic();
        setSettings((prev) => ({ ...prev, ...res.data }));
      } catch {
        // keep defaults
      }
    };
    fetchSettings();
  }, []);

  useEffect(() => {
    const fetchReviews = async () => {
      if (!settings.enablePublicReviews) {
        setReviews([]);
        setIsLoading(false);
        return;
      }
      setIsLoading(true);
      try {
        const response = await feedbackAPI.getApproved();
        setReviews(response.data ?? []);
      } catch (error) {
        console.error('Failed to fetch reviews:', error);
        setReviews([]);
      } finally {
        setIsLoading(false);
      }
    };

    fetchReviews();
  }, [settings.enablePublicReviews]);

  const minimumRating = settings.minimumRatingToShow ?? 1;

  // Filter and sort reviews
  const filteredReviews = useMemo(() => {
    let result = [...reviews];

    // Apply minimum rating from settings
    result = result.filter((review) => review.rating >= minimumRating);

    // Filter by rating
    if (filterRating > 0) {
      result = result.filter((review) => review.rating === filterRating);
    }

    // Filter by search query
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase();
      const text = (r) => (r.message || r.comment || '').toLowerCase();
      result = result.filter(
        (review) =>
          (review.name || '').toLowerCase().includes(query) ||
          text(review).includes(query)
      );
    }

    // Sort
    result.sort((a, b) => {
      if (sortBy === 'date') {
        const dateA = new Date(a.created_at || a.date);
        const dateB = new Date(b.created_at || b.date);
        return sortOrder === 'desc' ? dateB - dateA : dateA - dateB;
      } else {
        return sortOrder === 'desc' ? b.rating - a.rating : a.rating - b.rating;
      }
    });

    return result;
  }, [reviews, sortBy, sortOrder, filterRating, searchQuery, minimumRating]);

  const toggleSortOrder = () => {
    setSortOrder((prev) => (prev === 'desc' ? 'asc' : 'desc'));
  };

  const reviewsAboveMin = reviews.filter((r) => r.rating >= minimumRating);
  const avgRating = reviewsAboveMin.length > 0 
    ? (reviewsAboveMin.reduce((sum, r) => sum + r.rating, 0) / reviewsAboveMin.length).toFixed(1) 
    : '0.0';
  const ratingCounts = [5, 4, 3, 2, 1].map((star) => ({
    star,
    count: reviewsAboveMin.filter((r) => r.rating === star).length,
    percentage: reviewsAboveMin.length > 0 
      ? (reviewsAboveMin.filter((r) => r.rating === star).length / reviewsAboveMin.length) * 100 
      : 0,
  }));

  const showRatingsBreakdown = settings.showRatingsBreakdown !== false;

  return (
    <div className="min-h-screen bg-neutral-offWhite py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-3xl md:text-4xl font-bold text-primary-dark mb-4">
            Customer Reviews
          </h1>
          <p className="text-neutral-slate text-lg max-w-2xl mx-auto">
            Read what our customers have to say about their experiences
          </p>
        </div>

        {!settings.enablePublicReviews ? (
          <div className="card text-center py-16">
            <MessageSquare className="w-16 h-16 text-neutral-lightGray mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-primary-dark mb-2">Reviews Not Displayed</h3>
            <p className="text-neutral-slate">Public reviews are currently disabled by the administrator.</p>
          </div>
        ) : (
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Sidebar - Stats & Filters (only when showRatingsBreakdown is true) */}
          {showRatingsBreakdown && (
          <div className="lg:col-span-1 space-y-6">
            {/* Rating Summary */}
            <div className="card">
              <h3 className="font-semibold text-primary-dark mb-4">Rating Summary</h3>
              <div className="text-center mb-4">
                <div className="text-5xl font-bold text-primary-dark">{avgRating}</div>
                <StarRating rating={Math.round(parseFloat(avgRating))} readonly size="md" />
                <p className="text-neutral-slate text-sm mt-1">
                  Based on {reviewsAboveMin.length} reviews
                </p>
              </div>
              
              {/* Rating Breakdown */}
              <div className="space-y-2">
                {ratingCounts.map(({ star, count, percentage }) => (
                  <button
                    key={star}
                    onClick={() => setFilterRating(filterRating === star ? 0 : star)}
                    className={`w-full flex items-center gap-2 p-2 rounded-lg transition-colors ${
                      filterRating === star
                        ? 'bg-primary-orange/10'
                        : 'hover:bg-neutral-lightGray/50'
                    }`}
                  >
                    <span className="text-sm text-neutral-slate w-8">{star}★</span>
                    <div className="flex-grow h-2 bg-neutral-lightGray rounded-full overflow-hidden">
                      <div
                        className="h-full bg-primary-orange rounded-full transition-all"
                        style={{ width: `${percentage}%` }}
                      />
                    </div>
                    <span className="text-sm text-neutral-slate w-8">{count}</span>
                  </button>
                ))}
              </div>

              {filterRating > 0 && (
                <button
                  onClick={() => setFilterRating(0)}
                  className="w-full mt-4 text-sm text-primary-orange hover:text-primary-dark transition-colors"
                >
                  Clear filter
                </button>
              )}
            </div>
          </div>
          )}

          {/* Main Content - Reviews List */}
          <div className={showRatingsBreakdown ? 'lg:col-span-3 space-y-6' : 'lg:col-span-4 space-y-6'}>
            {isLoading ? (
              <div className="card flex items-center justify-center py-16">
                <Loader2 className="w-8 h-8 animate-spin text-primary-orange" />
              </div>
            ) : reviews.length === 0 ? (
              <div className="card text-center py-16">
                <MessageSquare className="w-16 h-16 text-neutral-lightGray mx-auto mb-4" />
                <h3 className="text-xl font-semibold text-primary-dark mb-2">No Reviews Yet</h3>
                <p className="text-neutral-slate">Be the first to share your experience!</p>
              </div>
            ) : (
              <>
                {/* Controls */}
                <div className="card">
              <div className="flex flex-col sm:flex-row gap-4 justify-between items-start sm:items-center">
                {/* Search */}
                <div className="relative flex-grow max-w-md">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-neutral-slate" />
                  <input
                    type="text"
                    placeholder="Search reviews..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full pl-10 pr-4 py-2 border border-neutral-lightGray rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-dark focus:border-transparent"
                  />
                </div>

                {/* Sort Controls */}
                <div className="flex items-center gap-2">
                  <Filter className="w-5 h-5 text-neutral-slate" />
                  <select
                    value={sortBy}
                    onChange={(e) => setSortBy(e.target.value)}
                    className="px-3 py-2 border border-neutral-lightGray rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-dark bg-white"
                  >
                    <option value="date">Sort by Date</option>
                    <option value="rating">Sort by Rating</option>
                  </select>
                  <button
                    onClick={toggleSortOrder}
                    className="p-2 border border-neutral-lightGray rounded-lg hover:bg-neutral-lightGray transition-colors"
                    title={`Order: ${sortOrder === 'desc' ? 'Descending' : 'Ascending'}`}
                  >
                    <ArrowUpDown className="w-5 h-5 text-neutral-slate" />
                  </button>
                </div>
              </div>
            </div>

            {/* Reviews */}
            {filteredReviews.length === 0 ? (
              <div className="card text-center py-12">
                <p className="text-neutral-slate text-lg">No reviews found matching your criteria.</p>
              </div>
            ) : (
              <div className="space-y-4">
                {filteredReviews.map((review) => (
                  <div key={review.id} className="card">
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-4">
                      <div className="flex items-center gap-3">
                        <div className="w-12 h-12 bg-primary-orange/20 rounded-full flex items-center justify-center">
                          <span className="text-primary-orange font-semibold text-lg">
                            {review.name ? review.name.charAt(0) : 'A'}
                          </span>
                        </div>
                        <div>
                          <h4 className="font-semibold text-primary-dark">{review.name || 'Anonymous'}</h4>
                          <StarRating rating={review.rating} readonly size="sm" />
                        </div>
                      </div>
                      <div className="flex items-center gap-2 text-neutral-slate text-sm">
                        <Calendar className="w-4 h-4" />
                        {new Date(review.created_at || review.date).toLocaleDateString('en-US', {
                          month: 'long',
                          day: 'numeric',
                          year: 'numeric',
                        })}
                      </div>
                    </div>
                    <p className="text-neutral-darkGray leading-relaxed">
                      "{review.message || review.comment}"
                    </p>
                  </div>
                ))}
              </div>
            )}

            {/* Results count */}
            {!isLoading && reviews.length > 0 && (
              <p className="text-center text-neutral-slate text-sm">
                Showing {filteredReviews.length} of {reviewsAboveMin.length} reviews
                {minimumRating > 1 && ` (rating ${minimumRating}+ only)`}
              </p>
            )}
              </>
            )}
          </div>
        </div>
        )}
      </div>
    </div>
  );
};

export default PublicReviews;
