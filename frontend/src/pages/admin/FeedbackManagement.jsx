import { useState, useEffect } from 'react';
import { Check, X, Trash2, Eye, EyeOff, Search, Filter, Loader2, MessageSquare } from 'lucide-react';
import StarRating from '../../components/common/StarRating';
import { feedbackAPI } from '../../services/api';

const FeedbackManagement = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');
  const [isLoading, setIsLoading] = useState(true);

  // Real data state - starts empty, populated by API
  const [feedbackList, setFeedbackList] = useState([]);

  const fetchFeedback = async () => {
    setIsLoading(true);
    try {
      const response = await feedbackAPI.getAll();
      setFeedbackList(response.data ?? []);
    } catch (error) {
      console.error('Failed to fetch feedback:', error);
      setFeedbackList([]);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchFeedback();
  }, []);

  // Filter feedback based on search and status
  const filteredFeedback = feedbackList.filter((feedback) => {
    const name = feedback.name || '';
    const text = feedback.message || feedback.comment || '';
    const matchesSearch =
      name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      text.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus = filterStatus === 'all' || feedback.status === filterStatus;
    return matchesSearch && matchesStatus;
  });

  // Action handlers
  const handleApprove = async (id) => {
    try {
      await feedbackAPI.updateStatus(id, 'approved');
      setFeedbackList((prev) =>
        prev.map((f) => (f.id === id ? { ...f, status: 'approved', is_approved: true } : f))
      );
    } catch (error) {
      console.error('Failed to approve:', error);
    }
  };

  const handleHide = async (id) => {
    try {
      await feedbackAPI.updateStatus(id, 'pending');
      setFeedbackList((prev) =>
        prev.map((f) => (f.id === id ? { ...f, status: 'pending', is_approved: false } : f))
      );
    } catch (error) {
      console.error('Failed to hide:', error);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this review?')) return;
    try {
      await feedbackAPI.delete(id);
      setFeedbackList((prev) => prev.filter((f) => f.id !== id));
    } catch (error) {
      console.error('Failed to delete:', error);
    }
  };

  const getStatusBadge = (status) => {
    const s = status || 'pending';
    const styles = {
      pending: 'bg-yellow-100 text-yellow-800',
      approved: 'bg-green-100 text-green-800',
      hidden: 'bg-neutral-lightGray text-neutral-slate',
    };
    return (
      <span className={`px-2.5 py-1 text-xs font-medium rounded-full ${styles[s] || styles.pending}`}>
        {(s).charAt(0).toUpperCase() + (s).slice(1)}
      </span>
    );
  };

  const statusCounts = {
    all: feedbackList.length,
    pending: feedbackList.filter((f) => f.status === 'pending').length,
    approved: feedbackList.filter((f) => f.status === 'approved').length,
    hidden: feedbackList.filter((f) => f.status === 'hidden').length,
  };

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div>
        <h1 className="text-2xl font-bold text-primary-dark">Feedback Management</h1>
        <p className="text-neutral-slate">Review, approve, hide, or delete customer feedback.</p>
      </div>

      {/* Filters & Search */}
      <div className="card">
        <div className="flex flex-col lg:flex-row gap-4 justify-between">
          {/* Status Tabs */}
          <div className="flex flex-wrap gap-2">
            {['all', 'pending', 'approved', 'hidden'].map((status) => (
              <button
                key={status}
                onClick={() => setFilterStatus(status)}
                className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                  filterStatus === status
                    ? 'bg-primary-dark text-white'
                    : 'bg-neutral-offWhite text-neutral-slate hover:bg-neutral-lightGray'
                }`}
              >
                {status.charAt(0).toUpperCase() + status.slice(1)}
                <span className="ml-2 text-sm opacity-75">({statusCounts[status]})</span>
              </button>
            ))}
          </div>

          {/* Search */}
          <div className="relative w-full lg:w-80">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-neutral-slate" />
            <input
              type="text"
              placeholder="Search reviews..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-neutral-lightGray rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-dark focus:border-transparent"
            />
          </div>
        </div>
      </div>

      {/* Feedback Table */}
      <div className="card overflow-hidden p-0">
        {isLoading ? (
          <div className="flex items-center justify-center py-16">
            <Loader2 className="w-8 h-8 animate-spin text-primary-orange" />
          </div>
        ) : feedbackList.length === 0 ? (
          <div className="text-center py-16">
            <MessageSquare className="w-16 h-16 text-neutral-lightGray mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-primary-dark mb-2">No Feedback Yet</h3>
            <p className="text-neutral-slate">Feedback will appear here once customers submit reviews.</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-neutral-offWhite border-b border-neutral-lightGray">
                <tr>
                  <th className="text-left px-6 py-4 text-sm font-semibold text-primary-dark">Customer</th>
                  <th className="text-left px-6 py-4 text-sm font-semibold text-primary-dark">Rating</th>
                  <th className="text-left px-6 py-4 text-sm font-semibold text-primary-dark">Feedback</th>
                  <th className="text-left px-6 py-4 text-sm font-semibold text-primary-dark">Date</th>
                  <th className="text-left px-6 py-4 text-sm font-semibold text-primary-dark">Status</th>
                  <th className="text-right px-6 py-4 text-sm font-semibold text-primary-dark">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-neutral-lightGray">
                {filteredFeedback.length === 0 ? (
                  <tr>
                    <td colSpan={6} className="px-6 py-12 text-center text-neutral-slate">
                      No feedback found matching your criteria.
                    </td>
                  </tr>
                ) : (
                  filteredFeedback.map((feedback) => (
                    <tr key={feedback.id} className="hover:bg-neutral-offWhite/50 transition-colors">
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 bg-primary-orange/20 rounded-full flex items-center justify-center flex-shrink-0">
                            <span className="text-primary-orange font-semibold">
                              {feedback.name ? feedback.name.charAt(0) : 'A'}
                            </span>
                          </div>
                          <div>
                            <p className="font-medium text-primary-dark">{feedback.name || 'Anonymous'}</p>
                            <p className="text-sm text-neutral-slate">
                              {feedback.email || 'No email provided'}
                            </p>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <StarRating rating={feedback.rating} readonly size="sm" />
                      </td>
                      <td className="px-6 py-4 max-w-xs">
                        <p className="text-neutral-darkGray text-sm truncate" title={feedback.message || feedback.comment || ''}>
                          {feedback.message || feedback.comment}
                        </p>
                      </td>
                      <td className="px-6 py-4">
                        <span className="text-sm text-neutral-slate">
                          {new Date(feedback.created_at || feedback.date).toLocaleDateString('en-US', {
                            month: 'short',
                            day: 'numeric',
                            year: 'numeric',
                          })}
                        </span>
                      </td>
                      <td className="px-6 py-4">{getStatusBadge(feedback.status)}</td>
                    <td className="px-6 py-4">
                      <div className="flex items-center justify-end gap-2">
                        {feedback.status !== 'approved' && (
                          <button
                            onClick={() => handleApprove(feedback.id)}
                            className="p-2 text-green-600 hover:bg-green-100 rounded-lg transition-colors"
                            title="Approve"
                          >
                            <Check className="w-5 h-5" />
                          </button>
                        )}
                        {feedback.status !== 'hidden' && (
                          <button
                            onClick={() => handleHide(feedback.id)}
                            className="p-2 text-neutral-slate hover:bg-neutral-lightGray rounded-lg transition-colors"
                            title="Hide"
                          >
                            <EyeOff className="w-5 h-5" />
                          </button>
                        )}
                        {feedback.status === 'hidden' && (
                          <button
                            onClick={() => handleApprove(feedback.id)}
                            className="p-2 text-primary-dark hover:bg-neutral-lightGray rounded-lg transition-colors"
                            title="Show"
                          >
                            <Eye className="w-5 h-5" />
                          </button>
                        )}
                        <button
                          onClick={() => handleDelete(feedback.id)}
                          className="p-2 text-red-600 hover:bg-red-100 rounded-lg transition-colors"
                          title="Delete"
                        >
                          <Trash2 className="w-5 h-5" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};

export default FeedbackManagement;
