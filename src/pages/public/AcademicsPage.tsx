import React from 'react';
import { Link } from 'react-router-dom';
import { BookOpen, Layers, Award, CheckCircle, Calendar, GraduationCap, ArrowRight } from 'lucide-react';

export const AcademicsPage: React.FC = () => {
  return (
    <div className="space-y-16 pb-20">
      <div className="bg-slate-900 text-white py-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto space-y-4">
          <span className="text-xs font-semibold text-indigo-400 uppercase tracking-wider">
            Teaching & Learning Framework
          </span>
          <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight">
            Academic Programs & Curriculum
          </h1>
          <p className="text-base text-slate-300 max-w-2xl">
            Outcome-based education following Choice Based Credit System (CBCS), rigorous laboratory practicals, and industry internship programs.
          </p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
        {/* Academic Highlights */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="p-6 rounded-2xl bg-white border border-slate-200/80 shadow-xs space-y-3">
            <div className="w-10 h-10 rounded-xl bg-indigo-50 text-indigo-600 flex items-center justify-center">
              <Layers className="w-5 h-5" />
            </div>
            <h3 className="font-bold text-base text-slate-900">CBCS Semester System</h3>
            <p className="text-xs text-slate-600 leading-relaxed">
              Programs structured under the Choice Based Credit System allowing interdisciplinary electives, skill enhancement courses, and continuous assessment.
            </p>
          </div>

          <div className="p-6 rounded-2xl bg-white border border-slate-200/80 shadow-xs space-y-3">
            <div className="w-10 h-10 rounded-xl bg-indigo-50 text-indigo-600 flex items-center justify-center">
              <BookOpen className="w-5 h-5" />
            </div>
            <h3 className="font-bold text-base text-slate-900">Laboratory Driven Learning</h3>
            <p className="text-xs text-slate-600 leading-relaxed">
              Every theoretical concept in computing, electronics, and natural sciences is augmented by dedicated weekly laboratory hours in smart computer centers.
            </p>
          </div>

          <div className="p-6 rounded-2xl bg-white border border-slate-200/80 shadow-xs space-y-3">
            <div className="w-10 h-10 rounded-xl bg-indigo-50 text-indigo-600 flex items-center justify-center">
              <Award className="w-5 h-5" />
            </div>
            <h3 className="font-bold text-base text-slate-900">Digital Smart Campus</h3>
            <p className="text-xs text-slate-600 leading-relaxed">
              Students and parents track daily lecture attendance via QR sessions, submit assignments digitally, view examination schedules, and access e-library resources.
            </p>
          </div>
        </div>

        {/* Quick Program Navigation Card */}
        <div className="p-8 rounded-2xl bg-indigo-50/50 border border-indigo-100 flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="space-y-1">
            <h3 className="text-lg font-bold text-slate-900">Explore Undergraduate & Postgraduate Degrees</h3>
            <p className="text-xs text-slate-600">Review eligibility requirements, annual fee structure, and syllabi for all available programs.</p>
          </div>
          <div className="flex items-center gap-3">
            <Link
              to="/courses"
              className="inline-flex items-center space-x-2 px-5 py-2.5 rounded-xl bg-indigo-600 text-white font-medium text-xs hover:bg-indigo-700 transition-colors shadow-sm"
            >
              <span>View All Courses</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
            <Link
              to="/departments"
              className="inline-flex items-center space-x-2 px-5 py-2.5 rounded-xl bg-white text-slate-700 border border-slate-200 font-medium text-xs hover:bg-slate-50 transition-colors"
            >
              <span>Explore Departments</span>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};
