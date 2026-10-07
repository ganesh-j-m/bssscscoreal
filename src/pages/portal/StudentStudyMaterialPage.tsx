import React, { useState } from 'react';
import {
  BookOpen,
  Download,
  Search,
  Filter,
  FileText,
  Video,
  FileCheck,
  FolderOpen
} from 'lucide-react';

interface MaterialItem {
  id: number;
  subject: string;
  unit: string;
  title: string;
  fileType: 'PDF' | 'DOC' | 'PPT' | 'VIDEO';
  faculty: string;
  uploadDate: string;
  size: string;
}

export const StudentStudyMaterialPage: React.FC = () => {
  const [search, setSearch] = useState('');
  const [selectedSubject, setSelectedSubject] = useState('ALL');

  const materials: MaterialItem[] = [
    {
      id: 1,
      subject: 'Relational Database Systems',
      unit: 'Unit 2: SQL & Normal Forms',
      title: '3NF, BCNF & Multivalued Dependencies Comprehensive Handout',
      fileType: 'PDF',
      faculty: 'Dr. Suresh V. Patil',
      uploadDate: '2025-01-05',
      size: '2.4 MB',
    },
    {
      id: 2,
      subject: 'Advanced Java Programming',
      unit: 'Unit 3: Java Collections Framework',
      title: 'Collections API, Generics & Lambda Expressions Guide',
      fileType: 'PDF',
      faculty: 'Prof. Arvind K. Deshmukh',
      uploadDate: '2025-01-03',
      size: '3.1 MB',
    },
    {
      id: 3,
      subject: 'Operating Systems & Linux',
      unit: 'Unit 1: Process Management',
      title: 'Process Synchronization & Semaphore Implementation Slides',
      fileType: 'PPT',
      faculty: 'Prof. S. M. Kulkarni',
      uploadDate: '2024-12-28',
      size: '4.8 MB',
    },
    {
      id: 4,
      subject: 'Software Engineering & Agile',
      unit: 'Unit 4: Agile Scrum Framework',
      title: 'Scrum Sprints, User Stories & JIRA Workflow Case Study',
      fileType: 'PDF',
      faculty: 'Prof. Meena R. Jadhav',
      uploadDate: '2024-12-20',
      size: '1.9 MB',
    },
    {
      id: 5,
      subject: 'Relational Database Systems',
      unit: 'Unit 4: Transaction Processing',
      title: 'ACID Properties & Concurrency Control Protocols Video Lecture',
      fileType: 'VIDEO',
      faculty: 'Dr. Suresh V. Patil',
      uploadDate: '2024-12-15',
      size: '145 MB',
    },
  ];

  const subjects = ['ALL', ...Array.from(new Set(materials.map((m) => m.subject)))];

  const filtered = materials.filter((m) => {
    const matchesSub = selectedSubject === 'ALL' || m.subject === selectedSubject;
    const matchesSearch =
      !search ||
      m.title.toLowerCase().includes(search.toLowerCase()) ||
      m.unit.toLowerCase().includes(search.toLowerCase()) ||
      m.faculty.toLowerCase().includes(search.toLowerCase());
    return matchesSub && matchesSearch;
  });

  return (
    <div className="space-y-6 p-4 sm:p-6 lg:p-8">
      <div>
        <h1 className="text-xl sm:text-2xl font-extrabold text-slate-900 tracking-tight">
          Syllabus & E-Learning Study Material Repository
        </h1>
        <p className="text-xs sm:text-sm text-slate-500 font-medium mt-0.5">
          Download lecture notes, curated study modules, question banks, and reference material uploaded by professors.
        </p>
      </div>

      {/* Filter and Search */}
      <div className="bg-white rounded-2xl border border-slate-200 p-4 flex flex-col md:flex-row items-stretch md:items-center justify-between gap-3 shadow-xs">
        <div className="relative flex-1">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search material by title, unit, or faculty..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-9 pr-4 py-2 rounded-xl border border-slate-200 text-xs text-slate-800 placeholder-slate-400 focus:outline-hidden focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-600"
          />
        </div>

        <div className="flex items-center space-x-2">
          <Filter className="w-4 h-4 text-slate-400" />
          <select
            value={selectedSubject}
            onChange={(e) => setSelectedSubject(e.target.value)}
            className="px-3 py-2 rounded-xl border border-slate-200 text-xs text-slate-700 bg-white focus:outline-hidden focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-600"
          >
            {subjects.map((s) => (
              <option key={s} value={s}>
                {s === 'ALL' ? 'All Subjects' : s}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {filtered.map((item) => (
          <div
            key={item.id}
            className="bg-white rounded-2xl border border-slate-200 p-5 shadow-xs hover:border-indigo-300 transition-all flex flex-col justify-between space-y-4"
          >
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-indigo-50 text-indigo-700 border border-indigo-200">
                  {item.fileType}
                </span>
                <span className="text-[11px] text-slate-400 font-medium">{item.size}</span>
              </div>

              <div>
                <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider block">
                  {item.subject} • {item.unit}
                </span>
                <h3 className="text-sm font-bold text-slate-900 mt-0.5 leading-snug">
                  {item.title}
                </h3>
              </div>

              <p className="text-xs text-slate-500">Instructor: {item.faculty}</p>
            </div>

            <div className="pt-3 border-t border-slate-100 flex items-center justify-between">
              <span className="text-[11px] text-slate-400">Added: {item.uploadDate}</span>
              <button
                onClick={() => alert(`Starting download for "${item.title}"...`)}
                className="inline-flex items-center space-x-1.5 px-3 py-1.5 rounded-xl bg-slate-900 hover:bg-indigo-600 text-white text-xs font-semibold transition-colors shadow-xs"
              >
                <Download className="w-3.5 h-3.5" />
                <span>Download</span>
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
