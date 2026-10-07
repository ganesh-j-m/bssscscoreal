import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import {
  GraduationCap,
  ArrowRight,
  BookOpen,
  Users,
  Award,
  Building2,
  Calendar,
  Bell,
  CheckCircle2,
  Sparkles,
  MapPin,
  ChevronRight,
  ShieldCheck,
  Briefcase,
  Play
} from 'lucide-react';
import { api } from '../../services/api.ts';
import { Notice, EventItem, Department, Course, PlacementDrive } from '../../types/index.ts';

export const HomePage: React.FC = () => {
  const [heroData, setHeroData] = useState<any>(null);
  const [notices, setNotices] = useState<Notice[]>([]);
  const [events, setEvents] = useState<EventItem[]>([]);
  const [departments, setDepartments] = useState<Department[]>([]);
  const [placements, setPlacements] = useState<PlacementDrive[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [heroRes, noticesRes, eventsRes, deptRes, placeRes] = await Promise.allSettled([
          api.getCmsSection('homepage_hero'),
          api.getNotices(),
          api.getEvents(),
          api.getDepartments(),
          api.getPlacements(),
        ]);

        if (heroRes.status === 'fulfilled' && heroRes.value.data) {
          setHeroData(heroRes.value.data);
        }
        if (noticesRes.status === 'fulfilled' && noticesRes.value.notices) {
          setNotices(noticesRes.value.notices.slice(0, 4));
        }
        if (eventsRes.status === 'fulfilled' && eventsRes.value.events) {
          setEvents(eventsRes.value.events.slice(0, 3));
        }
        if (deptRes.status === 'fulfilled' && deptRes.value.departments) {
          setDepartments(deptRes.value.departments.slice(0, 4));
        }
        if (placeRes.status === 'fulfilled' && placeRes.value.placements) {
          setPlacements(placeRes.value.placements.slice(0, 3));
        }
      } catch (err) {
        console.error('Home data load error:', err);
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, []);

  return (
    <div className="space-y-20 pb-20">
      {/* 1. HERO SECTION */}
      <section className="relative overflow-hidden bg-slate-900 text-white">
        <div className="absolute inset-0">
          <img
            src={heroData?.heroBanner || 'https://images.unsplash.com/photo-1541339907198-e08756dedf3f?auto=format&fit=crop&q=80&w=1600'}
            alt="Sharadabai Pawar College Omerga Campus"
            className="w-full h-full object-cover object-center opacity-25 filter brightness-90"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-slate-950 via-slate-900/90 to-slate-900/40" />
        </div>

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24 lg:py-32">
          <div className="max-w-3xl space-y-6">
            <div className="inline-flex items-center space-x-2 px-3.5 py-1.5 rounded-full bg-indigo-500/20 border border-indigo-400/30 text-indigo-300 text-xs font-semibold tracking-wide uppercase">
              <Sparkles className="w-3.5 h-3.5 text-indigo-400" />
              <span>Sharadabai Pawar College, Omerga • Est. 1990</span>
            </div>

            <h1 className="text-3xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight text-white leading-tight">
              Empowering Minds, <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 to-sky-300">
                Inspiring Futures.
              </span>
            </h1>

            <p className="text-base sm:text-lg text-slate-300 font-normal leading-relaxed max-w-2xl">
              {heroData?.heroSubtitle ||
                'A premier institution for higher learning in Marathwada offering advanced education in Computer Science, IT, Commerce, Sciences, and Humanities with modern research laboratories.'}
            </p>

            <div className="pt-4 flex flex-wrap items-center gap-4">
              <Link
                to="/admissions"
                className="inline-flex items-center space-x-2 px-6 py-3.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-semibold text-sm shadow-lg shadow-indigo-600/30 hover:scale-[1.02] transition-all"
              >
                <span>Admissions 2025-26</span>
                <ArrowRight className="w-4 h-4" />
              </Link>
              <Link
                to="/courses"
                className="inline-flex items-center space-x-2 px-6 py-3.5 rounded-xl bg-slate-800/80 hover:bg-slate-700/90 text-slate-200 border border-slate-700 font-semibold text-sm hover:scale-[1.02] transition-all"
              >
                <BookOpen className="w-4 h-4 text-indigo-400" />
                <span>Explore Programs</span>
              </Link>
              <Link
                to="/login"
                className="inline-flex items-center space-x-2 px-5 py-3.5 rounded-xl bg-white/10 hover:bg-white/20 text-white font-medium text-sm transition-all"
              >
                <span>Digital ERP Portal</span>
              </Link>
            </div>
          </div>
        </div>

        {/* Highlight Stats Strip */}
        <div className="relative border-t border-slate-800 bg-slate-950/70 backdrop-blur-md">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
              <div>
                <span className="text-2xl sm:text-3xl font-bold text-white tracking-tight">34+</span>
                <p className="text-xs text-slate-400 uppercase tracking-wider font-semibold mt-0.5">Years of Excellence</p>
              </div>
              <div>
                <span className="text-2xl sm:text-3xl font-bold text-white tracking-tight">3,200+</span>
                <p className="text-xs text-slate-400 uppercase tracking-wider font-semibold mt-0.5">Active Students</p>
              </div>
              <div>
                <span className="text-2xl sm:text-3xl font-bold text-white tracking-tight">85+</span>
                <p className="text-xs text-slate-400 uppercase tracking-wider font-semibold mt-0.5">Dedicated Faculty</p>
              </div>
              <div>
                <span className="text-2xl sm:text-3xl font-bold text-indigo-400 tracking-tight">NAAC 'A'</span>
                <p className="text-xs text-slate-400 uppercase tracking-wider font-semibold mt-0.5">Accredited Grade</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 2. NOTICES TICKER & ANNOUNCEMENTS */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-white rounded-2xl border border-slate-200/80 shadow-xs p-6">
          <div className="flex flex-col md:flex-row items-start md:items-center justify-between pb-4 border-b border-slate-100 gap-4">
            <div className="flex items-center space-x-3">
              <div className="p-2.5 rounded-xl bg-indigo-50 text-indigo-600">
                <Bell className="w-5 h-5" />
              </div>
              <div>
                <h2 className="text-lg font-bold text-slate-900">Latest Circulars & Examination Notices</h2>
                <p className="text-xs text-slate-500">Official updates from University and College Administration</p>
              </div>
            </div>
            <Link
              to="/notices"
              className="text-xs font-semibold text-indigo-600 hover:text-indigo-700 flex items-center gap-1"
            >
              <span>View All Circulars</span>
              <ChevronRight className="w-4 h-4" />
            </Link>
          </div>

          <div className="mt-4 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {notices.map((n) => (
              <div
                key={n.id}
                className="p-4 rounded-xl bg-slate-50 border border-slate-100 hover:border-indigo-200 transition-all hover:shadow-xs group"
              >
                <div className="flex items-center justify-between mb-2">
                  <span className="text-[11px] font-semibold px-2 py-0.5 rounded-md bg-indigo-100 text-indigo-700">
                    {n.category}
                  </span>
                  <span className="text-[11px] text-slate-400">{n.date}</span>
                </div>
                <h3 className="text-xs sm:text-sm font-semibold text-slate-800 line-clamp-2 group-hover:text-indigo-600 transition-colors">
                  {n.title}
                </h3>
                <p className="text-xs text-slate-500 mt-1 line-clamp-2">{n.content}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 3. FEATURED DEPARTMENTS */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-8 gap-4">
          <div>
            <span className="text-xs font-semibold text-indigo-600 tracking-wider uppercase block">
              Academic Excellence
            </span>
            <h2 className="text-2xl sm:text-3xl font-bold text-slate-900 mt-1">Our Core Departments</h2>
          </div>
          <Link
            to="/departments"
            className="inline-flex items-center space-x-1.5 text-sm font-semibold text-indigo-600 hover:text-indigo-700"
          >
            <span>Explore All Departments</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {departments.map((dept) => (
            <div
              key={dept.id}
              className="bg-white rounded-2xl border border-slate-200/80 overflow-hidden shadow-xs hover:shadow-md transition-all hover:-translate-y-1 group"
            >
              <div className="h-44 overflow-hidden relative">
                <img
                  src={dept.image || 'https://images.unsplash.com/photo-1517694712202-14dd9538aa97?auto=format&fit=crop&q=80&w=800'}
                  alt={dept.name}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                />
                <div className="absolute top-3 left-3 px-2 py-0.5 rounded-md bg-slate-900/80 backdrop-blur-xs text-[11px] font-semibold text-white">
                  {dept.code}
                </div>
              </div>
              <div className="p-5">
                <h3 className="font-bold text-slate-900 text-base group-hover:text-indigo-600 transition-colors">
                  {dept.name}
                </h3>
                <p className="text-xs text-slate-500 font-medium mt-1">HOD: {dept.hod}</p>
                <p className="text-xs text-slate-600 mt-2 line-clamp-2">{dept.description}</p>
                <Link
                  to="/courses"
                  className="mt-4 inline-flex items-center space-x-1 text-xs font-semibold text-indigo-600 hover:text-indigo-700"
                >
                  <span>View Programs</span>
                  <ChevronRight className="w-3.5 h-3.5" />
                </Link>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* 4. PRINCIPAL MESSAGE PREVIEW & VISION */}
      <section className="bg-slate-100/70 border-y border-slate-200 py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-center">
            <div className="lg:col-span-5">
              <div className="relative rounded-2xl overflow-hidden shadow-lg border-4 border-white">
                <img
                  src="https://images.unsplash.com/photo-1560250097-0b93528c311a?auto=format&fit=crop&q=80&w=800"
                  alt="Principal Dr. Suresh V. Patil"
                  className="w-full h-96 object-cover object-top"
                />
                <div className="absolute bottom-0 inset-x-0 bg-gradient-to-t from-slate-950 via-slate-900/80 to-transparent p-5 text-white">
                  <h4 className="font-bold text-base">Dr. Suresh V. Patil</h4>
                  <p className="text-xs text-indigo-300 font-medium">Principal & Academic Leader</p>
                  <p className="text-[11px] text-slate-300 mt-0.5">M.Sc., Ph.D., Postdoc (USA)</p>
                </div>
              </div>
            </div>

            <div className="lg:col-span-7 space-y-5">
              <span className="text-xs font-semibold text-indigo-600 tracking-wider uppercase block">
                Principal's Message
              </span>
              <h2 className="text-2xl sm:text-3xl font-bold text-slate-900 leading-tight">
                "Fostering Academic Merit, Research Temperament & Character in Rural Youth."
              </h2>
              <p className="text-sm text-slate-600 leading-relaxed">
                Sharadabai Pawar College, Omerga has been a beacon of higher learning for more than three decades. Our mission is to democratize technological and scientific education, providing students from rural backgrounds with the tools to compete on global platforms.
              </p>
              <div className="grid grid-cols-2 gap-4 pt-2">
                <div className="p-3.5 rounded-xl bg-white border border-slate-200">
                  <span className="text-lg font-bold text-slate-900 block">Digital ERP</span>
                  <span className="text-xs text-slate-500">Live attendance, marks, fees & notices</span>
                </div>
                <div className="p-3.5 rounded-xl bg-white border border-slate-200">
                  <span className="text-lg font-bold text-slate-900 block">Industry Tie-ups</span>
                  <span className="text-xs text-slate-500">Recruitments by TCS, Infosys & Wipro</span>
                </div>
              </div>
              <div className="pt-2">
                <Link
                  to="/principal-message"
                  className="inline-flex items-center space-x-2 text-sm font-semibold text-indigo-600 hover:text-indigo-700"
                >
                  <span>Read Full Message from Principal's Desk</span>
                  <ArrowRight className="w-4 h-4" />
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 5. CAMPUS FACILITIES & PLACEMENTS STRIP */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Facilities Card */}
          <div className="bg-white rounded-2xl border border-slate-200 p-6 sm:p-8 space-y-6">
            <div>
              <span className="text-xs font-semibold text-indigo-600 uppercase tracking-wider">Infrastructure</span>
              <h3 className="text-xl font-bold text-slate-900 mt-1">World-Class Campus Facilities</h3>
              <p className="text-xs text-slate-500 mt-1">Equipped with 180+ computers, fiber-optic internet, and research laboratories.</p>
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div className="p-3 rounded-xl bg-slate-50 border border-slate-100 flex items-center space-x-3">
                <Building2 className="w-5 h-5 text-indigo-600 shrink-0" />
                <div>
                  <h4 className="text-xs font-bold text-slate-800">Software Labs</h4>
                  <p className="text-[10px] text-slate-500">180 Workstations</p>
                </div>
              </div>
              <div className="p-3 rounded-xl bg-slate-50 border border-slate-100 flex items-center space-x-3">
                <BookOpen className="w-5 h-5 text-indigo-600 shrink-0" />
                <div>
                  <h4 className="text-xs font-bold text-slate-800">Central Library</h4>
                  <p className="text-[10px] text-slate-500">45,000+ Books</p>
                </div>
              </div>
              <div className="p-3 rounded-xl bg-slate-50 border border-slate-100 flex items-center space-x-3">
                <Award className="w-5 h-5 text-indigo-600 shrink-0" />
                <div>
                  <h4 className="text-xs font-bold text-slate-800">Sports Pavilion</h4>
                  <p className="text-[10px] text-slate-500">Track & Courts</p>
                </div>
              </div>
              <div className="p-3 rounded-xl bg-slate-50 border border-slate-100 flex items-center space-x-3">
                <Users className="w-5 h-5 text-indigo-600 shrink-0" />
                <div>
                  <h4 className="text-xs font-bold text-slate-800">Auditorium</h4>
                  <p className="text-[10px] text-slate-500">600 Seat Hall</p>
                </div>
              </div>
            </div>
            <Link
              to="/facilities"
              className="inline-flex items-center space-x-2 text-xs font-semibold text-indigo-600 hover:text-indigo-700"
            >
              <span>Explore All Campus Facilities</span>
              <ChevronRight className="w-4 h-4" />
            </Link>
          </div>

          {/* Placements Highlight Card */}
          <div className="bg-white rounded-2xl border border-slate-200 p-6 sm:p-8 space-y-6">
            <div>
              <span className="text-xs font-semibold text-indigo-600 uppercase tracking-wider">Career Acceleration</span>
              <h3 className="text-xl font-bold text-slate-900 mt-1">Campus Recruitment Drives</h3>
              <p className="text-xs text-slate-500 mt-1">Leading multi-national corporations visit annually for recruitment.</p>
            </div>
            <div className="space-y-3">
              {placements.map((p) => (
                <div key={p.id} className="p-3 rounded-xl bg-slate-50 border border-slate-100 flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <Briefcase className="w-4 h-4 text-indigo-600 shrink-0" />
                    <div>
                      <h4 className="text-xs font-bold text-slate-900">{p.company}</h4>
                      <p className="text-[11px] text-slate-500">{p.jobTitle}</p>
                    </div>
                  </div>
                  <span className="text-xs font-bold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded">
                    {p.package}
                  </span>
                </div>
              ))}
            </div>
            <Link
              to="/placements"
              className="inline-flex items-center space-x-2 text-xs font-semibold text-indigo-600 hover:text-indigo-700"
            >
              <span>View Full Placement Records</span>
              <ChevronRight className="w-4 h-4" />
            </Link>
          </div>
        </div>
      </section>

      {/* 6. UPCOMING EVENTS & PHOTO GALLERY PREVIEW */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-8 gap-4">
          <div>
            <span className="text-xs font-semibold text-indigo-600 tracking-wider uppercase block">
              Campus Happenings
            </span>
            <h2 className="text-2xl sm:text-3xl font-bold text-slate-900 mt-1">Upcoming Events & Activities</h2>
          </div>
          <Link
            to="/events"
            className="inline-flex items-center space-x-1.5 text-sm font-semibold text-indigo-600 hover:text-indigo-700"
          >
            <span>View All Events</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {events.map((ev) => (
            <div
              key={ev.id}
              className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-xs hover:shadow-md transition-all group"
            >
              <div className="h-44 overflow-hidden relative">
                <img
                  src={ev.image || 'https://images.unsplash.com/photo-1540575467063-178a50c2df87?auto=format&fit=crop&q=80&w=800'}
                  alt={ev.title}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                />
                <div className="absolute top-3 left-3 px-2 py-0.5 rounded-md bg-indigo-600 text-white text-[10px] font-semibold">
                  {ev.category}
                </div>
              </div>
              <div className="p-5 space-y-2">
                <div className="flex items-center space-x-2 text-xs text-slate-400">
                  <Calendar className="w-3.5 h-3.5 text-indigo-600" />
                  <span>{ev.date}</span>
                </div>
                <h3 className="font-bold text-sm text-slate-900 group-hover:text-indigo-600 transition-colors line-clamp-1">
                  {ev.title}
                </h3>
                <p className="text-xs text-slate-500 line-clamp-2">{ev.description}</p>
                <p className="text-[11px] text-slate-400 font-medium pt-1">Venue: {ev.venue}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* 7. QUICK ADMISSION ENQUIRY CTA */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="rounded-3xl bg-gradient-to-r from-indigo-900 via-indigo-800 to-slate-900 p-8 sm:p-12 text-white relative overflow-hidden shadow-xl">
          <div className="max-w-2xl relative z-10 space-y-4">
            <span className="text-xs font-bold text-indigo-300 uppercase tracking-wider">
              Ready to Join Us?
            </span>
            <h2 className="text-2xl sm:text-4xl font-extrabold tracking-tight">
              Begin Your Higher Education Journey at Sharadabai Pawar College
            </h2>
            <p className="text-sm text-slate-200 leading-relaxed">
              Submit your online admission form or connect with our campus counselors in Omerga. Merit scholarships available for qualifying candidates.
            </p>
            <div className="pt-2 flex flex-wrap gap-4">
              <Link
                to="/admissions"
                className="inline-flex items-center space-x-2 px-6 py-3 rounded-xl bg-white text-indigo-900 font-bold text-sm hover:bg-slate-100 transition-all shadow-md"
              >
                <span>Online Admission Form</span>
                <ArrowRight className="w-4 h-4" />
              </Link>
              <Link
                to="/contact"
                className="inline-flex items-center space-x-2 px-6 py-3 rounded-xl bg-indigo-700/60 hover:bg-indigo-700 text-white font-semibold text-sm border border-indigo-500/30 transition-all"
              >
                <span>Contact Admissions Desk</span>
              </Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};
