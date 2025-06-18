import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Suspense, lazy } from 'react';
import Header from './components/Header';
import Footer from './components/Footer';
import ScrollToTop from './components/ScrollToTop';
import VideoPreloader from './components/VideoPreloader';

// Lazy-loaded pages for better performance
const Home = lazy(() => import('./pages/Home'));
const Projects = lazy(() => import('./pages/Projects'));
const LiveCampaigns = lazy(() => import('./pages/LiveCampaigns'));
const CompletedProjects = lazy(() => import('./pages/CompletedProjects'));
const CompletedProjectDetail = lazy(() => import('./pages/CompletedProjectDetail'));
const HowItWorks = lazy(() => import('./components/HowItWorks'));
const Submit = lazy(() => import('./pages/Submit'));
const Submissions = lazy(() => import('./pages/Submissions'));
const SubmissionDetail = lazy(() => import('./pages/SubmissionDetail'));
const Dashboard = lazy(() => import('./pages/Dashboard'));
const TreasureHoard = lazy(() => import('./pages/TreasureHoard'));
const Settings = lazy(() => import('./pages/Settings'));
const BuyCoins = lazy(() => import('./pages/BuyCoins'));
const CampaignDetail = lazy(() => import('./pages/CampaignDetail'));
const AdminDashboard = lazy(() => import('./pages/AdminDashboard'));
const UserDetail = lazy(() => import('./pages/UserDetail'));
const Help = lazy(() => import('./pages/Help'));
const PrivacyPolicy = lazy(() => import('./pages/PrivacyPolicy'));
const TermsOfService = lazy(() => import('./pages/TermsOfService'));
const CookiePolicy = lazy(() => import('./pages/CookiePolicy'));
const Sitemap = lazy(() => import('./pages/Sitemap'));

// Loading fallback
const LoadingFallback = () => (
  <div className="min-h-screen flex items-center justify-center">
    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
  </div>
);

function App() {
  return (
    <>
      <ScrollToTop />
      <VideoPreloader />
      <Header />
      <Suspense fallback={<LoadingFallback />}>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/projects" element={<Projects />} />
          <Route path="/live-campaigns" element={<LiveCampaigns />} />
          <Route path="/completed-projects" element={<CompletedProjects />} />
          <Route path="/completed-project/:id" element={<CompletedProjectDetail />} />
          <Route path="/how-it-works" element={<HowItWorks />} />
          <Route path="/submit" element={<Submit />} />
          <Route path="/submissions" element={<Submissions />} />
          <Route path="/submission/:id" element={<SubmissionDetail />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/treasure-hoard" element={<TreasureHoard />} />
          <Route path="/settings" element={<Settings />} />
          <Route path="/buy-coins" element={<BuyCoins />} />
          <Route path="/campaign/:id" element={<CampaignDetail />} />
          <Route path="/admin" element={<AdminDashboard />} />
          <Route path="/admin/user/:id" element={<UserDetail />} />
          <Route path="/help" element={<Help />} />
          <Route path="/privacy-policy" element={<PrivacyPolicy />} />
          <Route path="/terms-of-service" element={<TermsOfService />} />
          <Route path="/cookie-policy" element={<CookiePolicy />} />
          <Route path="/sitemap" element={<Sitemap />} />
        </Routes>
      </Suspense>
      <Footer />
    </>
  );
}

export default App;