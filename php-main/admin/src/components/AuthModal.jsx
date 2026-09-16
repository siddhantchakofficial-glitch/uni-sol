import React, { useState } from 'react';
import { Lock, Mail, User, Shield, ArrowRight, CheckCircle, AlertCircle } from 'lucide-react';
import { loginUser, registerUser } from '../services/api';

export default function AuthModal({ onAuthSuccess, onShowToast }) {
  const [isLoginTab, setIsLoginTab] = useState(true);
  const [formData, setFormData] = useState({ name: '', email: '', password: '', role: 'Admin' });
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    setErrorMsg('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setErrorMsg('');

    if (isLoginTab) {
      // Login
      const res = await loginUser({ email: formData.email, password: formData.password });
      setLoading(false);
      if (res.success && res.user) {
        localStorage.setItem('admin_token', res.token || 'demo-token');
        localStorage.setItem('admin_user', JSON.stringify(res.user));
        onShowToast(`Welcome back, ${res.user.name}!`);
        onAuthSuccess(res.user);
      } else {
        setErrorMsg(res.message || 'Login failed. Please check credentials.');
      }
    } else {
      // Register
      if (!formData.name || !formData.email || !formData.password) {
        setErrorMsg('Please complete all required fields.');
        setLoading(false);
        return;
      }
      const res = await registerUser(formData);
      setLoading(false);
      if (res.success && res.user) {
        localStorage.setItem('admin_token', res.token || 'demo-token');
        localStorage.setItem('admin_user', JSON.stringify(res.user));
        onShowToast(`Account created for ${res.user.name}!`);
        onAuthSuccess(res.user);
      } else {
        setErrorMsg(res.message || 'Registration failed.');
      }
    }
  };

  // Demo Login Quick Fill
  const handleDemoLogin = () => {
    const demoUser = {
      _id: '1',
      name: 'Sumit Kumar',
      email: 'sumit.kumar@example.com',
      role: 'Super Admin',
      status: 'Active'
    };
    localStorage.setItem('admin_token', 'demo-token');
    localStorage.setItem('admin_user', JSON.stringify(demoUser));
    onShowToast('Logged in as Sumit Kumar (Demo)');
    onAuthSuccess(demoUser);
  };

  return (
    <div style={{
      position: 'fixed',
      inset: 0,
      backgroundColor: 'rgba(15, 23, 42, 0.85)',
      backdropFilter: 'blur(8px)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      zIndex: 2000,
      padding: '1rem'
    }}>
      <div className="content-card" style={{ width: '420px', maxWidth: '100%', borderRadius: '16px', border: '1px solid var(--border-light)' }}>

        {/* Modal Header Tabs */}
        <div style={{
          display: 'flex',
          borderBottom: '1px solid var(--border-color)',
          backgroundColor: 'var(--bg-card-header)'
        }}>
          <button
            onClick={() => { setIsLoginTab(true); setErrorMsg(''); }}
            style={{
              flex: 1,
              padding: '1rem',
              fontWeight: 600,
              fontSize: '0.95rem',
              color: isLoginTab ? 'var(--primary)' : 'var(--text-muted)',
              borderBottom: isLoginTab ? '2px solid var(--primary)' : 'none',
              backgroundColor: isLoginTab ? 'var(--bg-card)' : 'transparent',
              transition: 'var(--transition)'
            }}
          >
            Sign In
          </button>
          <button
            onClick={() => { setIsLoginTab(false); setErrorMsg(''); }}
            style={{
              flex: 1,
              padding: '1rem',
              fontWeight: 600,
              fontSize: '0.95rem',
              color: !isLoginTab ? 'var(--primary)' : 'var(--text-muted)',
              borderBottom: !isLoginTab ? '2px solid var(--primary)' : 'none',
              backgroundColor: !isLoginTab ? 'var(--bg-card)' : 'transparent',
              transition: 'var(--transition)'
            }}
          >
            Register Account
          </button>
        </div>

        {/* Modal Form Body */}
        <div className="content-card-body" style={{ padding: '1.75rem' }}>

          <div style={{ textAlign: 'center', marginBottom: '1.25rem' }}>
            <div className="logo-badge" style={{ margin: '0 auto 0.75rem auto', width: '44px', height: '44px', fontSize: '1.3rem' }}>U</div>
            <h2 style={{ fontSize: '1.25rem', fontWeight: 700 }}>
              {isLoginTab ? 'Admin Panel Login' : 'Create Admin Account'}
            </h2>
            <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginTop: '0.25rem' }}>
              {isLoginTab ? 'Enter your credentials to access UNISE Admin' : 'Register a new administrator into MongoDB Atlas'}
            </p>
          </div>

          {errorMsg && (
            <div style={{
              display: 'flex',
              alignItems: 'center',
              gap: '0.5rem',
              padding: '0.65rem 0.85rem',
              borderRadius: 'var(--radius-md)',
              backgroundColor: 'rgba(239, 68, 68, 0.15)',
              border: '1px solid rgba(239, 68, 68, 0.3)',
              color: 'var(--danger)',
              fontSize: '0.825rem',
              marginBottom: '1rem'
            }}>
              <AlertCircle size={16} />
              <span>{errorMsg}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>

            {/* Name Input (Register only) */}
            {!isLoginTab && (
              <div className="form-group">
                <label className="form-label" htmlFor="auth-name">Full Name</label>
                <div style={{ position: 'relative' }}>
                  <User size={16} style={{ position: 'absolute', left: '0.8rem', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
                  <input
                    id="auth-name"
                    name="name"
                    type="text"
                    className="form-control"
                    style={{ paddingLeft: '2.4rem' }}
                    placeholder="Sumit Kumar"
                    value={formData.name}
                    onChange={handleChange}
                    required
                  />
                </div>
              </div>
            )}

            {/* Email Input */}
            <div className="form-group">
              <label className="form-label" htmlFor="auth-email">Email Address</label>
              <div style={{ position: 'relative' }}>
                <Mail size={16} style={{ position: 'absolute', left: '0.8rem', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
                <input
                  id="auth-email"
                  name="email"
                  type="email"
                  className="form-control"
                  style={{ paddingLeft: '2.4rem' }}
                  placeholder="admin@example.com"
                  value={formData.email}
                  onChange={handleChange}
                  required
                />
              </div>
            </div>

            {/* Password Input */}
            <div className="form-group">
              <label className="form-label" htmlFor="auth-password">Password</label>
              <div style={{ position: 'relative' }}>
                <Lock size={16} style={{ position: 'absolute', left: '0.8rem', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
                <input
                  id="auth-password"
                  name="password"
                  type="password"
                  className="form-control"
                  style={{ paddingLeft: '2.4rem' }}
                  placeholder="••••••••"
                  value={formData.password}
                  onChange={handleChange}
                  required
                />
              </div>
            </div>

            {/* Role Select (Register only) */}
            {!isLoginTab && (
              <div className="form-group">
                <label className="form-label" htmlFor="auth-role">Account Role</label>
                <select
                  id="auth-role"
                  name="role"
                  className="form-control"
                  value={formData.role}
                  onChange={handleChange}
                >
                  <option value="Super Admin">Super Admin</option>
                  <option value="Admin">Admin</option>
                  <option value="Editor">Editor</option>
                </select>
              </div>
            )}

            {/* Submit Button */}
            <button
              type="submit"
              className="btn-primary"
              style={{ width: '100%', marginTop: '0.5rem', justifyContent: 'center' }}
              disabled={loading}
            >
              {loading ? (
                <span>Processing...</span>
              ) : (
                <>
                  <span>{isLoginTab ? 'Sign In to Admin' : 'Create Account'}</span>
                  <ArrowRight size={16} />
                </>
              )}
            </button>

            {/* Quick Demo Option
            <div style={{ textAlign: 'center', marginTop: '0.5rem' }}>
              <button
                type="button"
                onClick={handleDemoLogin}
                style={{ fontSize: '0.8rem', color: 'var(--text-muted)', textDecoration: 'underline' }}
              >
                Or Quick Login as Sumit Kumar
              </button>
            </div> */}

          </form>

        </div>
      </div>
    </div>
  );
}
