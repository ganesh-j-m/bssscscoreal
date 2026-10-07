import React, { useState } from 'react';
import {
  FileCheck,
  Calendar,
  Clock,
  Upload,
  CheckCircle2,
  AlertCircle,
  FileText,
  Download
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext.tsx';

interface Assignment {
  id: number;
  title: string;
  subject: string;
  facultyName: string;
  dueDate: string;
  status: 'SUBMITTED' | 'PENDING' | 'GRADED';
  grade?: string;
  totalMarks: number;
  description: string;
}

export const StudentAssignmentsPage: React.FC = () => {
  const { user } = useAuth();
  const [filter, setFilter] = useState<'ALL' | 'PENDING' | 'SUBMITTED'>('ALL');
  const [submittedIds, setSubmittedIds] = useState<number[]>([2]);
  const [activeUploadId, setActiveUploadId] = useState<number | null>(null);
  const [uploadSuccess, setUploadSuccess] = useState<string | null>(null);

  const assignments: Assignment[] = [
    {
      id: 1,
      title: 'Database Normalization & SQL Queries Case Study',
      subject: 'Relational Database Systems (CS-302)',
      facultyName: 'Dr. Suresh V. Patil',
      dueDate: '2025-01-20',
      status: submittedIds.includes(1) ? 'SUBMITTED' : 'PENDING',
      totalMarks: 20,
      description: 'Analyze the college library schema and write 3NF tables with sample queries for joins and views.',
    },
    {
      id: 2,
      title: 'Object-Oriented Programming Class Hierarchy Design',
      subject: 'Advanced Java Programming (CS-301)',
      facultyName: 'Prof. Arvind K. Deshmukh',
      dueDate: '2025-01-10',
      status: 'GRADED',
      grade: '19/20 (A+)',
      totalMarks: 20,
      description: 'Implement an abstract class for banking accounts with polymorphism and custom exception handling.',
    },
    {
      id: 3,
      title: 'Operating System Process Scheduling Simulation',
      subject: 'Operating Systems & Linux (CS-303)',
      facultyName: 'Prof. S. M. Kulkarni',
      dueDate: '2025-01-25',
      status: submittedIds.includes(3) ? 'SUBMITTED' : 'PENDING',
      totalMarks: 25,
      description: 'Simulate Round Robin and Priority scheduling algorithms in C/Python and plot Gantt charts.',
    },
    {
      id: 4,
      title: 'Environmental Studies Field Report',
      subject: 'Environmental Science (EVS-101)',
      facultyName: 'Prof. N. R. Gaikwad',
      dueDate: '2025-01-30',
      status: submittedIds.includes(4) ? 'SUBMITTED' : 'PENDING',
      totalMarks: 15,
      description: 'Prepare a 5-page case study on rainwater harvesting in Omerga taluka with photographic evidence.',
    },
  ];

  const handleSimulateSubmit = (id: number) => {
    setSubmittedIds((prev) => [...prev, id]);
    setActiveUploadId(null);
    setUploadSuccess(`Assignment submitted successfully to faculty evaluation queue!`);
    setTimeout(() => setUploadSuccess(null), 4000);
  };

  const filtered = assignments.filter((a) => {
    if (filter === 'PENDING') return a.status === 'PENDING';
    if (filter === 'SUBMITTED') return a.status === 'SUBMITTED' || a.status === 'GRADED';
    return true;
  });

  return (
    <div className="space-y-6 p-4 sm:p-6 lg:p-8">
      {/* Header */}
      <div>
        <h1 className="text-xl sm:text-2xl font-extrabold text-slate-900 tracking-tight">
          Assignments & Continuous Assessments
        </h1>
        <p className="text-xs sm:text-sm text-slate-500 font-medium mt-0.5">
          View subject assignments, submit project reports, and review faculty feedback.
        </p>
      </div>

      {uploadSuccess && (
        <div className="p-4 bg-emerald-50 border border-emerald-200 text-emerald-800 rounded-2xl flex items-center space-x-2 text-xs font-semibold">
          <CheckCircle2 className="w-4 h-4 text-emerald-600" />
          <span>{uploadSuccess}</span>
        </div>
      )}

      {/* Tabs */}
      <div className="flex space-x-2 border-b border-slate-200 pb-2">
        <button
          onClick={() => setFilter('ALL')}
          className={`px-4 py-2 text-xs font-semibold rounded-xl transition-all ${
            filter === 'ALL'
              ? 'bg-indigo-600 text-white'
              : 'text-slate-600 hover:bg-slate-100'
          }`}
        >
          All Assignments ({assignments.length})
        </button>
        <button
          onClick={() => setFilter('PENDING')}
          className={`px-4 py-2 text-xs font-semibold rounded-xl transition-all ${
            filter === 'PENDING'
              ? 'bg-indigo-600 text-white'
              : 'text-slate-600 hover:bg-slate-100'
          }`}
        >
          Pending Submissions
        </button>
        <button
          onClick={() => setFilter('SUBMITTED')}
          className={`px-4 py-2 text-xs font-semibold rounded-xl transition-all ${
            filter === 'SUBMITTED'
              ? 'bg-indigo-600 text-white'
              : 'text-slate-600 hover:bg-slate-100'
          }`}
        >
          Completed & Graded
        </button>
      </div>

      {/* Assignments List */}
      <div className="space-y-4">
        {filtered.map((item) => (
          <div
            key={item.id}
            className="bg-white rounded-2xl border border-slate-200 p-5 shadow-xs space-y-3"
          >
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
              <div>
                <span className="text-[11px] font-bold text-indigo-600 uppercase tracking-wider">
                  {item.subject}
                </span>
                <h3 className="text-sm font-bold text-slate-900">{item.title}</h3>
                <p className="text-xs text-slate-500 font-medium">Instructor: {item.facultyName}</p>
              </div>

              <div className="flex items-center space-x-2">
                {item.status === 'GRADED' ? (
                  <span className="px-2.5 py-1 rounded-full text-xs font-bold bg-purple-50 text-purple-700 border border-purple-200">
                    Graded: {item.grade}
                  </span>
                ) : item.status === 'SUBMITTED' ? (
                  <span className="px-2.5 py-1 rounded-full text-xs font-bold bg-emerald-50 text-emerald-700 border border-emerald-200">
                    Submitted
                  </span>
                ) : (
                  <span className="px-2.5 py-1 rounded-full text-xs font-bold bg-amber-50 text-amber-700 border border-amber-200">
                    Pending
                  </span>
                )}
              </div>
            </div>

            <p className="text-xs text-slate-600 bg-slate-50 p-3 rounded-xl border border-slate-100">
              {item.description}
            </p>

            <div className="flex flex-col sm:flex-row sm:items-center justify-between pt-2 border-t border-slate-100 gap-3 text-xs text-slate-500">
              <div className="flex items-center space-x-4">
                <span className="flex items-center space-x-1 font-medium">
                  <Calendar className="w-3.5 h-3.5 text-slate-400" />
                  <span>Due: {item.dueDate}</span>
                </span>
                <span>Max Marks: {item.totalMarks}</span>
              </div>

              {item.status === 'PENDING' && (
                <div className="flex items-center space-x-2">
                  {activeUploadId === item.id ? (
                    <div className="flex items-center space-x-2">
                      <button
                        onClick={() => handleSimulateSubmit(item.id)}
                        className="px-3 py-1.5 rounded-lg bg-indigo-600 text-white text-xs font-semibold hover:bg-indigo-700 shadow-xs"
                      >
                        Confirm Upload (PDF)
                      </button>
                      <button
                        onClick={() => setActiveUploadId(null)}
                        className="px-3 py-1.5 rounded-lg text-slate-500 text-xs font-medium hover:bg-slate-100"
                      >
                        Cancel
                      </button>
                    </div>
                  ) : (
                    <button
                      onClick={() => setActiveUploadId(item.id)}
                      className="inline-flex items-center space-x-1.5 px-3 py-1.5 rounded-lg border border-indigo-200 text-indigo-700 text-xs font-semibold hover:bg-indigo-50 transition-colors"
                    >
                      <Upload className="w-3.5 h-3.5" />
                      <span>Upload Solution</span>
                    </button>
                  )}
                </div>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
