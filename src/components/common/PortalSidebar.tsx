import React from 'react';
import { NavLink } from 'react-router-dom';
import {
  LayoutDashboard,
  User,
  CheckCircle2,
  FileCheck,
  BookMarked,
  FileText,
  Award,
  CreditCard,
  FileBadge,
  Briefcase,
  Library,
  AlertCircle,
  Bell,
  LogOut,
  GraduationCap
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext.tsx';

interface PortalSidebarProps {
  isOpen: boolean;
  onClose?: () => void;
}

export const PortalSidebar: React.FC<PortalSidebarProps> = ({ isOpen, onClose }) => {
  const { user, logout } = useAuth();

  const links = [
    { name: 'Dashboard', path: '/portal/dashboard', icon: LayoutDashboard },
    { name: 'My Profile', path: '/portal/profile', icon: User },
    { name: 'Attendance & Scan QR', path: '/portal/attendance', icon: CheckCircle2 },
    { name: 'Assignments', path: '/portal/assignments', icon: FileCheck },
    { name: 'Study Material', path: '/portal/study-material', icon: BookMarked },
    { name: 'Upcoming Exams', path: '/portal/exams', icon: FileText },
    { name: 'My Results', path: '/portal/results', icon: Award },
    { name: 'Fee Dues & Receipts', path: '/portal/fees', icon: CreditCard },
    { name: 'Apply Certificates', path: '/portal/certificates', icon: FileBadge },
    { name: 'Campus Placements', path: '/portal/placements', icon: Briefcase },
    { name: 'Library Issues', path: '/portal/library', icon: Library },
    { name: 'Grievance Desk', path: '/portal/grievances', icon: AlertCircle },
    { name: 'Notifications', path: '/portal/notifications', icon: Bell },
  ];

  return (
    <>
      {isOpen && (
        <div
          onClick={onClose}
          className="fixed inset-0 z-40 bg-slate-900/60 backdrop-blur-xs lg:hidden"
        />
      )}

      <aside
        className={`fixed top-0 bottom-0 left-0 z-50 w-64 bg-slate-900 text-slate-300 flex flex-col border-r border-slate-800 transition-transform duration-200 lg:translate-x-0 ${
          isOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        <div className="h-16 px-5 flex items-center justify-between border-b border-slate-800 bg-slate-950/60">
          <div className="flex items-center space-x-3">
            <div className="w-9 h-9 rounded-lg bg-indigo-600 flex items-center justify-center text-white font-bold shadow-md shadow-indigo-600/30">
              <GraduationCap className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-sm font-bold text-white tracking-tight leading-tight">Digital Campus</h2>
              <span className="text-[10px] text-indigo-400 font-semibold uppercase tracking-wider block">
                {user?.role === 'STUDENT' ? 'Student Portal' : user?.role === 'PARENT' ? 'Parent Portal' : 'Faculty Portal'}
              </span>
            </div>
          </div>
        </div>

        <div className="flex-1 overflow-y-auto px-3 py-4 space-y-1">
          {links.map((link) => (
            <NavLink
              key={link.path}
              to={link.path}
              onClick={onClose}
              className={({ isActive }) =>
                `flex items-center space-x-3 px-3 py-2.5 rounded-lg text-xs font-medium transition-all ${
                  isActive
                    ? 'bg-indigo-600 text-white font-semibold shadow-xs'
                    : 'text-slate-400 hover:text-white hover:bg-slate-800/80'
                }`
              }
            >
              <link.icon className="w-4 h-4 shrink-0" />
              <span>{link.name}</span>
            </NavLink>
          ))}
        </div>

        <div className="p-3 border-t border-slate-800 bg-slate-950/40">
          <div className="flex items-center space-x-2.5 px-2 py-2 mb-2 rounded-lg bg-slate-800/50">
            <div className="w-8 h-8 rounded-full bg-indigo-700 text-white font-bold text-xs flex items-center justify-center shrink-0">
              {user?.name?.[0] || 'U'}
            </div>
            <div className="truncate text-left">
              <p className="text-xs font-medium text-white truncate">{user?.name}</p>
              <p className="text-[10px] text-indigo-300 font-mono">{user?.loginId}</p>
            </div>
          </div>

          <button
            onClick={() => logout()}
            className="w-full flex items-center justify-center space-x-2 py-2 rounded-lg text-xs font-medium text-rose-400 hover:text-rose-300 hover:bg-rose-950/40 transition-colors"
          >
            <LogOut className="w-3.5 h-3.5" />
            <span>Sign Out</span>
          </button>
        </div>
      </aside>
    </>
  );
};
