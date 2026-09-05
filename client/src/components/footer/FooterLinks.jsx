import React from 'react';
import { Link } from 'react-router-dom';

export const FooterLinks = () => {
  const sections = [
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
        { label: 'Technology & Security', path: '/international/technology-security' },
        { label: 'Workforce Solutions', path: '/international/workforce' },
        { label: 'HR Solutions & HRMS', path: '/international/hrms' },
        { label: 'Payroll & Compliance', path: '/international/payroll-compliance' },
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
