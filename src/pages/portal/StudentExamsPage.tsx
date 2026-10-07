import React, { useEffect, useState } from 'react';
import { Calendar, Clock, MapPin, FileText } from 'lucide-react';
import { api } from '../../services/api.ts';
import { Examination } from '../../types/index.ts';

export const StudentExamsPage: React.FC = () => {
  const [exams, setExams] = useState<Examination[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    api.getExaminations().then(res => {
      if (res.examinations) setExams(res.examinations);
    }).catch(console.error).finally(() => setIsLoading(false));
  }, []);

  return (
    <div className="space-y-6 p-4 sm:p-6 lg:p-8">
      <div>
        <h1 className="text-xl sm:text-2xl font-extrabold text-slate-900 tracking-tight">
          Examination Timetable & Hall Ticket
        </h1>
        <p className="text-xs sm:text-sm text-slate-500 font-medium mt-0.5">
          Upcoming university end-semester and internal assessment examination schedules.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {isLoading ? (
          <div className="col-span-full py-12 text-center text-slate-400 text-xs">Loading exams...</div>
        ) : exams.length === 0 ? (
          <div className="col-span-full py-12 text-center text-slate-400 text-xs bg-white rounded-2xl border">
            No examinations scheduled for this period.
          </div>
        ) : (
          exams.map((ex) => (
            <div key={ex.id} className="bg-white rounded-2xl border border-slate-200 p-6 space-y-3 shadow-xs">
              <span className="text-[11px] font-bold px-2 py-0.5 rounded bg-indigo-50 text-indigo-700">
                Semester {ex.semester}
              </span>
              <h3 className="font-bold text-base text-slate-900">{ex.name}</h3>
              <p className="text-xs font-semibold text-indigo-600">{ex.subject}</p>
              <div className="space-y-1.5 text-xs text-slate-600 pt-2 border-t border-slate-100">
                <p className="flex items-center gap-1.5"><Calendar className="w-3.5 h-3.5 text-slate-400" /> {ex.date}</p>
                <p className="flex items-center gap-1.5"><Clock className="w-3.5 h-3.5 text-slate-400" /> {ex.startTime} - {ex.endTime}</p>
                <p className="flex items-center gap-1.5"><MapPin className="w-3.5 h-3.5 text-slate-400" /> {ex.room}</p>
              </div>
              {ex.instructions && (
                <p className="text-[11px] text-slate-500 pt-1 line-clamp-2">{ex.instructions}</p>
              )}
            </div>
          ))
        )}
      </div>
    </div>
  );
};
