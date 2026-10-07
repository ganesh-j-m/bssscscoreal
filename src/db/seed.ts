import bcrypt from 'bcryptjs';
import { db } from './index.ts';
import {
  users,
  students,
  faculties,
  parents,
  departments,
  courses,
  subjects,
  timetable,
  examinations,
  results,
  fees,
  certificates,
  admissions,
  placements,
  libraryBooks,
  bookIssues,
  grievances,
  notices,
  events,
  galleryItems,
  facilities,
  achievements,
  cmsContent,
  auditLogs,
  notifications
} from './schema.ts';
import { eq } from 'drizzle-orm';

export async function seedDatabase() {
  try {
    const existingUsers = await db.select().from(users).limit(1);
    if (existingUsers.length > 0) {
      console.log('Database already seeded. Skipping initial seed.');
      return;
    }

    console.log('Seeding initial database data...');

    // Passwords
    const adminPass = await bcrypt.hash('Admin@123', 10);
    const princPass = await bcrypt.hash('Principal@123', 10);
    const facultyPass = await bcrypt.hash('Faculty@123', 10);
    const studentPass = await bcrypt.hash('Student@123', 10);
    const parentPass = await bcrypt.hash('Parent@123', 10);
    const alumniPass = await bcrypt.hash('Alumni@123', 10);

    // 1. Users
    const [uAdmin] = await db.insert(users).values({
      loginId: 'ADMIN001',
      passwordHash: adminPass,
      name: 'Super Administrator',
      email: 'admin@sharadacollege.edu.in',
      phone: '+91 98230 11223',
      role: 'SUPER_ADMIN',
      status: 'ACTIVE',
      avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=400',
    }).returning();

    const [uPrinc] = await db.insert(users).values({
      loginId: 'PRIN001',
      passwordHash: princPass,
      name: 'Dr. Suresh V. Patil',
      email: 'principal@sharadacollege.edu.in',
      phone: '+91 94220 55667',
      role: 'PRINCIPAL',
      status: 'ACTIVE',
      avatar: 'https://images.unsplash.com/photo-1560250097-0b93528c311a?auto=format&fit=crop&q=80&w=400',
    }).returning();

    const [uFac] = await db.insert(users).values({
      loginId: 'FAC001',
      passwordHash: facultyPass,
      name: 'Prof. Rajesh K. Shinde',
      email: 'shinde.rajesh@sharadacollege.edu.in',
      phone: '+91 98901 22334',
      role: 'FACULTY',
      status: 'ACTIVE',
      avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=400',
    }).returning();

    const [uStu] = await db.insert(users).values({
      loginId: 'STU001',
      passwordHash: studentPass,
      name: 'Aditya Narayan More',
      email: 'aditya.more@sharadacollege.edu.in',
      phone: '+91 91580 33445',
      role: 'STUDENT',
      status: 'ACTIVE',
      avatar: 'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?auto=format&fit=crop&q=80&w=400',
    }).returning();

    const [uPar] = await db.insert(users).values({
      loginId: 'PAR001',
      passwordHash: parentPass,
      name: 'Narayan Tukaram More',
      email: 'narayan.more@gmail.com',
      phone: '+91 94210 77889',
      role: 'PARENT',
      status: 'ACTIVE',
      avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&q=80&w=400',
    }).returning();

    const [uAlu] = await db.insert(users).values({
      loginId: 'ALU001',
      passwordHash: alumniPass,
      name: 'Snehal Ramesh Kulkarni',
      email: 'snehal.kulkarni@infosys.com',
      phone: '+91 98811 44556',
      role: 'ALUMNI',
      status: 'ACTIVE',
      avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&q=80&w=400',
    }).returning();

    // 2. Departments
    await db.insert(departments).values([
      {
        code: 'CS',
        name: 'Computer Science & IT',
        hod: 'Prof. Rajesh K. Shinde',
        description: 'Advanced laboratories, cutting-edge software curricula, cloud technologies, AI, and industry placement tracks.',
        image: 'https://images.unsplash.com/photo-1517694712202-14dd9538aa97?auto=format&fit=crop&q=80&w=800',
        establishedYear: 2001,
      },
      {
        code: 'COMM',
        name: 'Commerce & Management',
        hod: 'Dr. Meena Deshmukh',
        description: 'Specialized programs in Banking, Financial Markets, Taxation, Business Analytics, and Corporate Accounting.',
        image: 'https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?auto=format&fit=crop&q=80&w=800',
        establishedYear: 1994,
      },
      {
        code: 'SCI',
        name: 'Science & Biotechnology',
        hod: 'Dr. Anand Kadam',
        description: 'State-of-the-art physics, chemistry, botany, and microbiology research labs fostering scientific inquiry.',
        image: 'https://images.unsplash.com/photo-1532094349884-543bc11b234d?auto=format&fit=crop&q=80&w=800',
        establishedYear: 1996,
      },
      {
        code: 'ARTS',
        name: 'Humanities & Social Sciences',
        hod: 'Prof. Sunita Gaikwad',
        description: 'Fostering critical thinking, languages, public administration, history, literature, and sociology.',
        image: 'https://images.unsplash.com/photo-1457369804613-52c61a468e7d?auto=format&fit=crop&q=80&w=800',
        establishedYear: 1990,
      },
    ]);

    // 3. Courses
    await db.insert(courses).values([
      {
        code: 'BSC-CS',
        name: 'B.Sc. Computer Science',
        department: 'Computer Science & IT',
        duration: '3 Years (6 Semesters)',
        degreeType: 'UG',
        intake: 80,
        eligibility: '10+2 with Mathematics / Science stream (min 45%)',
        description: 'Core foundation in algorithms, databases, web technologies, software engineering, and machine learning.',
        feePerYear: 22000,
      },
      {
        code: 'BCA',
        name: 'Bachelor of Computer Applications (BCA)',
        department: 'Computer Science & IT',
        duration: '3 Years (6 Semesters)',
        degreeType: 'UG',
        intake: 60,
        eligibility: '10+2 in any stream with English (min 45%)',
        description: 'Hands-on training in software development, mobile application programming, cloud computing, and database management.',
        feePerYear: 25000,
      },
      {
        code: 'BCOM',
        name: 'Bachelor of Commerce (B.Com)',
        department: 'Commerce & Management',
        duration: '3 Years (6 Semesters)',
        degreeType: 'UG',
        intake: 120,
        eligibility: '10+2 Commerce or equivalent (min 40%)',
        description: 'Comprehensive study of accounting principles, financial management, corporate law, and GST practices.',
        feePerYear: 12000,
      },
      {
        code: 'BSC-SCI',
        name: 'B.Sc. General Science (PCB / PCM)',
        department: 'Science & Biotechnology',
        duration: '3 Years (6 Semesters)',
        degreeType: 'UG',
        intake: 100,
        eligibility: '10+2 Science Stream with Physics, Chemistry, Biology/Math',
        description: 'In-depth laboratory-driven education across physical and natural sciences.',
        feePerYear: 15000,
      },
      {
        code: 'BA',
        name: 'Bachelor of Arts (B.A.)',
        department: 'Humanities & Social Sciences',
        duration: '3 Years (6 Semesters)',
        degreeType: 'UG',
        intake: 120,
        eligibility: '10+2 in any stream',
        description: 'Multidisciplinary study across English literature, history, political science, and economics.',
        feePerYear: 8000,
      },
      {
        code: 'MSC-CS',
        name: 'M.Sc. Computer Science',
        department: 'Computer Science & IT',
        duration: '2 Years (4 Semesters)',
        degreeType: 'PG',
        intake: 30,
        eligibility: 'B.Sc. Computer Science / BCA / B.Sc. IT (min 50%)',
        description: 'Postgraduate research and specialization in Artificial Intelligence, Cloud Infrastructure, and Cyber Security.',
        feePerYear: 32000,
      },
    ]);

    // 4. Subjects
    await db.insert(subjects).values([
      {
        code: 'CS-101',
        name: 'Data Structures & Algorithms',
        course: 'B.Sc. Computer Science',
        semester: 3,
        credits: 4,
        faculty: 'Prof. Rajesh K. Shinde',
      },
      {
        code: 'CS-102',
        name: 'Relational Database Management Systems',
        course: 'B.Sc. Computer Science',
        semester: 3,
        credits: 4,
        faculty: 'Prof. Rajesh K. Shinde',
      },
      {
        code: 'CS-103',
        name: 'Web Technology & Modern Frameworks',
        course: 'B.Sc. Computer Science',
        semester: 3,
        credits: 4,
        faculty: 'Prof. Sneha Jadhav',
      },
      {
        code: 'CS-104',
        name: 'Operating Systems & Linux Architecture',
        course: 'B.Sc. Computer Science',
        semester: 3,
        credits: 3,
        faculty: 'Prof. Vikas Salunkhe',
      },
      {
        code: 'COMM-201',
        name: 'Advanced Financial Accounting',
        course: 'Bachelor of Commerce (B.Com)',
        semester: 3,
        credits: 4,
        faculty: 'Dr. Meena Deshmukh',
      },
    ]);

    // 5. Students
    const [stuRecord] = await db.insert(students).values({
      userId: uStu.id,
      studentId: 'STU-2024-001',
      prn: '202401540001',
      name: 'Aditya Narayan More',
      email: 'aditya.more@sharadacollege.edu.in',
      phone: '+91 91580 33445',
      gender: 'Male',
      dob: '2004-05-14',
      department: 'Computer Science & IT',
      course: 'B.Sc. Computer Science',
      year: 'SY',
      semester: 3,
      division: 'A',
      admissionYear: 2023,
      address: 'Shivaji Chowk, Omerga, Dist. Dharashiv - 413606',
      parentName: 'Narayan Tukaram More',
      parentPhone: '+91 94210 77889',
      status: 'ACTIVE',
      profilePhoto: 'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?auto=format&fit=crop&q=80&w=400',
    }).returning();

    // 6. Faculties
    await db.insert(faculties).values([
      {
        userId: uFac.id,
        facultyId: 'FAC-CS-001',
        name: 'Prof. Rajesh K. Shinde',
        email: 'shinde.rajesh@sharadacollege.edu.in',
        phone: '+91 98901 22334',
        designation: 'Head of Department & Associate Professor',
        department: 'Computer Science & IT',
        qualification: 'M.Sc. (CS), M.Phil., SET, Ph.D. (Pursuing)',
        specialization: 'Database Systems, Distributed Computing & Cloud Infrastructure',
        experience: '16 Years',
        joiningDate: '2008-07-15',
        photo: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=400',
      },
      {
        userId: null,
        facultyId: 'FAC-COMM-002',
        name: 'Dr. Meena Deshmukh',
        email: 'deshmukh.meena@sharadacollege.edu.in',
        phone: '+91 98221 33445',
        designation: 'Associate Professor & HOD Commerce',
        department: 'Commerce & Management',
        qualification: 'M.Com, Ph.D., NET',
        specialization: 'Corporate Finance, Banking Regulation and Taxation',
        experience: '18 Years',
        joiningDate: '2006-08-01',
        photo: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&q=80&w=400',
      },
      {
        userId: null,
        facultyId: 'FAC-SCI-003',
        name: 'Dr. Anand Kadam',
        email: 'kadam.anand@sharadacollege.edu.in',
        phone: '+91 94215 88990',
        designation: 'Professor & Dean of Sciences',
        department: 'Science & Biotechnology',
        qualification: 'M.Sc. (Physics), Ph.D., Postdoc',
        specialization: 'Solid State Physics, Thin Film Nanomaterials',
        experience: '22 Years',
        joiningDate: '2002-09-10',
        photo: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&q=80&w=400',
      },
    ]);

    // 7. Parents
    await db.insert(parents).values({
      userId: uPar.id,
      name: 'Narayan Tukaram More',
      email: 'narayan.more@gmail.com',
      phone: '+91 94210 77889',
      occupation: 'Government Officer',
      studentId: stuRecord.id,
      relation: 'Father',
      address: 'Shivaji Chowk, Omerga, Dist. Dharashiv - 413606',
    });

    // 8. Timetable
    await db.insert(timetable).values([
      {
        day: 'Monday',
        startTime: '09:00 AM',
        endTime: '10:00 AM',
        department: 'Computer Science & IT',
        course: 'B.Sc. Computer Science',
        year: 'SY',
        division: 'A',
        subject: 'Data Structures & Algorithms',
        faculty: 'Prof. Rajesh K. Shinde',
        room: 'Lab-3 (Computer Center)',
      },
      {
        day: 'Monday',
        startTime: '10:00 AM',
        endTime: '11:00 AM',
        department: 'Computer Science & IT',
        course: 'B.Sc. Computer Science',
        year: 'SY',
        division: 'A',
        subject: 'Relational Database Management Systems',
        faculty: 'Prof. Rajesh K. Shinde',
        room: 'Room 204 (Smart Classroom)',
      },
      {
        day: 'Tuesday',
        startTime: '09:00 AM',
        endTime: '10:00 AM',
        department: 'Computer Science & IT',
        course: 'B.Sc. Computer Science',
        year: 'SY',
        division: 'A',
        subject: 'Web Technology & Modern Frameworks',
        faculty: 'Prof. Sneha Jadhav',
        room: 'Lab-1 (Software Lab)',
      },
      {
        day: 'Wednesday',
        startTime: '11:15 AM',
        endTime: '12:15 PM',
        department: 'Computer Science & IT',
        course: 'B.Sc. Computer Science',
        year: 'SY',
        division: 'A',
        subject: 'Operating Systems & Linux Architecture',
        faculty: 'Prof. Vikas Salunkhe',
        room: 'Room 204',
      },
    ]);

    // 9. Examinations & Results
    const [exam1] = await db.insert(examinations).values({
      name: 'Semester III Mid-Term Assessment 2024',
      course: 'B.Sc. Computer Science',
      semester: 3,
      subject: 'Data Structures & Algorithms',
      date: '2024-10-18',
      startTime: '10:00 AM',
      endTime: '12:00 PM',
      room: 'Examination Hall A',
      instructions: 'Bring your physical College ID card and Hall Ticket. Scientific calculators allowed.',
    }).returning();

    await db.insert(examinations).values({
      name: 'Semester III End-Semester University Exam',
      course: 'B.Sc. Computer Science',
      semester: 3,
      subject: 'Relational Database Management Systems',
      date: '2024-11-25',
      startTime: '02:00 PM',
      endTime: '05:00 PM',
      room: 'Examination Hall B',
      instructions: 'Standard University examination guidelines apply. Report 30 minutes prior.',
    });

    await db.insert(results).values([
      {
        studentId: stuRecord.id,
        studentLoginId: 'STU001',
        studentName: 'Aditya Narayan More',
        exam: 'Semester II Final University Examination',
        subject: 'Object Oriented Programming (C++)',
        marksObtained: 88,
        totalMarks: 100,
        grade: 'A+',
        resultStatus: 'PASS',
        semester: 2,
        academicYear: '2023-2024',
      },
      {
        studentId: stuRecord.id,
        studentLoginId: 'STU001',
        studentName: 'Aditya Narayan More',
        exam: 'Semester II Final University Examination',
        subject: 'Database Fundamentals',
        marksObtained: 82,
        totalMarks: 100,
        grade: 'A',
        resultStatus: 'PASS',
        semester: 2,
        academicYear: '2023-2024',
      },
      {
        studentId: stuRecord.id,
        studentLoginId: 'STU001',
        studentName: 'Aditya Narayan More',
        exam: 'Semester II Final University Examination',
        subject: 'Discrete Mathematics',
        marksObtained: 76,
        totalMarks: 100,
        grade: 'A',
        resultStatus: 'PASS',
        semester: 2,
        academicYear: '2023-2024',
      },
    ]);

    // 10. Fees
    await db.insert(fees).values([
      {
        studentId: stuRecord.id,
        studentLoginId: 'STU001',
        studentName: 'Aditya Narayan More',
        feeType: 'Academic Tuition & Laboratory Fee (FY 2024-25)',
        totalAmount: 22000,
        paidAmount: 22000,
        pendingAmount: 0,
        dueDate: '2024-08-30',
        status: 'PAID',
        receiptNumber: 'RCP-2024-0891',
        paymentDate: '2024-08-14',
        paymentMode: 'Online NetBanking',
      },
      {
        studentId: stuRecord.id,
        studentLoginId: 'STU001',
        studentName: 'Aditya Narayan More',
        feeType: 'University Examination Fee (Semester III)',
        totalAmount: 1850,
        paidAmount: 0,
        pendingAmount: 1850,
        dueDate: '2024-11-10',
        status: 'PENDING',
        receiptNumber: null,
        paymentDate: null,
        paymentMode: null,
      },
    ]);

    // 11. Certificates
    await db.insert(certificates).values([
      {
        studentId: stuRecord.id,
        studentLoginId: 'STU001',
        studentName: 'Aditya Narayan More',
        certificateType: 'Bonafide Certificate',
        reason: 'National Scholarship Portal (NSP) verification and state bus pass renewal.',
        status: 'APPROVED',
        appliedDate: '2024-09-02',
        issuedDate: '2024-09-04',
        adminNotes: 'Verified with admission register. Issued digitally with college seal.',
        certificateNumber: 'CERT-BON-2024-114',
      },
    ]);

    // 12. Placements
    await db.insert(placements).values([
      {
        company: 'Tata Consultancy Services (TCS)',
        logo: 'https://images.unsplash.com/photo-1542744094-24638eff58bb?auto=format&fit=crop&q=80&w=200',
        jobTitle: 'Assistant System Engineer (TCS Ninja / Digital)',
        package: '3.6 - 7.0 LPA',
        location: 'Pune / Hyderabad / Bangalore',
        eligibility: 'B.Sc. CS, BCA with min 60% aggregate and no active backlogs',
        coursesAllowed: 'B.Sc. Computer Science, BCA, M.Sc. CS',
        driveDate: '2024-11-20',
        deadline: '2024-11-10',
        description: 'Comprehensive campus placement drive for undergraduate and postgraduate computing students.',
        status: 'ACTIVE',
      },
      {
        company: 'Infosys BPM & IT Services',
        logo: 'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?auto=format&fit=crop&q=80&w=200',
        jobTitle: 'Operations Executive & Junior Developer',
        package: '3.2 - 4.5 LPA',
        location: 'Pune / Mumbai',
        eligibility: 'Graduating students of Science, Commerce, and Computer Science',
        coursesAllowed: 'B.Sc., B.Com, BCA',
        driveDate: '2024-12-05',
        deadline: '2024-11-25',
        description: 'Annual campus recruitment drive focusing on technical aptitude, coding, and logical reasoning.',
        status: 'UPCOMING',
      },
      {
        company: 'Wipro Technologies',
        logo: 'https://images.unsplash.com/photo-1497366216548-37526070297c?auto=format&fit=crop&q=80&w=200',
        jobTitle: 'Scholar Trainee (Wipro WILP Program)',
        package: '3.0 LPA + Sponsored M.Tech Degree',
        location: 'Bangalore / Pune',
        eligibility: 'B.Sc. Computer Science / BCA with 60% aggregate',
        coursesAllowed: 'B.Sc. Computer Science, BCA',
        driveDate: '2024-12-18',
        deadline: '2024-12-05',
        description: 'Work-Integrated Learning Program providing 4-year sponsored higher education at BITS Pilani.',
        status: 'UPCOMING',
      },
    ]);

    // 13. Library Books
    const [b1] = await db.insert(libraryBooks).values({
      title: 'Introduction to Algorithms (CLRS)',
      author: 'Thomas H. Cormen, Charles E. Leiserson',
      isbn: '9780262033848',
      category: 'Computer Science',
      edition: '3rd Edition',
      publisher: 'MIT Press',
      totalCopies: 12,
      availableCopies: 10,
      shelfLocation: 'Stack CS-Row 4-Shelf B',
      coverImage: 'https://images.unsplash.com/photo-1532012164546-f432f2e3777f?auto=format&fit=crop&q=80&w=400',
    }).returning();

    await db.insert(libraryBooks).values([
      {
        title: 'Database System Concepts',
        author: 'Abraham Silberschatz, Henry F. Korth',
        isbn: '9780073523323',
        category: 'Computer Science',
        edition: '7th Edition',
        publisher: 'McGraw-Hill',
        totalCopies: 15,
        availableCopies: 14,
        shelfLocation: 'Stack CS-Row 2-Shelf A',
        coverImage: 'https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?auto=format&fit=crop&q=80&w=400',
      },
      {
        title: 'Principles and Practice of Commercial Banking',
        author: 'S. N. Maheshwari, S. K. Maheshwari',
        isbn: '9789352718429',
        category: 'Commerce',
        edition: '11th Edition',
        publisher: 'Sultan Chand & Sons',
        totalCopies: 20,
        availableCopies: 18,
        shelfLocation: 'Stack COMM-Row 1-Shelf C',
        coverImage: 'https://images.unsplash.com/photo-1512820790803-83ca734da794?auto=format&fit=crop&q=80&w=400',
      },
    ]);

    await db.insert(bookIssues).values({
      bookId: b1.id,
      bookTitle: 'Introduction to Algorithms (CLRS)',
      studentId: stuRecord.id,
      studentLoginId: 'STU001',
      studentName: 'Aditya Narayan More',
      issueDate: '2024-09-15',
      dueDate: '2024-10-15',
      returnDate: null,
      status: 'ISSUED',
      fine: 0,
    });

    // 14. Grievances
    await db.insert(grievances).values({
      studentId: stuRecord.id,
      studentLoginId: 'STU001',
      studentName: 'Aditya Narayan More',
      category: 'Facility',
      title: 'High-speed Wi-Fi access in Central Library Reading Hall',
      description: 'The Wi-Fi signal in the secondary reading hall drops frequently during research hours.',
      status: 'RESOLVED',
      adminResponse: 'A secondary high-speed dual-band Wi-Fi access point has been installed and tested in Reading Hall 2.',
      resolvedAt: '2024-09-20',
    });

    // 15. Notices
    await db.insert(notices).values([
      {
        title: 'Schedule for Semester End University Examinations - Winter 2024',
        category: 'Exam',
        content: 'All undergraduate and postgraduate students are hereby notified that Winter 2024 University examinations commence from 25th November 2024. Submit examination forms and verify course codes with the respective departments before the due date.',
        date: '2024-10-05',
        isPinned: true,
        targetAudience: 'All',
        status: 'PUBLISHED',
      },
      {
        title: 'Campus Recruitment Drive by TCS & Infosys - Registration Open',
        category: 'Academic',
        content: 'The Training & Placement Cell invites applications from final year students of B.Sc. Computer Science, BCA, and B.Com for upcoming on-campus recruitment drives. Mandatory pre-placement session scheduled on Saturday at the Central Auditorium.',
        date: '2024-10-03',
        isPinned: true,
        targetAudience: 'Students',
        status: 'PUBLISHED',
      },
      {
        title: 'Annual Sports Meet & Inter-Collegiate Tournaments 2024-25',
        category: 'Sports',
        content: 'Sharadabai Pawar College Annual Sports Meet will be hosted from 14th to 16th December 2024. Competitions include Cricket, Volleyball, Kabaddi, Badminton, Chess, and Athletics. Interested captains must submit team rosters to the Physical Education Director.',
        date: '2024-09-28',
        isPinned: false,
        targetAudience: 'All',
        status: 'PUBLISHED',
      },
    ]);

    // 16. Events
    await db.insert(events).values([
      {
        title: 'National Conference on Advances in Computing & AI (NCAC-2024)',
        category: 'Seminar',
        date: '2024-11-15',
        time: '09:30 AM - 05:00 PM',
        venue: 'College Main Auditorium & Seminar Hall 1',
        description: 'Keynote addresses by distinguished researchers, paper presentations, and hands-on demonstrations in cloud machine learning.',
        image: 'https://images.unsplash.com/photo-1540575467063-178a50c2df87?auto=format&fit=crop&q=80&w=800',
        status: 'UPCOMING',
      },
      {
        title: 'Sharada Youth Cultural Festival & Annual Gathering 2025',
        category: 'Cultural',
        date: '2025-01-22',
        time: '10:00 AM - 08:00 PM',
        venue: 'Open Air Amphitheatre',
        description: 'A grand celebration of performing arts, classical music, drama, folk dances, debates, and fine arts exhibits.',
        image: 'https://images.unsplash.com/photo-1514525253161-7a46d19cd819?auto=format&fit=crop&q=80&w=800',
        status: 'UPCOMING',
      },
      {
        title: 'Tree Plantation & Environmental Sustainability Drive',
        category: 'Social',
        date: '2024-09-12',
        time: '08:00 AM - 12:00 PM',
        venue: 'Campus Botanical Garden & Surrounding Grounds',
        description: 'NSS volunteers and faculty planted over 350 native medicinal and fruit-bearing trees across the campus perimeter.',
        image: 'https://images.unsplash.com/photo-1542601906990-b4d3fb778b09?auto=format&fit=crop&q=80&w=800',
        status: 'COMPLETED',
      },
    ]);

    // 17. Facilities
    await db.insert(facilities).values([
      {
        name: 'Advanced Computing Center & Software Labs',
        category: 'Tech',
        description: 'Four fully air-conditioned computer laboratories housing over 180 high-performance workstations with gigabit fiber-optic connectivity, Linux servers, and software suites.',
        imageUrl: 'https://images.unsplash.com/photo-1581092918056-0c4c3acd3789?auto=format&fit=crop&q=80&w=800',
        features: '1 Gbps Dedicated Leased Line, 180+ Workstations, High-speed GPU workstations, Dual UPS backup',
      },
      {
        name: 'Central Knowledge Resource Center & Digital Library',
        category: 'Academic',
        description: 'A sprawling two-floor library housing over 45,000 volumes, international journal subscriptions, INFLIBNET/N-LIST e-resource terminals, and spacious silent reading halls.',
        imageUrl: 'https://images.unsplash.com/photo-1521587760476-6c12a4b040da?auto=format&fit=crop&q=80&w=800',
        features: '45,000+ Physical Books, N-LIST digital access, 250-seat reading hall, RFID circulation',
      },
      {
        name: 'Modern Science & Biotechnology Research Laboratories',
        category: 'Academic',
        description: 'Dedicated spacious practical laboratories for Physics, Chemistry, Botany, and Microbiology equipped with precision spectrophotometers, laminar airflows, and digital microscopes.',
        imageUrl: 'https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?auto=format&fit=crop&q=80&w=800',
        features: 'Modern analytical instruments, Safety showers & fume hoods, Botanical herbarium, Research cell',
      },
      {
        name: 'Sports Complex & Athletic Grounds',
        category: 'Sports',
        description: 'Extensive multi-sport playground supporting cricket, football, kabaddi, kho-kho, along with an indoor sports pavilion for badminton, table tennis, and gymnasium.',
        imageUrl: 'https://images.unsplash.com/photo-1534438327276-14e5300c3a48?auto=format&fit=crop&q=80&w=800',
        features: 'Standard 400m running track, 2 Cricket pitches, Indoor Badminton court, Modern Gym equipment',
      },
    ]);

    // 18. Achievements
    await db.insert(achievements).values([
      {
        title: 'NAAC Accreditation with Distinction',
        recipient: 'Sharadabai Pawar College, Omerga',
        category: 'Institutional',
        year: '2023',
        description: 'Recognized for excellent academic standards, community engagement through NSS, and high placement outcomes.',
        imageUrl: 'https://images.unsplash.com/photo-1523240795612-9a054b0db644?auto=format&fit=crop&q=80&w=800',
      },
      {
        title: '1st Prize at Inter-Collegiate University Hackathon',
        recipient: 'Department of Computer Science Team',
        category: 'Technical',
        year: '2024',
        description: 'Undergraduate student team developed an AI-assisted crop disease detection mobile solution for Marathwada farmers.',
        imageUrl: 'https://images.unsplash.com/photo-1531482615713-2afd69097998?auto=format&fit=crop&q=80&w=800',
      },
      {
        title: 'State Championship in University Athletics Meet',
        recipient: 'Rohan Shinde & College Athletics Contingent',
        category: 'Sports',
        year: '2024',
        description: 'Gold medal in 800m track event and silver medal in 4x100m relay at the state-level inter-university tournament.',
        imageUrl: 'https://images.unsplash.com/photo-1461896836934-ffe607ba8211?auto=format&fit=crop&q=80&w=800',
      },
    ]);

    // 19. Gallery Items
    await db.insert(galleryItems).values([
      {
        title: 'College Main Campus & Academic Administrative Wing',
        category: 'Campus',
        imageUrl: 'https://images.unsplash.com/photo-1562774053-701939374585?auto=format&fit=crop&q=80&w=800',
        caption: 'The landmark building of Sharadabai Pawar College, Omerga.',
      },
      {
        title: 'Students working in Advanced Computer Science Lab',
        category: 'Labs',
        imageUrl: 'https://images.unsplash.com/photo-1517694712202-14dd9538aa97?auto=format&fit=crop&q=80&w=800',
        caption: 'Hands-on programming and practical training session.',
      },
      {
        title: 'Central Library Silent Study & Digital Research Hall',
        category: 'Library',
        imageUrl: 'https://images.unsplash.com/photo-1521587760476-6c12a4b040da?auto=format&fit=crop&q=80&w=800',
        caption: 'Comfortable academic reading atmosphere with thousands of reference books.',
      },
      {
        title: 'Convocation & Degree Distribution Ceremony',
        category: 'Events',
        imageUrl: 'https://images.unsplash.com/photo-1523240795612-9a054b0db644?auto=format&fit=crop&q=80&w=800',
        caption: 'Graduating batch receiving academic degree honors.',
      },
      {
        title: 'Inter-Collegiate Cultural Performance & Dance',
        category: 'Cultural',
        imageUrl: 'https://images.unsplash.com/photo-1514525253161-7a46d19cd819?auto=format&fit=crop&q=80&w=800',
        caption: 'Vibrant cultural heritage showcase by talented students.',
      },
      {
        title: 'Chemistry & Biotechnology Practical Research',
        category: 'Labs',
        imageUrl: 'https://images.unsplash.com/photo-1532094349884-543bc11b234d?auto=format&fit=crop&q=80&w=800',
        caption: 'Analytical experiments conducted in college chemistry laboratories.',
      },
    ]);

    // 20. CMS Content
    await db.insert(cmsContent).values([
      {
        sectionKey: 'homepage_hero',
        data: JSON.stringify({
          heroTitle: 'Sharadabai Pawar College, Omerga',
          heroSubtitle: 'SCSCO Digital Campus — Empowering Rural Minds with Excellence in Higher Education, Innovation & Character Building.',
          estYear: '1990',
          naacGrade: 'A Grade Accredited',
          campusArea: '18 Acres Lush Green Campus',
          heroBanner: 'https://images.unsplash.com/photo-1541339907198-e08756dedf3f?auto=format&fit=crop&q=80&w=1600',
          ctaText: 'Explore Admissions 2025-26',
          ctaLink: '/admissions',
        }),
        updatedBy: 'ADMIN001',
      },
      {
        sectionKey: 'principal_profile',
        data: JSON.stringify({
          name: 'Dr. Suresh V. Patil',
          designation: 'Principal & Professor',
          qualifications: 'M.Sc., Ph.D., Postdoc (USA), F.I.C.S.',
          experience: '28+ Years of Academic Leadership',
          photo: 'https://images.unsplash.com/photo-1560250097-0b93528c311a?auto=format&fit=crop&q=80&w=800',
          message: 'Welcome to Sharadabai Pawar College, Omerga. Established with the vision to bring quality tertiary education, scientific temperament, and ethical leadership to students of rural and semi-urban Marathwada, our institution stands proud with three decades of academic distinction. Our digital campus platform connects students, faculty, and parents in real time, fostering transparency, modern learning pedagogy, and industry readiness.',
          email: 'principal@sharadacollege.edu.in',
          phone: '+91 (02475) 252244',
        }),
        updatedBy: 'ADMIN001',
      },
      {
        sectionKey: 'contact_info',
        data: JSON.stringify({
          collegeName: 'Sharadabai Pawar College, Omerga',
          societyName: 'Shri Chhatrapati Shivaji Shikshan Sanstha',
          address: 'Main Campus, National Highway 65, Omerga, District Dharashiv (Osmanabad), Maharashtra - 413606, India',
          phone: '+91 (02475) 252244 / +91 94220 55667',
          email: 'contact@sharadacollege.edu.in',
          admissionsEmail: 'admissions@sharadacollege.edu.in',
          officeHours: 'Monday - Saturday: 09:30 AM to 05:30 PM (Sunday Closed)',
        }),
        updatedBy: 'ADMIN001',
      },
      {
        sectionKey: 'admissions_info',
        data: JSON.stringify({
          academicYear: '2025-2026',
          status: 'Admissions Open for Undergraduate & Postgraduate Programs',
          instruction: 'Prospective students can submit an online registration application or visit the Central Administrative Admissions Counter at the Omerga campus with required documents.',
          requiredDocs: [
            'HSC / 10+2 Original Marksheet and Passing Certificate',
            'School / Junior College Leaving Certificate (TC)',
            'Domicile & Nationality Certificate',
            'Caste & Validity Certificate (if applicable)',
            'Aadhaar Card copy & 4 Passport size color photographs',
          ],
        }),
        updatedBy: 'ADMIN001',
      },
    ]);

    // 21. Audit Log
    await db.insert(auditLogs).values({
      userLoginId: 'SYSTEM',
      userName: 'Platform Initializer',
      role: 'SUPER_ADMIN',
      action: 'INITIALIZE',
      module: 'System',
      recordId: '1',
      details: 'Initial database bootstrap, institutional models, and credentials initialized successfully.',
    });

    console.log('Database seeded successfully with initial platform data!');
  } catch (err) {
    console.error('Error during database seed:', err);
  }
}
