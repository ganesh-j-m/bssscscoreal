import React, { useState, useEffect } from 'react';
import { QrCode, Play, StopCircle, RefreshCw, Users, Clock, AlertTriangle, CheckCircle2 } from 'lucide-react';
import { api } from '../../services/api.ts';
import { AttendanceSession, Course, Subject } from '../../types/index.ts';

export const QrAttendancePage: React.FC = () => {
  const [courses, setCourses] = useState<Course[]>([]);
  const [subjects, setSubjects] = useState<Subject[]>([]);

  // Form
  const [selectedCourse, setSelectedCourse] = useState('B.Sc. Computer Science');
  const [selectedYear, setSelectedYear] = useState('SY');
  const [selectedDivision, setSelectedDivision] = useState('A');
  const [selectedSubject, setSelectedSubject] = useState('Data Structures & Algorithms');

  // Active session
  const [activeSession, setActiveSession] = useState<AttendanceSession | null>(null);
  const [qrCodeDataUrl, setQrCodeDataUrl] = useState<string | null>(null);
  const [secondsLeft, setSecondsLeft] = useState<number>(0);
  const [scannedAttendees, setScannedAttendees] = useState<any[]>([]);
  const [isGenerating, setIsGenerating] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    api.getCourses().then(res => {
      if (res.courses) setCourses(res.courses);
    }).catch(console.error);

    api.getSubjects().then(res => {
      if (res.subjects) setSubjects(res.subjects);
    }).catch(console.error);
  }, []);

  // Timer countdown
  useEffect(() => {
    if (secondsLeft <= 0) return;
    const interval = setInterval(() => {
      setSecondsLeft(prev => {
        if (prev <= 1) {
          clearInterval(interval);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
    return () => clearInterval(interval);
  }, [secondsLeft]);

  // Poll for scanned attendees while session is active
  useEffect(() => {
    if (!activeSession || secondsLeft <= 0) return;
    const pollInterval = setInterval(async () => {
      try {
        const res = await api.getAttendanceRecords({ sessionId: activeSession.sessionId });
        if (res.attendances) {
          setScannedAttendees(res.attendances);
        }
      } catch (err) {
        console.error('Error polling attendees:', err);
      }
    }, 3000);

    return () => clearInterval(pollInterval);
  }, [activeSession, secondsLeft]);

  const handleCreateSession = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setIsGenerating(true);

    try {
      const res = await api.createAttendanceSession({
        course: selectedCourse,
        year: selectedYear,
        division: selectedDivision,
        subject: selectedSubject,
      });

      if (res.success && res.session) {
        setActiveSession(res.session);
        setQrCodeDataUrl(res.qrCodeDataUrl);
        setSecondsLeft(300); // 5 minutes
        setScannedAttendees([]);
      }
    } catch (err: any) {
      setError(err.message || 'Failed to initialize QR attendance session.');
    } finally {
      setIsGenerating(false);
    }
  };

  const formatTime = (secs: number) => {
    const m = Math.floor(secs / 60);
    const s = secs % 60;
    return `${m}:${s < 10 ? '0' : ''}${s}`;
  };

  return (
    <div className="space-y-6 p-4 sm:p-6 lg:p-8">
      {/* Header */}
      <div>
        <h1 className="text-xl sm:text-2xl font-extrabold text-slate-900 tracking-tight">
          Smart QR Code Attendance Generator
        </h1>
        <p className="text-xs sm:text-sm text-slate-500 font-medium mt-0.5">
          Generate dynamic, tamper-proof attendance QR codes with 5-minute strict expiry and instant duplicate scan blocking.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Session Configuration Card */}
        <div className="lg:col-span-5 bg-white rounded-2xl border border-slate-200 p-6 space-y-5 shadow-xs">
          <div className="border-b border-slate-100 pb-3">
            <h2 className="text-base font-bold text-slate-900">Lecture Session Parameters</h2>
            <p className="text-xs text-slate-500">Select class details to generate a unique encrypted QR token.</p>
          </div>

          {error && (
            <div className="p-3 rounded-xl bg-rose-50 text-rose-700 text-xs flex items-center gap-2">
              <AlertTriangle className="w-4 h-4 shrink-0" />
              <span>{error}</span>
            </div>
          )}

          <form onSubmit={handleCreateSession} className="space-y-4">
            <div className="space-y-1">
              <label className="text-xs font-semibold text-slate-700">Course / Degree Program</label>
              <select
                value={selectedCourse}
                onChange={e => setSelectedCourse(e.target.value)}
                className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs bg-white"
              >
                {courses.length > 0 ? (
                  courses.map(c => <option key={c.id} value={c.name}>{c.name}</option>)
                ) : (
                  <option value="B.Sc. Computer Science">B.Sc. Computer Science</option>
                )}
              </select>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1">
                <label className="text-xs font-semibold text-slate-700">Year</label>
                <select
                  value={selectedYear}
                  onChange={e => setSelectedYear(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs bg-white"
                >
                  <option value="FY">FY</option>
                  <option value="SY">SY</option>
                  <option value="TY">TY</option>
                </select>
              </div>

              <div className="space-y-1">
                <label className="text-xs font-semibold text-slate-700">Division</label>
                <select
                  value={selectedDivision}
                  onChange={e => setSelectedDivision(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs bg-white"
                >
                  <option value="A">Division A</option>
                  <option value="B">Division B</option>
                </select>
              </div>
            </div>

            <div className="space-y-1">
              <label className="text-xs font-semibold text-slate-700">Subject / Course Unit</label>
              <input
                type="text"
                required
                value={selectedSubject}
                onChange={e => setSelectedSubject(e.target.value)}
                placeholder="e.g. Data Structures & Algorithms"
                className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs"
              />
            </div>

            <button
              type="submit"
              disabled={isGenerating}
              className="w-full py-3 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-semibold text-xs sm:text-sm shadow-md transition-all flex items-center justify-center space-x-2"
            >
              <QrCode className="w-4 h-4" />
              <span>{isGenerating ? 'Generating QR Token...' : 'Generate 5-Minute Attendance QR'}</span>
            </button>
          </form>

          <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 text-xs text-slate-600 space-y-1.5">
            <span className="font-semibold text-slate-800 block">Security & Validation Controls:</span>
            <p>• QR expires precisely after 5 minutes.</p>
            <p>• Student must be logged into Student Portal.</p>
            <p>• Student course, year, and division must match.</p>
            <p>• Duplicate scans are strictly blocked and audited.</p>
          </div>
        </div>

        {/* Live QR Display & Real-time Scan Feed Card */}
        <div className="lg:col-span-7 bg-white rounded-2xl border border-slate-200 p-6 space-y-6 shadow-xs flex flex-col justify-between">
          {activeSession && qrCodeDataUrl ? (
            <div className="space-y-6">
              {/* Top Countdown Banner */}
              <div className="flex items-center justify-between p-4 rounded-xl bg-slate-900 text-white">
                <div>
                  <span className="text-[10px] text-slate-400 uppercase tracking-wider block">Active Attendance Session</span>
                  <h3 className="font-bold text-sm text-indigo-300">{activeSession.subject}</h3>
                  <p className="text-[11px] text-slate-300">{activeSession.course} • {activeSession.year} Div {activeSession.division}</p>
                </div>

                <div className="text-right">
                  <span className="text-[10px] text-slate-400 uppercase block">Time Remaining</span>
                  <span className={`text-xl sm:text-2xl font-mono font-bold ${secondsLeft < 60 ? 'text-rose-400 animate-pulse' : 'text-emerald-400'}`}>
                    {secondsLeft > 0 ? formatTime(secondsLeft) : 'EXPIRED'}
                  </span>
                </div>
              </div>

              {/* QR Code Graphic */}
              <div className="flex flex-col items-center justify-center p-6 bg-slate-50 rounded-2xl border border-slate-100">
                {secondsLeft > 0 ? (
                  <div className="p-3 bg-white rounded-2xl shadow-md border border-slate-200">
                    <img
                      src={qrCodeDataUrl}
                      alt="Attendance QR Code"
                      className="w-64 h-64 object-contain"
                    />
                  </div>
                ) : (
                  <div className="p-12 text-center text-rose-600 space-y-2">
                    <AlertTriangle className="w-12 h-12 mx-auto" />
                    <p className="font-bold text-sm">QR Code Has Expired</p>
                    <p className="text-xs text-slate-500">Please generate a new session to continue taking attendance.</p>
                  </div>
                )}
                <p className="text-xs text-slate-500 font-mono mt-3">
                  Session ID: {activeSession.sessionId}
                </p>
              </div>

              {/* Real-time Attendees List */}
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <h4 className="text-xs font-bold text-slate-900 flex items-center gap-1.5">
                    <Users className="w-4 h-4 text-indigo-600" />
                    <span>Live Attendees Marked: {scannedAttendees.length}</span>
                  </h4>
                  <span className="text-[11px] text-slate-400">Auto-refreshing live from PostgreSQL</span>
                </div>

                <div className="max-h-44 overflow-y-auto divide-y divide-slate-100 border border-slate-100 rounded-xl bg-slate-50">
                  {scannedAttendees.length === 0 ? (
                    <p className="text-xs text-slate-400 py-6 text-center">
                      Waiting for students to scan the QR code via their portal...
                    </p>
                  ) : (
                    scannedAttendees.map((att, i) => (
                      <div key={i} className="p-2.5 flex items-center justify-between text-xs">
                        <div className="flex items-center space-x-2">
                          <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                          <span className="font-semibold text-slate-800">{att.studentName}</span>
                          <span className="text-[10px] text-slate-500 font-mono">({att.studentLoginId})</span>
                        </div>
                        <span className="text-[11px] text-slate-400">{att.time}</span>
                      </div>
                    ))
                  )}
                </div>
              </div>
            </div>
          ) : (
            <div className="h-full flex flex-col items-center justify-center p-12 text-center text-slate-400 space-y-3">
              <div className="w-16 h-16 rounded-2xl bg-indigo-50 text-indigo-600 flex items-center justify-center">
                <QrCode className="w-8 h-8" />
              </div>
              <h3 className="text-sm font-bold text-slate-700">No Active Attendance Session</h3>
              <p className="text-xs text-slate-500 max-w-sm">
                Select your class parameters on the left and click "Generate 5-Minute Attendance QR" to begin collecting attendance.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
