import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Building, BookOpen, Users, Calendar, ArrowRight, ShieldCheck } from 'lucide-react';
import { api } from '../../services/api.ts';
import { Department } from '../../types/index.ts';

export const DepartmentsPage: React.FC = () => {
  const [departments, setDepartments] = useState<Department[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    api.getDepartments()
      .then(res => {
        if (res.departments) setDepartments(res.departments);
      })
      .catch(console.error)
      .finally(() => setIsLoading(false));
  }, []);

  return (
    <div className="space-y-16 pb-20">
      <div className="bg-slate-900 text-white py-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto space-y-4">
          <span className="text-xs font-semibold text-indigo-400 uppercase tracking-wider">
            Academic Disciplines
          </span>
          <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight">
            Academic Departments
          </h1>
          <p className="text-base text-slate-300 max-w-2xl">
            Specialized faculties offering undergraduate and postgraduate education backed by experienced professors and cutting-edge laboratory facilities.
          </p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {isLoading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 animate-pulse">
            {[1, 2, 3, 4].map(n => (
              <div key={n} className="h-64 bg-slate-100 rounded-2xl" />
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {departments.map((dept) => (
              <div
                key={dept.id}
                className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-xs hover:shadow-md transition-all group flex flex-col"
              >
                <div className="h-56 relative overflow-hidden">
                  <img
                    src={dept.image || 'https://images.unsplash.com/photo-1517694712202-14dd9538aa97?auto=format&fit=crop&q=80&w=800'}
                    alt={dept.name}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                  <div className="absolute top-4 left-4 px-2.5 py-1 rounded-lg bg-slate-950/80 backdrop-blur-xs text-xs font-bold text-white">
                    Code: {dept.code}
                  </div>
                </div>

                <div className="p-6 flex-1 flex flex-col justify-between space-y-4">
                  <div className="space-y-2">
                    <h3 className="text-xl font-bold text-slate-900 group-hover:text-indigo-600 transition-colors">
                      {dept.name}
                    </h3>
                    <div className="flex items-center space-x-4 text-xs text-slate-500 font-medium">
                      <span>HOD: <strong className="text-slate-800">{dept.hod || 'Appointed Faculty'}</strong></span>
                      {dept.establishedYear && (
                        <span>Est: <strong className="text-slate-800">{dept.establishedYear}</strong></span>
                      )}
                    </div>
                    <p className="text-xs sm:text-sm text-slate-600 leading-relaxed pt-1">
                      {dept.description}
                    </p>
                  </div>

                  <div className="pt-4 border-t border-slate-100 flex items-center justify-between">
                    <Link
                      to="/courses"
                      className="inline-flex items-center space-x-1.5 text-xs font-semibold text-indigo-600 hover:text-indigo-700"
                    >
                      <span>View Affiliated Courses</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </Link>
                    <Link
                      to="/faculty"
                      className="text-xs font-medium text-slate-500 hover:text-slate-700"
                    >
                      Department Faculty →
                    </Link>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};
