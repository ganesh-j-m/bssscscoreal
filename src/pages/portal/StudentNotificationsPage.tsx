import React, { useState } from 'react';
import {
  Bell,
  CheckCircle2,
  AlertTriangle,
  Info,
  Calendar,
  CreditCard,
  FileCheck
} from 'lucide-react';

interface NotificationItem {
  id: number;
  title: string;
  message: string;
  type: 'INFO' | 'WARNING' | 'SUCCESS' | 'ALERT';
  date: string;
  isRead: boolean;
  link?: string;
}

export const StudentNotificationsPage: React.FC = () => {
  const [notifications, setNotifications] = useState<NotificationItem[]>([
    {
      id: 1,
      title: 'Winter Semester Midterm Examination Timetable Released',
      message: 'The schedule for B.Sc. Comp Sci semester 3 examinations has been published. Check portal exams section.',
      type: 'INFO',
      date: '2025-01-10',
      isRead: false,
      link: '/portal/exams',
    },
    {
      id: 2,
      title: 'Smart QR Attendance Recorded Successfully',
      message: 'Your attendance for CS-302 Relational Database Systems was validated via QR scanner.',
      type: 'SUCCESS',
      date: '2025-01-09',
      isRead: true,
      link: '/portal/attendance',
    },
    {
      id: 3,
      title: 'Central Library Book Return Reminder',
      message: 'Your borrowed book "Introduction to Algorithms (CLRS)" is due in 3 days on 2025-01-15.',
      type: 'WARNING',
      date: '2025-01-08',
      isRead: false,
      link: '/portal/library',
    },
    {
      id: 4,
      title: 'Tuition Installment Receipt Generated',
      message: 'Payment of ₹12,000 against Academic Fee 2024-25 has been credited. Receipt #RCP202409 is ready.',
      type: 'SUCCESS',
      date: '2025-01-04',
      isRead: true,
      link: '/portal/fees',
    },
    {
      id: 5,
      title: 'Campus Placement Drive: TCS & Infosys Registration',
      message: 'Off-campus recruitment for final year students. Apply before 25th January 2025 on placement desk.',
      type: 'INFO',
      date: '2025-01-02',
      isRead: true,
      link: '/portal/placements',
    },
  ]);

  const markAllAsRead = () => {
    setNotifications((prev) => prev.map((n) => ({ ...n, isRead: true })));
  };

  const toggleRead = (id: number) => {
    setNotifications((prev) =>
      prev.map((n) => (n.id === id ? { ...n, isRead: !n.isRead } : n))
    );
  };

  const getIcon = (type: string) => {
    switch (type) {
      case 'SUCCESS':
        return <CheckCircle2 className="w-5 h-5 text-emerald-500" />;
      case 'WARNING':
        return <AlertTriangle className="w-5 h-5 text-amber-500" />;
      case 'ALERT':
        return <AlertTriangle className="w-5 h-5 text-red-500" />;
      default:
        return <Info className="w-5 h-5 text-indigo-500" />;
    }
  };

  return (
    <div className="space-y-6 p-4 sm:p-6 lg:p-8">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl sm:text-2xl font-extrabold text-slate-900 tracking-tight">
            Academic Alerts & Notifications
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 font-medium mt-0.5">
            Automated alerts for attendance updates, exam halls, fee receipts, and library dues.
          </p>
        </div>

        <button
          onClick={markAllAsRead}
          className="text-xs font-semibold text-indigo-600 hover:text-indigo-800 self-start sm:self-auto bg-indigo-50 hover:bg-indigo-100 px-3.5 py-2 rounded-xl transition-colors"
        >
          Mark all as read
        </button>
      </div>

      <div className="space-y-3">
        {notifications.map((item) => (
          <div
            key={item.id}
            onClick={() => toggleRead(item.id)}
            className={`p-5 rounded-2xl border transition-all cursor-pointer flex items-start space-x-4 ${
              item.isRead
                ? 'bg-white border-slate-200 opacity-80'
                : 'bg-white border-indigo-200 shadow-sm ring-1 ring-indigo-500/10'
            }`}
          >
            <div className="p-2 rounded-xl bg-slate-50 shrink-0 mt-0.5">
              {getIcon(item.type)}
            </div>

            <div className="flex-1 space-y-1">
              <div className="flex items-center justify-between">
                <h3 className="text-sm font-bold text-slate-900">{item.title}</h3>
                <span className="text-[11px] text-slate-400 font-medium">{item.date}</span>
              </div>
              <p className="text-xs text-slate-600 leading-relaxed">{item.message}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
