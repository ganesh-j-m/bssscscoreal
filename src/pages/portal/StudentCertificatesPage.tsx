import React, { useEffect, useState } from 'react';
import { FileBadge, Plus, CheckCircle, Clock } from 'lucide-react';
import { useAuth } from '../../context/AuthContext.tsx';
import { api } from '../../services/api.ts';
import { CertificateRecord } from '../../types/index.ts';
import { Modal } from '../../components/common/Modal.tsx';

export const StudentCertificatesPage: React.FC = () => {
  const { user } = useAuth();
  const [certificates, setCertificates] = useState<CertificateRecord[]>([]);
  const [isApplyOpen, setIsApplyOpen] = useState(false);
  const [certType, setCertType] = useState('Bonafide Certificate');
  const [reason, setReason] = useState('');
  const [isLoading, setIsLoading] = useState(true);

  const fetchCertificates = async () => {
    if (!user) return;
    setIsLoading(true);
    try {
      const res = await api.getStudentCertificates(user.loginId);
      if (res.certificates) setCertificates(res.certificates);
    } catch (err) {
      console.error('Error fetching certificates:', err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchCertificates();
  }, [user]);

  const handleApply = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await api.applyCertificate({ certificateType: certType, reason });
      setIsApplyOpen(false);
      setReason('');
      fetchCertificates();
    } catch (err: any) {
      alert(err.message || 'Failed to apply for certificate');
    }
  };

  return (
    <div className="space-y-6 p-4 sm:p-6 lg:p-8">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl sm:text-2xl font-extrabold text-slate-900 tracking-tight">
            Apply for Official Certificates
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 font-medium mt-0.5">
            Submit applications for Bonafide Certificates, Leaving Certificates (TC), and Character Certificates.
          </p>
        </div>

        <button
          onClick={() => setIsApplyOpen(true)}
          className="inline-flex items-center space-x-1.5 px-3.5 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-semibold text-xs transition-colors shadow-xs"
        >
          <Plus className="w-3.5 h-3.5" />
          <span>Apply for Certificate</span>
        </button>
      </div>

      <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-xs">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50 border-b border-slate-200 text-slate-500 uppercase font-semibold">
              <tr>
                <th className="px-5 py-3.5">Certificate Type</th>
                <th className="px-5 py-3.5">Reason / Purpose</th>
                <th className="px-5 py-3.5">Applied Date</th>
                <th className="px-5 py-3.5">Status</th>
                <th className="px-5 py-3.5">Certificate #</th>
                <th className="px-5 py-3.5">Admin Remarks</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {isLoading ? (
                <tr><td colSpan={6} className="px-5 py-8 text-center text-slate-400">Loading certificate requests...</td></tr>
              ) : certificates.length === 0 ? (
                <tr><td colSpan={6} className="px-5 py-8 text-center text-slate-400">No certificate requests submitted yet.</td></tr>
              ) : (
                certificates.map((c) => (
                  <tr key={c.id} className="hover:bg-slate-50/70">
                    <td className="px-5 py-3.5 font-bold text-slate-900">{c.certificateType}</td>
                    <td className="px-5 py-3.5 text-slate-600 max-w-xs">{c.reason}</td>
                    <td className="px-5 py-3.5 text-slate-500">{c.appliedDate}</td>
                    <td className="px-5 py-3.5">
                      <span className={`px-2 py-0.5 rounded text-[11px] font-semibold ${
                        c.status === 'APPROVED' ? 'bg-emerald-50 text-emerald-700' : 'bg-amber-50 text-amber-700'
                      }`}>
                        {c.status}
                      </span>
                    </td>
                    <td className="px-5 py-3.5 font-mono text-[11px] text-indigo-700 font-bold">{c.certificateNumber || '—'}</td>
                    <td className="px-5 py-3.5 text-slate-500">{c.adminNotes || '—'}</td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      <Modal isOpen={isApplyOpen} onClose={() => setIsApplyOpen(false)} title="Apply for Academic Certificate">
        <form onSubmit={handleApply} className="space-y-4">
          <div className="space-y-1">
            <label className="text-xs font-semibold text-slate-700">Certificate Type *</label>
            <select
              value={certType}
              onChange={e => setCertType(e.target.value)}
              className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs bg-white"
            >
              <option value="Bonafide Certificate">Bonafide Certificate</option>
              <option value="Leaving Certificate (TC)">Leaving Certificate (TC)</option>
              <option value="Character Certificate">Character Certificate</option>
              <option value="Official Transcript">Official Transcript</option>
            </select>
          </div>
          <div className="space-y-1">
            <label className="text-xs font-semibold text-slate-700">Purpose / Reason *</label>
            <textarea
              rows={3}
              required
              value={reason}
              onChange={e => setReason(e.target.value)}
              placeholder="e.g. Scholarship verification, bus pass renewal, educational loan..."
              className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs"
            />
          </div>
          <div className="pt-3 flex justify-end gap-2">
            <button
              type="button"
              onClick={() => setIsApplyOpen(false)}
              className="px-4 py-2 rounded-xl bg-slate-100 text-slate-700 text-xs font-semibold"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 rounded-xl bg-indigo-600 text-white text-xs font-semibold"
            >
              Submit Application
            </button>
          </div>
        </form>
      </Modal>
    </div>
  );
};
