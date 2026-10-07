import React, { useEffect, useState } from 'react';
import { Bell, Calendar, Pin, Search } from 'lucide-react';
import { api } from '../../services/api.ts';
import { Notice } from '../../types/index.ts';

export const NoticesPage: React.FC = () => {
  const [notices, setNotices] = useState<Notice[]>([]);
  const [category, setCategory] = useState('ALL');
  const [search, setSearch] = useState('');
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    api.getNotices()
      .then(res => {
        if (res.notices) setNotices(res.notices);
      })
      .catch(console.error)
      .finally(() => setIsLoading(false));
  }, []);

  const categories = ['ALL', 'Academic', 'Exam', 'Admission', 'Sports', 'General'];

  const filtered = notices.filter(n => {
    const matchesCat = category === 'ALL' || n.category === category;
    const matchesSearch = !search ||
      n.title.toLowerCase().includes(search.toLowerCase()) ||
      n.content.toLowerCase().includes(search.toLowerCase());
    return matchesCat && matchesSearch;
  });

  return (
    <div className="space-y-16 pb-20">
      <div className="bg-slate-900 text-white py-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto space-y-4">
          <span className="text-xs font-semibold text-indigo-400 uppercase tracking-wider">
            Official Bulletin
          </span>
          <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight">
            Circulars & Notice Board
          </h1>
          <p className="text-base text-slate-300 max-w-2xl">
            Official announcements regarding examinations, results, timetable revisions, scholarships, and administrative circulars.
          </p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        {/* Search & Category Filter */}
        <div className="flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="relative w-full md:w-80">
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Search circulars by keyword..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-200 text-xs text-slate-800 placeholder-slate-400 focus:outline-hidden focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-600 bg-white"
            />
          </div>

          <div className="flex items-center space-x-2 overflow-x-auto pb-2 md:pb-0 w-full md:w-auto">
            {categories.map((c) => (
              <button
                key={c}
                onClick={() => setCategory(c)}
                className={`px-3.5 py-2 rounded-xl text-xs font-semibold whitespace-nowrap transition-all ${
                  category === c
                    ? 'bg-indigo-600 text-white shadow-xs'
                    : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                }`}
              >
                {c === 'ALL' ? 'All Notices' : c}
              </button>
            ))}
          </div>
        </div>

        {/* Notices Cards List */}
        {isLoading ? (
          <div className="space-y-4 animate-pulse">
            {[1, 2, 3].map(n => <div key={n} className="h-32 bg-slate-100 rounded-2xl" />)}
          </div>
        ) : filtered.length === 0 ? (
          <div className="text-center py-16 bg-white rounded-2xl border border-slate-200">
            <Bell className="w-10 h-10 text-slate-300 mx-auto mb-3" />
            <h3 className="text-sm font-semibold text-slate-700">No notices found</h3>
            <p className="text-xs text-slate-400 mt-1">Try another category or search term.</p>
          </div>
        ) : (
          <div className="space-y-4">
            {filtered.map((n) => (
              <div
                key={n.id}
                className="bg-white rounded-2xl border border-slate-200 p-6 shadow-xs hover:border-indigo-200 transition-all flex flex-col md:flex-row md:items-start justify-between gap-4"
              >
                <div className="space-y-2 flex-1">
                  <div className="flex items-center space-x-3">
                    <span className="text-[11px] font-bold px-2 py-0.5 rounded-md bg-indigo-50 text-indigo-700">
                      {n.category}
                    </span>
                    {n.isPinned && (
                      <span className="inline-flex items-center gap-1 text-[11px] font-bold px-2 py-0.5 rounded-md bg-amber-50 text-amber-700">
                        <Pin className="w-3 h-3 rotate-45" /> Pinned
                      </span>
                    )}
                    <span className="text-xs text-slate-400 flex items-center gap-1">
                      <Calendar className="w-3.5 h-3.5" /> {n.date}
                    </span>
                  </div>

                  <h3 className="text-base font-bold text-slate-900 leading-snug">{n.title}</h3>
                  <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">{n.content}</p>
                </div>

                <div className="shrink-0 text-right text-xs font-semibold text-slate-400">
                  Target: <span className="text-slate-700">{n.targetAudience}</span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};
