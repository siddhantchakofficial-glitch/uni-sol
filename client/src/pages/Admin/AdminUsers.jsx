import React, { useEffect, useState, useCallback } from 'react';
import { useAuth } from '../../context/AuthContext';
import { FaUsers, FaSearch, FaEdit, FaTrash, FaPlus, FaTimes, FaSave, FaEye, FaEyeSlash } from 'react-icons/fa';

const API_BASE = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000/api';

const ROLE_COLORS = {
  SUPER_ADMIN: 'bg-purple-100 text-purple-700',
  ADMIN: 'bg-[#e9f4fb] text-[#0470aa]',
  EDITOR: 'bg-emerald-50 text-emerald-700',
};

const ROLES = ['EDITOR', 'ADMIN', 'SUPER_ADMIN'];

/* ─── Reusable modal backdrop ─── */
const Modal = ({ title, onClose, children }) => (
  <div
    className="fixed inset-0 z-50 bg-black/40 backdrop-blur-sm flex items-center justify-center p-4"
    onClick={onClose}
  >
    <div
      className="bg-white rounded-2xl border border-[#e5e7eb] w-full max-w-md shadow-2xl"
      onClick={(e) => e.stopPropagation()}
    >
      <div className="flex items-center justify-between px-6 py-4 border-b border-[#e5e7eb]">
        <h3 className="font-semibold text-[#000000] text-base">{title}</h3>
        <button
          onClick={onClose}
          className="p-1.5 rounded-lg text-gray-400 hover:text-gray-700 hover:bg-gray-100 transition-colors"
          aria-label="Close"
        >
          <FaTimes className="w-3.5 h-3.5" />
        </button>
      </div>
      <div className="p-6">{children}</div>
    </div>
  </div>
);

/* ─── Confirm delete dialog ─── */
const ConfirmDialog = ({ user, onConfirm, onCancel, loading }) => (
  <Modal title="Delete User" onClose={onCancel}>
    <p className="text-sm text-[#262626] mb-1">
      Are you sure you want to delete{' '}
      <span className="font-semibold">{user.username}</span>?
    </p>
    <p className="text-xs text-[#6e6e6e] mb-6">This action cannot be undone.</p>
    <div className="flex gap-3">
      <button
        onClick={onCancel}
        className="flex-1 py-2.5 rounded-xl border border-[#e5e7eb] text-sm text-[#262626] hover:bg-[#f4f8fb] transition-colors"
      >
        Cancel
      </button>
      <button
        onClick={onConfirm}
        disabled={loading}
        className="flex-1 py-2.5 rounded-xl bg-red-500 text-white text-sm font-semibold hover:bg-red-600 transition-colors disabled:opacity-60"
      >
        {loading ? 'Deleting…' : 'Delete'}
      </button>
    </div>
  </Modal>
);

export const AdminUsers = () => {
  const { token, user: currentUser } = useAuth();
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');

  // Modal states
  const [createOpen, setCreateOpen] = useState(false);
  const [editTarget, setEditTarget] = useState(null);   // user being edited
  const [deleteTarget, setDeleteTarget] = useState(null); // user to confirm delete

  // Form states
  const [createForm, setCreateForm] = useState({ username: '', email: '', password: '', role: 'EDITOR' });
  const [showPwd, setShowPwd] = useState(false);
  const [editRole, setEditRole] = useState('');
  const [saving, setSaving] = useState(false);
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

  /* ── Fetch users ── */
  const fetchUsers = useCallback(async () => {
    setLoading(true);
    try {
      const res = await fetch(`${API_BASE}/users?limit=100`, { headers: headers() });
      if (res.ok) {
        const d = await res.json();
        setUsers(d.users || d.data || []);
      }
    } finally {
      setLoading(false);
    }
  }, [headers]);

  useEffect(() => { fetchUsers(); }, [fetchUsers]);

  const filtered = users.filter((u) =>
    `${u.username} ${u.email}`.toLowerCase().includes(search.toLowerCase())
  );

  /* ── Create User ── */
  const handleCreate = async (e) => {
    e.preventDefault();
    if (!createForm.username || !createForm.email || !createForm.password) return;
    setSaving(true);
    try {
      const res = await fetch(`${API_BASE}/users`, {
        method: 'POST',
        headers: headers(),
        body: JSON.stringify(createForm),
      });
      const d = await res.json();
      if (res.ok && d.success) {
        setUsers((prev) => [d.user, ...prev]);
        setCreateOpen(false);
        setCreateForm({ username: '', email: '', password: '', role: 'EDITOR' });
        flash('User created successfully.');
      } else {
        flash(d.message || 'Failed to create user.', 'error');
      }
    } catch {
      flash('Error connecting to server.', 'error');
    } finally {
      setSaving(false);
    }
  };

  /* ── Edit Role ── */
  const openEdit = (u) => { setEditTarget(u); setEditRole(u.role); };

  const handleEditSave = async () => {
    if (!editTarget) return;
    setSaving(true);
    try {
      const res = await fetch(`${API_BASE}/users/${editTarget._id || editTarget.id}`, {
        method: 'PUT',
        headers: headers(),
        body: JSON.stringify({ role: editRole }),
      });
      const d = await res.json();
      if (res.ok && d.success) {
        setUsers((prev) =>
          prev.map((u) => (u._id === editTarget._id || u.id === editTarget.id) ? { ...u, role: editRole } : u)
        );
        setEditTarget(null);
        flash('User role updated.');
      } else {
        flash(d.message || 'Failed to update role.', 'error');
      }
    } catch {
      flash('Error connecting to server.', 'error');
    } finally {
      setSaving(false);
    }
  };

  /* ── Delete User ── */
  const handleDelete = async () => {
    if (!deleteTarget) return;
    setDeleting(true);
    try {
      const res = await fetch(`${API_BASE}/users/${deleteTarget._id || deleteTarget.id}`, {
        method: 'DELETE',
        headers: headers(),
      });
      const d = await res.json();
      if (res.ok && d.success) {
        setUsers((prev) => prev.filter((u) => u._id !== deleteTarget._id && u.id !== deleteTarget.id));
        setDeleteTarget(null);
        flash('User deleted.');
      } else {
        flash(d.message || 'Failed to delete user.', 'error');
      }
    } catch {
      flash('Error connecting to server.', 'error');
    } finally {
      setDeleting(false);
    }
  };

  return (
    <div className="space-y-5">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
        <div>
          <h1 className="text-2xl font-bold text-[#000000] font-poppins flex items-center gap-2">
            <FaUsers className="text-[#0470aa] w-5 h-5" /> Users
          </h1>
          <p className="text-sm text-[#6e6e6e] mt-0.5">{users.length} user{users.length !== 1 ? 's' : ''}</p>
        </div>
        <button
          onClick={() => setCreateOpen(true)}
          className="btn-unispark-pill text-xs py-2.5 px-5 inline-flex items-center gap-2"
        >
          <FaPlus className="w-3 h-3" /> Add User
        </button>
      </div>

      {/* Flash message */}
      {msg.text && (
        <div className={`p-3.5 rounded-xl text-sm border ${
          msg.type === 'error'
            ? 'bg-red-50 border-red-200 text-red-700'
            : 'bg-emerald-50 border-emerald-200 text-emerald-700'
        }`}>
          {msg.text}
        </div>
      )}

      {/* Search */}
      <div className="relative max-w-sm">
        <FaSearch className="absolute left-3.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-gray-400" />
        <input
          type="search"
          placeholder="Search users…"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full pl-9 pr-4 py-2.5 rounded-xl border border-[#e5e7eb] text-sm text-[#262626] placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#0470aa]/30 focus:border-[#0470aa] bg-white"
        />
      </div>

      {/* Table */}
      <div className="bg-white rounded-2xl border border-[#e5e7eb] overflow-hidden">
        {loading ? (
          <div className="p-8 text-center text-sm text-[#6e6e6e]">Loading users…</div>
        ) : filtered.length === 0 ? (
          <div className="p-12 text-center">
            <FaUsers className="w-10 h-10 text-gray-200 mx-auto mb-3" />
            <p className="text-sm text-[#6e6e6e]">No users found.</p>
          </div>
        ) : (
          <table className="w-full text-sm">
            <thead className="bg-[#f4f8fb] border-b border-[#e5e7eb]">
              <tr>
                <th className="text-left px-5 py-3 text-xs font-semibold text-[#6e6e6e] uppercase tracking-wide">User</th>
                <th className="text-left px-5 py-3 text-xs font-semibold text-[#6e6e6e] uppercase tracking-wide hidden sm:table-cell">Email</th>
                <th className="text-left px-5 py-3 text-xs font-semibold text-[#6e6e6e] uppercase tracking-wide hidden md:table-cell">Role</th>
                <th className="text-right px-5 py-3 text-xs font-semibold text-[#6e6e6e] uppercase tracking-wide">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#f4f8fb]">
              {filtered.map((u) => {
                const isMe = (u._id || u.id) === (currentUser?._id || currentUser?.id);
                return (
                  <tr key={u._id || u.id} className="hover:bg-[#f9fbfd] transition-colors">
                    <td className="px-5 py-3.5">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-full bg-[#0470aa] flex items-center justify-center text-white text-xs font-bold flex-shrink-0">
                          {u.username?.charAt(0).toUpperCase()}
                        </div>
                        <div>
                          <span className="font-medium text-[#262626]">{u.username}</span>
                          {isMe && (
                            <span className="ml-2 text-[10px] text-[#0470aa] font-semibold bg-[#e9f4fb] px-1.5 py-0.5 rounded-full">You</span>
                          )}
                        </div>
                      </div>
                    </td>
                    <td className="px-5 py-3.5 text-[#6e6e6e] hidden sm:table-cell">{u.email}</td>
                    <td className="px-5 py-3.5 hidden md:table-cell">
                      <span className={`inline-flex px-2.5 py-0.5 rounded-full text-xs font-medium ${ROLE_COLORS[u.role] || 'bg-gray-100 text-gray-700'}`}>
                        {u.role}
                      </span>
                    </td>
                    <td className="px-5 py-3.5">
                      <div className="flex items-center justify-end gap-2">
                        <button
                          onClick={() => openEdit(u)}
                          className="p-1.5 rounded-lg text-gray-400 hover:text-[#0470aa] hover:bg-[#e9f4fb] transition-colors"
                          title="Edit Role"
                        >
                          <FaEdit className="w-3.5 h-3.5" />
                        </button>
                        <button
                          onClick={() => setDeleteTarget(u)}
                          disabled={isMe}
                          className="p-1.5 rounded-lg text-gray-400 hover:text-red-500 hover:bg-red-50 transition-colors disabled:opacity-30 disabled:cursor-not-allowed"
                          title={isMe ? "Can't delete yourself" : 'Delete'}
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

      {/* ── Create User Modal ── */}
      {createOpen && (
        <Modal title="Add New User" onClose={() => setCreateOpen(false)}>
          <form onSubmit={handleCreate} className="space-y-4">
            <div>
              <label className="block text-xs font-semibold text-[#262626] mb-1.5 uppercase tracking-wide">Username</label>
              <input
                required
                type="text"
                value={createForm.username}
                onChange={(e) => setCreateForm((p) => ({ ...p, username: e.target.value }))}
                placeholder="john_doe"
                className="w-full px-3.5 py-2.5 rounded-xl border border-[#e5e7eb] text-sm text-[#262626] focus:outline-none focus:ring-2 focus:ring-[#0470aa]/30 focus:border-[#0470aa] bg-[#f9fafb]"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-[#262626] mb-1.5 uppercase tracking-wide">Email</label>
              <input
                required
                type="email"
                value={createForm.email}
                onChange={(e) => setCreateForm((p) => ({ ...p, email: e.target.value }))}
                placeholder="john@unispark.com"
                className="w-full px-3.5 py-2.5 rounded-xl border border-[#e5e7eb] text-sm text-[#262626] focus:outline-none focus:ring-2 focus:ring-[#0470aa]/30 focus:border-[#0470aa] bg-[#f9fafb]"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-[#262626] mb-1.5 uppercase tracking-wide">Password</label>
              <div className="relative">
                <input
                  required
                  type={showPwd ? 'text' : 'password'}
                  value={createForm.password}
                  onChange={(e) => setCreateForm((p) => ({ ...p, password: e.target.value }))}
                  placeholder="••••••••"
                  className="w-full pl-3.5 pr-10 py-2.5 rounded-xl border border-[#e5e7eb] text-sm text-[#262626] focus:outline-none focus:ring-2 focus:ring-[#0470aa]/30 focus:border-[#0470aa] bg-[#f9fafb]"
                />
                <button
                  type="button"
                  onClick={() => setShowPwd((p) => !p)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-[#0470aa]"
                >
                  {showPwd ? <FaEyeSlash className="w-3.5 h-3.5" /> : <FaEye className="w-3.5 h-3.5" />}
                </button>
              </div>
            </div>
            <div>
              <label className="block text-xs font-semibold text-[#262626] mb-1.5 uppercase tracking-wide">Role</label>
              <select
                value={createForm.role}
                onChange={(e) => setCreateForm((p) => ({ ...p, role: e.target.value }))}
                className="w-full px-3.5 py-2.5 rounded-xl border border-[#e5e7eb] text-sm text-[#262626] focus:outline-none focus:ring-2 focus:ring-[#0470aa]/30 focus:border-[#0470aa] bg-[#f9fafb]"
              >
                {ROLES.map((r) => <option key={r} value={r}>{r}</option>)}
              </select>
            </div>
            <div className="pt-2 flex gap-3">
              <button
                type="button"
                onClick={() => setCreateOpen(false)}
                className="flex-1 py-2.5 rounded-xl border border-[#e5e7eb] text-sm text-[#262626] hover:bg-[#f4f8fb] transition-colors"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={saving}
                className="flex-1 btn-unispark-pill text-xs py-2.5 disabled:opacity-60 flex items-center justify-center gap-2"
              >
                <FaSave className="w-3.5 h-3.5" />
                {saving ? 'Creating…' : 'Create User'}
              </button>
            </div>
          </form>
        </Modal>
      )}

      {/* ── Edit Role Modal ── */}
      {editTarget && (
        <Modal title={`Edit Role — ${editTarget.username}`} onClose={() => setEditTarget(null)}>
          <div className="space-y-4">
            <p className="text-sm text-[#6e6e6e]">Change the role for this user.</p>
            <div>
              <label className="block text-xs font-semibold text-[#262626] mb-1.5 uppercase tracking-wide">Role</label>
              <select
                value={editRole}
                onChange={(e) => setEditRole(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl border border-[#e5e7eb] text-sm text-[#262626] focus:outline-none focus:ring-2 focus:ring-[#0470aa]/30 focus:border-[#0470aa] bg-[#f9fafb]"
              >
                {ROLES.map((r) => <option key={r} value={r}>{r}</option>)}
              </select>
            </div>
            <div className="flex gap-3 pt-2">
              <button
                onClick={() => setEditTarget(null)}
                className="flex-1 py-2.5 rounded-xl border border-[#e5e7eb] text-sm text-[#262626] hover:bg-[#f4f8fb] transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleEditSave}
                disabled={saving || editRole === editTarget.role}
                className="flex-1 btn-unispark-pill text-xs py-2.5 disabled:opacity-60 flex items-center justify-center gap-2"
              >
                <FaSave className="w-3.5 h-3.5" />
                {saving ? 'Saving…' : 'Save Role'}
              </button>
            </div>
          </div>
        </Modal>
      )}

      {/* ── Delete Confirm ── */}
      {deleteTarget && (
        <ConfirmDialog
          user={deleteTarget}
          onConfirm={handleDelete}
          onCancel={() => setDeleteTarget(null)}
          loading={deleting}
        />
      )}
    </div>
  );
};

export default AdminUsers;
