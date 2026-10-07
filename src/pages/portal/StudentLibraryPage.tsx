import React, { useEffect, useState } from 'react';
import { Library, BookOpen, Clock, AlertCircle } from 'lucide-react';
import { useAuth } from '../../context/AuthContext.tsx';
import { api } from '../../services/api.ts';
import { BookIssue } from '../../types/index.ts';

export const StudentLibraryPage: React.FC = () => {
  const { user } = useAuth();
  const [issues, setIssues] = useState<BookIssue[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (!user) return;
    api.getBookIssues({ studentLoginId: user.loginId })
      .then(res => {
        if (res.issues) setIssues(res.issues);
      })
      .catch(console.error)
      .finally(() => setIsLoading(false));
  }, [user]);

  return (
    <div className="space-y-6 p-4 sm:p-6 lg:p-8">
      <div>
        <h1 className="text-xl sm:text-2xl font-extrabold text-slate-900 tracking-tight">
          My Library Account & Circulation
        </h1>
        <p className="text-xs sm:text-sm text-slate-500 font-medium mt-0.5">
          Books borrowed from the Central Knowledge Resource Center and upcoming return due dates.
        </p>
      </div>

      <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-xs">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50 border-b border-slate-200 text-slate-500 uppercase font-semibold">
              <tr>
                <th className="px-5 py-3.5">Book Title</th>
                <th className="px-5 py-3.5">Date Issued</th>
                <th className="px-5 py-3.5">Due Date for Return</th>
                <th className="px-5 py-3.5">Circulation Status</th>
                <th className="px-5 py-3.5">Overdue Fine</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {isLoading ? (
                <tr><td colSpan={5} className="px-5 py-8 text-center text-slate-400">Loading library records...</td></tr>
              ) : issues.length === 0 ? (
                <tr><td colSpan={5} className="px-5 py-8 text-center text-slate-400">No books currently borrowed.</td></tr>
              ) : (
                issues.map((i) => (
                  <tr key={i.id} className="hover:bg-slate-50/70">
                    <td className="px-5 py-3.5 font-bold text-slate-900">{i.bookTitle}</td>
                    <td className="px-5 py-3.5 text-slate-600">{i.issueDate}</td>
                    <td className="px-5 py-3.5 text-indigo-700 font-semibold">{i.dueDate}</td>
                    <td className="px-5 py-3.5">
                      <span className={`px-2 py-0.5 rounded text-[11px] font-semibold ${
                        i.status === 'ISSUED' ? 'bg-amber-50 text-amber-700' : 'bg-emerald-50 text-emerald-700'
                      }`}>
                        {i.status}
                      </span>
                    </td>
                    <td className="px-5 py-3.5 text-slate-600">₹{i.fine}</td>
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
