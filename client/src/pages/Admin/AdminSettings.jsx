import React, { useEffect, useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { FaCog, FaSave } from 'react-icons/fa';

const API_BASE = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000/api';

export const AdminSettings = () => {
  const { token } = useAuth();
  const [settings, setSettings] = useState({});
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [msg, setMsg] = useState('');

  useEffect(() => {
    const fetchSettings = async () => {
      try {
        const res = await fetch(`${API_BASE}/settings`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        if (res.ok) {
          const d = await res.json();
          setSettings(d.data || d.settings || d || {});
        }
      } finally {
        setLoading(false);
      }
    };
    fetchSettings();
  }, [token]);

  const handleSave = async () => {
    setSaving(true);
    try {
      const res = await fetch(`${API_BASE}/settings`, {
        method: 'PUT',
        headers: { Authorization: `Bearer ${token}`, 'Content-Type': 'application/json' },
        body: JSON.stringify(settings),
      });
      if (res.ok) setMsg('Settings saved successfully.');
      else setMsg('Failed to save settings.');
    } catch {
      setMsg('Error connecting to server.');
    } finally {
      setSaving(false);
      setTimeout(() => setMsg(''), 3000);
    }
  };

  const fields = [
    { key: 'siteName', label: 'Site Name', type: 'text' },
    { key: 'siteEmail', label: 'Contact Email', type: 'email' },
    { key: 'sitePhone', label: 'Contact Phone', type: 'text' },
    { key: 'siteAddress', label: 'Address', type: 'text' },
    { key: 'googleAnalyticsId', label: 'Google Analytics ID', type: 'text' },
    { key: 'metaDescription', label: 'Default Meta Description', type: 'textarea' },
  ];

  return (
    <div className="space-y-5 max-w-2xl">
      <div>
        <h1 className="text-2xl font-bold text-[#000000] font-poppins flex items-center gap-2">
          <FaCog className="text-[#0470aa] w-5 h-5" /> Site Settings
        </h1>
        <p className="text-sm text-[#6e6e6e] mt-0.5">Manage global site configuration</p>
      </div>

      {msg && (
        <div className={`p-3.5 rounded-xl text-sm border ${msg.includes('success') ? 'bg-emerald-50 border-emerald-200 text-emerald-700' : 'bg-red-50 border-red-200 text-red-700'}`}>
          {msg}
        </div>
      )}

      <div className="bg-white rounded-2xl border border-[#e5e7eb] p-6 space-y-5">
        {loading ? (
          <div className="space-y-4">
            {Array.from({ length: 4 }).map((_, i) => (
              <div key={i} className="h-10 bg-gray-100 rounded-xl animate-pulse" />
            ))}
          </div>
        ) : (
          fields.map(({ key, label, type }) => (
            <div key={key}>
              <label className="block text-xs font-semibold text-[#262626] mb-1.5 uppercase tracking-wide">
                {label}
              </label>
              {type === 'textarea' ? (
                <textarea
                  rows={3}
                  value={settings[key] || ''}
                  onChange={(e) => setSettings((p) => ({ ...p, [key]: e.target.value }))}
                  className="w-full px-3.5 py-3 rounded-xl border border-[#e5e7eb] text-sm text-[#262626] focus:outline-none focus:ring-2 focus:ring-[#0470aa]/30 focus:border-[#0470aa] bg-[#f9fafb] resize-none"
                />
              ) : (
                <input
                  type={type}
                  value={settings[key] || ''}
                  onChange={(e) => setSettings((p) => ({ ...p, [key]: e.target.value }))}
                  className="w-full px-3.5 py-3 rounded-xl border border-[#e5e7eb] text-sm text-[#262626] focus:outline-none focus:ring-2 focus:ring-[#0470aa]/30 focus:border-[#0470aa] bg-[#f9fafb]"
                />
              )}
            </div>
          ))
        )}

        <div className="pt-2 border-t border-[#e5e7eb]">
          <button
            onClick={handleSave}
            disabled={saving || loading}
            className="btn-unispark-pill text-xs py-2.5 px-6 inline-flex items-center gap-2 disabled:opacity-60"
          >
            <FaSave className="w-3.5 h-3.5" />
            {saving ? 'Saving…' : 'Save Settings'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default AdminSettings;
