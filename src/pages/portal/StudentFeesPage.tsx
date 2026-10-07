import React, { useEffect, useState } from 'react';
import { CreditCard, CheckCircle, Clock, AlertCircle } from 'lucide-react';
import { useAuth } from '../../context/AuthContext.tsx';
import { api } from '../../services/api.ts';
import { FeeRecord } from '../../types/index.ts';

export const StudentFeesPage: React.FC = () => {
  const { user } = useAuth();
  const [fees, setFees] = useState<FeeRecord[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (!user) return;
    api.getStudentFees(user.loginId)
      .then(res => {
        if (res.fees) setFees(res.fees);
      })
      .catch(console.error)
      .finally(() => setIsLoading(false));
  }, [user]);

  return (
    <div className="space-y-6 p-4 sm:p-6 lg:p-8">
      <div>
        <h1 className="text-xl sm:text-2xl font-extrabold text-slate-900 tracking-tight">
          Fee Dues & Payment Receipts
        </h1>
        <p className="text-xs sm:text-sm text-slate-500 font-medium mt-0.5">
          View tuition fees, laboratory charges, payment receipt numbers, and outstanding balances.
        </p>
      </div>

      <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-xs">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50 border-b border-slate-200 text-slate-500 uppercase font-semibold">
              <tr>
                <th className="px-5 py-3.5">Fee Particulars</th>
                <th className="px-5 py-3.5">Total Amount</th>
                <th className="px-5 py-3.5">Paid Amount</th>
                <th className="px-5 py-3.5">Pending Due</th>
                <th className="px-5 py-3.5">Due Date</th>
                <th className="px-5 py-3.5">Status</th>
                <th className="px-5 py-3.5">Receipt #</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {isLoading ? (
                <tr><td colSpan={7} className="px-5 py-8 text-center text-slate-400">Loading fee records...</td></tr>
              ) : fees.length === 0 ? (
                <tr><td colSpan={7} className="px-5 py-8 text-center text-slate-400">No fee dues recorded.</td></tr>
              ) : (
                fees.map((f) => (
                  <tr key={f.id} className="hover:bg-slate-50/70">
                    <td className="px-5 py-3.5 font-bold text-slate-900">{f.feeType}</td>
                    <td className="px-5 py-3.5 font-bold text-slate-900">₹{f.totalAmount.toLocaleString('en-IN')}</td>
                    <td className="px-5 py-3.5 text-emerald-700 font-semibold">₹{f.paidAmount.toLocaleString('en-IN')}</td>
                    <td className="px-5 py-3.5 text-rose-700 font-semibold">₹{f.pendingAmount.toLocaleString('en-IN')}</td>
                    <td className="px-5 py-3.5 text-slate-500">{f.dueDate}</td>
                    <td className="px-5 py-3.5">
                      <span className={`px-2 py-0.5 rounded text-[11px] font-semibold ${
                        f.status === 'PAID' ? 'bg-emerald-50 text-emerald-700' : 'bg-rose-50 text-rose-700'
                      }`}>
                        {f.status}
                      </span>
                    </td>
                    <td className="px-5 py-3.5 font-mono text-[11px] text-slate-600">{f.receiptNumber || '—'}</td>
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
