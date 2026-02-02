import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';

// User Portal Pages
import Home from './pages/user/Home';
import HowItWorks from './pages/user/HowItWorks';
import FeedbackSubmission from './pages/user/FeedbackSubmission';
import PublicReviews from './pages/user/PublicReviews';

// Admin Portal Pages
import AdminLogin from './pages/admin/AdminLogin';
import Dashboard from './pages/admin/Dashboard';
import FeedbackManagement from './pages/admin/FeedbackManagement';
import Settings from './pages/admin/Settings';

// Layouts
import UserLayout from './layouts/UserLayout';
import AdminLayout from './layouts/AdminLayout';

function App() {
  return (
    <Router>
      <Routes>
        {/* User Portal Routes */}
        <Route path="/" element={<UserLayout />}>
          <Route index element={<Home />} />
          <Route path="how-it-works" element={<HowItWorks />} />
          <Route path="submit-feedback" element={<FeedbackSubmission />} />
          <Route path="reviews" element={<PublicReviews />} />
        </Route>

        {/* Admin Portal Routes */}
        <Route path="/admin/login" element={<AdminLogin />} />
        <Route path="/admin" element={<AdminLayout />}>
          <Route path="dashboard" element={<Dashboard />} />
          <Route path="feedback" element={<FeedbackManagement />} />
          <Route path="settings" element={<Settings />} />
        </Route>
      </Routes>
    </Router>
  );
}

export default App;
