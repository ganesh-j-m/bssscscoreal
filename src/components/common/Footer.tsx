import React from 'react';
import { Link } from 'react-router-dom';
import {
  GraduationCap,
  MapPin,
  Phone,
  Mail,
  Clock,
  ArrowRight,
  ShieldCheck,
  ExternalLink,
  BookOpen
} from 'lucide-react';

export const Footer: React.FC = () => {
  return (
    <footer className="bg-slate-900 text-slate-300 border-t border-slate-800">
      {/* Top CTA Strip */}
      <div className="border-b border-slate-800 bg-slate-950/40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-10 flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="text-center md:text-left">
            <span className="text-indigo-400 font-semibold text-xs tracking-wider uppercase block">
              Admissions Open for Academic Year 2025-26
            </span>
            <h3 className="text-xl sm:text-2xl font-bold text-white mt-1">
              Shape Your Career at Sharadabai Pawar College, Omerga
            </h3>
            <p className="text-sm text-slate-400 mt-1 max-w-xl">
              Offering undergraduate and postgraduate programs in Computer Science, IT, Commerce, Sciences, and Arts.
            </p>
          </div>
          <div className="flex flex-wrap items-center gap-3">
            <Link
              to="/admissions"
              className="inline-flex items-center space-x-2 px-5 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-medium text-sm transition-all shadow-md"
            >
              <span>Apply Online</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
            <Link
              to="/contact"
              className="inline-flex items-center space-x-2 px-5 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 font-medium text-sm transition-all"
            >
              <span>Campus Visit</span>
            </Link>
          </div>
        </div>
      </div>

      {/* Main Footer Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-14">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10">
          {/* Col 1: Brand & Accreditation */}
          <div className="space-y-4">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 rounded-xl bg-indigo-600 text-white flex items-center justify-center">
                <GraduationCap className="w-6 h-6" />
              </div>
              <div>
                <h4 className="text-white font-bold text-base leading-tight">Sharadabai Pawar College</h4>
                <p className="text-xs text-indigo-400 font-medium">Omerga, Dist. Dharashiv</p>
              </div>
            </div>
            <p className="text-sm text-slate-400 leading-relaxed">
              Established in 1990 under Shri Chhatrapati Shivaji Shikshan Sanstha. Dedicated to empowering students with high academic standards, state-of-the-art laboratories, and ethical leadership.
            </p>
            <div className="pt-2 flex items-center gap-2 text-xs text-emerald-400 font-medium">
              <ShieldCheck className="w-4 h-4" />
              <span>NAAC Re-Accredited Grade 'A' | AISHE Affiliated</span>
            </div>
          </div>

          {/* Col 2: Quick Links */}
          <div>
            <h4 className="text-white font-semibold text-sm tracking-wide uppercase mb-4">
              Quick Links
            </h4>
            <ul className="space-y-2.5 text-sm text-slate-400">
              <li>
                <Link to="/about" className="hover:text-indigo-400 transition-colors flex items-center gap-1.5">
                  <span className="text-slate-600">›</span> About Institution
                </Link>
              </li>
              <li>
                <Link to="/principal-message" className="hover:text-indigo-400 transition-colors flex items-center gap-1.5">
                  <span className="text-slate-600">›</span> Principal's Desk
                </Link>
              </li>
              <li>
                <Link to="/courses" className="hover:text-indigo-400 transition-colors flex items-center gap-1.5">
                  <span className="text-slate-600">›</span> Programs & Courses
                </Link>
              </li>
              <li>
                <Link to="/faculty" className="hover:text-indigo-400 transition-colors flex items-center gap-1.5">
                  <span className="text-slate-600">›</span> Faculty Directory
                </Link>
              </li>
              <li>
                <Link to="/placements" className="hover:text-indigo-400 transition-colors flex items-center gap-1.5">
                  <span className="text-slate-600">›</span> Training & Placement Cell
                </Link>
              </li>
              <li>
                <Link to="/notices" className="hover:text-indigo-400 transition-colors flex items-center gap-1.5">
                  <span className="text-slate-600">›</span> Examination Notices
                </Link>
              </li>
            </ul>
          </div>

          {/* Col 3: Academic Programs */}
          <div>
            <h4 className="text-white font-semibold text-sm tracking-wide uppercase mb-4">
              Departments & Programs
            </h4>
            <ul className="space-y-2.5 text-sm text-slate-400">
              <li>
                <Link to="/courses" className="hover:text-indigo-400 transition-colors">
                  B.Sc. Computer Science (3 Years)
                </Link>
              </li>
              <li>
                <Link to="/courses" className="hover:text-indigo-400 transition-colors">
                  Bachelor of Computer Applications (BCA)
                </Link>
              </li>
              <li>
                <Link to="/courses" className="hover:text-indigo-400 transition-colors">
                  Bachelor of Commerce (B.Com)
                </Link>
              </li>
              <li>
                <Link to="/courses" className="hover:text-indigo-400 transition-colors">
                  B.Sc. General Science (PCB / PCM)
                </Link>
              </li>
              <li>
                <Link to="/courses" className="hover:text-indigo-400 transition-colors">
                  Bachelor of Arts (B.A.)
                </Link>
              </li>
              <li>
                <Link to="/courses" className="hover:text-indigo-400 transition-colors">
                  M.Sc. Computer Science (PG)
                </Link>
              </li>
            </ul>
          </div>

          {/* Col 4: Campus Contact */}
          <div className="space-y-3.5 text-sm">
            <h4 className="text-white font-semibold text-sm tracking-wide uppercase mb-4">
              Campus Contact
            </h4>
            <div className="flex items-start space-x-3 text-slate-400">
              <MapPin className="w-5 h-5 text-indigo-400 shrink-0 mt-0.5" />
              <span>National Highway 65, Omerga, Dist. Dharashiv - 413606, Maharashtra</span>
            </div>
            <div className="flex items-center space-x-3 text-slate-400">
              <Phone className="w-4 h-4 text-indigo-400 shrink-0" />
              <span>+91 (02475) 252244 / +91 94220 55667</span>
            </div>
            <div className="flex items-center space-x-3 text-slate-400">
              <Mail className="w-4 h-4 text-indigo-400 shrink-0" />
              <span>contact@sharadacollege.edu.in</span>
            </div>
            <div className="flex items-center space-x-3 text-slate-400">
              <Clock className="w-4 h-4 text-indigo-400 shrink-0" />
              <span>Mon - Sat: 09:30 AM - 05:30 PM</span>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="mt-12 pt-8 border-t border-slate-800 text-xs text-slate-500 flex flex-col sm:flex-row items-center justify-between gap-4">
          <p>© {new Date().getFullYear()} Sharadabai Pawar College, Omerga. All rights reserved.</p>
          <div className="flex items-center space-x-6">
            <Link to="/login" className="hover:text-slate-300">Staff & Student ERP Portal</Link>
            <span>•</span>
            <Link to="/contact" className="hover:text-slate-300">Grievance Desk</Link>
            <span>•</span>
            <Link to="/about" className="hover:text-slate-300">Privacy Policy</Link>
          </div>
        </div>
      </div>
    </footer>
  );
};
