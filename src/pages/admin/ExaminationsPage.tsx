import React, { useEffect, useState } from 'react';
import { FileText, Plus, Trash2, Calendar, Clock, MapPin, AlertCircle } from 'lucide-react';
import { api } from '../../services/api.ts';
import { Examination } from '../../types/index.ts';
import { Modal } from '../../components/common/Modal.tsx';
import { ConfirmModal } from '../../components/common/ConfirmModal.tsx';

export const ExaminationsPage: React.FC = () => {
  const [exams, setExams] = useState<Examination[]>([]);
  const [isAddOpen, setIsAddOpen] = useState(false);
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);
  const [selectedExam, setSelectedExam] = useState<Examination | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const [formData, setFormData] = useState({
    name: 'Winter 2024 End Semester University Exam',
    course: 'B.Sc. Computer Science',
    semester: 3,
    subject: 'Data Structures & Algorithms',
    date: '2024-11-25',
    startTime: '10:00 AM',
    endTime: '01:00 PM',
    room: 'Hall A',
    instructions: 'Standard university exam hall guidelines apply. Hall ticket mandatory.',
  });

  const fetchExams = async () => {
    setIsLoading(true);
    try {
      const res = await api.getExaminations();
      if (res.examinations) setExams(res.examinations);
    } catch (err) {
      console.error('Error fetching exams:', err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchExams();
  }, []);

  const handleCreateExam = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await api.createExamination(formData);
      setIsAddOpen(false);
      fetchExams();
    } catch (err: any) {
      alert(err.message || 'Failed to schedule examination.');
    }
  };

  const handleDeleteExam = async () => {
    if (!selectedExam) return;
    try {
      await api.deleteExamination(selectedExam.id);
      setIsDeleteOpen(false);
      setSelectedExam(null);
      fetchExams();
    } catch (err: any) {
      alert(err.message || 'Failed to delete exam.');
    }
  };

  return (
    <div className="space-y-6 p-4 sm:p-6 lg:p-8">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl sm:text-2xl font-extrabold text-slate-900 tracking-tight">
            Examinations & Assessment Schedules
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 font-medium mt-0.5">
            Schedule university end-semester and internal mid-term examinations.
          </p>
        </div>

        <button
          onClick={() => setIsAddOpen(true)}
          className="inline-flex items-center space-x-1.5 px-3.5 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-semibold text-xs transition-colors shadow-xs"
        >
          <Plus className="w-3.5 h-3.5" />
          <span>Schedule New Exam</span>
        </button>
      </div>

      {/* Exams Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {isLoading ? (
          <div className="col-span-full py-12 text-center text-slate-400 text-xs">Loading examinations...</div>
        ) : exams.length === 0 ? (
          <div className="col-span-full py-12 text-center text-slate-400 text-xs bg-white rounded-2xl border">
            No examinations scheduled.
          </div>
        ) : (
          exams.map((ex) => (
            <div
              key={ex.id}
              className="bg-white rounded-2xl border border-slate-200 p-6 flex flex-col justify-between shadow-xs space-y-4"
            >
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-[11px] font-bold px-2 py-0.5 rounded-md bg-indigo-50 text-indigo-700">
                    Semester {ex.semester}
                  </span>
                  <button
                    onClick={() => { setSelectedExam(ex); setIsDeleteOpen(true); }}
                    className="p-1 text-slate-400 hover:text-rose-600"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>

                <h3 className="font-bold text-base text-slate-900">{ex.name}</h3>
                <p className="text-xs font-semibold text-indigo-600">{ex.subject}</p>
                <p className="text-xs text-slate-500">{ex.course}</p>

                <div className="pt-2 border-t border-slate-100 space-y-1.5 text-xs text-slate-600">
                  <div className="flex items-center space-x-2">
                    <Calendar className="w-3.5 h-3.5 text-slate-400" />
                    <span>{ex.date}</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Clock className="w-3.5 h-3.5 text-slate-400" />
                    <span>{ex.startTime} - {ex.endTime}</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <MapPin className="w-3.5 h-3.5 text-slate-400" />
                    <span>{ex.room}</span>
                  </div>
                </div>

                {ex.instructions && (
                  <p className="text-[11px] text-slate-500 pt-1 line-clamp-2">{ex.instructions}</p>
                )}
              </div>
            </div>
          ))
        )}
      </div>

      {/* Add Exam Modal */}
      <Modal isOpen={isAddOpen} onClose={() => setIsAddOpen(false)} title="Schedule Examination" maxWidth="xl">
        <form onSubmit={handleCreateExam} className="space-y-4">
          <div className="space-y-1">
            <label className="text-xs font-semibold text-slate-700">Exam Title *</label>
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
              <label className="text-xs font-semibold text-slate-700">Course *</label>
              <input
                type="text"
                required
                value={formData.course}
                onChange={e => setFormData({ ...formData, course: e.target.value })}
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
          </div>
          <div className="grid grid-cols-3 gap-3">
            <div className="space-y-1">
              <label className="text-xs font-semibold text-slate-700">Date *</label>
              <input
                type="date"
                required
                value={formData.date}
                onChange={e => setFormData({ ...formData, date: e.target.value })}
                className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs"
              />
            </div>
            <div className="space-y-1">
              <label className="text-xs font-semibold text-slate-700">Start Time</label>
              <input
                type="text"
                value={formData.startTime}
                onChange={e => setFormData({ ...formData, startTime: e.target.value })}
                className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs"
              />
            </div>
            <div className="space-y-1">
              <label className="text-xs font-semibold text-slate-700">End Time</label>
              <input
                type="text"
                value={formData.endTime}
                onChange={e => setFormData({ ...formData, endTime: e.target.value })}
                className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs"
              />
            </div>
          </div>
          <div className="space-y-1">
            <label className="text-xs font-semibold text-slate-700">Room / Hall</label>
            <input
              type="text"
              value={formData.room}
              onChange={e => setFormData({ ...formData, room: e.target.value })}
              className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs"
            />
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
              Save Schedule
            </button>
          </div>
        </form>
      </Modal>

      <ConfirmModal
        isOpen={isDeleteOpen}
        title="Delete Examination Schedule?"
        message={`Are you sure you want to cancel and delete the exam schedule "${selectedExam?.name}"?`}
        onConfirm={handleDeleteExam}
        onCancel={() => setIsDeleteOpen(false)}
      />
    </div>
  );
};
