import React, { useEffect, useState } from 'react';
import { FileBadge, CheckCircle, XCircle, Clock } from 'lucide-react';
import { api } from '../../services/api.ts';
import { CertificateRecord } from '../../types/index.ts';
import { Modal } from '../../components/common/Modal.tsx';

export const CertificatesPage: React.FC = () => {
  const [certificates, setCertificates] = useState<CertificateRecord[]>([]);
  const [selectedCert, setSelectedCert] = useState<CertificateRecord | null>(null);
  const [isProcessOpen, setIsProcessOpen] = useState(false);
  const [status, setStatus] = useState('APPROVED');
  const [adminNotes, setAdminNotes] = useState('');
  const [isLoading, setIsLoading] = useState(true);

  const fetchCertificates = async () => {
    setIsLoading(true);
    try {
      const res = await api.getCertificates();
      if (res.certificates) setCertificates(res.certificates);
    } catch (err) {
      console.error('Error fetching certificates:', err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchCertificates();
  }, []);

  const handleProcessSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedCert) return;
    try {
      await api.updateCertificateStatus(selectedCert.id, { status, adminNotes });
      setIsProcessOpen(false);
      setSelectedCert(null);
      fetchCertificates();
    } catch (err: any) {
      alert(err.message || 'Failed to update certificate request.');
    }
  };

  return (
    <div className="space-y-6 p-4 sm:p-6 lg:p-8">
      <div>
        <h1 className="text-xl sm:text-2xl font-extrabold text-slate-900 tracking-tight">
          Certificates & Document Verification Desk
        </h1>
        <p className="text-xs sm:text-sm text-slate-500 font-medium mt-0.5">
          Review, approve, and digitally issue Bonafide Certificates, Leaving Certificates (LC), and Character Transcripts.
        </p>
      </div>

      <div className="bg-white rounded-2xl border border-slate-200/80 shadow-xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50 border-b border-slate-200 text-slate-500 uppercase tracking-wider font-semibold">
              <tr>
                <th className="px-5 py-3.5">Student</th>
                <th className="px-5 py-3.5">Certificate Type</th>
                <th className="px-5 py-3.5">Application Reason</th>
                <th className="px-5 py-3.5">Applied Date</th>
                <th className="px-5 py-3.5">Status</th>
                <th className="px-5 py-3.5">Certificate Number</th>
                <th className="px-5 py-3.5 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {isLoading ? (
                <tr>
                  <td colSpan={7} className="px-5 py-8 text-center text-slate-400">Loading certificate requests...</td>
                </tr>
              ) : certificates.length === 0 ? (
                <tr>
                  <td colSpan={7} className="px-5 py-8 text-center text-slate-400">No certificate requests found.</td>
                </tr>
              ) : (
                certificates.map((c) => (
                  <tr key={c.id} className="hover:bg-slate-50/70 transition-colors">
                    <td className="px-5 py-3.5">
                      <span className="font-mono font-bold text-indigo-700 block">{c.studentLoginId}</span>
                      <span className="font-semibold text-slate-900">{c.studentName}</span>
                    </td>
                    <td className="px-5 py-3.5 font-bold text-slate-800">{c.certificateType}</td>
                    <td className="px-5 py-3.5 text-slate-600 max-w-xs truncate">{c.reason}</td>
                    <td className="px-5 py-3.5 text-slate-500">{c.appliedDate}</td>
                    <td className="px-5 py-3.5">
                      <span className={`px-2 py-0.5 rounded font-semibold text-[11px] ${
                        c.status === 'APPROVED' || c.status === 'ISSUED'
                          ? 'bg-emerald-50 text-emerald-700'
                          : c.status === 'REJECTED'
                          ? 'bg-rose-50 text-rose-700'
                          : 'bg-amber-50 text-amber-700'
                      }`}>
                        {c.status}
                      </span>
                    </td>
                    <td className="px-5 py-3.5 font-mono text-[11px] text-slate-600">
                      {c.certificateNumber || '—'}
                    </td>
                    <td className="px-5 py-3.5 text-right">
                      <button
                        onClick={() => {
                          setSelectedCert(c);
                          setStatus(c.status === 'PENDING' ? 'APPROVED' : c.status);
                          setAdminNotes(c.adminNotes || '');
                          setIsProcessOpen(true);
                        }}
                        className="px-2.5 py-1 rounded-lg bg-indigo-50 text-indigo-700 hover:bg-indigo-100 font-semibold text-[11px]"
                      >
                        Review / Action
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      <Modal isOpen={isProcessOpen} onClose={() => setIsProcessOpen(false)} title="Process Certificate Request">
        <form onSubmit={handleProcessSubmit} className="space-y-4">
          <div className="p-3 bg-slate-50 rounded-xl space-y-1 text-xs">
            <p><strong>Student:</strong> {selectedCert?.studentName} ({selectedCert?.studentLoginId})</p>
            <p><strong>Certificate:</strong> {selectedCert?.certificateType}</p>
            <p><strong>Reason:</strong> {selectedCert?.reason}</p>
          </div>
          <div className="space-y-1">
            <label className="text-xs font-semibold text-slate-700">Action Status</label>
            <select
              value={status}
              onChange={e => setStatus(e.target.value)}
              className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs bg-white"
            >
              <option value="APPROVED">APPROVE & ISSUE DIGITAL CERTIFICATE</option>
              <option value="REJECTED">REJECT APPLICATION</option>
              <option value="PENDING">KEEP PENDING</option>
            </select>
          </div>
          <div className="space-y-1">
            <label className="text-xs font-semibold text-slate-700">Administrative Notes</label>
            <textarea
              rows={3}
              value={adminNotes}
              onChange={e => setAdminNotes(e.target.value)}
              placeholder="e.g. Verified with admission register. College seal attached."
              className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs"
            />
          </div>
          <div className="pt-3 flex justify-end gap-2">
            <button
              type="button"
              onClick={() => setIsProcessOpen(false)}
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
