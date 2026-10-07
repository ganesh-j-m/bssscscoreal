import { Router, Response } from 'express';
import { db } from '../../src/db/index.ts';
import { examinations, results, students } from '../../src/db/schema.ts';
import { eq, desc, sql } from 'drizzle-orm';
import { requireAuth, requireRoles, AuthenticatedRequest } from '../middleware/auth.ts';
import { createAuditLog } from '../services/audit.ts';

const router = Router();

// ================= EXAMINATIONS =================
router.get('/examinations', async (req, res: Response) => {
  try {
    const list = await db.select().from(examinations).orderBy(desc(examinations.date));
    res.json({ examinations: list });
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch examinations' });
  }
});

router.post('/examinations', requireAuth, requireRoles(['SUPER_ADMIN', 'PRINCIPAL', 'FACULTY']), async (req: AuthenticatedRequest, res: Response) => {
  try {
    const { name, course, semester, subject, date, startTime, endTime, room, instructions } = req.body;
    if (!name || !course || !subject || !date) {
      return res.status(400).json({ error: 'Exam name, Course, Subject, and Date are required.' });
    }

    const [exam] = await db.insert(examinations).values({
      name,
      course,
      semester: parseInt(String(semester), 10) || 1,
      subject,
      date,
      startTime: startTime || '10:00 AM',
      endTime: endTime || '01:00 PM',
      room: room || 'Main Exam Hall',
      instructions,
    }).returning();

    await createAuditLog({
      userLoginId: req.user!.loginId,
      userName: req.user!.name,
      role: req.user!.role,
      action: 'CREATE',
      module: 'Examinations',
      recordId: exam.id,
      details: `Scheduled examination: ${exam.name} for ${exam.subject}.`,
    });

    res.status(201).json({ success: true, examination: exam });
  } catch (err) {
    res.status(500).json({ error: 'Failed to schedule exam' });
  }
});

router.delete('/examinations/:id', requireAuth, requireRoles(['SUPER_ADMIN']), async (req: AuthenticatedRequest, res: Response) => {
  try {
    const id = parseInt(req.params.id, 10);
    await db.delete(examinations).where(eq(examinations.id, id));
    res.json({ success: true, message: 'Examination deleted' });
  } catch (err) {
    res.status(500).json({ error: 'Failed to delete exam' });
  }
});

// ================= RESULTS =================
// Admin list all results
router.get('/results', requireAuth, async (req: AuthenticatedRequest, res: Response) => {
  try {
    const { exam, subject, studentLoginId } = req.query;
    let list = await db.select().from(results).orderBy(desc(results.createdAt));

    if (exam && exam !== 'ALL') list = list.filter(r => r.exam === exam);
    if (subject && subject !== 'ALL') list = list.filter(r => r.subject === subject);
    if (studentLoginId) list = list.filter(r => r.studentLoginId === studentLoginId);

    res.json({ results: list });
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch results' });
  }
});

// Student view own results
router.get('/results/student/:loginId', requireAuth, async (req: AuthenticatedRequest, res: Response) => {
  try {
    const targetId = req.params.loginId.toUpperCase();
    if (req.user!.role === 'STUDENT' && req.user!.loginId.toUpperCase() !== targetId) {
      return res.status(403).json({ error: 'Forbidden: You can only view your own results.' });
    }

    const records = await db
      .select()
      .from(results)
      .where(sql`upper(${results.studentLoginId}) = ${targetId}`)
      .orderBy(desc(results.createdAt));

    res.json({ results: records });
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch student results' });
  }
});

// Create result
router.post('/results', requireAuth, requireRoles(['SUPER_ADMIN', 'PRINCIPAL', 'FACULTY']), async (req: AuthenticatedRequest, res: Response) => {
  try {
    const { studentLoginId, studentName, exam, subject, marksObtained, totalMarks = 100, semester = 1, academicYear } = req.body;

    if (!studentLoginId || !exam || !subject || marksObtained === undefined) {
      return res.status(400).json({ error: 'Student Login ID, Exam, Subject, and Marks are required.' });
    }

    const marks = parseInt(String(marksObtained), 10);
    const total = parseInt(String(totalMarks), 10) || 100;
    const percentage = (marks / total) * 100;

    let grade = 'F';
    let resultStatus = 'FAIL';
    if (percentage >= 80) { grade = 'A+'; resultStatus = 'PASS'; }
    else if (percentage >= 70) { grade = 'A'; resultStatus = 'PASS'; }
    else if (percentage >= 60) { grade = 'B+'; resultStatus = 'PASS'; }
    else if (percentage >= 50) { grade = 'B'; resultStatus = 'PASS'; }
    else if (percentage >= 40) { grade = 'C'; resultStatus = 'PASS'; }

    const stu = await db.select().from(students).where(eq(students.studentId, studentLoginId.toUpperCase())).limit(1);

    const [resRecord] = await db.insert(results).values({
      studentId: stu.length > 0 ? stu[0].id : null,
      studentLoginId: String(studentLoginId).trim().toUpperCase(),
      studentName: studentName || (stu.length > 0 ? stu[0].name : 'Student'),
      exam: String(exam).trim(),
      subject: String(subject).trim(),
      marksObtained: marks,
      totalMarks: total,
      grade,
      resultStatus,
      semester: parseInt(String(semester), 10) || 1,
      academicYear: academicYear || '2024-2025',
    }).returning();

    await createAuditLog({
      userLoginId: req.user!.loginId,
      userName: req.user!.name,
      role: req.user!.role,
      action: 'CREATE',
      module: 'Results',
      recordId: resRecord.id,
      details: `Entered result for ${resRecord.studentLoginId} (${resRecord.subject}: ${marks}/${total}).`,
    });

    res.status(201).json({ success: true, result: resRecord });
  } catch (err) {
    res.status(500).json({ error: 'Failed to record examination result' });
  }
});

router.delete('/results/:id', requireAuth, requireRoles(['SUPER_ADMIN']), async (req: AuthenticatedRequest, res: Response) => {
  try {
    const id = parseInt(req.params.id, 10);
    await db.delete(results).where(eq(results.id, id));
    res.json({ success: true, message: 'Result record deleted' });
  } catch (err) {
    res.status(500).json({ error: 'Failed to delete result record' });
  }
});

export default router;
