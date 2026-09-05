import React, { useEffect, useState, useCallback } from 'react';
import { useAuth } from '../../context/AuthContext';
import { FaInbox, FaSearch, FaTrash, FaEye, FaTimes, FaCheckCircle, FaEnvelope, FaEnvelopeOpen } from 'react-icons/fa';

const API_BASE = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000/api';

export const AdminSubmissions = () => {
  const { token } = useAuth();
  const [submissions, setSubmissions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [selected, setSelected] = useState(null);
  const [deleteTarget, setDeleteTarget] = useState(null);
  const [deleting, setDeleting] = useState(false);
  const [msg, setMsg] = useState({ text: '', type: '' });

  const headers = useCallback(
    () => ({ Authorization: `Bearer ${token}`, 'Content-Type': 'application/json' }),
    [token]
  );

  const flash = (text, type = 'success') => {
    setMsg({ text, type });
    setTimeout(() => setMsg({ text: '', type: '' }), 3500);
  };

  const fetchSubmissions = useCallback(async () => {
    setLoading(true);
    try {
      const res = await fetch(`${API_BASE}/submissions?limit=100`, {
        headers: headers(),
      });
      if (res.ok) {
        const d = await res.json();
        setSubmissions(d.submissions || d.data || []);
      }
    } finally {
      setLoading(false);
    }
  }, [headers]);

  useEffect(() => {
    fetchSubmissions();
  }, [fetchSubmissions]);

  // Status toggle (read / unread)
  const handleToggleStatus = async (sub, targetStatus) => {
    const newStatus = targetStatus || (sub.status === 'read' ? 'unread' : 'read');
    const id = sub._id || sub.id;
    try {
      const res = await fetch(`${API_BASE}/submissions/${id}/status`, {
        method: 'PUT',
        headers: headers(),
        body: JSON.stringify({ status: newStatus }),
      });
      if (res.ok) {
        setSubmissions((prev) =>
          prev.map((s) => ((s._id === id || s.id === id) ? { ...s, status: newStatus } : s))
        );
        if (selected && (selected._id === id || selected.id === id)) {
          setSelected((prev) => ({ ...prev, status: newStatus }));
        }
        flash(`Marked as ${newStatus}.`);
      } else {
        flash('Failed to update status.', 'error');
      }
    } catch {
      flash('Error connecting to server.', 'error');
    }
  };

  // Open view and auto-mark as read
  const handleView = (sub) => {
    setSelected(sub);
    if (sub.status !== 'read') {
      handleToggleStatus(sub, 'read');
    }
  };

  // Delete submission
  const handleDelete = async () => {
    if (!deleteTarget) return;
    const id = deleteTarget._id || deleteTarget.id;
    setDeleting(true);
    try {
      const res = await fetch(`${API_BASE}/submissions/${id}`, {
        method: 'DELETE',
        headers: headers(),
      });
      if (res.ok) {
        setSubmissions((prev) => prev.filter((s) => s._id !== id && s.id !== id));
        if (selected && (selected._id === id || selected.id === id)) {
          setSelected(null);
        }
        setDeleteTarget(null);
        flash('Submission deleted.');
      } else {
        flash('Failed to delete submission.', 'error');
      }
    } catch {
      flash('Error connecting to server.', 'error');
    } finally {
      setDeleting(false);
    }
  };

  const filtered = submissions.filter((s) =>
    JSON.stringify(s).toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="space-y-5">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
        <div>
          <h1 className="text-2xl font-bold text-[#000000] font-poppins flex items-center gap-2">
            <FaInbox className="text-[#0470aa] w-5 h-5" /> Form Submissions
          </h1>
          <p className="text-sm text-[#6e6e6e] mt-0.5">
            {submissions.length} submission{submissions.length !== 1 ? 's' : ''} (
            {submissions.filter((s) => s.status !== 'read').length} unread)
          </p>
        </div>
      </div>

      {msg.text && (
        <div className={`p-3.5 rounded-xl text-sm border ${
          msg.type === 'error'
            ? 'bg-red-50 border-red-200 text-red-700'
            : 'bg-emerald-50 border-emerald-200 text-emerald-700'
        }`}>
          {msg.text}
        </div>
      )}

      <div className="relative max-w-sm">
        <FaSearch className="absolute left-3.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-gray-400" />
        <input
          type="search"
          placeholder="Search submissions…"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full pl-9 pr-4 py-2.5 rounded-xl border border-[#e5e7eb] text-sm text-[#262626] placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#0470aa]/30 focus:border-[#0470aa] bg-white"
        />
      </div>

      <div className="bg-white rounded-2xl border border-[#e5e7eb] overflow-hidden">
        {loading ? (
          <div className="p-8 text-center text-sm text-[#6e6e6e]">Loading submissions…</div>
        ) : filtered.length === 0 ? (
          <div className="p-12 text-center">
            <FaInbox className="w-10 h-10 text-gray-200 mx-auto mb-3" />
            <p className="text-sm text-[#6e6e6e]">No submissions found.</p>
          </div>
        ) : (
          <table className="w-full text-sm">
            <thead className="bg-[#f4f8fb] border-b border-[#e5e7eb]">
              <tr>
                <th className="text-left px-5 py-3 text-xs font-semibold text-[#6e6e6e] uppercase tracking-wide">Form</th>
                <th className="text-left px-5 py-3 text-xs font-semibold text-[#6e6e6e] uppercase tracking-wide hidden sm:table-cell">From</th>
                <th className="text-left px-5 py-3 text-xs font-semibold text-[#6e6e6e] uppercase tracking-wide hidden md:table-cell">Date</th>
                <th className="text-left px-5 py-3 text-xs font-semibold text-[#6e6e6e] uppercase tracking-wide">Status</th>
                <th className="text-right px-5 py-3 text-xs font-semibold text-[#6e6e6e] uppercase tracking-wide">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#f4f8fb]">
              {filtered.map((sub) => {
                const data = sub.data || sub.fields || {};
                const isRead = sub.status === 'read';
                return (
                  <tr
                    key={sub._id || sub.id}
                    className={`hover:bg-[#f9fbfd] transition-colors ${!isRead ? 'bg-[#f0f8ff]/50 font-medium' : ''}`}
                  >
                    <td className="px-5 py-3.5 text-[#262626]">
                      <div className="flex items-center gap-2">
                        {!isRead && <span className="w-2 h-2 rounded-full bg-[#0470aa] flex-shrink-0" />}
                        <span>{sub.formTitle || sub.formId || sub.form || 'Contact Form'}</span>
                      </div>
                    </td>
                    <td className="px-5 py-3.5 text-[#6e6e6e] hidden sm:table-cell">
                      {data.fullName || data.name || data.email || sub.email || '—'}
                    </td>
                    <td className="px-5 py-3.5 text-[#6e6e6e] text-xs hidden md:table-cell">
                      {sub.createdAt ? new Date(sub.createdAt).toLocaleDateString() : '—'}
                    </td>
                    <td className="px-5 py-3.5">
                      <button
                        onClick={() => handleToggleStatus(sub)}
                        className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold transition-colors ${
                          isRead
                            ? 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                            : 'bg-cyan-50 text-[#0470aa] hover:bg-cyan-100'
                        }`}
                        title="Click to toggle status"
                      >
                        {isRead ? <FaEnvelopeOpen className="w-3 h-3" /> : <FaEnvelope className="w-3 h-3" />}
                        <span>{isRead ? 'Read' : 'New'}</span>
                      </button>
                    </td>
                    <td className="px-5 py-3.5">
                      <div className="flex items-center justify-end gap-2">
                        <button
                          onClick={() => handleView(sub)}
                          className="p-1.5 rounded-lg text-gray-400 hover:text-[#0470aa] hover:bg-[#e9f4fb] transition-colors"
                          title="View Submission"
                        >
                          <FaEye className="w-3.5 h-3.5" />
                        </button>
                        <button
                          onClick={() => setDeleteTarget(sub)}
                          className="p-1.5 rounded-lg text-gray-400 hover:text-red-500 hover:bg-red-50 transition-colors"
                          title="Delete Submission"
                        >
                          <FaTrash className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        )}
      </div>

      {/* Detail Modal */}
      {selected && (
        <div
          className="fixed inset-0 z-50 bg-black/40 backdrop-blur-sm flex items-center justify-center p-4"
          onClick={() => setSelected(null)}
        >
          <div
            className="bg-white rounded-2xl border border-[#e5e7eb] max-w-lg w-full p-6 shadow-2xl space-y-4"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between border-b border-[#e5e7eb] pb-3">
              <div>
                <h3 className="font-bold text-[#000000] text-base">
                  {selected.formTitle || selected.formId || 'Submission Details'}
                </h3>
                <p className="text-xs text-[#6e6e6e] mt-0.5">
                  Received {selected.createdAt ? new Date(selected.createdAt).toLocaleString() : 'recently'}
                </p>
              </div>
              <button
                onClick={() => setSelected(null)}
                className="p-1.5 rounded-lg text-gray-400 hover:text-gray-700 hover:bg-gray-100"
              >
                <FaTimes className="w-3.5 h-3.5" />
              </button>
            </div>

            {/* Field-by-field breakdown */}
            <div className="space-y-3 max-h-96 overflow-y-auto pr-1">
              {(() => {
                const fields = selected.data || selected.fields || selected;
                const entries = Object.entries(fields).filter(
                  ([k]) => !['_id', 'id', 'formId', 'formTitle', 'createdAt', 'updatedAt', '__v', 'status'].includes(k)
                );
                if (entries.length === 0) {
                  return <p className="text-xs text-gray-400">No form data provided.</p>;
                }
                return entries.map(([key, val]) => (
                  <div key={key} className="bg-[#f9fafb] p-3 rounded-xl border border-gray-100">
                    <p className="text-[11px] font-semibold text-[#0470aa] uppercase tracking-wider mb-1">
                      {key.replace(/([A-Z])/g, ' $1')}
                    </p>
                    <p className="text-sm text-[#262626] whitespace-pre-wrap">
                      {typeof val === 'object' ? JSON.stringify(val, null, 2) : String(val)}
                    </p>
                  </div>
                ));
              })()}
            </div>

            <div className="flex items-center justify-between pt-3 border-t border-[#e5e7eb]">
              <button
                onClick={() => handleToggleStatus(selected)}
                className="text-xs font-semibold text-[#0470aa] hover:underline flex items-center gap-1.5"
              >
                {selected.status === 'read' ? <FaEnvelope className="w-3 h-3" /> : <FaCheckCircle className="w-3 h-3" />}
                <span>{selected.status === 'read' ? 'Mark as Unread' : 'Mark as Read'}</span>
              </button>
              <div className="flex gap-2">
                <button
                  onClick={() => {
                    const target = selected;
                    setSelected(null);
                    setDeleteTarget(target);
                  }}
                  className="px-3 py-2 rounded-xl text-xs font-medium text-red-600 hover:bg-red-50 transition-colors flex items-center gap-1.5"
                >
                  <FaTrash className="w-3 h-3" />
                  <span>Delete</span>
                </button>
                <button
                  onClick={() => setSelected(null)}
                  className="btn-unispark-pill text-xs py-2 px-5"
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {deleteTarget && (
        <div
          className="fixed inset-0 z-50 bg-black/40 backdrop-blur-sm flex items-center justify-center p-4"
          onClick={() => setDeleteTarget(null)}
        >
          <div
            className="bg-white rounded-2xl border border-[#e5e7eb] max-w-sm w-full p-6 shadow-2xl space-y-4"
            onClick={(e) => e.stopPropagation()}
          >
            <h3 className="font-semibold text-[#000000] text-base">Delete Submission</h3>
            <p className="text-sm text-[#262626]">
              Are you sure you want to delete this submission? This action cannot be undone.
            </p>
            <div className="flex gap-3 pt-2">
              <button
                onClick={() => setDeleteTarget(null)}
                className="flex-1 py-2.5 rounded-xl border border-[#e5e7eb] text-sm text-[#262626] hover:bg-[#f4f8fb] transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleDelete}
                disabled={deleting}
                className="flex-1 py-2.5 rounded-xl bg-red-500 text-white text-sm font-semibold hover:bg-red-600 transition-colors disabled:opacity-60"
              >
                {deleting ? 'Deleting…' : 'Delete'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminSubmissions;
