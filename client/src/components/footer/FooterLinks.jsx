import React from 'react';
import { Link } from 'react-router-dom';
import { useSiteContext } from '../../context/SiteContext';

/*
 * Footer link columns — CMS-driven via the existing menus API
 * (menus.footer `children` = columns, or dedicated groups). Falls back to
 * the built-in sections below when no CMS data exists.
 */
export const FooterLinks = () => {
  const { menus } = useSiteContext();

  const cmsSections = (() => {
    const items = Array.isArray(menus?.footer) ? menus.footer : [];
    const columns = items.filter((m) => m && m.label && m.visible !== false);
    // Only real column structures (items WITH children) drive the footer
    // columns. Flat menus (e.g. the seeded legal links) are rendered in the
    // bottom bar already and must not replace the existing columns.
    const hasColumns = columns.some((m) => Array.isArray(m.children) && m.children.length > 0);
    if (!hasColumns) return null;
    return columns.map((m) => ({
      title: m.label,
      links: (m.children || []).filter((c) => c && c.visible !== false).map((c) => ({ label: c.label, path: c.url })),
    }));
  })();

  const sections = cmsSections || [
    {
      title: 'Company',
      links: [
        { label: 'About Us', path: '/about' },
        { label: 'Our Leadership', path: '/about' },
        { label: 'Technology Stack', path: '/technology' },
        { label: 'Case Studies', path: '/case-studies' },
        { label: 'Contact Us', path: '/contact' },
      ],
    },
    {
      title: 'Capabilities',
      links: [
        { label: 'CCTV & Video Surveillance', path: '/capabilities/cctv-surveillance' },
        { label: 'Access Control Systems', path: '/capabilities/access-control' },
        { label: 'Intruder Alarm & Detection', path: '/capabilities/intruder-alarm' },
        { label: 'Fire Alarm & Safety', path: '/capabilities/fire-alarm' },
        { label: 'System Integration (PSIM)', path: '/capabilities/system-integration' },
        { label: 'Maintenance (AMC / PMC)', path: '/capabilities/maintenance-contracts' },
      ],
    },
    {
      title: 'International',
      links: [
        { label: 'Enterprise Operations', path: '/international' },
        { label: 'Technology & Security Operations', path: '/international/technology-security' },
        { label: 'Workforce & Business Operations', path: '/international/workforce' },
        { label: 'HRMS & Workforce Systems', path: '/international/hrms' },
        { label: 'Payroll & Compliance', path: '/international/payroll-compliance' },
        { label: 'Security Systems & Infrastructure', path: '/international/security-infrastructure' },
      ],
    },
  ];

  return (
    <div className="grid grid-cols-2 md:grid-cols-3 gap-8">
      {sections.map((sec, idx) => (
        <div key={idx} className="space-y-3">
          <h4 className="text-sm font-bold text-slate-100 uppercase tracking-wider">
            {sec.title}
          </h4>
          <ul className="space-y-2 text-xs">
            {sec.links.map((link, lIdx) => (
              <li key={lIdx}>
                <Link
                  to={link.path}
                  className="text-slate-400 hover:text-blue-400 transition-colors"
                >
                  {link.label}
                </Link>
              </li>
            ))}
          </ul>
        </div>
      ))}
    </div>
  );
};

export default FooterLinks;
