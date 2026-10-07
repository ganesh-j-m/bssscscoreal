import React, { useEffect, useState } from 'react';
import { Award, Plus, Trash2, Search, Filter } from 'lucide-react';
import { api } from '../../services/api.ts';
import { ResultRecord } from '../../types/index.ts';
import { Modal } from '../../components/common/Modal.tsx';
import { ConfirmModal } from '../../components/common/ConfirmModal.tsx';

export const ResultsPage: React.FC = () => {
  const [results, setResults] = useState<ResultRecord[]>([]);
  const [search, setSearch] = useState('');
  const [isAddOpen, setIsAddOpen] = useState(false);
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);
  const [selectedResult, setSelectedResult] = useState<ResultRecord | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const [formData, setFormData] = useState({
    studentLoginId: 'STU001',
    studentName: 'Aditya Narayan More',
    exam: 'Semester II Final University Examination',
    subject: 'Data Structures & Algorithms',
    marksObtained: 85,
    totalMarks: 100,
    semester: 3,
    academicYear: '2024-2025',
  });

  const fetchResults = async () => {
    setIsLoading(true);
    try {
      const res = await api.getResults({ studentLoginId: search });
      if (res.results) setResults(res.results);
    } catch (err) {
      console.error('Error fetching results:', err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchResults();
  }, []);

  const handleCreateResult = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await api.createResult(formData);
      setIsAddOpen(false);
      fetchResults();
    } catch (err: any) {
      alert(err.message || 'Failed to record student result.');
    }
  };

  const handleDeleteResult = async () => {
    if (!selectedResult) return;
    try {
      const res = await fetch(`/api/results/${selectedResult.id}`, {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${localStorage.getItem('scsco_token') || ''}` },
      });
      if (!res.ok) throw new Error('Failed to delete result');
      setIsDeleteOpen(false);
      setSelectedResult(null);
      fetchResults();
    } catch (err: any) {
      alert(err.message || 'Failed to delete result.');
    }
  };

  return (
    <div className="space-y-6 p-4 sm:p-6 lg:p-8">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl sm:text-2xl font-extrabold text-slate-900 tracking-tight">
            Academic Grades & Examination Results
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 font-medium mt-0.5">
            Manage subject marks, automated letter grading (A+, A, B+, B, C, F), and student grade sheets.
          </p>
        </div>

        <button
          onClick={() => setIsAddOpen(true)}
          className="inline-flex items-center space-x-1.5 px-3.5 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-semibold text-xs transition-colors shadow-xs"
        >
          <Plus className="w-3.5 h-3.5" />
          <span>Record Marks & Result</span>
        </button>
      </div>

      {/* Table */}
      <div className="bg-white rounded-2xl border border-slate-200/80 shadow-xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50 border-b border-slate-200 text-slate-500 uppercase tracking-wider font-semibold">
              <tr>
                <th className="px-5 py-3.5">Student ID & Name</th>
                <th className="px-5 py-3.5">Exam</th>
                <th className="px-5 py-3.5">Subject</th>
                <th className="px-5 py-3.5">Marks Obtained</th>
                <th className="px-5 py-3.5">Grade</th>
                <th className="px-5 py-3.5">Result</th>
                <th className="px-5 py-3.5 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {isLoading ? (
                <tr>
                  <td colSpan={7} className="px-5 py-8 text-center text-slate-400">Loading student results...</td>
                </tr>
              ) : results.length === 0 ? (
                <tr>
                  <td colSpan={7} className="px-5 py-8 text-center text-slate-400">No results recorded.</td>
                </tr>
              ) : (
                results.map((r) => (
                  <tr key={r.id} className="hover:bg-slate-50/70 transition-colors">
                    <td className="px-5 py-3.5">
                      <span className="font-mono font-bold text-indigo-700 block">{r.studentLoginId}</span>
                      <span className="font-semibold text-slate-900">{r.studentName}</span>
                    </td>
                    <td className="px-5 py-3.5 text-slate-600">{r.exam}</td>
                    <td className="px-5 py-3.5 font-medium text-slate-900">{r.subject}</td>
                    <td className="px-5 py-3.5 font-bold text-slate-900">
                      {r.marksObtained} / {r.totalMarks}
                    </td>
                    <td className="px-5 py-3.5">
                      <span className="px-2 py-0.5 rounded font-bold text-[11px] bg-indigo-50 text-indigo-700">
                        {r.grade}
                      </span>
                    </td>
                    <td className="px-5 py-3.5">
                      <span className={`px-2 py-0.5 rounded font-semibold text-[11px] ${
                        r.resultStatus === 'PASS' ? 'bg-emerald-50 text-emerald-700' : 'bg-rose-50 text-rose-700'
                      }`}>
                        {r.resultStatus}
                      </span>
                    </td>
                    <td className="px-5 py-3.5 text-right">
                      <button
                        onClick={() => { setSelectedResult(r); setIsDeleteOpen(true); }}
                        className="p-1 text-slate-400 hover:text-rose-600"
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
      </div>

      {/* Add Result Modal */}
      <Modal isOpen={isAddOpen} onClose={() => setIsAddOpen(false)} title="Record Student Examination Marks">
        <form onSubmit={handleCreateResult} className="space-y-4">
          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1">
              <label className="text-xs font-semibold text-slate-700">Student Login ID *</label>
              <input
                type="text"
                required
                value={formData.studentLoginId}
                onChange={e => setFormData({ ...formData, studentLoginId: e.target.value.toUpperCase() })}
                className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs font-mono uppercase"
              />
            </div>
            <div className="space-y-1">
              <label className="text-xs font-semibold text-slate-700">Student Name</label>
              <input
                type="text"
                value={formData.studentName}
                onChange={e => setFormData({ ...formData, studentName: e.target.value })}
                className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs"
              />
            </div>
          </div>
          <div className="space-y-1">
            <label className="text-xs font-semibold text-slate-700">Examination Name *</label>
            <input
              type="text"
              required
              value={formData.exam}
              onChange={e => setFormData({ ...formData, exam: e.target.value })}
              className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs"
            />
          </div>
          <div className="space-y-1">
            <label className="text-xs font-semibold text-slate-700">Subject *</label>
            <input
              type="text"
              required
              value={formData.subject}
              onChange={e => setFormData({ ...formData, subject: e.target.value })}
              className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs"
            />
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1">
              <label className="text-xs font-semibold text-slate-700">Marks Obtained *</label>
              <input
                type="number"
                required
                min={0}
                max={formData.totalMarks}
                value={formData.marksObtained}
                onChange={e => setFormData({ ...formData, marksObtained: parseInt(e.target.value, 10) || 0 })}
                className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs"
              />
            </div>
            <div className="space-y-1">
              <label className="text-xs font-semibold text-slate-700">Total Marks</label>
              <input
                type="number"
                value={formData.totalMarks}
                onChange={e => setFormData({ ...formData, totalMarks: parseInt(e.target.value, 10) || 100 })}
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
              Save Result
            </button>
          </div>
        </form>
      </Modal>

      <ConfirmModal
        isOpen={isDeleteOpen}
        title="Delete Result Record?"
        message="Are you sure you want to permanently delete this student grade record?"
        onConfirm={handleDeleteResult}
        onCancel={() => setIsDeleteOpen(false)}
      />
    </div>
  );
};
