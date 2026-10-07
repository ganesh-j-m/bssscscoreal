import React from 'react';
import { NavLink } from 'react-router-dom';
import {
  LayoutDashboard,
  Users,
  GraduationCap,
  UserCheck,
  UserPlus,
  BookOpen,
  Layers,
  FileText,
  Calendar,
  CheckCircle2,
  QrCode,
  FileSpreadsheet,
  Award,
  CreditCard,
  FileBadge,
  AlertCircle,
  Library,
  Briefcase,
  Building,
  Trophy,
  Globe,
  Bell,
  CalendarCheck,
  Image,
  UserSquare2,
  PhoneCall,
  ShieldAlert,
  Settings,
  LogOut,
  ChevronRight
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext.tsx';

interface SidebarProps {
  isOpen: boolean;
  onClose?: () => void;
}

export const AdminSidebar: React.FC<SidebarProps> = ({ isOpen, onClose }) => {
  const { user, logout } = useAuth();

  const sections = [
    {
      title: 'MAIN',
      items: [
        { name: 'Dashboard', path: '/admin/dashboard', icon: LayoutDashboard },
      ],
    },
    {
      title: 'PEOPLE',
      items: [
        { name: 'Users & Roles', path: '/admin/users', icon: Users },
        { name: 'Students', path: '/admin/students', icon: GraduationCap },
        { name: 'Faculty Directory', path: '/admin/faculty', icon: UserCheck },
        { name: 'Parents', path: '/admin/parents', icon: UserPlus },
      ],
    },
    {
      title: 'ACADEMICS',
      items: [
        { name: 'Departments', path: '/admin/departments', icon: Building },
        { name: 'Courses', path: '/admin/courses', icon: Layers },
        { name: 'Subjects', path: '/admin/subjects', icon: BookOpen },
        { name: 'Timetable', path: '/admin/timetable', icon: Calendar },
        { name: 'Attendance Register', path: '/admin/attendance', icon: CheckCircle2 },
        { name: 'Smart QR Attendance', path: '/admin/qr-attendance', icon: QrCode },
        { name: 'Examinations', path: '/admin/examinations', icon: FileText },
        { name: 'Results & Grades', path: '/admin/results', icon: Award },
      ],
    },
    {
      title: 'ADMINISTRATION',
      items: [
        { name: 'Admissions Desk', path: '/admin/admissions', icon: FileSpreadsheet },
        { name: 'Fee Records', path: '/admin/fees', icon: CreditCard },
        { name: 'Certificates (LC/Bonafide)', path: '/admin/certificates', icon: FileBadge },
        { name: 'Grievance Redressal', path: '/admin/grievances', icon: AlertCircle },
      ],
    },
    {
      title: 'CAMPUS',
      items: [
        { name: 'Central Library', path: '/admin/library', icon: Library },
        { name: 'Placement Cell', path: '/admin/placements', icon: Briefcase },
        { name: 'Facilities CMS', path: '/admin/facilities', icon: Building },
        { name: 'Achievements', path: '/admin/achievements', icon: Trophy },
      ],
    },
    {
      title: 'WEBSITE CMS',
      items: [
        { name: 'Homepage Content', path: '/admin/campus-content', icon: Globe },
        { name: 'Notice Board', path: '/admin/notices', icon: Bell },
        { name: 'Events Manager', path: '/admin/events', icon: CalendarCheck },
        { name: 'Photo Gallery', path: '/admin/gallery', icon: Image },
        { name: 'Principal Profile', path: '/admin/principal-profile', icon: UserSquare2 },
        { name: 'Contact Info', path: '/admin/contact', icon: PhoneCall },
      ],
    },
    {
      title: 'SECURITY & SYSTEM',
      items: [
        { name: 'Audit Trail', path: '/admin/audit-logs', icon: ShieldAlert },
        { name: 'System Settings', path: '/admin/settings', icon: Settings },
      ],
    },
  ];

  return (
    <>
      {/* Mobile Backdrop */}
      {isOpen && (
        <div
          onClick={onClose}
          className="fixed inset-0 z-40 bg-slate-900/60 backdrop-blur-xs lg:hidden"
        />
      )}

      {/* Sidebar Panel */}
      <aside
        className={`fixed top-0 bottom-0 left-0 z-50 w-64 bg-slate-900 text-slate-300 flex flex-col border-r border-slate-800 transition-transform duration-200 lg:translate-x-0 ${
          isOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        {/* Brand */}
        <div className="h-16 px-5 flex items-center justify-between border-b border-slate-800 bg-slate-950/60">
          <div className="flex items-center space-x-3">
            <div className="w-9 h-9 rounded-lg bg-indigo-600 flex items-center justify-center text-white font-bold shadow-md shadow-indigo-600/30">
              <GraduationCap className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-sm font-bold text-white tracking-tight leading-tight">SCSCO ERP</h2>
              <span className="text-[10px] text-indigo-400 font-semibold uppercase tracking-wider block">
                Super Admin Desk
              </span>
            </div>
          </div>
        </div>

        {/* Scrollable Navigation Menu */}
        <div className="flex-1 overflow-y-auto px-3 py-4 space-y-6">
          {sections.map((section) => (
            <div key={section.title}>
              <h3 className="px-3 text-[11px] font-semibold text-slate-500 tracking-wider uppercase mb-2">
                {section.title}
              </h3>
              <div className="space-y-1">
                {section.items.map((item) => (
                  <NavLink
                    key={item.path}
                    to={item.path}
                    onClick={onClose}
                    className={({ isActive }) =>
                      `flex items-center justify-between px-3 py-2 rounded-lg text-xs font-medium transition-all ${
                        isActive
                          ? 'bg-indigo-600 text-white shadow-xs font-semibold'
                          : 'text-slate-400 hover:text-white hover:bg-slate-800/80'
                      }`
                    }
                  >
                    <div className="flex items-center space-x-2.5">
                      <item.icon className="w-4 h-4 shrink-0" />
                      <span>{item.name}</span>
                    </div>
                  </NavLink>
                ))}
              </div>
            </div>
          ))}
        </div>

        {/* User Card & Logout */}
        <div className="p-3 border-t border-slate-800 bg-slate-950/40">
          <div className="flex items-center justify-between px-2 py-2 mb-2 rounded-lg bg-slate-800/50">
            <div className="flex items-center space-x-2.5 overflow-hidden">
              <div className="w-8 h-8 rounded-full bg-indigo-700 text-white font-bold text-xs flex items-center justify-center shrink-0">
                {user?.name?.[0] || 'A'}
              </div>
              <div className="truncate text-left">
                <p className="text-xs font-medium text-white truncate">{user?.name || 'Admin'}</p>
                <p className="text-[10px] text-indigo-300 font-mono">{user?.loginId || 'ADMIN001'}</p>
              </div>
            </div>
            <span className="text-[10px] px-1.5 py-0.5 rounded bg-indigo-900/60 text-indigo-300 font-medium">
              {user?.role === 'SUPER_ADMIN' ? 'Root' : user?.role}
            </span>
          </div>

          <button
            onClick={() => logout()}
            className="w-full flex items-center justify-center space-x-2 py-2 rounded-lg text-xs font-medium text-rose-400 hover:text-rose-300 hover:bg-rose-950/40 transition-colors"
          >
            <LogOut className="w-3.5 h-3.5" />
            <span>Sign Out ERP</span>
          </button>
        </div>
      </aside>
    </>
  );
};
