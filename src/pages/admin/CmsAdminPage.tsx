import React, { useEffect, useState } from 'react';
import { Globe, Bell, CalendarCheck, Image, UserSquare2, PhoneCall, Building, Trophy, Plus, Trash2, Save, CheckCircle2 } from 'lucide-react';
import { api } from '../../services/api.ts';
import { Notice, EventItem, GalleryItem, FacilityItem, AchievementItem } from '../../types/index.ts';
import { Modal } from '../../components/common/Modal.tsx';
import { ConfirmModal } from '../../components/common/ConfirmModal.tsx';

export const CmsAdminPage: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'hero' | 'principal' | 'contact' | 'notices' | 'events' | 'gallery' | 'facilities' | 'achievements'>('hero');

  // CMS Section States
  const [heroForm, setHeroForm] = useState({
    heroTitle: 'Sharadabai Pawar College, Omerga',
    heroSubtitle: 'SCSCO Digital Campus — Empowering Rural Minds with Excellence in Higher Education, Innovation & Character Building.',
    estYear: '1990',
    naacGrade: 'A Grade Accredited',
    heroBanner: 'https://images.unsplash.com/photo-1541339907198-e08756dedf3f?auto=format&fit=crop&q=80&w=1600',
  });

  const [principalForm, setPrincipalForm] = useState({
    name: 'Dr. Suresh V. Patil',
    designation: 'Principal & Professor',
    qualifications: 'M.Sc., Ph.D., Postdoc (USA)',
    experience: '28+ Years in Academic Leadership',
    photo: 'https://images.unsplash.com/photo-1560250097-0b93528c311a?auto=format&fit=crop&q=80&w=800',
    message: 'Welcome to Sharadabai Pawar College, Omerga. Three decades of academic distinction.',
    email: 'principal@sharadacollege.edu.in',
    phone: '+91 (02475) 252244',
  });

  const [contactForm, setContactForm] = useState({
    collegeName: 'Sharadabai Pawar College, Omerga',
    address: 'National Highway 65, Omerga, Dist. Dharashiv - 413606, Maharashtra',
    phone: '+91 (02475) 252244 / +91 94220 55667',
    email: 'contact@sharadacollege.edu.in',
    officeHours: 'Mon - Sat: 09:30 AM to 05:30 PM',
  });

  // Dynamic Lists
  const [notices, setNotices] = useState<Notice[]>([]);
  const [events, setEvents] = useState<EventItem[]>([]);
  const [gallery, setGallery] = useState<GalleryItem[]>([]);
  const [facilities, setFacilities] = useState<FacilityItem[]>([]);
  const [achievements, setAchievements] = useState<AchievementItem[]>([]);

  // Modals
  const [isAddOpen, setIsAddOpen] = useState(false);
  const [noticeForm, setNoticeForm] = useState({ title: '', category: 'Academic', content: '', date: new Date().toISOString().split('T')[0], isPinned: false, targetAudience: 'All' });
  const [eventForm, setEventForm] = useState({ title: '', category: 'Campus', date: '2025-01-15', time: '10:00 AM', venue: 'Main Auditorium', description: '', image: 'https://images.unsplash.com/photo-1540575467063-178a50c2df87?auto=format&fit=crop&q=80&w=800' });
  const [galleryForm, setGalleryForm] = useState({ title: '', category: 'Campus', imageUrl: '', caption: '' });
  const [facilityForm, setFacilityForm] = useState({ name: '', category: 'Academic', description: '', imageUrl: '', features: '' });
  const [achievementForm, setAchievementForm] = useState({ title: '', recipient: '', category: 'Academic', year: '2024', description: '', imageUrl: '' });

  const [saveSuccess, setSaveSuccess] = useState<string | null>(null);

  const loadAllCms = async () => {
    try {
      const [hRes, pRes, cRes, nRes, eRes, gRes, fRes, aRes] = await Promise.all([
        api.getCmsSection('homepage_hero'),
        api.getCmsSection('principal_profile'),
        api.getCmsSection('contact_info'),
        api.getNotices(),
        api.getEvents(),
        api.getGallery(),
        api.getFacilities(),
        api.getAchievements(),
      ]);

      if (hRes.data) setHeroForm(hRes.data);
      if (pRes.data) setPrincipalForm(pRes.data);
      if (cRes.data) setContactForm(cRes.data);
      if (nRes.notices) setNotices(nRes.notices);
      if (eRes.events) setEvents(eRes.events);
      if (gRes.gallery) setGallery(gRes.gallery);
      if (fRes.facilities) setFacilities(fRes.facilities);
      if (aRes.achievements) setAchievements(aRes.achievements);
    } catch (err) {
      console.error('Error loading CMS:', err);
    }
  };

  useEffect(() => {
    loadAllCms();
  }, []);

  const handleSaveSection = async (sectionKey: string, data: any) => {
    try {
      await api.updateCmsSection(sectionKey, data);
      setSaveSuccess(`CMS section "${sectionKey}" updated successfully! Changes reflect on the public website.`);
      setTimeout(() => setSaveSuccess(null), 4000);
    } catch (err: any) {
      alert(err.message || 'Failed to save CMS section.');
    }
  };

  const handleCreateDynamicItem = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (activeTab === 'notices') await api.createNotice(noticeForm);
      if (activeTab === 'events') await api.createEvent(eventForm);
      if (activeTab === 'gallery') await api.createGalleryItem(galleryForm);
      if (activeTab === 'facilities') await api.createFacility(facilityForm);
      if (activeTab === 'achievements') await api.createAchievement(achievementForm);
      setIsAddOpen(false);
      loadAllCms();
    } catch (err: any) {
      alert(err.message || 'Operation failed');
    }
  };

  return (
    <div className="space-y-6 p-4 sm:p-6 lg:p-8">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl sm:text-2xl font-extrabold text-slate-900 tracking-tight">
            College Website CMS & Content Manager
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 font-medium mt-0.5">
            Super Admin control panel for updating the public college website, hero banners, principal desk, notices, and gallery.
          </p>
        </div>

        {['notices', 'events', 'gallery', 'facilities', 'achievements'].includes(activeTab) && (
          <button
            onClick={() => setIsAddOpen(true)}
            className="inline-flex items-center space-x-1.5 px-3.5 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-semibold text-xs shadow-xs"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Add New {activeTab.slice(0, -1)}</span>
          </button>
        )}
      </div>

      {saveSuccess && (
        <div className="p-3.5 rounded-xl bg-emerald-50 border border-emerald-200 text-xs text-emerald-800 flex items-center gap-2">
          <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
          <span>{saveSuccess}</span>
        </div>
      )}

      {/* Tabs */}
      <div className="flex items-center space-x-2 border-b border-slate-200 overflow-x-auto pb-1">
        {[
          { key: 'hero', label: 'Homepage Hero', icon: Globe },
          { key: 'principal', label: 'Principal Profile', icon: UserSquare2 },
          { key: 'contact', label: 'Contact Info', icon: PhoneCall },
          { key: 'notices', label: 'Notice Board', icon: Bell },
          { key: 'events', label: 'Events Calendar', icon: CalendarCheck },
          { key: 'gallery', label: 'Photo Gallery', icon: Image },
          { key: 'facilities', label: 'Facilities', icon: Building },
          { key: 'achievements', label: 'Achievements', icon: Trophy },
        ].map(t => (
          <button
            key={t.key}
            onClick={() => setActiveTab(t.key as any)}
            className={`flex items-center space-x-2 px-3.5 py-2.5 border-b-2 text-xs font-bold whitespace-nowrap transition-all ${
              activeTab === t.key
                ? 'border-indigo-600 text-indigo-600'
                : 'border-transparent text-slate-500 hover:text-slate-700'
            }`}
          >
            <t.icon className="w-3.5 h-3.5" />
            <span>{t.label}</span>
          </button>
        ))}
      </div>

      {/* Hero Tab */}
      {activeTab === 'hero' && (
        <div className="bg-white rounded-2xl border border-slate-200 p-6 space-y-4 max-w-2xl shadow-xs">
          <h3 className="font-bold text-slate-900 text-sm">Homepage Hero Banner Content</h3>
          <div className="space-y-3 text-xs">
            <div className="space-y-1">
              <label className="font-semibold text-slate-700">Main Hero Headline</label>
              <input
                type="text"
                value={heroForm.heroTitle}
                onChange={e => setHeroForm({ ...heroForm, heroTitle: e.target.value })}
                className="w-full px-3 py-2 rounded-xl border border-slate-200"
              />
            </div>
            <div className="space-y-1">
              <label className="font-semibold text-slate-700">Sub-headline Description</label>
              <textarea
                rows={3}
                value={heroForm.heroSubtitle}
                onChange={e => setHeroForm({ ...heroForm, heroSubtitle: e.target.value })}
                className="w-full px-3 py-2 rounded-xl border border-slate-200"
              />
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1">
                <label className="font-semibold text-slate-700">Established Year</label>
                <input
                  type="text"
                  value={heroForm.estYear}
                  onChange={e => setHeroForm({ ...heroForm, estYear: e.target.value })}
                  className="w-full px-3 py-2 rounded-xl border border-slate-200"
                />
              </div>
              <div className="space-y-1">
                <label className="font-semibold text-slate-700">NAAC Accreditation Tag</label>
                <input
                  type="text"
                  value={heroForm.naacGrade}
                  onChange={e => setHeroForm({ ...heroForm, naacGrade: e.target.value })}
                  className="w-full px-3 py-2 rounded-xl border border-slate-200"
                />
              </div>
            </div>
            <div className="space-y-1">
              <label className="font-semibold text-slate-700">Background Campus Banner Image URL</label>
              <input
                type="text"
                value={heroForm.heroBanner}
                onChange={e => setHeroForm({ ...heroForm, heroBanner: e.target.value })}
                className="w-full px-3 py-2 rounded-xl border border-slate-200"
              />
            </div>
            <button
              onClick={() => handleSaveSection('homepage_hero', heroForm)}
              className="mt-2 inline-flex items-center space-x-2 px-5 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-semibold text-xs shadow-sm"
            >
              <Save className="w-4 h-4" />
              <span>Save Hero Content to Database</span>
            </button>
          </div>
        </div>
      )}

      {/* Principal Profile Tab */}
      {activeTab === 'principal' && (
        <div className="bg-white rounded-2xl border border-slate-200 p-6 space-y-4 max-w-2xl shadow-xs">
          <h3 className="font-bold text-slate-900 text-sm">Principal Desk & Official Profile</h3>
          <div className="space-y-3 text-xs">
            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1">
                <label className="font-semibold text-slate-700">Principal Name</label>
                <input
                  type="text"
                  value={principalForm.name}
                  onChange={e => setPrincipalForm({ ...principalForm, name: e.target.value })}
                  className="w-full px-3 py-2 rounded-xl border border-slate-200"
                />
              </div>
              <div className="space-y-1">
                <label className="font-semibold text-slate-700">Designation</label>
                <input
                  type="text"
                  value={principalForm.designation}
                  onChange={e => setPrincipalForm({ ...principalForm, designation: e.target.value })}
                  className="w-full px-3 py-2 rounded-xl border border-slate-200"
                />
              </div>
            </div>
            <div className="space-y-1">
              <label className="font-semibold text-slate-700">Qualifications</label>
              <input
                type="text"
                value={principalForm.qualifications}
                onChange={e => setPrincipalForm({ ...principalForm, qualifications: e.target.value })}
                className="w-full px-3 py-2 rounded-xl border border-slate-200"
              />
            </div>
            <div className="space-y-1">
              <label className="font-semibold text-slate-700">Photo Image URL</label>
              <input
                type="text"
                value={principalForm.photo}
                onChange={e => setPrincipalForm({ ...principalForm, photo: e.target.value })}
                className="w-full px-3 py-2 rounded-xl border border-slate-200"
              />
            </div>
            <div className="space-y-1">
              <label className="font-semibold text-slate-700">Official Principal's Message to Students & Parents</label>
              <textarea
                rows={5}
                value={principalForm.message}
                onChange={e => setPrincipalForm({ ...principalForm, message: e.target.value })}
                className="w-full px-3 py-2 rounded-xl border border-slate-200"
              />
            </div>
            <button
              onClick={() => handleSaveSection('principal_profile', principalForm)}
              className="mt-2 inline-flex items-center space-x-2 px-5 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-semibold text-xs shadow-sm"
            >
              <Save className="w-4 h-4" />
              <span>Save Principal Profile</span>
            </button>
          </div>
        </div>
      )}

      {/* Contact Info Tab */}
      {activeTab === 'contact' && (
        <div className="bg-white rounded-2xl border border-slate-200 p-6 space-y-4 max-w-2xl shadow-xs">
          <h3 className="font-bold text-slate-900 text-sm">Official Institutional Contact Details</h3>
          <div className="space-y-3 text-xs">
            <div className="space-y-1">
              <label className="font-semibold text-slate-700">Campus Physical Address</label>
              <textarea
                rows={2}
                value={contactForm.address}
                onChange={e => setContactForm({ ...contactForm, address: e.target.value })}
                className="w-full px-3 py-2 rounded-xl border border-slate-200"
              />
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1">
                <label className="font-semibold text-slate-700">Telephone / Mobile</label>
                <input
                  type="text"
                  value={contactForm.phone}
                  onChange={e => setContactForm({ ...contactForm, phone: e.target.value })}
                  className="w-full px-3 py-2 rounded-xl border border-slate-200"
                />
              </div>
              <div className="space-y-1">
                <label className="font-semibold text-slate-700">Email Address</label>
                <input
                  type="email"
                  value={contactForm.email}
                  onChange={e => setContactForm({ ...contactForm, email: e.target.value })}
                  className="w-full px-3 py-2 rounded-xl border border-slate-200"
                />
              </div>
            </div>
            <button
              onClick={() => handleSaveSection('contact_info', contactForm)}
              className="mt-2 inline-flex items-center space-x-2 px-5 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-semibold text-xs shadow-sm"
            >
              <Save className="w-4 h-4" />
              <span>Save Contact Information</span>
            </button>
          </div>
        </div>
      )}

      {/* Notices Tab */}
      {activeTab === 'notices' && (
        <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-xs">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50 border-b border-slate-200 text-slate-500 uppercase font-semibold">
              <tr>
                <th className="px-5 py-3.5">Title</th>
                <th className="px-5 py-3.5">Category</th>
                <th className="px-5 py-3.5">Date</th>
                <th className="px-5 py-3.5">Pinned</th>
                <th className="px-5 py-3.5 text-right">Delete</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {notices.map((n) => (
                <tr key={n.id} className="hover:bg-slate-50/70">
                  <td className="px-5 py-3.5 font-bold text-slate-900">{n.title}</td>
                  <td className="px-5 py-3.5">{n.category}</td>
                  <td className="px-5 py-3.5 text-slate-500">{n.date}</td>
                  <td className="px-5 py-3.5">{n.isPinned ? 'Yes' : 'No'}</td>
                  <td className="px-5 py-3.5 text-right">
                    <button
                      onClick={async () => {
                        await api.deleteNotice(n.id);
                        loadAllCms();
                      }}
                      className="p-1 text-slate-400 hover:text-rose-600"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Events Tab */}
      {activeTab === 'events' && (
        <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-xs">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50 border-b border-slate-200 text-slate-500 uppercase font-semibold">
              <tr>
                <th className="px-5 py-3.5">Event Title</th>
                <th className="px-5 py-3.5">Category</th>
                <th className="px-5 py-3.5">Date & Time</th>
                <th className="px-5 py-3.5">Venue</th>
                <th className="px-5 py-3.5 text-right">Delete</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {events.map((e) => (
                <tr key={e.id} className="hover:bg-slate-50/70">
                  <td className="px-5 py-3.5 font-bold text-slate-900">{e.title}</td>
                  <td className="px-5 py-3.5">{e.category}</td>
                  <td className="px-5 py-3.5 text-slate-600">{e.date} • {e.time}</td>
                  <td className="px-5 py-3.5 text-slate-600">{e.venue}</td>
                  <td className="px-5 py-3.5 text-right">
                    <button
                      onClick={async () => {
                        await api.deleteEvent(e.id);
                        loadAllCms();
                      }}
                      className="p-1 text-slate-400 hover:text-rose-600"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Gallery Tab */}
      {activeTab === 'gallery' && (
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {gallery.map((g) => (
            <div key={g.id} className="bg-white rounded-xl border border-slate-200 overflow-hidden shadow-xs group relative">
              <img src={g.imageUrl} alt={g.title} className="w-full h-36 object-cover" />
              <div className="p-3">
                <p className="font-bold text-xs text-slate-900 truncate">{g.title}</p>
                <span className="text-[10px] text-slate-400 block">{g.category}</span>
              </div>
              <button
                onClick={async () => {
                  await api.deleteGalleryItem(g.id);
                  loadAllCms();
                }}
                className="absolute top-2 right-2 p-1.5 rounded-lg bg-rose-600 text-white shadow-md opacity-0 group-hover:opacity-100 transition-opacity"
              >
                <Trash2 className="w-3.5 h-3.5" />
              </button>
            </div>
          ))}
        </div>
      )}

      {/* Facilities Tab */}
      {activeTab === 'facilities' && (
        <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-xs">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50 border-b border-slate-200 text-slate-500 uppercase font-semibold">
              <tr>
                <th className="px-5 py-3.5">Facility Name</th>
                <th className="px-5 py-3.5">Category</th>
                <th className="px-5 py-3.5">Description</th>
                <th className="px-5 py-3.5 text-right">Delete</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {facilities.map((f) => (
                <tr key={f.id} className="hover:bg-slate-50/70">
                  <td className="px-5 py-3.5 font-bold text-slate-900">{f.name}</td>
                  <td className="px-5 py-3.5">{f.category}</td>
                  <td className="px-5 py-3.5 text-slate-600 max-w-md truncate">{f.description}</td>
                  <td className="px-5 py-3.5 text-right">
                    <button
                      onClick={async () => {
                        await api.deleteFacility(f.id);
                        loadAllCms();
                      }}
                      className="p-1 text-slate-400 hover:text-rose-600"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Achievements Tab */}
      {activeTab === 'achievements' && (
        <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-xs">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50 border-b border-slate-200 text-slate-500 uppercase font-semibold">
              <tr>
                <th className="px-5 py-3.5">Achievement Title</th>
                <th className="px-5 py-3.5">Recipient</th>
                <th className="px-5 py-3.5">Year</th>
                <th className="px-5 py-3.5 text-right">Delete</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {achievements.map((a) => (
                <tr key={a.id} className="hover:bg-slate-50/70">
                  <td className="px-5 py-3.5 font-bold text-slate-900">{a.title}</td>
                  <td className="px-5 py-3.5 text-indigo-700 font-semibold">{a.recipient}</td>
                  <td className="px-5 py-3.5 text-slate-600">{a.year}</td>
                  <td className="px-5 py-3.5 text-right">
                    <button
                      onClick={async () => {
                        await api.deleteAchievement(a.id);
                        loadAllCms();
                      }}
                      className="p-1 text-slate-400 hover:text-rose-600"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Dynamic Item Modal */}
      <Modal isOpen={isAddOpen} onClose={() => setIsAddOpen(false)} title={`Add ${activeTab.slice(0, -1)}`}>
        <form onSubmit={handleCreateDynamicItem} className="space-y-4">
          {activeTab === 'notices' && (
            <>
              <div className="space-y-1">
                <label className="text-xs font-semibold">Notice Title *</label>
                <input
                  type="text"
                  required
                  value={noticeForm.title}
                  onChange={e => setNoticeForm({ ...noticeForm, title: e.target.value })}
                  className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs"
                />
              </div>
              <div className="space-y-1">
                <label className="text-xs font-semibold">Category</label>
                <select
                  value={noticeForm.category}
                  onChange={e => setNoticeForm({ ...noticeForm, category: e.target.value })}
                  className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs bg-white"
                >
                  <option value="Academic">Academic</option>
                  <option value="Exam">Exam</option>
                  <option value="Admission">Admission</option>
                  <option value="Sports">Sports</option>
                  <option value="General">General</option>
                </select>
              </div>
              <div className="space-y-1">
                <label className="text-xs font-semibold">Content *</label>
                <textarea
                  rows={4}
                  required
                  value={noticeForm.content}
                  onChange={e => setNoticeForm({ ...noticeForm, content: e.target.value })}
                  className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs"
                />
              </div>
            </>
          )}

          {activeTab === 'events' && (
            <>
              <div className="space-y-1">
                <label className="text-xs font-semibold">Event Title *</label>
                <input
                  type="text"
                  required
                  value={eventForm.title}
                  onChange={e => setEventForm({ ...eventForm, title: e.target.value })}
                  className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs"
                />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="text-xs font-semibold">Date *</label>
                  <input
                    type="date"
                    required
                    value={eventForm.date}
                    onChange={e => setEventForm({ ...eventForm, date: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs"
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-xs font-semibold">Time</label>
                  <input
                    type="text"
                    value={eventForm.time}
                    onChange={e => setEventForm({ ...eventForm, time: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs"
                  />
                </div>
              </div>
              <div className="space-y-1">
                <label className="text-xs font-semibold">Venue *</label>
                <input
                  type="text"
                  required
                  value={eventForm.venue}
                  onChange={e => setEventForm({ ...eventForm, venue: e.target.value })}
                  className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs"
                />
              </div>
              <div className="space-y-1">
                <label className="text-xs font-semibold">Description</label>
                <textarea
                  rows={3}
                  value={eventForm.description}
                  onChange={e => setEventForm({ ...eventForm, description: e.target.value })}
                  className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs"
                />
              </div>
            </>
          )}

          {activeTab === 'gallery' && (
            <>
              <div className="space-y-1">
                <label className="text-xs font-semibold">Photo Title *</label>
                <input
                  type="text"
                  required
                  value={galleryForm.title}
                  onChange={e => setGalleryForm({ ...galleryForm, title: e.target.value })}
                  className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs"
                />
              </div>
              <div className="space-y-1">
                <label className="text-xs font-semibold">Category</label>
                <input
                  type="text"
                  value={galleryForm.category}
                  onChange={e => setGalleryForm({ ...galleryForm, category: e.target.value })}
                  className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs"
                />
              </div>
              <div className="space-y-1">
                <label className="text-xs font-semibold">Image URL *</label>
                <input
                  type="text"
                  required
                  value={galleryForm.imageUrl}
                  onChange={e => setGalleryForm({ ...galleryForm, imageUrl: e.target.value })}
                  className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs"
                />
              </div>
            </>
          )}

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
              Publish to PostgreSQL
            </button>
          </div>
        </form>
      </Modal>
    </div>
  );
};
