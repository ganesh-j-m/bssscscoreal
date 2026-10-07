import React, { useEffect, useState } from 'react';
import { FileSpreadsheet, CheckCircle2, XCircle, Clock, Eye } from 'lucide-react';
import { api } from '../../services/api.ts';
import { AdmissionApplication } from '../../types/index.ts';
import { Modal } from '../../components/common/Modal.tsx';

export const AdmissionsAdminPage: React.FC = () => {
  const [admissions, setAdmissions] = useState<AdmissionApplication[]>([]);
  const [selectedApp, setSelectedApp] = useState<AdmissionApplication | null>(null);
  const [isReviewOpen, setIsReviewOpen] = useState(false);
  const [status, setStatus] = useState('APPROVED');
  const [notes, setNotes] = useState('');
  const [isLoading, setIsLoading] = useState(true);

  const fetchAdmissions = async () => {
    setIsLoading(true);
    try {
      const res = await api.getAdmissions();
      if (res.admissions) setAdmissions(res.admissions);
    } catch (err) {
      console.error('Error fetching admissions:', err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchAdmissions();
  }, []);

  const handleReviewSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedApp) return;
    try {
      await api.updateAdmissionStatus(selectedApp.id, { status, notes });
      setIsReviewOpen(false);
      setSelectedApp(null);
      fetchAdmissions();
    } catch (err: any) {
      alert(err.message || 'Failed to update application');
    }
  };

  return (
    <div className="space-y-6 p-4 sm:p-6 lg:p-8">
      <div>
        <h1 className="text-xl sm:text-2xl font-extrabold text-slate-900 tracking-tight">
          Admissions Review Desk
        </h1>
        <p className="text-xs sm:text-sm text-slate-500 font-medium mt-0.5">
          Review candidate registrations, marks eligibility, social category quotas, and grant provisional approval.
        </p>
      </div>

      <div className="bg-white rounded-2xl border border-slate-200/80 shadow-xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50 border-b border-slate-200 text-slate-500 uppercase tracking-wider font-semibold">
              <tr>
                <th className="px-5 py-3.5">App Number</th>
                <th className="px-5 py-3.5">Applicant Name</th>
                <th className="px-5 py-3.5">Program Applied</th>
                <th className="px-5 py-3.5">Qualifying Marks / Previous College</th>
                <th className="px-5 py-3.5">Category</th>
                <th className="px-5 py-3.5">Applied Date</th>
                <th className="px-5 py-3.5">Status</th>
                <th className="px-5 py-3.5 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {isLoading ? (
                <tr>
                  <td colSpan={8} className="px-5 py-8 text-center text-slate-400">Loading applications...</td>
                </tr>
              ) : admissions.length === 0 ? (
                <tr>
                  <td colSpan={8} className="px-5 py-8 text-center text-slate-400">No applications received yet.</td>
                </tr>
              ) : (
                admissions.map((a) => (
                  <tr key={a.id} className="hover:bg-slate-50/70 transition-colors">
                    <td className="px-5 py-3.5 font-mono font-bold text-indigo-700">{a.applicationNumber}</td>
                    <td className="px-5 py-3.5 font-semibold text-slate-900">
                      <span>{a.applicantName}</span>
                      <span className="text-[11px] text-slate-400 block">{a.email} • {a.phone}</span>
                    </td>
                    <td className="px-5 py-3.5 font-medium text-slate-800">{a.course}</td>
                    <td className="px-5 py-3.5 text-slate-600">
                      <span className="font-bold text-slate-800">{a.previousPercentage}</span>
                      <span className="text-[11px] text-slate-400 block">{a.previousCollege}</span>
                    </td>
                    <td className="px-5 py-3.5 text-slate-700">{a.category}</td>
                    <td className="px-5 py-3.5 text-slate-500">{a.appliedDate}</td>
                    <td className="px-5 py-3.5">
                      <span className={`px-2 py-0.5 rounded font-semibold text-[11px] ${
                        a.status === 'APPROVED'
                          ? 'bg-emerald-50 text-emerald-700'
                          : a.status === 'REJECTED'
                          ? 'bg-rose-50 text-rose-700'
                          : a.status === 'REVIEWED'
                          ? 'bg-sky-50 text-sky-700'
                          : 'bg-amber-50 text-amber-700'
                      }`}>
                        {a.status}
                      </span>
                    </td>
                    <td className="px-5 py-3.5 text-right">
                      <button
                        onClick={() => {
                          setSelectedApp(a);
                          setStatus(a.status === 'PENDING' ? 'APPROVED' : a.status);
                          setNotes(a.notes || '');
                          setIsReviewOpen(true);
                        }}
                        className="px-2.5 py-1 rounded-lg bg-indigo-50 text-indigo-700 hover:bg-indigo-100 font-semibold text-[11px]"
                      >
                        Review
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      <Modal isOpen={isReviewOpen} onClose={() => setIsReviewOpen(false)} title="Review Admission Application">
        <form onSubmit={handleReviewSubmit} className="space-y-4">
          <div className="p-3 bg-slate-50 rounded-xl space-y-1 text-xs">
            <p><strong>Applicant:</strong> {selectedApp?.applicantName}</p>
            <p><strong>Application Number:</strong> {selectedApp?.applicationNumber}</p>
            <p><strong>Program:</strong> {selectedApp?.course}</p>
            <p><strong>Marks:</strong> {selectedApp?.previousPercentage}</p>
          </div>
          <div className="space-y-1">
            <label className="text-xs font-semibold text-slate-700">Admission Decision</label>
            <select
              value={status}
              onChange={e => setStatus(e.target.value)}
              className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs bg-white"
            >
              <option value="APPROVED">APPROVE APPLICATION (Provisional Seat Granted)</option>
              <option value="REVIEWED">MARK AS REVIEWED (Documents Pending)</option>
              <option value="REJECTED">REJECT APPLICATION</option>
              <option value="PENDING">PENDING</option>
            </select>
          </div>
          <div className="space-y-1">
            <label className="text-xs font-semibold text-slate-700">Internal Remarks / Office Notes</label>
            <textarea
              rows={3}
              value={notes}
              onChange={e => setNotes(e.target.value)}
              placeholder="e.g. Verified 12th marksheet. Eligible under merit quota."
              className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs"
            />
          </div>
          <div className="pt-3 flex justify-end gap-2">
            <button
              type="button"
              onClick={() => setIsReviewOpen(false)}
              className="px-4 py-2 rounded-xl bg-slate-100 text-slate-700 text-xs font-semibold"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 rounded-xl bg-indigo-600 text-white text-xs font-semibold"
            >
              Save Decision
            </button>
          </div>
        </form>
      </Modal>
    </div>
  );
};
