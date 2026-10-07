import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { BookOpen, Clock, Users, ArrowRight, CheckCircle2, IndianRupee } from 'lucide-react';
import { api } from '../../services/api.ts';
import { Course } from '../../types/index.ts';

export const CoursesPage: React.FC = () => {
  const [courses, setCourses] = useState<Course[]>([]);
  const [filterType, setFilterType] = useState<string>('ALL');
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    api.getCourses()
      .then(res => {
        if (res.courses) setCourses(res.courses);
      })
      .catch(console.error)
      .finally(() => setIsLoading(false));
  }, []);

  const filtered = filterType === 'ALL' ? courses : courses.filter(c => c.degreeType === filterType);

  return (
    <div className="space-y-16 pb-20">
      <div className="bg-slate-900 text-white py-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto space-y-4">
          <span className="text-xs font-semibold text-indigo-400 uppercase tracking-wider">
            Programs Offered
          </span>
          <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight">
            Academic Courses & Degrees
          </h1>
          <p className="text-base text-slate-300 max-w-2xl">
            Undergraduate and Postgraduate degree programs affiliated to Dr. Babasaheb Ambedkar Marathwada University.
          </p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        {/* Filter Pills */}
        <div className="flex items-center space-x-2">
          {['ALL', 'UG', 'PG'].map((t) => (
            <button
              key={t}
              onClick={() => setFilterType(t)}
              className={`px-4 py-2 rounded-xl text-xs font-semibold transition-all ${
                filterType === t
                  ? 'bg-indigo-600 text-white shadow-xs'
                  : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
              }`}
            >
              {t === 'ALL' ? 'All Degree Programs' : t === 'UG' ? 'Undergraduate (UG)' : 'Postgraduate (PG)'}
            </button>
          ))}
        </div>

        {/* Courses Grid */}
        {isLoading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 animate-pulse">
            {[1, 2, 3].map(n => <div key={n} className="h-64 bg-slate-100 rounded-2xl" />)}
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filtered.map((crs) => (
              <div
                key={crs.id}
                className="bg-white rounded-2xl border border-slate-200 p-6 flex flex-col justify-between shadow-xs hover:shadow-md transition-all space-y-4"
              >
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-[11px] font-bold px-2 py-0.5 rounded-md bg-indigo-50 text-indigo-700">
                      {crs.code}
                    </span>
                    <span className="text-xs font-semibold text-slate-400">{crs.degreeType} Program</span>
                  </div>

                  <h3 className="text-lg font-bold text-slate-900 leading-snug">{crs.name}</h3>
                  <p className="text-xs text-indigo-600 font-medium">{crs.department}</p>

                  <div className="space-y-1.5 text-xs text-slate-500 pt-2 border-t border-slate-100">
                    <div className="flex items-center justify-between">
                      <span className="flex items-center gap-1.5"><Clock className="w-3.5 h-3.5 text-slate-400" /> Duration</span>
                      <strong className="text-slate-800">{crs.duration}</strong>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="flex items-center gap-1.5"><Users className="w-3.5 h-3.5 text-slate-400" /> Intake Capacity</span>
                      <strong className="text-slate-800">{crs.intake} Seats</strong>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="flex items-center gap-1.5"><IndianRupee className="w-3.5 h-3.5 text-slate-400" /> Tuition Fee</span>
                      <strong className="text-slate-800">₹{crs.feePerYear.toLocaleString('en-IN')} / year</strong>
                    </div>
                  </div>

                  {crs.eligibility && (
                    <div className="pt-2 text-xs text-slate-600">
                      <span className="font-semibold text-slate-700 block">Eligibility:</span>
                      <p className="mt-0.5 text-slate-500 leading-relaxed">{crs.eligibility}</p>
                    </div>
                  )}
                </div>

                <div className="pt-4 border-t border-slate-100 flex items-center justify-between">
                  <Link
                    to="/admissions"
                    className="inline-flex items-center space-x-1.5 text-xs font-semibold text-indigo-600 hover:text-indigo-700"
                  >
                    <span>Apply for Admission</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </Link>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};
