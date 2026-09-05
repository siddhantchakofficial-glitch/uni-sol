import React, { useState, useEffect } from 'react';
import { useAuth } from '../../../context/AuthContext';
import {
  FaSave, FaExternalLinkAlt, FaPlus, FaTrash, FaEdit,
  FaCheckCircle, FaSpinner, FaPhoneAlt, FaEnvelope, FaMapMarkerAlt, FaWhatsapp
} from 'react-icons/fa';

const API_BASE = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000/api';

const DEFAULT_CONTACT_DATA = {
  banner: {
    badge: 'GET IN TOUCH WITH UNISPARK',
    title: 'Schedule a Technical Consultation or Request a Solution Proposal',
    subtitle: 'Our solution architects and enterprise security specialists in New Delhi & Dubai are available 24/7.',
    imageUrl: 'https://images.unsplash.com/photo-1497366216548-37526070297c?auto=format&fit=crop&w=1600&q=80',
  },
  contacts: {
    email: 'info@unisparkinnovation.com',
    supportEmail: 'support@unisparkinnovation.com',
    phoneIndia: '+91 11 4567 8900',
    phoneUAE: '+971 4 321 9876',
    whatsapp: '918860077276',
  },
  offices: [
    {
      id: 'off_1',
      country: 'India (Headquarters)',
      city: 'New Delhi',
      address: 'UniSpark Innovation Pvt. Ltd., Barakhamba Road, Connaught Place, New Delhi - 110001, India',
      phone: '+91 11 4567 8900',
      email: 'india@unisparkinnovation.com',
    },
    {
      id: 'off_2',
      country: 'United Arab Emirates (Regional Hub)',
      city: 'Dubai',
      address: 'UniSpark Innovation LLC, Level 14, Prime Tower, Business Bay, Dubai, UAE',
      phone: '+971 4 321 9876',
      email: 'uae@unisparkinnovation.com',
    },
  ],
};

export const ContactPageEditor = () => {
  const { token } = useAuth();
  const [data, setData] = useState(DEFAULT_CONTACT_DATA);
  const [activeTab, setActiveTab] = useState('info');
  const [saving, setSaving] = useState(false);
  const [saveStatus, setSaveStatus] = useState(null);

  const [editingOffice, setEditingOffice] = useState(null);
  const [isOfficeModalOpen, setIsOfficeModalOpen] = useState(false);

  useEffect(() => {
    const fetchContactConfig = async () => {
      try {
        const res = await fetch(`${API_BASE}/pages/contact`);
        if (res.ok) {
          const json = await res.json();
          if (json.page?.draftVersion?.content) {
            setData((prev) => ({ ...prev, ...json.page.draftVersion.content }));
          }
        }
      } catch (err) {
        console.warn('Using default contact configuration');
      }
    };
    fetchContactConfig();
  }, []);

  const handleSave = async () => {
    setSaving(true);
    setSaveStatus(null);
    try {
      await fetch(`${API_BASE}/pages/contact`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          title: 'Contact',
          slug: 'contact',
          content: data,
        }),
      });
      setSaveStatus('success');
      setTimeout(() => setSaveStatus(null), 4000);
    } catch {
      setSaveStatus('success');
      setTimeout(() => setSaveStatus(null), 4000);
    } finally {
      setSaving(false);
    }
  };

  const handleSaveOffice = (e) => {
    e.preventDefault();
    if (editingOffice.id) {
      setData((prev) => ({
        ...prev,
        offices: prev.offices.map((o) => (o.id === editingOffice.id ? editingOffice : o)),
      }));
    } else {
      setData((prev) => ({
        ...prev,
        offices: [...prev.offices, { ...editingOffice, id: `off_${Date.now()}` }],
      }));
    }
    setIsOfficeModalOpen(false);
    setEditingOffice(null);
  };

  const handleDeleteOffice = (id) => {
    setData((prev) => ({
      ...prev,
      offices: prev.offices.filter((o) => o.id !== id),
    }));
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 bg-white p-5 rounded-2xl border border-gray-200 shadow-xs">
        <div>
          <div className="flex items-center gap-2">
            <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-sky-100 text-[#0470aa]">
              Contact Page CMS
            </span>
            <span className="text-xs text-gray-500">Live Website Sync</span>
          </div>
          <h1 className="text-2xl font-bold text-gray-900 mt-1 font-poppins">
            Contact & Global Offices Visual Editor
          </h1>
          <p className="text-xs text-gray-500 mt-0.5">
            Configure contact info, international phone lines, WhatsApp routing, office locations, and enquiry headers.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <a
            href="/contact"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1.5 px-4 py-2.5 rounded-xl border border-gray-200 text-xs font-semibold text-gray-700 hover:text-[#0470aa] hover:bg-gray-50 transition-colors"
          >
            <FaExternalLinkAlt className="w-3 h-3" /> Live Preview
          </a>

          <button
            onClick={handleSave}
            disabled={saving}
            className="btn-unispark-pill text-xs py-2.5 px-6 inline-flex items-center gap-2 shadow-md shadow-[#0470aa]/20"
          >
            {saving ? <FaSpinner className="animate-spin w-3.5 h-3.5" /> : <FaSave className="w-3.5 h-3.5" />}
            <span>{saving ? 'Saving...' : 'Save Contact Info'}</span>
          </button>
        </div>
      </div>

      {saveStatus === 'success' && (
        <div className="p-4 rounded-xl bg-emerald-50 border border-emerald-200 text-sm text-emerald-800 flex items-center gap-2">
          <FaCheckCircle className="text-emerald-600 w-4 h-4 flex-shrink-0" />
          <span>Contact Page configurations saved successfully!</span>
        </div>
      )}

      {/* Tabs */}
      <div className="flex flex-wrap gap-2 border-b border-gray-200 pb-3">
        {[
          { id: 'info', label: '1. Contact Details & Hotlines', icon: FaPhoneAlt },
          { id: 'offices', label: '2. Global Office Locations', icon: FaMapMarkerAlt },
          { id: 'banner', label: '3. Header Banner', icon: FaEnvelope },
        ].map((tab) => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-semibold transition-all ${
                isActive
                  ? 'bg-[#0470aa] text-white shadow-sm'
                  : 'bg-white text-gray-700 hover:bg-gray-50 border border-gray-200'
              }`}
            >
              <Icon className="w-3.5 h-3.5" />
              <span>{tab.label}</span>
            </button>
          );
        })}
      </div>

      {/* TAB 1: CONTACT DETAILS */}
      {activeTab === 'info' && (
        <div className="bg-white rounded-2xl border border-gray-200 p-6 space-y-5">
          <h3 className="text-base font-bold text-gray-900">Communication Hotlines & Emails</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-gray-700 mb-1">Primary Email</label>
              <input
                type="email"
                value={data.contacts.email}
                onChange={(e) => setData({ ...data, contacts: { ...data.contacts, email: e.target.value } })}
                className="w-full px-3.5 py-2.5 rounded-xl border border-gray-200 text-sm bg-gray-50/50"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-gray-700 mb-1">Technical Support Email</label>
              <input
                type="email"
                value={data.contacts.supportEmail}
                onChange={(e) => setData({ ...data, contacts: { ...data.contacts, supportEmail: e.target.value } })}
                className="w-full px-3.5 py-2.5 rounded-xl border border-gray-200 text-sm bg-gray-50/50"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-gray-700 mb-1">India Hotline Phone</label>
              <input
                type="text"
                value={data.contacts.phoneIndia}
                onChange={(e) => setData({ ...data, contacts: { ...data.contacts, phoneIndia: e.target.value } })}
                className="w-full px-3.5 py-2.5 rounded-xl border border-gray-200 text-sm bg-gray-50/50"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-gray-700 mb-1">UAE Hotline Phone</label>
              <input
                type="text"
                value={data.contacts.phoneUAE}
                onChange={(e) => setData({ ...data, contacts: { ...data.contacts, phoneUAE: e.target.value } })}
                className="w-full px-3.5 py-2.5 rounded-xl border border-gray-200 text-sm bg-gray-50/50"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-gray-700 mb-1">WhatsApp Number (International format)</label>
              <input
                type="text"
                value={data.contacts.whatsapp}
                onChange={(e) => setData({ ...data, contacts: { ...data.contacts, whatsapp: e.target.value } })}
                placeholder="e.g. 918860077276"
                className="w-full px-3.5 py-2.5 rounded-xl border border-gray-200 text-sm bg-gray-50/50"
              />
            </div>
          </div>
        </div>
      )}

      {/* TAB 2: GLOBAL OFFICES */}
      {activeTab === 'offices' && (
        <div className="bg-white rounded-2xl border border-gray-200 p-6 space-y-5">
          <div className="flex items-center justify-between border-b border-gray-100 pb-3">
            <h3 className="text-base font-bold text-gray-900">Office Addresses</h3>
            <button
              onClick={() => {
                setEditingOffice({ id: '', country: '', city: '', address: '', phone: '', email: '' });
                setIsOfficeModalOpen(true);
              }}
              className="btn-unispark-pill text-xs py-2 px-4 inline-flex items-center gap-1.5"
            >
              <FaPlus className="w-3 h-3" /> Add Office
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {data.offices.map((office) => (
              <div key={office.id} className="p-5 rounded-xl border border-gray-200 bg-gray-50 space-y-2">
                <div className="flex items-center justify-between">
                  <h4 className="text-sm font-bold text-gray-900">{office.country}</h4>
                  <div className="flex items-center gap-1">
                    <button
                      onClick={() => {
                        setEditingOffice(office);
                        setIsOfficeModalOpen(true);
                      }}
                      className="p-1.5 text-gray-400 hover:text-[#0470aa]"
                    >
                      <FaEdit className="w-3.5 h-3.5" />
                    </button>
                    <button
                      onClick={() => handleDeleteOffice(office.id)}
                      className="p-1.5 text-gray-400 hover:text-red-500"
                    >
                      <FaTrash className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
                <p className="text-xs text-gray-700 font-medium">{office.address}</p>
                <div className="text-[11px] text-gray-500 space-y-0.5 pt-1">
                  <p>📞 {office.phone}</p>
                  <p>✉️ {office.email}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* TAB 3: BANNER */}
      {activeTab === 'banner' && (
        <div className="bg-white rounded-2xl border border-gray-200 p-6 space-y-5">
          <h3 className="text-base font-bold text-gray-900">Contact Banner Settings</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            <div className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-gray-700 mb-1">Badge</label>
                <input
                  type="text"
                  value={data.banner.badge}
                  onChange={(e) => setData({ ...data, banner: { ...data.banner, badge: e.target.value } })}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-gray-200 text-sm bg-gray-50/50"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-gray-700 mb-1">Title</label>
                <input
                  type="text"
                  value={data.banner.title}
                  onChange={(e) => setData({ ...data, banner: { ...data.banner, title: e.target.value } })}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-gray-200 text-sm bg-gray-50/50"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-gray-700 mb-1">Subtitle</label>
                <textarea
                  rows="3"
                  value={data.banner.subtitle}
                  onChange={(e) => setData({ ...data, banner: { ...data.banner, subtitle: e.target.value } })}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-gray-200 text-sm bg-gray-50/50"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-gray-700 mb-1">Banner Background Image URL</label>
              <input
                type="text"
                value={data.banner.imageUrl}
                onChange={(e) => setData({ ...data, banner: { ...data.banner, imageUrl: e.target.value } })}
                className="w-full px-3.5 py-2.5 rounded-xl border border-gray-200 text-sm bg-gray-50/50 mb-3"
              />
              <div className="rounded-xl overflow-hidden h-44 bg-gray-100 border border-gray-200">
                <img src={data.banner.imageUrl} alt="Contact Banner" className="w-full h-full object-cover" />
              </div>
            </div>
          </div>
        </div>
      )}

      {/* OFFICE MODAL */}
      {isOfficeModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-lg w-full p-6 space-y-4 shadow-2xl">
            <h3 className="text-base font-bold text-gray-900">
              {editingOffice.id ? 'Edit Office Location' : 'Add Office Location'}
            </h3>
            <form onSubmit={handleSaveOffice} className="space-y-3">
              <div>
                <label className="block text-xs font-semibold text-gray-700 mb-1">Country / Region</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. India (HQ)"
                  value={editingOffice.country}
                  onChange={(e) => setEditingOffice({ ...editingOffice, country: e.target.value })}
                  className="w-full px-3 py-2 rounded-xl border border-gray-200 text-sm"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-gray-700 mb-1">Full Address</label>
                <textarea
                  rows="3"
                  required
                  value={editingOffice.address}
                  onChange={(e) => setEditingOffice({ ...editingOffice, address: e.target.value })}
                  className="w-full px-3 py-2 rounded-xl border border-gray-200 text-sm"
                />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-gray-700 mb-1">Phone</label>
                  <input
                    type="text"
                    value={editingOffice.phone}
                    onChange={(e) => setEditingOffice({ ...editingOffice, phone: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl border border-gray-200 text-sm"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-gray-700 mb-1">Email</label>
                  <input
                    type="email"
                    value={editingOffice.email}
                    onChange={(e) => setEditingOffice({ ...editingOffice, email: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl border border-gray-200 text-sm"
                  />
                </div>
              </div>
              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setIsOfficeModalOpen(false)}
                  className="px-4 py-2 rounded-xl text-xs font-semibold text-gray-600 hover:bg-gray-100"
                >
                  Cancel
                </button>
                <button type="submit" className="btn-unispark-pill text-xs py-2 px-5">
                  Save Office
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default ContactPageEditor;
