import React, { useState } from 'react';
import { useNavigate, Navigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { FaLock, FaEnvelope, FaEye, FaEyeSlash, FaShieldAlt } from 'react-icons/fa';

export const AdminLogin = () => {
  const { login, isAuthenticated, loading } = useAuth();
  const navigate = useNavigate();

  const [form, setForm] = useState({ email: '', password: '' });
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [submitting, setSubmitting] = useState(false);

  // If already authenticated, go to dashboard
  if (!loading && isAuthenticated) {
    return <Navigate to="/admin/dashboard" replace />;
  }

  const handleChange = (e) => {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
    setError('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.email || !form.password) {
      setError('Please enter your email and password.');
      return;
    }
    setSubmitting(true);
    setError('');
    try {
      await login(form.email.trim(), form.password);
      navigate('/admin/dashboard', { replace: true });
    } catch (err) {
      setError(err.message || 'Invalid credentials. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#f4f8fb] flex items-center justify-center p-4">
      {/* Background decoration */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-40 w-96 h-96 rounded-full bg-[#0470aa]/5 blur-3xl" />
        <div className="absolute -bottom-40 -left-40 w-96 h-96 rounded-full bg-[#0a1e3f]/5 blur-3xl" />
      </div>

      <div className="w-full max-w-md relative">
        {/* Logo + Brand */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-[#0470aa] text-white shadow-xl shadow-[#0470aa]/30 mb-4">
            <FaShieldAlt className="w-7 h-7" />
          </div>
          <h1 className="text-2xl font-bold text-[#000000] font-poppins">
            UniSpark CMS
          </h1>
          <p className="text-sm text-[#6e6e6e] mt-1">Admin Control Panel</p>
        </div>

        {/* Card */}
        <div className="bg-white rounded-2xl shadow-xl border border-[#e5e7eb] p-8">
          <h2 className="text-lg font-semibold text-[#000000] mb-6">Sign in to continue</h2>

          {error && (
            <div className="mb-5 p-3.5 rounded-xl bg-red-50 border border-red-200 text-sm text-red-700 flex items-start gap-2">
              <FaLock className="w-3.5 h-3.5 mt-0.5 flex-shrink-0 text-red-400" />
              <span>{error}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-5">
            {/* Email */}
            <div>
              <label htmlFor="cms-email" className="block text-xs font-semibold text-[#262626] mb-1.5 uppercase tracking-wide">
                Email Address
              </label>
              <div className="relative">
                <FaEnvelope className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                <input
                  id="cms-email"
                  type="email"
                  name="email"
                  value={form.email}
                  onChange={handleChange}
                  placeholder="admin@unispark.com"
                  autoComplete="email"
                  className="w-full pl-10 pr-4 py-3 rounded-xl border border-[#e5e7eb] text-sm text-[#262626] placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#0470aa]/30 focus:border-[#0470aa] transition-all bg-[#f9fafb]"
                  required
                />
              </div>
            </div>

            {/* Password */}
            <div>
              <label htmlFor="cms-password" className="block text-xs font-semibold text-[#262626] mb-1.5 uppercase tracking-wide">
                Password
              </label>
              <div className="relative">
                <FaLock className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                <input
                  id="cms-password"
                  type={showPassword ? 'text' : 'password'}
                  name="password"
                  value={form.password}
                  onChange={handleChange}
                  placeholder="••••••••"
                  autoComplete="current-password"
                  className="w-full pl-10 pr-11 py-3 rounded-xl border border-[#e5e7eb] text-sm text-[#262626] placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#0470aa]/30 focus:border-[#0470aa] transition-all bg-[#f9fafb]"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword((p) => !p)}
                  className="absolute right-3.5 top-1/2 -translate-y-1/2 text-gray-400 hover:text-[#0470aa] transition-colors"
                  aria-label="Toggle password visibility"
                >
                  {showPassword ? <FaEyeSlash className="w-4 h-4" /> : <FaEye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            {/* Submit */}
            <button
              type="submit"
              disabled={submitting}
              className="w-full btn-unispark-pill py-3 text-sm disabled:opacity-60 disabled:cursor-not-allowed mt-2"
            >
              {submitting ? (
                <span className="flex items-center justify-center gap-2">
                  <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24" fill="none">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"/>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"/>
                  </svg>
                  Signing in...
                </span>
              ) : (
                'SIGN IN'
              )}
            </button>
          </form>

          {/* Dev hint */}
          <p className="text-xs text-center text-gray-400 mt-6 border-t border-gray-100 pt-4">
            Default: <span className="font-mono text-[#0470aa]">admin@unispark.com</span> / <span className="font-mono text-[#0470aa]">Admin@123456</span>
          </p>
        </div>

        <p className="text-center text-xs text-gray-400 mt-5">
          © {new Date().getFullYear()} UniSpark Innovation — CMS v1.0
        </p>
      </div>
    </div>
  );
};

export default AdminLogin;
