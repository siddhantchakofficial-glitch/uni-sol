import React, { useState, useEffect } from 'react';
import { useAuth } from '../../../context/AuthContext';
import { notifyCMSPublish } from '../../../hooks/useCMS';
import { Contact } from '../../Contact/Contact';
import {
  FaSave, FaExternalLinkAlt, FaPlus, FaTrash, FaEdit,
  FaCheckCircle, FaSpinner, FaPhoneAlt, FaEnvelope, FaMapMarkerAlt, FaWhatsapp,
  FaWpforms, FaMapMarkedAlt, FaEye, FaEyeSlash,
} from 'react-icons/fa';

const API_BASE = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000/api';

const DEFAULT_CONTACT_DATA = {
  form: {
    badge: 'Enquiry Form',
    heading: 'Send Us a Message',
    workingHours: 'Sunday – Thursday · 9:00 – 18:00',
    locations: ['India', 'United Arab Emirates', 'Other International'],
    enquiryTypes: [
      'Request for Quotation (RFQ)',
      'Technical Consultation',
      'Maintenance / AMC Support',
      'Partnership / Distribution',
      'Careers',
      'Other',
    ],
    services: [
      'CCTV & AI Video Analytics',
      'Biometric & Physical Access Control',
      'Fire Alarm & Life Safety Systems',
      'Perimeter Intrusion Detection',
      'System Integration & Command Center (PSIM)',
      'Annual Maintenance Contracts (AMC/PMC)',
      'International Talent & IT Consulting',
    ],
  },
  map: {
    query: 'Business Bay, Dubai, UAE',
    embedUrl: '',
  },
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
  // Info-card labels + per-section visibility (all optional).
  labels: {
    callUs: 'Call us',
    emailUs: 'Email us',
    addressTitle: 'Company Address & Coverage',
    hoursTitle: 'Working Hours',
  },
  visibility: {
    form: true,
    infoCards: true,
    map: true,
  },
};

export const ContactPageEditor = () => {
  const { token } = useAuth();
  const [data, setData] = useState(DEFAULT_CONTACT_DATA);
  const [activeTab, setActiveTab] = useState('info');
  const [saving, setSaving] = useState(false);
  const [saveStatus, setSaveStatus] = useState(null);

  const [editingOffice, setEditingOffice] = useState(null);
  const [isOfficeModalOpen, setIsOfficeModalOpen] = useState(false);
  const [showPreview, setShowPreview] = useState(true);
  const [previewDevice, setPreviewDevice] = useState('desktop');

  useEffect(() => {
    const fetchContactConfig = async () => {
      try {
        const res = await fetch(`${API_BASE}/pages/contact`, { headers: { Authorization: `Bearer ${token}` } });
        if (res.ok) {
          const json = await res.json();
          if (json.page?.draftVersion?.content) {
            // Merge over defaults so the form/map sections survive saves of
            // drafts that predate them.
            setData((prev) => ({
              ...DEFAULT_CONTACT_DATA,
              ...prev,
              ...json.page.draftVersion.content,
            }));
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
      notifyCMSPublish('contact');
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
          { id: 'form', label: '4. Enquiry Form Options', icon: FaWpforms },
          { id: 'map', label: '5. Map', icon: FaMapMarkedAlt },
          { id: 'infoCards', label: '6. Info Cards & Visibility', icon: FaMapMarkerAlt },
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

      {/* TAB 4: ENQUIRY FORM OPTIONS */}
      {activeTab === 'form' && (
        <div className="bg-white rounded-2xl border border-gray-200 p-6 space-y-5">
          <h3 className="text-base font-bold text-gray-900">Enquiry Form Section</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            <div className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-gray-700 mb-1">Form Badge</label>
                <input
                  type="text"
                  value={data.form.badge}
                  onChange={(e) => setData({ ...data, form: { ...data.form, badge: e.target.value } })}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-gray-200 text-sm bg-gray-50/50"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-gray-700 mb-1">Form Heading</label>
                <input
                  type="text"
                  value={data.form.heading}
                  onChange={(e) => setData({ ...data, form: { ...data.form, heading: e.target.value } })}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-gray-200 text-sm bg-gray-50/50"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-gray-700 mb-1">Working Hours (info card)</label>
                <input
                  type="text"
                  value={data.form.workingHours}
                  onChange={(e) => setData({ ...data, form: { ...data.form, workingHours: e.target.value } })}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-gray-200 text-sm bg-gray-50/50"
                />
              </div>
            </div>
            <div className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-gray-700 mb-1">Location Options (one per line)</label>
                <textarea
                  rows="3"
                  value={(data.form.locations || []).join('\n')}
                  onChange={(e) => setData({ ...data, form: { ...data.form, locations: e.target.value.split('\n').filter(Boolean) } })}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-gray-200 text-sm bg-gray-50/50"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-gray-700 mb-1">Enquiry Type Options (one per line)</label>
                <textarea
                  rows="5"
                  value={(data.form.enquiryTypes || []).join('\n')}
                  onChange={(e) => setData({ ...data, form: { ...data.form, enquiryTypes: e.target.value.split('\n').filter(Boolean) } })}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-gray-200 text-sm bg-gray-50/50"
                />
              </div>
            </div>
          </div>
          <div>
            <label className="block text-xs font-semibold text-gray-700 mb-1">Service Options (one per line)</label>
            <textarea
              rows="6"
              value={(data.form.services || []).join('\n')}
              onChange={(e) => setData({ ...data, form: { ...data.form, services: e.target.value.split('\n').filter(Boolean) } })}
              className="w-full px-3.5 py-2.5 rounded-xl border border-gray-200 text-sm bg-gray-50/50"
            />
            <p className="text-[11px] text-gray-400 mt-1">
              reCAPTCHA is enabled automatically when VITE_RECAPTCHA_SITE_KEY (client) and RECAPTCHA_SECRET_KEY (server) are configured.
            </p>
          </div>
        </div>
      )}

      {/* TAB 5: MAP */}
      {activeTab === 'map' && (
        <div className="bg-white rounded-2xl border border-gray-200 p-6 space-y-5">
          <h3 className="text-base font-bold text-gray-900">Embedded Location Map</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            <div className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-gray-700 mb-1">Map Query / Place</label>
                <input
                  type="text"
                  value={data.map.query}
                  onChange={(e) => setData({ ...data, map: { ...data.map, query: e.target.value } })}
                  placeholder="e.g. Business Bay, Dubai, UAE"
                  className="w-full px-3.5 py-2.5 rounded-xl border border-gray-200 text-sm bg-gray-50/50"
                />
                <p className="text-[11px] text-gray-400 mt-1">Used to build the embed URL when no custom URL is set.</p>
              </div>
              <div>
                <label className="block text-xs font-semibold text-gray-700 mb-1">Custom Embed URL (optional)</label>
                <input
                  type="text"
                  value={data.map.embedUrl}
                  onChange={(e) => setData({ ...data, map: { ...data.map, embedUrl: e.target.value } })}
                  placeholder="https://www.google.com/maps/embed?pb=..."
                  className="w-full px-3.5 py-2.5 rounded-xl border border-gray-200 text-sm bg-gray-50/50"
                />
                <p className="text-[11px] text-gray-400 mt-1">Paste a Google Maps “Embed a map” src URL to override the query.</p>
              </div>
            </div>
            <div className="rounded-xl overflow-hidden h-64 bg-gray-100 border border-gray-200">
              <iframe
                title="Map preview"
                src={data.map.embedUrl || `https://www.google.com/maps?q=${encodeURIComponent(data.map.query || 'Business Bay, Dubai, UAE')}&output=embed`}
                className="w-full h-full border-0"
                loading="lazy"
              />
            </div>
          </div>
        </div>
      )}

      {/* TAB 6: INFO CARD LABELS + SECTION VISIBILITY */}
      {activeTab === 'infoCards' && (
        <div className="bg-white rounded-2xl border border-gray-200 p-6 space-y-5">
          <h3 className="text-base font-bold text-gray-900">Info Card Labels & Section Visibility</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            <div className="space-y-3">
              <div>
                <label className="block text-xs font-semibold text-gray-700 mb-1">“Call us” Card Title</label>
                <input
                  type="text"
                  value={data.labels?.callUs || ''}
                  onChange={(e) => setData({ ...data, labels: { ...data.labels, callUs: e.target.value } })}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-gray-200 text-sm bg-gray-50/50"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-gray-700 mb-1">“Email us” Card Title</label>
                <input
                  type="text"
                  value={data.labels?.emailUs || ''}
                  onChange={(e) => setData({ ...data, labels: { ...data.labels, emailUs: e.target.value } })}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-gray-200 text-sm bg-gray-50/50"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-gray-700 mb-1">Address Card Title</label>
                <input
                  type="text"
                  value={data.labels?.addressTitle || ''}
                  onChange={(e) => setData({ ...data, labels: { ...data.labels, addressTitle: e.target.value } })}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-gray-200 text-sm bg-gray-50/50"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-gray-700 mb-1">Working Hours Card Title</label>
                <input
                  type="text"
                  value={data.labels?.hoursTitle || ''}
                  onChange={(e) => setData({ ...data, labels: { ...data.labels, hoursTitle: e.target.value } })}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-gray-200 text-sm bg-gray-50/50"
                />
              </div>
            </div>

            <div className="space-y-3">
              <span className="text-xs font-bold text-gray-700 uppercase tracking-wider">Section Visibility</span>
              {[
                ['form', 'Enquiry Form Section'],
                ['infoCards', 'Info Cards Column'],
                ['map', 'Map Section'],
              ].map(([key, label]) => (
                <div key={key} className="flex items-center justify-between p-3 rounded-xl border border-gray-200">
                  <span className="text-xs font-semibold text-gray-700">{label}</span>
                  <button
                    type="button"
                    onClick={() =>
                      setData({ ...data, visibility: { ...data.visibility, [key]: data.visibility?.[key] === false } })
                    }
                    className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold ${
                      data.visibility?.[key] === false
                        ? 'bg-gray-100 text-gray-500 border border-gray-200'
                        : 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                    }`}
                  >
                    {data.visibility?.[key] === false ? <FaEyeSlash className="w-3.5 h-3.5" /> : <FaEye className="w-3.5 h-3.5" />}
                    <span>{data.visibility?.[key] === false ? 'Hidden' : 'Shown'}</span>
                  </button>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* LIVE PREVIEW — renders the REAL public Contact page component with
          the current draft state. No refresh, no separate implementation. */}
      {showPreview && (
        <div className="bg-white rounded-2xl border border-gray-200 overflow-hidden">
          <div className="flex flex-wrap items-center justify-between gap-3 px-5 py-3 border-b border-gray-100 bg-gray-50/60">
            <div className="flex items-center gap-2">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
                <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500" />
              </span>
              <span className="text-xs font-bold text-gray-900">Live Preview</span>
              <span className="text-[10px] text-gray-400 font-mono">Same public Contact component</span>
            </div>
            <div className="flex items-center gap-2">
              <a href="/contact" target="_blank" rel="noopener noreferrer" className="text-xs font-semibold text-[#0470aa] hover:underline inline-flex items-center gap-1">
                <FaExternalLinkAlt className="w-3 h-3" /> Open Public Page
              </a>
              <div className="flex items-center gap-1 bg-gray-100 p-1 rounded-lg">
                {['desktop', 'tablet', 'mobile'].map((dev) => (
                  <button
                    key={dev}
                    onClick={() => setPreviewDevice(dev)}
                    className={`p-1.5 rounded text-[10px] font-semibold capitalize transition-all ${
                      previewDevice === dev ? 'bg-[#0470aa] text-white' : 'text-gray-400 hover:text-gray-700'
                    }`}
                  >
                    {dev}
                  </button>
                ))}
              </div>
              <button
                onClick={() => setShowPreview(false)}
                className="p-1.5 rounded-lg text-gray-400 hover:text-gray-700"
                title="Hide preview"
              >
                <FaEyeSlash className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
          <div className="bg-gray-100 p-3 sm:p-5 flex justify-center overflow-x-auto">
            <div
              className={`bg-white rounded-xl overflow-hidden shadow-2xl border border-gray-200 transition-all duration-300 ${
                previewDevice === 'mobile' ? 'w-[375px]' : previewDevice === 'tablet' ? 'w-[768px]' : 'w-full'
              }`}
            >
              <Contact data={data} />
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
