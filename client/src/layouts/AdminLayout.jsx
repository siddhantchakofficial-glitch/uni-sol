import React, { useState } from 'react';
import { Outlet, Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import {
  FaTachometerAlt, FaFileAlt, FaImages, FaWpforms,
  FaInbox, FaCog, FaUsers, FaBars, FaTimes,
  FaSignOutAlt, FaChevronRight, FaBell, FaSearch
} from 'react-icons/fa';

const NAV_ITEMS = [
  { label: 'Dashboard', path: '/admin/dashboard', icon: FaTachometerAlt },
  { label: 'Pages (Visual CMS)', path: '/admin/pages', icon: FaFileAlt },
  { label: 'Media Library', path: '/admin/media', icon: FaImages },
  { label: 'Form Enquiries', path: '/admin/submissions', icon: FaInbox },
  { label: 'User Management', path: '/admin/users', icon: FaUsers },
  { label: 'Global Settings', path: '/admin/settings', icon: FaCog },
];

export const AdminLayout = () => {
  const { user, logout } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [mobileOpen, setMobileOpen] = useState(false);

  const handleLogout = async () => {
    await logout();
    navigate('/admin/login', { replace: true });
  };

  const SidebarContent = () => (
    <div className="flex flex-col h-full">
      {/* Logo */}
      <div className="px-5 py-5 border-b border-[#e5e7eb]">
        <Link to="/admin/dashboard" className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-lg bg-[#0470aa] flex items-center justify-center text-white font-bold text-sm flex-shrink-0">
            U
          </div>
          {sidebarOpen && (
            <div>
              <span className="font-bold text-[#000000] text-sm font-poppins">UniSpark</span>
              <span className="block text-[10px] text-[#6e6e6e] uppercase tracking-wider">CMS Admin</span>
            </div>
          )}
        </Link>
      </div>

      {/* Navigation */}
      <nav className="flex-1 px-3 py-4 space-y-1 overflow-y-auto">
        {NAV_ITEMS.map((item) => {
          const Icon = item.icon;
          const isActive = location.pathname === item.path || location.pathname.startsWith(item.path + '/');
          return (
            <Link
              key={item.path}
              to={item.path}
              onClick={() => setMobileOpen(false)}
              className={`flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all group ${
                isActive
                  ? 'bg-[#e9f4fb] text-[#0470aa] font-semibold'
                  : 'text-[#475467] hover:bg-[#f4f8fb] hover:text-[#0470aa]'
              }`}
            >
              <Icon className={`w-4 h-4 flex-shrink-0 ${isActive ? 'text-[#0470aa]' : 'text-[#6e6e6e] group-hover:text-[#0470aa]'}`} />
              {sidebarOpen && <span>{item.label}</span>}
              {sidebarOpen && isActive && <FaChevronRight className="w-2.5 h-2.5 ml-auto text-[#0470aa]/60" />}
            </Link>
          );
        })}
      </nav>

      {/* User Footer */}
      <div className="px-3 py-4 border-t border-[#e5e7eb]">
        <div className={`flex items-center gap-3 px-3 py-2 rounded-xl ${sidebarOpen ? '' : 'justify-center'}`}>
          <div className="w-8 h-8 rounded-full bg-[#0470aa] text-white flex items-center justify-center text-xs font-bold flex-shrink-0">
            {user?.username?.charAt(0).toUpperCase() || 'A'}
          </div>
          {sidebarOpen && (
            <div className="flex-1 min-w-0">
              <p className="text-xs font-semibold text-[#000000] truncate">{user?.username || 'Admin'}</p>
              <p className="text-[10px] text-[#6e6e6e] truncate">{user?.email}</p>
            </div>
          )}
          {sidebarOpen && (
            <button
              onClick={handleLogout}
              className="text-gray-400 hover:text-red-500 transition-colors p-1"
              title="Sign out"
            >
              <FaSignOutAlt className="w-3.5 h-3.5" />
            </button>
          )}
        </div>
        {!sidebarOpen && (
          <button
            onClick={handleLogout}
            className="w-full flex justify-center mt-2 text-gray-400 hover:text-red-500 transition-colors p-2"
            title="Sign out"
          >
            <FaSignOutAlt className="w-4 h-4" />
          </button>
        )}
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-[#f4f8fb] flex font-poppins">
      {/* Desktop Sidebar */}
      <aside
        className={`hidden lg:flex flex-col bg-white border-r border-[#e5e7eb] transition-all duration-300 flex-shrink-0 ${
          sidebarOpen ? 'w-60' : 'w-16'
        }`}
      >
        <SidebarContent />
      </aside>

      {/* Mobile Sidebar Overlay */}
      {mobileOpen && (
        <div className="fixed inset-0 z-50 lg:hidden">
          <div className="absolute inset-0 bg-black/40" onClick={() => setMobileOpen(false)} />
          <aside className="absolute left-0 top-0 bottom-0 w-64 bg-white border-r border-[#e5e7eb] flex flex-col shadow-2xl">
            <SidebarContent />
          </aside>
        </div>
      )}

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Top Header Bar */}
        <header className="bg-white border-b border-[#e5e7eb] px-4 sm:px-6 py-3.5 flex items-center justify-between flex-shrink-0 shadow-xs">
          <div className="flex items-center gap-3">
            {/* Mobile hamburger */}
            <button
              onClick={() => setMobileOpen(true)}
              className="lg:hidden p-2 rounded-lg text-gray-500 hover:bg-[#f4f8fb] transition-colors"
            >
              <FaBars className="w-4 h-4" />
            </button>
            {/* Desktop sidebar toggle */}
            <button
              onClick={() => setSidebarOpen((p) => !p)}
              className="hidden lg:flex p-2 rounded-lg text-gray-500 hover:bg-[#f4f8fb] transition-colors"
            >
              {sidebarOpen ? <FaTimes className="w-4 h-4" /> : <FaBars className="w-4 h-4" />}
            </button>

            <Link to="/" className="text-xs text-[#0470aa] hover:underline hidden sm:inline">
              ← Back to Website
            </Link>
          </div>

          <div className="flex items-center gap-3">
            <button className="p-2 rounded-lg text-gray-400 hover:bg-[#f4f8fb] hover:text-[#0470aa] transition-colors relative">
              <FaBell className="w-4 h-4" />
            </button>
            <div className="flex items-center gap-2.5 pl-3 border-l border-gray-100">
              <div className="w-7 h-7 rounded-full bg-[#0470aa] text-white flex items-center justify-center text-xs font-bold">
                {user?.username?.charAt(0).toUpperCase() || 'A'}
              </div>
              <span className="text-sm font-medium text-[#262626] hidden sm:inline">{user?.username}</span>
            </div>
            <button
              onClick={handleLogout}
              className="hidden sm:flex items-center gap-1.5 text-xs text-gray-400 hover:text-red-500 transition-colors px-2 py-1 rounded-lg hover:bg-red-50"
            >
              <FaSignOutAlt className="w-3.5 h-3.5" />
              <span>Sign out</span>
            </button>
          </div>
        </header>

        {/* Page Content */}
        <main className="flex-1 p-4 sm:p-6 overflow-auto">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default AdminLayout;
