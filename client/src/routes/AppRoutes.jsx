import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import MainLayout from '../layouts/MainLayout';
import AdminLayout from '../layouts/AdminLayout';
import ProtectedRoute from '../components/admin/ProtectedRoute';

// Public Pages
import Home from '../pages/Home/Home';
import About from '../pages/About/About';

import Capabilities from '../pages/Capabilities/Capabilities';
import CapabilityDetails from '../pages/Capabilities/CapabilityDetails';

import Industries from '../pages/Industries/Industries';
import IndustryDetails from '../pages/Industries/IndustryDetails';

import International from '../pages/International/International';
import TechnologySecurity from '../pages/International/TechnologySecurity';
import Workforce from '../pages/International/Workforce';
import SecurityInfrastructure from '../pages/International/SecurityInfrastructure';
import HRSolutions from '../pages/International/HRSolutions';
import HRAdvisory from '../pages/International/HRAdvisory';
import PayrollCompliance from '../pages/International/PayrollCompliance';
import HRMS from '../pages/International/HRMS';
import WorkforceDeployment from '../pages/International/WorkforceDeployment';

import Technology from '../pages/Technology/Technology';
import TechnologyDetails from '../pages/Technology/TechnologyDetails';

import CaseStudies from '../pages/CaseStudies/CaseStudies';
import CaseStudyDetails from '../pages/CaseStudies/CaseStudyDetails';

import Contact from '../pages/Contact/Contact';
import ThankYou from '../pages/Contact/ThankYou';

import PrivacyPolicy from '../pages/Legal/PrivacyPolicy';
import Terms from '../pages/Legal/Terms';
import CookiePolicy from '../pages/Legal/CookiePolicy';
import Disclaimer from '../pages/Legal/Disclaimer';

import NotFound from '../components/common/NotFound';

// Admin CMS Pages
import AdminLogin from '../pages/Admin/AdminLogin';
import AdminDashboard from '../pages/Admin/AdminDashboard';
import AdminPages from '../pages/Admin/AdminPages';
import AdminMedia from '../pages/Admin/AdminMedia';
import AdminSubmissions from '../pages/Admin/AdminSubmissions';
import AdminUsers from '../pages/Admin/AdminUsers';
import AdminSettings from '../pages/Admin/AdminSettings';
import { useAuth } from '../context/AuthContext';

const AdminRedirect = () => {
  const { isAuthenticated, loading } = useAuth();
  if (loading) return null;
  return <Navigate to={isAuthenticated ? '/admin/dashboard' : '/admin/login'} replace />;
};

export const AppRoutes = () => {
  return (
    <Routes>
      {/* ── Public Site Routes ── */}
      <Route path="/" element={<MainLayout />}>
        <Route index element={<Home />} />
        <Route path="about" element={<About />} />

        {/* Capabilities */}
        <Route path="capabilities" element={<Capabilities />} />
        <Route path="capabilities/:slug" element={<CapabilityDetails />} />

        {/* Industries */}
        <Route path="industries" element={<Industries />} />
        <Route path="industries/:slug" element={<IndustryDetails />} />

        {/* International */}
        <Route path="international" element={<International />} />
        <Route path="international/technology-security" element={<TechnologySecurity />} />
        <Route path="international/workforce" element={<Workforce />} />
        <Route path="international/security-infrastructure" element={<SecurityInfrastructure />} />
        <Route path="international/hr-solutions" element={<HRSolutions />} />
        <Route path="international/hr-advisory" element={<HRAdvisory />} />
        <Route path="international/payroll-compliance" element={<PayrollCompliance />} />
        <Route path="international/hrms" element={<HRMS />} />
        <Route path="international/workforce-deployment" element={<WorkforceDeployment />} />

        {/* Contact */}
        <Route path="contact" element={<Contact />} />
        <Route path="thank-you" element={<ThankYou />} />

        {/* Legal Pages */}
        <Route path="privacy-policy" element={<PrivacyPolicy />} />
        <Route path="terms" element={<Terms />} />
        <Route path="cookie-policy" element={<CookiePolicy />} />
        <Route path="disclaimer" element={<Disclaimer />} />

        {/* Fallback 404 */}
        <Route path="*" element={<NotFound />} />
      </Route>

      {/* ── Admin CMS Routes ── */}

      {/* Login (public) */}
      <Route path="/admin/login" element={<AdminLogin />} />

      {/* Redirect /admin → /admin/dashboard if authenticated, else /admin/login */}
      <Route path="/admin" element={<AdminRedirect />} />

      {/* Protected CMS routes */}
      <Route element={<ProtectedRoute />}>
        <Route path="/admin" element={<AdminLayout />}>
          <Route path="dashboard" element={<AdminDashboard />} />
          <Route path="pages" element={<AdminPages />} />
          <Route path="media" element={<AdminMedia />} />
          <Route path="submissions" element={<AdminSubmissions />} />
          <Route path="users" element={<AdminUsers />} />
          <Route path="settings" element={<AdminSettings />} />
          {/* Default admin route */}
          <Route index element={<Navigate to="dashboard" replace />} />
        </Route>
      </Route>
    </Routes>
  );
};

export default AppRoutes;
