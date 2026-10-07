import React, { useEffect, useState } from 'react';
import { Mail, Phone, Award, BookOpen, Search, UserCheck } from 'lucide-react';
import { api } from '../../services/api.ts';
import { Faculty } from '../../types/index.ts';

export const FacultyPage: React.FC = () => {
  const [facultyList, setFacultyList] = useState<Faculty[]>([]);
  const [search, setSearch] = useState('');
  const [selectedDept, setSelectedDept] = useState('ALL');
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    api.getFaculty()
      .then(res => {
        if (res.faculty) setFacultyList(res.faculty);
      })
      .catch(console.error)
      .finally(() => setIsLoading(false));
  }, []);

  const departments = ['ALL', ...Array.from(new Set(facultyList.map(f => f.department)))];

  const filtered = facultyList.filter(f => {
    const matchesDept = selectedDept === 'ALL' || f.department === selectedDept;
    const matchesSearch = !search ||
      f.name.toLowerCase().includes(search.toLowerCase()) ||
      f.designation.toLowerCase().includes(search.toLowerCase()) ||
      f.department.toLowerCase().includes(search.toLowerCase()) ||
      f.specialization?.toLowerCase().includes(search.toLowerCase());
    return matchesDept && matchesSearch;
  });

  return (
    <div className="space-y-16 pb-20">
      <div className="bg-slate-900 text-white py-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto space-y-4">
          <span className="text-xs font-semibold text-indigo-400 uppercase tracking-wider">
            Academic Mentorship
          </span>
          <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight">
            Faculty Directory
          </h1>
          <p className="text-base text-slate-300 max-w-2xl">
            Meet our esteemed professors, researchers, and department heads dedicated to excellence in teaching and student mentorship.
          </p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        {/* Search & Department Filters */}
        <div className="flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="relative w-full md:w-80">
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Search faculty by name, subject..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-200 text-xs text-slate-800 placeholder-slate-400 focus:outline-hidden focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-600 bg-white"
            />
          </div>

          <div className="flex items-center space-x-2 overflow-x-auto w-full md:w-auto pb-2 md:pb-0">
            {departments.map((dept) => (
              <button
                key={dept}
                onClick={() => setSelectedDept(dept)}
                className={`px-3.5 py-2 rounded-xl text-xs font-semibold whitespace-nowrap transition-all ${
                  selectedDept === dept
                    ? 'bg-indigo-600 text-white shadow-xs'
                    : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                }`}
              >
                {dept === 'ALL' ? 'All Departments' : dept}
              </button>
            ))}
          </div>
        </div>

        {/* Faculty Grid */}
        {isLoading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 animate-pulse">
            {[1, 2, 3].map(n => <div key={n} className="h-64 bg-slate-100 rounded-2xl" />)}
          </div>
        ) : filtered.length === 0 ? (
          <div className="text-center py-16 bg-white rounded-2xl border border-slate-200">
            <UserCheck className="w-10 h-10 text-slate-300 mx-auto mb-3" />
            <h3 className="text-sm font-semibold text-slate-700">No faculty members found</h3>
            <p className="text-xs text-slate-400 mt-1">Try adjusting your search criteria or department filter.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {filtered.map((fac) => (
              <div
                key={fac.id}
                className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-xs hover:shadow-md transition-all p-6 flex flex-col justify-between space-y-4"
              >
                <div className="space-y-4">
                  <div className="flex items-start space-x-4">
                    <img
                      src={fac.photo || 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=400'}
                      alt={fac.name}
                      className="w-16 h-16 rounded-2xl object-cover shrink-0 shadow-xs border border-slate-100"
                    />
                    <div>
                      <h3 className="font-bold text-base text-slate-900 leading-snug">{fac.name}</h3>
                      <p className="text-xs font-semibold text-indigo-600 mt-0.5">{fac.designation}</p>
                      <p className="text-[11px] text-slate-500 font-medium">{fac.department}</p>
                    </div>
                  </div>

                  <div className="space-y-2 text-xs text-slate-600 pt-3 border-t border-slate-100">
                    {fac.qualification && (
                      <div>
                        <span className="font-semibold text-slate-700">Qualification: </span>
                        <span>{fac.qualification}</span>
                      </div>
                    )}
                    {fac.specialization && (
                      <div>
                        <span className="font-semibold text-slate-700">Specialization: </span>
                        <span>{fac.specialization}</span>
                      </div>
                    )}
                    {fac.experience && (
                      <div>
                        <span className="font-semibold text-slate-700">Experience: </span>
                        <span>{fac.experience}</span>
                      </div>
                    )}
                  </div>
                </div>

                <div className="pt-3 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500">
                  <span className="truncate">{fac.email}</span>
                  {fac.phone && <span className="shrink-0">{fac.phone}</span>}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};
