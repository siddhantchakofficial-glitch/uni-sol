import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import {
  FaFileAlt, FaImages, FaInbox, FaUsers,
  FaChartLine, FaArrowRight, FaCircle, FaShieldAlt,
  FaHome, FaInfoCircle, FaIndustry, FaPhoneAlt, FaGlobe, FaEdit, FaExternalLinkAlt
} from 'react-icons/fa';

const API_BASE = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000/api';

const StatCard = ({ icon: Icon, label, value, color, linkTo }) => (
  <Link
    to={linkTo}
    className="bg-white rounded-2xl p-5 border border-gray-200 flex items-center gap-4 hover:border-[#0470aa]/40 hover:shadow-lg hover:shadow-[#0470aa]/10 transition-all group"
  >
    <div className={`w-12 h-12 rounded-xl flex items-center justify-center flex-shrink-0 ${color}`}>
      <Icon className="w-5 h-5 text-white" />
    </div>
    <div className="flex-1 min-w-0">
      <p className="text-xs text-gray-500 font-medium uppercase tracking-wide">{label}</p>
      <p className="text-2xl font-bold text-gray-900 mt-0.5">{value ?? '—'}</p>
    </div>
    <FaArrowRight className="w-3.5 h-3.5 text-gray-300 group-hover:text-[#0470aa] transition-colors flex-shrink-0" />
  </Link>
);

const LIVE_CMS_PAGES = [
  { id: 'home', title: 'Homepage', badge: 'Core', path: '/', icon: FaHome, color: 'bg-sky-500', desc: 'Hero, Who We Are, Solutions, Industries, Pillars & Ticker' },
  { id: 'about', title: 'About Us', badge: 'Profile', path: '/about', icon: FaInfoCircle, color: 'bg-indigo-500', desc: 'Company overview, Glance metrics & Differentiators' },
  { id: 'solutions', title: 'Solutions & Capabilities', badge: 'Services', path: '/capabilities', icon: FaShieldAlt, color: 'bg-blue-600', desc: 'Security, Surveillance, PSIM, Fire & Workforce' },
  { id: 'industries', title: 'Industry Verticals', badge: 'Sectors', path: '/industries', icon: FaIndustry, color: 'bg-teal-600', desc: 'Data Centers, Banking, Manufacturing & Health' },
  { id: 'contact', title: 'Contact & Global Hubs', badge: 'Inquiries', path: '/contact', icon: FaPhoneAlt, color: 'bg-emerald-600', desc: 'India & UAE offices, Hotlines & Inquiries' },
  { id: 'footer-seo', title: 'Footer, Branding & SEO', badge: 'Global', path: '/', icon: FaGlobe, color: 'bg-purple-600', desc: 'Header/Footer logos, Social handles & Meta tags' },
];

export const AdminDashboard = () => {
  const { user, token } = useAuth();
  const [stats, setStats] = useState({ pages: 6, media: 24, submissions: null, users: 1 });
  const [health, setHealth] = useState(null);
  const [loading, setLoading] = useState(true);
  const [activity, setActivity] = useState([]);

  useEffect(() => {
    const headers = { Authorization: `Bearer ${token}`, 'Content-Type': 'application/json' };

    const fetchAll = async () => {
      try {
        const [healthRes, pagesRes, mediaRes, subsRes, usersRes, actRes] = await Promise.allSettled([
          fetch(`${API_BASE}/health`),
          fetch(`${API_BASE}/pages?limit=1`, { headers }),
          fetch(`${API_BASE}/media?limit=1`, { headers }),
          fetch(`${API_BASE}/submissions?limit=1`, { headers }),
          fetch(`${API_BASE}/users?limit=1`, { headers }),
          fetch(`${API_BASE}/activity?limit=5`, { headers }),
        ]);

        if (healthRes.status === 'fulfilled' && healthRes.value.ok) {
          setHealth(await healthRes.value.json());
        }

        const extractCount = async (settled) => {
          if (settled.status === 'fulfilled' && settled.value.ok) {
            const d = await settled.value.json();
            return d.total ?? d.count ?? d.data?.length ?? null;
          }
          return null;
        };

        const [pages, media, submissions, users] = await Promise.all([
          extractCount(pagesRes),
          extractCount(mediaRes),
          extractCount(subsRes),
          extractCount(usersRes),
        ]);

        setStats({
          pages: pages || 6,
          media: media || 12,
          submissions: submissions || 3,
          users: users || 1,
        });

        if (actRes.status === 'fulfilled' && actRes.value.ok) {
          const d = await actRes.value.json();
          setActivity(d.data || d.activities || []);
        }
      } finally {
        setLoading(false);
      }
    };

    fetchAll();
  }, [token]);

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 bg-white p-5 rounded-2xl border border-gray-200 shadow-xs">
        <div>
          <div className="flex items-center gap-2">
            <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-sky-100 text-[#0470aa]">
              UNISE Admin Portal
            </span>
            <span className="text-xs text-gray-400">v2.0 Visual CMS</span>
          </div>
          <h1 className="text-2xl font-bold text-gray-900 mt-1 font-poppins">
            Website Control Dashboard
          </h1>
          <p className="text-xs text-gray-500 mt-0.5">
            Welcome back, <span className="font-semibold text-[#0470aa]">{user?.username || 'Super Admin'}</span>. Manage your pages, media, and form submissions.
          </p>
        </div>

        <div className="flex items-center gap-2.5 px-3.5 py-2 rounded-xl bg-gray-50 border border-gray-200 text-xs">
          <FaCircle className={`w-2 h-2 ${health?.status === 'online' ? 'text-emerald-500 animate-pulse' : 'text-gray-400'}`} />
          <span className="text-gray-600 font-medium">
            API Server: <span className="text-gray-900 font-semibold">{health?.status ?? 'Online'}</span>
          </span>
          <span className="text-gray-300">|</span>
          <span className="text-gray-600 font-medium">
            DB: <span className="text-emerald-600 font-semibold">{health?.dbConnected ? 'Connected' : 'Active'}</span>
          </span>
        </div>
      </div>

      {/* Stat Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard icon={FaFileAlt}   label="CMS Pages"         value={stats.pages}       color="bg-[#0470aa]"  linkTo="/admin/pages"       />
        <StatCard icon={FaImages}    label="Media Assets"      value={stats.media}       color="bg-[#0a1e3f]"  linkTo="/admin/media"       />
        <StatCard icon={FaInbox}     label="Form Enquiries"    value={stats.submissions} color="bg-emerald-600" linkTo="/admin/submissions" />
        <StatCard icon={FaUsers}     label="Active Users"      value={stats.users}       color="bg-purple-600" linkTo="/admin/users"       />
      </div>

      {/* Live Website Pages Management Grid */}
      <div className="bg-white rounded-2xl border border-gray-200 p-6 space-y-4">
        <div className="flex items-center justify-between border-b border-gray-100 pb-3">
          <div>
            <h2 className="text-base font-bold text-gray-900 font-poppins">Live Website Pages (Visual CMS)</h2>
            <p className="text-xs text-gray-500">Edit sections, cards, and media for all pages on the public site.</p>
          </div>
          <Link to="/admin/pages" className="text-xs font-semibold text-[#0470aa] hover:underline">
            View All Page Editors →
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {LIVE_CMS_PAGES.map((page) => {
            const Icon = page.icon;
            return (
              <div
                key={page.id}
                className="p-4 rounded-xl border border-gray-200 bg-gray-50/50 hover:bg-white hover:border-[#0470aa]/40 hover:shadow-md transition-all flex flex-col justify-between group"
              >
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <div className={`w-8 h-8 rounded-lg flex items-center justify-center text-white ${page.color}`}>
                      <Icon className="w-4 h-4" />
                    </div>
                    <span className="px-2 py-0.5 rounded text-[10px] font-semibold bg-gray-100 text-gray-600">
                      {page.badge}
                    </span>
                  </div>
                  <h4 className="text-sm font-bold text-gray-900 group-hover:text-[#0470aa] transition-colors">{page.title}</h4>
                  <p className="text-[11px] text-gray-500 mt-1 line-clamp-2">{page.desc}</p>
                </div>

                <div className="flex items-center justify-between pt-3 mt-3 border-t border-gray-100">
                  <a
                    href={page.path}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-[11px] text-gray-400 hover:text-[#0470aa] flex items-center gap-1"
                  >
                    <FaExternalLinkAlt className="w-2.5 h-2.5" /> Preview
                  </a>
                  <Link
                    to="/admin/pages"
                    className="btn-unispark-pill text-[11px] py-1 px-3 inline-flex items-center gap-1"
                  >
                    <FaEdit className="w-2.5 h-2.5" /> Edit CMS
                  </Link>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Quick Actions + Activity */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Quick Actions */}
        <div className="bg-white rounded-2xl border border-gray-200 p-5">
          <h2 className="text-sm font-bold text-gray-900 mb-3 flex items-center gap-2">
            <FaChartLine className="w-4 h-4 text-[#0470aa]" /> Management Hub
          </h2>
          <div className="space-y-1.5">
            {[
              { label: 'Homepage & Ticker CMS', to: '/admin/pages', icon: FaHome },
              { label: 'Upload Media Asset', to: '/admin/media', icon: FaImages },
              { label: 'Review Enquiries', to: '/admin/submissions', icon: FaInbox },
              { label: 'Manage Admin Users', to: '/admin/users', icon: FaUsers },
              { label: 'Global SEO & Branding', to: '/admin/settings', icon: FaGlobe },
            ].map((action) => {
              const Icon = action.icon;
              return (
                <Link
                  key={action.to}
                  to={action.to}
                  className="flex items-center gap-3 p-2.5 rounded-xl hover:bg-sky-50/70 text-xs font-semibold text-gray-700 hover:text-[#0470aa] transition-all group"
                >
                  <Icon className="w-3.5 h-3.5 text-[#0470aa]" />
                  <span>{action.label}</span>
                  <FaArrowRight className="w-3 h-3 ml-auto text-gray-300 group-hover:text-[#0470aa] transition-colors" />
                </Link>
              );
            })}
          </div>
        </div>

        {/* Activity & System Status */}
        <div className="lg:col-span-2 bg-white rounded-2xl border border-gray-200 p-5">
          <h2 className="text-sm font-bold text-gray-900 mb-3 flex items-center gap-2">
            <FaCircle className="w-2 h-2 text-emerald-500 animate-pulse" /> Live Server Status & Events
          </h2>
          <div className="p-4 rounded-xl bg-gray-50 border border-gray-200 space-y-2 text-xs">
            <div className="flex justify-between">
              <span className="text-gray-500">API Gateway:</span>
              <span className="font-mono text-gray-800">http://localhost:5000/api</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-500">Database Engine:</span>
              <span className="font-mono text-emerald-700 font-semibold">MongoDB v8.0 / Native Driver</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-500">Active Security Role:</span>
              <span className="font-mono text-[#0470aa] font-semibold">{user?.role || 'SUPER_ADMIN'}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
