import React, { useEffect, useState } from 'react';
import {
  GraduationCap,
  Plus,
  Search,
  Filter,
  Edit,
  Trash2,
  Eye,
  ChevronLeft,
  ChevronRight,
  Phone,
  Mail,
  CheckCircle2
} from 'lucide-react';
import { api } from '../../services/api.ts';
import { Student } from '../../types/index.ts';
import { Modal } from '../../components/common/Modal.tsx';
import { ConfirmModal } from '../../components/common/ConfirmModal.tsx';

export const StudentsPage: React.FC = () => {
  const [students, setStudents] = useState<Student[]>([]);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState('');
  const [deptFilter, setDeptFilter] = useState('ALL');
  const [courseFilter, setCourseFilter] = useState('ALL');
  const [yearFilter, setYearFilter] = useState('ALL');
  const [isLoading, setIsLoading] = useState(true);

  // Modals
  const [isAddOpen, setIsAddOpen] = useState(false);
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);
  const [isViewOpen, setIsViewOpen] = useState(false);
  const [selectedStudent, setSelectedStudent] = useState<Student | null>(null);

  // Form
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    studentId: '',
    prn: '',
    gender: 'Male',
    dob: '2004-01-01',
    department: 'Computer Science & IT',
    course: 'B.Sc. Computer Science',
    year: 'SY',
    semester: 3,
    division: 'A',
    admissionYear: 2023,
    address: 'Omerga, Dist. Dharashiv',
    parentName: '',
    parentPhone: '',
  });
  const [formError, setFormError] = useState<string | null>(null);

  const fetchStudents = async () => {
    setIsLoading(true);
    try {
      const res = await api.getStudents({
        page: String(page),
        search,
        department: deptFilter,
        course: courseFilter,
        year: yearFilter,
        limit: '12',
      });
      if (res.students) {
        setStudents(res.students);
        setTotal(res.total);
      }
    } catch (err) {
      console.error('Error fetching students:', err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchStudents();
  }, [page, deptFilter, courseFilter, yearFilter]);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    setPage(1);
    fetchStudents();
  };

  const handleCreateStudent = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormError(null);
    try {
      await api.createStudent(formData);
      setIsAddOpen(false);
      fetchStudents();
    } catch (err: any) {
      setFormError(err.message || 'Failed to enroll student.');
    }
  };

  const handleUpdateStudent = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedStudent) return;
    setFormError(null);
    try {
      await api.updateStudent(selectedStudent.id, formData);
      setIsEditOpen(false);
      setSelectedStudent(null);
      fetchStudents();
    } catch (err: any) {
      setFormError(err.message || 'Failed to update student.');
    }
  };

  const handleDeleteStudent = async () => {
    if (!selectedStudent) return;
    try {
      await api.deleteStudent(selectedStudent.id);
      setIsDeleteOpen(false);
      setSelectedStudent(null);
      fetchStudents();
    } catch (err: any) {
      alert(err.message || 'Failed to delete student.');
    }
  };

  return (
    <div className="space-y-6 p-4 sm:p-6 lg:p-8">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl sm:text-2xl font-extrabold text-slate-900 tracking-tight">
            Student Academic Registry
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 font-medium mt-0.5">
            Manage student enrollment, PRNs, department affiliations, and academic standing.
          </p>
        </div>

        <button
          onClick={() => {
            const randomSuffix = Math.floor(100 + Math.random() * 900);
            setFormData({
              name: '',
              email: '',
              phone: '',
              studentId: `STU-2025-${randomSuffix}`,
              prn: `202501540${randomSuffix}`,
              gender: 'Male',
              dob: '2005-06-15',
              department: 'Computer Science & IT',
              course: 'B.Sc. Computer Science',
              year: 'FY',
              semester: 1,
              division: 'A',
              admissionYear: 2025,
              address: 'Omerga, Dist. Dharashiv',
              parentName: '',
              parentPhone: '',
            });
            setFormError(null);
            setIsAddOpen(true);
          }}
          className="inline-flex items-center space-x-1.5 px-3.5 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-semibold text-xs transition-colors shadow-xs"
        >
          <Plus className="w-3.5 h-3.5" />
          <span>Enroll New Student</span>
        </button>
      </div>

      {/* Filter & Search Bar */}
      <div className="bg-white p-4 rounded-2xl border border-slate-200/80 shadow-xs flex flex-col md:flex-row items-center justify-between gap-4">
        <form onSubmit={handleSearch} className="relative w-full md:w-80">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search student name, PRN, ID..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-10 pr-4 py-2 rounded-xl border border-slate-200 text-xs text-slate-800 placeholder-slate-400 focus:outline-hidden focus:border-indigo-600 focus:ring-2 focus:ring-indigo-500/20"
          />
        </form>

        <div className="flex flex-wrap items-center gap-2 w-full md:w-auto">
          <select
            value={deptFilter}
            onChange={(e) => { setDeptFilter(e.target.value); setPage(1); }}
            className="px-3 py-2 rounded-xl border border-slate-200 text-xs font-semibold text-slate-700 bg-white"
          >
            <option value="ALL">All Departments</option>
            <option value="Computer Science & IT">Computer Science & IT</option>
            <option value="Commerce & Management">Commerce & Management</option>
            <option value="Science & Biotechnology">Science & Biotechnology</option>
            <option value="Humanities & Social Sciences">Humanities</option>
          </select>

          <select
            value={yearFilter}
            onChange={(e) => { setYearFilter(e.target.value); setPage(1); }}
            className="px-3 py-2 rounded-xl border border-slate-200 text-xs font-semibold text-slate-700 bg-white"
          >
            <option value="ALL">All Years</option>
            <option value="FY">First Year (FY)</option>
            <option value="SY">Second Year (SY)</option>
            <option value="TY">Third Year (TY)</option>
          </select>
        </div>
      </div>

      {/* Students Data Table */}
      <div className="bg-white rounded-2xl border border-slate-200/80 shadow-xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50 border-b border-slate-200 text-slate-500 uppercase tracking-wider font-semibold">
              <tr>
                <th className="px-5 py-3.5">Student ID & PRN</th>
                <th className="px-5 py-3.5">Full Name</th>
                <th className="px-5 py-3.5">Program & Year</th>
                <th className="px-5 py-3.5">Div / Sem</th>
                <th className="px-5 py-3.5">Contact</th>
                <th className="px-5 py-3.5">Status</th>
                <th className="px-5 py-3.5 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {isLoading ? (
                <tr>
                  <td colSpan={7} className="px-5 py-8 text-center text-slate-400">
                    Loading students from PostgreSQL database...
                  </td>
                </tr>
              ) : students.length === 0 ? (
                <tr>
                  <td colSpan={7} className="px-5 py-8 text-center text-slate-400">
                    No student records found matching filters.
                  </td>
                </tr>
              ) : (
                students.map((s) => (
                  <tr key={s.id} className="hover:bg-slate-50/70 transition-colors">
                    <td className="px-5 py-3.5">
                      <span className="font-mono font-bold text-indigo-700 block">{s.studentId}</span>
                      <span className="font-mono text-[11px] text-slate-400">PRN: {s.prn}</span>
                    </td>
                    <td className="px-5 py-3.5 font-semibold text-slate-900">
                      {s.name}
                    </td>
                    <td className="px-5 py-3.5 text-slate-600">
                      <span className="font-medium text-slate-800 block">{s.course}</span>
                      <span className="text-[11px] text-slate-400">{s.department}</span>
                    </td>
                    <td className="px-5 py-3.5">
                      <span className="font-semibold text-slate-700">{s.year} - Div {s.division}</span>
                      <span className="text-[10px] text-slate-400 block">Sem {s.semester}</span>
                    </td>
                    <td className="px-5 py-3.5 text-slate-600">
                      <span className="block truncate max-w-[150px]">{s.email}</span>
                      <span className="text-[11px] text-slate-400">{s.phone || '—'}</span>
                    </td>
                    <td className="px-5 py-3.5">
                      <span className="px-2 py-0.5 rounded text-[11px] font-semibold bg-emerald-50 text-emerald-700">
                        {s.status}
                      </span>
                    </td>
                    <td className="px-5 py-3.5 text-right space-x-2">
                      <button
                        onClick={() => { setSelectedStudent(s); setIsViewOpen(true); }}
                        className="p-1 text-slate-500 hover:text-indigo-600"
                        title="View profile"
                      >
                        <Eye className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => {
                          setSelectedStudent(s);
                          setFormData({
                            name: s.name,
                            email: s.email,
                            phone: s.phone || '',
                            studentId: s.studentId,
                            prn: s.prn,
                            gender: s.gender || 'Male',
                            dob: s.dob || '2004-01-01',
                            department: s.department,
                            course: s.course,
                            year: s.year,
                            semester: s.semester,
                            division: s.division,
                            admissionYear: s.admissionYear,
                            address: s.address || '',
                            parentName: s.parentName || '',
                            parentPhone: s.parentPhone || '',
                          });
                          setIsEditOpen(true);
                        }}
                        className="p-1 text-slate-500 hover:text-indigo-600"
                        title="Edit student"
                      >
                        <Edit className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => { setSelectedStudent(s); setIsDeleteOpen(true); }}
                        className="p-1 text-slate-500 hover:text-rose-600"
                        title="Delete student"
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
          <span>Total: <strong>{total}</strong> students enrolled</span>
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
              disabled={students.length < 12}
              className="p-1.5 rounded-lg border border-slate-200 disabled:opacity-40"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>

      {/* Enroll Student Modal */}
      <Modal isOpen={isAddOpen} onClose={() => setIsAddOpen(false)} title="Enroll Student to College" maxWidth="2xl">
        <form onSubmit={handleCreateStudent} className="space-y-4">
          {formError && <div className="p-3 rounded-xl bg-rose-50 text-rose-700 text-xs">{formError}</div>}
          <div className="grid grid-cols-2 gap-3">
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
            <div className="space-y-1">
              <label className="text-xs font-semibold text-slate-700">Email Address *</label>
              <input
                type="email"
                required
                value={formData.email}
                onChange={e => setFormData({ ...formData, email: e.target.value })}
                className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs"
              />
            </div>
          </div>
          <div className="grid grid-cols-3 gap-3">
            <div className="space-y-1">
              <label className="text-xs font-semibold text-slate-700">Student ID *</label>
              <input
                type="text"
                required
                value={formData.studentId}
                onChange={e => setFormData({ ...formData, studentId: e.target.value.toUpperCase() })}
                className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs font-mono"
              />
            </div>
            <div className="space-y-1">
              <label className="text-xs font-semibold text-slate-700">University PRN *</label>
              <input
                type="text"
                required
                value={formData.prn}
                onChange={e => setFormData({ ...formData, prn: e.target.value })}
                className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs font-mono"
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
              <label className="text-xs font-semibold text-slate-700">Department *</label>
              <select
                value={formData.department}
                onChange={e => setFormData({ ...formData, department: e.target.value })}
                className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs bg-white"
              >
                <option value="Computer Science & IT">Computer Science & IT</option>
                <option value="Commerce & Management">Commerce & Management</option>
                <option value="Science & Biotechnology">Science & Biotechnology</option>
                <option value="Humanities & Social Sciences">Humanities & Social Sciences</option>
              </select>
            </div>
            <div className="space-y-1">
              <label className="text-xs font-semibold text-slate-700">Course *</label>
              <select
                value={formData.course}
                onChange={e => setFormData({ ...formData, course: e.target.value })}
                className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs bg-white"
              >
                <option value="B.Sc. Computer Science">B.Sc. Computer Science</option>
                <option value="Bachelor of Computer Applications (BCA)">Bachelor of Computer Applications (BCA)</option>
                <option value="Bachelor of Commerce (B.Com)">Bachelor of Commerce (B.Com)</option>
                <option value="B.Sc. General Science (PCB / PCM)">B.Sc. General Science</option>
                <option value="Bachelor of Arts (B.A.)">Bachelor of Arts (B.A.)</option>
                <option value="M.Sc. Computer Science">M.Sc. Computer Science</option>
              </select>
            </div>
          </div>
          <div className="grid grid-cols-3 gap-3">
            <div className="space-y-1">
              <label className="text-xs font-semibold text-slate-700">Academic Year</label>
              <select
                value={formData.year}
                onChange={e => setFormData({ ...formData, year: e.target.value })}
                className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs bg-white"
              >
                <option value="FY">First Year (FY)</option>
                <option value="SY">Second Year (SY)</option>
                <option value="TY">Third Year (TY)</option>
              </select>
            </div>
            <div className="space-y-1">
              <label className="text-xs font-semibold text-slate-700">Semester</label>
              <input
                type="number"
                min={1}
                max={6}
                value={formData.semester}
                onChange={e => setFormData({ ...formData, semester: parseInt(e.target.value, 10) || 1 })}
                className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs"
              />
            </div>
            <div className="space-y-1">
              <label className="text-xs font-semibold text-slate-700">Division</label>
              <select
                value={formData.division}
                onChange={e => setFormData({ ...formData, division: e.target.value })}
                className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs bg-white"
              >
                <option value="A">Division A</option>
                <option value="B">Division B</option>
              </select>
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
              Enroll Student in PostgreSQL
            </button>
          </div>
        </form>
      </Modal>

      {/* Edit Student Modal */}
      <Modal isOpen={isEditOpen} onClose={() => setIsEditOpen(false)} title="Edit Student Profile" maxWidth="xl">
        <form onSubmit={handleUpdateStudent} className="space-y-4">
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
          <div className="grid grid-cols-3 gap-3">
            <div className="space-y-1">
              <label className="text-xs font-semibold text-slate-700">Year</label>
              <select
                value={formData.year}
                onChange={e => setFormData({ ...formData, year: e.target.value })}
                className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs bg-white"
              >
                <option value="FY">FY</option>
                <option value="SY">SY</option>
                <option value="TY">TY</option>
              </select>
            </div>
            <div className="space-y-1">
              <label className="text-xs font-semibold text-slate-700">Division</label>
              <input
                type="text"
                value={formData.division}
                onChange={e => setFormData({ ...formData, division: e.target.value.toUpperCase() })}
                className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs"
              />
            </div>
            <div className="space-y-1">
              <label className="text-xs font-semibold text-slate-700">Semester</label>
              <input
                type="number"
                value={formData.semester}
                onChange={e => setFormData({ ...formData, semester: parseInt(e.target.value, 10) || 1 })}
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
              Save Student Record
            </button>
          </div>
        </form>
      </Modal>

      {/* View Student Modal */}
      <Modal isOpen={isViewOpen} onClose={() => setIsViewOpen(false)} title="Student Academic Profile">
        {selectedStudent && (
          <div className="space-y-4 text-xs">
            <div className="flex items-center space-x-3 pb-3 border-b border-slate-100">
              <div className="w-12 h-12 rounded-full bg-indigo-100 text-indigo-700 font-bold flex items-center justify-center text-sm">
                {selectedStudent.name[0]}
              </div>
              <div>
                <h4 className="font-bold text-sm text-slate-900">{selectedStudent.name}</h4>
                <p className="font-mono text-indigo-600 font-semibold">{selectedStudent.studentId} • PRN: {selectedStudent.prn}</p>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-3 text-slate-600">
              <p><strong>Department:</strong> {selectedStudent.department}</p>
              <p><strong>Course:</strong> {selectedStudent.course}</p>
              <p><strong>Standing:</strong> {selectedStudent.year} - Div {selectedStudent.division} (Sem {selectedStudent.semester})</p>
              <p><strong>Admission Year:</strong> {selectedStudent.admissionYear}</p>
              <p><strong>Email:</strong> {selectedStudent.email}</p>
              <p><strong>Phone:</strong> {selectedStudent.phone || '—'}</p>
              <p><strong>Parent Contact:</strong> {selectedStudent.parentName || '—'} ({selectedStudent.parentPhone || '—'})</p>
              <p><strong>Address:</strong> {selectedStudent.address || '—'}</p>
            </div>
          </div>
        )}
      </Modal>

      {/* Delete Confirmation Modal */}
      <ConfirmModal
        isOpen={isDeleteOpen}
        title={`Delete Student ${selectedStudent?.name}?`}
        message={`Are you sure you want to permanently delete student "${selectedStudent?.name}" (${selectedStudent?.studentId})? All associated fee and attendance records will be removed.`}
        onConfirm={handleDeleteStudent}
        onCancel={() => setIsDeleteOpen(false)}
      />
    </div>
  );
};
