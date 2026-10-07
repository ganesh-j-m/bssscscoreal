import React, { useEffect, useState } from 'react';
import { Briefcase, Building, MapPin, Calendar, Clock, Award, Users } from 'lucide-react';
import { api } from '../../services/api.ts';
import { PlacementDrive } from '../../types/index.ts';

export const PlacementsPage: React.FC = () => {
  const [drives, setDrives] = useState<PlacementDrive[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    api.getPlacements()
      .then(res => {
        if (res.placements) setDrives(res.placements);
      })
      .catch(console.error)
      .finally(() => setIsLoading(false));
  }, []);

  return (
    <div className="space-y-16 pb-20">
      <div className="bg-slate-900 text-white py-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto space-y-4">
          <span className="text-xs font-semibold text-indigo-400 uppercase tracking-wider">
            Training & Placement Cell
          </span>
          <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight">
            Campus Placements & Career Drives
          </h1>
          <p className="text-base text-slate-300 max-w-2xl">
            Empowering students with soft skills training, mock technical interviews, and placement tie-ups with leading Indian and global IT & financial corporations.
          </p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
        {/* Placement Metrics Strip */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="p-6 rounded-2xl bg-white border border-slate-200 text-center">
            <span className="text-2xl sm:text-3xl font-extrabold text-indigo-600">₹7.0 LPA</span>
            <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider mt-1">Highest Package</p>
          </div>
          <div className="p-6 rounded-2xl bg-white border border-slate-200 text-center">
            <span className="text-2xl sm:text-3xl font-extrabold text-indigo-600">₹3.8 LPA</span>
            <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider mt-1">Average Package</p>
          </div>
          <div className="p-6 rounded-2xl bg-white border border-slate-200 text-center">
            <span className="text-2xl sm:text-3xl font-extrabold text-indigo-600">30+</span>
            <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider mt-1">Recruiting Partners</p>
          </div>
          <div className="p-6 rounded-2xl bg-white border border-slate-200 text-center">
            <span className="text-2xl sm:text-3xl font-extrabold text-indigo-600">350+</span>
            <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider mt-1">Students Placed</p>
          </div>
        </div>

        {/* Drives List */}
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-bold text-slate-900">Active & Upcoming Recruitment Drives</h2>
            <span className="text-xs font-semibold text-slate-500">{drives.length} Drives Registered</span>
          </div>

          {isLoading ? (
            <div className="space-y-4 animate-pulse">
              {[1, 2, 3].map(n => <div key={n} className="h-32 bg-slate-100 rounded-2xl" />)}
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {drives.map((d) => (
                <div
                  key={d.id}
                  className="bg-white rounded-2xl border border-slate-200 p-6 flex flex-col justify-between shadow-xs hover:shadow-md transition-all space-y-4"
                >
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-3">
                        <img
                          src={d.logo || 'https://images.unsplash.com/photo-1542744094-24638eff58bb?auto=format&fit=crop&q=80&w=200'}
                          alt={d.company}
                          className="w-10 h-10 rounded-xl object-cover shrink-0 border border-slate-100"
                        />
                        <div>
                          <h3 className="font-bold text-sm sm:text-base text-slate-900 leading-tight">{d.company}</h3>
                          <span className="text-[11px] text-slate-500">{d.location}</span>
                        </div>
                      </div>
                      <span className="text-xs font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-md">
                        {d.package}
                      </span>
                    </div>

                    <div className="pt-2 border-t border-slate-100 space-y-1.5 text-xs text-slate-600">
                      <p><strong className="text-slate-800">Role:</strong> {d.jobTitle}</p>
                      <p><strong className="text-slate-800">Drive Date:</strong> {d.driveDate}</p>
                      <p><strong className="text-slate-800">Deadline:</strong> {d.deadline}</p>
                      <p><strong className="text-slate-800">Eligible:</strong> {d.coursesAllowed}</p>
                    </div>

                    <p className="text-xs text-slate-500 line-clamp-2 pt-1">{d.description}</p>
                  </div>

                  <div className="pt-3 border-t border-slate-100 flex items-center justify-between text-xs">
                    <span className="text-[11px] font-semibold text-indigo-600 bg-indigo-50 px-2 py-0.5 rounded">
                      Status: {d.status}
                    </span>
                    <span className="text-slate-400">Apply via Student Portal</span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
