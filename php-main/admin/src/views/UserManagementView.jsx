import React, { useState, useEffect } from 'react';
import { Edit3, Trash2, UserPlus, RefreshCw, X, Check, Search, Shield, Mail, User } from 'lucide-react';
import { fetchUsers, updateUserDetails, createUser, deleteUserById } from '../services/api';

export default function UserManagementView({ onShowToast }) {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  
  // Edit User Modal State
  const [editingUser, setEditingUser] = useState(null);
  const [editForm, setEditForm] = useState({ name: '', email: '', role: 'Editor', status: 'Active' });
  const [isUpdating, setIsUpdating] = useState(false);

  // Add User Modal State
  const [showAddModal, setShowAddModal] = useState(false);
  const [addForm, setAddForm] = useState({ name: '', email: '', role: 'Editor', status: 'Active' });
  const [isCreating, setIsCreating] = useState(false);

  // Load Users from Backend API
  const loadUsers = async () => {
    setLoading(true);
    const res = await fetchUsers();
    if (res.success && res.data) {
      setUsers(res.data);
    } else {
      onShowToast('Could not load users from backend');
    }
    setLoading(false);
  };

  useEffect(() => {
    loadUsers();
  }, []);

  // Open Edit Modal
  const handleOpenEdit = (user) => {
    setEditingUser(user);
    setEditForm({
      name: user.name,
      email: user.email,
      role: user.role || 'Editor',
      status: user.status || 'Active'
    });
  };

  // Submit Edit User
  const handleSaveEdit = async (e) => {
    e.preventDefault();
    if (!editingUser) return;
    setIsUpdating(true);

    const res = await updateUserDetails(editingUser._id, editForm);
    setIsUpdating(false);

    if (res.success) {
      onShowToast(`User ${editForm.name} details updated successfully!`);
      setEditingUser(null);
      loadUsers(); // Refresh table
    } else {
      onShowToast(`Error: ${res.message || 'Failed to update user'}`);
    }
  };

  // Submit Add User
  const handleSaveAdd = async (e) => {
    e.preventDefault();
    if (!addForm.name || !addForm.email) {
      onShowToast('Please provide Name and Email');
      return;
    }
    setIsCreating(true);

    const res = await createUser(addForm);
    setIsCreating(false);

    if (res.success) {
      onShowToast(`User ${addForm.name} added successfully!`);
      setShowAddModal(false);
      setAddForm({ name: '', email: '', role: 'Editor', status: 'Active' });
      loadUsers(); // Refresh table
    } else {
      onShowToast(`Error: ${res.message || 'Failed to create user'}`);
    }
  };

  // Handle Delete
  const handleDelete = async (user) => {
    if (window.confirm(`Are you sure you want to delete user ${user.name}?`)) {
      const res = await deleteUserById(user._id);
      if (res.success) {
        onShowToast(`User ${user.name} deleted`);
        loadUsers();
      } else {
        onShowToast('Failed to delete user');
      }
    }
  };

  // Filtered users
  const filteredUsers = users.filter(u =>
    u.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    u.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    u.role?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="content-card">
      <div className="content-card-header">
        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
          <h2 className="card-title">
            <User size={20} color="var(--primary)" />
            Users Management
          </h2>
          <button
            onClick={loadUsers}
            title="Refresh Users List"
            style={{ color: 'var(--text-muted)', display: 'flex', alignItems: 'center' }}
          >
            <RefreshCw size={16} className={loading ? 'spin' : ''} />
          </button>
        </div>

        <div style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
          {/* Search Filter */}
          <div className="search-container" style={{ width: '220px' }}>
            <Search className="search-icon" size={14} />
            <input
              type="text"
              className="search-input"
              style={{ fontSize: '0.8rem', padding: '0.4rem 0.8rem 0.4rem 2.2rem' }}
              placeholder="Filter users..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>

          {/* Add User Button */}
          <button
            className="btn-primary"
            style={{ margin: 0, padding: '0.45rem 1rem', fontSize: '0.85rem' }}
            onClick={() => setShowAddModal(true)}
          >
            <UserPlus size={15} />
            <span>Add User</span>
          </button>
        </div>
      </div>

      <div className="content-card-body" style={{ padding: '0' }}>
        {loading ? (
          <div style={{ padding: '3rem', textAlign: 'center', color: 'var(--text-muted)' }}>
            Loading users from MongoDB database...
          </div>
        ) : (
          <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '0.875rem' }}>
            <thead>
              <tr style={{ borderBottom: '1px solid var(--border-color)', color: 'var(--text-muted)', backgroundColor: 'var(--bg-input)' }}>
                <th style={{ padding: '0.9rem 1.25rem' }}>User Information</th>
                <th style={{ padding: '0.9rem 1.25rem' }}>Email Address</th>
                <th style={{ padding: '0.9rem 1.25rem' }}>Role</th>
                <th style={{ padding: '0.9rem 1.25rem' }}>Status</th>
                <th style={{ padding: '0.9rem 1.25rem', textAlign: 'right' }}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredUsers.length === 0 ? (
                <tr>
                  <td colSpan={5} style={{ padding: '2.5rem', textAlign: 'center', color: 'var(--text-muted)' }}>
                    No users found. Click "Add User" to create one.
                  </td>
                </tr>
              ) : (
                filteredUsers.map((u) => (
                  <tr key={u._id} style={{ borderBottom: '1px solid var(--border-color)', transition: 'var(--transition)' }}>
                    <td style={{ padding: '1rem 1.25rem', fontWeight: 600 }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                        <div className="avatar" style={{ width: '32px', height: '32px', fontSize: '0.8rem' }}>
                          {u.name ? u.name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2) : 'U'}
                        </div>
                        <span>{u.name}</span>
                      </div>
                    </td>

                    <td style={{ padding: '1rem 1.25rem', color: 'var(--text-muted)' }}>
                      {u.email}
                    </td>

                    <td style={{ padding: '1rem 1.25rem' }}>
                      <span style={{
                        padding: '0.25rem 0.75rem',
                        borderRadius: 'var(--radius-full)',
                        fontSize: '0.75rem',
                        fontWeight: 600,
                        backgroundColor: u.role === 'Super Admin' ? 'rgba(99, 102, 241, 0.2)' : 'rgba(59, 130, 246, 0.15)',
                        color: u.role === 'Super Admin' ? 'var(--primary)' : 'var(--info)'
                      }}>
                        {u.role || 'Editor'}
                      </span>
                    </td>

                    <td style={{ padding: '1rem 1.25rem' }}>
                      <span style={{
                        padding: '0.2rem 0.65rem',
                        borderRadius: 'var(--radius-full)',
                        fontSize: '0.75rem',
                        fontWeight: 500,
                        backgroundColor: u.status === 'Active' ? 'rgba(16, 185, 129, 0.15)' : 'rgba(239, 68, 68, 0.15)',
                        color: u.status === 'Active' ? 'var(--success)' : 'var(--danger)'
                      }}>
                        ● {u.status || 'Active'}
                      </span>
                    </td>

                    <td style={{ padding: '1rem 1.25rem', textAlign: 'right' }}>
                      <div style={{ display: 'flex', gap: '0.5rem', justifyContent: 'flex-end' }}>
                        {/* EDIT ICON BUTTON */}
                        <button
                          onClick={() => handleOpenEdit(u)}
                          title="Edit User Details"
                          style={{
                            padding: '0.4rem',
                            borderRadius: 'var(--radius-sm)',
                            backgroundColor: 'var(--primary-light)',
                            color: 'var(--primary)',
                            border: '1px solid rgba(99, 102, 241, 0.3)',
                            cursor: 'pointer',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center'
                          }}
                        >
                          <Edit3 size={15} />
                        </button>

                        {/* DELETE BUTTON */}
                        <button
                          onClick={() => handleDelete(u)}
                          title="Delete User"
                          style={{
                            padding: '0.4rem',
                            borderRadius: 'var(--radius-sm)',
                            backgroundColor: 'rgba(239, 68, 68, 0.15)',
                            color: 'var(--danger)',
                            border: '1px solid rgba(239, 68, 68, 0.3)',
                            cursor: 'pointer',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center'
                          }}
                        >
                          <Trash2 size={15} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        )}
      </div>

      {/* EDIT USER MODAL DIALOG */}
      {editingUser && (
        <div style={{
          position: 'fixed',
          inset: 0,
          backgroundColor: 'rgba(0,0,0,0.7)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 1000
        }}>
          <div className="content-card" style={{ width: '480px', maxWidth: '90vw' }}>
            <div className="content-card-header">
              <h3 className="card-title">
                <Edit3 size={18} color="var(--primary)" />
                Edit User Details
              </h3>
              <button onClick={() => setEditingUser(null)} style={{ color: 'var(--text-muted)' }}>
                <X size={18} />
              </button>
            </div>

            <div className="content-card-body">
              <form onSubmit={handleSaveEdit} style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
                <div className="form-group">
                  <label className="form-label" htmlFor="edit-name">Full Name</label>
                  <input
                    id="edit-name"
                    type="text"
                    className="form-control"
                    value={editForm.name}
                    onChange={(e) => setEditForm({ ...editForm, name: e.target.value })}
                    required
                  />
                </div>

                <div className="form-group">
                  <label className="form-label" htmlFor="edit-email">Email Address</label>
                  <input
                    id="edit-email"
                    type="email"
                    className="form-control"
                    value={editForm.email}
                    onChange={(e) => setEditForm({ ...editForm, email: e.target.value })}
                    required
                  />
                </div>

                <div className="form-group">
                  <label className="form-label" htmlFor="edit-role">User Role</label>
                  <select
                    id="edit-role"
                    className="form-control"
                    value={editForm.role}
                    onChange={(e) => setEditForm({ ...editForm, role: e.target.value })}
                  >
                    <option value="Super Admin">Super Admin</option>
                    <option value="Admin">Admin</option>
                    <option value="Editor">Editor</option>
                    <option value="Viewer">Viewer</option>
                  </select>
                </div>

                <div className="form-group">
                  <label className="form-label" htmlFor="edit-status">Status</label>
                  <select
                    id="edit-status"
                    className="form-control"
                    value={editForm.status}
                    onChange={(e) => setEditForm({ ...editForm, status: e.target.value })}
                  >
                    <option value="Active">Active</option>
                    <option value="Inactive">Inactive</option>
                    <option value="Pending">Pending</option>
                  </select>
                </div>

                <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.75rem', marginTop: '0.5rem' }}>
                  <button
                    type="button"
                    className="file-upload-btn"
                    onClick={() => setEditingUser(null)}
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="btn-primary"
                    style={{ margin: 0 }}
                    disabled={isUpdating}
                  >
                    {isUpdating ? 'Saving...' : 'Save User Details'}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}

      {/* ADD USER MODAL DIALOG */}
      {showAddModal && (
        <div style={{
          position: 'fixed',
          inset: 0,
          backgroundColor: 'rgba(0,0,0,0.7)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 1000
        }}>
          <div className="content-card" style={{ width: '480px', maxWidth: '90vw' }}>
            <div className="content-card-header">
              <h3 className="card-title">
                <UserPlus size={18} color="var(--primary)" />
                Register New User
              </h3>
              <button onClick={() => setShowAddModal(false)} style={{ color: 'var(--text-muted)' }}>
                <X size={18} />
              </button>
            </div>

            <div className="content-card-body">
              <form onSubmit={handleSaveAdd} style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
                <div className="form-group">
                  <label className="form-label" htmlFor="add-name">Full Name</label>
                  <input
                    id="add-name"
                    type="text"
                    className="form-control"
                    placeholder="e.g. Rahul Sharma"
                    value={addForm.name}
                    onChange={(e) => setAddForm({ ...addForm, name: e.target.value })}
                    required
                  />
                </div>

                <div className="form-group">
                  <label className="form-label" htmlFor="add-email">Email Address</label>
                  <input
                    id="add-email"
                    type="email"
                    className="form-control"
                    placeholder="e.g. rahul@example.com"
                    value={addForm.email}
                    onChange={(e) => setAddForm({ ...addForm, email: e.target.value })}
                    required
                  />
                </div>

                <div className="form-group">
                  <label className="form-label" htmlFor="add-role">User Role</label>
                  <select
                    id="add-role"
                    className="form-control"
                    value={addForm.role}
                    onChange={(e) => setAddForm({ ...addForm, role: e.target.value })}
                  >
                    <option value="Super Admin">Super Admin</option>
                    <option value="Admin">Admin</option>
                    <option value="Editor">Editor</option>
                    <option value="Viewer">Viewer</option>
                  </select>
                </div>

                <div className="form-group">
                  <label className="form-label" htmlFor="add-status">Status</label>
                  <select
                    id="add-status"
                    className="form-control"
                    value={addForm.status}
                    onChange={(e) => setAddForm({ ...addForm, status: e.target.value })}
                  >
                    <option value="Active">Active</option>
                    <option value="Inactive">Inactive</option>
                  </select>
                </div>

                <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.75rem', marginTop: '0.5rem' }}>
                  <button
                    type="button"
                    className="file-upload-btn"
                    onClick={() => setShowAddModal(false)}
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="btn-primary"
                    style={{ margin: 0 }}
                    disabled={isCreating}
                  >
                    {isCreating ? 'Adding...' : 'Create User'}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}
