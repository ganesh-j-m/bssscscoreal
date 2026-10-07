import React, { useEffect, useState } from 'react';
import { Building, CheckCircle2 } from 'lucide-react';
import { api } from '../../services/api.ts';
import { FacilityItem } from '../../types/index.ts';

export const FacilitiesPage: React.FC = () => {
  const [facilities, setFacilities] = useState<FacilityItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    api.getFacilities()
      .then(res => {
        if (res.facilities) setFacilities(res.facilities);
      })
      .catch(console.error)
      .finally(() => setIsLoading(false));
  }, []);

  return (
    <div className="space-y-16 pb-20">
      <div className="bg-slate-900 text-white py-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto space-y-4">
          <span className="text-xs font-semibold text-indigo-400 uppercase tracking-wider">
            Campus Infrastructure
          </span>
          <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight">
            Facilities & Infrastructure
          </h1>
          <p className="text-base text-slate-300 max-w-2xl">
            Modern educational facilities engineered to foster research, practical software skills, competitive sports, and silent study.
          </p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {isLoading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 animate-pulse">
            {[1, 2, 3, 4].map(n => <div key={n} className="h-72 bg-slate-100 rounded-2xl" />)}
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {facilities.map((fac) => (
              <div
                key={fac.id}
                className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-xs hover:shadow-md transition-all group flex flex-col justify-between"
              >
                <div>
                  <div className="h-60 overflow-hidden relative">
                    <img
                      src={fac.imageUrl}
                      alt={fac.name}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                    <div className="absolute top-4 left-4 px-2.5 py-1 rounded-md bg-slate-950/80 backdrop-blur-xs text-[11px] font-semibold text-white">
                      {fac.category}
                    </div>
                  </div>
                  <div className="p-6 space-y-3">
                    <h3 className="text-lg font-bold text-slate-900 group-hover:text-indigo-600 transition-colors">
                      {fac.name}
                    </h3>
                    <p className="text-xs text-slate-600 leading-relaxed">{fac.description}</p>
                    {fac.features && (
                      <div className="pt-2 border-t border-slate-100">
                        <span className="text-[11px] font-semibold text-slate-700 block mb-1">Key Amenities:</span>
                        <div className="flex flex-wrap gap-1.5">
                          {fac.features.split(',').map((f, i) => (
                            <span key={i} className="text-[11px] px-2 py-0.5 rounded bg-slate-100 text-slate-700">
                              {f.trim()}
                            </span>
                          ))}
                        </div>
                      </div>
                    )}
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
