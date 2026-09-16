import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
import Header from './components/Header';
import Footer from './components/Footer';
import EnquiryModal from './components/EnquiryModal';

import HomePage from './pages/HomePage';
import AboutPage from './pages/AboutPage';
import SolutionsPage from './pages/SolutionsPage';
import SolutionDetailPage from './pages/SolutionDetailPage';
import IndustriesPage from './pages/IndustriesPage';
import IndustryDetailPage from './pages/IndustryDetailPage';
import ProductsPage from './pages/ProductsPage';
import ContactPage from './pages/ContactPage';
import PrivacyPolicyPage from './pages/PrivacyPolicyPage';
import TermsPage from './pages/TermsPage';

// Scroll to top helper
function ScrollToTop() {
  const { pathname } = useLocation();
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);
  return null;
}

export default function App() {
  const [enquiryOpen, setEnquiryOpen] = useState(false);
  const [enquirySubject, setEnquirySubject] = useState('');

  const handleOpenEnquiry = (subject = 'General Security Inquiry') => {
    setEnquirySubject(subject);
    setEnquiryOpen(true);
  };

  const handleCloseEnquiry = () => {
    setEnquiryOpen(false);
  };

  return (
    <Router>
      <ScrollToTop />
      <div className="flex flex-col min-h-screen bg-slate-950 text-slate-100 font-sans selection:bg-blue-600 selection:text-white">
        <Header onOpenEnquiry={handleOpenEnquiry} />

        <main className="flex-grow">
          <Routes>
            <Route path="/" element={<HomePage onOpenEnquiry={handleOpenEnquiry} />} />
            <Route path="/about-us" element={<AboutPage onOpenEnquiry={handleOpenEnquiry} />} />
            <Route path="/solutions" element={<SolutionsPage onOpenEnquiry={handleOpenEnquiry} />} />
            <Route path="/solutions/:slug" element={<SolutionDetailPage onOpenEnquiry={handleOpenEnquiry} />} />
            <Route path="/industries" element={<IndustriesPage onOpenEnquiry={handleOpenEnquiry} />} />
            <Route path="/industries/:slug" element={<IndustryDetailPage onOpenEnquiry={handleOpenEnquiry} />} />
            <Route path="/our-products" element={<ProductsPage onOpenEnquiry={handleOpenEnquiry} />} />
            <Route path="/contact-us" element={<ContactPage />} />
            <Route path="/privacy-policy" element={<PrivacyPolicyPage />} />
            <Route path="/terms-and-conditions" element={<TermsPage />} />
            {/* Catch-all fallback */}
            <Route path="*" element={<HomePage onOpenEnquiry={handleOpenEnquiry} />} />
          </Routes>
        </main>

        <Footer />

        <EnquiryModal
          isOpen={enquiryOpen}
          onClose={handleCloseEnquiry}
          initialSubject={enquirySubject}
        />
      </div>
    </Router>
  );
}
