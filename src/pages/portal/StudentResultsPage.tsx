import React, { useEffect, useState } from 'react';
import { Award, FileText, CheckCircle2 } from 'lucide-react';
import { useAuth } from '../../context/AuthContext.tsx';
import { api } from '../../services/api.ts';
import { ResultRecord } from '../../types/index.ts';

export const StudentResultsPage: React.FC = () => {
  const { user } = useAuth();
  const [results, setResults] = useState<ResultRecord[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (!user) return;
    api.getStudentResults(user.loginId)
      .then(res => {
        if (res.results) setResults(res.results);
      })
      .catch(console.error)
      .finally(() => setIsLoading(false));
  }, [user]);

  return (
    <div className="space-y-6 p-4 sm:p-6 lg:p-8">
      <div>
        <h1 className="text-xl sm:text-2xl font-extrabold text-slate-900 tracking-tight">
          Grade Sheets & University Results
        </h1>
        <p className="text-xs sm:text-sm text-slate-500 font-medium mt-0.5">
          Official semester examinations, course marks, and letter grades.
        </p>
      </div>

      <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-xs">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50 border-b border-slate-200 text-slate-500 uppercase font-semibold">
              <tr>
                <th className="px-5 py-3.5">Examination</th>
                <th className="px-5 py-3.5">Subject</th>
                <th className="px-5 py-3.5">Marks Obtained</th>
                <th className="px-5 py-3.5">Letter Grade</th>
                <th className="px-5 py-3.5">Result Status</th>
                <th className="px-5 py-3.5">Academic Session</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {isLoading ? (
                <tr>
                  <td colSpan={6} className="px-5 py-8 text-center text-slate-400">Loading results...</td>
                </tr>
              ) : results.length === 0 ? (
                <tr>
                  <td colSpan={6} className="px-5 py-8 text-center text-slate-400">No examination results published yet.</td>
                </tr>
              ) : (
                results.map((r) => (
                  <tr key={r.id} className="hover:bg-slate-50/70">
                    <td className="px-5 py-3.5 font-medium text-slate-900">{r.exam}</td>
                    <td className="px-5 py-3.5 font-bold text-slate-900">{r.subject}</td>
                    <td className="px-5 py-3.5 font-bold text-slate-900">
                      {r.marksObtained} / {r.totalMarks}
                    </td>
                    <td className="px-5 py-3.5">
                      <span className="px-2.5 py-0.5 rounded font-bold text-xs bg-indigo-50 text-indigo-700">
                        {r.grade}
                      </span>
                    </td>
                    <td className="px-5 py-3.5">
                      <span className={`px-2 py-0.5 rounded font-semibold text-[11px] ${
                        r.resultStatus === 'PASS' ? 'bg-emerald-50 text-emerald-700' : 'bg-rose-50 text-rose-700'
                      }`}>
                        {r.resultStatus}
                      </span>
                    </td>
                    <td className="px-5 py-3.5 text-slate-500">{r.academicYear}</td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
