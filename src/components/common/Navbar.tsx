import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import {
  GraduationCap,
  Menu,
  X,
  LogIn,
  ChevronDown,
  Building2,
  PhoneCall,
  Calendar,
  BookOpen,
  Award,
  Sparkles,
  UserCheck
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext.tsx';

export const Navbar: React.FC = () => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const location = useLocation();
  const { user } = useAuth();

  const isActive = (path: string) => {
    return location.pathname === path;
  };

  const navLinks = [
    { name: 'Home', path: '/' },
    { name: 'About', path: '/about' },
    { name: 'Principal Desk', path: '/principal-message' },
    { name: 'Academics', path: '/academics' },
    { name: 'Departments', path: '/departments' },
    { name: 'Courses', path: '/courses' },
    { name: 'Faculty', path: '/faculty' },
    { name: 'Admissions', path: '/admissions' },
    { name: 'Campus Life', path: '/campus-life' },
    { name: 'Facilities', path: '/facilities' },
    { name: 'Events', path: '/events' },
    { name: 'Gallery', path: '/gallery' },
    { name: 'Placements', path: '/placements' },
    { name: 'Notices', path: '/notices' },
    { name: 'Contact', path: '/contact' },
  ];

  return (
    <header className="sticky top-0 z-50 bg-white/95 backdrop-blur-md border-b border-slate-200/80 shadow-xs">
      {/* Top Banner with Quick Credentials & Affiliation */}
      <div className="bg-slate-900 text-slate-300 text-xs py-1.5 px-4 hidden md:block border-b border-slate-800">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center space-x-6">
            <span className="flex items-center gap-1.5 text-slate-200 font-medium">
              <Building2 className="w-3.5 h-3.5 text-indigo-400" />
              Shri Chhatrapati Shivaji Shikshan Sanstha
            </span>
            <span className="text-slate-400">|</span>
            <span className="text-slate-300">NAAC Re-Accredited 'A' Grade</span>
            <span className="text-slate-400">|</span>
            <span className="text-emerald-400 font-medium flex items-center gap-1">
              <Sparkles className="w-3 h-3" /> Admissions Open 2025-26
            </span>
          </div>
          <div className="flex items-center space-x-4">
            <span className="text-slate-400 flex items-center gap-1">
              <PhoneCall className="w-3 h-3 text-indigo-400" /> +91 (02475) 252244
            </span>
            <span className="text-slate-600">•</span>
            <Link to="/contact" className="hover:text-white transition-colors">Campus Map</Link>
          </div>
        </div>
      </div>

      {/* Main Brand & Navigation */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          {/* Logo & College Identity */}
          <Link to="/" className="flex items-center space-x-3.5 group">
            <div className="w-12 h-12 rounded-xl bg-gradient-to-tr from-indigo-700 to-indigo-600 text-white flex items-center justify-center shadow-md shadow-indigo-600/20 group-hover:scale-105 transition-transform duration-200">
              <GraduationCap className="w-7 h-7 text-white" />
            </div>
            <div>
              <span className="text-xs font-semibold tracking-wider uppercase text-indigo-700 block">
                SCSCO Digital Campus
              </span>
              <h1 className="text-lg sm:text-xl font-bold tracking-tight text-slate-900 leading-tight">
                Sharadabai Pawar College
              </h1>
              <p className="text-xs text-slate-500 font-medium">Omerga, Dist. Dharashiv</p>
            </div>
          </Link>

          {/* Desktop Navigation Links */}
          <nav className="hidden xl:flex items-center space-x-1 font-medium text-sm text-slate-700">
            <Link
              to="/"
              className={`px-3 py-2 rounded-lg transition-colors ${
                isActive('/') ? 'text-indigo-600 font-semibold bg-indigo-50/70' : 'hover:text-indigo-600 hover:bg-slate-50'
              }`}
            >
              Home
            </Link>
            <Link
              to="/about"
              className={`px-3 py-2 rounded-lg transition-colors ${
                isActive('/about') ? 'text-indigo-600 font-semibold bg-indigo-50/70' : 'hover:text-indigo-600 hover:bg-slate-50'
              }`}
            >
              About
            </Link>
            <Link
              to="/academics"
              className={`px-3 py-2 rounded-lg transition-colors ${
                isActive('/academics') ? 'text-indigo-600 font-semibold bg-indigo-50/70' : 'hover:text-indigo-600 hover:bg-slate-50'
              }`}
            >
              Academics
            </Link>
            <Link
              to="/departments"
              className={`px-3 py-2 rounded-lg transition-colors ${
                isActive('/departments') ? 'text-indigo-600 font-semibold bg-indigo-50/70' : 'hover:text-indigo-600 hover:bg-slate-50'
              }`}
            >
              Departments
            </Link>
            <Link
              to="/courses"
              className={`px-3 py-2 rounded-lg transition-colors ${
                isActive('/courses') ? 'text-indigo-600 font-semibold bg-indigo-50/70' : 'hover:text-indigo-600 hover:bg-slate-50'
              }`}
            >
              Courses
            </Link>
            <Link
              to="/faculty"
              className={`px-3 py-2 rounded-lg transition-colors ${
                isActive('/faculty') ? 'text-indigo-600 font-semibold bg-indigo-50/70' : 'hover:text-indigo-600 hover:bg-slate-50'
              }`}
            >
              Faculty
            </Link>
            <Link
              to="/admissions"
              className={`px-3 py-2 rounded-lg transition-colors ${
                isActive('/admissions') ? 'text-indigo-600 font-semibold bg-indigo-50/70' : 'hover:text-indigo-600 hover:bg-slate-50'
              }`}
            >
              Admissions
            </Link>
            <Link
              to="/placements"
              className={`px-3 py-2 rounded-lg transition-colors ${
                isActive('/placements') ? 'text-indigo-600 font-semibold bg-indigo-50/70' : 'hover:text-indigo-600 hover:bg-slate-50'
              }`}
            >
              Placements
            </Link>
            <Link
              to="/facilities"
              className={`px-3 py-2 rounded-lg transition-colors ${
                isActive('/facilities') ? 'text-indigo-600 font-semibold bg-indigo-50/70' : 'hover:text-indigo-600 hover:bg-slate-50'
              }`}
            >
              Facilities
            </Link>
            <Link
              to="/notices"
              className={`px-3 py-2 rounded-lg transition-colors ${
                isActive('/notices') ? 'text-indigo-600 font-semibold bg-indigo-50/70' : 'hover:text-indigo-600 hover:bg-slate-50'
              }`}
            >
              Notices
            </Link>
          </nav>

          {/* Header Action CTAs */}
          <div className="flex items-center space-x-3">
            {user ? (
              <Link
                to={user.role === 'SUPER_ADMIN' || user.role === 'PRINCIPAL' ? '/admin/dashboard' : '/portal/dashboard'}
                className="inline-flex items-center space-x-2 px-4 py-2.5 rounded-xl bg-indigo-600 text-white font-medium text-sm shadow-sm hover:bg-indigo-700 hover:shadow-indigo-600/25 transition-all"
              >
                <UserCheck className="w-4 h-4" />
                <span>{user.role === 'SUPER_ADMIN' ? 'Admin Portal' : 'My Campus Portal'}</span>
              </Link>
            ) : (
              <Link
                to="/login"
                className="inline-flex items-center space-x-2 px-4 py-2.5 rounded-xl bg-slate-900 text-white font-medium text-sm hover:bg-indigo-600 shadow-sm transition-all"
              >
                <LogIn className="w-4 h-4" />
                <span>Portal Login</span>
              </Link>
            )}

            {/* Mobile menu button */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="xl:hidden p-2.5 rounded-xl text-slate-700 hover:bg-slate-100 hover:text-slate-900 focus:outline-hidden"
              aria-label="Toggle navigation menu"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu Dropdown */}
      {mobileMenuOpen && (
        <div className="xl:hidden border-t border-slate-200 bg-white px-4 pt-3 pb-6 shadow-xl max-h-[85vh] overflow-y-auto">
          <div className="grid grid-cols-2 gap-2 text-sm font-medium py-2">
            {navLinks.map((link) => (
              <Link
                key={link.path}
                to={link.path}
                onClick={() => setMobileMenuOpen(false)}
                className={`px-3 py-2.5 rounded-lg transition-colors ${
                  isActive(link.path)
                    ? 'bg-indigo-50 text-indigo-700 font-semibold'
                    : 'text-slate-700 hover:bg-slate-50 hover:text-indigo-600'
                }`}
              >
                {link.name}
              </Link>
            ))}
          </div>
          <div className="mt-4 pt-4 border-t border-slate-100 flex flex-col gap-2">
            <Link
              to={user ? (user.role === 'SUPER_ADMIN' ? '/admin/dashboard' : '/portal/dashboard') : '/login'}
              onClick={() => setMobileMenuOpen(false)}
              className="w-full text-center py-3 rounded-xl bg-indigo-600 text-white font-semibold text-sm shadow-sm"
            >
              {user ? 'Open Digital Campus Dashboard' : 'Login to Campus ERP'}
            </Link>
          </div>
        </div>
      )}
    </header>
  );
};
