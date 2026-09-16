import React, { useState, useEffect } from 'react';
import Header from './components/Header';
import Sidebar from './components/Sidebar';
import Toast from './components/Toast';
import LoginPage from './views/LoginPage';
import Home from './views/Home';
import HeaderEditor from './views/HeaderEditor';
import MarqueeEditor from './views/MarqueeEditor';
import About from './views/About';
import ContactEditor from './views/ContactEditor';
import ContactMessages from './views/ContactMessages';
import DashboardView from './views/DashboardView';
import UserManagementView from './views/UserManagementView';
import SolutionsEditor from './views/SolutionsEditor';
import IndustriesEditor from './views/IndustriesEditor';
import FooterEditor from './views/FooterEditor';
import MediaLibrary from './views/MediaLibrary';
import SettingsView from './views/SettingsView';
import { ChevronRight } from 'lucide-react';
import { logoutUser } from './services/api';

const SECTION_LABELS = {
  dashboard: ['Dashboard', 'Overview'],
  'website-home': ['Website', 'Home — Hero & Sections'],
  'website-marquee': ['Website', 'Marquee Ticker'],
  'website-header': ['Website', 'Header & Navigation'],
  'website-about': ['Website', 'About Page'],
  'website-solution': ['Website', 'Solutions Page'],
  'website-industry': ['Website', 'Industries Page'],
  'website-users': ['Website', 'User Management'],
  'website-contact': ['Website', 'Contact Page'],
  'website-footer': ['Website', 'Footer Config'],
  enquiries: ['Enquiries', 'Form Submissions'],
  media: ['Media Library', 'Assets & Files'],
  settings: ['Settings', 'Global Configuration'],
};

export default function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [currentUser, setCurrentUser] = useState(null);
  const [activeSection, setActiveSection] = useState('dashboard');
  const [toastMessage, setToastMessage] = useState('');
  const [showLogoutModal, setShowLogoutModal] = useState(false);
  const [isMobileSidebarOpen, setIsMobileSidebarOpen] = useState(false);

  // Restore session from localStorage
  useEffect(() => {
    const savedUser = localStorage.getItem('admin_user');
    const savedToken = localStorage.getItem('admin_token');
    if (savedUser && savedToken) {
      try {
        setCurrentUser(JSON.parse(savedUser));
        setIsAuthenticated(true);
      } catch {
        setIsAuthenticated(false);
      }
    }
  }, []);

  const showToast = (msg) => setToastMessage(msg);

  const handleLoginSuccess = (user) => {
    setCurrentUser(user);
    setIsAuthenticated(true);
    setActiveSection('dashboard');
  };

  const handleConfirmLogout = async () => {
    setShowLogoutModal(false);
    await logoutUser();
    localStorage.removeItem('admin_token');
    localStorage.removeItem('admin_user');
    setCurrentUser(null);
    setIsAuthenticated(false);
    showToast('Logged out successfully.');
  };

  const breadcrumbs = SECTION_LABELS[activeSection] || ['Dashboard', 'Overview'];

  // Render login page
  if (!isAuthenticated) {
    return (
      <>
        <LoginPage onLoginSuccess={handleLoginSuccess} onShowToast={showToast} />
        <Toast message={toastMessage} onClose={() => setToastMessage('')} />
      </>
    );
  }

  return (
    <div className="admin-layout">
      {/* Top Header */}
      <Header
        onShowToast={showToast}
        currentUser={currentUser}
        onOpenAuthModal={() => setIsAuthenticated(false)}
        onToggleMobileSidebar={() => setIsMobileSidebarOpen((v) => !v)}
        isMobileOpen={isMobileSidebarOpen}
      />

      {/* Body: Sidebar + Content */}
      <div className="admin-body">
        <Sidebar
          activeSection={activeSection}
          setActiveSection={setActiveSection}
          onLogout={() => setShowLogoutModal(true)}
          isMobileOpen={isMobileSidebarOpen}
          onCloseMobile={() => setIsMobileSidebarOpen(false)}
        />

        <main className="admin-main">
          {/* Breadcrumb */}
          <div className="breadcrumbs">
            <span className="breadcrumb-item">{breadcrumbs[0]}</span>
            <ChevronRight size={14} />
            <span className="breadcrumb-item active">{breadcrumbs[1]}</span>
          </div>

          {/* Views */}
          {activeSection === 'dashboard' && (
            <DashboardView onSelectSection={setActiveSection} />
          )}
          {activeSection === 'website-home' && <Home onShowToast={showToast} />}
          {activeSection === 'website-marquee' && <MarqueeEditor onShowToast={showToast} />}
          {activeSection === 'website-header' && <HeaderEditor onShowToast={showToast} />}
          {activeSection === 'website-users' && <UserManagementView onShowToast={showToast} />}
          {activeSection === 'website-about' && <About onShowToast={showToast} />}
          {activeSection === 'website-solution' && <SolutionsEditor onShowToast={showToast} />}
          {activeSection === 'website-industry' && <IndustriesEditor onShowToast={showToast} />}
          {activeSection === 'website-contact' && <ContactEditor onShowToast={showToast} />}
          {activeSection === 'website-footer' && <FooterEditor onShowToast={showToast} />}
          {activeSection === 'enquiries' && <ContactMessages onShowToast={showToast} />}
          {activeSection === 'media' && <MediaLibrary onShowToast={showToast} />}
          {activeSection === 'settings' && <SettingsView onShowToast={showToast} />}
        </main>
      </div>

      {/* Toast */}
      <Toast message={toastMessage} onClose={() => setToastMessage('')} />

      {/* Logout Modal */}
      {showLogoutModal && (
        <div style={{
          position: 'fixed', inset: 0,
          backgroundColor: 'rgba(0,0,0,0.65)',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          zIndex: 1000,
        }}>
          <div className="content-card" style={{ width: '380px', maxWidth: '90vw', padding: '1.75rem' }}>
            <h3 style={{ marginBottom: '0.5rem', fontWeight: 700, fontSize: '1.05rem' }}>Confirm Logout</h3>
            <p style={{ fontSize: '0.875rem', color: 'var(--text-muted)', marginBottom: '1.5rem' }}>
              Are you sure you want to end your current admin session?
            </p>
            <div style={{ display: 'flex', gap: '0.75rem', justifyContent: 'flex-end' }}>
              <button className="file-upload-btn" onClick={() => setShowLogoutModal(false)}>
                Cancel
              </button>
              <button
                className="btn-primary"
                style={{ backgroundColor: 'var(--danger)', margin: 0, padding: '0.5rem 1.25rem' }}
                onClick={handleConfirmLogout}
              >
                Logout
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
