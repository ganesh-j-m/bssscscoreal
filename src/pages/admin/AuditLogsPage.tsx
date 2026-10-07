import React, { useEffect, useState } from 'react';
import { ShieldAlert, Search, Filter, Clock, ChevronLeft, ChevronRight } from 'lucide-react';
import { api } from '../../services/api.ts';
import { AuditLogItem } from '../../types/index.ts';

export const AuditLogsPage: React.FC = () => {
  const [logs, setLogs] = useState<AuditLogItem[]>([]);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState('');
  const [moduleFilter, setModuleFilter] = useState('ALL');
  const [isLoading, setIsLoading] = useState(true);

  const fetchLogs = async () => {
    setIsLoading(true);
    try {
      const res = await api.getAuditLogs({
        page: String(page),
        search,
        module: moduleFilter,
        limit: '15',
      });
      if (res.logs) {
        setLogs(res.logs);
        setTotal(res.total);
      }
    } catch (err) {
      console.error('Error fetching audit logs:', err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchLogs();
  }, [page, moduleFilter]);

  return (
    <div className="space-y-6 p-4 sm:p-6 lg:p-8">
      <div>
        <h1 className="text-xl sm:text-2xl font-extrabold text-slate-900 tracking-tight">
          System Security & Audit Log Trail
        </h1>
        <p className="text-xs sm:text-sm text-slate-500 font-medium mt-0.5">
          Tamper-evident chronological audit records of all administrative actions, logins, deletions, and grade updates.
        </p>
      </div>

      <div className="bg-white p-4 rounded-2xl border border-slate-200/80 shadow-xs flex flex-col md:flex-row items-center justify-between gap-4">
        <div className="relative w-full md:w-80">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search audit trail by user, action..."
            value={search}
            onChange={e => setSearch(e.target.value)}
            onKeyDown={e => { if (e.key === 'Enter') fetchLogs(); }}
            className="w-full pl-10 pr-4 py-2 rounded-xl border border-slate-200 text-xs"
          />
        </div>

        <select
          value={moduleFilter}
          onChange={e => { setModuleFilter(e.target.value); setPage(1); }}
          className="px-3 py-2 rounded-xl border border-slate-200 text-xs font-semibold text-slate-700 bg-white"
        >
          <option value="ALL">All Modules</option>
          <option value="Auth">Auth & Logins</option>
          <option value="Users">Users Management</option>
          <option value="Students">Students</option>
          <option value="Faculty">Faculty</option>
          <option value="Attendance">Attendance & QR</option>
          <option value="Results">Examinations & Results</option>
          <option value="Fees">Fees & Payments</option>
          <option value="Certificates">Certificates</option>
          <option value="CMS">Website CMS</option>
        </select>
      </div>

      <div className="bg-white rounded-2xl border border-slate-200/80 shadow-xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50 border-b border-slate-200 text-slate-500 uppercase font-semibold">
              <tr>
                <th className="px-5 py-3.5">Timestamp</th>
                <th className="px-5 py-3.5">User</th>
                <th className="px-5 py-3.5">Action</th>
                <th className="px-5 py-3.5">Module</th>
                <th className="px-5 py-3.5">Record ID</th>
                <th className="px-5 py-3.5">Audit Event Details</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {isLoading ? (
                <tr>
                  <td colSpan={6} className="px-5 py-8 text-center text-slate-400">Loading audit trail...</td>
                </tr>
              ) : logs.length === 0 ? (
                <tr>
                  <td colSpan={6} className="px-5 py-8 text-center text-slate-400">No logs found matching filters.</td>
                </tr>
              ) : (
                logs.map((l) => (
                  <tr key={l.id} className="hover:bg-slate-50/70 font-mono text-[11px]">
                    <td className="px-5 py-3.5 text-slate-500 whitespace-nowrap">
                      {new Date(l.timestamp).toLocaleString()}
                    </td>
                    <td className="px-5 py-3.5">
                      <span className="font-bold text-indigo-700 block">{l.userLoginId}</span>
                      <span className="font-sans text-slate-600 text-[10px]">{l.userName} ({l.role})</span>
                    </td>
                    <td className="px-5 py-3.5">
                      <span className="px-2 py-0.5 rounded font-bold text-[10px] bg-slate-100 text-slate-800">
                        {l.action}
                      </span>
                    </td>
                    <td className="px-5 py-3.5 font-sans font-semibold text-slate-700">{l.module}</td>
                    <td className="px-5 py-3.5 text-slate-500">{l.recordId || '—'}</td>
                    <td className="px-5 py-3.5 font-sans text-slate-600 max-w-md">
                      {l.details}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination Strip */}
        <div className="px-5 py-3.5 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500">
          <span>Total audit entries: <strong>{total}</strong></span>
          <div className="flex items-center space-x-2">
            <button
              onClick={() => setPage(p => Math.max(1, p - 1))}
              disabled={page === 1}
              className="p-1.5 rounded-lg border border-slate-200 disabled:opacity-40"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>
            <span className="font-semibold px-2">Page {page}</span>
            <button
              onClick={() => setPage(p => p + 1)}
              disabled={logs.length < 15}
              className="p-1.5 rounded-lg border border-slate-200 disabled:opacity-40"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
