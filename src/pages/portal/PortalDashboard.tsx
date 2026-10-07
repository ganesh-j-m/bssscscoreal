import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import {
  CheckCircle2,
  FileText,
  CreditCard,
  Library,
  Briefcase,
  AlertCircle,
  FileBadge,
  QrCode,
  ArrowRight,
  BookOpen
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext.tsx';
import { api } from '../../services/api.ts';

export const PortalDashboard: React.FC = () => {
  const { user } = useAuth();
  const [attendancePercent, setAttendancePercent] = useState<number>(92);
  const [examCount, setExamCount] = useState<number>(2);
  const [pendingFee, setPendingFee] = useState<number>(0);
  const [issuedBooksCount, setIssuedBooksCount] = useState<number>(1);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (!user) return;
    const fetchPortalSummary = async () => {
      try {
        const [attRes, feeRes, bookRes] = await Promise.allSettled([
          api.getStudentAttendance(user.loginId),
          api.getStudentFees(user.loginId),
          api.getBookIssues({ studentLoginId: user.loginId }),
        ]);

        if (attRes.status === 'fulfilled' && attRes.value.percentage !== undefined) {
          setAttendancePercent(attRes.value.percentage);
        }
        if (feeRes.status === 'fulfilled' && feeRes.value.fees) {
          const totalPending = feeRes.value.fees.reduce((acc: number, f: any) => acc + (f.pendingAmount || 0), 0);
          setPendingFee(totalPending);
        }
        if (bookRes.status === 'fulfilled' && bookRes.value.issues) {
          setIssuedBooksCount(bookRes.value.issues.filter((i: any) => i.status === 'ISSUED').length);
        }
      } catch (err) {
        console.error('Error fetching portal summary:', err);
      } finally {
        setIsLoading(false);
      }
    };

    fetchPortalSummary();
  }, [user]);

  return (
    <div className="space-y-6 p-4 sm:p-6 lg:p-8">
      {/* Welcome Banner */}
      <div className="p-6 sm:p-8 rounded-3xl bg-gradient-to-r from-indigo-900 via-indigo-800 to-slate-900 text-white flex flex-col md:flex-row md:items-center justify-between gap-6 shadow-md">
        <div className="space-y-2">
          <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-indigo-500/30 text-indigo-200 text-xs font-semibold">
            <span>SCSCO Digital Campus • Academic Session 2024-25</span>
          </div>
          <h1 className="text-xl sm:text-2xl font-bold tracking-tight">
            Welcome back, {user?.name}
          </h1>
          <p className="text-xs sm:text-sm text-slate-300">
            Login ID: <strong className="font-mono text-white">{user?.loginId}</strong> • Standing: {user?.studentDetails?.course || 'Active Student'}
          </p>
        </div>

        <Link
          to="/portal/attendance"
          className="inline-flex items-center space-x-2 px-5 py-3 rounded-xl bg-white text-indigo-950 hover:bg-slate-100 font-bold text-xs sm:text-sm shadow-md transition-all shrink-0"
        >
          <QrCode className="w-4 h-4 text-indigo-600" />
          <span>Scan Lecture Attendance QR</span>
        </Link>
      </div>

      {/* Metric Cards Grid */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {/* Attendance */}
        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs space-y-2">
          <div className="flex items-center justify-between text-slate-500">
            <span className="text-xs font-semibold">Lecture Attendance</span>
            <CheckCircle2 className="w-4 h-4 text-emerald-600" />
          </div>
          <p className="text-2xl sm:text-3xl font-extrabold text-slate-900">{attendancePercent}%</p>
          <Link to="/portal/attendance" className="text-[11px] font-semibold text-indigo-600 hover:underline block">
            Scan QR or view records →
          </Link>
        </div>

        {/* Exams */}
        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs space-y-2">
          <div className="flex items-center justify-between text-slate-500">
            <span className="text-xs font-semibold">Upcoming Exams</span>
            <FileText className="w-4 h-4 text-indigo-600" />
          </div>
          <p className="text-2xl sm:text-3xl font-extrabold text-slate-900">{examCount} Scheduled</p>
          <Link to="/portal/exams" className="text-[11px] font-semibold text-indigo-600 hover:underline block">
            View timetable & hall ticket →
          </Link>
        </div>

        {/* Pending Fee */}
        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs space-y-2">
          <div className="flex items-center justify-between text-slate-500">
            <span className="text-xs font-semibold">Tuition / Dues</span>
            <CreditCard className="w-4 h-4 text-rose-600" />
          </div>
          <p className="text-xl sm:text-2xl font-extrabold text-slate-900">
            ₹{pendingFee.toLocaleString('en-IN')}
          </p>
          <Link to="/portal/fees" className="text-[11px] font-semibold text-indigo-600 hover:underline block">
            View receipts & due dates →
          </Link>
        </div>

        {/* Library Books */}
        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs space-y-2">
          <div className="flex items-center justify-between text-slate-500">
            <span className="text-xs font-semibold">Library Books</span>
            <Library className="w-4 h-4 text-indigo-600" />
          </div>
          <p className="text-2xl sm:text-3xl font-extrabold text-slate-900">{issuedBooksCount} Active</p>
          <Link to="/portal/library" className="text-[11px] font-semibold text-indigo-600 hover:underline block">
            View issued books & returns →
          </Link>
        </div>
      </div>

      {/* Quick Navigation Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Link
          to="/portal/results"
          className="p-6 rounded-2xl bg-white border border-slate-200 hover:border-indigo-300 transition-all hover:shadow-xs group space-y-2"
        >
          <div className="w-10 h-10 rounded-xl bg-indigo-50 text-indigo-600 flex items-center justify-center group-hover:scale-105 transition-transform">
            <FileText className="w-5 h-5" />
          </div>
          <h3 className="font-bold text-slate-900 text-sm">University Grade Sheets & Results</h3>
          <p className="text-xs text-slate-500">Access semester marksheets, grade cards, and cumulative SGPA/CGPA.</p>
        </Link>

        <Link
          to="/portal/certificates"
          className="p-6 rounded-2xl bg-white border border-slate-200 hover:border-indigo-300 transition-all hover:shadow-xs group space-y-2"
        >
          <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center group-hover:scale-105 transition-transform">
            <FileBadge className="w-5 h-5" />
          </div>
          <h3 className="font-bold text-slate-900 text-sm">Digital Certificate Applications</h3>
          <p className="text-xs text-slate-500">Apply online for Bonafide certificates, Leaving Certificates, and character transcripts.</p>
        </Link>

        <Link
          to="/portal/placements"
          className="p-6 rounded-2xl bg-white border border-slate-200 hover:border-indigo-300 transition-all hover:shadow-xs group space-y-2"
        >
          <div className="w-10 h-10 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center group-hover:scale-105 transition-transform">
            <Briefcase className="w-5 h-5" />
          </div>
          <h3 className="font-bold text-slate-900 text-sm">Campus Recruitment Drives</h3>
          <p className="text-xs text-slate-500">View active placement eligibility, company drives by TCS, Infosys, and register.</p>
        </Link>
      </div>
    </div>
  );
};
