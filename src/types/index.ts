export type UserRole = 'SUPER_ADMIN' | 'PRINCIPAL' | 'FACULTY' | 'STUDENT' | 'PARENT' | 'ALUMNI';

export interface User {
  id: number;
  loginId: string;
  name: string;
  email: string;
  phone?: string | null;
  role: UserRole;
  status: 'ACTIVE' | 'INACTIVE' | 'SUSPENDED';
  avatar?: string | null;
  createdAt: string;
  studentDetails?: Student | null;
  facultyDetails?: Faculty | null;
  parentDetails?: Parent | null;
}

export interface Student {
  id: number;
  userId?: number | null;
  studentId: string;
  prn: string;
  name: string;
  email: string;
  phone?: string | null;
  gender?: string | null;
  dob?: string | null;
  department: string;
  course: string;
  year: string;
  semester: number;
  division: string;
  admissionYear: number;
  address?: string | null;
  parentName?: string | null;
  parentPhone?: string | null;
  status: string;
  profilePhoto?: string | null;
  createdAt: string;
}

export interface Faculty {
  id: number;
  userId?: number | null;
  facultyId: string;
  name: string;
  email: string;
  phone?: string | null;
  designation: string;
  department: string;
  qualification?: string | null;
  specialization?: string | null;
  experience?: string | null;
  joiningDate?: string | null;
  doj?: string | null;
  photo?: string | null;
  status: string;
  createdAt: string;
}

export interface Parent {
  id: number;
  userId?: number | null;
  parentId?: string | null;
  name: string;
  email: string;
  phone: string;
  occupation?: string | null;
  studentId?: number | null;
  studentLoginId?: string | null;
  relation: string;
  address?: string | null;
  createdAt: string;
}

export interface Department {
  id: number;
  code: string;
  name: string;
  hod?: string | null;
  description?: string | null;
  image?: string | null;
  establishedYear?: number | null;
  status: string;
  createdAt: string;
}

export interface Course {
  id: number;
  code: string;
  name: string;
  department: string;
  duration: string;
  degreeType: string;
  intake: number;
  eligibility?: string | null;
  description?: string | null;
  feePerYear: number;
  status: string;
  createdAt: string;
}

export interface Subject {
  id: number;
  code: string;
  name: string;
  course: string;
  semester: number;
  credits: number;
  faculty?: string | null;
  createdAt: string;
}

export interface TimetableEntry {
  id: number;
  day: string;
  startTime: string;
  endTime: string;
  department: string;
  course: string;
  year: string;
  division: string;
  subject: string;
  faculty: string;
  room: string;
}

export interface AttendanceRecord {
  id: number;
  studentId?: number | null;
  studentLoginId: string;
  studentName: string;
  subject: string;
  faculty: string;
  date: string;
  time: string;
  status: 'Present' | 'Absent' | 'Late';
  sessionId?: string | null;
  course: string;
  year: string;
  division: string;
  createdAt: string;
}

export interface AttendanceSession {
  id: number;
  sessionId: string;
  subject: string;
  course: string;
  year: string;
  division: string;
  facultyName: string;
  facultyLoginId: string;
  qrToken: string;
  date: string;
  startTime: string;
  expiresAt: string;
  status: string;
}

export interface Examination {
  id: number;
  name: string;
  course: string;
  semester: number;
  subject: string;
  date: string;
  startTime: string;
  endTime: string;
  room: string;
  instructions?: string | null;
  createdAt: string;
}

export interface ResultRecord {
  id: number;
  studentId?: number | null;
  studentLoginId: string;
  studentName: string;
  exam: string;
  subject: string;
  marksObtained: number;
  totalMarks: number;
  grade: string;
  resultStatus: string;
  semester: number;
  academicYear: string;
  createdAt: string;
}

export interface FeeRecord {
  id: number;
  studentId?: number | null;
  studentLoginId: string;
  studentName: string;
  feeType: string;
  totalAmount: number;
  paidAmount: number;
  pendingAmount: number;
  dueDate: string;
  status: 'PAID' | 'PARTIAL' | 'PENDING';
  receiptNumber?: string | null;
  paymentDate?: string | null;
  paymentMode?: string | null;
  createdAt: string;
}

export interface CertificateRecord {
  id: number;
  studentId?: number | null;
  studentLoginId: string;
  studentName: string;
  certificateType: string;
  reason: string;
  status: 'PENDING' | 'APPROVED' | 'REJECTED' | 'ISSUED';
  appliedDate: string;
  issuedDate?: string | null;
  adminNotes?: string | null;
  certificateNumber?: string | null;
  createdAt: string;
}

export interface AdmissionApplication {
  id: number;
  applicationNumber: string;
  applicantName: string;
  email: string;
  phone: string;
  course: string;
  previousPercentage: string;
  previousCollege: string;
  category: string;
  status: 'PENDING' | 'REVIEWED' | 'APPROVED' | 'REJECTED';
  notes?: string | null;
  appliedDate: string;
  createdAt: string;
}

export interface PlacementDrive {
  id: number;
  company: string;
  logo?: string | null;
  jobTitle: string;
  package: string;
  location: string;
  eligibility: string;
  coursesAllowed: string;
  driveDate: string;
  deadline: string;
  description: string;
  status: string;
  createdAt: string;
}

export interface LibraryBook {
  id: number;
  title: string;
  author: string;
  isbn: string;
  category: string;
  edition?: string | null;
  publisher?: string | null;
  totalCopies: number;
  availableCopies: number;
  shelfLocation?: string | null;
  coverImage?: string | null;
  createdAt: string;
}

export interface BookIssue {
  id: number;
  bookId?: number | null;
  bookTitle: string;
  studentId?: number | null;
  studentLoginId: string;
  studentName: string;
  issueDate: string;
  dueDate: string;
  returnDate?: string | null;
  status: 'ISSUED' | 'RETURNED' | 'OVERDUE';
  fine: number;
  createdAt: string;
}

export interface GrievanceRecord {
  id: number;
  studentId?: number | null;
  studentLoginId: string;
  studentName: string;
  category: string;
  title: string;
  description: string;
  status: 'OPEN' | 'IN_REVIEW' | 'RESOLVED' | 'REJECTED';
  adminResponse?: string | null;
  resolvedAt?: string | null;
  createdAt: string;
}

export interface Notice {
  id: number;
  title: string;
  category: string;
  content: string;
  date: string;
  isPinned: boolean;
  targetAudience: string;
  attachmentUrl?: string | null;
  status: string;
  createdAt: string;
}

export interface EventItem {
  id: number;
  title: string;
  category: string;
  date: string;
  time: string;
  venue: string;
  description: string;
  image?: string | null;
  status: string;
  createdAt: string;
}

export interface GalleryItem {
  id: number;
  title: string;
  category: string;
  imageUrl: string;
  caption?: string | null;
  createdAt: string;
}

export interface FacilityItem {
  id: number;
  name: string;
  category: string;
  description: string;
  imageUrl: string;
  features?: string | null;
  createdAt: string;
}

export interface AchievementItem {
  id: number;
  title: string;
  recipient: string;
  category: string;
  year: string;
  description: string;
  imageUrl?: string | null;
  createdAt: string;
}

export interface AuditLogItem {
  id: number;
  userLoginId: string;
  userName: string;
  role: string;
  action: string;
  module: string;
  recordId?: string | null;
  details?: string | null;
  timestamp: string;
}

export interface NotificationItem {
  id: number;
  recipientLoginId: string;
  title: string;
  message: string;
  type: 'info' | 'warning' | 'success' | 'alert';
  link?: string | null;
  isRead: boolean;
  createdAt: string;
}

export interface DashboardStats {
  totalStudents: number;
  totalFaculty: number;
  totalUsers: number;
  pendingAdmissions: number;
  todayAttendance: number;
  totalPendingFees: number;
  pendingCertificates: number;
  openGrievances: number;
  activePlacements: number;
  totalLibraryBooks: number;
  activeBookIssues: number;
  totalDepartments: number;
  totalCourses: number;
  courseBreakdown: { name: string; students: number }[];
  recentActivity: AuditLogItem[];
}
