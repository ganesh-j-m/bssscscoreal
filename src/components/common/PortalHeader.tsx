import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Menu, Globe, ChevronRight, Bell, Sparkles } from 'lucide-react';
import { useAuth } from '../../context/AuthContext.tsx';

interface PortalHeaderProps {
  onToggleSidebar: () => void;
}

export const PortalHeader: React.FC<PortalHeaderProps> = ({ onToggleSidebar }) => {
  const { user } = useAuth();
  const location = useLocation();

  const getBreadcrumbTitle = () => {
    const path = location.pathname.split('/').filter(Boolean);
    if (path.length <= 1) return 'Dashboard';
    const sub = path[1];
    return sub
      .split('-')
      .map(word => word.charAt(0).toUpperCase() + word.slice(1))
      .join(' ');
  };

  return (
    <header className="sticky top-0 z-30 h-16 bg-white border-b border-slate-200 px-4 sm:px-6 flex items-center justify-between">
      <div className="flex items-center space-x-3">
        <button
          onClick={onToggleSidebar}
          className="p-2 rounded-lg text-slate-600 hover:bg-slate-100 lg:hidden focus:outline-hidden"
          aria-label="Open sidebar"
        >
          <Menu className="w-5 h-5" />
        </button>

        <div className="flex items-center space-x-2 text-xs sm:text-sm">
          <Link to="/portal/dashboard" className="text-slate-500 hover:text-indigo-600 font-medium">
            Campus Portal
          </Link>
          <ChevronRight className="w-3.5 h-3.5 text-slate-400" />
          <span className="text-slate-900 font-semibold">{getBreadcrumbTitle()}</span>
        </div>
      </div>

      <div className="flex items-center space-x-3">
        <Link
          to="/"
          target="_blank"
          className="hidden sm:inline-flex items-center space-x-1.5 px-3 py-1.5 rounded-lg border border-slate-200 text-xs font-medium text-slate-700 hover:bg-slate-50 hover:text-indigo-600 transition-colors"
        >
          <Globe className="w-3.5 h-3.5 text-slate-500" />
          <span>College Website</span>
        </Link>

        {user?.studentDetails && (
          <div className="hidden md:flex items-center space-x-1.5 px-2.5 py-1 rounded-full bg-indigo-50 text-indigo-700 text-[11px] font-semibold border border-indigo-200">
            <Sparkles className="w-3 h-3 text-indigo-600" />
            <span>{user.studentDetails.course} • {user.studentDetails.year} Div {user.studentDetails.division}</span>
          </div>
        )}

        <div className="flex items-center space-x-2 pl-2">
          <div className="w-8 h-8 rounded-full bg-indigo-600 text-white font-semibold text-xs flex items-center justify-center">
            {user?.name?.[0] || 'S'}
          </div>
          <div className="hidden sm:block text-right">
            <span className="text-xs font-bold text-slate-900 block leading-tight">{user?.name}</span>
            <span className="text-[10px] text-slate-500 font-mono">{user?.loginId}</span>
          </div>
        </div>
      </div>
    </header>
  );
};
