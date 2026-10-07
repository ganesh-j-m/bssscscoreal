import React, { useEffect, useState } from 'react';
import { QrCode, CheckCircle2, AlertCircle, Clock, Calendar, ShieldCheck, Sparkles } from 'lucide-react';
import { useAuth } from '../../context/AuthContext.tsx';
import { api } from '../../services/api.ts';
import { AttendanceRecord } from '../../types/index.ts';

export const StudentAttendancePage: React.FC = () => {
  const { user } = useAuth();
  const [records, setRecords] = useState<AttendanceRecord[]>([]);
  const [total, setTotal] = useState(0);
  const [present, setPresent] = useState(0);
  const [percentage, setPercentage] = useState(100);
  const [isLoading, setIsLoading] = useState(true);

  // Scan input
  const [qrInput, setQrInput] = useState('');
  const [scanStatus, setScanStatus] = useState<{ type: 'success' | 'error'; message: string } | null>(null);
  const [isScanning, setIsScanning] = useState(false);

  const fetchAttendance = async () => {
    if (!user) return;
    setIsLoading(true);
    try {
      const res = await api.getStudentAttendance(user.loginId);
      if (res.records) {
        setRecords(res.records);
        setTotal(res.total);
        setPresent(res.present);
        setPercentage(res.percentage);
      }
    } catch (err) {
      console.error('Error fetching student attendance:', err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchAttendance();
  }, [user]);

  const handleScanSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!qrInput.trim()) return;

    setScanStatus(null);
    setIsScanning(true);

    try {
      let token = qrInput.trim();
      let sessionId: string | undefined;

      // Handle JSON payload if student pasted raw QR string
      try {
        const parsed = JSON.parse(token);
        if (parsed.qrToken) token = parsed.qrToken;
        if (parsed.sessionId) sessionId = parsed.sessionId;
      } catch {
        // Plain string token
      }

      const res = await api.scanAttendanceQr({ qrToken: token, sessionId });
      if (res.success) {
        setScanStatus({ type: 'success', message: res.message || 'Attendance marked successfully as Present!' });
        setQrInput('');
        fetchAttendance();
      }
    } catch (err: any) {
      setScanStatus({ type: 'error', message: err.message || 'Failed to scan attendance.' });
    } finally {
      setIsScanning(false);
    }
  };

  return (
    <div className="space-y-6 p-4 sm:p-6 lg:p-8">
      <div>
        <h1 className="text-xl sm:text-2xl font-extrabold text-slate-900 tracking-tight">
          Smart QR Attendance & Lecture History
        </h1>
        <p className="text-xs sm:text-sm text-slate-500 font-medium mt-0.5">
          Scan the active 5-minute QR code projected by your professor during class to record your verified attendance.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* QR Scanner Card */}
        <div className="lg:col-span-5 bg-white rounded-2xl border border-slate-200 p-6 space-y-5 shadow-xs">
          <div className="border-b border-slate-100 pb-3 flex items-center justify-between">
            <div>
              <h2 className="text-base font-bold text-slate-900">Scan Lecture Attendance QR</h2>
              <p className="text-xs text-slate-500">Live camera scanner & token entry</p>
            </div>
            <div className="p-2 bg-indigo-50 text-indigo-600 rounded-xl">
              <QrCode className="w-5 h-5" />
            </div>
          </div>

          {scanStatus && (
            <div
              className={`p-3.5 rounded-xl border text-xs flex items-start gap-2.5 ${
                scanStatus.type === 'success'
                  ? 'bg-emerald-50 border-emerald-200 text-emerald-800'
                  : 'bg-rose-50 border-rose-200 text-rose-800'
              }`}
            >
              {scanStatus.type === 'success' ? (
                <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
              ) : (
                <AlertCircle className="w-4 h-4 text-rose-600 shrink-0 mt-0.5" />
              )}
              <span>{scanStatus.message}</span>
            </div>
          )}

          <form onSubmit={handleScanSubmit} className="space-y-3">
            <div className="space-y-1">
              <label className="text-xs font-semibold text-slate-700">QR Session Token / String</label>
              <textarea
                rows={3}
                required
                placeholder="Scan or paste the projected QR code string / token..."
                value={qrInput}
                onChange={e => setQrInput(e.target.value)}
                className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs font-mono text-slate-800 focus:outline-hidden focus:border-indigo-600 focus:ring-2 focus:ring-indigo-500/20"
              />
            </div>

            <button
              type="submit"
              disabled={isScanning}
              className="w-full py-3 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-semibold text-xs sm:text-sm shadow-md transition-all flex items-center justify-center space-x-2 disabled:opacity-50"
            >
              <CheckCircle2 className="w-4 h-4" />
              <span>{isScanning ? 'Verifying Student Identity & Expiry...' : 'Confirm & Mark Present'}</span>
            </button>
          </form>

          <div className="p-4 rounded-xl bg-slate-50 border border-slate-100 space-y-1 text-xs text-slate-600">
            <span className="font-semibold text-slate-800 block">Attendance Security Policy:</span>
            <p>• QR tokens expire after 5 minutes.</p>
            <p>• Duplicate scans are blocked automatically.</p>
            <p>• Must match your enrolled course, year & division.</p>
          </div>
        </div>

        {/* Statistics & Attendance Log */}
        <div className="lg:col-span-7 space-y-6">
          <div className="grid grid-cols-3 gap-4">
            <div className="p-4 rounded-2xl bg-white border border-slate-200 shadow-xs text-center">
              <span className="text-xs font-semibold text-slate-500 block">Attendance Rate</span>
              <span className="text-2xl sm:text-3xl font-extrabold text-indigo-600 mt-1 block">{percentage}%</span>
            </div>
            <div className="p-4 rounded-2xl bg-white border border-slate-200 shadow-xs text-center">
              <span className="text-xs font-semibold text-slate-500 block">Lectures Present</span>
              <span className="text-2xl sm:text-3xl font-extrabold text-emerald-600 mt-1 block">{present}</span>
            </div>
            <div className="p-4 rounded-2xl bg-white border border-slate-200 shadow-xs text-center">
              <span className="text-xs font-semibold text-slate-500 block">Total Conducted</span>
              <span className="text-2xl sm:text-3xl font-extrabold text-slate-900 mt-1 block">{total}</span>
            </div>
          </div>

          <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-xs">
            <div className="px-5 py-4 border-b border-slate-100 flex items-center justify-between">
              <h3 className="font-bold text-slate-900 text-sm">Attendance Records</h3>
              <span className="text-xs text-slate-500">{records.length} Recorded Entries</span>
            </div>

            <div className="overflow-x-auto max-h-96 overflow-y-auto">
              <table className="w-full text-left text-xs">
                <thead className="bg-slate-50 border-b border-slate-200 text-slate-500 uppercase font-semibold sticky top-0">
                  <tr>
                    <th className="px-5 py-3">Subject</th>
                    <th className="px-5 py-3">Faculty</th>
                    <th className="px-5 py-3">Date & Time</th>
                    <th className="px-5 py-3">Method</th>
                    <th className="px-5 py-3 text-right">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {isLoading ? (
                    <tr>
                      <td colSpan={5} className="px-5 py-6 text-center text-slate-400">Loading attendance history...</td>
                    </tr>
                  ) : records.length === 0 ? (
                    <tr>
                      <td colSpan={5} className="px-5 py-6 text-center text-slate-400">No attendance records yet.</td>
                    </tr>
                  ) : (
                    records.map((r) => (
                      <tr key={r.id} className="hover:bg-slate-50/70">
                        <td className="px-5 py-3 font-semibold text-slate-900">{r.subject}</td>
                        <td className="px-5 py-3 text-slate-600">{r.faculty}</td>
                        <td className="px-5 py-3 text-slate-600">
                          <span>{r.date}</span>
                          <span className="text-[10px] text-slate-400 block">{r.time}</span>
                        </td>
                        <td className="px-5 py-3 text-slate-500 font-mono text-[11px]">
                          {r.sessionId ? 'Smart QR' : 'Manual'}
                        </td>
                        <td className="px-5 py-3 text-right">
                          <span className={`px-2 py-0.5 rounded text-[11px] font-semibold ${
                            r.status === 'Present' ? 'bg-emerald-50 text-emerald-700' : 'bg-rose-50 text-rose-700'
                          }`}>
                            {r.status}
                          </span>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
