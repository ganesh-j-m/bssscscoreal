import React, { useEffect, useState } from 'react';
import {
  Users,
  UserPlus,
  FileSpreadsheet,
  Search,
  Filter,
  Edit,
  Trash2,
  CheckCircle,
  XCircle,
  AlertCircle,
  ChevronLeft,
  ChevronRight,
  Upload
} from 'lucide-react';
import { api } from '../../services/api.ts';
import { User } from '../../types/index.ts';
import { Modal } from '../../components/common/Modal.tsx';
import { ConfirmModal } from '../../components/common/ConfirmModal.tsx';

export const UsersPage: React.FC = () => {
  const [users, setUsers] = useState<User[]>([]);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState('');
  const [roleFilter, setRoleFilter] = useState('ALL');
  const [statusFilter, setStatusFilter] = useState('ALL');
  const [isLoading, setIsLoading] = useState(true);

  // Modals
  const [isAddOpen, setIsAddOpen] = useState(false);
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);
  const [isImportOpen, setIsImportOpen] = useState(false);

  // Active records
  const [selectedUser, setSelectedUser] = useState<User | null>(null);

  // Form states
  const [formData, setFormData] = useState({
    loginId: '',
    name: '',
    email: '',
    phone: '',
    role: 'STUDENT',
    password: '',
    status: 'ACTIVE',
  });
  const [formError, setFormError] = useState<string | null>(null);

  // CSV Import State
  const [csvText, setCsvText] = useState('');
  const [importSummary, setImportSummary] = useState<any>(null);
  const [isImporting, setIsImporting] = useState(false);

  const fetchUsers = async () => {
    setIsLoading(true);
    try {
      const res = await api.getUsers({
        page: String(page),
        search,
        role: roleFilter,
        status: statusFilter,
        limit: '12',
      });
      if (res.users) {
        setUsers(res.users);
        setTotal(res.total);
      }
    } catch (err) {
      console.error('Error loading users:', err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, [page, roleFilter, statusFilter]);

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setPage(1);
    fetchUsers();
  };

  // Add User
  const handleCreateUser = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormError(null);
    try {
      await api.createUser(formData);
      setIsAddOpen(false);
      setFormData({ loginId: '', name: '', email: '', phone: '', role: 'STUDENT', password: '', status: 'ACTIVE' });
      fetchUsers();
    } catch (err: any) {
      setFormError(err.message || 'Failed to create user account.');
    }
  };

  // Edit User
  const handleUpdateUser = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedUser) return;
    setFormError(null);
    try {
      await api.updateUser(selectedUser.id, formData);
      setIsEditOpen(false);
      setSelectedUser(null);
      fetchUsers();
    } catch (err: any) {
      setFormError(err.message || 'Failed to update user.');
    }
  };

  // Delete User
  const handleDeleteUser = async () => {
    if (!selectedUser) return;
    try {
      await api.deleteUser(selectedUser.id);
      setIsDeleteOpen(false);
      setSelectedUser(null);
      fetchUsers();
    } catch (err: any) {
      alert(err.message || 'Failed to delete user.');
    }
  };

  // CSV Import parser
  const handleProcessCsv = async () => {
    if (!csvText.trim()) return;
    setIsImporting(true);
    setImportSummary(null);

    try {
      const lines = csvText.trim().split('\n');
      if (lines.length < 2) {
        alert('CSV must contain a header row and at least one data row.');
        setIsImporting(false);
        return;
      }

      // Format: loginId,name,email,role,phone,password
      const header = lines[0].split(',').map(h => h.trim().toLowerCase());
      const rows = [];

      for (let i = 1; i < lines.length; i++) {
        const line = lines[i].trim();
        if (!line) continue;
        const cols = line.split(',').map(c => c.trim());
        const row: any = {};
        header.forEach((h, idx) => {
          row[h] = cols[idx] || '';
        });
        rows.push({
          loginId: row.loginid || row['login id'] || cols[0],
          name: row.name || cols[1],
          email: row.email || cols[2],
          role: row.role || cols[3] || 'STUDENT',
          phone: row.phone || cols[4] || '',
          password: row.password || cols[5] || 'College@123',
        });
      }

      const res = await api.importUsersCsv(rows);
      setImportSummary(res);
      fetchUsers();
    } catch (err: any) {
      alert(err.message || 'CSV Import failed.');
    } finally {
      setIsImporting(false);
    }
  };

  return (
    <div className="space-y-6 p-4 sm:p-6 lg:p-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl sm:text-2xl font-extrabold text-slate-900 tracking-tight">
            User Accounts & Authority
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 font-medium mt-0.5">
            Manage system access, institutional Login IDs, roles, and CSV imports.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => {
              setImportSummary(null);
              setCsvText('loginId,name,email,role,phone,password\nSTU202501,Pooja Jadhav,pooja.j@gmail.com,STUDENT,+91 9422011223,Student@123\nFAC202501,Prof. Amit Kulkarni,amit.k@sharadacollege.edu.in,FACULTY,+91 9822144556,Faculty@123');
              setIsImportOpen(true);
            }}
            className="inline-flex items-center space-x-1.5 px-3 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold text-xs transition-colors"
          >
            <Upload className="w-3.5 h-3.5" />
            <span>Import Users (CSV)</span>
          </button>
          <button
            onClick={() => {
              setFormData({ loginId: '', name: '', email: '', phone: '', role: 'STUDENT', password: '', status: 'ACTIVE' });
              setFormError(null);
              setIsAddOpen(true);
            }}
            className="inline-flex items-center space-x-1.5 px-3.5 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-semibold text-xs transition-colors shadow-xs"
          >
            <UserPlus className="w-3.5 h-3.5" />
            <span>Create New User</span>
          </button>
        </div>
      </div>

      {/* Filter & Search Bar */}
      <div className="bg-white p-4 rounded-2xl border border-slate-200/80 shadow-xs flex flex-col md:flex-row items-center justify-between gap-4">
        <form onSubmit={handleSearchSubmit} className="relative w-full md:w-80">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search Login ID, name, email..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-10 pr-4 py-2 rounded-xl border border-slate-200 text-xs text-slate-800 placeholder-slate-400 focus:outline-hidden focus:border-indigo-600 focus:ring-2 focus:ring-indigo-500/20"
          />
        </form>

        <div className="flex items-center space-x-3 w-full md:w-auto">
          <select
            value={roleFilter}
            onChange={(e) => { setRoleFilter(e.target.value); setPage(1); }}
            className="px-3 py-2 rounded-xl border border-slate-200 text-xs font-semibold text-slate-700 bg-white"
          >
            <option value="ALL">All Roles</option>
            <option value="SUPER_ADMIN">SUPER_ADMIN</option>
            <option value="PRINCIPAL">PRINCIPAL</option>
            <option value="FACULTY">FACULTY</option>
            <option value="STUDENT">STUDENT</option>
            <option value="PARENT">PARENT</option>
            <option value="ALUMNI">ALUMNI</option>
          </select>

          <select
            value={statusFilter}
            onChange={(e) => { setStatusFilter(e.target.value); setPage(1); }}
            className="px-3 py-2 rounded-xl border border-slate-200 text-xs font-semibold text-slate-700 bg-white"
          >
            <option value="ALL">All Status</option>
            <option value="ACTIVE">ACTIVE</option>
            <option value="INACTIVE">INACTIVE</option>
          </select>
        </div>
      </div>

      {/* Users Table */}
      <div className="bg-white rounded-2xl border border-slate-200/80 shadow-xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50 border-b border-slate-200 text-slate-500 uppercase tracking-wider font-semibold">
              <tr>
                <th className="px-5 py-3.5">Login ID</th>
                <th className="px-5 py-3.5">Full Name</th>
                <th className="px-5 py-3.5">Email & Phone</th>
                <th className="px-5 py-3.5">Role</th>
                <th className="px-5 py-3.5">Status</th>
                <th className="px-5 py-3.5">Created Date</th>
                <th className="px-5 py-3.5 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {isLoading ? (
                <tr>
                  <td colSpan={7} className="px-5 py-8 text-center text-slate-400">
                    Loading user records from PostgreSQL database...
                  </td>
                </tr>
              ) : users.length === 0 ? (
                <tr>
                  <td colSpan={7} className="px-5 py-8 text-center text-slate-400">
                    No matching users found.
                  </td>
                </tr>
              ) : (
                users.map((u) => (
                  <tr key={u.id} className="hover:bg-slate-50/70 transition-colors">
                    <td className="px-5 py-3.5 font-mono font-bold text-indigo-700">
                      {u.loginId}
                    </td>
                    <td className="px-5 py-3.5 font-semibold text-slate-900">
                      {u.name}
                    </td>
                    <td className="px-5 py-3.5 text-slate-600">
                      <span className="block">{u.email}</span>
                      <span className="text-[11px] text-slate-400">{u.phone || '—'}</span>
                    </td>
                    <td className="px-5 py-3.5">
                      <span className="px-2 py-0.5 rounded text-[11px] font-semibold bg-indigo-50 text-indigo-700">
                        {u.role}
                      </span>
                    </td>
                    <td className="px-5 py-3.5">
                      <span className={`px-2 py-0.5 rounded text-[11px] font-semibold ${
                        u.status === 'ACTIVE' ? 'bg-emerald-50 text-emerald-700' : 'bg-slate-100 text-slate-600'
                      }`}>
                        {u.status}
                      </span>
                    </td>
                    <td className="px-5 py-3.5 text-slate-500">
                      {new Date(u.createdAt).toLocaleDateString()}
                    </td>
                    <td className="px-5 py-3.5 text-right space-x-2">
                      <button
                        onClick={() => {
                          setSelectedUser(u);
                          setFormData({
                            loginId: u.loginId,
                            name: u.name,
                            email: u.email,
                            phone: u.phone || '',
                            role: u.role,
                            password: '',
                            status: u.status,
                          });
                          setIsEditOpen(true);
                        }}
                        className="p-1 text-slate-500 hover:text-indigo-600 transition-colors"
                        title="Edit user"
                      >
                        <Edit className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => {
                          setSelectedUser(u);
                          setIsDeleteOpen(true);
                        }}
                        className="p-1 text-slate-500 hover:text-rose-600 transition-colors"
                        title="Delete user"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination Strip */}
        <div className="px-5 py-3.5 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500">
          <span>Total: <strong>{total}</strong> users</span>
          <div className="flex items-center space-x-2">
            <button
              onClick={() => setPage(p => Math.max(1, p - 1))}
              disabled={page === 1}
              className="p-1.5 rounded-lg border border-slate-200 disabled:opacity-40"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>
            <span className="font-semibold px-2">Page {page}</span>
            <button
              onClick={() => setPage(p => p + 1)}
              disabled={users.length < 12}
              className="p-1.5 rounded-lg border border-slate-200 disabled:opacity-40"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>

      {/* Add User Modal */}
      <Modal isOpen={isAddOpen} onClose={() => setIsAddOpen(false)} title="Create User Account">
        <form onSubmit={handleCreateUser} className="space-y-4">
          {formError && (
            <div className="p-3 rounded-xl bg-rose-50 text-rose-700 text-xs">{formError}</div>
          )}
          <div className="space-y-1">
            <label className="text-xs font-semibold text-slate-700">Login ID * (e.g. STU102, FAC05)</label>
            <input
              type="text"
              required
              value={formData.loginId}
              onChange={e => setFormData({ ...formData, loginId: e.target.value.toUpperCase() })}
              placeholder="Unique Institutional ID"
              className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs uppercase font-mono"
            />
          </div>
          <div className="space-y-1">
            <label className="text-xs font-semibold text-slate-700">Full Name *</label>
            <input
              type="text"
              required
              value={formData.name}
              onChange={e => setFormData({ ...formData, name: e.target.value })}
              className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs"
            />
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1">
              <label className="text-xs font-semibold text-slate-700">Email *</label>
              <input
                type="email"
                required
                value={formData.email}
                onChange={e => setFormData({ ...formData, email: e.target.value })}
                className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs"
              />
            </div>
            <div className="space-y-1">
              <label className="text-xs font-semibold text-slate-700">Phone</label>
              <input
                type="tel"
                value={formData.phone}
                onChange={e => setFormData({ ...formData, phone: e.target.value })}
                className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs"
              />
            </div>
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1">
              <label className="text-xs font-semibold text-slate-700">Role *</label>
              <select
                value={formData.role}
                onChange={e => setFormData({ ...formData, role: e.target.value as any })}
                className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs bg-white"
              >
                <option value="STUDENT">STUDENT</option>
                <option value="FACULTY">FACULTY</option>
                <option value="PRINCIPAL">PRINCIPAL</option>
                <option value="PARENT">PARENT</option>
                <option value="ALUMNI">ALUMNI</option>
                <option value="SUPER_ADMIN">SUPER_ADMIN</option>
              </select>
            </div>
            <div className="space-y-1">
              <label className="text-xs font-semibold text-slate-700">Initial Password *</label>
              <input
                type="password"
                required
                value={formData.password}
                onChange={e => setFormData({ ...formData, password: e.target.value })}
                placeholder="Initial password"
                className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs"
              />
            </div>
          </div>
          <div className="pt-3 flex justify-end gap-2">
            <button
              type="button"
              onClick={() => setIsAddOpen(false)}
              className="px-4 py-2 rounded-xl bg-slate-100 text-slate-700 text-xs font-semibold"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 rounded-xl bg-indigo-600 text-white text-xs font-semibold"
            >
              Create User in PostgreSQL
            </button>
          </div>
        </form>
      </Modal>

      {/* Edit User Modal */}
      <Modal isOpen={isEditOpen} onClose={() => setIsEditOpen(false)} title="Edit User">
        <form onSubmit={handleUpdateUser} className="space-y-4">
          {formError && (
            <div className="p-3 rounded-xl bg-rose-50 text-rose-700 text-xs">{formError}</div>
          )}
          <div className="space-y-1">
            <label className="text-xs font-semibold text-slate-700">Full Name</label>
            <input
              type="text"
              value={formData.name}
              onChange={e => setFormData({ ...formData, name: e.target.value })}
              className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs"
            />
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1">
              <label className="text-xs font-semibold text-slate-700">Email</label>
              <input
                type="email"
                value={formData.email}
                onChange={e => setFormData({ ...formData, email: e.target.value })}
                className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs"
              />
            </div>
            <div className="space-y-1">
              <label className="text-xs font-semibold text-slate-700">Phone</label>
              <input
                type="tel"
                value={formData.phone}
                onChange={e => setFormData({ ...formData, phone: e.target.value })}
                className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs"
              />
            </div>
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1">
              <label className="text-xs font-semibold text-slate-700">Status</label>
              <select
                value={formData.status}
                onChange={e => setFormData({ ...formData, status: e.target.value })}
                className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs bg-white"
              >
                <option value="ACTIVE">ACTIVE</option>
                <option value="INACTIVE">INACTIVE</option>
              </select>
            </div>
            <div className="space-y-1">
              <label className="text-xs font-semibold text-slate-700">New Password (Optional)</label>
              <input
                type="password"
                value={formData.password}
                onChange={e => setFormData({ ...formData, password: e.target.value })}
                placeholder="Leave blank to preserve"
                className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs"
              />
            </div>
          </div>
          <div className="pt-3 flex justify-end gap-2">
            <button
              type="button"
              onClick={() => setIsEditOpen(false)}
              className="px-4 py-2 rounded-xl bg-slate-100 text-slate-700 text-xs font-semibold"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 rounded-xl bg-indigo-600 text-white text-xs font-semibold"
            >
              Save Changes
            </button>
          </div>
        </form>
      </Modal>

      {/* Delete Confirmation Modal */}
      <ConfirmModal
        isOpen={isDeleteOpen}
        title={`Delete User ${selectedUser?.loginId}?`}
        message={`Are you sure you want to permanently delete user "${selectedUser?.name}" (${selectedUser?.loginId})? This action cannot be undone and will create a permanent Audit Log entry.`}
        onConfirm={handleDeleteUser}
        onCancel={() => setIsDeleteOpen(false)}
      />

      {/* CSV Bulk Import Modal */}
      <Modal isOpen={isImportOpen} onClose={() => setIsImportOpen(false)} title="Import Users via CSV" maxWidth="2xl">
        <div className="space-y-4">
          <p className="text-xs text-slate-600">
            Paste CSV formatted user data below. Required header fields: <code className="bg-slate-100 px-1 py-0.5 rounded text-indigo-700">loginId,name,email,role,phone,password</code>
          </p>

          <textarea
            rows={6}
            value={csvText}
            onChange={e => setCsvText(e.target.value)}
            className="w-full p-3 rounded-xl border border-slate-200 font-mono text-xs text-slate-800"
          />

          {importSummary && (
            <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 space-y-2 text-xs">
              <h4 className="font-bold text-slate-900">Import Summary:</h4>
              <div className="grid grid-cols-4 gap-2 text-center">
                <div className="p-2 bg-white rounded-lg border">
                  <span className="text-slate-500 block text-[10px]">TOTAL</span>
                  <strong className="text-sm">{importSummary.total}</strong>
                </div>
                <div className="p-2 bg-emerald-50 rounded-lg border border-emerald-200 text-emerald-700">
                  <span className="block text-[10px]">SUCCESS</span>
                  <strong className="text-sm">{importSummary.successful}</strong>
                </div>
                <div className="p-2 bg-amber-50 rounded-lg border border-amber-200 text-amber-700">
                  <span className="block text-[10px]">DUPLICATE</span>
                  <strong className="text-sm">{importSummary.duplicate}</strong>
                </div>
                <div className="p-2 bg-rose-50 rounded-lg border border-rose-200 text-rose-700">
                  <span className="block text-[10px]">INVALID</span>
                  <strong className="text-sm">{importSummary.invalid}</strong>
                </div>
              </div>
              {importSummary.errors && importSummary.errors.length > 0 && (
                <div className="pt-2 text-[11px] text-rose-600 max-h-24 overflow-y-auto">
                  {importSummary.errors.map((err: string, i: number) => (
                    <p key={i}>• {err}</p>
                  ))}
                </div>
              )}
            </div>
          )}

          <div className="flex justify-end gap-2 pt-2">
            <button
              onClick={() => setIsImportOpen(false)}
              className="px-4 py-2 rounded-xl bg-slate-100 text-slate-700 text-xs font-semibold"
            >
              Close
            </button>
            <button
              onClick={handleProcessCsv}
              disabled={isImporting}
              className="px-4 py-2 rounded-xl bg-indigo-600 text-white text-xs font-semibold"
            >
              {isImporting ? 'Processing...' : 'Execute Import to PostgreSQL'}
            </button>
          </div>
        </div>
      </Modal>
    </div>
  );
};
