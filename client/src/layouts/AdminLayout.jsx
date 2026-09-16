import React, { useState, useEffect } from 'react';
import { Outlet, Link, useLocation, useNavigate, useSearchParams } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import {
  FaThLarge, FaFolder, FaChevronDown, FaChevronUp,
  FaHome, FaWindowMaximize, FaInfoCircle, FaLightbulb,
  FaIndustry, FaGlobe, FaUsers, FaPhoneAlt, FaTh, FaCommentAlt,
  FaImages, FaCog, FaSignOutAlt, FaUpload, FaSun, FaMoon,
  FaBars, FaBolt, FaUserCircle
} from 'react-icons/fa';
import '../pages/Admin/admin.css';

export const AdminLayout = () => {
  const { user, logout } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const currentPageParam = searchParams.get('page');

  const [theme, setTheme] = useState(() => localStorage.getItem('admin_theme') || 'dark');
  const [mobileOpen, setMobileOpen] = useState(false);
  const [websiteOpen, setWebsiteOpen] = useState(true);
  const [userMenuOpen, setUserMenuOpen] = useState(false);

  useEffect(() => {
    localStorage.setItem('admin_theme', theme);
  }, [theme]);

  const toggleTheme = () => {
    setTheme((prev) => (prev === 'dark' ? 'light' : 'dark'));
  };

  const handleLogout = async () => {
    await logout();
    navigate('/admin/login', { replace: true });
  };

  const isDashboard = location.pathname === '/admin/dashboard' || location.pathname === '/admin' || location.pathname === '/admin/';
  const isEnquiries = location.pathname === '/admin/submissions';
  const isMedia = location.pathname === '/admin/media';
  const isSettings = location.pathname === '/admin/settings';
  const isUsers = location.pathname === '/admin/users';

  const isSubActive = (key) => {
    if (key === 'users') return isUsers;
    return location.pathname.includes('/admin/pages') && currentPageParam === key;
  };

  const closeMobile = () => setMobileOpen(false);

  return (
    <div className="admin-layout-root" data-theme={theme}>
      {/* Top Header Bar */}
      <header className="admin-header">
        <div className="header-left">
          <button className="mobile-menu-toggle" onClick={() => setMobileOpen(true)} title="Open menu">
            <FaBars size={18} />
          </button>
          <Link to="/admin/dashboard" className="brand-logo">
            <div className="logo-badge">
              U
              <FaBolt
                size={9}
                style={{
                  position: 'absolute',
                  bottom: '-2px',
                  right: '-2px',
                  color: 'white',
                  background: 'rgba(0,0,0,0.6)',
                  borderRadius: '50%',
                  padding: '1px'
                }}
              />
            </div>
            <span>UNISE Admin</span>
          </Link>
        </div>

        <div className="header-right">
          <label className="header-icon-btn" title="Upload Header Logo" style={{ cursor: 'pointer' }}>
            <FaUpload size={15} />
            <input
              type="file"
              accept="image/*"
              style={{ display: 'none' }}
              onChange={(e) => {
                if (e.target.files?.[0]) {
                  alert(`Selected logo: ${e.target.files[0].name}`);
                }
              }}
            />
          </label>

          <button className="header-icon-btn" title="Toggle Theme" onClick={toggleTheme}>
            {theme === 'dark' ? <FaSun size={17} /> : <FaMoon size={17} />}
          </button>

          <div style={{ position: 'relative' }}>
            <div className="user-profile" onClick={() => setUserMenuOpen((p) => !p)}>
              <div className="avatar">
                {user?.username?.charAt(0).toUpperCase() || 'S'}
              </div>
              <span className="user-name">{user?.username || 'sam'}</span>
            </div>

            {userMenuOpen && (
              <div
                className="card"
                style={{
                  position: 'absolute',
                  right: 0,
                  top: '46px',
                  width: '210px',
                  zIndex: 100,
                  padding: '0.75rem',
                  gap: '0.5rem',
                  boxShadow: 'var(--shadow-lg)'
                }}
              >
                <div style={{ paddingBottom: '0.5rem', borderBottom: '1px solid var(--border-color)' }}>
                  <p style={{ fontWeight: 600, fontSize: '0.85rem', color: 'var(--text-main)', margin: 0 }}>
                    {user?.username || 'sam'}
                  </p>
                  <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)', margin: 0 }}>
                    {user?.email || 'admin@unispark.com'}
                  </p>
                  <span style={{ fontSize: '0.7rem', color: 'var(--primary)', fontWeight: 600, textTransform: 'uppercase' }}>
                    {user?.role || 'Super Admin'}
                  </span>
                </div>
                <button
                  className="sidebar-sub-item"
                  onClick={() => {
                    setUserMenuOpen(false);
                    navigate('/admin/users');
                  }}
                  style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.8rem' }}
                >
                  <FaUserCircle size={14} /> My Profile
                </button>
                <button
                  className="sidebar-sub-item"
                  onClick={() => {
                    setUserMenuOpen(false);
                    handleLogout();
                  }}
                  style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.8rem', color: 'var(--danger)' }}
                >
                  <FaSignOutAlt size={14} /> Sign Out
                </button>
              </div>
            )}
          </div>
        </div>
      </header>

      {/* Main Admin Body */}
      <div className="admin-body">
        {/* Mobile Overlay */}
        <div
          className={`sidebar-overlay ${mobileOpen ? 'mobile-open' : ''}`}
          onClick={closeMobile}
        />

        {/* Sidebar */}
        <aside className={`admin-sidebar ${mobileOpen ? 'mobile-open' : ''}`}>
          <div className="sidebar-group">
            {/* Dashboard Button */}
            <Link
              to="/admin/dashboard"
              onClick={closeMobile}
              className={`sidebar-item ${isDashboard ? 'active' : ''}`}
            >
              <div className="sidebar-item-content">
                <FaThLarge size={16} />
                <span>Dashboard</span>
              </div>
            </Link>

            {/* Website Accordion */}
            <div>
              <button
                type="button"
                className={`sidebar-item ${location.pathname.includes('/admin/pages') ? 'active' : ''}`}
                onClick={() => setWebsiteOpen((p) => !p)}
              >
                <div className="sidebar-item-content">
                  <FaFolder size={16} />
                  <span>Website</span>
                </div>
                {websiteOpen ? <FaChevronUp size={12} /> : <FaChevronDown size={12} />}
              </button>

              {websiteOpen && (
                <div className="sidebar-sub-menu">
                  <Link
                    to="/admin/pages?page=home"
                    onClick={closeMobile}
                    className={`sidebar-sub-item ${isSubActive('home') ? 'active' : ''}`}
                  >
                    <FaHome size={13} />
                    <span>Home</span>
                  </Link>
                  <Link
                    to="/admin/pages?page=header"
                    onClick={closeMobile}
                    className={`sidebar-sub-item ${isSubActive('header') ? 'active' : ''}`}
                  >
                    <FaWindowMaximize size={13} />
                    <span>Header</span>
                  </Link>
                  <Link
                    to="/admin/pages?page=about"
                    onClick={closeMobile}
                    className={`sidebar-sub-item ${isSubActive('about') ? 'active' : ''}`}
                  >
                    <FaInfoCircle size={13} />
                    <span>About</span>
                  </Link>
                  <Link
                    to="/admin/pages?page=solutions"
                    onClick={closeMobile}
                    className={`sidebar-sub-item ${isSubActive('solutions') ? 'active' : ''}`}
                  >
                    <FaLightbulb size={13} />
                    <span>Solutions</span>
                  </Link>
                  <Link
                    to="/admin/pages?page=industries"
                    onClick={closeMobile}
                    className={`sidebar-sub-item ${isSubActive('industries') ? 'active' : ''}`}
                  >
                    <FaIndustry size={13} />
                    <span>Industries</span>
                  </Link>
                  <Link
                    to="/admin/pages?page=international"
                    onClick={closeMobile}
                    className={`sidebar-sub-item ${isSubActive('international') ? 'active' : ''}`}
                  >
                    <FaGlobe size={13} />
                    <span>International</span>
                  </Link>
                  <Link
                    to="/admin/users"
                    onClick={closeMobile}
                    className={`sidebar-sub-item ${isSubActive('users') ? 'active' : ''}`}
                  >
                    <FaUsers size={13} />
                    <span>Users</span>
                  </Link>
                  <Link
                    to="/admin/pages?page=contact"
                    onClick={closeMobile}
                    className={`sidebar-sub-item ${isSubActive('contact') ? 'active' : ''}`}
                  >
                    <FaPhoneAlt size={13} />
                    <span>Contact</span>
                  </Link>
                  <Link
                    to="/admin/pages?page=footer-seo"
                    onClick={closeMobile}
                    className={`sidebar-sub-item ${isSubActive('footer-seo') ? 'active' : ''}`}
                  >
                    <FaTh size={13} />
                    <span>Footer</span>
                  </Link>
                </div>
              )}
            </div>

            {/* Standalone Sidebar Items */}
            <Link
              to="/admin/submissions"
              onClick={closeMobile}
              className={`sidebar-item ${isEnquiries ? 'active' : ''}`}
            >
              <div className="sidebar-item-content">
                <FaCommentAlt size={15} />
                <span>Enquiries</span>
              </div>
            </Link>

            <Link
              to="/admin/media"
              onClick={closeMobile}
              className={`sidebar-item ${isMedia ? 'active' : ''}`}
            >
              <div className="sidebar-item-content">
                <FaImages size={15} />
                <span>Media Library</span>
              </div>
            </Link>

            <Link
              to="/admin/settings"
              onClick={closeMobile}
              className={`sidebar-item ${isSettings ? 'active' : ''}`}
            >
              <div className="sidebar-item-content">
                <FaCog size={15} />
                <span>Settings</span>
              </div>
            </Link>

            {/* Logout */}
            <button
              type="button"
              className="sidebar-item"
              style={{ marginTop: '1.5rem', color: 'var(--danger)' }}
              onClick={() => {
                closeMobile();
                handleLogout();
              }}
            >
              <div className="sidebar-item-content">
                <FaSignOutAlt size={16} />
                <span>Logout</span>
              </div>
            </button>
          </div>
        </aside>

        {/* Content Outlet */}
        <main className="admin-main">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default AdminLayout;
