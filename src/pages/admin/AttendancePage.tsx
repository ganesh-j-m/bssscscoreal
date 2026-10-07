import React, { useEffect, useState } from 'react';
import { CheckCircle2, Search, Filter, Plus, Calendar, Clock, UserCheck } from 'lucide-react';
import { api } from '../../services/api.ts';
import { AttendanceRecord } from '../../types/index.ts';
import { Modal } from '../../components/common/Modal.tsx';

export const AttendancePage: React.FC = () => {
  const [records, setRecords] = useState<AttendanceRecord[]>([]);
  const [search, setSearch] = useState('');
  const [dateFilter, setDateFilter] = useState('');
  const [subjectFilter, setSubjectFilter] = useState('ALL');
  const [isLoading, setIsLoading] = useState(true);

  // Manual Attendance modal
  const [isManualOpen, setIsManualOpen] = useState(false);
  const [manualForm, setManualForm] = useState({
    studentLoginId: '',
    studentName: '',
    subject: 'Data Structures & Algorithms',
    date: new Date().toISOString().split('T')[0],
    status: 'Present',
    course: 'B.Sc. Computer Science',
    year: 'SY',
    division: 'A',
  });
  const [manualError, setManualError] = useState<string | null>(null);

  const fetchRecords = async () => {
    setIsLoading(true);
    try {
      const res = await api.getAttendanceRecords({
        date: dateFilter,
        subject: subjectFilter,
        studentLoginId: search,
      });
      if (res.attendances) {
        setRecords(res.attendances);
      }
    } catch (err) {
      console.error('Error fetching attendance records:', err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchRecords();
  }, [dateFilter, subjectFilter]);

  const handleManualSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setManualError(null);
    try {
      await api.getAttendanceRecords(); // Just verify endpoint connection
      // Submit to manual attendance endpoint
      const res = await fetch('/api/attendance/manual', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${localStorage.getItem('scsco_token') || ''}`,
        },
        body: JSON.stringify(manualForm),
      });
      if (!res.ok) {
        const err = await res.json();
        throw new Error(err.error || 'Failed to record manual attendance');
      }
      setIsManualOpen(false);
      fetchRecords();
    } catch (err: any) {
      setManualError(err.message);
    }
  };

  return (
    <div className="space-y-6 p-4 sm:p-6 lg:p-8">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl sm:text-2xl font-extrabold text-slate-900 tracking-tight">
            Attendance Register
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 font-medium mt-0.5">
            Institutional lecture attendance log collected through QR sessions and manual faculty overrides.
          </p>
        </div>

        <button
          onClick={() => {
            setManualForm({
              studentLoginId: '',
              studentName: '',
              subject: 'Data Structures & Algorithms',
              date: new Date().toISOString().split('T')[0],
              status: 'Present',
              course: 'B.Sc. Computer Science',
              year: 'SY',
              division: 'A',
            });
            setIsManualOpen(true);
          }}
          className="inline-flex items-center space-x-1.5 px-3.5 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-semibold text-xs transition-colors shadow-xs"
        >
          <Plus className="w-3.5 h-3.5" />
          <span>Manual Attendance Entry</span>
        </button>
      </div>

      {/* Filter Bar */}
      <div className="bg-white p-4 rounded-2xl border border-slate-200/80 shadow-xs flex flex-wrap items-center justify-between gap-4">
        <div className="flex items-center space-x-3 w-full md:w-auto">
          <input
            type="date"
            value={dateFilter}
            onChange={(e) => setDateFilter(e.target.value)}
            className="px-3 py-2 rounded-xl border border-slate-200 text-xs font-semibold text-slate-700 bg-white"
          />
          {dateFilter && (
            <button
              onClick={() => setDateFilter('')}
              className="text-xs text-indigo-600 font-semibold hover:underline"
            >
              Clear Date
            </button>
          )}
        </div>

        <div className="flex items-center space-x-3 w-full md:w-auto">
          <input
            type="text"
            placeholder="Filter by Student ID (e.g. STU001)..."
            value={search}
            onChange={e => setSearch(e.target.value)}
            onKeyDown={e => { if (e.key === 'Enter') fetchRecords(); }}
            className="px-3.5 py-2 rounded-xl border border-slate-200 text-xs text-slate-800"
          />
          <button
            onClick={fetchRecords}
            className="px-3.5 py-2 rounded-xl bg-slate-900 text-white font-semibold text-xs"
          >
            Filter
          </button>
        </div>
      </div>

      {/* Table */}
      <div className="bg-white rounded-2xl border border-slate-200/80 shadow-xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50 border-b border-slate-200 text-slate-500 uppercase tracking-wider font-semibold">
              <tr>
                <th className="px-5 py-3.5">Student ID & Name</th>
                <th className="px-5 py-3.5">Subject</th>
                <th className="px-5 py-3.5">Course / Year</th>
                <th className="px-5 py-3.5">Faculty In-charge</th>
                <th className="px-5 py-3.5">Date & Time</th>
                <th className="px-5 py-3.5">Status</th>
                <th className="px-5 py-3.5">Session Type</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {isLoading ? (
                <tr>
                  <td colSpan={7} className="px-5 py-8 text-center text-slate-400">
                    Loading attendance records...
                  </td>
                </tr>
              ) : records.length === 0 ? (
                <tr>
                  <td colSpan={7} className="px-5 py-8 text-center text-slate-400">
                    No attendance records found matching filters.
                  </td>
                </tr>
              ) : (
                records.map((r) => (
                  <tr key={r.id} className="hover:bg-slate-50/70 transition-colors">
                    <td className="px-5 py-3.5">
                      <span className="font-mono font-bold text-indigo-700 block">{r.studentLoginId}</span>
                      <span className="font-semibold text-slate-800">{r.studentName}</span>
                    </td>
                    <td className="px-5 py-3.5 font-medium text-slate-900">
                      {r.subject}
                    </td>
                    <td className="px-5 py-3.5 text-slate-600">
                      <span>{r.course}</span>
                      <span className="text-[11px] text-slate-400 block">{r.year} - Div {r.division}</span>
                    </td>
                    <td className="px-5 py-3.5 text-slate-600">
                      {r.faculty}
                    </td>
                    <td className="px-5 py-3.5 text-slate-600">
                      <span>{r.date}</span>
                      <span className="text-[11px] text-slate-400 block">{r.time}</span>
                    </td>
                    <td className="px-5 py-3.5">
                      <span className={`px-2 py-0.5 rounded text-[11px] font-semibold ${
                        r.status === 'Present' ? 'bg-emerald-50 text-emerald-700' : 'bg-rose-50 text-rose-700'
                      }`}>
                        {r.status}
                      </span>
                    </td>
                    <td className="px-5 py-3.5 text-slate-400 font-mono text-[11px]">
                      {r.sessionId ? 'Smart QR' : 'Manual Entry'}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Manual Entry Modal */}
      <Modal isOpen={isManualOpen} onClose={() => setIsManualOpen(false)} title="Record Manual Attendance">
        <form onSubmit={handleManualSubmit} className="space-y-4">
          {manualError && <div className="p-3 rounded-xl bg-rose-50 text-rose-700 text-xs">{manualError}</div>}
          <div className="space-y-1">
            <label className="text-xs font-semibold text-slate-700">Student Login ID *</label>
            <input
              type="text"
              required
              value={manualForm.studentLoginId}
              onChange={e => setManualForm({ ...manualForm, studentLoginId: e.target.value.toUpperCase() })}
              placeholder="e.g. STU001 or STU-2024-001"
              className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs font-mono uppercase"
            />
          </div>
          <div className="space-y-1">
            <label className="text-xs font-semibold text-slate-700">Student Name</label>
            <input
              type="text"
              value={manualForm.studentName}
              onChange={e => setManualForm({ ...manualForm, studentName: e.target.value })}
              placeholder="Full name"
              className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs"
            />
          </div>
          <div className="space-y-1">
            <label className="text-xs font-semibold text-slate-700">Subject *</label>
            <input
              type="text"
              required
              value={manualForm.subject}
              onChange={e => setManualForm({ ...manualForm, subject: e.target.value })}
              className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs"
            />
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1">
              <label className="text-xs font-semibold text-slate-700">Date *</label>
              <input
                type="date"
                required
                value={manualForm.date}
                onChange={e => setManualForm({ ...manualForm, date: e.target.value })}
                className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs"
              />
            </div>
            <div className="space-y-1">
              <label className="text-xs font-semibold text-slate-700">Status</label>
              <select
                value={manualForm.status}
                onChange={e => setManualForm({ ...manualForm, status: e.target.value })}
                className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs bg-white"
              >
                <option value="Present">Present</option>
                <option value="Late">Late</option>
                <option value="Absent">Absent</option>
              </select>
            </div>
          </div>
          <div className="pt-3 flex justify-end gap-2">
            <button
              type="button"
              onClick={() => setIsManualOpen(false)}
              className="px-4 py-2 rounded-xl bg-slate-100 text-slate-700 text-xs font-semibold"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 rounded-xl bg-indigo-600 text-white text-xs font-semibold"
            >
              Save in Database
            </button>
          </div>
        </form>
      </Modal>
    </div>
  );
};
