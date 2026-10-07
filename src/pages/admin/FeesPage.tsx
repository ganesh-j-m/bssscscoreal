import React, { useEffect, useState } from 'react';
import { CreditCard, Plus, CheckCircle, Clock, AlertTriangle, Receipt } from 'lucide-react';
import { api } from '../../services/api.ts';
import { FeeRecord } from '../../types/index.ts';
import { Modal } from '../../components/common/Modal.tsx';

export const FeesPage: React.FC = () => {
  const [fees, setFees] = useState<FeeRecord[]>([]);
  const [isAddOpen, setIsAddOpen] = useState(false);
  const [isPayOpen, setIsPayOpen] = useState(false);
  const [selectedFee, setSelectedFee] = useState<FeeRecord | null>(null);
  const [payAmount, setPayAmount] = useState<number>(0);
  const [isLoading, setIsLoading] = useState(true);

  const [formData, setFormData] = useState({
    studentLoginId: 'STU001',
    studentName: 'Aditya Narayan More',
    feeType: 'Annual Academic Tuition & Lab Fee (2024-25)',
    totalAmount: 22000,
    dueDate: '2024-11-30',
  });

  const fetchFees = async () => {
    setIsLoading(true);
    try {
      const res = await api.getFees();
      if (res.fees) setFees(res.fees);
    } catch (err) {
      console.error('Error fetching fees:', err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchFees();
  }, []);

  const handleCreateFee = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await api.createFeeRecord(formData);
      setIsAddOpen(false);
      fetchFees();
    } catch (err: any) {
      alert(err.message || 'Failed to create fee record.');
    }
  };

  const handleRecordPayment = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedFee) return;
    try {
      await api.recordFeePayment(selectedFee.id, {
        amountPaid: payAmount,
        paymentMode: 'Cash / Central Cash Desk',
      });
      setIsPayOpen(false);
      setSelectedFee(null);
      fetchFees();
    } catch (err: any) {
      alert(err.message || 'Failed to record fee payment.');
    }
  };

  return (
    <div className="space-y-6 p-4 sm:p-6 lg:p-8">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl sm:text-2xl font-extrabold text-slate-900 tracking-tight">
            Fee Dues & Financial Accounts
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 font-medium mt-0.5">
            Manage student fee structures, tuition balances, digital receipt numbers, and payment collections.
          </p>
        </div>

        <button
          onClick={() => setIsAddOpen(true)}
          className="inline-flex items-center space-x-1.5 px-3.5 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-semibold text-xs transition-colors shadow-xs"
        >
          <Plus className="w-3.5 h-3.5" />
          <span>Add Student Fee Due</span>
        </button>
      </div>

      <div className="bg-white rounded-2xl border border-slate-200/80 shadow-xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50 border-b border-slate-200 text-slate-500 uppercase tracking-wider font-semibold">
              <tr>
                <th className="px-5 py-3.5">Student</th>
                <th className="px-5 py-3.5">Fee Category</th>
                <th className="px-5 py-3.5">Total Amount</th>
                <th className="px-5 py-3.5">Paid Amount</th>
                <th className="px-5 py-3.5">Pending Balance</th>
                <th className="px-5 py-3.5">Due Date</th>
                <th className="px-5 py-3.5">Status</th>
                <th className="px-5 py-3.5 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {isLoading ? (
                <tr>
                  <td colSpan={8} className="px-5 py-8 text-center text-slate-400">Loading fees...</td>
                </tr>
              ) : fees.length === 0 ? (
                <tr>
                  <td colSpan={8} className="px-5 py-8 text-center text-slate-400">No fee records found.</td>
                </tr>
              ) : (
                fees.map((f) => (
                  <tr key={f.id} className="hover:bg-slate-50/70 transition-colors">
                    <td className="px-5 py-3.5">
                      <span className="font-mono font-bold text-indigo-700 block">{f.studentLoginId}</span>
                      <span className="font-semibold text-slate-900">{f.studentName}</span>
                    </td>
                    <td className="px-5 py-3.5 text-slate-700 font-medium">{f.feeType}</td>
                    <td className="px-5 py-3.5 font-bold text-slate-900">₹{f.totalAmount.toLocaleString('en-IN')}</td>
                    <td className="px-5 py-3.5 text-emerald-700 font-semibold">₹{f.paidAmount.toLocaleString('en-IN')}</td>
                    <td className="px-5 py-3.5 text-rose-700 font-semibold">₹{f.pendingAmount.toLocaleString('en-IN')}</td>
                    <td className="px-5 py-3.5 text-slate-500">{f.dueDate}</td>
                    <td className="px-5 py-3.5">
                      <span className={`px-2 py-0.5 rounded font-semibold text-[11px] ${
                        f.status === 'PAID'
                          ? 'bg-emerald-50 text-emerald-700'
                          : f.status === 'PARTIAL'
                          ? 'bg-amber-50 text-amber-700'
                          : 'bg-rose-50 text-rose-700'
                      }`}>
                        {f.status}
                      </span>
                    </td>
                    <td className="px-5 py-3.5 text-right">
                      {f.pendingAmount > 0 ? (
                        <button
                          onClick={() => {
                            setSelectedFee(f);
                            setPayAmount(f.pendingAmount);
                            setIsPayOpen(true);
                          }}
                          className="px-2.5 py-1 rounded-lg bg-indigo-50 text-indigo-700 hover:bg-indigo-100 font-semibold text-[11px]"
                        >
                          Collect Payment
                        </button>
                      ) : (
                        <span className="text-[11px] text-slate-400 font-mono">
                          {f.receiptNumber || 'PAID'}
                        </span>
                      )}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Add Fee Modal */}
      <Modal isOpen={isAddOpen} onClose={() => setIsAddOpen(false)} title="Issue Student Fee Notice">
        <form onSubmit={handleCreateFee} className="space-y-4">
          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1">
              <label className="text-xs font-semibold text-slate-700">Student Login ID *</label>
              <input
                type="text"
                required
                value={formData.studentLoginId}
                onChange={e => setFormData({ ...formData, studentLoginId: e.target.value.toUpperCase() })}
                className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs font-mono uppercase"
              />
            </div>
            <div className="space-y-1">
              <label className="text-xs font-semibold text-slate-700">Student Name</label>
              <input
                type="text"
                value={formData.studentName}
                onChange={e => setFormData({ ...formData, studentName: e.target.value })}
                className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs"
              />
            </div>
          </div>
          <div className="space-y-1">
            <label className="text-xs font-semibold text-slate-700">Fee Category / Description *</label>
            <input
              type="text"
              required
              value={formData.feeType}
              onChange={e => setFormData({ ...formData, feeType: e.target.value })}
              className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs"
            />
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1">
              <label className="text-xs font-semibold text-slate-700">Total Fee Amount (₹) *</label>
              <input
                type="number"
                required
                min={1}
                value={formData.totalAmount}
                onChange={e => setFormData({ ...formData, totalAmount: parseInt(e.target.value, 10) || 0 })}
                className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs"
              />
            </div>
            <div className="space-y-1">
              <label className="text-xs font-semibold text-slate-700">Due Date *</label>
              <input
                type="date"
                required
                value={formData.dueDate}
                onChange={e => setFormData({ ...formData, dueDate: e.target.value })}
                className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs"
              />
            </div>
          </div>
          <div className="pt-3 flex justify-end gap-2">
            <button
              type="button"
              onClick={() => setIsAddOpen(false)}
              className="px-4 py-2 rounded-xl bg-slate-100 text-slate-700 text-xs font-semibold"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 rounded-xl bg-indigo-600 text-white text-xs font-semibold"
            >
              Issue Fee Notice
            </button>
          </div>
        </form>
      </Modal>

      {/* Collect Payment Modal */}
      <Modal isOpen={isPayOpen} onClose={() => setIsPayOpen(false)} title="Record Fee Collection Payment">
        <form onSubmit={handleRecordPayment} className="space-y-4">
          <div className="p-3 bg-slate-50 rounded-xl space-y-1 text-xs">
            <p><strong>Student:</strong> {selectedFee?.studentName} ({selectedFee?.studentLoginId})</p>
            <p><strong>Fee Type:</strong> {selectedFee?.feeType}</p>
            <p><strong>Remaining Balance:</strong> ₹{selectedFee?.pendingAmount.toLocaleString('en-IN')}</p>
          </div>
          <div className="space-y-1">
            <label className="text-xs font-semibold text-slate-700">Amount Being Collected (₹) *</label>
            <input
              type="number"
              required
              min={1}
              max={selectedFee?.pendingAmount}
              value={payAmount}
              onChange={e => setPayAmount(parseInt(e.target.value, 10) || 0)}
              className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs"
            />
          </div>
          <div className="pt-3 flex justify-end gap-2">
            <button
              type="button"
              onClick={() => setIsPayOpen(false)}
              className="px-4 py-2 rounded-xl bg-slate-100 text-slate-700 text-xs font-semibold"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 rounded-xl bg-emerald-600 text-white text-xs font-semibold"
            >
              Confirm Payment & Generate Receipt
            </button>
          </div>
        </form>
      </Modal>
    </div>
  );
};
