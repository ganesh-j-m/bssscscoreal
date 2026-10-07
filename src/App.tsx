/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { BrowserRouter, Routes, Route, Navigate, Outlet } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext.tsx';

// Common Components
import { Navbar } from './components/common/Navbar.tsx';
import { Footer } from './components/common/Footer.tsx';
import { AdminSidebar } from './components/common/AdminSidebar.tsx';
import { AdminHeader } from './components/common/AdminHeader.tsx';
import { PortalSidebar } from './components/common/PortalSidebar.tsx';
import { PortalHeader } from './components/common/PortalHeader.tsx';

// Public Pages
import { HomePage } from './pages/public/HomePage.tsx';
import { AboutPage } from './pages/public/AboutPage.tsx';
import { PrincipalMessagePage } from './pages/public/PrincipalMessagePage.tsx';
import { AcademicsPage } from './pages/public/AcademicsPage.tsx';
import { DepartmentsPage } from './pages/public/DepartmentsPage.tsx';
import { CoursesPage } from './pages/public/CoursesPage.tsx';
import { FacultyPage } from './pages/public/FacultyPage.tsx';
import { AdmissionsPage } from './pages/public/AdmissionsPage.tsx';
import { CampusLifePage } from './pages/public/CampusLifePage.tsx';
import { FacilitiesPage } from './pages/public/FacilitiesPage.tsx';
import { EventsPage } from './pages/public/EventsPage.tsx';
import { GalleryPage } from './pages/public/GalleryPage.tsx';
import { AchievementsPage } from './pages/public/AchievementsPage.tsx';
import { PlacementsPage } from './pages/public/PlacementsPage.tsx';
import { NoticesPage } from './pages/public/NoticesPage.tsx';
import { ContactPage } from './pages/public/ContactPage.tsx';
import { LoginPage } from './pages/public/LoginPage.tsx';

// Admin Pages
import { AdminDashboard } from './pages/admin/AdminDashboard.tsx';
import { UsersPage } from './pages/admin/UsersPage.tsx';
import { StudentsPage } from './pages/admin/StudentsPage.tsx';
import { FacultyAdminPage } from './pages/admin/FacultyAdminPage.tsx';
import { ParentsAdminPage } from './pages/admin/ParentsAdminPage.tsx';
import { AcademicsAdminPage } from './pages/admin/AcademicsAdminPage.tsx';
import { AttendancePage } from './pages/admin/AttendancePage.tsx';
import { QrAttendancePage } from './pages/admin/QrAttendancePage.tsx';
import { ExaminationsPage } from './pages/admin/ExaminationsPage.tsx';
import { ResultsPage } from './pages/admin/ResultsPage.tsx';
import { FeesPage } from './pages/admin/FeesPage.tsx';
import { CertificatesPage } from './pages/admin/CertificatesPage.tsx';
import { AdmissionsAdminPage } from './pages/admin/AdmissionsAdminPage.tsx';
import { LibraryAdminPage } from './pages/admin/LibraryAdminPage.tsx';
import { GrievancesAdminPage } from './pages/admin/GrievancesAdminPage.tsx';
import { PlacementsAdminPage } from './pages/admin/PlacementsAdminPage.tsx';
import { CmsAdminPage } from './pages/admin/CmsAdminPage.tsx';
import { AuditLogsPage } from './pages/admin/AuditLogsPage.tsx';
import { SettingsPage } from './pages/admin/SettingsPage.tsx';

// Portal Pages
import { PortalDashboard } from './pages/portal/PortalDashboard.tsx';
import { StudentProfilePage } from './pages/portal/StudentProfilePage.tsx';
import { StudentAttendancePage } from './pages/portal/StudentAttendancePage.tsx';
import { StudentAssignmentsPage } from './pages/portal/StudentAssignmentsPage.tsx';
import { StudentStudyMaterialPage } from './pages/portal/StudentStudyMaterialPage.tsx';
import { StudentExamsPage } from './pages/portal/StudentExamsPage.tsx';
import { StudentResultsPage } from './pages/portal/StudentResultsPage.tsx';
import { StudentFeesPage } from './pages/portal/StudentFeesPage.tsx';
import { StudentCertificatesPage } from './pages/portal/StudentCertificatesPage.tsx';
import { StudentPlacementsPage } from './pages/portal/StudentPlacementsPage.tsx';
import { StudentLibraryPage } from './pages/portal/StudentLibraryPage.tsx';
import { StudentGrievancesPage } from './pages/portal/StudentGrievancesPage.tsx';
import { StudentNotificationsPage } from './pages/portal/StudentNotificationsPage.tsx';

// Layout Wrappers
const PublicLayout: React.FC = () => {
  return (
    <div className="min-h-screen flex flex-col bg-slate-50 text-slate-800 font-sans selection:bg-indigo-600 selection:text-white">
      <Navbar />
      <main className="flex-1">
        <Outlet />
      </main>
      <Footer />
    </div>
  );
};

const AdminLayout: React.FC = () => {
  const { user, isLoading } = useAuth();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-900 text-slate-300">
        <div className="flex items-center space-x-3">
          <div className="w-6 h-6 border-2 border-indigo-500 border-t-transparent rounded-full animate-spin" />
          <span className="text-sm font-semibold tracking-wide">Validating ERP Session...</span>
        </div>
      </div>
    );
  }

  // Allow SUPER_ADMIN, PRINCIPAL, and FACULTY (for academic modules)
  if (!user) {
    return <Navigate to="/login" replace />;
  }

  const isStaff = ['SUPER_ADMIN', 'PRINCIPAL', 'FACULTY'].includes(user.role);
  if (!isStaff) {
    return <Navigate to="/portal/dashboard" replace />;
  }

  return (
    <div className="min-h-screen flex bg-slate-100 font-sans">
      <AdminSidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />
      <div className="flex-1 flex flex-col min-w-0 lg:pl-64">
        <AdminHeader onToggleSidebar={() => setSidebarOpen(!sidebarOpen)} />
        <main className="flex-1">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

const PortalLayout: React.FC = () => {
  const { user, isLoading } = useAuth();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-900 text-slate-300">
        <div className="flex items-center space-x-3">
          <div className="w-6 h-6 border-2 border-indigo-500 border-t-transparent rounded-full animate-spin" />
          <span className="text-sm font-semibold tracking-wide">Accessing Campus Portal...</span>
        </div>
      </div>
    );
  }

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  return (
    <div className="min-h-screen flex bg-slate-100 font-sans">
      <PortalSidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />
      <div className="flex-1 flex flex-col min-w-0 lg:pl-64">
        <PortalHeader onToggleSidebar={() => setSidebarOpen(!sidebarOpen)} />
        <main className="flex-1">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          {/* Public Website Routes */}
          <Route element={<PublicLayout />}>
            <Route path="/" element={<HomePage />} />
            <Route path="/about" element={<AboutPage />} />
            <Route path="/principal-message" element={<PrincipalMessagePage />} />
            <Route path="/academics" element={<AcademicsPage />} />
            <Route path="/departments" element={<DepartmentsPage />} />
            <Route path="/courses" element={<CoursesPage />} />
            <Route path="/faculty" element={<FacultyPage />} />
            <Route path="/admissions" element={<AdmissionsPage />} />
            <Route path="/campus-life" element={<CampusLifePage />} />
            <Route path="/facilities" element={<FacilitiesPage />} />
            <Route path="/events" element={<EventsPage />} />
            <Route path="/gallery" element={<GalleryPage />} />
            <Route path="/achievements" element={<AchievementsPage />} />
            <Route path="/placements" element={<PlacementsPage />} />
            <Route path="/notices" element={<NoticesPage />} />
            <Route path="/contact" element={<ContactPage />} />
            <Route path="/login" element={<LoginPage />} />
          </Route>

          {/* Admin ERP Routes */}
          <Route path="/admin" element={<AdminLayout />}>
            <Route index element={<Navigate to="/admin/dashboard" replace />} />
            <Route path="dashboard" element={<AdminDashboard />} />
            <Route path="users" element={<UsersPage />} />
            <Route path="students" element={<StudentsPage />} />
            <Route path="faculty" element={<FacultyAdminPage />} />
            <Route path="parents" element={<ParentsAdminPage />} />
            <Route path="academics" element={<AcademicsAdminPage />} />
            <Route path="departments" element={<AcademicsAdminPage />} />
            <Route path="courses" element={<AcademicsAdminPage />} />
            <Route path="subjects" element={<AcademicsAdminPage />} />
            <Route path="timetable" element={<AcademicsAdminPage />} />
            <Route path="attendance" element={<AttendancePage />} />
            <Route path="qr-attendance" element={<QrAttendancePage />} />
            <Route path="examinations" element={<ExaminationsPage />} />
            <Route path="results" element={<ResultsPage />} />
            <Route path="fees" element={<FeesPage />} />
            <Route path="certificates" element={<CertificatesPage />} />
            <Route path="admissions" element={<AdmissionsAdminPage />} />
            <Route path="library" element={<LibraryAdminPage />} />
            <Route path="grievances" element={<GrievancesAdminPage />} />
            <Route path="placements" element={<PlacementsAdminPage />} />
            <Route path="facilities" element={<CmsAdminPage />} />
            <Route path="achievements" element={<CmsAdminPage />} />
            <Route path="campus-content" element={<CmsAdminPage />} />
            <Route path="notices" element={<CmsAdminPage />} />
            <Route path="events" element={<CmsAdminPage />} />
            <Route path="gallery" element={<CmsAdminPage />} />
            <Route path="principal-profile" element={<CmsAdminPage />} />
            <Route path="contact" element={<CmsAdminPage />} />
            <Route path="cms" element={<CmsAdminPage />} />
            <Route path="audit-logs" element={<AuditLogsPage />} />
            <Route path="settings" element={<SettingsPage />} />
          </Route>

          {/* Student & Parent Portal Routes */}
          <Route path="/portal" element={<PortalLayout />}>
            <Route index element={<Navigate to="/portal/dashboard" replace />} />
            <Route path="dashboard" element={<PortalDashboard />} />
            <Route path="profile" element={<StudentProfilePage />} />
            <Route path="attendance" element={<StudentAttendancePage />} />
            <Route path="assignments" element={<StudentAssignmentsPage />} />
            <Route path="study-material" element={<StudentStudyMaterialPage />} />
            <Route path="exams" element={<StudentExamsPage />} />
            <Route path="results" element={<StudentResultsPage />} />
            <Route path="fees" element={<StudentFeesPage />} />
            <Route path="certificates" element={<StudentCertificatesPage />} />
            <Route path="placements" element={<StudentPlacementsPage />} />
            <Route path="library" element={<StudentLibraryPage />} />
            <Route path="grievances" element={<StudentGrievancesPage />} />
            <Route path="notifications" element={<StudentNotificationsPage />} />
          </Route>

          {/* Fallback */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}
