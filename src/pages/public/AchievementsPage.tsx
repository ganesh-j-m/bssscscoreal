import React, { useEffect, useState } from 'react';
import { Trophy, Award, Calendar, ShieldCheck } from 'lucide-react';
import { api } from '../../services/api.ts';
import { AchievementItem } from '../../types/index.ts';

export const AchievementsPage: React.FC = () => {
  const [achievements, setAchievements] = useState<AchievementItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    api.getAchievements()
      .then(res => {
        if (res.achievements) setAchievements(res.achievements);
      })
      .catch(console.error)
      .finally(() => setIsLoading(false));
  }, []);

  return (
    <div className="space-y-16 pb-20">
      <div className="bg-slate-900 text-white py-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto space-y-4">
          <span className="text-xs font-semibold text-indigo-400 uppercase tracking-wider">
            Honors & Distinctions
          </span>
          <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight">
            Institutional & Student Achievements
          </h1>
          <p className="text-base text-slate-300 max-w-2xl">
            Celebrating academic accolades, hackathon victories, sports championships, and research recognition.
          </p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {isLoading ? (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 animate-pulse">
            {[1, 2, 3].map(n => <div key={n} className="h-64 bg-slate-100 rounded-2xl" />)}
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {achievements.map((item) => (
              <div
                key={item.id}
                className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-xs hover:shadow-md transition-all group flex flex-col justify-between"
              >
                <div>
                  <div className="h-48 overflow-hidden relative">
                    <img
                      src={item.imageUrl || 'https://images.unsplash.com/photo-1523240795612-9a054b0db644?auto=format&fit=crop&q=80&w=800'}
                      alt={item.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                    <div className="absolute top-3 left-3 px-2 py-0.5 rounded-md bg-amber-500 text-white text-[10px] font-bold flex items-center gap-1">
                      <Trophy className="w-3 h-3" />
                      <span>{item.category}</span>
                    </div>
                    <div className="absolute top-3 right-3 px-2 py-0.5 rounded-md bg-slate-950/80 backdrop-blur-xs text-[10px] font-bold text-white">
                      Year: {item.year}
                    </div>
                  </div>
                  <div className="p-6 space-y-2">
                    <h3 className="font-bold text-base text-slate-900 leading-snug group-hover:text-indigo-600 transition-colors">
                      {item.title}
                    </h3>
                    <p className="text-xs font-semibold text-indigo-600">Recipient: {item.recipient}</p>
                    <p className="text-xs text-slate-600 leading-relaxed pt-1">{item.description}</p>
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
