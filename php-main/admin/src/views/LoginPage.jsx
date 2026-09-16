import React, { useState } from 'react';
import { Lock, Mail, User, Shield, ArrowRight, AlertCircle, CheckCircle, Eye, EyeOff } from 'lucide-react';
import { loginUser, registerUser } from '../services/api';

export default function LoginPage({ onLoginSuccess, onShowToast }) {
  const [isRegisterMode, setIsRegisterMode] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    role: 'Admin'
  });
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

    if (!formData.email || !formData.password) {
      setErrorMsg('Please provide both Email and Password.');
      setLoading(false);
      return;
    }

    if (isRegisterMode) {
      // Register Mode
      if (!formData.name) {
        setErrorMsg('Please enter your Full Name.');
        setLoading(false);
        return;
      }

      const res = await registerUser(formData);
      setLoading(false);

      if (res.success && res.user) {
        localStorage.setItem('admin_token', res.token || 'demo-jwt-token');
        localStorage.setItem('admin_user', JSON.stringify(res.user));
        onShowToast(`Registration successful! Welcome, ${res.user.name}`);
        onLoginSuccess(res.user);
      } else {
        setErrorMsg(res.message || 'Registration failed. Email may already exist.');
      }
    } else {
      // Login Mode
      const res = await loginUser({ email: formData.email, password: formData.password });
      setLoading(false);

      if (res.success && res.user) {
        localStorage.setItem('admin_token', res.token || 'demo-jwt-token');
        localStorage.setItem('admin_user', JSON.stringify(res.user));
        onShowToast(`Login successful! Welcome back, ${res.user.name}`);
        onLoginSuccess(res.user);
      } else {
        setErrorMsg(res.message || 'Invalid Email or Password. Please try again.');
      }
    }
  };


  return (
    <div style={{
      minHeight: '100vh',
      width: '100vw',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      background: 'radial-gradient(circle at top right, #1e1b4b, #0f172a 70%)',
      fontFamily: "'Inter', sans-serif",
      padding: '1.5rem',
      boxSizing: 'border-box'
    }}>
      <div className="content-card" style={{
        width: '440px',
        maxWidth: '100%',
        borderRadius: '20px',
        border: '1px solid var(--border-light)',
        boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.5)',
        overflow: 'hidden'
      }}>
        {/* Top Header Banner */}
        <div style={{
          padding: '2.5rem 2rem 1.5rem 2rem',
          textAlign: 'center',
          backgroundColor: 'var(--bg-card-header)',
          borderBottom: '1px solid var(--border-color)'
        }}>
          <div className="logo-badge" style={{
            margin: '0 auto 1rem auto',
            width: '52px',
            height: '52px',
            fontSize: '1.5rem',
            boxShadow: '0 8px 20px rgba(99, 102, 241, 0.4)'
          }}>U</div>
          
          <h1 style={{ fontSize: '1.5rem', fontWeight: 700, color: 'var(--text-main)', letterSpacing: '-0.02em' }}>
            UNISE Admin Portal
          </h1>
          <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)', marginTop: '0.35rem' }}>
            {isRegisterMode ? 'Register new credentials for MongoDB Atlas' : 'Sign in to access your administrative dashboard'}
          </p>
        </div>

        {/* Form Body */}
        <div className="content-card-body" style={{ padding: '2rem' }}>
          
          {errorMsg && (
            <div style={{
              display: 'flex',
              alignItems: 'center',
              gap: '0.6rem',
              padding: '0.75rem 1rem',
              borderRadius: 'var(--radius-md)',
              backgroundColor: 'rgba(239, 68, 68, 0.15)',
              border: '1px solid rgba(239, 68, 68, 0.3)',
              color: 'var(--danger)',
              fontSize: '0.85rem',
              marginBottom: '1.25rem'
            }}>
              <AlertCircle size={18} style={{ flexShrink: 0 }} />
              <span>{errorMsg}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
            
            {/* Full Name Input (Register mode only) */}
            {isRegisterMode && (
              <div className="form-group">
                <label className="form-label" htmlFor="login-name">Full Name</label>
                <div style={{ position: 'relative' }}>
                  <User size={18} style={{ position: 'absolute', left: '0.9rem', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
                  <input
                    id="login-name"
                    name="name"
                    type="text"
                    className="form-control"
                    style={{ paddingLeft: '2.6rem' }}
                    placeholder="Sumit Kumar"
                    value={formData.name}
                    onChange={handleChange}
                    required
                  />
                </div>
              </div>
            )}

            {/* Email Address Input */}
            <div className="form-group">
              <label className="form-label" htmlFor="login-email">Email Address / User ID</label>
              <div style={{ position: 'relative' }}>
                <Mail size={18} style={{ position: 'absolute', left: '0.9rem', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
                <input
                  id="login-email"
                  name="email"
                  type="email"
                  className="form-control"
                  style={{ paddingLeft: '2.6rem' }}
                  placeholder="admin@example.com"
                  value={formData.email}
                  onChange={handleChange}
                  required
                />
              </div>
            </div>

            {/* Password Input */}
            <div className="form-group">
              <label className="form-label" htmlFor="login-password">Password</label>
              <div style={{ position: 'relative' }}>
                <Lock size={18} style={{ position: 'absolute', left: '0.9rem', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
                <input
                  id="login-password"
                  name="password"
                  type={showPassword ? 'text' : 'password'}
                  className="form-control"
                  style={{ paddingLeft: '2.6rem', paddingRight: '2.5rem' }}
                  placeholder="••••••••"
                  value={formData.password}
                  onChange={handleChange}
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  style={{
                    position: 'absolute',
                    right: '0.8rem',
                    top: '50%',
                    transform: 'translateY(-50%)',
                    color: 'var(--text-muted)',
                    background: 'none',
                    border: 'none',
                    cursor: 'pointer'
                  }}
                >
                  {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
            </div>

            {/* Role Select (Register mode only) */}
            {isRegisterMode && (
              <div className="form-group">
                <label className="form-label" htmlFor="login-role">Account Role</label>
                <select
                  id="login-role"
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
              style={{
                width: '100%',
                padding: '0.85rem',
                fontSize: '1rem',
                marginTop: '0.5rem',
                justifyContent: 'center',
                borderRadius: 'var(--radius-md)'
              }}
              disabled={loading}
            >
              {loading ? (
                <span>Verifying Credentials...</span>
              ) : (
                <>
                  <span>{isRegisterMode ? 'Register & Access Dashboard' : 'Sign In to Dashboard'}</span>
                  <ArrowRight size={18} />
                </>
              )}
            </button>

            {/* Toggle Mode */}
            <div style={{ textAlign: 'center', marginTop: '0.75rem', fontSize: '0.875rem' }}>
              <span style={{ color: 'var(--text-muted)' }}>
                {isRegisterMode ? 'Already have an account? ' : "Don't have an account? "}
              </span>
              <button
                type="button"
                onClick={() => { setIsRegisterMode(!isRegisterMode); setErrorMsg(''); }}
                style={{ color: 'var(--primary)', fontWeight: 600, background: 'none', border: 'none', cursor: 'pointer' }}
              >
                {isRegisterMode ? 'Sign In' : 'Create One'}
              </button>
            </div>

          </form>

        </div>
      </div>
    </div>
  );
}
