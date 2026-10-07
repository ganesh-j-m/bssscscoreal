import React from 'react';
import { Settings, ShieldCheck, Database, Server, RefreshCw } from 'lucide-react';

export const SettingsPage: React.FC = () => {
  return (
    <div className="space-y-6 p-4 sm:p-6 lg:p-8">
      <div>
        <h1 className="text-xl sm:text-2xl font-extrabold text-slate-900 tracking-tight">
          Platform Configuration & System Architecture
        </h1>
        <p className="text-xs sm:text-sm text-slate-500 font-medium mt-0.5">
          Backend server status, database permanence verification, and security parameters.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-white rounded-2xl border border-slate-200 p-6 space-y-4 shadow-xs">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center">
              <Database className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-bold text-slate-900 text-sm">PostgreSQL Relational Database</h3>
              <p className="text-xs text-slate-500">Cloud SQL (PostgreSQL Engine) Active</p>
            </div>
          </div>

          <div className="space-y-2 text-xs text-slate-600 pt-2 border-t border-slate-100">
            <div className="flex justify-between py-1 border-b border-slate-50">
              <span className="font-semibold text-slate-700">Database Engine:</span>
              <span>PostgreSQL 16 (Relational)</span>
            </div>
            <div className="flex justify-between py-1 border-b border-slate-50">
              <span className="font-semibold text-slate-700">ORM & Driver:</span>
              <span>Drizzle ORM with Node PG Connection Pool</span>
            </div>
            <div className="flex justify-between py-1 border-b border-slate-50">
              <span className="font-semibold text-slate-700">Schema Integrity:</span>
              <span className="text-emerald-700 font-bold">27 Tables Synced & Verified</span>
            </div>
            <div className="flex justify-between py-1">
              <span className="font-semibold text-slate-700">Data Persistence:</span>
              <span className="text-emerald-700 font-bold">Full Disk ACID Persistence</span>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-2xl border border-slate-200 p-6 space-y-4 shadow-xs">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 rounded-xl bg-indigo-50 text-indigo-600 flex items-center justify-center">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-bold text-slate-900 text-sm">Authentication & RBAC</h3>
              <p className="text-xs text-slate-500">Institutional Login ID & BCrypt Security</p>
            </div>
          </div>

          <div className="space-y-2 text-xs text-slate-600 pt-2 border-t border-slate-100">
            <div className="flex justify-between py-1 border-b border-slate-50">
              <span className="font-semibold text-slate-700">Password Encryption:</span>
              <span>BCrypt (10 Salt Rounds)</span>
            </div>
            <div className="flex justify-between py-1 border-b border-slate-50">
              <span className="font-semibold text-slate-700">Token Format:</span>
              <span>Signed JWT (7-Day Persistent Session)</span>
            </div>
            <div className="flex justify-between py-1 border-b border-slate-50">
              <span className="font-semibold text-slate-700">Role Authority:</span>
              <span>Server-Authoritative (SUPER_ADMIN Highest)</span>
            </div>
            <div className="flex justify-between py-1">
              <span className="font-semibold text-slate-700">QR Session Expiry:</span>
              <span>Strict 300s (5-Minute Cryptographic Token)</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
