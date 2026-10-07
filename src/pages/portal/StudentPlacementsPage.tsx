import React, { useEffect, useState } from 'react';
import { Briefcase, Building, MapPin, Calendar, Clock, CheckCircle2 } from 'lucide-react';
import { api } from '../../services/api.ts';
import { PlacementDrive } from '../../types/index.ts';

export const StudentPlacementsPage: React.FC = () => {
  const [drives, setDrives] = useState<PlacementDrive[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    api.getPlacements().then(res => {
      if (res.placements) setDrives(res.placements);
    }).catch(console.error).finally(() => setIsLoading(false));
  }, []);

  return (
    <div className="space-y-6 p-4 sm:p-6 lg:p-8">
      <div>
        <h1 className="text-xl sm:text-2xl font-extrabold text-slate-900 tracking-tight">
          Campus Recruitment Drives & Placements
        </h1>
        <p className="text-xs sm:text-sm text-slate-500 font-medium mt-0.5">
          Eligible on-campus recruitment opportunities, hiring schedules, and package details.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {isLoading ? (
          <div className="col-span-full py-12 text-center text-slate-400 text-xs">Loading drives...</div>
        ) : drives.length === 0 ? (
          <div className="col-span-full py-12 text-center text-slate-400 text-xs bg-white rounded-2xl border">
            No active placement drives.
          </div>
        ) : (
          drives.map((d) => (
            <div key={d.id} className="bg-white rounded-2xl border border-slate-200 p-6 flex flex-col justify-between shadow-xs space-y-4">
              <div className="space-y-3">
                <div className="flex items-center space-x-3">
                  <img src={d.logo || 'https://images.unsplash.com/photo-1542744094-24638eff58bb?auto=format&fit=crop&q=80&w=200'} alt={d.company} className="w-10 h-10 rounded-xl object-cover shrink-0 border" />
                  <div>
                    <h3 className="font-bold text-base text-slate-900">{d.company}</h3>
                    <p className="text-xs text-indigo-600 font-semibold">{d.jobTitle}</p>
                  </div>
                </div>

                <div className="p-2.5 rounded-xl bg-emerald-50 text-emerald-800 text-xs font-bold inline-block">
                  Package: {d.package}
                </div>

                <div className="text-xs text-slate-600 space-y-1 pt-1">
                  <p><strong>Location:</strong> {d.location}</p>
                  <p><strong>Drive Date:</strong> {d.driveDate}</p>
                  <p><strong>Deadline:</strong> {d.deadline}</p>
                  <p><strong>Eligibility:</strong> {d.coursesAllowed}</p>
                </div>
              </div>

              <div className="pt-3 border-t border-slate-100 flex items-center justify-between">
                <span className="text-[11px] font-semibold text-emerald-600 flex items-center gap-1">
                  <CheckCircle2 className="w-3.5 h-3.5" /> Eligible to Apply
                </span>
                <button
                  onClick={() => alert(`Your application profile has been registered for the ${d.company} recruitment drive!`)}
                  className="px-3 py-1.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-semibold text-xs transition-colors shadow-xs"
                >
                  Register for Drive
                </button>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};
