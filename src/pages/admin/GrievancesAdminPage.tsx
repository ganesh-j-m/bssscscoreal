import React, { useEffect, useState } from 'react';
import { AlertCircle, CheckCircle2, MessageSquare, Clock } from 'lucide-react';
import { api } from '../../services/api.ts';
import { GrievanceRecord } from '../../types/index.ts';
import { Modal } from '../../components/common/Modal.tsx';

export const GrievancesAdminPage: React.FC = () => {
  const [grievances, setGrievances] = useState<GrievanceRecord[]>([]);
  const [selectedGrievance, setSelectedGrievance] = useState<GrievanceRecord | null>(null);
  const [isResolveOpen, setIsResolveOpen] = useState(false);
  const [status, setStatus] = useState('RESOLVED');
  const [adminResponse, setAdminResponse] = useState('');
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

  const handleResolveSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedGrievance) return;
    try {
      await api.resolveGrievance(selectedGrievance.id, { status, adminResponse });
      setIsResolveOpen(false);
      setSelectedGrievance(null);
      fetchGrievances();
    } catch (err: any) {
      alert(err.message || 'Failed to update grievance.');
    }
  };

  return (
    <div className="space-y-6 p-4 sm:p-6 lg:p-8">
      <div>
        <h1 className="text-xl sm:text-2xl font-extrabold text-slate-900 tracking-tight">
          Student Grievance Redressal Cell
        </h1>
        <p className="text-xs sm:text-sm text-slate-500 font-medium mt-0.5">
          Review, investigate, and provide official institutional redressal for student queries and complaints.
        </p>
      </div>

      <div className="bg-white rounded-2xl border border-slate-200/80 shadow-xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50 border-b border-slate-200 text-slate-500 uppercase font-semibold">
              <tr>
                <th className="px-5 py-3.5">Student</th>
                <th className="px-5 py-3.5">Category</th>
                <th className="px-5 py-3.5">Title & Concern</th>
                <th className="px-5 py-3.5">Status</th>
                <th className="px-5 py-3.5">Admin Redressal</th>
                <th className="px-5 py-3.5 text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {isLoading ? (
                <tr>
                  <td colSpan={6} className="px-5 py-8 text-center text-slate-400">Loading grievances...</td>
                </tr>
              ) : grievances.length === 0 ? (
                <tr>
                  <td colSpan={6} className="px-5 py-8 text-center text-slate-400">No grievances filed.</td>
                </tr>
              ) : (
                grievances.map((g) => (
                  <tr key={g.id} className="hover:bg-slate-50/70">
                    <td className="px-5 py-3.5">
                      <span className="font-mono font-bold text-indigo-700 block">{g.studentLoginId}</span>
                      <span className="font-semibold text-slate-900">{g.studentName}</span>
                    </td>
                    <td className="px-5 py-3.5 font-semibold text-slate-700">{g.category}</td>
                    <td className="px-5 py-3.5 text-slate-600 max-w-sm">
                      <strong className="text-slate-900 block">{g.title}</strong>
                      <span className="text-[11px] text-slate-500 line-clamp-1">{g.description}</span>
                    </td>
                    <td className="px-5 py-3.5">
                      <span className={`px-2 py-0.5 rounded text-[11px] font-semibold ${
                        g.status === 'RESOLVED'
                          ? 'bg-emerald-50 text-emerald-700'
                          : g.status === 'IN_REVIEW'
                          ? 'bg-amber-50 text-amber-700'
                          : 'bg-rose-50 text-rose-700'
                      }`}>
                        {g.status}
                      </span>
                    </td>
                    <td className="px-5 py-3.5 text-slate-600 max-w-xs truncate">
                      {g.adminResponse || <span className="text-slate-400 italic">Awaiting administrative reply</span>}
                    </td>
                    <td className="px-5 py-3.5 text-right">
                      <button
                        onClick={() => {
                          setSelectedGrievance(g);
                          setStatus(g.status === 'OPEN' ? 'IN_REVIEW' : g.status);
                          setAdminResponse(g.adminResponse || '');
                          setIsResolveOpen(true);
                        }}
                        className="px-2.5 py-1 rounded-lg bg-indigo-50 text-indigo-700 hover:bg-indigo-100 font-semibold"
                      >
                        Respond
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Redressal Modal */}
      <Modal isOpen={isResolveOpen} onClose={() => setIsResolveOpen(false)} title="Grievance Redressal Action">
        <form onSubmit={handleResolveSubmit} className="space-y-4">
          <div className="p-3 bg-slate-50 rounded-xl space-y-1 text-xs">
            <p><strong>Student:</strong> {selectedGrievance?.studentName} ({selectedGrievance?.studentLoginId})</p>
            <p><strong>Title:</strong> {selectedGrievance?.title}</p>
            <p><strong>Description:</strong> {selectedGrievance?.description}</p>
          </div>
          <div className="space-y-1">
            <label className="text-xs font-semibold text-slate-700">Resolution Status</label>
            <select
              value={status}
              onChange={e => setStatus(e.target.value)}
              className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs bg-white"
            >
              <option value="RESOLVED">RESOLVED</option>
              <option value="IN_REVIEW">IN REVIEW</option>
              <option value="REJECTED">REJECTED</option>
            </select>
          </div>
          <div className="space-y-1">
            <label className="text-xs font-semibold text-slate-700">Official Redressal Response *</label>
            <textarea
              rows={4}
              required
              value={adminResponse}
              onChange={e => setAdminResponse(e.target.value)}
              placeholder="State the corrective measures taken by college administration..."
              className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs"
            />
          </div>
          <div className="pt-3 flex justify-end gap-2">
            <button
              type="button"
              onClick={() => setIsResolveOpen(false)}
              className="px-4 py-2 rounded-xl bg-slate-100 text-slate-700 text-xs font-semibold"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 rounded-xl bg-indigo-600 text-white text-xs font-semibold"
            >
              Submit Redressal
            </button>
          </div>
        </form>
      </Modal>
    </div>
  );
};
