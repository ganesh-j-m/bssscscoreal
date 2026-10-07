import { Router, Response } from 'express';
import crypto from 'crypto';
import QRCode from 'qrcode';
import { db } from '../../src/db/index.ts';
import { attendanceSessions, attendances, students } from '../../src/db/schema.ts';
import { eq, and, desc, sql } from 'drizzle-orm';
import { requireAuth, requireRoles, AuthenticatedRequest } from '../middleware/auth.ts';
import { createAuditLog } from '../services/audit.ts';

const router = Router();

// 1. Create QR Attendance Session (Faculty / Admin) - 5 minutes validity
router.post('/session', requireAuth, requireRoles(['SUPER_ADMIN', 'PRINCIPAL', 'FACULTY']), async (req: AuthenticatedRequest, res: Response) => {
  try {
    const { subject, course, year, division } = req.body;

    if (!subject || !course || !year || !division) {
      return res.status(400).json({ error: 'Subject, Course, Year, and Division are required.' });
    }

    const sessionId = `SES-${Date.now()}-${Math.floor(100 + Math.random() * 900)}`;
    const qrToken = crypto.randomBytes(24).toString('hex');
    const now = new Date();
    const expiresAt = new Date(now.getTime() + 5 * 60 * 1000); // 5 minutes validity

    const facultyName = req.user!.name;
    const facultyLoginId = req.user!.loginId;

    const payloadToEncode = JSON.stringify({
      sessionId,
      qrToken,
      subject,
      course,
      year,
      division,
      expiresAt: expiresAt.toISOString(),
    });

    const qrCodeDataUrl = await QRCode.toDataURL(payloadToEncode, {
      width: 320,
      margin: 2,
      color: {
        dark: '#1e1b4b',
        light: '#ffffff',
      },
    });

    const [session] = await db.insert(attendanceSessions).values({
      sessionId,
      subject: String(subject).trim(),
      course: String(course).trim(),
      year: String(year).trim(),
      division: String(division).trim().toUpperCase(),
      facultyName,
      facultyLoginId,
      qrToken,
      date: now.toISOString().split('T')[0],
      startTime: now.toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit', second: '2-digit' }),
      expiresAt,
      status: 'ACTIVE',
    }).returning();

    await createAuditLog({
      userLoginId: req.user!.loginId,
      userName: req.user!.name,
      role: req.user!.role,
      action: 'QR_SESSION_CREATED',
      module: 'Attendance',
      recordId: session.id,
      details: `Generated 5-minute QR attendance session for ${subject} (${course} - ${year} Div ${division}).`,
    });

    res.status(201).json({
      success: true,
      session,
      qrCodeDataUrl,
      expiresAt: expiresAt.toISOString(),
      timeRemainingSeconds: 300,
    });
  } catch (err: any) {
    console.error('Error creating attendance session:', err);
    res.status(500).json({ error: 'Failed to create attendance session.' });
  }
});

// 2. Scan QR and Mark Attendance (Student)
router.post('/scan', requireAuth, async (req: AuthenticatedRequest, res: Response) => {
  try {
    const { qrToken, sessionId } = req.body;

    if (!qrToken && !sessionId) {
      return res.status(400).json({ error: 'Missing QR session token.' });
    }

    // Must be student
    if (req.user!.role !== 'STUDENT' && req.user!.role !== 'SUPER_ADMIN') {
      return res.status(403).json({ error: 'Only registered students can scan attendance QR codes.' });
    }

    // Find student record
    const stuList = await db.select().from(students).where(eq(students.studentId, req.user!.loginId)).limit(1);
    if (stuList.length === 0) {
      return res.status(404).json({ error: 'Student academic profile not found for current user.' });
    }
    const currentStudent = stuList[0];

    // Find session
    let sessionQuery = db.select().from(attendanceSessions);
    let sessionResults;
    if (qrToken) {
      sessionResults = await sessionQuery.where(eq(attendanceSessions.qrToken, qrToken)).limit(1);
    } else {
      sessionResults = await sessionQuery.where(eq(attendanceSessions.sessionId, sessionId)).limit(1);
    }

    if (sessionResults.length === 0) {
      return res.status(404).json({ error: 'Invalid attendance session QR code.' });
    }

    const session = sessionResults[0];
    const now = new Date();

    // Check expiry
    if (now > new Date(session.expiresAt) || session.status === 'EXPIRED') {
      if (session.status !== 'EXPIRED') {
        await db.update(attendanceSessions).set({ status: 'EXPIRED' }).where(eq(attendanceSessions.id, session.id));
      }
      return res.status(400).json({ error: 'Attendance QR code has expired (validity is 5 minutes). Please ask faculty to generate a new session.' });
    }

    // Class / Course eligibility check
    if (currentStudent.course !== session.course || currentStudent.year !== session.year || currentStudent.division !== session.division) {
      return res.status(403).json({
        error: `Attendance mismatch: This session is for ${session.course} ${session.year} Division ${session.division}. Your profile is ${currentStudent.course} ${currentStudent.year} Division ${currentStudent.division}.`,
      });
    }

    // DUPLICATE CHECK: block duplicate attendance
    const existingAttendance = await db
      .select()
      .from(attendances)
      .where(and(
        eq(attendances.studentLoginId, currentStudent.studentId),
        eq(attendances.sessionId, session.sessionId)
      ))
      .limit(1);

    if (existingAttendance.length > 0) {
      return res.status(409).json({
        error: 'Duplicate Attendance Blocked: You have already successfully marked your attendance for this session.',
      });
    }

    // Mark attendance
    const [attRecord] = await db.insert(attendances).values({
      studentId: currentStudent.id,
      studentLoginId: currentStudent.studentId,
      studentName: currentStudent.name,
      subject: session.subject,
      faculty: session.facultyName,
      date: session.date,
      time: now.toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' }),
      status: 'Present',
      sessionId: session.sessionId,
      course: session.course,
      year: session.year,
      division: session.division,
    }).returning();

    await createAuditLog({
      userLoginId: currentStudent.studentId,
      userName: currentStudent.name,
      role: 'STUDENT',
      action: 'QR_SCAN',
      module: 'Attendance',
      recordId: attRecord.id,
      details: `Student scanned QR and marked Present for ${session.subject}.`,
    });

    res.json({
      success: true,
      message: `Attendance marked successfully as Present for ${session.subject}!`,
      attendance: attRecord,
    });
  } catch (err: any) {
    console.error('QR scan error:', err);
    res.status(500).json({ error: 'Failed to process QR attendance scan.' });
  }
});

// 3. Get Attendance records (Admin / Faculty)
router.get('/records', requireAuth, async (req: AuthenticatedRequest, res: Response) => {
  try {
    const { date, subject, course, studentLoginId } = req.query;
    let list = await db.select().from(attendances).orderBy(desc(attendances.createdAt));

    if (date) {
      list = list.filter(a => a.date === date);
    }
    if (subject && subject !== 'ALL') {
      list = list.filter(a => a.subject === subject);
    }
    if (course && course !== 'ALL') {
      list = list.filter(a => a.course === course);
    }
    if (studentLoginId) {
      list = list.filter(a => a.studentLoginId === studentLoginId);
    }

    res.json({ attendances: list });
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch attendance records' });
  }
});

// 4. Student view own attendance
router.get('/student/:loginId', requireAuth, async (req: AuthenticatedRequest, res: Response) => {
  try {
    const targetId = req.params.loginId.toUpperCase();
    
    // Students can only view their own
    if (req.user!.role === 'STUDENT' && req.user!.loginId.toUpperCase() !== targetId) {
      return res.status(403).json({ error: 'Forbidden: You can only view your own attendance.' });
    }

    const records = await db
      .select()
      .from(attendances)
      .where(sql`upper(${attendances.studentLoginId}) = ${targetId}`)
      .orderBy(desc(attendances.createdAt));

    const total = records.length;
    const present = records.filter(r => r.status === 'Present').length;
    const percentage = total > 0 ? Math.round((present / total) * 100) : 100;

    res.json({
      records,
      total,
      present,
      absent: total - present,
      percentage,
    });
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch student attendance' });
  }
});

// 5. Manual Attendance Entry (Faculty / Admin)
router.post('/manual', requireAuth, requireRoles(['SUPER_ADMIN', 'PRINCIPAL', 'FACULTY']), async (req: AuthenticatedRequest, res: Response) => {
  try {
    const { studentId, studentLoginId, studentName, subject, date, status = 'Present', course, year, division } = req.body;

    if (!studentLoginId || !subject || !date) {
      return res.status(400).json({ error: 'Student Login ID, Subject, and Date are required.' });
    }

    const [record] = await db.insert(attendances).values({
      studentId: studentId ? parseInt(String(studentId), 10) : null,
      studentLoginId: String(studentLoginId).trim().toUpperCase(),
      studentName: studentName || 'Student',
      subject: String(subject).trim(),
      faculty: req.user!.name,
      date: String(date).trim(),
      time: new Date().toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' }),
      status: String(status).trim(),
      course: course || 'B.Sc. Computer Science',
      year: year || 'SY',
      division: division || 'A',
    }).returning();

    res.status(201).json({ success: true, record });
  } catch (err) {
    res.status(500).json({ error: 'Failed to record manual attendance' });
  }
});

export default router;
