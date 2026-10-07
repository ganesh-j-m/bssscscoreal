import React, { useEffect, useState } from 'react';
import { AlertCircle, Plus, CheckCircle, Clock } from 'lucide-react';
import { useAuth } from '../../context/AuthContext.tsx';
import { api } from '../../services/api.ts';
import { GrievanceRecord } from '../../types/index.ts';
import { Modal } from '../../components/common/Modal.tsx';

export const StudentGrievancesPage: React.FC = () => {
  const [grievances, setGrievances] = useState<GrievanceRecord[]>([]);
  const [isSubmitOpen, setIsSubmitOpen] = useState(false);
  const [category, setCategory] = useState('Academic');
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [isLoading, setIsLoading] = useState(true);

  const fetchGrievances = async () => {
    setIsLoading(true);
    try {
      const res = await api.getGrievances();
      if (res.grievances) setGrievances(res.grievances);
    } catch (err) {
      console.error('Error fetching grievances:', err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchGrievances();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await api.submitGrievance({ category, title, description });
      setIsSubmitOpen(false);
      setTitle('');
      setDescription('');
      fetchGrievances();
    } catch (err: any) {
      alert(err.message || 'Failed to submit grievance');
    }
  };

  return (
    <div className="space-y-6 p-4 sm:p-6 lg:p-8">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl sm:text-2xl font-extrabold text-slate-900 tracking-tight">
            Student Grievance Redressal Desk
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 font-medium mt-0.5">
            Submit confidential concerns or issues regarding academics, labs, library, or campus amenities.
          </p>
        </div>

        <button
          onClick={() => setIsSubmitOpen(true)}
          className="inline-flex items-center space-x-1.5 px-3.5 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-semibold text-xs transition-colors shadow-xs"
        >
          <Plus className="w-3.5 h-3.5" />
          <span>Submit Grievance</span>
        </button>
      </div>

      <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-xs">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50 border-b border-slate-200 text-slate-500 uppercase font-semibold">
              <tr>
                <th className="px-5 py-3.5">Category</th>
                <th className="px-5 py-3.5">Grievance Subject</th>
                <th className="px-5 py-3.5">Status</th>
                <th className="px-5 py-3.5">Official Administrative Reply</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {isLoading ? (
                <tr><td colSpan={4} className="px-5 py-8 text-center text-slate-400">Loading grievances...</td></tr>
              ) : grievances.length === 0 ? (
                <tr><td colSpan={4} className="px-5 py-8 text-center text-slate-400">No grievances filed.</td></tr>
              ) : (
                grievances.map((g) => (
                  <tr key={g.id} className="hover:bg-slate-50/70">
                    <td className="px-5 py-3.5 font-semibold text-slate-700">{g.category}</td>
                    <td className="px-5 py-3.5 text-slate-800 max-w-sm">
                      <strong className="block text-slate-900">{g.title}</strong>
                      <span className="text-[11px] text-slate-500">{g.description}</span>
                    </td>
                    <td className="px-5 py-3.5">
                      <span className={`px-2 py-0.5 rounded text-[11px] font-semibold ${
                        g.status === 'RESOLVED' ? 'bg-emerald-50 text-emerald-700' : 'bg-amber-50 text-amber-700'
                      }`}>
                        {g.status}
                      </span>
                    </td>
                    <td className="px-5 py-3.5 text-slate-600 max-w-xs">
                      {g.adminResponse || <span className="text-slate-400 italic">Under review by committee</span>}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      <Modal isOpen={isSubmitOpen} onClose={() => setIsSubmitOpen(false)} title="File Student Grievance">
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-1">
            <label className="text-xs font-semibold text-slate-700">Category *</label>
            <select
              value={category}
              onChange={e => setCategory(e.target.value)}
              className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs bg-white"
            >
              <option value="Academic">Academic / Syllabus</option>
              <option value="Facility">Lab & Campus Facility</option>
              <option value="Library">Library & Wi-Fi</option>
              <option value="Examination">Examination & Evaluation</option>
              <option value="Other">Other Query</option>
            </select>
          </div>
          <div className="space-y-1">
            <label className="text-xs font-semibold text-slate-700">Grievance Subject *</label>
            <input
              type="text"
              required
              value={title}
              onChange={e => setTitle(e.target.value)}
              placeholder="Brief summary of concern"
              className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs"
            />
          </div>
          <div className="space-y-1">
            <label className="text-xs font-semibold text-slate-700">Detailed Description *</label>
            <textarea
              rows={4}
              required
              value={description}
              onChange={e => setDescription(e.target.value)}
              placeholder="Please provide full details so the committee can take swift action..."
              className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs"
            />
          </div>
          <div className="pt-3 flex justify-end gap-2">
            <button
              type="button"
              onClick={() => setIsSubmitOpen(false)}
              className="px-4 py-2 rounded-xl bg-slate-100 text-slate-700 text-xs font-semibold"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 rounded-xl bg-indigo-600 text-white text-xs font-semibold"
            >
              Submit to Redressal Desk
            </button>
          </div>
        </form>
      </Modal>
    </div>
  );
};
