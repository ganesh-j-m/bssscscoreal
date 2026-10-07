import { integer, pgTable, serial, text, timestamp, boolean } from 'drizzle-orm/pg-core';
import { relations } from 'drizzle-orm';

// 1. Users
export const users = pgTable('users', {
  id: serial('id').primaryKey(),
  loginId: text('login_id').notNull().unique(), // e.g. ADMIN001, STU001, FAC001, PAR001
  passwordHash: text('password_hash').notNull(),
  name: text('name').notNull(),
  email: text('email').notNull().unique(),
  phone: text('phone'),
  role: text('role').notNull(), // SUPER_ADMIN, PRINCIPAL, FACULTY, STUDENT, PARENT, ALUMNI
  status: text('status').notNull().default('ACTIVE'), // ACTIVE, INACTIVE, SUSPENDED
  avatar: text('avatar'),
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull(),
});

// 2. Students
export const students = pgTable('students', {
  id: serial('id').primaryKey(),
  userId: integer('user_id').references(() => users.id, { onDelete: 'set null' }),
  studentId: text('student_id').notNull().unique(),
  prn: text('prn').notNull().unique(),
  name: text('name').notNull(),
  email: text('email').notNull(),
  phone: text('phone'),
  gender: text('gender'),
  dob: text('dob'),
  department: text('department').notNull(),
  course: text('course').notNull(),
  year: text('year').notNull(), // FY, SY, TY
  semester: integer('semester').notNull().default(1),
  division: text('division').notNull().default('A'),
  admissionYear: integer('admission_year').notNull(),
  address: text('address'),
  parentName: text('parent_name'),
  parentPhone: text('parent_phone'),
  status: text('status').notNull().default('ACTIVE'),
  profilePhoto: text('profile_photo'),
  createdAt: timestamp('created_at').defaultNow().notNull(),
});

// 3. Faculties
export const faculties = pgTable('faculties', {
  id: serial('id').primaryKey(),
  userId: integer('user_id').references(() => users.id, { onDelete: 'set null' }),
  facultyId: text('faculty_id').notNull().unique(),
  name: text('name').notNull(),
  email: text('email').notNull(),
  phone: text('phone'),
  designation: text('designation').notNull(),
  department: text('department').notNull(),
  qualification: text('qualification'),
  specialization: text('specialization'),
  experience: text('experience'),
  joiningDate: text('joining_date'),
  photo: text('photo'),
  status: text('status').notNull().default('ACTIVE'),
  createdAt: timestamp('created_at').defaultNow().notNull(),
});

// 4. Parents
export const parents = pgTable('parents', {
  id: serial('id').primaryKey(),
  userId: integer('user_id').references(() => users.id, { onDelete: 'set null' }),
  name: text('name').notNull(),
  email: text('email').notNull(),
  phone: text('phone').notNull(),
  occupation: text('occupation'),
  studentId: integer('student_id').references(() => students.id, { onDelete: 'cascade' }),
  relation: text('relation').notNull().default('Parent'),
  address: text('address'),
  createdAt: timestamp('created_at').defaultNow().notNull(),
});

// 5. Departments
export const departments = pgTable('departments', {
  id: serial('id').primaryKey(),
  code: text('code').notNull().unique(),
  name: text('name').notNull(),
  hod: text('hod'),
  description: text('description'),
  image: text('image'),
  establishedYear: integer('established_year'),
  status: text('status').notNull().default('ACTIVE'),
  createdAt: timestamp('created_at').defaultNow().notNull(),
});

// 6. Courses
export const courses = pgTable('courses', {
  id: serial('id').primaryKey(),
  code: text('code').notNull().unique(),
  name: text('name').notNull(),
  department: text('department').notNull(),
  duration: text('duration').notNull(),
  degreeType: text('degree_type').notNull().default('UG'),
  intake: integer('intake').notNull().default(60),
  eligibility: text('eligibility'),
  description: text('description'),
  feePerYear: integer('fee_per_year').notNull().default(15000),
  status: text('status').notNull().default('ACTIVE'),
  createdAt: timestamp('created_at').defaultNow().notNull(),
});

// 7. Subjects
export const subjects = pgTable('subjects', {
  id: serial('id').primaryKey(),
  code: text('code').notNull().unique(),
  name: text('name').notNull(),
  course: text('course').notNull(),
  semester: integer('semester').notNull().default(1),
  credits: integer('credits').notNull().default(4),
  faculty: text('faculty'),
  createdAt: timestamp('created_at').defaultNow().notNull(),
});

// 8. Timetable
export const timetable = pgTable('timetable', {
  id: serial('id').primaryKey(),
  day: text('day').notNull(), // Monday, Tuesday, etc.
  startTime: text('start_time').notNull(),
  endTime: text('end_time').notNull(),
  department: text('department').notNull(),
  course: text('course').notNull(),
  year: text('year').notNull(),
  division: text('division').notNull(),
  subject: text('subject').notNull(),
  faculty: text('faculty').notNull(),
  room: text('room').notNull(),
  createdAt: timestamp('created_at').defaultNow().notNull(),
});

// 9. Attendance Sessions (QR Attendance)
export const attendanceSessions = pgTable('attendance_sessions', {
  id: serial('id').primaryKey(),
  sessionId: text('session_id').notNull().unique(),
  subject: text('subject').notNull(),
  course: text('course').notNull(),
  year: text('year').notNull(),
  division: text('division').notNull(),
  facultyName: text('faculty_name').notNull(),
  facultyLoginId: text('faculty_login_id').notNull(),
  qrToken: text('qr_token').notNull().unique(),
  date: text('date').notNull(),
  startTime: text('start_time').notNull(),
  expiresAt: timestamp('expires_at').notNull(),
  status: text('status').notNull().default('ACTIVE'), // ACTIVE, EXPIRED, CLOSED
  createdAt: timestamp('created_at').defaultNow().notNull(),
});

// 10. Attendance Records
export const attendances = pgTable('attendances', {
  id: serial('id').primaryKey(),
  studentId: integer('student_id').references(() => students.id, { onDelete: 'cascade' }),
  studentLoginId: text('student_login_id').notNull(),
  studentName: text('student_name').notNull(),
  subject: text('subject').notNull(),
  faculty: text('faculty').notNull(),
  date: text('date').notNull(),
  time: text('time').notNull(),
  status: text('status').notNull().default('Present'), // Present, Absent, Late
  sessionId: text('session_id'),
  course: text('course').notNull(),
  year: text('year').notNull(),
  division: text('division').notNull(),
  createdAt: timestamp('created_at').defaultNow().notNull(),
});

// 11. Examinations
export const examinations = pgTable('examinations', {
  id: serial('id').primaryKey(),
  name: text('name').notNull(),
  course: text('course').notNull(),
  semester: integer('semester').notNull(),
  subject: text('subject').notNull(),
  date: text('date').notNull(),
  startTime: text('start_time').notNull(),
  endTime: text('end_time').notNull(),
  room: text('room').notNull(),
  instructions: text('instructions'),
  createdAt: timestamp('created_at').defaultNow().notNull(),
});

// 12. Results
export const results = pgTable('results', {
  id: serial('id').primaryKey(),
  studentId: integer('student_id').references(() => students.id, { onDelete: 'cascade' }),
  studentLoginId: text('student_login_id').notNull(),
  studentName: text('student_name').notNull(),
  exam: text('exam').notNull(),
  subject: text('subject').notNull(),
  marksObtained: integer('marks_obtained').notNull(),
  totalMarks: integer('total_marks').notNull().default(100),
  grade: text('grade').notNull(),
  resultStatus: text('result_status').notNull().default('PASS'),
  semester: integer('semester').notNull(),
  academicYear: text('academic_year').notNull(),
  createdAt: timestamp('created_at').defaultNow().notNull(),
});

// 13. Fees
export const fees = pgTable('fees', {
  id: serial('id').primaryKey(),
  studentId: integer('student_id').references(() => students.id, { onDelete: 'cascade' }),
  studentLoginId: text('student_login_id').notNull(),
  studentName: text('student_name').notNull(),
  feeType: text('fee_type').notNull(),
  totalAmount: integer('total_amount').notNull(),
  paidAmount: integer('paid_amount').notNull().default(0),
  pendingAmount: integer('pending_amount').notNull(),
  dueDate: text('due_date').notNull(),
  status: text('status').notNull().default('PENDING'), // PAID, PARTIAL, PENDING
  receiptNumber: text('receipt_number'),
  paymentDate: text('payment_date'),
  paymentMode: text('payment_mode'),
  createdAt: timestamp('created_at').defaultNow().notNull(),
});

// 14. Certificates
export const certificates = pgTable('certificates', {
  id: serial('id').primaryKey(),
  studentId: integer('student_id').references(() => students.id, { onDelete: 'cascade' }),
  studentLoginId: text('student_login_id').notNull(),
  studentName: text('student_name').notNull(),
  certificateType: text('certificate_type').notNull(),
  reason: text('reason').notNull(),
  status: text('status').notNull().default('PENDING'), // PENDING, APPROVED, REJECTED, ISSUED
  appliedDate: text('applied_date').notNull(),
  issuedDate: text('issued_date'),
  adminNotes: text('admin_notes'),
  certificateNumber: text('certificate_number'),
  createdAt: timestamp('created_at').defaultNow().notNull(),
});

// 15. Admissions
export const admissions = pgTable('admissions', {
  id: serial('id').primaryKey(),
  applicationNumber: text('application_number').notNull().unique(),
  applicantName: text('applicant_name').notNull(),
  email: text('email').notNull(),
  phone: text('phone').notNull(),
  course: text('course').notNull(),
  previousPercentage: text('previous_percentage').notNull(),
  previousCollege: text('previous_college').notNull(),
  category: text('category').notNull().default('General'),
  status: text('status').notNull().default('PENDING'), // PENDING, REVIEWED, APPROVED, REJECTED
  notes: text('notes'),
  appliedDate: text('applied_date').notNull(),
  createdAt: timestamp('created_at').defaultNow().notNull(),
});

// 16. Placements
export const placements = pgTable('placements', {
  id: serial('id').primaryKey(),
  company: text('company').notNull(),
  logo: text('logo'),
  jobTitle: text('job_title').notNull(),
  package: text('package').notNull(),
  location: text('location').notNull(),
  eligibility: text('eligibility').notNull(),
  coursesAllowed: text('courses_allowed').notNull(),
  driveDate: text('drive_date').notNull(),
  deadline: text('deadline').notNull(),
  description: text('description').notNull(),
  status: text('status').notNull().default('ACTIVE'), // UPCOMING, ACTIVE, COMPLETED
  createdAt: timestamp('created_at').defaultNow().notNull(),
});

// 17. Library Books
export const libraryBooks = pgTable('library_books', {
  id: serial('id').primaryKey(),
  title: text('title').notNull(),
  author: text('author').notNull(),
  isbn: text('isbn').notNull(),
  category: text('category').notNull(),
  edition: text('edition'),
  publisher: text('publisher'),
  totalCopies: integer('total_copies').notNull().default(1),
  availableCopies: integer('available_copies').notNull().default(1),
  shelfLocation: text('shelf_location'),
  coverImage: text('cover_image'),
  createdAt: timestamp('created_at').defaultNow().notNull(),
});

// 18. Book Issues
export const bookIssues = pgTable('book_issues', {
  id: serial('id').primaryKey(),
  bookId: integer('book_id').references(() => libraryBooks.id, { onDelete: 'cascade' }),
  bookTitle: text('book_title').notNull(),
  studentId: integer('student_id').references(() => students.id, { onDelete: 'cascade' }),
  studentLoginId: text('student_login_id').notNull(),
  studentName: text('student_name').notNull(),
  issueDate: text('issue_date').notNull(),
  dueDate: text('due_date').notNull(),
  returnDate: text('return_date'),
  status: text('status').notNull().default('ISSUED'), // ISSUED, RETURNED, OVERDUE
  fine: integer('fine').notNull().default(0),
  createdAt: timestamp('created_at').defaultNow().notNull(),
});

// 19. Grievances
export const grievances = pgTable('grievances', {
  id: serial('id').primaryKey(),
  studentId: integer('student_id').references(() => students.id, { onDelete: 'cascade' }),
  studentLoginId: text('student_login_id').notNull(),
  studentName: text('student_name').notNull(),
  category: text('category').notNull(),
  title: text('title').notNull(),
  description: text('description').notNull(),
  status: text('status').notNull().default('OPEN'), // OPEN, IN_REVIEW, RESOLVED, REJECTED
  adminResponse: text('admin_response'),
  resolvedAt: text('resolved_at'),
  createdAt: timestamp('created_at').defaultNow().notNull(),
});

// 20. Notices
export const notices = pgTable('notices', {
  id: serial('id').primaryKey(),
  title: text('title').notNull(),
  category: text('category').notNull().default('General'),
  content: text('content').notNull(),
  date: text('date').notNull(),
  isPinned: boolean('is_pinned').notNull().default(false),
  targetAudience: text('target_audience').notNull().default('All'),
  attachmentUrl: text('attachment_url'),
  status: text('status').notNull().default('PUBLISHED'), // PUBLISHED, DRAFT
  createdAt: timestamp('created_at').defaultNow().notNull(),
});

// 21. Events
export const events = pgTable('events', {
  id: serial('id').primaryKey(),
  title: text('title').notNull(),
  category: text('category').notNull().default('Campus'),
  date: text('date').notNull(),
  time: text('time').notNull(),
  venue: text('venue').notNull(),
  description: text('description').notNull(),
  image: text('image'),
  status: text('status').notNull().default('UPCOMING'), // UPCOMING, ONGOING, COMPLETED
  createdAt: timestamp('created_at').defaultNow().notNull(),
});

// 22. Gallery Items
export const galleryItems = pgTable('gallery_items', {
  id: serial('id').primaryKey(),
  title: text('title').notNull(),
  category: text('category').notNull().default('Campus'),
  imageUrl: text('image_url').notNull(),
  caption: text('caption'),
  createdAt: timestamp('created_at').defaultNow().notNull(),
});

// 23. Facilities
export const facilities = pgTable('facilities', {
  id: serial('id').primaryKey(),
  name: text('name').notNull(),
  category: text('category').notNull().default('Academic'),
  description: text('description').notNull(),
  imageUrl: text('image_url').notNull(),
  features: text('features'), // JSON or comma-separated
  createdAt: timestamp('created_at').defaultNow().notNull(),
});

// 24. Achievements
export const achievements = pgTable('achievements', {
  id: serial('id').primaryKey(),
  title: text('title').notNull(),
  recipient: text('recipient').notNull(),
  category: text('category').notNull().default('Academic'),
  year: text('year').notNull(),
  description: text('description').notNull(),
  imageUrl: text('image_url'),
  createdAt: timestamp('created_at').defaultNow().notNull(),
});

// 25. Website CMS Content
export const cmsContent = pgTable('cms_content', {
  id: serial('id').primaryKey(),
  sectionKey: text('section_key').notNull().unique(), // e.g. homepage_hero, principal_profile, contact_info
  data: text('data').notNull(), // JSON string
  updatedBy: text('updated_by'),
  updatedAt: timestamp('updated_at').defaultNow().notNull(),
});

// 26. Audit Logs
export const auditLogs = pgTable('audit_logs', {
  id: serial('id').primaryKey(),
  userLoginId: text('user_login_id').notNull(),
  userName: text('user_name').notNull(),
  role: text('role').notNull(),
  action: text('action').notNull(), // LOGIN, CREATE, UPDATE, DELETE, IMPORT, QR_SCAN, APPROVE, REJECT
  module: text('module').notNull(),
  recordId: text('record_id'),
  details: text('details'),
  timestamp: timestamp('timestamp').defaultNow().notNull(),
});

// 27. Notifications
export const notifications = pgTable('notifications', {
  id: serial('id').primaryKey(),
  recipientLoginId: text('recipient_login_id').notNull(), // Specific Login ID or 'ALL'
  title: text('title').notNull(),
  message: text('message').notNull(),
  type: text('type').notNull().default('info'), // info, warning, success, alert
  link: text('link'),
  isRead: boolean('is_read').notNull().default(false),
  createdAt: timestamp('created_at').defaultNow().notNull(),
});

// Relations
export const usersRelations = relations(users, ({ one }) => ({
  student: one(students, {
    fields: [users.id],
    references: [students.userId],
  }),
  faculty: one(faculties, {
    fields: [users.id],
    references: [faculties.userId],
  }),
}));

export const studentsRelations = relations(students, ({ one, many }) => ({
  user: one(users, {
    fields: [students.userId],
    references: [users.id],
  }),
  attendances: many(attendances),
  results: many(results),
  fees: many(fees),
  certificates: many(certificates),
  bookIssues: many(bookIssues),
  grievances: many(grievances),
}));
