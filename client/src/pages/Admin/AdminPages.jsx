import React, { useState } from 'react';
import {
  FaHome, FaInfoCircle, FaShieldAlt, FaIndustry,
  FaPhoneAlt, FaGlobe, FaLayerGroup, FaExternalLinkAlt, FaEdit
} from 'react-icons/fa';

import HomepageEditor from './editors/HomepageEditor';
import AboutPageEditor from './editors/AboutPageEditor';
import SolutionsEditor from './editors/SolutionsEditor';
import IndustriesEditor from './editors/IndustriesEditor';
import InternationalEditor from './editors/InternationalEditor';
import ContactPageEditor from './editors/ContactPageEditor';
import FooterAndSEOEditor from './editors/FooterAndSEOEditor';

import { useSearchParams } from 'react-router-dom';

const CMS_PAGES = [
  {
    id: 'home',
    title: 'Homepage Visual CMS',
    path: '/',
    badge: 'Core Website',
    desc: 'Hero banner, Who We Are, Solutions showcase, Industries grid, Trust pillars & Global Ticker.',
    icon: FaHome,
    color: 'bg-sky-500',
    component: HomepageEditor,
  },
  {
    id: 'header',
    title: 'Header & Navigation CMS',
    path: '/',
    badge: 'Navigation Bar',
    desc: 'Header logo, navigation menu links, contact strip, and sticky navigation bar settings.',
    icon: FaGlobe,
    color: 'bg-cyan-600',
    component: FooterAndSEOEditor,
  },
  {
    id: 'about',
    title: 'About Us CMS',
    path: '/about',
    badge: 'Company Profile',
    desc: 'Company overview, At a Glance metrics, Security differentiators & Mission/Vision.',
    icon: FaInfoCircle,
    color: 'bg-indigo-500',
    component: AboutPageEditor,
  },
  {
    id: 'solutions',
    title: 'Solutions & Capabilities CMS',
    path: '/capabilities',
    badge: 'Products & Services',
    desc: 'Electronic security, AI CCTV analytics, Access control, PSIM software, and Workforce catalogue.',
    icon: FaShieldAlt,
    color: 'bg-blue-600',
    component: SolutionsEditor,
  },
  {
    id: 'industries',
    title: 'Industry Verticals CMS',
    path: '/industries',
    badge: 'Sector Solutions',
    desc: 'Data centers, Banking & Finance, Heavy manufacturing, Healthcare and Critical infrastructure.',
    icon: FaIndustry,
    color: 'bg-teal-600',
    component: IndustriesEditor,
  },
  {
    id: 'international',
    title: 'International Enterprise CMS',
    path: '/international',
    badge: 'Global Operations',
    desc: 'Technology & Security, Workforce & Business Operations, Security Infrastructure — all 14+ sub-pages.',
    icon: FaGlobe,
    color: 'bg-sky-600',
    component: InternationalEditor,
  },
  {
    id: 'contact',
    title: 'Contact & Offices CMS',
    path: '/contact',
    badge: 'Inquiries & Hubs',
    desc: 'India & UAE headquarters, International phone lines, WhatsApp routing & Enquiry banner.',
    icon: FaPhoneAlt,
    color: 'bg-emerald-600',
    component: ContactPageEditor,
  },
  {
    id: 'footer-seo',
    title: 'Logos, Footer & Global SEO CMS',
    path: '/',
    badge: 'Global Metadata',
    desc: 'Header & footer logos, official social links, legal copyright, meta tags & OpenGraph.',
    icon: FaGlobe,
    color: 'bg-purple-600',
    component: FooterAndSEOEditor,
  },
];

export const AdminPages = () => {
  const [searchParams] = useSearchParams();
  const pageParam = searchParams.get('page');
  const validPage = pageParam && CMS_PAGES.some((p) => p.id === pageParam) ? pageParam : null;
  const [selectedPageId, setSelectedPageId] = useState('home');
  const [viewMode, setViewMode] = useState('editor'); // 'editor' | 'overview'

  const activePageId = validPage || selectedPageId;
  const activePage = CMS_PAGES.find((p) => p.id === activePageId) || CMS_PAGES[0];
  const ActiveComponent = activePage.component;

  return (
    <div className="space-y-6">
      {/* Top Selector Grid */}
      <div className="bg-white rounded-2xl border border-gray-200 p-5 shadow-xs">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 mb-4">
          <div>
            <h2 className="text-lg font-bold text-gray-900 font-poppins flex items-center gap-2">
              <FaLayerGroup className="text-[#0470aa]" /> Live Website Pages CMS
            </h2>
            <p className="text-xs text-gray-500">
              Select any website page below to visually edit its sections, cards, imagery, and text content.
            </p>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => setViewMode(viewMode === 'editor' ? 'overview' : 'editor')}
              className="px-3 py-1.5 rounded-xl border border-gray-200 text-xs font-semibold text-gray-700 hover:bg-gray-50"
            >
              {viewMode === 'editor' ? 'Show All Pages Grid' : 'Back to Editor'}
            </button>
          </div>
        </div>

        {/* Page Switcher Pills / Tabs */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-2.5">
          {CMS_PAGES.map((page) => {
            const Icon = page.icon;
            const isSelected = activePageId === page.id && viewMode === 'editor';
            return (
              <button
                key={page.id}
                onClick={() => {
                  setSelectedPageId(page.id);
                  setViewMode('editor');
                }}
                className={`p-3 rounded-xl border text-left transition-all flex flex-col justify-between group ${
                  isSelected
                    ? 'border-[#0470aa] bg-sky-50/70 shadow-xs ring-1 ring-[#0470aa]'
                    : 'border-gray-200 bg-gray-50/50 hover:bg-white hover:border-[#0470aa]/40 hover:shadow-xs'
                }`}
              >
                <div className="flex items-center justify-between mb-1.5">
                  <div
                    className={`w-7 h-7 rounded-lg flex items-center justify-center text-white ${page.color}`}
                  >
                    <Icon className="w-3.5 h-3.5" />
                  </div>
                  <span className="text-[10px] text-gray-400 font-semibold uppercase">{page.badge.split(' ')[0]}</span>
                </div>
                <div>
                  <h4 className={`text-xs font-bold ${isSelected ? 'text-[#0470aa]' : 'text-gray-800'}`}>
                    {page.title.replace(' CMS', '')}
                  </h4>
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {/* VIEW MODE: ALL PAGES OVERVIEW GRID */}
      {viewMode === 'overview' && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5 animate-fade-in">
          {CMS_PAGES.map((page) => {
            const Icon = page.icon;
            return (
              <div
                key={page.id}
                className="bg-white rounded-2xl border border-gray-200 p-6 flex flex-col justify-between hover:shadow-lg hover:border-[#0470aa]/40 transition-all group"
              >
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <div className={`w-10 h-10 rounded-xl flex items-center justify-center text-white ${page.color}`}>
                      <Icon className="w-5 h-5" />
                    </div>
                    <span className="px-2.5 py-0.5 rounded-full text-[10px] font-semibold bg-gray-100 text-gray-700">
                      {page.badge}
                    </span>
                  </div>
                  <div>
                    <h3 className="text-base font-bold text-gray-900 group-hover:text-[#0470aa] transition-colors">
                      {page.title}
                    </h3>
                    <p className="text-xs text-gray-500 mt-1 leading-relaxed">{page.desc}</p>
                  </div>
                </div>

                <div className="flex items-center justify-between pt-4 mt-4 border-t border-gray-100">
                  <a
                    href={page.path}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-xs text-gray-500 hover:text-[#0470aa] flex items-center gap-1 font-medium"
                  >
                    <FaExternalLinkAlt className="w-3 h-3" /> Live Page
                  </a>

                  <button
                    onClick={() => {
                      setSelectedPageId(page.id);
                      setViewMode('editor');
                    }}
                    className="btn-unispark-pill text-xs py-1.5 px-4 inline-flex items-center gap-1.5"
                  >
                    <FaEdit className="w-3 h-3" /> Edit in CMS
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* VIEW MODE: ACTIVE PAGE VISUAL CMS EDITOR */}
      {viewMode === 'editor' && (
        <div className="animate-fade-in">
          <ActiveComponent />
        </div>
      )}
    </div>
  );
};

export default AdminPages;
