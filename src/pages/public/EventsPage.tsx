import React, { useEffect, useState } from 'react';
import { Calendar, Clock, MapPin } from 'lucide-react';
import { api } from '../../services/api.ts';
import { EventItem } from '../../types/index.ts';

export const EventsPage: React.FC = () => {
  const [events, setEvents] = useState<EventItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    api.getEvents()
      .then(res => {
        if (res.events) setEvents(res.events);
      })
      .catch(console.error)
      .finally(() => setIsLoading(false));
  }, []);

  return (
    <div className="space-y-16 pb-20">
      <div className="bg-slate-900 text-white py-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto space-y-4">
          <span className="text-xs font-semibold text-indigo-400 uppercase tracking-wider">
            Campus Calendar
          </span>
          <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight">
            Events, Conferences & Workshops
          </h1>
          <p className="text-base text-slate-300 max-w-2xl">
            Stay informed about guest lectures, technical hackathons, cultural festivals, and research colloquiums.
          </p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {isLoading ? (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 animate-pulse">
            {[1, 2, 3].map(n => <div key={n} className="h-72 bg-slate-100 rounded-2xl" />)}
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {events.map((ev) => (
              <div
                key={ev.id}
                className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-xs hover:shadow-md transition-all group flex flex-col justify-between"
              >
                <div>
                  <div className="h-48 overflow-hidden relative">
                    <img
                      src={ev.image || 'https://images.unsplash.com/photo-1540575467063-178a50c2df87?auto=format&fit=crop&q=80&w=800'}
                      alt={ev.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                    <div className="absolute top-3 left-3 px-2 py-0.5 rounded-md bg-indigo-600 text-white text-[10px] font-semibold">
                      {ev.category}
                    </div>
                    <div className="absolute top-3 right-3 px-2 py-0.5 rounded-md bg-slate-950/80 backdrop-blur-xs text-[10px] font-bold text-white">
                      {ev.status}
                    </div>
                  </div>
                  <div className="p-5 space-y-2.5">
                    <div className="flex items-center space-x-4 text-xs text-slate-500 font-medium">
                      <span className="flex items-center gap-1"><Calendar className="w-3.5 h-3.5 text-indigo-600" /> {ev.date}</span>
                      <span className="flex items-center gap-1"><Clock className="w-3.5 h-3.5 text-indigo-600" /> {ev.time}</span>
                    </div>
                    <h3 className="font-bold text-sm sm:text-base text-slate-900 group-hover:text-indigo-600 transition-colors">
                      {ev.title}
                    </h3>
                    <p className="text-xs text-slate-600 leading-relaxed line-clamp-3">{ev.description}</p>
                  </div>
                </div>

                <div className="p-5 pt-0 border-t border-slate-100 mt-4 flex items-center gap-1.5 text-xs text-slate-500 font-medium">
                  <MapPin className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                  <span className="truncate">{ev.venue}</span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};
