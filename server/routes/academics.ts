import { Router, Response } from 'express';
import { db } from '../../src/db/index.ts';
import { departments, courses, subjects, timetable } from '../../src/db/schema.ts';
import { eq, desc } from 'drizzle-orm';
import { requireAuth, requireRoles, AuthenticatedRequest } from '../middleware/auth.ts';
import { createAuditLog } from '../services/audit.ts';

const router = Router();

// ================= DEPARTMENTS =================
// Public get departments
router.get('/departments', async (req, res: Response) => {
  try {
    const list = await db.select().from(departments).orderBy(desc(departments.createdAt));
    res.json({ departments: list });
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch departments' });
  }
});

router.post('/departments', requireAuth, requireRoles(['SUPER_ADMIN']), async (req: AuthenticatedRequest, res: Response) => {
  try {
    const { code, name, hod, description, image, establishedYear } = req.body;
    if (!code || !name) {
      return res.status(400).json({ error: 'Department Code and Name are required.' });
    }

    const [dept] = await db.insert(departments).values({
      code: String(code).trim().toUpperCase(),
      name: String(name).trim(),
      hod: hod ? String(hod).trim() : null,
      description: description ? String(description).trim() : null,
      image: image || 'https://images.unsplash.com/photo-1517694712202-14dd9538aa97?auto=format&fit=crop&q=80&w=800',
      establishedYear: establishedYear ? parseInt(String(establishedYear), 10) : new Date().getFullYear(),
    }).returning();

    await createAuditLog({
      userLoginId: req.user!.loginId,
      userName: req.user!.name,
      role: req.user!.role,
      action: 'CREATE',
      module: 'Departments',
      recordId: dept.id,
      details: `Created department ${dept.name} (${dept.code}).`,
    });

    res.status(201).json({ success: true, department: dept });
  } catch (err: any) {
    res.status(500).json({ error: 'Failed to create department.' });
  }
});

router.put('/departments/:id', requireAuth, requireRoles(['SUPER_ADMIN']), async (req: AuthenticatedRequest, res: Response) => {
  try {
    const id = parseInt(req.params.id, 10);
    const { name, hod, description, image, status } = req.body;
    const [updated] = await db.update(departments).set({
      name,
      hod,
      description,
      image,
      status,
    }).where(eq(departments.id, id)).returning();
    res.json({ success: true, department: updated });
  } catch (err) {
    res.status(500).json({ error: 'Failed to update department' });
  }
});

router.delete('/departments/:id', requireAuth, requireRoles(['SUPER_ADMIN']), async (req: AuthenticatedRequest, res: Response) => {
  try {
    const id = parseInt(req.params.id, 10);
    await db.delete(departments).where(eq(departments.id, id));
    res.json({ success: true, message: 'Department deleted' });
  } catch (err) {
    res.status(500).json({ error: 'Failed to delete department' });
  }
});

// ================= COURSES =================
// Public get courses
router.get('/courses', async (req, res: Response) => {
  try {
    const list = await db.select().from(courses).orderBy(desc(courses.createdAt));
    res.json({ courses: list });
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch courses' });
  }
});

router.post('/courses', requireAuth, requireRoles(['SUPER_ADMIN']), async (req: AuthenticatedRequest, res: Response) => {
  try {
    const { code, name, department, duration, degreeType, intake, eligibility, description, feePerYear } = req.body;
    if (!code || !name || !department || !duration) {
      return res.status(400).json({ error: 'Code, Name, Department, and Duration are required.' });
    }

    const [crs] = await db.insert(courses).values({
      code: String(code).trim().toUpperCase(),
      name: String(name).trim(),
      department: String(department).trim(),
      duration: String(duration).trim(),
      degreeType: degreeType || 'UG',
      intake: intake ? parseInt(String(intake), 10) : 60,
      eligibility,
      description,
      feePerYear: feePerYear ? parseInt(String(feePerYear), 10) : 15000,
    }).returning();

    await createAuditLog({
      userLoginId: req.user!.loginId,
      userName: req.user!.name,
      role: req.user!.role,
      action: 'CREATE',
      module: 'Courses',
      recordId: crs.id,
      details: `Created course ${crs.name} (${crs.code}).`,
    });

    res.status(201).json({ success: true, course: crs });
  } catch (err: any) {
    res.status(500).json({ error: 'Failed to create course.' });
  }
});

router.put('/courses/:id', requireAuth, requireRoles(['SUPER_ADMIN']), async (req: AuthenticatedRequest, res: Response) => {
  try {
    const id = parseInt(req.params.id, 10);
    const [updated] = await db.update(courses).set(req.body).where(eq(courses.id, id)).returning();
    res.json({ success: true, course: updated });
  } catch (err) {
    res.status(500).json({ error: 'Failed to update course' });
  }
});

router.delete('/courses/:id', requireAuth, requireRoles(['SUPER_ADMIN']), async (req: AuthenticatedRequest, res: Response) => {
  try {
    const id = parseInt(req.params.id, 10);
    await db.delete(courses).where(eq(courses.id, id));
    res.json({ success: true, message: 'Course deleted' });
  } catch (err) {
    res.status(500).json({ error: 'Failed to delete course' });
  }
});

// ================= SUBJECTS =================
router.get('/subjects', async (req, res: Response) => {
  try {
    const list = await db.select().from(subjects).orderBy(subjects.course, subjects.semester);
    res.json({ subjects: list });
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch subjects' });
  }
});

router.post('/subjects', requireAuth, requireRoles(['SUPER_ADMIN', 'PRINCIPAL', 'FACULTY']), async (req: AuthenticatedRequest, res: Response) => {
  try {
    const { code, name, course, semester, credits, faculty } = req.body;
    const [subj] = await db.insert(subjects).values({
      code: String(code).trim().toUpperCase(),
      name: String(name).trim(),
      course: String(course).trim(),
      semester: parseInt(String(semester), 10) || 1,
      credits: parseInt(String(credits), 10) || 4,
      faculty: faculty ? String(faculty).trim() : null,
    }).returning();
    res.status(201).json({ success: true, subject: subj });
  } catch (err) {
    res.status(500).json({ error: 'Failed to create subject' });
  }
});

router.put('/subjects/:id', requireAuth, requireRoles(['SUPER_ADMIN', 'PRINCIPAL']), async (req: AuthenticatedRequest, res: Response) => {
  try {
    const id = parseInt(req.params.id, 10);
    const [updated] = await db.update(subjects).set(req.body).where(eq(subjects.id, id)).returning();
    res.json({ success: true, subject: updated });
  } catch (err) {
    res.status(500).json({ error: 'Failed to update subject' });
  }
});

router.delete('/subjects/:id', requireAuth, requireRoles(['SUPER_ADMIN']), async (req: AuthenticatedRequest, res: Response) => {
  try {
    const id = parseInt(req.params.id, 10);
    await db.delete(subjects).where(eq(subjects.id, id));
    res.json({ success: true, message: 'Subject deleted' });
  } catch (err) {
    res.status(500).json({ error: 'Failed to delete subject' });
  }
});

// ================= TIMETABLE =================
router.get('/timetable', async (req, res: Response) => {
  try {
    const { day, course, year, division } = req.query;
    let list = await db.select().from(timetable).orderBy(timetable.day, timetable.startTime);

    if (day && day !== 'ALL') {
      list = list.filter(t => t.day.toLowerCase() === String(day).toLowerCase());
    }
    if (course && course !== 'ALL') {
      list = list.filter(t => t.course === course);
    }
    if (year && year !== 'ALL') {
      list = list.filter(t => t.year === year);
    }
    if (division && division !== 'ALL') {
      list = list.filter(t => t.division === division);
    }

    res.json({ timetable: list });
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch timetable' });
  }
});

router.post('/timetable', requireAuth, requireRoles(['SUPER_ADMIN', 'PRINCIPAL', 'FACULTY']), async (req: AuthenticatedRequest, res: Response) => {
  try {
    const { day, startTime, endTime, department, course, year, division, subject, faculty, room } = req.body;
    const [entry] = await db.insert(timetable).values({
      day,
      startTime,
      endTime,
      department,
      course,
      year,
      division,
      subject,
      faculty,
      room,
    }).returning();
    res.status(201).json({ success: true, entry });
  } catch (err) {
    res.status(500).json({ error: 'Failed to create timetable slot' });
  }
});

router.delete('/timetable/:id', requireAuth, requireRoles(['SUPER_ADMIN']), async (req: AuthenticatedRequest, res: Response) => {
  try {
    const id = parseInt(req.params.id, 10);
    await db.delete(timetable).where(eq(timetable.id, id));
    res.json({ success: true, message: 'Timetable entry deleted' });
  } catch (err) {
    res.status(500).json({ error: 'Failed to delete timetable entry' });
  }
});

export default router;
