import React from 'react';
import { Building2, Award, ShieldCheck, Target, HeartHandshake, BookOpen, Users, Compass } from 'lucide-react';

export const AboutPage: React.FC = () => {
  return (
    <div className="space-y-16 pb-20">
      {/* Header Banner */}
      <div className="bg-slate-900 text-white py-16 px-4 sm:px-6 lg:px-8 relative overflow-hidden">
        <div className="max-w-7xl mx-auto space-y-4">
          <span className="text-xs font-semibold text-indigo-400 uppercase tracking-wider">
            Institutional Legacy
          </span>
          <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight">
            About Sharadabai Pawar College, Omerga
          </h1>
          <p className="text-base text-slate-300 max-w-2xl">
            Established in 1990 by Shri Chhatrapati Shivaji Shikshan Sanstha to bring collegiate excellence and scientific temper to the youth of Marathwada.
          </p>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-16">
        {/* History & Establishment */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          <div className="space-y-5">
            <span className="text-xs font-bold text-indigo-600 uppercase tracking-wider">Our Heritage</span>
            <h2 className="text-2xl sm:text-3xl font-bold text-slate-900 leading-tight">
              More than Three Decades of Transformative Higher Education
            </h2>
            <p className="text-sm text-slate-600 leading-relaxed">
              Sharadabai Pawar College was founded with the resolute objective of addressing the educational aspirations of rural and semi-urban students in Omerga and neighboring regions of Dharashiv district.
            </p>
            <p className="text-sm text-slate-600 leading-relaxed">
              Over the past 34 years, the institution has blossomed from a humble start into a premier multi-faculty undergraduate and postgraduate collegiate campus with advanced computing laboratories, research facilities, and national accreditation.
            </p>
            <div className="pt-2 flex items-center space-x-6 text-xs text-slate-700 font-semibold">
              <span className="flex items-center gap-1.5"><ShieldCheck className="w-4 h-4 text-emerald-600" /> NAAC Grade 'A' Accredited</span>
              <span className="flex items-center gap-1.5"><Award className="w-4 h-4 text-indigo-600" /> AISHE Registered</span>
            </div>
          </div>
          <div className="relative rounded-2xl overflow-hidden shadow-lg border border-slate-200">
            <img
              src="https://images.unsplash.com/photo-1562774053-701939374585?auto=format&fit=crop&q=80&w=800"
              alt="Sharadabai Pawar College Campus"
              className="w-full h-80 object-cover"
            />
          </div>
        </div>

        {/* Vision & Mission Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="p-6 rounded-2xl bg-white border border-slate-200/80 shadow-xs space-y-3">
            <div className="w-10 h-10 rounded-xl bg-indigo-50 text-indigo-600 flex items-center justify-center">
              <Compass className="w-5 h-5" />
            </div>
            <h3 className="font-bold text-base text-slate-900">Our Vision</h3>
            <p className="text-xs text-slate-600 leading-relaxed">
              To be an institution of academic distinction that fosters critical scientific thinking, social responsibility, innovation, and ethical leadership in youth.
            </p>
          </div>

          <div className="p-6 rounded-2xl bg-white border border-slate-200/80 shadow-xs space-y-3">
            <div className="w-10 h-10 rounded-xl bg-indigo-50 text-indigo-600 flex items-center justify-center">
              <Target className="w-5 h-5" />
            </div>
            <h3 className="font-bold text-base text-slate-900">Our Mission</h3>
            <p className="text-xs text-slate-600 leading-relaxed">
              Providing holistic and affordable collegiate education with high industry relevance, state-of-the-art laboratory infrastructure, and career enablement tracks.
            </p>
          </div>

          <div className="p-6 rounded-2xl bg-white border border-slate-200/80 shadow-xs space-y-3">
            <div className="w-10 h-10 rounded-xl bg-indigo-50 text-indigo-600 flex items-center justify-center">
              <HeartHandshake className="w-5 h-5" />
            </div>
            <h3 className="font-bold text-base text-slate-900">Core Values</h3>
            <p className="text-xs text-slate-600 leading-relaxed">
              Integrity, academic discipline, inclusivity, research spirit, environmental stewardship through NSS, and empowerment of first-generation learners.
            </p>
          </div>
        </div>

        {/* Governance & Society */}
        <div className="bg-slate-50 rounded-2xl border border-slate-200 p-8 space-y-6">
          <div className="max-w-2xl">
            <span className="text-xs font-semibold text-indigo-600 uppercase tracking-wider">Management & Trust</span>
            <h3 className="text-xl font-bold text-slate-900 mt-1">Shri Chhatrapati Shivaji Shikshan Sanstha</h3>
            <p className="text-xs text-slate-600 mt-1">
              Governed by a visionary management board of distinguished educationists, administrators, and social reformers.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
            <div className="p-4 rounded-xl bg-white border border-slate-200">
              <span className="text-xs font-semibold text-slate-500">Founded Year</span>
              <p className="text-base font-bold text-slate-900 mt-0.5">1990</p>
            </div>
            <div className="p-4 rounded-xl bg-white border border-slate-200">
              <span className="text-xs font-semibold text-slate-500">Campus Location</span>
              <p className="text-base font-bold text-slate-900 mt-0.5">Omerga, Dharashiv District</p>
            </div>
            <div className="p-4 rounded-xl bg-white border border-slate-200">
              <span className="text-xs font-semibold text-slate-500">Campus Area</span>
              <p className="text-base font-bold text-slate-900 mt-0.5">18 Acres Lush Green Campus</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
