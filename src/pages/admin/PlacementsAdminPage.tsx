import React, { useEffect, useState } from 'react';
import { Briefcase, Plus, Trash2 } from 'lucide-react';
import { api } from '../../services/api.ts';
import { PlacementDrive } from '../../types/index.ts';
import { Modal } from '../../components/common/Modal.tsx';
import { ConfirmModal } from '../../components/common/ConfirmModal.tsx';

export const PlacementsAdminPage: React.FC = () => {
  const [drives, setDrives] = useState<PlacementDrive[]>([]);
  const [isAddOpen, setIsAddOpen] = useState(false);
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);
  const [selectedDrive, setSelectedDrive] = useState<PlacementDrive | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const [formData, setFormData] = useState({
    company: '',
    logo: 'https://images.unsplash.com/photo-1542744094-24638eff58bb?auto=format&fit=crop&q=80&w=200',
    jobTitle: '',
    package: '3.6 - 7.0 LPA',
    location: 'Pune / Hyderabad',
    eligibility: 'B.Sc. CS / BCA with min 60% aggregate',
    coursesAllowed: 'B.Sc. Computer Science, BCA',
    driveDate: '2024-12-15',
    deadline: '2024-12-05',
    description: 'On-campus recruitment drive by technical hiring committee.',
  });

  const fetchDrives = async () => {
    setIsLoading(true);
    try {
      const res = await api.getPlacements();
      if (res.placements) setDrives(res.placements);
    } catch (err) {
      console.error('Placements error:', err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchDrives();
  }, []);

  const handleCreateDrive = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await api.createPlacement(formData);
      setIsAddOpen(false);
      fetchDrives();
    } catch (err: any) {
      alert(err.message || 'Failed to create placement drive');
    }
  };

  const handleDeleteDrive = async () => {
    if (!selectedDrive) return;
    try {
      await api.deletePlacement(selectedDrive.id);
      setIsDeleteOpen(false);
      setSelectedDrive(null);
      fetchDrives();
    } catch (err: any) {
      alert(err.message || 'Failed to delete drive');
    }
  };

  return (
    <div className="space-y-6 p-4 sm:p-6 lg:p-8">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl sm:text-2xl font-extrabold text-slate-900 tracking-tight">
            Campus Placement Drives & Corporate Hiring
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 font-medium mt-0.5">
            Post campus recruitment notices, salary packages, eligibility criteria, and application deadlines.
          </p>
        </div>

        <button
          onClick={() => setIsAddOpen(true)}
          className="inline-flex items-center space-x-1.5 px-3.5 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-semibold text-xs transition-colors shadow-xs"
        >
          <Plus className="w-3.5 h-3.5" />
          <span>Add Placement Drive</span>
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {isLoading ? (
          <div className="col-span-full py-12 text-center text-slate-400 text-xs">Loading drives...</div>
        ) : drives.length === 0 ? (
          <div className="col-span-full py-12 text-center text-slate-400 text-xs bg-white rounded-2xl border">
            No recruitment drives active.
          </div>
        ) : (
          drives.map((d) => (
            <div
              key={d.id}
              className="bg-white rounded-2xl border border-slate-200 p-6 flex flex-col justify-between shadow-xs space-y-4"
            >
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="font-bold text-base text-slate-900">{d.company}</span>
                  <button
                    onClick={() => { setSelectedDrive(d); setIsDeleteOpen(true); }}
                    className="p-1 text-slate-400 hover:text-rose-600"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
                <p className="text-xs font-semibold text-indigo-600">{d.jobTitle}</p>
                <div className="p-2.5 rounded-xl bg-emerald-50 text-emerald-800 text-xs font-bold inline-block">
                  Package: {d.package}
                </div>
                <div className="text-xs text-slate-600 space-y-1 pt-1">
                  <p><strong>Location:</strong> {d.location}</p>
                  <p><strong>Drive Date:</strong> {d.driveDate}</p>
                  <p><strong>Deadline:</strong> {d.deadline}</p>
                  <p><strong>Eligible:</strong> {d.coursesAllowed}</p>
                </div>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Add Modal */}
      <Modal isOpen={isAddOpen} onClose={() => setIsAddOpen(false)} title="Announce Campus Placement Drive" maxWidth="xl">
        <form onSubmit={handleCreateDrive} className="space-y-4">
          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1">
              <label className="text-xs font-semibold text-slate-700">Company Name *</label>
              <input
                type="text"
                required
                value={formData.company}
                onChange={e => setFormData({ ...formData, company: e.target.value })}
                className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs"
              />
            </div>
            <div className="space-y-1">
              <label className="text-xs font-semibold text-slate-700">Job Title / Designation *</label>
              <input
                type="text"
                required
                value={formData.jobTitle}
                onChange={e => setFormData({ ...formData, jobTitle: e.target.value })}
                className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs"
              />
            </div>
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1">
              <label className="text-xs font-semibold text-slate-700">CTC Package *</label>
              <input
                type="text"
                required
                value={formData.package}
                onChange={e => setFormData({ ...formData, package: e.target.value })}
                className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs"
              />
            </div>
            <div className="space-y-1">
              <label className="text-xs font-semibold text-slate-700">Location</label>
              <input
                type="text"
                value={formData.location}
                onChange={e => setFormData({ ...formData, location: e.target.value })}
                className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs"
              />
            </div>
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1">
              <label className="text-xs font-semibold text-slate-700">Drive Date</label>
              <input
                type="date"
                value={formData.driveDate}
                onChange={e => setFormData({ ...formData, driveDate: e.target.value })}
                className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs"
              />
            </div>
            <div className="space-y-1">
              <label className="text-xs font-semibold text-slate-700">Application Deadline</label>
              <input
                type="date"
                value={formData.deadline}
                onChange={e => setFormData({ ...formData, deadline: e.target.value })}
                className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs"
              />
            </div>
          </div>
          <div className="space-y-1">
            <label className="text-xs font-semibold text-slate-700">Eligible Programs</label>
            <input
              type="text"
              value={formData.coursesAllowed}
              onChange={e => setFormData({ ...formData, coursesAllowed: e.target.value })}
              className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs"
            />
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
              Post Drive to Portal & Public Website
            </button>
          </div>
        </form>
      </Modal>

      <ConfirmModal
        isOpen={isDeleteOpen}
        title="Delete Placement Drive?"
        message={`Are you sure you want to remove the recruitment drive for "${selectedDrive?.company}"?`}
        onConfirm={handleDeleteDrive}
        onCancel={() => setIsDeleteOpen(false)}
      />
    </div>
  );
};
