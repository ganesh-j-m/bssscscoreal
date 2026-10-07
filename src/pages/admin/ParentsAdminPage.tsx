import React, { useEffect, useState } from 'react';
import {
  Users,
  UserPlus,
  Search,
  Filter,
  Phone,
  Mail,
  GraduationCap,
  Briefcase
} from 'lucide-react';
import { api } from '../../services/api.ts';
import { Parent, Student } from '../../types/index.ts';
import { Modal } from '../../components/common/Modal.tsx';

export const ParentsAdminPage: React.FC = () => {
  const [parentsList, setParentsList] = useState<Parent[]>([]);
  const [studentsList, setStudentsList] = useState<Student[]>([]);
  const [search, setSearch] = useState('');
  const [isLoading, setIsLoading] = useState(true);

  // Modal
  const [isAddOpen, setIsAddOpen] = useState(false);
  const [formData, setFormData] = useState({
    parentId: '',
    name: '',
    email: '',
    phone: '',
    occupation: 'Farmer / Business',
    studentId: 0,
    studentLoginId: '',
    password: '',
  });
  const [formError, setFormError] = useState<string | null>(null);

  const fetchParents = async () => {
    setIsLoading(true);
    try {
      const [pRes, sRes] = await Promise.allSettled([
        api.getParents(),
        api.getStudents({ limit: '100' }),
      ]);
      if (pRes.status === 'fulfilled' && pRes.value.parents) {
        setParentsList(pRes.value.parents);
      }
      if (sRes.status === 'fulfilled' && sRes.value.students) {
        setStudentsList(sRes.value.students);
      }
    } catch (err: any) {
      console.error('Error fetching parents:', err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchParents();
  }, []);

  const handleOpenAdd = () => {
    const autoId = `PAR${Math.floor(100 + Math.random() * 900)}`;
    setFormData({
      parentId: autoId,
      name: '',
      email: '',
      phone: '',
      occupation: 'Agriculture / Service',
      studentId: studentsList.length > 0 ? studentsList[0].id : 0,
      studentLoginId: studentsList.length > 0 ? studentsList[0].studentId : '',
      password: 'Parent@123',
    });
    setFormError(null);
    setIsAddOpen(true);
  };

  const handleSaveAdd = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormError(null);
    try {
      await api.createParent(formData);
      setIsAddOpen(false);
      fetchParents();
    } catch (err: any) {
      setFormError(err.message || 'Failed to add parent account');
    }
  };

  const filtered = parentsList.filter((p) => {
    return (
      !search ||
      p.name.toLowerCase().includes(search.toLowerCase()) ||
      p.parentId?.toLowerCase().includes(search.toLowerCase()) ||
      p.email?.toLowerCase().includes(search.toLowerCase()) ||
      p.studentLoginId?.toLowerCase().includes(search.toLowerCase())
    );
  });

  return (
    <div className="space-y-6 p-4 sm:p-6 lg:p-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl sm:text-2xl font-extrabold text-slate-900 tracking-tight">
            Parent & Guardian Portal Management
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 font-medium mt-0.5">
            Link student wards to parents for automated attendance updates, grade tracking, and fee notifications.
          </p>
        </div>

        <button
          onClick={handleOpenAdd}
          className="inline-flex items-center justify-center space-x-2 px-4 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-semibold shadow-sm transition-all"
        >
          <UserPlus className="w-4 h-4" />
          <span>Add Parent Record</span>
        </button>
      </div>

      {/* Search */}
      <div className="bg-white rounded-2xl border border-slate-200 p-4 shadow-xs">
        <div className="relative">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search parent by name, ID, phone, or ward ID..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-9 pr-4 py-2 rounded-xl border border-slate-200 text-xs text-slate-800 placeholder-slate-400 focus:outline-hidden focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-600"
          />
        </div>
      </div>

      {/* Parents Table */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-xs overflow-hidden">
        {isLoading ? (
          <div className="p-12 text-center text-slate-400 text-sm">Loading parent records...</div>
        ) : filtered.length === 0 ? (
          <div className="p-12 text-center text-slate-400 text-sm">No parent records registered yet.</div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs text-slate-700">
              <thead className="bg-slate-50 text-slate-500 uppercase font-semibold text-[11px] border-b border-slate-200">
                <tr>
                  <th className="py-3.5 px-4">Parent / Guardian</th>
                  <th className="py-3.5 px-4">Linked Student Ward</th>
                  <th className="py-3.5 px-4">Occupation</th>
                  <th className="py-3.5 px-4">Contact Details</th>
                  <th className="py-3.5 px-4">Portal Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 font-medium">
                {filtered.map((par) => (
                  <tr key={par.id} className="hover:bg-slate-50/70 transition-colors">
                    <td className="py-3.5 px-4">
                      <div className="flex items-center space-x-3">
                        <div className="w-9 h-9 rounded-xl bg-purple-50 text-purple-700 font-bold flex items-center justify-center text-xs shrink-0">
                          {par.name.charAt(0)}
                        </div>
                        <div>
                          <div className="font-bold text-slate-900">{par.name}</div>
                          <span className="text-[11px] text-slate-400 font-mono">
                            ID: {par.parentId}
                          </span>
                        </div>
                      </div>
                    </td>
                    <td className="py-3.5 px-4">
                      <div className="flex items-center space-x-2">
                        <GraduationCap className="w-4 h-4 text-indigo-500" />
                        <span className="font-semibold text-slate-800">
                          {par.studentLoginId || 'Ward Linked'}
                        </span>
                      </div>
                    </td>
                    <td className="py-3.5 px-4 text-slate-600">
                      <div className="flex items-center space-x-1.5">
                        <Briefcase className="w-3.5 h-3.5 text-slate-400" />
                        <span>{par.occupation || 'Self-Employed'}</span>
                      </div>
                    </td>
                    <td className="py-3.5 px-4 text-slate-600">
                      <div className="flex flex-col space-y-0.5 text-[11px]">
                        {par.phone && (
                          <span className="flex items-center gap-1 text-slate-500">
                            <Phone className="w-3 h-3 text-slate-400" />
                            {par.phone}
                          </span>
                        )}
                        {par.email && (
                          <span className="flex items-center gap-1 text-slate-500">
                            <Mail className="w-3 h-3 text-slate-400" />
                            {par.email}
                          </span>
                        )}
                      </div>
                    </td>
                    <td className="py-3.5 px-4">
                      <span className="inline-flex items-center px-2 py-0.5 rounded-full text-[11px] font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200">
                        Active Account
                      </span>
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
        title="Add Parent / Guardian Record"
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
                Parent ID *
              </label>
              <input
                type="text"
                required
                value={formData.parentId}
                onChange={(e) => setFormData({ ...formData, parentId: e.target.value })}
                className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-600 font-mono"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Parent Name *
              </label>
              <input
                type="text"
                required
                placeholder="e.g. Ramesh S. Shinde"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-600"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Phone Number *
              </label>
              <input
                type="text"
                required
                placeholder="10-digit mobile"
                value={formData.phone}
                onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-600"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Email Address
              </label>
              <input
                type="email"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-600"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Select Student Ward *
              </label>
              <select
                value={formData.studentLoginId}
                onChange={(e) => {
                  const sel = studentsList.find((s) => s.studentId === e.target.value);
                  setFormData({
                    ...formData,
                    studentLoginId: e.target.value,
                    studentId: sel ? sel.id : 0,
                  });
                }}
                className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs bg-white focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-600"
              >
                {studentsList.map((s) => (
                  <option key={s.id} value={s.studentId}>
                    {s.name} ({s.studentId} - {s.course})
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">Occupation</label>
              <input
                type="text"
                value={formData.occupation}
                onChange={(e) => setFormData({ ...formData, occupation: e.target.value })}
                className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-600"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              Portal Password (Default)
            </label>
            <input
              type="text"
              value={formData.password}
              onChange={(e) => setFormData({ ...formData, password: e.target.value })}
              className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs font-mono focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-600"
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
              Save Parent Account
            </button>
          </div>
        </form>
      </Modal>
    </div>
  );
};
