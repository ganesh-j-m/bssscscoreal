import React, { useEffect, useState } from 'react';
import {
  UserCheck,
  Plus,
  Search,
  Filter,
  Edit,
  Trash2,
  Mail,
  Phone,
  BookOpen,
  Award,
  CheckCircle2
} from 'lucide-react';
import { api } from '../../services/api.ts';
import { Faculty } from '../../types/index.ts';
import { Modal } from '../../components/common/Modal.tsx';
import { ConfirmModal } from '../../components/common/ConfirmModal.tsx';

export const FacultyAdminPage: React.FC = () => {
  const [facultyList, setFacultyList] = useState<Faculty[]>([]);
  const [search, setSearch] = useState('');
  const [selectedDept, setSelectedDept] = useState('ALL');
  const [isLoading, setIsLoading] = useState(true);

  // Modals
  const [isAddOpen, setIsAddOpen] = useState(false);
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);
  const [selectedFaculty, setSelectedFaculty] = useState<Faculty | null>(null);

  // Form
  const [formData, setFormData] = useState({
    facultyId: '',
    name: '',
    email: '',
    phone: '',
    department: 'Computer Science & IT',
    designation: 'Assistant Professor',
    qualification: 'M.Sc., SET/NET',
    specialization: 'Artificial Intelligence & Databases',
    doj: '2023-07-01',
    password: '',
  });
  const [formError, setFormError] = useState<string | null>(null);

  const fetchFaculty = async () => {
    setIsLoading(true);
    try {
      const res = await api.getFaculty();
      if (res.faculty) {
        setFacultyList(res.faculty);
      }
    } catch (err: any) {
      console.error('Error fetching faculty:', err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchFaculty();
  }, []);

  const handleOpenAdd = () => {
    const autoId = `FAC${Math.floor(100 + Math.random() * 900)}`;
    setFormData({
      facultyId: autoId,
      name: '',
      email: '',
      phone: '',
      department: 'Computer Science & IT',
      designation: 'Assistant Professor',
      qualification: 'M.Sc. Comp. Sci., NET',
      specialization: 'Cloud Computing & Cyber Security',
      doj: new Date().toISOString().split('T')[0],
      password: 'Faculty@123',
    });
    setFormError(null);
    setIsAddOpen(true);
  };

  const handleOpenEdit = (fac: Faculty) => {
    setSelectedFaculty(fac);
    setFormData({
      facultyId: fac.facultyId,
      name: fac.name,
      email: fac.email,
      phone: fac.phone || '',
      department: fac.department,
      designation: fac.designation,
      qualification: fac.qualification || '',
      specialization: fac.specialization || '',
      doj: fac.doj ? new Date(fac.doj).toISOString().split('T')[0] : '',
      password: '',
    });
    setFormError(null);
    setIsEditOpen(true);
  };

  const handleSaveAdd = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormError(null);
    try {
      await api.createFaculty(formData);
      setIsAddOpen(false);
      fetchFaculty();
    } catch (err: any) {
      setFormError(err.message || 'Failed to add faculty member');
    }
  };

  const handleSaveEdit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedFaculty) return;
    setFormError(null);
    try {
      await api.updateFaculty(selectedFaculty.id, formData);
      setIsEditOpen(false);
      fetchFaculty();
    } catch (err: any) {
      setFormError(err.message || 'Failed to update faculty member');
    }
  };

  const handleDeleteConfirm = async () => {
    if (!selectedFaculty) return;
    try {
      await api.deleteFaculty(selectedFaculty.id);
      setIsDeleteOpen(false);
      fetchFaculty();
    } catch (err: any) {
      alert(err.message || 'Failed to delete faculty');
    }
  };

  const departments = ['ALL', ...Array.from(new Set(facultyList.map((f) => f.department)))];

  const filtered = facultyList.filter((f) => {
    const matchesDept = selectedDept === 'ALL' || f.department === selectedDept;
    const matchesSearch =
      !search ||
      f.name.toLowerCase().includes(search.toLowerCase()) ||
      f.facultyId.toLowerCase().includes(search.toLowerCase()) ||
      f.department.toLowerCase().includes(search.toLowerCase()) ||
      f.designation.toLowerCase().includes(search.toLowerCase());
    return matchesDept && matchesSearch;
  });

  return (
    <div className="space-y-6 p-4 sm:p-6 lg:p-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl sm:text-2xl font-extrabold text-slate-900 tracking-tight">
            Faculty & Teaching Staff Management
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 font-medium mt-0.5">
            Manage academic profiles, department designations, credentials, and ERP login accounts.
          </p>
        </div>

        <button
          onClick={handleOpenAdd}
          className="inline-flex items-center justify-center space-x-2 px-4 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-semibold shadow-sm transition-all"
        >
          <Plus className="w-4 h-4" />
          <span>Add Faculty Member</span>
        </button>
      </div>

      {/* Filter and Search Bar */}
      <div className="bg-white rounded-2xl border border-slate-200 p-4 flex flex-col md:flex-row items-stretch md:items-center justify-between gap-3 shadow-xs">
        <div className="relative flex-1">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search faculty by name, ID, or subject..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-9 pr-4 py-2 rounded-xl border border-slate-200 text-xs text-slate-800 placeholder-slate-400 focus:outline-hidden focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-600"
          />
        </div>

        <div className="flex items-center space-x-2">
          <Filter className="w-4 h-4 text-slate-400" />
          <select
            value={selectedDept}
            onChange={(e) => setSelectedDept(e.target.value)}
            className="px-3 py-2 rounded-xl border border-slate-200 text-xs text-slate-700 bg-white focus:outline-hidden focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-600"
          >
            {departments.map((d) => (
              <option key={d} value={d}>
                {d === 'ALL' ? 'All Departments' : d}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Faculty Cards / Table */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-xs overflow-hidden">
        {isLoading ? (
          <div className="p-12 text-center text-slate-400 text-sm">Loading faculty records...</div>
        ) : filtered.length === 0 ? (
          <div className="p-12 text-center text-slate-400 text-sm">No faculty members found.</div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs text-slate-700">
              <thead className="bg-slate-50 text-slate-500 uppercase font-semibold text-[11px] border-b border-slate-200">
                <tr>
                  <th className="py-3.5 px-4">Faculty Member</th>
                  <th className="py-3.5 px-4">Department & Role</th>
                  <th className="py-3.5 px-4">Qualifications</th>
                  <th className="py-3.5 px-4">Specialization</th>
                  <th className="py-3.5 px-4">Contact</th>
                  <th className="py-3.5 px-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 font-medium">
                {filtered.map((fac) => (
                  <tr key={fac.id} className="hover:bg-slate-50/70 transition-colors">
                    <td className="py-3.5 px-4">
                      <div className="flex items-center space-x-3">
                        <div className="w-9 h-9 rounded-xl bg-indigo-50 text-indigo-700 font-bold flex items-center justify-center text-xs shrink-0">
                          {fac.name.charAt(0)}
                        </div>
                        <div>
                          <div className="font-bold text-slate-900">{fac.name}</div>
                          <span className="text-[11px] text-slate-400 font-mono">
                            ID: {fac.facultyId}
                          </span>
                        </div>
                      </div>
                    </td>
                    <td className="py-3.5 px-4">
                      <div className="font-semibold text-slate-800">{fac.department}</div>
                      <div className="text-[11px] text-indigo-600 font-medium">{fac.designation}</div>
                    </td>
                    <td className="py-3.5 px-4 text-slate-600">
                      {fac.qualification || 'M.Sc., SET/NET'}
                    </td>
                    <td className="py-3.5 px-4 text-slate-600">
                      {fac.specialization || 'Teaching & Research'}
                    </td>
                    <td className="py-3.5 px-4 text-slate-600">
                      <div className="flex flex-col space-y-0.5 text-[11px]">
                        <span className="flex items-center gap-1 text-slate-500">
                          <Mail className="w-3 h-3 text-slate-400" />
                          {fac.email}
                        </span>
                        {fac.phone && (
                          <span className="flex items-center gap-1 text-slate-500">
                            <Phone className="w-3 h-3 text-slate-400" />
                            {fac.phone}
                          </span>
                        )}
                      </div>
                    </td>
                    <td className="py-3.5 px-4 text-right">
                      <div className="flex items-center justify-end space-x-1">
                        <button
                          onClick={() => handleOpenEdit(fac)}
                          className="p-1.5 text-slate-400 hover:text-indigo-600 hover:bg-slate-100 rounded-lg transition-colors"
                          title="Edit Faculty"
                        >
                          <Edit className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => {
                            setSelectedFaculty(fac);
                            setIsDeleteOpen(true);
                          }}
                          className="p-1.5 text-slate-400 hover:text-red-600 hover:bg-slate-100 rounded-lg transition-colors"
                          title="Delete Faculty"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Add Modal */}
      <Modal
        isOpen={isAddOpen}
        onClose={() => setIsAddOpen(false)}
        title="Add New Faculty Member"
      >
        <form onSubmit={handleSaveAdd} className="space-y-4">
          {formError && (
            <div className="p-3 bg-red-50 text-red-700 text-xs rounded-xl font-medium">
              {formError}
            </div>
          )}

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Faculty ID *
              </label>
              <input
                type="text"
                required
                value={formData.facultyId}
                onChange={(e) => setFormData({ ...formData, facultyId: e.target.value })}
                className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-600"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Full Name *
              </label>
              <input
                type="text"
                required
                placeholder="e.g. Prof. Arvind K. Deshmukh"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-600"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">Email *</label>
              <input
                type="email"
                required
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-600"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">Phone</label>
              <input
                type="text"
                value={formData.phone}
                onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-600"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Department *
              </label>
              <select
                value={formData.department}
                onChange={(e) => setFormData({ ...formData, department: e.target.value })}
                className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs bg-white focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-600"
              >
                <option value="Computer Science & IT">Computer Science & IT</option>
                <option value="Faculty of Science">Faculty of Science</option>
                <option value="Faculty of Commerce">Faculty of Commerce</option>
                <option value="Faculty of Arts">Faculty of Arts</option>
                <option value="Physical Education">Physical Education</option>
              </select>
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Designation *
              </label>
              <input
                type="text"
                required
                value={formData.designation}
                onChange={(e) => setFormData({ ...formData, designation: e.target.value })}
                className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-600"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Qualifications
              </label>
              <input
                type="text"
                value={formData.qualification}
                onChange={(e) => setFormData({ ...formData, qualification: e.target.value })}
                className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-600"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Specialization
              </label>
              <input
                type="text"
                value={formData.specialization}
                onChange={(e) => setFormData({ ...formData, specialization: e.target.value })}
                className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-600"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              Portal Initial Password (User account will be created automatically)
            </label>
            <input
              type="text"
              value={formData.password}
              onChange={(e) => setFormData({ ...formData, password: e.target.value })}
              className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-600 font-mono"
            />
          </div>

          <div className="flex justify-end space-x-2 pt-2 border-t border-slate-100">
            <button
              type="button"
              onClick={() => setIsAddOpen(false)}
              className="px-4 py-2 rounded-xl text-xs font-semibold text-slate-600 hover:bg-slate-100"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 rounded-xl text-xs font-semibold bg-indigo-600 text-white hover:bg-indigo-700 shadow-sm"
            >
              Create Faculty
            </button>
          </div>
        </form>
      </Modal>

      {/* Edit Modal */}
      <Modal
        isOpen={isEditOpen}
        onClose={() => setIsEditOpen(false)}
        title={`Edit Faculty: ${selectedFaculty?.name}`}
      >
        <form onSubmit={handleSaveEdit} className="space-y-4">
          {formError && (
            <div className="p-3 bg-red-50 text-red-700 text-xs rounded-xl font-medium">
              {formError}
            </div>
          )}

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">Full Name *</label>
            <input
              type="text"
              required
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-600"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">Email *</label>
              <input
                type="email"
                required
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-600"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">Phone</label>
              <input
                type="text"
                value={formData.phone}
                onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-600"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">Department</label>
              <input
                type="text"
                required
                value={formData.department}
                onChange={(e) => setFormData({ ...formData, department: e.target.value })}
                className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-600"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">Designation</label>
              <input
                type="text"
                required
                value={formData.designation}
                onChange={(e) => setFormData({ ...formData, designation: e.target.value })}
                className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-600"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Qualifications
              </label>
              <input
                type="text"
                value={formData.qualification}
                onChange={(e) => setFormData({ ...formData, qualification: e.target.value })}
                className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-600"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Specialization
              </label>
              <input
                type="text"
                value={formData.specialization}
                onChange={(e) => setFormData({ ...formData, specialization: e.target.value })}
                className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-600"
              />
            </div>
          </div>

          <div className="flex justify-end space-x-2 pt-2 border-t border-slate-100">
            <button
              type="button"
              onClick={() => setIsEditOpen(false)}
              className="px-4 py-2 rounded-xl text-xs font-semibold text-slate-600 hover:bg-slate-100"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 rounded-xl text-xs font-semibold bg-indigo-600 text-white hover:bg-indigo-700 shadow-sm"
            >
              Update Faculty
            </button>
          </div>
        </form>
      </Modal>

      {/* Delete Confirmation */}
      <ConfirmModal
        isOpen={isDeleteOpen}
        onClose={() => setIsDeleteOpen(false)}
        onConfirm={handleDeleteConfirm}
        title="Delete Faculty Member"
        message={`Are you sure you want to remove ${selectedFaculty?.name} (${selectedFaculty?.facultyId}) from the directory?`}
      />
    </div>
  );
};
