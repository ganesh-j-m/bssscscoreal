import React from 'react';
import { User, Mail, Phone, MapPin, GraduationCap, Calendar, ShieldCheck } from 'lucide-react';
import { useAuth } from '../../context/AuthContext.tsx';

export const StudentProfilePage: React.FC = () => {
  const { user } = useAuth();
  const stu = user?.studentDetails;

  return (
    <div className="space-y-6 p-4 sm:p-6 lg:p-8 max-w-4xl">
      <div>
        <h1 className="text-xl sm:text-2xl font-extrabold text-slate-900 tracking-tight">
          Student Academic Profile
        </h1>
        <p className="text-xs sm:text-sm text-slate-500 font-medium mt-0.5">
          Official collegiate identification and permanent enrollment record.
        </p>
      </div>

      <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-xs">
        {/* Profile Card Header */}
        <div className="p-6 sm:p-8 bg-slate-900 text-white flex flex-col sm:flex-row items-center space-y-4 sm:space-y-0 sm:space-x-6">
          <div className="w-20 h-20 rounded-2xl bg-indigo-600 text-white font-bold text-2xl flex items-center justify-center shrink-0 shadow-lg border-2 border-indigo-400">
            {user?.name?.[0] || 'S'}
          </div>
          <div className="text-center sm:text-left space-y-1">
            <h2 className="text-xl font-bold">{user?.name}</h2>
            <p className="text-xs font-mono text-indigo-300 font-semibold">
              Student ID: {user?.loginId} {stu?.prn ? `• University PRN: ${stu.prn}` : ''}
            </p>
            <p className="text-xs text-slate-300">
              {stu?.course || 'Enrolled Student'} • {stu?.year || 'FY'} Division {stu?.division || 'A'}
            </p>
          </div>
        </div>

        {/* Detailed Information Grid */}
        <div className="p-6 sm:p-8 space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-xs">
            <div className="space-y-3">
              <h3 className="font-bold text-sm text-slate-900 border-b border-slate-100 pb-2">
                Academic Standing
              </h3>
              <div className="space-y-2 text-slate-600">
                <p><strong>Department:</strong> {stu?.department || 'Computer Science & IT'}</p>
                <p><strong>Degree Program:</strong> {stu?.course || 'B.Sc. Computer Science'}</p>
                <p><strong>Current Standing:</strong> {stu?.year || 'SY'} - Semester {stu?.semester || 3} (Div {stu?.division || 'A'})</p>
                <p><strong>Admission Batch:</strong> {stu?.admissionYear || 2023}</p>
                <p><strong>Status:</strong> <span className="text-emerald-700 font-bold">Active Bonafide Student</span></p>
              </div>
            </div>

            <div className="space-y-3">
              <h3 className="font-bold text-sm text-slate-900 border-b border-slate-100 pb-2">
                Personal & Contact Details
              </h3>
              <div className="space-y-2 text-slate-600">
                <p><strong>Email Address:</strong> {user?.email}</p>
                <p><strong>Mobile Number:</strong> {user?.phone || '+91 91580 33445'}</p>
                <p><strong>Date of Birth:</strong> {stu?.dob || '2004-05-14'}</p>
                <p><strong>Gender:</strong> {stu?.gender || 'Male'}</p>
                <p><strong>Parent Name:</strong> {stu?.parentName || 'Narayan Tukaram More'}</p>
                <p><strong>Parent Contact:</strong> {stu?.parentPhone || '+91 94210 77889'}</p>
              </div>
            </div>
          </div>

          <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 text-xs text-slate-600">
            <p>
              <strong>Permanent Address:</strong> {stu?.address || 'Shivaji Chowk, Omerga, Dist. Dharashiv - 413606, Maharashtra'}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
