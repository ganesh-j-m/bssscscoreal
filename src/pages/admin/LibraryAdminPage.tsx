import React, { useEffect, useState } from 'react';
import { Library, Plus, BookOpen, CheckCircle, Clock } from 'lucide-react';
import { api } from '../../services/api.ts';
import { LibraryBook, BookIssue } from '../../types/index.ts';
import { Modal } from '../../components/common/Modal.tsx';

export const LibraryAdminPage: React.FC = () => {
  const [books, setBooks] = useState<LibraryBook[]>([]);
  const [issues, setIssues] = useState<BookIssue[]>([]);
  const [activeTab, setActiveTab] = useState<'catalog' | 'issues'>('catalog');
  const [isAddOpen, setIsAddOpen] = useState(false);
  const [isIssueOpen, setIsIssueOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  // Forms
  const [bookForm, setBookForm] = useState({
    title: '',
    author: '',
    isbn: '',
    category: 'Computer Science',
    totalCopies: 5,
    shelfLocation: 'Stack CS-1',
  });

  const [issueForm, setIssueForm] = useState({
    bookId: 1,
    studentLoginId: 'STU001',
    dueDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
  });

  const fetchData = async () => {
    setIsLoading(true);
    try {
      const [bRes, iRes] = await Promise.all([
        api.getLibraryBooks(),
        api.getBookIssues(),
      ]);
      if (bRes.books) setBooks(bRes.books);
      if (iRes.issues) setIssues(iRes.issues);
    } catch (err) {
      console.error('Library data fetch failed:', err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleAddBook = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await api.createLibraryBook(bookForm);
      setIsAddOpen(false);
      fetchData();
    } catch (err: any) {
      alert(err.message || 'Failed to add book');
    }
  };

  const handleIssueBook = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await api.issueBook(issueForm);
      setIsIssueOpen(false);
      fetchData();
    } catch (err: any) {
      alert(err.message || 'Failed to issue book');
    }
  };

  const handleReturnBook = async (issueId: number) => {
    try {
      await api.returnBook(issueId);
      fetchData();
    } catch (err: any) {
      alert(err.message || 'Failed to return book');
    }
  };

  return (
    <div className="space-y-6 p-4 sm:p-6 lg:p-8">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl sm:text-2xl font-extrabold text-slate-900 tracking-tight">
            Central Knowledge Resource & Library
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 font-medium mt-0.5">
            Book catalog, circulation desk, lending records, and RFID inventory.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => setIsIssueOpen(true)}
            className="inline-flex items-center space-x-1.5 px-3.5 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold text-xs"
          >
            <Clock className="w-3.5 h-3.5" />
            <span>Issue Book</span>
          </button>
          <button
            onClick={() => setIsAddOpen(true)}
            className="inline-flex items-center space-x-1.5 px-3.5 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-semibold text-xs"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Add Book to Catalog</span>
          </button>
        </div>
      </div>

      <div className="flex items-center space-x-2 border-b border-slate-200">
        <button
          onClick={() => setActiveTab('catalog')}
          className={`px-4 py-2.5 text-xs font-bold border-b-2 transition-all ${
            activeTab === 'catalog' ? 'border-indigo-600 text-indigo-600' : 'border-transparent text-slate-500'
          }`}
        >
          Book Catalog ({books.length})
        </button>
        <button
          onClick={() => setActiveTab('issues')}
          className={`px-4 py-2.5 text-xs font-bold border-b-2 transition-all ${
            activeTab === 'issues' ? 'border-indigo-600 text-indigo-600' : 'border-transparent text-slate-500'
          }`}
        >
          Circulation & Issued Books ({issues.length})
        </button>
      </div>

      {activeTab === 'catalog' ? (
        <div className="bg-white rounded-2xl border border-slate-200/80 shadow-xs overflow-hidden">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50 border-b border-slate-200 text-slate-500 uppercase font-semibold">
              <tr>
                <th className="px-5 py-3.5">Book Title</th>
                <th className="px-5 py-3.5">Author</th>
                <th className="px-5 py-3.5">ISBN</th>
                <th className="px-5 py-3.5">Category</th>
                <th className="px-5 py-3.5">Available / Total</th>
                <th className="px-5 py-3.5">Shelf Location</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {books.map((b) => (
                <tr key={b.id} className="hover:bg-slate-50/70">
                  <td className="px-5 py-3.5 font-bold text-slate-900">{b.title}</td>
                  <td className="px-5 py-3.5 text-slate-700">{b.author}</td>
                  <td className="px-5 py-3.5 font-mono text-slate-500">{b.isbn}</td>
                  <td className="px-5 py-3.5">{b.category}</td>
                  <td className="px-5 py-3.5">
                    <span className="font-bold text-indigo-600">{b.availableCopies}</span> / {b.totalCopies} Copies
                  </td>
                  <td className="px-5 py-3.5 text-slate-600">{b.shelfLocation || '—'}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : (
        <div className="bg-white rounded-2xl border border-slate-200/80 shadow-xs overflow-hidden">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50 border-b border-slate-200 text-slate-500 uppercase font-semibold">
              <tr>
                <th className="px-5 py-3.5">Book Title</th>
                <th className="px-5 py-3.5">Issued Student</th>
                <th className="px-5 py-3.5">Issue Date</th>
                <th className="px-5 py-3.5">Due Date</th>
                <th className="px-5 py-3.5">Status</th>
                <th className="px-5 py-3.5 text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {issues.map((i) => (
                <tr key={i.id} className="hover:bg-slate-50/70">
                  <td className="px-5 py-3.5 font-bold text-slate-900">{i.bookTitle}</td>
                  <td className="px-5 py-3.5 font-mono text-indigo-700 font-bold">{i.studentLoginId}</td>
                  <td className="px-5 py-3.5 text-slate-600">{i.issueDate}</td>
                  <td className="px-5 py-3.5 text-slate-600">{i.dueDate}</td>
                  <td className="px-5 py-3.5">
                    <span className={`px-2 py-0.5 rounded text-[11px] font-semibold ${
                      i.status === 'RETURNED' ? 'bg-emerald-50 text-emerald-700' : 'bg-amber-50 text-amber-700'
                    }`}>
                      {i.status}
                    </span>
                  </td>
                  <td className="px-5 py-3.5 text-right">
                    {i.status === 'ISSUED' && (
                      <button
                        onClick={() => handleReturnBook(i.id)}
                        className="px-2.5 py-1 rounded-lg bg-emerald-50 text-emerald-700 hover:bg-emerald-100 font-semibold"
                      >
                        Return Book
                      </button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Add Book Modal */}
      <Modal isOpen={isAddOpen} onClose={() => setIsAddOpen(false)} title="Add Book to Central Library">
        <form onSubmit={handleAddBook} className="space-y-4">
          <div className="space-y-1">
            <label className="text-xs font-semibold text-slate-700">Book Title *</label>
            <input
              type="text"
              required
              value={bookForm.title}
              onChange={e => setBookForm({ ...bookForm, title: e.target.value })}
              className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs"
            />
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1">
              <label className="text-xs font-semibold text-slate-700">Author *</label>
              <input
                type="text"
                required
                value={bookForm.author}
                onChange={e => setBookForm({ ...bookForm, author: e.target.value })}
                className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs"
              />
            </div>
            <div className="space-y-1">
              <label className="text-xs font-semibold text-slate-700">ISBN Code *</label>
              <input
                type="text"
                required
                value={bookForm.isbn}
                onChange={e => setBookForm({ ...bookForm, isbn: e.target.value })}
                className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs font-mono"
              />
            </div>
          </div>
          <div className="grid grid-cols-3 gap-3">
            <div className="space-y-1">
              <label className="text-xs font-semibold text-slate-700">Category</label>
              <input
                type="text"
                value={bookForm.category}
                onChange={e => setBookForm({ ...bookForm, category: e.target.value })}
                className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs"
              />
            </div>
            <div className="space-y-1">
              <label className="text-xs font-semibold text-slate-700">Total Copies</label>
              <input
                type="number"
                min={1}
                value={bookForm.totalCopies}
                onChange={e => setBookForm({ ...bookForm, totalCopies: parseInt(e.target.value, 10) || 1 })}
                className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs"
              />
            </div>
            <div className="space-y-1">
              <label className="text-xs font-semibold text-slate-700">Shelf Stack</label>
              <input
                type="text"
                value={bookForm.shelfLocation}
                onChange={e => setBookForm({ ...bookForm, shelfLocation: e.target.value })}
                className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs"
              />
            </div>
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
              Add Book to PostgreSQL
            </button>
          </div>
        </form>
      </Modal>

      {/* Issue Book Modal */}
      <Modal isOpen={isIssueOpen} onClose={() => setIsIssueOpen(false)} title="Issue Book to Student">
        <form onSubmit={handleIssueBook} className="space-y-4">
          <div className="space-y-1">
            <label className="text-xs font-semibold text-slate-700">Select Book</label>
            <select
              value={issueForm.bookId}
              onChange={e => setIssueForm({ ...issueForm, bookId: parseInt(e.target.value, 10) })}
              className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs bg-white"
            >
              {books.map(b => (
                <option key={b.id} value={b.id} disabled={b.availableCopies < 1}>
                  {b.title} (Available: {b.availableCopies})
                </option>
              ))}
            </select>
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1">
              <label className="text-xs font-semibold text-slate-700">Student Login ID *</label>
              <input
                type="text"
                required
                value={issueForm.studentLoginId}
                onChange={e => setIssueForm({ ...issueForm, studentLoginId: e.target.value.toUpperCase() })}
                className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs font-mono uppercase"
              />
            </div>
            <div className="space-y-1">
              <label className="text-xs font-semibold text-slate-700">Due Date *</label>
              <input
                type="date"
                required
                value={issueForm.dueDate}
                onChange={e => setIssueForm({ ...issueForm, dueDate: e.target.value })}
                className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs"
              />
            </div>
          </div>
          <div className="pt-3 flex justify-end gap-2">
            <button
              type="button"
              onClick={() => setIsIssueOpen(false)}
              className="px-4 py-2 rounded-xl bg-slate-100 text-slate-700 text-xs font-semibold"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 rounded-xl bg-indigo-600 text-white text-xs font-semibold"
            >
              Confirm Issue
            </button>
          </div>
        </form>
      </Modal>
    </div>
  );
};
