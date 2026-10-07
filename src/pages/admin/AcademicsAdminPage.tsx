import React, { useEffect, useState } from 'react';
import { Building, Layers, BookOpen, Calendar, Plus, Trash2, Edit } from 'lucide-react';
import { api } from '../../services/api.ts';
import { Department, Course, Subject, TimetableEntry } from '../../types/index.ts';
import { Modal } from '../../components/common/Modal.tsx';
import { ConfirmModal } from '../../components/common/ConfirmModal.tsx';

export const AcademicsAdminPage: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'departments' | 'courses' | 'subjects' | 'timetable'>('departments');

  // Lists
  const [departments, setDepartments] = useState<Department[]>([]);
  const [courses, setCourses] = useState<Course[]>([]);
  const [subjects, setSubjects] = useState<Subject[]>([]);
  const [timetable, setTimetable] = useState<TimetableEntry[]>([]);

  // Modals
  const [isAddOpen, setIsAddOpen] = useState(false);
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);
  const [itemToDelete, setItemToDelete] = useState<{ type: string; id: number; name: string } | null>(null);

  // Forms
  const [deptForm, setDeptForm] = useState({ code: '', name: '', hod: '', description: '' });
  const [courseForm, setCourseForm] = useState({ code: '', name: '', department: 'Computer Science & IT', duration: '3 Years', intake: 60, feePerYear: 20000 });
  const [subjectForm, setSubjectForm] = useState({ code: '', name: '', course: 'B.Sc. Computer Science', semester: 1, credits: 4, faculty: '' });
  const [timeForm, setTimeForm] = useState({ day: 'Monday', startTime: '09:00 AM', endTime: '10:00 AM', department: 'Computer Science & IT', course: 'B.Sc. Computer Science', year: 'SY', division: 'A', subject: '', faculty: '', room: 'Room 204' });

  const loadData = async () => {
    try {
      const [dRes, cRes, sRes, tRes] = await Promise.all([
        api.getDepartments(),
        api.getCourses(),
        api.getSubjects(),
        api.getTimetable(),
      ]);
      if (dRes.departments) setDepartments(dRes.departments);
      if (cRes.courses) setCourses(cRes.courses);
      if (sRes.subjects) setSubjects(sRes.subjects);
      if (tRes.timetable) setTimetable(tRes.timetable);
    } catch (err) {
      console.error('Error loading academic data:', err);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const handleAddSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (activeTab === 'departments') {
        await api.createDepartment(deptForm);
        setDeptForm({ code: '', name: '', hod: '', description: '' });
      } else if (activeTab === 'courses') {
        await api.createCourse(courseForm);
      } else if (activeTab === 'subjects') {
        await api.createSubject(subjectForm);
      } else if (activeTab === 'timetable') {
        await api.createTimetableEntry(timeForm);
      }
      setIsAddOpen(false);
      loadData();
    } catch (err: any) {
      alert(err.message || 'Operation failed');
    }
  };

  const handleDeleteConfirm = async () => {
    if (!itemToDelete) return;
    try {
      if (itemToDelete.type === 'departments') await api.deleteDepartment(itemToDelete.id);
      if (itemToDelete.type === 'courses') await api.deleteCourse(itemToDelete.id);
      if (itemToDelete.type === 'subjects') await api.deleteSubject(itemToDelete.id);
      if (itemToDelete.type === 'timetable') await api.deleteTimetableEntry(itemToDelete.id);
      setIsDeleteOpen(false);
      setItemToDelete(null);
      loadData();
    } catch (err: any) {
      alert(err.message || 'Failed to delete record.');
    }
  };

  return (
    <div className="space-y-6 p-4 sm:p-6 lg:p-8">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl sm:text-2xl font-extrabold text-slate-900 tracking-tight">
            Academic Operations & Curriculum
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 font-medium mt-0.5">
            Manage academic departments, degree programs, course syllabus, and lecture timetables.
          </p>
        </div>

        <button
          onClick={() => setIsAddOpen(true)}
          className="inline-flex items-center space-x-1.5 px-3.5 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-semibold text-xs transition-colors shadow-xs"
        >
          <Plus className="w-3.5 h-3.5" />
          <span>Add New {activeTab === 'departments' ? 'Department' : activeTab === 'courses' ? 'Course' : activeTab === 'subjects' ? 'Subject' : 'Timetable Slot'}</span>
        </button>
      </div>

      {/* Tabs */}
      <div className="flex items-center space-x-2 border-b border-slate-200">
        {[
          { key: 'departments', label: 'Departments', icon: Building, count: departments.length },
          { key: 'courses', label: 'Courses / Degrees', icon: Layers, count: courses.length },
          { key: 'subjects', label: 'Subjects & Credits', icon: BookOpen, count: subjects.length },
          { key: 'timetable', label: 'Weekly Timetable', icon: Calendar, count: timetable.length },
        ].map((t) => (
          <button
            key={t.key}
            onClick={() => setActiveTab(t.key as any)}
            className={`flex items-center space-x-2 px-4 py-3 border-b-2 text-xs font-bold transition-all ${
              activeTab === t.key
                ? 'border-indigo-600 text-indigo-600'
                : 'border-transparent text-slate-500 hover:text-slate-700'
            }`}
          >
            <t.icon className="w-4 h-4" />
            <span>{t.label}</span>
            <span className="px-1.5 py-0.5 rounded-full bg-slate-100 text-[10px] text-slate-600 font-mono">
              {t.count}
            </span>
          </button>
        ))}
      </div>

      {/* Tab Panels */}
      {activeTab === 'departments' && (
        <div className="bg-white rounded-2xl border border-slate-200/80 shadow-xs overflow-hidden">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50 border-b border-slate-200 text-slate-500 uppercase font-semibold">
              <tr>
                <th className="px-5 py-3.5">Code</th>
                <th className="px-5 py-3.5">Department Name</th>
                <th className="px-5 py-3.5">Head of Department (HOD)</th>
                <th className="px-5 py-3.5">Status</th>
                <th className="px-5 py-3.5 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {departments.map((d) => (
                <tr key={d.id} className="hover:bg-slate-50/70">
                  <td className="px-5 py-3.5 font-bold font-mono text-indigo-700">{d.code}</td>
                  <td className="px-5 py-3.5 font-semibold text-slate-900">{d.name}</td>
                  <td className="px-5 py-3.5 text-slate-700">{d.hod || '—'}</td>
                  <td className="px-5 py-3.5">
                    <span className="px-2 py-0.5 rounded bg-emerald-50 text-emerald-700 font-semibold text-[11px]">{d.status}</span>
                  </td>
                  <td className="px-5 py-3.5 text-right">
                    <button
                      onClick={() => { setItemToDelete({ type: 'departments', id: d.id, name: d.name }); setIsDeleteOpen(true); }}
                      className="p-1 text-slate-400 hover:text-rose-600"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {activeTab === 'courses' && (
        <div className="bg-white rounded-2xl border border-slate-200/80 shadow-xs overflow-hidden">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50 border-b border-slate-200 text-slate-500 uppercase font-semibold">
              <tr>
                <th className="px-5 py-3.5">Code</th>
                <th className="px-5 py-3.5">Course Name</th>
                <th className="px-5 py-3.5">Department</th>
                <th className="px-5 py-3.5">Duration</th>
                <th className="px-5 py-3.5">Intake</th>
                <th className="px-5 py-3.5">Annual Fee</th>
                <th className="px-5 py-3.5 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {courses.map((c) => (
                <tr key={c.id} className="hover:bg-slate-50/70">
                  <td className="px-5 py-3.5 font-bold font-mono text-indigo-700">{c.code}</td>
                  <td className="px-5 py-3.5 font-semibold text-slate-900">{c.name}</td>
                  <td className="px-5 py-3.5 text-slate-600">{c.department}</td>
                  <td className="px-5 py-3.5 text-slate-600">{c.duration}</td>
                  <td className="px-5 py-3.5 text-slate-800 font-semibold">{c.intake} seats</td>
                  <td className="px-5 py-3.5 text-slate-900 font-bold">₹{c.feePerYear.toLocaleString('en-IN')}</td>
                  <td className="px-5 py-3.5 text-right">
                    <button
                      onClick={() => { setItemToDelete({ type: 'courses', id: c.id, name: c.name }); setIsDeleteOpen(true); }}
                      className="p-1 text-slate-400 hover:text-rose-600"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {activeTab === 'subjects' && (
        <div className="bg-white rounded-2xl border border-slate-200/80 shadow-xs overflow-hidden">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50 border-b border-slate-200 text-slate-500 uppercase font-semibold">
              <tr>
                <th className="px-5 py-3.5">Subject Code</th>
                <th className="px-5 py-3.5">Subject Name</th>
                <th className="px-5 py-3.5">Course</th>
                <th className="px-5 py-3.5">Semester</th>
                <th className="px-5 py-3.5">Credits</th>
                <th className="px-5 py-3.5">Faculty In-charge</th>
                <th className="px-5 py-3.5 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {subjects.map((s) => (
                <tr key={s.id} className="hover:bg-slate-50/70">
                  <td className="px-5 py-3.5 font-bold font-mono text-indigo-700">{s.code}</td>
                  <td className="px-5 py-3.5 font-semibold text-slate-900">{s.name}</td>
                  <td className="px-5 py-3.5 text-slate-600">{s.course}</td>
                  <td className="px-5 py-3.5 text-slate-800">Sem {s.semester}</td>
                  <td className="px-5 py-3.5 font-bold text-indigo-600">{s.credits} Credits</td>
                  <td className="px-5 py-3.5 text-slate-700">{s.faculty || '—'}</td>
                  <td className="px-5 py-3.5 text-right">
                    <button
                      onClick={() => { setItemToDelete({ type: 'subjects', id: s.id, name: s.name }); setIsDeleteOpen(true); }}
                      className="p-1 text-slate-400 hover:text-rose-600"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {activeTab === 'timetable' && (
        <div className="bg-white rounded-2xl border border-slate-200/80 shadow-xs overflow-hidden">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50 border-b border-slate-200 text-slate-500 uppercase font-semibold">
              <tr>
                <th className="px-5 py-3.5">Day & Time</th>
                <th className="px-5 py-3.5">Course / Year / Div</th>
                <th className="px-5 py-3.5">Subject</th>
                <th className="px-5 py-3.5">Faculty</th>
                <th className="px-5 py-3.5">Room</th>
                <th className="px-5 py-3.5 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {timetable.map((t) => (
                <tr key={t.id} className="hover:bg-slate-50/70">
                  <td className="px-5 py-3.5">
                    <span className="font-bold text-slate-900 block">{t.day}</span>
                    <span className="text-[11px] text-slate-400">{t.startTime} - {t.endTime}</span>
                  </td>
                  <td className="px-5 py-3.5 text-slate-700">
                    <span>{t.course}</span>
                    <span className="text-[11px] text-slate-400 block">{t.year} Div {t.division}</span>
                  </td>
                  <td className="px-5 py-3.5 font-medium text-slate-900">{t.subject}</td>
                  <td className="px-5 py-3.5 text-slate-700">{t.faculty}</td>
                  <td className="px-5 py-3.5 text-slate-600">{t.room}</td>
                  <td className="px-5 py-3.5 text-right">
                    <button
                      onClick={() => { setItemToDelete({ type: 'timetable', id: t.id, name: `${t.day} ${t.subject}` }); setIsDeleteOpen(true); }}
                      className="p-1 text-slate-400 hover:text-rose-600"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Dynamic Add Modal */}
      <Modal isOpen={isAddOpen} onClose={() => setIsAddOpen(false)} title={`Add ${activeTab.slice(0, -1)}`}>
        <form onSubmit={handleAddSubmit} className="space-y-4">
          {activeTab === 'departments' && (
            <>
              <div className="space-y-1">
                <label className="text-xs font-semibold">Department Code *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. CS, COMM, SCI"
                  value={deptForm.code}
                  onChange={e => setDeptForm({ ...deptForm, code: e.target.value.toUpperCase() })}
                  className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs font-mono uppercase"
                />
              </div>
              <div className="space-y-1">
                <label className="text-xs font-semibold">Department Name *</label>
                <input
                  type="text"
                  required
                  value={deptForm.name}
                  onChange={e => setDeptForm({ ...deptForm, name: e.target.value })}
                  className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs"
                />
              </div>
              <div className="space-y-1">
                <label className="text-xs font-semibold">Head of Department (HOD)</label>
                <input
                  type="text"
                  value={deptForm.hod}
                  onChange={e => setDeptForm({ ...deptForm, hod: e.target.value })}
                  className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs"
                />
              </div>
              <div className="space-y-1">
                <label className="text-xs font-semibold">Description</label>
                <textarea
                  rows={2}
                  value={deptForm.description}
                  onChange={e => setDeptForm({ ...deptForm, description: e.target.value })}
                  className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs"
                />
              </div>
            </>
          )}

          {activeTab === 'courses' && (
            <>
              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="text-xs font-semibold">Course Code *</label>
                  <input
                    type="text"
                    required
                    value={courseForm.code}
                    onChange={e => setCourseForm({ ...courseForm, code: e.target.value.toUpperCase() })}
                    className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs font-mono uppercase"
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-xs font-semibold">Course Name *</label>
                  <input
                    type="text"
                    required
                    value={courseForm.name}
                    onChange={e => setCourseForm({ ...courseForm, name: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs"
                  />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="text-xs font-semibold">Intake</label>
                  <input
                    type="number"
                    value={courseForm.intake}
                    onChange={e => setCourseForm({ ...courseForm, intake: parseInt(e.target.value, 10) || 60 })}
                    className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs"
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-xs font-semibold">Annual Fee (₹)</label>
                  <input
                    type="number"
                    value={courseForm.feePerYear}
                    onChange={e => setCourseForm({ ...courseForm, feePerYear: parseInt(e.target.value, 10) || 15000 })}
                    className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs"
                  />
                </div>
              </div>
            </>
          )}

          {activeTab === 'subjects' && (
            <>
              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="text-xs font-semibold">Subject Code *</label>
                  <input
                    type="text"
                    required
                    value={subjectForm.code}
                    onChange={e => setSubjectForm({ ...subjectForm, code: e.target.value.toUpperCase() })}
                    className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs font-mono"
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-xs font-semibold">Subject Name *</label>
                  <input
                    type="text"
                    required
                    value={subjectForm.name}
                    onChange={e => setSubjectForm({ ...subjectForm, name: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs"
                  />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="text-xs font-semibold">Credits</label>
                  <input
                    type="number"
                    value={subjectForm.credits}
                    onChange={e => setSubjectForm({ ...subjectForm, credits: parseInt(e.target.value, 10) || 4 })}
                    className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs"
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-xs font-semibold">Semester</label>
                  <input
                    type="number"
                    value={subjectForm.semester}
                    onChange={e => setSubjectForm({ ...subjectForm, semester: parseInt(e.target.value, 10) || 1 })}
                    className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs"
                  />
                </div>
              </div>
            </>
          )}

          {activeTab === 'timetable' && (
            <>
              <div className="grid grid-cols-3 gap-3">
                <div className="space-y-1">
                  <label className="text-xs font-semibold">Day</label>
                  <select
                    value={timeForm.day}
                    onChange={e => setTimeForm({ ...timeForm, day: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs bg-white"
                  >
                    <option value="Monday">Monday</option>
                    <option value="Tuesday">Tuesday</option>
                    <option value="Wednesday">Wednesday</option>
                    <option value="Thursday">Thursday</option>
                    <option value="Friday">Friday</option>
                    <option value="Saturday">Saturday</option>
                  </select>
                </div>
                <div className="space-y-1">
                  <label className="text-xs font-semibold">Start Time</label>
                  <input
                    type="text"
                    value={timeForm.startTime}
                    onChange={e => setTimeForm({ ...timeForm, startTime: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs"
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-xs font-semibold">End Time</label>
                  <input
                    type="text"
                    value={timeForm.endTime}
                    onChange={e => setTimeForm({ ...timeForm, endTime: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs"
                  />
                </div>
              </div>
              <div className="space-y-1">
                <label className="text-xs font-semibold">Subject *</label>
                <input
                  type="text"
                  required
                  value={timeForm.subject}
                  onChange={e => setTimeForm({ ...timeForm, subject: e.target.value })}
                  className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs"
                />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="text-xs font-semibold">Faculty</label>
                  <input
                    type="text"
                    value={timeForm.faculty}
                    onChange={e => setTimeForm({ ...timeForm, faculty: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs"
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-xs font-semibold">Room</label>
                  <input
                    type="text"
                    value={timeForm.room}
                    onChange={e => setTimeForm({ ...timeForm, room: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs"
                  />
                </div>
              </div>
            </>
          )}

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
              Save Record
            </button>
          </div>
        </form>
      </Modal>

      <ConfirmModal
        isOpen={isDeleteOpen}
        title={`Delete ${itemToDelete?.name}?`}
        message="Are you sure you want to permanently delete this academic record from PostgreSQL?"
        onConfirm={handleDeleteConfirm}
        onCancel={() => setIsDeleteOpen(false)}
      />
    </div>
  );
};
