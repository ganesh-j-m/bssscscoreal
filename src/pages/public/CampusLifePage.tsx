import React from 'react';
import { Sparkles, Trophy, Users, HeartHandshake, ShieldCheck, Camera, Globe } from 'lucide-react';

export const CampusLifePage: React.FC = () => {
  return (
    <div className="space-y-16 pb-20">
      <div className="bg-slate-900 text-white py-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto space-y-4">
          <span className="text-xs font-semibold text-indigo-400 uppercase tracking-wider">
            Student Experience
          </span>
          <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight">
            Vibrant Campus Life at Omerga
          </h1>
          <p className="text-base text-slate-300 max-w-2xl">
            Beyond academics: Cultivating artistic talents, athletic prowess, leadership abilities, and community welfare through student clubs and national service schemes.
          </p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-xs hover:shadow-md transition-all group">
            <div className="h-48 overflow-hidden">
              <img
                src="https://images.unsplash.com/photo-1514525253161-7a46d19cd819?auto=format&fit=crop&q=80&w=800"
                alt="Annual Gathering and Youth Cultural Festival"
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
              />
            </div>
            <div className="p-6 space-y-2">
              <span className="text-[11px] font-bold text-indigo-600 uppercase">Performing Arts</span>
              <h3 className="text-base font-bold text-slate-900">Sharada Youth Cultural Festival</h3>
              <p className="text-xs text-slate-600 leading-relaxed">
                An annual multi-day cultural celebration featuring folk and classical dances, dramatic plays, musical ensembles, elocution debates, and fine arts exhibits.
              </p>
            </div>
          </div>

          <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-xs hover:shadow-md transition-all group">
            <div className="h-48 overflow-hidden">
              <img
                src="https://images.unsplash.com/photo-1542601906990-b4d3fb778b09?auto=format&fit=crop&q=80&w=800"
                alt="National Service Scheme (NSS)"
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
              />
            </div>
            <div className="p-6 space-y-2">
              <span className="text-[11px] font-bold text-indigo-600 uppercase">Social Leadership</span>
              <h3 className="text-base font-bold text-slate-900">National Service Scheme (NSS)</h3>
              <p className="text-xs text-slate-600 leading-relaxed">
                Active student volunteer units adopting nearby villages for water conservation, tree plantation drives, health checkup camps, and literacy campaigns.
              </p>
            </div>
          </div>

          <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-xs hover:shadow-md transition-all group">
            <div className="h-48 overflow-hidden">
              <img
                src="https://images.unsplash.com/photo-1461896836934-ffe607ba8211?auto=format&fit=crop&q=80&w=800"
                alt="Annual Sports Competitions"
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
              />
            </div>
            <div className="p-6 space-y-2">
              <span className="text-[11px] font-bold text-indigo-600 uppercase">Athletics & Games</span>
              <h3 className="text-base font-bold text-slate-900">Sports & Fitness Culture</h3>
              <p className="text-xs text-slate-600 leading-relaxed">
                Inter-collegiate tournaments in cricket, volleyball, kabaddi, badminton, chess, and track events with experienced physical education coaches.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
