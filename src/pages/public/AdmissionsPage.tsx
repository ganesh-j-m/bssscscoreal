import React, { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { CheckCircle2, FileText, ArrowRight, Sparkles, AlertCircle, ShieldCheck } from 'lucide-react';
import { api } from '../../services/api.ts';

const admissionSchema = z.object({
  applicantName: z.string().min(3, 'Full Name is required (minimum 3 characters)'),
  email: z.string().email('Valid Email address is required'),
  phone: z.string().min(10, 'Valid 10-digit phone number is required'),
  course: z.string().min(1, 'Please select a program'),
  previousPercentage: z.string().min(1, 'Previous percentage / marks is required'),
  previousCollege: z.string().min(2, 'Name of Previous School/Junior College is required'),
  category: z.string(),
  notes: z.string().optional(),
});

type AdmissionFormData = z.infer<typeof admissionSchema>;

export const AdmissionsPage: React.FC = () => {
  const [cmsInfo, setCmsInfo] = useState<any>(null);
  const [courses, setCourses] = useState<any[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submittedApp, setSubmittedApp] = useState<{ applicationNumber: string; applicantName: string } | null>(null);
  const [submitError, setSubmitError] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<AdmissionFormData>({
    resolver: zodResolver(admissionSchema) as any,
    defaultValues: {
      category: 'General',
    },
  });

  useEffect(() => {
    api.getCmsSection('admissions_info').then(res => {
      if (res.data) setCmsInfo(res.data);
    }).catch(console.error);

    api.getCourses().then(res => {
      if (res.courses) setCourses(res.courses);
    }).catch(console.error);
  }, []);

  const onSubmit = async (data: AdmissionFormData) => {
    setIsSubmitting(true);
    setSubmitError(null);
    try {
      const response = await api.submitAdmission(data);
      if (response.success && response.applicationNumber) {
        setSubmittedApp({
          applicationNumber: response.applicationNumber,
          applicantName: data.applicantName,
        });
        reset();
      }
    } catch (err: any) {
      setSubmitError(err.message || 'Failed to submit admission application.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="space-y-16 pb-20">
      <div className="bg-slate-900 text-white py-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto space-y-4">
          <span className="text-xs font-semibold text-indigo-400 uppercase tracking-wider">
            Academic Admissions 2025-26
          </span>
          <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight">
            Online Admission Registration
          </h1>
          <p className="text-base text-slate-300 max-w-2xl">
            Register your application for undergraduate and postgraduate degree courses at Sharadabai Pawar College, Omerga.
          </p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
          {/* Form Column */}
          <div className="lg:col-span-7 bg-white rounded-2xl border border-slate-200 p-6 sm:p-8 shadow-xs">
            {submittedApp ? (
              <div className="p-8 text-center space-y-4 bg-emerald-50 rounded-2xl border border-emerald-200">
                <div className="w-14 h-14 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center mx-auto">
                  <CheckCircle2 className="w-8 h-8" />
                </div>
                <h3 className="text-xl font-bold text-slate-900">Application Submitted Successfully!</h3>
                <p className="text-xs text-slate-600 max-w-md mx-auto">
                  Thank you, <strong>{submittedApp.applicantName}</strong>. Your online admission application has been registered in the college admissions database.
                </p>
                <div className="p-4 rounded-xl bg-white border border-emerald-200 inline-block">
                  <span className="text-xs text-slate-500 font-medium block">Application Number:</span>
                  <span className="text-lg font-mono font-bold text-indigo-700 tracking-wider">
                    {submittedApp.applicationNumber}
                  </span>
                </div>
                <p className="text-[11px] text-slate-500">
                  Please quote this application number during document verification at the central campus counter in Omerga.
                </p>
                <button
                  onClick={() => setSubmittedApp(null)}
                  className="mt-4 px-5 py-2.5 rounded-xl bg-indigo-600 text-white font-semibold text-xs hover:bg-indigo-700"
                >
                  Submit Another Application
                </button>
              </div>
            ) : (
              <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
                <div className="border-b border-slate-100 pb-3">
                  <h3 className="text-lg font-bold text-slate-900">Applicant Details</h3>
                  <p className="text-xs text-slate-500">All fields marked with an asterisk are required.</p>
                </div>

                {submitError && (
                  <div className="p-3.5 rounded-xl bg-rose-50 border border-rose-200 text-xs text-rose-700 flex items-center gap-2">
                    <AlertCircle className="w-4 h-4 shrink-0" />
                    <span>{submitError}</span>
                  </div>
                )}

                <div className="space-y-1">
                  <label className="text-xs font-semibold text-slate-700">Full Name *</label>
                  <input
                    type="text"
                    placeholder="Enter student's full name"
                    {...register('applicantName')}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs text-slate-800 focus:outline-hidden focus:border-indigo-600 focus:ring-2 focus:ring-indigo-500/20"
                  />
                  {errors.applicantName && <p className="text-[11px] text-rose-600">{errors.applicantName.message}</p>}
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-1">
                    <label className="text-xs font-semibold text-slate-700">Email Address *</label>
                    <input
                      type="email"
                      placeholder="e.g. applicant@gmail.com"
                      {...register('email')}
                      className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs text-slate-800 focus:outline-hidden focus:border-indigo-600 focus:ring-2 focus:ring-indigo-500/20"
                    />
                    {errors.email && <p className="text-[11px] text-rose-600">{errors.email.message}</p>}
                  </div>

                  <div className="space-y-1">
                    <label className="text-xs font-semibold text-slate-700">Phone Number *</label>
                    <input
                      type="tel"
                      placeholder="e.g. +91 98765 43210"
                      {...register('phone')}
                      className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs text-slate-800 focus:outline-hidden focus:border-indigo-600 focus:ring-2 focus:ring-indigo-500/20"
                    />
                    {errors.phone && <p className="text-[11px] text-rose-600">{errors.phone.message}</p>}
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-1">
                    <label className="text-xs font-semibold text-slate-700">Program / Degree Sought *</label>
                    <select
                      {...register('course')}
                      className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs text-slate-800 focus:outline-hidden focus:border-indigo-600 focus:ring-2 focus:ring-indigo-500/20 bg-white"
                    >
                      <option value="">Select a Program</option>
                      {courses.map(c => (
                        <option key={c.id} value={c.name}>{c.name} ({c.degreeType})</option>
                      ))}
                    </select>
                    {errors.course && <p className="text-[11px] text-rose-600">{errors.course.message}</p>}
                  </div>

                  <div className="space-y-1">
                    <label className="text-xs font-semibold text-slate-700">Social Category</label>
                    <select
                      {...register('category')}
                      className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs text-slate-800 focus:outline-hidden focus:border-indigo-600 focus:ring-2 focus:ring-indigo-500/20 bg-white"
                    >
                      <option value="General">General / OPEN</option>
                      <option value="OBC">OBC</option>
                      <option value="SC">SC</option>
                      <option value="ST">ST</option>
                      <option value="EWS">EWS</option>
                      <option value="NT/VJNT">NT / VJNT</option>
                    </select>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-1">
                    <label className="text-xs font-semibold text-slate-700">Previous Exam Percentage / Grade *</label>
                    <input
                      type="text"
                      placeholder="e.g. 78.40% in HSC"
                      {...register('previousPercentage')}
                      className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs text-slate-800 focus:outline-hidden focus:border-indigo-600 focus:ring-2 focus:ring-indigo-500/20"
                    />
                    {errors.previousPercentage && <p className="text-[11px] text-rose-600">{errors.previousPercentage.message}</p>}
                  </div>

                  <div className="space-y-1">
                    <label className="text-xs font-semibold text-slate-700">Previous School / College *</label>
                    <input
                      type="text"
                      placeholder="Name of Junior College / School"
                      {...register('previousCollege')}
                      className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs text-slate-800 focus:outline-hidden focus:border-indigo-600 focus:ring-2 focus:ring-indigo-500/20"
                    />
                    {errors.previousCollege && <p className="text-[11px] text-rose-600">{errors.previousCollege.message}</p>}
                  </div>
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-semibold text-slate-700">Additional Remarks / Questions (Optional)</label>
                  <textarea
                    rows={3}
                    placeholder="Any specific questions regarding hostel, transport, scholarships..."
                    {...register('notes')}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs text-slate-800 focus:outline-hidden focus:border-indigo-600 focus:ring-2 focus:ring-indigo-500/20"
                  />
                </div>

                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full py-3.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs sm:text-sm shadow-md transition-all disabled:opacity-50"
                >
                  {isSubmitting ? 'Registering Application in Database...' : 'Submit Online Admission Registration'}
                </button>
              </form>
            )}
          </div>

          {/* Guidelines & Documents Required Column */}
          <div className="lg:col-span-5 space-y-6">
            <div className="bg-white rounded-2xl border border-slate-200 p-6 space-y-4">
              <span className="text-xs font-semibold text-indigo-600 uppercase tracking-wider">Admission Instructions</span>
              <h3 className="text-lg font-bold text-slate-900">Verification Guidelines</h3>
              <p className="text-xs text-slate-600 leading-relaxed">
                {cmsInfo?.instruction ||
                  'Admissions are granted in accordance with Dr. Babasaheb Ambedkar Marathwada University regulations. Once the online form is submitted, candidates must visit the Omerga campus counter with original documents for document verification.'}
              </p>
            </div>

            <div className="bg-slate-50 rounded-2xl border border-slate-200 p-6 space-y-3">
              <div className="flex items-center space-x-2 text-indigo-600 font-bold text-sm">
                <FileText className="w-4 h-4" />
                <span>Mandatory Documents for Verification</span>
              </div>
              <ul className="space-y-2 text-xs text-slate-600 pt-2">
                <li className="flex items-start gap-2">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0 mt-0.5" />
                  <span>10th (SSC) & 12th (HSC) Original Marksheets & 2 Xerox copies</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0 mt-0.5" />
                  <span>College Leaving Certificate (Transfer Certificate - TC)</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0 mt-0.5" />
                  <span>Caste Certificate & Validity Certificate (if applicable)</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0 mt-0.5" />
                  <span>Aadhaar Card Copy & 4 Passport size color photographs</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0 mt-0.5" />
                  <span>Income Certificate for government scholarship concessions</span>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
