const API_BASE = '/api';

function getAuthHeader(): Record<string, string> {
  const token = localStorage.getItem('scsco_token') || sessionStorage.getItem('scsco_token');
  return token ? { Authorization: `Bearer ${token}` } : {};
}

async function handleResponse<T>(res: Response): Promise<T> {
  if (!res.ok) {
    let errMessage = 'An error occurred';
    try {
      const errorData = await res.json();
      errMessage = errorData.error || errorData.message || `Request failed with status ${res.status}`;
    } catch {
      errMessage = await res.text() || `Request failed with status ${res.status}`;
    }
    throw new Error(errMessage);
  }
  return res.json();
}

export const api = {
  // Auth
  login: async (credentials: { loginId: string; password: string }) => {
    const res = await fetch(`${API_BASE}/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(credentials),
    });
    return handleResponse<any>(res);
  },

  getCurrentUser: async () => {
    const res = await fetch(`${API_BASE}/auth/me`, {
      headers: { ...getAuthHeader() },
    });
    return handleResponse<any>(res);
  },

  logout: async () => {
    const res = await fetch(`${API_BASE}/auth/logout`, {
      method: 'POST',
      headers: { ...getAuthHeader() },
    });
    return handleResponse<any>(res);
  },

  // Dashboard Stats
  getDashboardStats: async () => {
    const res = await fetch(`${API_BASE}/dashboard/stats`, {
      headers: { ...getAuthHeader() },
    });
    return handleResponse<any>(res);
  },

  // Users
  getUsers: async (params?: Record<string, string>) => {
    const query = new URLSearchParams(params).toString();
    const res = await fetch(`${API_BASE}/users${query ? `?${query}` : ''}`, {
      headers: { ...getAuthHeader() },
    });
    return handleResponse<any>(res);
  },

  createUser: async (data: any) => {
    const res = await fetch(`${API_BASE}/users`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', ...getAuthHeader() },
      body: JSON.stringify(data),
    });
    return handleResponse<any>(res);
  },

  updateUser: async (id: number, data: any) => {
    const res = await fetch(`${API_BASE}/users/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json', ...getAuthHeader() },
      body: JSON.stringify(data),
    });
    return handleResponse<any>(res);
  },

  deleteUser: async (id: number) => {
    const res = await fetch(`${API_BASE}/users/${id}`, {
      method: 'DELETE',
      headers: { ...getAuthHeader() },
    });
    return handleResponse<any>(res);
  },

  importUsersCsv: async (rows: any[]) => {
    const res = await fetch(`${API_BASE}/users/import`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', ...getAuthHeader() },
      body: JSON.stringify({ rows }),
    });
    return handleResponse<any>(res);
  },

  // Students
  getStudents: async (params?: Record<string, string>) => {
    const query = new URLSearchParams(params).toString();
    const res = await fetch(`${API_BASE}/students${query ? `?${query}` : ''}`, {
      headers: { ...getAuthHeader() },
    });
    return handleResponse<any>(res);
  },

  getStudentById: async (id: number) => {
    const res = await fetch(`${API_BASE}/students/${id}`, {
      headers: { ...getAuthHeader() },
    });
    return handleResponse<any>(res);
  },

  createStudent: async (data: any) => {
    const res = await fetch(`${API_BASE}/students`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', ...getAuthHeader() },
      body: JSON.stringify(data),
    });
    return handleResponse<any>(res);
  },

  updateStudent: async (id: number, data: any) => {
    const res = await fetch(`${API_BASE}/students/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json', ...getAuthHeader() },
      body: JSON.stringify(data),
    });
    return handleResponse<any>(res);
  },

  deleteStudent: async (id: number) => {
    const res = await fetch(`${API_BASE}/students/${id}`, {
      method: 'DELETE',
      headers: { ...getAuthHeader() },
    });
    return handleResponse<any>(res);
  },

  // Faculty
  getFaculty: async (params?: Record<string, string>) => {
    const query = new URLSearchParams(params).toString();
    const res = await fetch(`${API_BASE}/faculty${query ? `?${query}` : ''}`);
    return handleResponse<any>(res);
  },

  createFaculty: async (data: any) => {
    const res = await fetch(`${API_BASE}/faculty`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', ...getAuthHeader() },
      body: JSON.stringify(data),
    });
    return handleResponse<any>(res);
  },

  updateFaculty: async (id: number, data: any) => {
    const res = await fetch(`${API_BASE}/faculty/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json', ...getAuthHeader() },
      body: JSON.stringify(data),
    });
    return handleResponse<any>(res);
  },

  deleteFaculty: async (id: number) => {
    const res = await fetch(`${API_BASE}/faculty/${id}`, {
      method: 'DELETE',
      headers: { ...getAuthHeader() },
    });
    return handleResponse<any>(res);
  },

  // Parents
  getParents: async () => {
    const res = await fetch(`${API_BASE}/parents`, {
      headers: { ...getAuthHeader() },
    });
    return handleResponse<any>(res);
  },

  createParent: async (data: any) => {
    const res = await fetch(`${API_BASE}/parents`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', ...getAuthHeader() },
      body: JSON.stringify(data),
    });
    return handleResponse<any>(res);
  },

  // Academics: Departments, Courses, Subjects, Timetable
  getDepartments: async () => {
    const res = await fetch(`${API_BASE}/academics/departments`);
    return handleResponse<any>(res);
  },

  createDepartment: async (data: any) => {
    const res = await fetch(`${API_BASE}/academics/departments`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', ...getAuthHeader() },
      body: JSON.stringify(data),
    });
    return handleResponse<any>(res);
  },

  deleteDepartment: async (id: number) => {
    const res = await fetch(`${API_BASE}/academics/departments/${id}`, {
      method: 'DELETE',
      headers: { ...getAuthHeader() },
    });
    return handleResponse<any>(res);
  },

  getCourses: async () => {
    const res = await fetch(`${API_BASE}/academics/courses`);
    return handleResponse<any>(res);
  },

  createCourse: async (data: any) => {
    const res = await fetch(`${API_BASE}/academics/courses`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', ...getAuthHeader() },
      body: JSON.stringify(data),
    });
    return handleResponse<any>(res);
  },

  deleteCourse: async (id: number) => {
    const res = await fetch(`${API_BASE}/academics/courses/${id}`, {
      method: 'DELETE',
      headers: { ...getAuthHeader() },
    });
    return handleResponse<any>(res);
  },

  getSubjects: async () => {
    const res = await fetch(`${API_BASE}/academics/subjects`);
    return handleResponse<any>(res);
  },

  createSubject: async (data: any) => {
    const res = await fetch(`${API_BASE}/academics/subjects`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', ...getAuthHeader() },
      body: JSON.stringify(data),
    });
    return handleResponse<any>(res);
  },

  deleteSubject: async (id: number) => {
    const res = await fetch(`${API_BASE}/academics/subjects/${id}`, {
      method: 'DELETE',
      headers: { ...getAuthHeader() },
    });
    return handleResponse<any>(res);
  },

  getTimetable: async (params?: Record<string, string>) => {
    const query = new URLSearchParams(params).toString();
    const res = await fetch(`${API_BASE}/academics/timetable${query ? `?${query}` : ''}`);
    return handleResponse<any>(res);
  },

  createTimetableEntry: async (data: any) => {
    const res = await fetch(`${API_BASE}/academics/timetable`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', ...getAuthHeader() },
      body: JSON.stringify(data),
    });
    return handleResponse<any>(res);
  },

  deleteTimetableEntry: async (id: number) => {
    const res = await fetch(`${API_BASE}/academics/timetable/${id}`, {
      method: 'DELETE',
      headers: { ...getAuthHeader() },
    });
    return handleResponse<any>(res);
  },

  // Smart QR Attendance
  createAttendanceSession: async (data: { subject: string; course: string; year: string; division: string }) => {
    const res = await fetch(`${API_BASE}/attendance/session`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', ...getAuthHeader() },
      body: JSON.stringify(data),
    });
    return handleResponse<any>(res);
  },

  scanAttendanceQr: async (data: { qrToken?: string; sessionId?: string }) => {
    const res = await fetch(`${API_BASE}/attendance/scan`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', ...getAuthHeader() },
      body: JSON.stringify(data),
    });
    return handleResponse<any>(res);
  },

  getAttendanceRecords: async (params?: Record<string, string>) => {
    const query = new URLSearchParams(params).toString();
    const res = await fetch(`${API_BASE}/attendance/records${query ? `?${query}` : ''}`, {
      headers: { ...getAuthHeader() },
    });
    return handleResponse<any>(res);
  },

  getStudentAttendance: async (loginId: string) => {
    const res = await fetch(`${API_BASE}/attendance/student/${loginId}`, {
      headers: { ...getAuthHeader() },
    });
    return handleResponse<any>(res);
  },

  // Examinations & Results
  getExaminations: async () => {
    const res = await fetch(`${API_BASE}/examinations`);
    return handleResponse<any>(res);
  },

  createExamination: async (data: any) => {
    const res = await fetch(`${API_BASE}/examinations`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', ...getAuthHeader() },
      body: JSON.stringify(data),
    });
    return handleResponse<any>(res);
  },

  deleteExamination: async (id: number) => {
    const res = await fetch(`${API_BASE}/examinations/${id}`, {
      method: 'DELETE',
      headers: { ...getAuthHeader() },
    });
    return handleResponse<any>(res);
  },

  getResults: async (params?: Record<string, string>) => {
    const query = new URLSearchParams(params).toString();
    const res = await fetch(`${API_BASE}/results${query ? `?${query}` : ''}`, {
      headers: { ...getAuthHeader() },
    });
    return handleResponse<any>(res);
  },

  getStudentResults: async (loginId: string) => {
    const res = await fetch(`${API_BASE}/results/student/${loginId}`, {
      headers: { ...getAuthHeader() },
    });
    return handleResponse<any>(res);
  },

  createResult: async (data: any) => {
    const res = await fetch(`${API_BASE}/results`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', ...getAuthHeader() },
      body: JSON.stringify(data),
    });
    return handleResponse<any>(res);
  },

  // Fees
  getFees: async () => {
    const res = await fetch(`${API_BASE}/fees`, {
      headers: { ...getAuthHeader() },
    });
    return handleResponse<any>(res);
  },

  createFeeRecord: async (data: any) => {
    const res = await fetch(`${API_BASE}/fees`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', ...getAuthHeader() },
      body: JSON.stringify(data),
    });
    return handleResponse<any>(res);
  },

  getStudentFees: async (loginId: string) => {
    const res = await fetch(`${API_BASE}/fees/student/${loginId}`, {
      headers: { ...getAuthHeader() },
    });
    return handleResponse<any>(res);
  },

  recordFeePayment: async (feeId: number, data: { amountPaid: number; paymentMode?: string; receiptNumber?: string }) => {
    const res = await fetch(`${API_BASE}/fees/${feeId}/pay`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json', ...getAuthHeader() },
      body: JSON.stringify(data),
    });
    return handleResponse<any>(res);
  },

  // Certificates
  getCertificates: async () => {
    const res = await fetch(`${API_BASE}/certificates`, {
      headers: { ...getAuthHeader() },
    });
    return handleResponse<any>(res);
  },

  getStudentCertificates: async (loginId: string) => {
    const res = await fetch(`${API_BASE}/certificates/student/${loginId}`, {
      headers: { ...getAuthHeader() },
    });
    return handleResponse<any>(res);
  },

  applyCertificate: async (data: { certificateType: string; reason: string }) => {
    const res = await fetch(`${API_BASE}/certificates`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', ...getAuthHeader() },
      body: JSON.stringify(data),
    });
    return handleResponse<any>(res);
  },

  updateCertificateStatus: async (id: number, data: { status: string; adminNotes?: string }) => {
    const res = await fetch(`${API_BASE}/certificates/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json', ...getAuthHeader() },
      body: JSON.stringify(data),
    });
    return handleResponse<any>(res);
  },

  // Admissions
  submitAdmission: async (data: any) => {
    const res = await fetch(`${API_BASE}/admissions`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });
    return handleResponse<any>(res);
  },

  getAdmissions: async () => {
    const res = await fetch(`${API_BASE}/admissions`, {
      headers: { ...getAuthHeader() },
    });
    return handleResponse<any>(res);
  },

  updateAdmissionStatus: async (id: number, data: { status: string; notes?: string }) => {
    const res = await fetch(`${API_BASE}/admissions/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json', ...getAuthHeader() },
      body: JSON.stringify(data),
    });
    return handleResponse<any>(res);
  },

  // Placements
  getPlacements: async () => {
    const res = await fetch(`${API_BASE}/placements`);
    return handleResponse<any>(res);
  },

  createPlacement: async (data: any) => {
    const res = await fetch(`${API_BASE}/placements`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', ...getAuthHeader() },
      body: JSON.stringify(data),
    });
    return handleResponse<any>(res);
  },

  deletePlacement: async (id: number) => {
    const res = await fetch(`${API_BASE}/placements/${id}`, {
      method: 'DELETE',
      headers: { ...getAuthHeader() },
    });
    return handleResponse<any>(res);
  },

  // Library
  getLibraryBooks: async (params?: Record<string, string>) => {
    const query = new URLSearchParams(params).toString();
    const res = await fetch(`${API_BASE}/library/books${query ? `?${query}` : ''}`);
    return handleResponse<any>(res);
  },

  createLibraryBook: async (data: any) => {
    const res = await fetch(`${API_BASE}/library/books`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', ...getAuthHeader() },
      body: JSON.stringify(data),
    });
    return handleResponse<any>(res);
  },

  getBookIssues: async (params?: Record<string, string>) => {
    const query = new URLSearchParams(params).toString();
    const res = await fetch(`${API_BASE}/library/issues${query ? `?${query}` : ''}`, {
      headers: { ...getAuthHeader() },
    });
    return handleResponse<any>(res);
  },

  issueBook: async (data: { bookId: number; studentLoginId: string; dueDate: string }) => {
    const res = await fetch(`${API_BASE}/library/issue`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', ...getAuthHeader() },
      body: JSON.stringify(data),
    });
    return handleResponse<any>(res);
  },

  returnBook: async (issueId: number) => {
    const res = await fetch(`${API_BASE}/library/return/${issueId}`, {
      method: 'PUT',
      headers: { ...getAuthHeader() },
    });
    return handleResponse<any>(res);
  },

  // Grievances
  getGrievances: async () => {
    const res = await fetch(`${API_BASE}/grievances`, {
      headers: { ...getAuthHeader() },
    });
    return handleResponse<any>(res);
  },

  submitGrievance: async (data: { category: string; title: string; description: string }) => {
    const res = await fetch(`${API_BASE}/grievances`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', ...getAuthHeader() },
      body: JSON.stringify(data),
    });
    return handleResponse<any>(res);
  },

  resolveGrievance: async (id: number, data: { status: string; adminResponse?: string }) => {
    const res = await fetch(`${API_BASE}/grievances/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json', ...getAuthHeader() },
      body: JSON.stringify(data),
    });
    return handleResponse<any>(res);
  },

  // CMS & Public Site Data
  getNotices: async () => {
    const res = await fetch(`${API_BASE}/notices`);
    return handleResponse<any>(res);
  },

  createNotice: async (data: any) => {
    const res = await fetch(`${API_BASE}/notices`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', ...getAuthHeader() },
      body: JSON.stringify(data),
    });
    return handleResponse<any>(res);
  },

  deleteNotice: async (id: number) => {
    const res = await fetch(`${API_BASE}/notices/${id}`, {
      method: 'DELETE',
      headers: { ...getAuthHeader() },
    });
    return handleResponse<any>(res);
  },

  getEvents: async () => {
    const res = await fetch(`${API_BASE}/events`);
    return handleResponse<any>(res);
  },

  createEvent: async (data: any) => {
    const res = await fetch(`${API_BASE}/events`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', ...getAuthHeader() },
      body: JSON.stringify(data),
    });
    return handleResponse<any>(res);
  },

  deleteEvent: async (id: number) => {
    const res = await fetch(`${API_BASE}/events/${id}`, {
      method: 'DELETE',
      headers: { ...getAuthHeader() },
    });
    return handleResponse<any>(res);
  },

  getGallery: async () => {
    const res = await fetch(`${API_BASE}/gallery`);
    return handleResponse<any>(res);
  },

  createGalleryItem: async (data: any) => {
    const res = await fetch(`${API_BASE}/gallery`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', ...getAuthHeader() },
      body: JSON.stringify(data),
    });
    return handleResponse<any>(res);
  },

  deleteGalleryItem: async (id: number) => {
    const res = await fetch(`${API_BASE}/gallery/${id}`, {
      method: 'DELETE',
      headers: { ...getAuthHeader() },
    });
    return handleResponse<any>(res);
  },

  getFacilities: async () => {
    const res = await fetch(`${API_BASE}/facilities`);
    return handleResponse<any>(res);
  },

  createFacility: async (data: any) => {
    const res = await fetch(`${API_BASE}/facilities`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', ...getAuthHeader() },
      body: JSON.stringify(data),
    });
    return handleResponse<any>(res);
  },

  deleteFacility: async (id: number) => {
    const res = await fetch(`${API_BASE}/facilities/${id}`, {
      method: 'DELETE',
      headers: { ...getAuthHeader() },
    });
    return handleResponse<any>(res);
  },

  getAchievements: async () => {
    const res = await fetch(`${API_BASE}/achievements`);
    return handleResponse<any>(res);
  },

  createAchievement: async (data: any) => {
    const res = await fetch(`${API_BASE}/achievements`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', ...getAuthHeader() },
      body: JSON.stringify(data),
    });
    return handleResponse<any>(res);
  },

  deleteAchievement: async (id: number) => {
    const res = await fetch(`${API_BASE}/achievements/${id}`, {
      method: 'DELETE',
      headers: { ...getAuthHeader() },
    });
    return handleResponse<any>(res);
  },

  getCmsSection: async (sectionKey: string) => {
    const res = await fetch(`${API_BASE}/cms/${sectionKey}`);
    return handleResponse<any>(res);
  },

  updateCmsSection: async (sectionKey: string, data: any) => {
    const res = await fetch(`${API_BASE}/cms/${sectionKey}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', ...getAuthHeader() },
      body: JSON.stringify({ data }),
    });
    return handleResponse<any>(res);
  },

  // Audit Logs
  getAuditLogs: async (params?: Record<string, string>) => {
    const query = new URLSearchParams(params).toString();
    const res = await fetch(`${API_BASE}/audit-logs${query ? `?${query}` : ''}`, {
      headers: { ...getAuthHeader() },
    });
    return handleResponse<any>(res);
  },

  getNotifications: async () => {
    const res = await fetch(`${API_BASE}/notifications`, {
      headers: { ...getAuthHeader() },
    });
    return handleResponse<any>(res);
  },
};
