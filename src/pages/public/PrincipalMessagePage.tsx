import React, { useEffect, useState } from 'react';
import { Mail, Phone, Award, BookOpen, CheckCircle, Quote } from 'lucide-react';
import { api } from '../../services/api.ts';

export const PrincipalMessagePage: React.FC = () => {
  const [data, setData] = useState<any>(null);

  useEffect(() => {
    api.getCmsSection('principal_profile').then(res => {
      if (res.data) setData(res.data);
    }).catch(console.error);
  }, []);

  return (
    <div className="space-y-16 pb-20">
      <div className="bg-slate-900 text-white py-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto space-y-4">
          <span className="text-xs font-semibold text-indigo-400 uppercase tracking-wider">
            Leadership & Vision
          </span>
          <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight">
            From the Desk of the Principal
          </h1>
          <p className="text-base text-slate-300 max-w-2xl">
            A message to prospective students, scholars, parents, and esteemed alumni of Sharadabai Pawar College, Omerga.
          </p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-start">
          {/* Principal Profile Box */}
          <div className="lg:col-span-4 bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-xs p-6 space-y-4 text-center">
            <div className="w-40 h-40 mx-auto rounded-2xl overflow-hidden shadow-md border-2 border-indigo-100">
              <img
                src={data?.photo || 'https://images.unsplash.com/photo-1560250097-0b93528c311a?auto=format&fit=crop&q=80&w=800'}
                alt={data?.name || 'Dr. Suresh V. Patil'}
                className="w-full h-full object-cover object-top"
              />
            </div>
            <div>
              <h2 className="text-lg font-bold text-slate-900">{data?.name || 'Dr. Suresh V. Patil'}</h2>
              <p className="text-xs font-semibold text-indigo-600">{data?.designation || 'Principal & Professor'}</p>
              <p className="text-[11px] text-slate-500 mt-1">{data?.qualifications || 'M.Sc., Ph.D., Postdoc (USA), F.I.C.S.'}</p>
            </div>
            <div className="pt-3 border-t border-slate-100 space-y-2 text-xs text-slate-600 text-left">
              <div className="flex items-center space-x-2">
                <Award className="w-4 h-4 text-indigo-600 shrink-0" />
                <span>{data?.experience || '28+ Years in Higher Education'}</span>
              </div>
              <div className="flex items-center space-x-2">
                <Mail className="w-4 h-4 text-indigo-600 shrink-0" />
                <span className="truncate">{data?.email || 'principal@sharadacollege.edu.in'}</span>
              </div>
              <div className="flex items-center space-x-2">
                <Phone className="w-4 h-4 text-indigo-600 shrink-0" />
                <span>{data?.phone || '+91 (02475) 252244'}</span>
              </div>
            </div>
          </div>

          {/* Letter & Detailed Message */}
          <div className="lg:col-span-8 bg-white rounded-2xl border border-slate-200 p-8 sm:p-10 space-y-6">
            <div className="text-indigo-600 opacity-20">
              <Quote className="w-12 h-12" />
            </div>

            <div className="space-y-4 text-sm text-slate-700 leading-relaxed font-normal">
              <p className="text-base font-semibold text-slate-900">
                Dear Students, Parents, and Well-Wishers,
              </p>
              <p>
                {data?.message ||
                  'Welcome to Sharadabai Pawar College, Omerga. Established under the visionary leadership of Shri Chhatrapati Shivaji Shikshan Sanstha in 1990, our college has consistently served as an engine of social transformation and intellectual empowerment for rural youth across Marathwada.'}
              </p>
              <p>
                In today's fast-paced digital and technological era, collegiate education must transcend conventional book-learning. We place utmost emphasis on hands-on practical skills in computer software, laboratory experimentation, logical reasoning, and industry readiness.
              </p>
              <p>
                Our newly instituted SCSCO Digital Campus platform provides transparent, real-time access to student attendance, performance analytics, fee records, examination notices, and smart QR attendance tracking. This empowers parents and students with instant visibility into academic progress.
              </p>
              <p>
                I warmly invite you to become a part of our vibrant collegiate community, where knowledge meets character and ambition transforms into tangible achievement.
              </p>
            </div>

            <div className="pt-6 border-t border-slate-100 flex items-center justify-between">
              <div>
                <p className="text-sm font-bold text-slate-900">{data?.name || 'Dr. Suresh V. Patil'}</p>
                <p className="text-xs text-slate-500">Principal, Sharadabai Pawar College, Omerga</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
