import React from 'react';
import {
  Home, Layout, Info, Lightbulb, Building, Phone, LayoutGrid,
  ArrowUpRight, Shield, Globe, MessageSquare, Users, Layers, BookOpen,
  Package, FileText, Lock
} from 'lucide-react';
import { WEBSITE_BASE_URL } from '../services/api';

const getPages = (baseUrl) => [
  {
    key: 'website-home',
    label: 'Home Page',
    subtitle: 'Hero & Sections CMS',
    desc: 'Edit main hero banner, headline, subtext, and CTA buttons shown on the homepage.',
    Icon: Home,
    color: '#6366f1',
    bg: 'rgba(99,102,241,0.12)',
    route: `${baseUrl}/`,
  },
  {
    key: 'website-header',
    label: 'Header',
    subtitle: 'Navigation Bar',
    desc: 'Manage the top navigation bar — logo, menu links, and sticky header settings.',
    Icon: Layout,
    color: '#0073b7',
    bg: 'rgba(0,115,183,0.12)',
    route: `${baseUrl}/`,
  },
  {
    key: 'website-about',
    label: 'About Page',
    subtitle: 'Company Story & Team',
    desc: 'Edit the About Us page — company overview, milestones, certifications, and team section.',
    Icon: Info,
    color: '#10b981',
    bg: 'rgba(16,185,129,0.12)',
    route: `${baseUrl}/about-us`,
  },
  {
    key: 'website-solution',
    label: 'Solutions Page',
    subtitle: 'Service Cards + Inside Pages',
    desc: 'Manage all 9 solution cards and their full inside-page CMS (banner, scope, brands, CTA).',
    Icon: Lightbulb,
    color: '#f59e0b',
    bg: 'rgba(245,158,11,0.12)',
    route: `${baseUrl}/solutions`,
  },
  {
    key: 'website-industry',
    label: 'Industries Page',
    subtitle: 'Sector Cards + Inside Pages',
    desc: 'Manage all industry sector cards and their full inside-page CMS with challenges, solutions, brands.',
    Icon: Building,
    color: '#ef4444',
    bg: 'rgba(239,68,68,0.12)',
    route: `${baseUrl}/industries`,
  },
  {
    key: 'website-contact',
    label: 'Contact Page',
    subtitle: 'Contact Form & Details',
    desc: 'Update contact information, office address, phone, email, and form settings.',
    Icon: Phone,
    color: '#06b6d4',
    bg: 'rgba(6,182,212,0.12)',
    route: `${baseUrl}/contact-us`,
  },
  {
    key: 'website-footer',
    label: 'Footer',
    subtitle: 'Footer CMS',
    desc: 'Edit company info, social links, quick links, contact strip, group companies, and copyright.',
    Icon: LayoutGrid,
    color: '#8b5cf6',
    bg: 'rgba(139,92,246,0.12)',
    route: `${baseUrl}/`,
  },
  {
    key: 'website-users',
    label: 'Users',
    subtitle: 'Admin User Management',
    desc: 'Manage admin accounts — add, edit, or remove user access to this admin panel.',
    Icon: Users,
    color: '#ec4899',
    bg: 'rgba(236,72,153,0.12)',
    route: null,
  },
  {
    key: 'enquiries',
    label: 'Enquiries',
    subtitle: 'Form Submissions',
    desc: 'View all contact form submissions and enquiries sent from the website.',
    Icon: MessageSquare,
    color: '#14b8a6',
    bg: 'rgba(20,184,166,0.12)',
    route: null,
  },
];

// Live website page quick-preview links matching unise-php routes
const getLiveRoutes = (baseUrl) => [
  { label: 'Homepage', path: '/', url: `${baseUrl}/`, icon: 'fa-house' },
  { label: 'About Us', path: '/about-us', url: `${baseUrl}/about-us`, icon: 'fa-circle-info' },
  { label: 'Solutions', path: '/solutions', url: `${baseUrl}/solutions`, icon: 'fa-lightbulb' },
  { label: 'Industries', path: '/industries', url: `${baseUrl}/industries`, icon: 'fa-building' },
  { label: 'Our Products', path: '/our-products', url: `${baseUrl}/our-products`, icon: 'fa-box-open' },
  { label: 'Contact Us', path: '/contact-us', url: `${baseUrl}/contact-us`, icon: 'fa-phone' },
  { label: 'Privacy Policy', path: '/privacy-policy', url: `${baseUrl}/privacy-policy`, icon: 'fa-file-shield' },
  { label: 'Terms & Conditions', path: '/terms-and-conditions', url: `${baseUrl}/terms-and-conditions`, icon: 'fa-file-contract' },
];

export default function DashboardView({ onSelectSection }) {
  const pages = getPages(WEBSITE_BASE_URL);
  const liveRoutes = getLiveRoutes(WEBSITE_BASE_URL);

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>

      {/* Welcome Banner */}
      <div style={{
        background: 'linear-gradient(135deg, #004b78 0%, #0073b7 60%, #0ea5e9 100%)',
        borderRadius: 'var(--radius-lg)',
        padding: '2rem 2.25rem',
        color: '#fff',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        flexWrap: 'wrap',
        gap: '1rem',
        boxShadow: '0 8px 32px rgba(0,115,183,0.25)',
      }}>
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '0.5rem' }}>
            <Shield size={28} style={{ opacity: 0.9 }} />
            <span style={{ fontSize: '0.75rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.1em', opacity: 0.8 }}>UniSpark Innovation</span>
          </div>
          <h1 style={{ fontSize: '1.75rem', fontWeight: 800, margin: 0, letterSpacing: '-0.01em' }}>
            Website CMS Dashboard
          </h1>
          <p style={{ margin: '0.4rem 0 0', fontSize: '0.88rem', opacity: 0.85 }}>
            Manage all website pages, content, and sections from one place.
          </p>
        </div>
        <a
          href={WEBSITE_BASE_URL}
          target="_blank"
          rel="noopener noreferrer"
          style={{
            display: 'flex', alignItems: 'center', gap: '0.5rem',
            padding: '0.65rem 1.35rem', borderRadius: '10px',
            backgroundColor: 'rgba(255,255,255,0.18)',
            border: '1px solid rgba(255,255,255,0.3)',
            color: '#fff', fontWeight: 700, fontSize: '0.85rem',
            textDecoration: 'none', backdropFilter: 'blur(4px)',
            transition: 'background 0.2s',
            cursor: 'pointer'
          }}
          onMouseEnter={e => e.currentTarget.style.backgroundColor = 'rgba(255,255,255,0.28)'}
          onMouseLeave={e => e.currentTarget.style.backgroundColor = 'rgba(255,255,255,0.18)'}
        >
          <Globe size={16} />
          <span>Open Live Website</span>
          <ArrowUpRight size={14} />
        </a>
      </div>

      {/* All CMS Page Cards */}
      <div className="card">
        <div className="card-header">
          <h3 className="card-title" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <Layers size={20} className="text-primary" />
            All Pages & Sections
          </h3>
          <p className="card-subtitle">Select a page to edit its CMS content or click the preview link to view the live page on the website.</p>
        </div>
        <div className="card-body">
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(290px, 1fr))', gap: '1.25rem' }}>
            {pages.map(({ key, label, subtitle, desc, Icon, color, bg, route }) => (
              <div
                key={key}
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
                  position: 'relative',
                }}
                onMouseEnter={e => {
                  e.currentTarget.style.borderColor = color;
                  e.currentTarget.style.boxShadow = `0 4px 20px ${color}22`;
                  e.currentTarget.style.transform = 'translateY(-2px)';
                }}
                onMouseLeave={e => {
                  e.currentTarget.style.borderColor = 'var(--border-color)';
                  e.currentTarget.style.boxShadow = 'none';
                  e.currentTarget.style.transform = 'translateY(0)';
                }}
              >
                {/* Header Row */}
                <div>
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.75rem' }}>
                    <div style={{ width: '42px', height: '42px', borderRadius: '10px', backgroundColor: bg, color: color, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                      <Icon size={20} />
                    </div>
                    <span style={{ fontSize: '0.72rem', fontWeight: 600, color: color, backgroundColor: bg, padding: '0.2rem 0.6rem', borderRadius: '6px' }}>
                      {subtitle}
                    </span>
                  </div>

                  <h4 style={{ fontSize: '1.05rem', fontWeight: 700, margin: '0 0 0.4rem 0', color: 'var(--text-main)' }}>
                    {label}
                  </h4>
                  <p style={{ margin: 0, fontSize: '0.82rem', color: 'var(--text-muted)', lineHeight: 1.5 }}>
                    {desc}
                  </p>
                </div>

                {/* Actions Footer Row */}
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', paddingTop: '0.75rem', borderTop: '1px solid var(--border-color)', gap: '0.5rem', flexWrap: 'wrap' }}>
                  <button
                    onClick={() => onSelectSection(key)}
                    style={{
                      padding: '0.45rem 0.9rem',
                      borderRadius: '6px',
                      backgroundColor: 'transparent',
                      border: `1px solid ${color}`,
                      color: color,
                      fontSize: '0.78rem',
                      fontWeight: 600,
                      cursor: 'pointer',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '0.35rem',
                      transition: 'all 0.15s ease',
                    }}
                    onMouseEnter={e => {
                      e.currentTarget.style.backgroundColor = color;
                      e.currentTarget.style.color = '#fff';
                    }}
                    onMouseLeave={e => {
                      e.currentTarget.style.backgroundColor = 'transparent';
                      e.currentTarget.style.color = color;
                    }}
                  >
                    <span>Edit in CMS</span>
                    <ArrowUpRight size={13} />
                  </button>

                  {route ? (
                    <a
                      href={route}
                      target="_blank"
                      rel="noopener noreferrer"
                      title={`Open live page: ${route}`}
                      style={{
                        fontSize: '0.75rem',
                        fontWeight: 600,
                        color: 'var(--text-muted)',
                        textDecoration: 'none',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '0.3rem',
                        padding: '0.45rem 0.75rem',
                        borderRadius: '6px',
                        backgroundColor: 'rgba(255,255,255,0.04)',
                        border: '1px solid var(--border-color)',
                        transition: 'all 0.15s ease',
                      }}
                      onMouseEnter={e => {
                        e.currentTarget.style.color = '#0073b7';
                        e.currentTarget.style.borderColor = '#0073b7';
                        e.currentTarget.style.backgroundColor = 'rgba(0,115,183,0.08)';
                      }}
                      onMouseLeave={e => {
                        e.currentTarget.style.color = 'var(--text-muted)';
                        e.currentTarget.style.borderColor = 'var(--border-color)';
                        e.currentTarget.style.backgroundColor = 'rgba(255,255,255,0.04)';
                      }}
                    >
                      <Globe size={12} style={{ color: '#0073b7' }} />
                      <span>Live Preview</span>
                      <ArrowUpRight size={11} />
                    </a>
                  ) : (
                    <span style={{ fontSize: '0.72rem', color: 'var(--text-muted)', opacity: 0.6 }}>Admin Only</span>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Live Website Quick Links */}
      <div className="card">
        <div className="card-header">
          <h3 className="card-title" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <BookOpen size={20} className="text-primary" />
            Live Website Pages
          </h3>
          <p className="card-subtitle">
            Direct shortcuts to open and test your production website pages on Vercel: <code style={{ color: '#0073b7', fontSize: '0.8rem' }}>{WEBSITE_BASE_URL}</code>
          </p>
        </div>
        <div className="card-body">
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.75rem' }}>
            {liveRoutes.map(({ label, path, url, icon }) => (
              <a
                key={url}
                href={url}
                target="_blank"
                rel="noopener noreferrer"
                title={`Visit live page: ${url}`}
                style={{
                  display: 'inline-flex', alignItems: 'center', gap: '0.55rem',
                  padding: '0.6rem 1.15rem', borderRadius: '8px',
                  border: '1px solid var(--border-color)',
                  backgroundColor: 'var(--bg-input)',
                  color: 'var(--text-main)', fontSize: '0.83rem', fontWeight: 600,
                  textDecoration: 'none', transition: 'all 0.15s ease',
                  boxShadow: '0 2px 6px rgba(0,0,0,0.04)',
                }}
                onMouseEnter={e => {
                  e.currentTarget.style.borderColor = '#0073b7';
                  e.currentTarget.style.color = '#0073b7';
                  e.currentTarget.style.backgroundColor = 'rgba(0,115,183,0.08)';
                  e.currentTarget.style.transform = 'translateY(-1px)';
                }}
                onMouseLeave={e => {
                  e.currentTarget.style.borderColor = 'var(--border-color)';
                  e.currentTarget.style.color = 'var(--text-main)';
                  e.currentTarget.style.backgroundColor = 'var(--bg-input)';
                  e.currentTarget.style.transform = 'translateY(0)';
                }}
              >
                <i className={`fa-solid ${icon} text-xs`} style={{ color: '#0073b7' }} />
                <span>{label}</span>
                <span style={{ fontSize: '0.72rem', color: 'var(--text-muted)', fontWeight: 400 }}>{path}</span>
                <ArrowUpRight size={12} style={{ opacity: 0.7 }} />
              </a>
            ))}
          </div>
        </div>
      </div>

    </div>
  );
}
