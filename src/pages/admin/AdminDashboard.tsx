import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import {
  Users,
  GraduationCap,
  UserCheck,
  FileSpreadsheet,
  CheckCircle2,
  CreditCard,
  FileBadge,
  AlertCircle,
  Briefcase,
  Library,
  ArrowRight,
  Plus,
  QrCode,
  ShieldAlert,
  Building
} from 'lucide-react';
import { ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Tooltip, CartesianGrid } from 'recharts';
import { api } from '../../services/api.ts';
import { DashboardStats } from '../../types/index.ts';

export const AdminDashboard: React.FC = () => {
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    api.getDashboardStats()
      .then((data) => setStats(data))
      .catch(console.error)
      .finally(() => setIsLoading(false));
  }, []);

  return (
    <div className="space-y-8 p-4 sm:p-6 lg:p-8">
      {/* Top Welcome & Quick Actions */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl sm:text-2xl font-extrabold text-slate-900 tracking-tight">
            Institutional ERP Control Center
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 font-medium mt-0.5">
            Real-time analytics and campus operations backed permanently by PostgreSQL.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <Link
            to="/admin/students"
            className="inline-flex items-center space-x-1.5 px-3 py-2 rounded-xl bg-indigo-600 text-white font-semibold text-xs hover:bg-indigo-700 transition-colors shadow-xs"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Add Student</span>
          </Link>
          <Link
            to="/admin/qr-attendance"
            className="inline-flex items-center space-x-1.5 px-3 py-2 rounded-xl bg-slate-900 text-white font-semibold text-xs hover:bg-slate-800 transition-colors shadow-xs"
          >
            <QrCode className="w-3.5 h-3.5" />
            <span>Start QR Attendance</span>
          </Link>
          <Link
            to="/admin/notices"
            className="inline-flex items-center space-x-1.5 px-3 py-2 rounded-xl bg-white border border-slate-200 text-slate-700 font-semibold text-xs hover:bg-slate-50 transition-colors"
          >
            <span>Post Notice</span>
          </Link>
        </div>
      </div>

      {/* Primary Statistics Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4">
        <div className="bg-white p-4 rounded-2xl border border-slate-200/80 shadow-xs space-y-2">
          <div className="flex items-center justify-between text-slate-500">
            <span className="text-xs font-semibold">Total Students</span>
            <GraduationCap className="w-4 h-4 text-indigo-600" />
          </div>
          <p className="text-2xl font-extrabold text-slate-900">
            {isLoading ? '...' : stats?.totalStudents.toLocaleString('en-IN') || 0}
          </p>
          <Link to="/admin/students" className="text-[11px] font-medium text-indigo-600 hover:text-indigo-700 block">
            Manage directory →
          </Link>
        </div>

        <div className="bg-white p-4 rounded-2xl border border-slate-200/80 shadow-xs space-y-2">
          <div className="flex items-center justify-between text-slate-500">
            <span className="text-xs font-semibold">Faculty Staff</span>
            <UserCheck className="w-4 h-4 text-indigo-600" />
          </div>
          <p className="text-2xl font-extrabold text-slate-900">
            {isLoading ? '...' : stats?.totalFaculty.toLocaleString('en-IN') || 0}
          </p>
          <Link to="/admin/faculty" className="text-[11px] font-medium text-indigo-600 hover:text-indigo-700 block">
            View staff list →
          </Link>
        </div>

        <div className="bg-white p-4 rounded-2xl border border-slate-200/80 shadow-xs space-y-2">
          <div className="flex items-center justify-between text-slate-500">
            <span className="text-xs font-semibold">Active Users</span>
            <Users className="w-4 h-4 text-emerald-600" />
          </div>
          <p className="text-2xl font-extrabold text-slate-900">
            {isLoading ? '...' : stats?.totalUsers.toLocaleString('en-IN') || 0}
          </p>
          <Link to="/admin/users" className="text-[11px] font-medium text-emerald-600 hover:text-emerald-700 block">
            Manage access →
          </Link>
        </div>

        <div className="bg-white p-4 rounded-2xl border border-slate-200/80 shadow-xs space-y-2">
          <div className="flex items-center justify-between text-slate-500">
            <span className="text-xs font-semibold">New Admissions</span>
            <FileSpreadsheet className="w-4 h-4 text-amber-600" />
          </div>
          <p className="text-2xl font-extrabold text-slate-900">
            {isLoading ? '...' : stats?.pendingAdmissions || 0}
          </p>
          <Link to="/admin/admissions" className="text-[11px] font-medium text-amber-600 hover:text-amber-700 block">
            Review forms →
          </Link>
        </div>

        <div className="bg-white p-4 rounded-2xl border border-slate-200/80 shadow-xs space-y-2">
          <div className="flex items-center justify-between text-slate-500">
            <span className="text-xs font-semibold">Today's Attendance</span>
            <CheckCircle2 className="w-4 h-4 text-sky-600" />
          </div>
          <p className="text-2xl font-extrabold text-slate-900">
            {isLoading ? '...' : stats?.todayAttendance || 0}
          </p>
          <Link to="/admin/attendance" className="text-[11px] font-medium text-sky-600 hover:text-sky-700 block">
            View register →
          </Link>
        </div>

        <div className="bg-white p-4 rounded-2xl border border-slate-200/80 shadow-xs space-y-2">
          <div className="flex items-center justify-between text-slate-500">
            <span className="text-xs font-semibold">Pending Fees</span>
            <CreditCard className="w-4 h-4 text-rose-600" />
          </div>
          <p className="text-xl font-extrabold text-slate-900 truncate">
            {isLoading ? '...' : `₹${(stats?.totalPendingFees || 0).toLocaleString('en-IN')}`}
          </p>
          <Link to="/admin/fees" className="text-[11px] font-medium text-rose-600 hover:text-rose-700 block">
            Fee register →
          </Link>
        </div>
      </div>

      {/* Secondary Metrics Strip */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 flex items-center justify-between">
          <div>
            <span className="text-[11px] font-semibold text-slate-500 uppercase">Certificates Requested</span>
            <p className="text-lg font-bold text-slate-900 mt-0.5">{stats?.pendingCertificates || 0}</p>
          </div>
          <FileBadge className="w-6 h-6 text-indigo-600" />
        </div>

        <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 flex items-center justify-between">
          <div>
            <span className="text-[11px] font-semibold text-slate-500 uppercase">Open Grievances</span>
            <p className="text-lg font-bold text-slate-900 mt-0.5">{stats?.openGrievances || 0}</p>
          </div>
          <AlertCircle className="w-6 h-6 text-amber-600" />
        </div>

        <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 flex items-center justify-between">
          <div>
            <span className="text-[11px] font-semibold text-slate-500 uppercase">Active Placements</span>
            <p className="text-lg font-bold text-slate-900 mt-0.5">{stats?.activePlacements || 0}</p>
          </div>
          <Briefcase className="w-6 h-6 text-emerald-600" />
        </div>

        <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 flex items-center justify-between">
          <div>
            <span className="text-[11px] font-semibold text-slate-500 uppercase">Library Catalog / Issues</span>
            <p className="text-lg font-bold text-slate-900 mt-0.5">
              {stats?.totalLibraryBooks || 0} / {stats?.activeBookIssues || 0}
            </p>
          </div>
          <Library className="w-6 h-6 text-indigo-600" />
        </div>
      </div>

      {/* Analytics Chart & Activity Feed */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Course Breakdown Bar Chart */}
        <div className="lg:col-span-7 bg-white rounded-2xl border border-slate-200 p-6 space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-sm font-bold text-slate-900">Student Enrollment by Degree Program</h3>
              <p className="text-xs text-slate-500">Distribution of actively enrolled undergraduates and postgraduates</p>
            </div>
            <span className="text-xs font-semibold text-slate-400">Database Live</span>
          </div>

          <div className="h-64 w-full pt-2">
            {stats?.courseBreakdown && stats.courseBreakdown.length > 0 ? (
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={stats.courseBreakdown} margin={{ top: 10, right: 10, left: -20, bottom: 20 }}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                  <XAxis dataKey="name" tick={{ fontSize: 11 }} angle={-15} textAnchor="end" />
                  <YAxis tick={{ fontSize: 11 }} />
                  <Tooltip
                    contentStyle={{ backgroundColor: '#1e293b', color: '#fff', borderRadius: '8px', fontSize: '12px' }}
                  />
                  <Bar dataKey="students" fill="#4f46e5" radius={[6, 6, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            ) : (
              <div className="h-full flex items-center justify-center text-xs text-slate-400">
                Enrollment statistics will populate dynamically as students are registered.
              </div>
            )}
          </div>
        </div>

        {/* Recent Audit Log Activity Trail */}
        <div className="lg:col-span-5 bg-white rounded-2xl border border-slate-200 p-6 space-y-4 flex flex-col justify-between">
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-sm font-bold text-slate-900">Recent Security & Audit Logs</h3>
                <p className="text-xs text-slate-500">Authoritative trail of system actions</p>
              </div>
              <ShieldAlert className="w-4 h-4 text-indigo-600" />
            </div>

            <div className="space-y-2.5 pt-1">
              {stats?.recentActivity && stats.recentActivity.length > 0 ? (
                stats.recentActivity.map((log) => (
                  <div key={log.id} className="p-2.5 rounded-xl bg-slate-50 border border-slate-100 text-xs space-y-1">
                    <div className="flex items-center justify-between">
                      <span className="font-semibold text-slate-800">{log.action} • {log.module}</span>
                      <span className="text-[10px] text-slate-400">{new Date(log.timestamp).toLocaleTimeString()}</span>
                    </div>
                    <p className="text-[11px] text-slate-600 line-clamp-1">{log.details || 'System event recorded.'}</p>
                    <div className="flex items-center gap-2 text-[10px] text-slate-400">
                      <span>By: <strong className="text-slate-600 font-mono">{log.userLoginId}</strong></span>
                      <span>({log.role})</span>
                    </div>
                  </div>
                ))
              ) : (
                <p className="text-xs text-slate-400 py-6 text-center">No audit activity logged yet.</p>
              )}
            </div>
          </div>

          <Link
            to="/admin/audit-logs"
            className="inline-flex items-center justify-center space-x-1.5 w-full py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold text-xs transition-colors"
          >
            <span>View Full Audit Log Trail</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>
      </div>
    </div>
  );
};
