import React, { useState, useEffect } from 'react';
import { Mail, Trash2, Eye, EyeOff, MapPin, Phone, Building, Briefcase, Globe, Search, Filter, MessageSquare } from 'lucide-react';
import { fetchEnquiries, deleteEnquiry, markEnquiryRead } from '../services/api';
import { COUNTRIES, getCountryFlag } from '../data/countries';

export default function ContactMessages({ onShowToast }) {
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [expandedId, setExpandedId] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCountryFilter, setSelectedCountryFilter] = useState('ALL');
  const [statusFilter, setStatusFilter] = useState('ALL');

  const loadMessages = async () => {
    setLoading(true);
    const res = await fetchEnquiries();
    if (res.success && res.data) {
      setMessages(res.data);
    }
    setLoading(false);
  };

  useEffect(() => {
    loadMessages();
  }, []);

  const handleDelete = async (id) => {
    if (window.confirm("Are you sure you want to delete this enquiry?")) {
      const res = await deleteEnquiry(id);
      if (res.success) {
        setMessages(prev => prev.filter(m => m._id !== id));
        if (onShowToast) onShowToast("Enquiry deleted.");
      } else {
        if (onShowToast) onShowToast("Failed to delete enquiry.");
      }
    }
  };

  const toggleExpand = async (message) => {
    if (expandedId === message._id) {
      setExpandedId(null);
    } else {
      setExpandedId(message._id);
      if (message.status === 'Unread') {
        const res = await markEnquiryRead(message._id);
        if (res.success) {
          setMessages(prev => prev.map(m => m._id === message._id ? { ...m, status: 'Read' } : m));
        }
      }
    }
  };

  // Helper to format complete international phone number
  const formatPhoneNumber = (msg) => {
    const code = msg.countryCode ? msg.countryCode.trim() : '';
    const num = (msg.phone || '').trim();
    if (!num) return 'N/A';
    if (code && !num.startsWith('+') && !num.startsWith(code)) {
      return `${code} ${num}`;
    }
    return num;
  };

  // Filter messages based on search, country, and status
  const filteredMessages = messages.filter(msg => {
    const q = searchQuery.toLowerCase();
    const matchesSearch = 
      (msg.fullName || '').toLowerCase().includes(q) ||
      (msg.companyName || '').toLowerCase().includes(q) ||
      (msg.email || '').toLowerCase().includes(q) ||
      (msg.phone || '').toLowerCase().includes(q) ||
      (msg.country || '').toLowerCase().includes(q) ||
      (msg.location || '').toLowerCase().includes(q) ||
      (msg.service || '').toLowerCase().includes(q) ||
      (msg.message || '').toLowerCase().includes(q);

    const matchesCountry = selectedCountryFilter === 'ALL' || (msg.country || 'United Arab Emirates') === selectedCountryFilter;
    const matchesStatus = statusFilter === 'ALL' || msg.status === statusFilter;

    return matchesSearch && matchesCountry && matchesStatus;
  });

  // Extract unique countries from incoming messages for smart filtering
  const presentCountries = Array.from(new Set(messages.map(m => m.country || 'United Arab Emirates'))).filter(Boolean);

  if (loading) {
    return (
      <div className="content-card" style={{ padding: '3rem', textAlign: 'center', color: 'var(--text-muted)' }}>
        Loading Enquiries...
      </div>
    );
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem', width: '100%' }}>
      <div className="content-card">
        {/* Header */}
        <div className="content-card-header" style={{ padding: '1.25rem 1.75rem', borderBottom: '1px solid var(--border-color)', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem' }}>
          <div>
            <h2 className="card-title" style={{ fontSize: '1.25rem', fontWeight: 600, margin: 0 }}>Form Enquiries</h2>
            <p style={{ margin: '0.25rem 0 0 0', fontSize: '0.82rem', color: 'var(--text-muted)' }}>
              Manage incoming contact leads, quotes, and service requests.
            </p>
          </div>
          <div style={{ display: 'flex', gap: '0.75rem', alignItems: 'center' }}>
            <span style={{ fontSize: '0.85rem', color: 'var(--text-muted)', backgroundColor: 'var(--bg-input)', padding: '0.35rem 0.85rem', borderRadius: '1rem', fontWeight: 600 }}>
              {filteredMessages.length} of {messages.length} Total
            </span>
          </div>
        </div>

        {/* Filters & Search Toolbar */}
        <div style={{ padding: '1rem 1.75rem', borderBottom: '1px solid var(--border-color)', backgroundColor: 'var(--bg-main)', display: 'flex', flexWrap: 'wrap', gap: '0.75rem', alignItems: 'center', justifyContent: 'space-between' }}>
          {/* Search Box */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', backgroundColor: 'var(--bg-card)', border: '1px solid var(--border-color)', borderRadius: 'var(--radius-md)', padding: '0.45rem 0.85rem', flex: '1 1 240px', maxWidth: '380px' }}>
            <Search size={16} color="var(--text-muted)" />
            <input
              type="text"
              placeholder="Search enquiries by name, email, phone..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              style={{ border: 'none', background: 'transparent', outline: 'none', width: '100%', fontSize: '0.85rem', color: 'var(--text-main)' }}
            />
          </div>

          {/* Filters Group */}
          <div style={{ display: 'flex', gap: '0.6rem', flexWrap: 'wrap', alignItems: 'center' }}>
            {/* Country Filter */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', backgroundColor: 'var(--bg-card)', border: '1px solid var(--border-color)', borderRadius: 'var(--radius-md)', padding: '0.35rem 0.65rem' }}>
              <Globe size={15} color="var(--primary)" />
              <select
                value={selectedCountryFilter}
                onChange={(e) => setSelectedCountryFilter(e.target.value)}
                style={{ border: 'none', background: 'transparent', outline: 'none', fontSize: '0.82rem', color: 'var(--text-main)', cursor: 'pointer', fontWeight: 500 }}
              >
                <option value="ALL">All Countries</option>
                {presentCountries.map(country => (
                  <option key={country} value={country}>
                    {getCountryFlag(country)} {country}
                  </option>
                ))}
              </select>
            </div>

            {/* Status Filter */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', backgroundColor: 'var(--bg-card)', border: '1px solid var(--border-color)', borderRadius: 'var(--radius-md)', padding: '0.35rem 0.65rem' }}>
              <Filter size={15} color="var(--text-muted)" />
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                style={{ border: 'none', background: 'transparent', outline: 'none', fontSize: '0.82rem', color: 'var(--text-main)', cursor: 'pointer', fontWeight: 500 }}
              >
                <option value="ALL">All Status</option>
                <option value="Unread">Unread (New)</option>
                <option value="Read">Read</option>
              </select>
            </div>
          </div>
        </div>

        {/* Content Body */}
        <div className="content-card-body" style={{ padding: '1.5rem' }}>
          {filteredMessages.length === 0 ? (
            <div style={{ textAlign: 'center', padding: '3.5rem 1rem', border: '2px dashed var(--border-color)', borderRadius: 'var(--radius-md)' }}>
              <Mail size={36} style={{ margin: '0 auto 1rem auto', color: 'var(--text-muted)', opacity: 0.6 }} />
              <h4 style={{ margin: '0 0 0.5rem 0', fontWeight: 600, color: 'var(--text-main)' }}>No Enquiries Match Filters</h4>
              <p style={{ color: 'var(--text-muted)', fontSize: '0.85rem', margin: 0 }}>
                Try resetting your search query or country/status filter.
              </p>
            </div>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              {filteredMessages.map((msg) => {
                const countryName = msg.country || 'United Arab Emirates';
                const flag = getCountryFlag(countryName);
                const fullPhone = formatPhoneNumber(msg);

                return (
                  <div key={msg._id} style={{ 
                    border: msg.status === 'Unread' ? '1px solid var(--primary)' : '1px solid var(--border-color)', 
                    backgroundColor: msg.status === 'Unread' ? 'rgba(0, 115, 183, 0.03)' : 'var(--bg-card)',
                    borderRadius: 'var(--radius-md)', 
                    overflow: 'hidden',
                    transition: 'all 0.2s',
                    boxShadow: msg.status === 'Unread' ? '0 2px 8px rgba(0, 115, 183, 0.08)' : 'none'
                  }}>
                    
                    {/* Header Row (Always visible) */}
                    <div 
                      onClick={() => toggleExpand(msg)}
                      style={{ 
                        padding: '1rem 1.5rem', 
                        display: 'flex', 
                        alignItems: 'center', 
                        justifyContent: 'space-between',
                        cursor: 'pointer',
                        flexWrap: 'wrap',
                        gap: '0.75rem'
                      }}
                    >
                      <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', minWidth: '240px' }}>
                        <div style={{ 
                          width: '42px', height: '42px', borderRadius: '50%', 
                          backgroundColor: msg.status === 'Unread' ? 'var(--primary)' : 'var(--bg-input)',
                          color: msg.status === 'Unread' ? 'white' : 'var(--text-muted)',
                          display: 'flex', alignItems: 'center', justifyContent: 'center',
                          flexShrink: 0
                        }}>
                          <Mail size={18} />
                        </div>
                        <div>
                          <h4 style={{ margin: 0, fontWeight: 700, fontSize: '1.05rem', color: 'var(--text-main)', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                            {msg.fullName}
                            {msg.status === 'Unread' && (
                              <span style={{ fontSize: '0.65rem', backgroundColor: 'var(--danger)', color: 'white', padding: '0.1rem 0.45rem', borderRadius: '4px', fontWeight: 'bold' }}>NEW</span>
                            )}
                          </h4>
                          <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>
                            {msg.email} • {new Date(msg.createdAt).toLocaleString()}
                          </span>
                        </div>
                      </div>
                      
                      <div style={{ display: 'flex', gap: '0.75rem', alignItems: 'center', flexWrap: 'wrap' }}>
                        {/* Country Badge */}
                        <span style={{ 
                          fontSize: '0.8rem', 
                          fontWeight: 600, 
                          color: 'var(--text-main)', 
                          backgroundColor: 'var(--bg-input)', 
                          padding: '0.25rem 0.65rem', 
                          borderRadius: '6px',
                          display: 'inline-flex',
                          alignItems: 'center',
                          gap: '0.35rem',
                          border: '1px solid var(--border-color)'
                        }}>
                          <span>{flag}</span>
                          <span>{countryName}</span>
                        </span>

                        {/* Enquiry Type Badge */}
                        <span style={{ fontSize: '0.8rem', fontWeight: 600, color: 'var(--primary)', backgroundColor: 'var(--primary-light)', padding: '0.25rem 0.65rem', borderRadius: '6px' }}>
                          {msg.enquiryType}
                        </span>

                        {/* View Button */}
                        <button 
                          onClick={(e) => { e.stopPropagation(); toggleExpand(msg); }} 
                          style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--text-muted)', display: 'flex', alignItems: 'center', padding: '0.25rem' }}
                          title={expandedId === msg._id ? "Collapse" : "Expand Details"}
                        >
                          {expandedId === msg._id ? <EyeOff size={18} /> : <Eye size={18} />}
                        </button>
                      </div>
                    </div>

                    {/* Expanded Body */}
                    {expandedId === msg._id && (
                      <div style={{ padding: '1.5rem', borderTop: '1px solid var(--border-color)', backgroundColor: 'var(--bg-card)' }}>
                        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: '1.25rem', marginBottom: '1.5rem' }}>
                          
                          {/* Column 1: Client & Contact Info */}
                          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.8rem', backgroundColor: 'var(--bg-input)', padding: '1rem', borderRadius: 'var(--radius-md)' }}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.88rem', color: 'var(--text-main)' }}>
                              <Building size={16} color="var(--primary)" />
                              <strong>Company:</strong> {msg.companyName}
                            </div>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.88rem', color: 'var(--text-main)' }}>
                              <Globe size={16} color="var(--primary)" />
                              <strong>Country:</strong> {flag} {countryName} {msg.countryCode ? `(${msg.countryCode})` : ''}
                            </div>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.88rem', color: 'var(--text-main)' }}>
                              <Phone size={16} color="var(--primary)" />
                              <strong>Phone:</strong> 
                              <a href={`tel:${fullPhone}`} style={{ color: 'var(--primary)', fontWeight: 600, textDecoration: 'none' }}>
                                {fullPhone}
                              </a>
                            </div>
                          </div>

                          {/* Column 2: Location & Service Info */}
                          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.8rem', backgroundColor: 'var(--bg-input)', padding: '1rem', borderRadius: 'var(--radius-md)' }}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.88rem', color: 'var(--text-main)' }}>
                              <MapPin size={16} color="var(--primary)" />
                              <strong>City / Location:</strong> {msg.location || 'N/A'}
                            </div>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.88rem', color: 'var(--text-main)' }}>
                              <Briefcase size={16} color="var(--primary)" />
                              <strong>Service Required:</strong> {msg.service || 'General Security'}
                            </div>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.88rem', color: 'var(--text-main)' }}>
                              <MessageSquare size={16} color="var(--primary)" />
                              <strong>Enquiry Type:</strong> {msg.enquiryType}
                            </div>
                          </div>

                        </div>

                        {/* Message Box */}
                        <div style={{ backgroundColor: 'var(--bg-main)', padding: '1.2rem', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-color)' }}>
                          <strong style={{ display: 'block', marginBottom: '0.5rem', fontSize: '0.8rem', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                            Client Message / Project Scope
                          </strong>
                          <p style={{ margin: 0, fontSize: '0.95rem', color: 'var(--text-main)', whiteSpace: 'pre-wrap', lineHeight: 1.6 }}>
                            {msg.message}
                          </p>
                        </div>

                        {/* Actions */}
                        <div style={{ marginTop: '1.25rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem' }}>
                          <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>
                            Status: <strong style={{ color: msg.status === 'Read' ? 'var(--text-muted)' : 'var(--primary)' }}>{msg.status}</strong>
                          </span>
                          <button 
                            onClick={() => handleDelete(msg._id)}
                            style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', padding: '0.5rem 1rem', fontSize: '0.85rem', backgroundColor: 'var(--danger)', color: 'white', border: 'none', borderRadius: 'var(--radius-md)', cursor: 'pointer', fontWeight: 600 }}
                          >
                            <Trash2 size={14} /> Delete Enquiry
                          </button>
                        </div>
                      </div>
                    )}

                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
