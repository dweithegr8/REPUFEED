import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Search, Star, MessageSquare, TrendingUp, Users, ArrowRight, Loader2 } from 'lucide-react';
import StarRating from '../../components/common/StarRating';
import { feedbackAPI, settingsAPI } from '../../services/api';

const Home = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [publicSettings, setPublicSettings] = useState({
    enablePublicReviews: true,
    minimumRatingToShow: 1,
  });

  const [stats, setStats] = useState({
    avgRating: 0,
    totalReviews: 0,
    totalUsers: 0,
    responseRate: 0,
  });

  const [recentReviews, setRecentReviews] = useState([]);

  useEffect(() => {
    const fetchSettings = async () => {
      try {
        const res = await settingsAPI.getPublic();
        setPublicSettings((prev) => ({ ...prev, ...res.data }));
      } catch {
        // keep defaults
      }
    };
    fetchSettings();
  }, []);

  // Fetch data on component mount (stats + recent approved reviews from feedback)
  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
      try {
        const [statsResponse, reviewsResponse] = await Promise.all([
          feedbackAPI.getStats(),
          publicSettings.enablePublicReviews
            ? feedbackAPI.getApproved({ limit: 6, sort: 'date', order: 'desc' })
            : Promise.resolve({ data: [] }),
        ]);
        const data = statsResponse.data || {};
        setStats({
          avgRating: data.avgRating ?? 0,
          totalReviews: data.totalReviews ?? data.approvedReviews ?? 0,
          totalUsers: data.totalUsers ?? data.totalFeedback ?? 0,
          responseRate: data.responseRate ?? 0,
        });
        setRecentReviews(reviewsResponse.data ?? []);
      } catch (error) {
        console.error('Failed to fetch data:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, [publicSettings.enablePublicReviews]);

  const handleSearch = (e) => {
    e.preventDefault();
    // TODO: Implement search functionality with API
    console.log('Searching for:', searchQuery);
  };

  return (
    <div className="bg-neutral-offWhite">
      {/* Hero Section */}
      <section className="relative overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 lg:py-24">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            {/* Left Content */}
            <div className="space-y-8">
              <div className="space-y-4">
                <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-primary-dark leading-tight">
                  Customer Feedback & Reputation Management System
                </h1>
                <p className="text-lg md:text-xl text-neutral-slate max-w-xl">
                  Collect, manage, and showcase authentic customer reviews to build trust 
                  and grow your business reputation effortlessly.
                </p>
              </div>

              {/* Search Bar */}
              <form onSubmit={handleSearch} className="relative max-w-lg">
                <div className="flex shadow-card rounded-lg overflow-hidden">
                  <div className="relative flex-grow">
                    <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-neutral-slate" />
                    <input
                      type="text"
                      placeholder="Search reviews or businesses..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="w-full pl-12 pr-4 py-4 border-0 focus:outline-none focus:ring-0 text-primary-dark placeholder-neutral-slate"
                    />
                  </div>
                  <button
                    type="submit"
                    className="bg-primary-dark text-white px-6 py-4 font-semibold hover:opacity-90 transition-opacity duration-200 flex items-center gap-2"
                  >
                    <span className="hidden sm:inline">Search</span>
                    <Search className="w-5 h-5 sm:hidden" />
                  </button>
                </div>
              </form>

              {/* Quick Stats */}
              <div className="flex flex-wrap gap-6">
                <div className="flex items-center gap-2">
                  <div className="flex items-center gap-1">
                    <Star className="w-5 h-5 fill-primary-orange text-primary-orange" />
                    <span className="text-2xl font-bold text-primary-dark">
                      {isLoading ? '-' : (stats.avgRating || '-')}
                    </span>
                  </div>
                  <span className="text-neutral-slate">Avg Rating</span>
                </div>
                <div className="flex items-center gap-2">
                  <MessageSquare className="w-5 h-5 text-primary-orange" />
                  <span className="text-2xl font-bold text-primary-dark">
                    {isLoading ? '-' : stats.totalReviews.toLocaleString()}
                  </span>
                  <span className="text-neutral-slate">Total Reviews</span>
                </div>
              </div>

              {/* CTA Button */}
              <Link
                to="/submit-feedback"
                className="inline-flex items-center gap-2 bg-primary-orange text-white px-8 py-4 rounded-lg font-semibold hover:opacity-90 transition-opacity duration-200 shadow-lg"
              >
                Submit Feedback
                <ArrowRight className="w-5 h-5" />
              </Link>
            </div>

            {/* Right Content - Vector Illustration */}
            <div className="hidden lg:block relative">
              <div className="relative w-full aspect-square max-w-lg mx-auto">
                {/* Abstract shapes for illustration */}
                <div className="absolute top-0 right-0 w-64 h-64 bg-primary-orange/10 rounded-full blur-3xl"></div>
                <div className="absolute bottom-0 left-0 w-48 h-48 bg-primary-dark/10 rounded-full blur-3xl"></div>
                
                {/* Main illustration container */}
                <div className="relative bg-white rounded-3xl shadow-card-hover p-8 transform rotate-3 hover:rotate-0 transition-transform duration-500">
                  <div className="space-y-6">
                    {/* Illustration elements */}
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 bg-primary-orange/20 rounded-full flex items-center justify-center">
                        <Star className="w-6 h-6 text-primary-orange" />
                      </div>
                      <div className="flex-grow">
                        <div className="h-3 bg-neutral-lightGray rounded-full w-3/4"></div>
                        <div className="h-2 bg-neutral-lightGray/50 rounded-full w-1/2 mt-2"></div>
                      </div>
                    </div>
                    
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 bg-primary-dark/20 rounded-full flex items-center justify-center">
                        <MessageSquare className="w-6 h-6 text-primary-dark" />
                      </div>
                      <div className="flex-grow">
                        <div className="h-3 bg-neutral-lightGray rounded-full w-full"></div>
                        <div className="h-2 bg-neutral-lightGray/50 rounded-full w-2/3 mt-2"></div>
                      </div>
                    </div>
                    
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 bg-primary-orange/20 rounded-full flex items-center justify-center">
                        <TrendingUp className="w-6 h-6 text-primary-orange" />
                      </div>
                      <div className="flex-grow">
                        <div className="h-3 bg-neutral-lightGray rounded-full w-5/6"></div>
                        <div className="h-2 bg-neutral-lightGray/50 rounded-full w-1/3 mt-2"></div>
                      </div>
                    </div>

                    {/* Star ratings display */}
                    <div className="pt-4 border-t border-neutral-lightGray">
                      <div className="flex justify-between items-center">
                        <StarRating rating={Math.round(stats.avgRating) || 0} readonly size="sm" />
                        <span className="text-sm text-neutral-slate">{stats.totalReviews} reviews</span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Floating badge */}
                <div className="absolute -bottom-4 -left-4 bg-primary-dark text-white px-4 py-2 rounded-xl shadow-lg">
                  <div className="flex items-center gap-2">
                    <Users className="w-4 h-4" />
                    <span className="text-sm font-medium">
                      {isLoading ? '...' : `${stats.totalUsers.toLocaleString()} Users`}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="bg-white py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {isLoading ? (
            <div className="flex items-center justify-center py-8">
              <Loader2 className="w-8 h-8 animate-spin text-primary-orange" />
            </div>
          ) : (
            <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
              <div className="text-center">
                <div className="flex items-center justify-center gap-2 mb-2">
                  <Star className="w-8 h-8 fill-primary-orange text-primary-orange" />
                  <span className="text-4xl font-bold text-primary-dark">{stats.avgRating || '-'}</span>
                </div>
                <p className="text-neutral-slate font-medium">Average Rating</p>
              </div>
              
              <div className="text-center">
                <div className="flex items-center justify-center gap-2 mb-2">
                  <MessageSquare className="w-8 h-8 text-primary-dark" />
                  <span className="text-4xl font-bold text-primary-dark">{stats.totalReviews.toLocaleString()}</span>
                </div>
                <p className="text-neutral-slate font-medium">Total Reviews</p>
              </div>
              
              <div className="text-center">
                <div className="flex items-center justify-center gap-2 mb-2">
                  <Users className="w-8 h-8 text-primary-orange" />
                  <span className="text-4xl font-bold text-primary-dark">{stats.totalUsers.toLocaleString()}</span>
                </div>
                <p className="text-neutral-slate font-medium">Happy Customers</p>
              </div>
              
              <div className="text-center">
                <div className="flex items-center justify-center gap-2 mb-2">
                  <TrendingUp className="w-8 h-8 text-primary-dark" />
                  <span className="text-4xl font-bold text-primary-dark">{stats.responseRate}%</span>
                </div>
                <p className="text-neutral-slate font-medium">Response Rate</p>
              </div>
            </div>
          )}
        </div>
      </section>

      {/* Recent Reviews Section */}
      <section className="py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-primary-dark mb-4">
              Recent Customer Reviews
            </h2>
            <p className="text-neutral-slate text-lg max-w-2xl mx-auto">
              See what our customers are saying about their experiences
            </p>
          </div>

          {isLoading ? (
            <div className="flex items-center justify-center py-12">
              <Loader2 className="w-8 h-8 animate-spin text-primary-orange" />
            </div>
          ) : !publicSettings.enablePublicReviews ? (
            <div className="text-center py-12">
              <MessageSquare className="w-16 h-16 text-neutral-lightGray mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-primary-dark mb-2">Reviews Not Displayed</h3>
              <p className="text-neutral-slate">Public reviews are currently disabled.</p>
            </div>
          ) : recentReviews.length === 0 ? (
            <div className="text-center py-12">
              <MessageSquare className="w-16 h-16 text-neutral-lightGray mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-primary-dark mb-2">No Reviews Yet</h3>
              <p className="text-neutral-slate mb-6">Be the first to share your experience!</p>
              <Link
                to="/submit-feedback"
                className="inline-flex items-center gap-2 bg-primary-orange text-white px-6 py-3 rounded-lg font-semibold hover:opacity-90 transition-opacity"
              >
                Submit Feedback
                <ArrowRight className="w-5 h-5" />
              </Link>
            </div>
          ) : (
            <>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                {recentReviews
                  .filter((review) => review.rating >= (publicSettings.minimumRatingToShow ?? 1))
                  .slice(0, 3)
                  .map((review) => (
                  <div key={review.id} className="card">
                    <div className="flex items-center justify-between mb-4">
                      <StarRating rating={review.rating} readonly size="sm" />
                      <span className="text-sm text-neutral-slate">
                        {new Date(review.date || review.created_at).toLocaleDateString('en-US', {
                          month: 'short',
                          day: 'numeric',
                          year: 'numeric',
                        })}
                      </span>
                    </div>
                    <p className="text-neutral-darkGray mb-4 line-clamp-3">
                      "{review.comment || review.message}"
                    </p>
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-primary-orange/20 rounded-full flex items-center justify-center">
                        <span className="text-primary-orange font-semibold">
                          {review.name ? review.name.charAt(0) : 'A'}
                        </span>
                      </div>
                      <span className="font-medium text-primary-dark">{review.name || 'Anonymous'}</span>
                    </div>
                  </div>
                ))}
              </div>

              <div className="text-center mt-12">
                <Link
                  to="/reviews"
                  className="inline-flex items-center gap-2 text-primary-dark font-semibold hover:text-primary-orange transition-colors duration-200"
                >
                  View All Reviews
                  <ArrowRight className="w-5 h-5" />
                </Link>
              </div>
            </>
          )}
        </div>
      </section>

      {/* CTA Section */}
      <section className="bg-primary-dark py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
            Ready to Share Your Experience?
          </h2>
          <p className="text-white/80 text-lg max-w-2xl mx-auto mb-8">
            Your feedback helps businesses improve and helps other customers make informed decisions.
          </p>
          <Link
            to="/submit-feedback"
            className="inline-flex items-center gap-2 bg-primary-orange text-white px-8 py-4 rounded-lg font-semibold hover:opacity-90 transition-opacity duration-200"
          >
            Submit Your Feedback
            <ArrowRight className="w-5 h-5" />
          </Link>
        </div>
      </section>
    </div>
  );
};

export default Home;
