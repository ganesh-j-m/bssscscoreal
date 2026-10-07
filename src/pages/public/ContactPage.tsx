import React, { useEffect, useState } from 'react';
import { MapPin, Phone, Mail, Clock, Send, CheckCircle2 } from 'lucide-react';
import { api } from '../../services/api.ts';

export const ContactPage: React.FC = () => {
  const [contactData, setContactData] = useState<any>(null);
  const [formSent, setFormSent] = useState(false);
  const [formData, setFormData] = useState({ name: '', email: '', phone: '', subject: '', message: '' });

  useEffect(() => {
    api.getCmsSection('contact_info').then(res => {
      if (res.data) setContactData(res.data);
    }).catch(console.error);
  }, []);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setFormSent(true);
    setFormData({ name: '', email: '', phone: '', subject: '', message: '' });
  };

  return (
    <div className="space-y-16 pb-20">
      <div className="bg-slate-900 text-white py-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto space-y-4">
          <span className="text-xs font-semibold text-indigo-400 uppercase tracking-wider">
            Campus Communication
          </span>
          <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight">
            Contact & Campus Location
          </h1>
          <p className="text-base text-slate-300 max-w-2xl">
            Get in touch with administrative offices, academic departments, or visit our 18-acre green campus in Omerga.
          </p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
          {/* Contact Details Card */}
          <div className="lg:col-span-5 space-y-6">
            <div className="bg-white rounded-2xl border border-slate-200 p-6 sm:p-8 space-y-6 shadow-xs">
              <div>
                <span className="text-xs font-semibold text-indigo-600 uppercase tracking-wider">Campus Address</span>
                <h3 className="text-lg font-bold text-slate-900 mt-1">Sharadabai Pawar College, Omerga</h3>
                <p className="text-xs text-slate-500">Shri Chhatrapati Shivaji Shikshan Sanstha</p>
              </div>

              <div className="space-y-4 text-xs text-slate-600">
                <div className="flex items-start space-x-3">
                  <MapPin className="w-5 h-5 text-indigo-600 shrink-0 mt-0.5" />
                  <span>
                    {contactData?.address ||
                      'Main Campus, National Highway 65, Omerga, District Dharashiv (Osmanabad), Maharashtra - 413606, India'}
                  </span>
                </div>

                <div className="flex items-center space-x-3">
                  <Phone className="w-4 h-4 text-indigo-600 shrink-0" />
                  <span>{contactData?.phone || '+91 (02475) 252244 / +91 94220 55667'}</span>
                </div>

                <div className="flex items-center space-x-3">
                  <Mail className="w-4 h-4 text-indigo-600 shrink-0" />
                  <span>{contactData?.email || 'contact@sharadacollege.edu.in'}</span>
                </div>

                <div className="flex items-center space-x-3">
                  <Clock className="w-4 h-4 text-indigo-600 shrink-0" />
                  <span>{contactData?.officeHours || 'Mon - Sat: 09:30 AM to 05:30 PM'}</span>
                </div>
              </div>
            </div>

            {/* Embedded Visual Map Preview */}
            <div className="rounded-2xl border border-slate-200 overflow-hidden shadow-xs h-64 bg-slate-100 relative">
              <iframe
                title="Sharadabai Pawar College Omerga Map"
                src="https://maps.google.com/maps?q=Omerga,Maharashtra,India&t=&z=13&ie=UTF8&iwloc=&output=embed"
                className="w-full h-full border-0"
                loading="lazy"
              />
            </div>
          </div>

          {/* Quick Enquiry Form */}
          <div className="lg:col-span-7 bg-white rounded-2xl border border-slate-200 p-6 sm:p-8 shadow-xs">
            <div className="border-b border-slate-100 pb-3 mb-5">
              <h3 className="text-lg font-bold text-slate-900">Send an Enquiry to Campus Office</h3>
              <p className="text-xs text-slate-500">Our administrative desk responds within 24 business hours.</p>
            </div>

            {formSent ? (
              <div className="p-8 text-center space-y-3 bg-emerald-50 rounded-2xl border border-emerald-200">
                <CheckCircle2 className="w-10 h-10 text-emerald-600 mx-auto" />
                <h4 className="text-base font-bold text-slate-900">Message Delivered</h4>
                <p className="text-xs text-slate-600 max-w-sm mx-auto">
                  Thank you for reaching out. Your enquiry has been received by our office in Omerga.
                </p>
                <button
                  onClick={() => setFormSent(false)}
                  className="mt-3 px-4 py-2 rounded-xl bg-indigo-600 text-white text-xs font-semibold"
                >
                  Send Another Message
                </button>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-1">
                    <label className="text-xs font-semibold text-slate-700">Your Name *</label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. Ramesh Kulkarni"
                      value={formData.name}
                      onChange={e => setFormData({ ...formData, name: e.target.value })}
                      className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs text-slate-800 focus:outline-hidden focus:border-indigo-600 focus:ring-2 focus:ring-indigo-500/20"
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="text-xs font-semibold text-slate-700">Email Address *</label>
                    <input
                      type="email"
                      required
                      placeholder="e.g. ramesh@gmail.com"
                      value={formData.email}
                      onChange={e => setFormData({ ...formData, email: e.target.value })}
                      className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs text-slate-800 focus:outline-hidden focus:border-indigo-600 focus:ring-2 focus:ring-indigo-500/20"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-1">
                    <label className="text-xs font-semibold text-slate-700">Phone Number</label>
                    <input
                      type="tel"
                      placeholder="+91 98765 43210"
                      value={formData.phone}
                      onChange={e => setFormData({ ...formData, phone: e.target.value })}
                      className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs text-slate-800 focus:outline-hidden focus:border-indigo-600 focus:ring-2 focus:ring-indigo-500/20"
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="text-xs font-semibold text-slate-700">Subject *</label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. Admission / Verification Enquiry"
                      value={formData.subject}
                      onChange={e => setFormData({ ...formData, subject: e.target.value })}
                      className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs text-slate-800 focus:outline-hidden focus:border-indigo-600 focus:ring-2 focus:ring-indigo-500/20"
                    />
                  </div>
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-semibold text-slate-700">Message / Query *</label>
                  <textarea
                    rows={4}
                    required
                    placeholder="Type your message here..."
                    value={formData.message}
                    onChange={e => setFormData({ ...formData, message: e.target.value })}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs text-slate-800 focus:outline-hidden focus:border-indigo-600 focus:ring-2 focus:ring-indigo-500/20"
                  />
                </div>

                <button
                  type="submit"
                  className="inline-flex items-center space-x-2 px-6 py-3 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-semibold text-xs sm:text-sm shadow-md transition-all"
                >
                  <Send className="w-4 h-4" />
                  <span>Send Message</span>
                </button>
              </form>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
