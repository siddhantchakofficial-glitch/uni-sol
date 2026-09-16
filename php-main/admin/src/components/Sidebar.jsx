import React, { useState } from 'react';
import {
  LayoutDashboard,
  Folder,
  Home,
  Layout,
  Info,
  Lightbulb,
  Building,
  Users,
  LayoutGrid,
  Image,
  Settings,
  LogOut,
  ChevronDown,
  ChevronRight,
  Phone,
  MessageSquare,
  SlidersHorizontal,
  Rss,
} from 'lucide-react';

export default function Sidebar({ activeSection, setActiveSection, onLogout, isMobileOpen, onCloseMobile }) {
  const [websiteExpanded, setWebsiteExpanded] = useState(true);

  const isActive = (key) => activeSection === key;
  const isWebsiteSubActive = (sub) => activeSection === `website-${sub}`;

  const handleSelectSection = (sec) => {
    setActiveSection(sec);
    if (onCloseMobile) onCloseMobile();
  };

  // Sidebar nav item button
  const NavItem = ({ sectionKey, icon: Icon, label, indent = false, style: extraStyle = {} }) => {
    const active = isActive(sectionKey);
    return (
      <button
        className={`sidebar-${indent ? 'sub-' : ''}item ${active ? 'active' : ''}`}
        onClick={() => handleSelectSection(sectionKey)}
        style={extraStyle}
      >
        {indent ? (
          <>
            <Icon size={14} />
            <span>{label}</span>
          </>
        ) : (
          <div className="sidebar-item-content">
            <Icon size={18} />
            <span>{label}</span>
          </div>
        )}
      </button>
    );
  };

  return (
    <>
      {/* Mobile Dark Backdrop Overlay */}
      <div
        className={`sidebar-overlay ${isMobileOpen ? 'mobile-open' : ''}`}
        onClick={onCloseMobile}
      />

      <aside className={`admin-sidebar ${isMobileOpen ? 'mobile-open' : ''}`}>
        <div className="sidebar-group">

          {/* Dashboard */}
          <NavItem sectionKey="dashboard" icon={LayoutDashboard} label="Dashboard" />

          {/* Website Folder */}
          <div>
            <button
              className={`sidebar-item ${activeSection.startsWith('website') ? 'active' : ''}`}
              onClick={() => setWebsiteExpanded(!websiteExpanded)}
            >
              <div className="sidebar-item-content">
                <Folder size={18} />
                <span>Website</span>
              </div>
              {websiteExpanded ? <ChevronDown size={16} /> : <ChevronRight size={16} />}
            </button>

            {websiteExpanded && (
              <div className="sidebar-sub-menu">
                <button
                  className={`sidebar-sub-item ${isWebsiteSubActive('home') ? 'active' : ''}`}
                  onClick={() => handleSelectSection('website-home')}
                >
                  <Home size={14} />
                  <span>Home</span>
                </button>

                <button
                  className={`sidebar-sub-item ${isWebsiteSubActive('marquee') ? 'active' : ''}`}
                  onClick={() => handleSelectSection('website-marquee')}
                >
                  <Rss size={14} />
                  <span>Marquee</span>
                </button>

                <button
                  className={`sidebar-sub-item ${isWebsiteSubActive('header') ? 'active' : ''}`}
                  onClick={() => handleSelectSection('website-header')}
                >
                  <Layout size={14} />
                  <span>Header</span>
                </button>

                <button
                  className={`sidebar-sub-item ${isWebsiteSubActive('about') ? 'active' : ''}`}
                  onClick={() => handleSelectSection('website-about')}
                >
                  <Info size={14} />
                  <span>About</span>
                </button>

                <button
                  className={`sidebar-sub-item ${isWebsiteSubActive('solution') ? 'active' : ''}`}
                  onClick={() => handleSelectSection('website-solution')}
                >
                  <Lightbulb size={14} />
                  <span>Solutions</span>
                </button>

                <button
                  className={`sidebar-sub-item ${isWebsiteSubActive('industry') ? 'active' : ''}`}
                  onClick={() => handleSelectSection('website-industry')}
                >
                  <Building size={14} />
                  <span>Industries</span>
                </button>

                <button
                  className={`sidebar-sub-item ${isWebsiteSubActive('contact') ? 'active' : ''}`}
                  onClick={() => handleSelectSection('website-contact')}
                >
                  <Phone size={14} />
                  <span>Contact</span>
                </button>

                <button
                  className={`sidebar-sub-item ${isWebsiteSubActive('footer') ? 'active' : ''}`}
                  onClick={() => handleSelectSection('website-footer')}
                >
                  <LayoutGrid size={14} />
                  <span>Footer</span>
                </button>

                <button
                  className={`sidebar-sub-item ${isWebsiteSubActive('users') ? 'active' : ''}`}
                  onClick={() => handleSelectSection('website-users')}
                >
                  <Users size={14} />
                  <span>Users</span>
                </button>
              </div>
            )}
          </div>

          {/* Enquiries / Form Submissions */}
          <button
            className={`sidebar-item ${isActive('enquiries') ? 'active' : ''}`}
            onClick={() => handleSelectSection('enquiries')}
          >
            <div className="sidebar-item-content">
              <MessageSquare size={18} />
              <span>Enquiries</span>
            </div>
          </button>

          {/* Media Library */}
          <button
            className={`sidebar-item ${isActive('media') ? 'active' : ''}`}
            onClick={() => handleSelectSection('media')}
          >
            <div className="sidebar-item-content">
              <Image size={18} />
              <span>Media Library</span>
            </div>
          </button>

          {/* Settings */}
          <button
            className={`sidebar-item ${isActive('settings') ? 'active' : ''}`}
            onClick={() => handleSelectSection('settings')}
          >
            <div className="sidebar-item-content">
              <Settings size={18} />
              <span>Settings</span>
            </div>
          </button>

          {/* Logout */}
          <button
            className="sidebar-item"
            style={{ marginTop: '1.5rem', color: 'var(--danger)' }}
            onClick={() => {
              if (onCloseMobile) onCloseMobile();
              onLogout();
            }}
          >
            <div className="sidebar-item-content">
              <LogOut size={18} />
              <span>Logout</span>
            </div>
          </button>
        </div>
      </aside>
    </>
  );
}
