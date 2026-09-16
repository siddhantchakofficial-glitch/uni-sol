import React from 'react';
import { useNavigate } from 'react-router-dom';
import {
  FaShieldAlt, FaGlobe, FaExternalLinkAlt, FaLayerGroup,
  FaHome, FaWindowMaximize, FaInfoCircle, FaLightbulb,
  FaIndustry, FaPhoneAlt, FaTh, FaUsers, FaCommentAlt,
  FaBookOpen, FaBuilding, FaBoxOpen, FaFileContract
} from 'react-icons/fa';

const LIVE_SITE_URL = import.meta.env.VITE_LIVE_SITE_URL || 'https://unispark-website-kapps.vercel.app';

const CMS_CARDS = (liveUrl) => [
  {
    key: 'website-home',
    label: 'Home Page',
    subtitle: 'Hero & Sections CMS',
    desc: 'Edit main hero banner, headline, subtext, and CTA buttons shown on the homepage.',
    Icon: FaHome,
    color: '#6366f1',
    bg: 'rgba(99, 102, 241, 0.12)',
    route: `${liveUrl}/`,
    target: '/admin/pages?page=home',
  },
  {
    key: 'website-header',
    label: 'Header',
    subtitle: 'Navigation Bar',
    desc: 'Manage the top navigation bar — logo, menu links, and sticky header settings.',
    Icon: FaWindowMaximize,
    color: '#0073b7',
    bg: 'rgba(0, 115, 183, 0.12)',
    route: `${liveUrl}/`,
    target: '/admin/pages?page=header',
  },
  {
    key: 'website-about',
    label: 'About Page',
    subtitle: 'Company Story & Team',
    desc: 'Edit the About Us page — company overview, milestones, certifications, and team section.',
    Icon: FaInfoCircle,
    color: '#10b981',
    bg: 'rgba(16, 185, 129, 0.12)',
    route: `${liveUrl}/about-us`,
    target: '/admin/pages?page=about',
  },
  {
    key: 'website-solution',
    label: 'Solutions Page',
    subtitle: 'Service Cards – Inside Pages',
    desc: 'Manage all 9 solution cards and their full inside-page CMS (banner, scope, brands, CTA).',
    Icon: FaLightbulb,
    color: '#f59e0b',
    bg: 'rgba(245, 158, 11, 0.12)',
    route: `${liveUrl}/solutions`,
    target: '/admin/pages?page=solutions',
  },
  {
    key: 'website-industry',
    label: 'Industries Page',
    subtitle: 'Sector Cards – Inside Pages',
    desc: 'Manage all Industry sector cards and their full inside-page CMS with challenges, solutions, brands.',
    Icon: FaIndustry,
    color: '#ef4444',
    bg: 'rgba(239, 68, 68, 0.12)',
    route: `${liveUrl}/industries`,
    target: '/admin/pages?page=industries',
  },
  {
    key: 'website-international',
    label: 'International Page',
    subtitle: 'Global Operations & Sub-pages',
    desc: 'Manage International Enterprise Operations landing page and all 15 operational sub-pages.',
    Icon: FaGlobe,
    color: '#0284c7',
    bg: 'rgba(2, 132, 199, 0.12)',
    route: `${liveUrl}/international`,
    target: '/admin/pages?page=international',
  },
  {
    key: 'website-contact',
    label: 'Contact Page',
    subtitle: 'Contact Form & Details',
    desc: 'Update contact information, office address, phone, email, and form settings.',
    Icon: FaPhoneAlt,
    color: '#06b6d4',
    bg: 'rgba(6, 182, 212, 0.12)',
    route: `${liveUrl}/contact-us`,
    target: '/admin/pages?page=contact',
  },
  {
    key: 'website-footer',
    label: 'Footer',
    subtitle: 'Footer CMS',
    desc: 'Edit company info, social links, quick links, contact strip, group companies, and copyright.',
    Icon: FaTh,
    color: '#8b5cf6',
    bg: 'rgba(139, 92, 246, 0.12)',
    route: `${liveUrl}/`,
    target: '/admin/pages?page=footer-seo',
  },
  {
    key: 'website-users',
    label: 'Users',
    subtitle: 'Admin User Management',
    desc: 'Manage admin accounts — add, edit, or remove user access to this admin panel.',
    Icon: FaUsers,
    color: '#ec4899',
    bg: 'rgba(236, 72, 153, 0.12)',
    route: null,
    target: '/admin/users',
  },
  {
    key: 'enquiries',
    label: 'Enquiries',
    subtitle: 'Form Submissions',
    desc: 'View all contact form submissions and enquiries sent from the website.',
    Icon: FaCommentAlt,
    color: '#14b8a6',
    bg: 'rgba(20, 184, 166, 0.12)',
    route: null,
    target: '/admin/submissions',
  },
];

const LIVE_SHORTCUTS = (liveUrl) => [
  { label: 'Homepage', path: '', url: `${liveUrl}/`, Icon: FaHome },
  { label: 'About Us', path: '/about-us', url: `${liveUrl}/about-us`, Icon: FaInfoCircle },
  { label: 'Solutions', path: '/solutions', url: `${liveUrl}/solutions`, Icon: FaLightbulb },
  { label: 'Industries', path: '/industries', url: `${liveUrl}/industries`, Icon: FaBuilding },
  { label: 'International', path: '/international', url: `${liveUrl}/international`, Icon: FaGlobe },
  { label: 'Our Products', path: '/our-products', url: `${liveUrl}/our-products`, Icon: FaBoxOpen },
  { label: 'Contact Us', path: '/contact-us', url: `${liveUrl}/contact-us`, Icon: FaPhoneAlt },
  { label: 'Privacy Policy', path: '/privacy-policy', url: `${liveUrl}/privacy-policy`, Icon: FaShieldAlt },
  { label: 'Terms & Conditions', path: '/terms-and-conditions', url: `${liveUrl}/terms-and-conditions`, Icon: FaFileContract },
];

export const AdminDashboard = () => {
  const navigate = useNavigate();
  const liveUrl = LIVE_SITE_URL;
  const cards = CMS_CARDS(liveUrl);
  const shortcuts = LIVE_SHORTCUTS(liveUrl);

  const handleEdit = (target) => {
    navigate(target);
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
      {/* Breadcrumbs */}
      <div className="breadcrumbs" style={{ margin: '-0.25rem 0 -0.75rem 0' }}>
        <span className="breadcrumb-item">Dashboard</span>
        <span style={{ color: 'var(--text-dim)' }}>›</span>
        <span className="breadcrumb-item active">Overview</span>
      </div>

      {/* Hero Banner Card */}
      <div
        style={{
          background: 'linear-gradient(135deg, #004b78 0%, #0073b7 60%, #0ea5e9 100%)',
          borderRadius: 'var(--radius-lg)',
          padding: '2rem 2.25rem',
          color: '#fff',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          flexWrap: 'wrap',
          gap: '1rem',
          boxShadow: '0 8px 32px rgba(0, 115, 183, 0.25)'
        }}
      >
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '0.5rem' }}>
            <FaShieldAlt size={24} style={{ opacity: 0.9 }} />
            <span
              style={{
                fontSize: '0.75rem',
                fontWeight: 700,
                textTransform: 'uppercase',
                letterSpacing: '0.1em',
                opacity: 0.8
              }}
            >
              UniSpark Innovation
            </span>
          </div>
          <h1 style={{ fontSize: '1.75rem', fontWeight: 800, margin: 0, letterSpacing: '-0.01em' }}>
            Website CMS Dashboard
          </h1>
          <p style={{ margin: '0.4rem 0 0', fontSize: '0.88rem', opacity: 0.85 }}>
            Manage all website pages, content, and sections from one place.
          </p>
        </div>

        <a
          href={liveUrl}
          target="_blank"
          rel="noopener noreferrer"
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '0.5rem',
            padding: '0.65rem 1.35rem',
            borderRadius: '10px',
            backgroundColor: 'rgba(255, 255, 255, 0.18)',
            border: '1px solid rgba(255, 255, 255, 0.3)',
            color: '#fff',
            fontWeight: 700,
            fontSize: '0.85rem',
            textDecoration: 'none',
            backdropFilter: 'blur(4px)',
            transition: 'background 0.2s',
            cursor: 'pointer'
          }}
          onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = 'rgba(255, 255, 255, 0.28)')}
          onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = 'rgba(255, 255, 255, 0.18)')}
        >
          <FaGlobe size={16} />
          <span>Open Live Website</span>
          <FaExternalLinkAlt size={12} />
        </a>
      </div>

      {/* Section: All Pages & Sections */}
      <div className="card">
        <div className="card-header">
          <h3 className="card-title">
            <FaLayerGroup size={20} style={{ color: '#38bdf8' }} />
            <span>All Pages & Sections</span>
          </h3>
          <p className="card-subtitle">
            Select a page to edit its CMS content or click the preview link to view the live page on the website.
          </p>
        </div>

        <div className="card-body">
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fill, minmax(285px, 1fr))',
              gap: '1.25rem'
            }}
          >
            {cards.map((item) => (
              <div
                key={item.key}
                style={{
                  padding: '1.35rem',
                  backgroundColor: 'var(--bg-input)',
                  border: '1px solid var(--border-color)',
                  borderRadius: 'var(--radius-md)',
                  display: 'flex',
                  flexDirection: 'column',
                  justifyContent: 'space-between',
                  gap: '1rem',
                  transition: 'all 0.18s ease',
                  position: 'relative'
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.borderColor = item.color;
                  e.currentTarget.style.boxShadow = `0 4px 20px ${item.color}25`;
                  e.currentTarget.style.transform = 'translateY(-2px)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.borderColor = 'var(--border-color)';
                  e.currentTarget.style.boxShadow = 'none';
                  e.currentTarget.style.transform = 'translateY(0)';
                }}
              >
                <div>
                  <div
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      marginBottom: '0.75rem'
                    }}
                  >
                    <div
                      style={{
                        width: '42px',
                        height: '42px',
                        borderRadius: '10px',
                        backgroundColor: item.bg,
                        color: item.color,
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        flexShrink: 0
                      }}
                    >
                      <item.Icon size={19} />
                    </div>
                    <span
                      style={{
                        fontSize: '0.72rem',
                        fontWeight: 600,
                        color: item.color,
                        backgroundColor: item.bg,
                        padding: '0.2rem 0.6rem',
                        borderRadius: '6px'
                      }}
                    >
                      {item.subtitle}
                    </span>
                  </div>

                  <h4
                    style={{
                      fontSize: '1.05rem',
                      fontWeight: 700,
                      margin: '0 0 0.4rem 0',
                      color: 'var(--text-main)'
                    }}
                  >
                    {item.label}
                  </h4>
                  <p
                    style={{
                      margin: 0,
                      fontSize: '0.82rem',
                      color: 'var(--text-muted)',
                      lineHeight: 1.5
                    }}
                  >
                    {item.desc}
                  </p>
                </div>

                <div
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    paddingTop: '0.75rem',
                    borderTop: '1px solid var(--border-color)',
                    gap: '0.5rem',
                    flexWrap: 'wrap'
                  }}
                >
                  <button
                    type="button"
                    onClick={() => handleEdit(item.target)}
                    style={{
                      padding: '0.45rem 0.9rem',
                      borderRadius: '6px',
                      backgroundColor: 'transparent',
                      border: `1px solid ${item.color}`,
                      color: item.color,
                      fontSize: '0.78rem',
                      fontWeight: 600,
                      cursor: 'pointer',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '0.35rem',
                      transition: 'all 0.15s ease'
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.backgroundColor = item.color;
                      e.currentTarget.style.color = '#fff';
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.backgroundColor = 'transparent';
                      e.currentTarget.style.color = item.color;
                    }}
                  >
                    <span>Edit in CMS</span>
                    <FaExternalLinkAlt size={10} />
                  </button>

                  {item.route ? (
                    <a
                      href={item.route}
                      target="_blank"
                      rel="noopener noreferrer"
                      title={`Open live page: ${item.route}`}
                      style={{
                        fontSize: '0.75rem',
                        fontWeight: 600,
                        color: 'var(--text-muted)',
                        textDecoration: 'none',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '0.35rem',
                        padding: '0.45rem 0.75rem',
                        borderRadius: '6px',
                        backgroundColor: 'rgba(255, 255, 255, 0.04)',
                        border: '1px solid var(--border-color)',
                        transition: 'all 0.15s ease'
                      }}
                      onMouseEnter={(e) => {
                        e.currentTarget.style.color = '#0073b7';
                        e.currentTarget.style.borderColor = '#0073b7';
                        e.currentTarget.style.backgroundColor = 'rgba(0, 115, 183, 0.08)';
                      }}
                      onMouseLeave={(e) => {
                        e.currentTarget.style.color = 'var(--text-muted)';
                        e.currentTarget.style.borderColor = 'var(--border-color)';
                        e.currentTarget.style.backgroundColor = 'rgba(255, 255, 255, 0.04)';
                      }}
                    >
                      <FaGlobe size={12} style={{ color: '#0073b7' }} />
                      <span>Live Preview</span>
                      <FaExternalLinkAlt size={10} />
                    </a>
                  ) : (
                    <span style={{ fontSize: '0.72rem', color: 'var(--text-muted)', opacity: 0.6, fontWeight: 500 }}>
                      Admin Only
                    </span>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Section: Live Website Pages */}
      <div className="card">
        <div className="card-header">
          <h3 className="card-title">
            <FaBookOpen size={20} style={{ color: '#38bdf8' }} />
            <span>Live Website Pages</span>
          </h3>
          <p className="card-subtitle">
            Direct shortcuts to open and test your production website pages on Vercel:{' '}
            <code
              style={{
                color: '#0073b7',
                fontSize: '0.8rem',
                backgroundColor: 'rgba(0, 115, 183, 0.1)',
                padding: '0.15rem 0.4rem',
                borderRadius: '4px'
              }}
            >
              {liveUrl}
            </code>
          </p>
        </div>

        <div className="card-body">
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.75rem' }}>
            {shortcuts.map((page) => (
              <a
                key={page.label}
                href={page.url}
                target="_blank"
                rel="noopener noreferrer"
                title={`Visit live page: ${page.url}`}
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '0.55rem',
                  padding: '0.6rem 1.15rem',
                  borderRadius: '8px',
                  border: '1px solid var(--border-color)',
                  backgroundColor: 'var(--bg-input)',
                  color: 'var(--text-main)',
                  fontSize: '0.83rem',
                  fontWeight: 600,
                  textDecoration: 'none',
                  transition: 'all 0.15s ease',
                  boxShadow: '0 2px 6px rgba(0, 0, 0, 0.04)'
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.borderColor = '#0073b7';
                  e.currentTarget.style.color = '#0073b7';
                  e.currentTarget.style.backgroundColor = 'rgba(0, 115, 183, 0.08)';
                  e.currentTarget.style.transform = 'translateY(-1px)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.borderColor = 'var(--border-color)';
                  e.currentTarget.style.color = 'var(--text-main)';
                  e.currentTarget.style.backgroundColor = 'var(--bg-input)';
                  e.currentTarget.style.transform = 'translateY(0)';
                }}
              >
                <page.Icon size={14} style={{ color: '#0073b7' }} />
                <span>{page.label}</span>
                {page.path && (
                  <span style={{ fontSize: '0.72rem', color: 'var(--text-muted)', opacity: 0.75, fontWeight: 400 }}>
                    {page.path}
                  </span>
                )}
                <FaExternalLinkAlt size={10} style={{ opacity: 0.6, marginLeft: '0.15rem' }} />
              </a>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
