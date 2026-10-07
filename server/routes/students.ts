import { Router, Response } from 'express';
import bcrypt from 'bcryptjs';
import { db } from '../../src/db/index.ts';
import { students, users } from '../../src/db/schema.ts';
import { eq, desc, sql, or } from 'drizzle-orm';
import { requireAuth, requireRoles, AuthenticatedRequest } from '../middleware/auth.ts';
import { createAuditLog } from '../services/audit.ts';

const router = Router();

// 1. List students
router.get('/', requireAuth, async (req: AuthenticatedRequest, res: Response) => {
  try {
    const { search, department, course, year, page = '1', limit = '15' } = req.query;

    const pageNum = Math.max(1, parseInt(page as string, 10) || 1);
    const limitNum = Math.max(1, Math.min(100, parseInt(limit as string, 10) || 15));
    const offset = (pageNum - 1) * limitNum;

    const allStudents = await db.select().from(students).orderBy(desc(students.createdAt));

    let filtered = allStudents;
    if (department && department !== 'ALL') {
      filtered = filtered.filter(s => s.department === department);
    }
    if (course && course !== 'ALL') {
      filtered = filtered.filter(s => s.course === course);
    }
    if (year && year !== 'ALL') {
      filtered = filtered.filter(s => s.year === year);
    }
    if (search) {
      const q = String(search).toLowerCase();
      filtered = filtered.filter(s =>
        s.name.toLowerCase().includes(q) ||
        s.studentId.toLowerCase().includes(q) ||
        s.prn.toLowerCase().includes(q) ||
        s.email.toLowerCase().includes(q)
      );
    }

    const total = filtered.length;
    const paginated = filtered.slice(offset, offset + limitNum);

    res.json({
      students: paginated,
      total,
      page: pageNum,
      totalPages: Math.ceil(total / limitNum) || 1,
    });
  } catch (err: any) {
    console.error('Error fetching students:', err);
    res.status(500).json({ error: 'Failed to fetch students' });
  }
});

// 2. Get single student
router.get('/:id', requireAuth, async (req: AuthenticatedRequest, res: Response) => {
  try {
    const id = parseInt(req.params.id, 10);
    const stuList = await db.select().from(students).where(eq(students.id, id)).limit(1);
    if (stuList.length === 0) {
      return res.status(404).json({ error: 'Student not found' });
    }
    res.json(stuList[0]);
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch student details' });
  }
});

// 3. Create Student
router.post('/', requireAuth, requireRoles(['SUPER_ADMIN', 'PRINCIPAL']), async (req: AuthenticatedRequest, res: Response) => {
  try {
    const {
      name,
      email,
      phone,
      studentId,
      prn,
      gender,
      dob,
      department,
      course,
      year,
      semester = 1,
      division = 'A',
      admissionYear = new Date().getFullYear(),
      address,
      parentName,
      parentPhone,
      initialPassword = 'Student@123',
    } = req.body;

    if (!name || !email || !studentId || !prn || !department || !course || !year) {
      return res.status(400).json({ error: 'Name, Email, Student ID, PRN, Department, Course, and Year are required.' });
    }

    // Check duplicate studentId / prn
    const duplicateCheck = await db
      .select()
      .from(students)
      .where(or(
        sql`lower(${students.studentId}) = lower(${String(studentId).trim()})`,
        sql`lower(${students.prn}) = lower(${String(prn).trim()})`
      ))
      .limit(1);

    if (duplicateCheck.length > 0) {
      return res.status(409).json({ error: 'Student ID or PRN is already registered.' });
    }

    // Create or find user account
    const cleanLoginId = String(studentId).trim().toUpperCase();
    const existingUser = await db.select().from(users).where(eq(users.loginId, cleanLoginId)).limit(1);
    let userId: number;

    if (existingUser.length > 0) {
      userId = existingUser[0].id;
    } else {
      const passwordHash = await bcrypt.hash(initialPassword, 10);
      const [createdUser] = await db.insert(users).values({
        loginId: cleanLoginId,
        name: String(name).trim(),
        email: String(email).trim().toLowerCase(),
        phone: phone ? String(phone).trim() : null,
        role: 'STUDENT',
        passwordHash,
        status: 'ACTIVE',
      }).returning({ id: users.id });
      userId = createdUser.id;
    }

    const [newStudent] = await db.insert(students).values({
      userId,
      studentId: cleanLoginId,
      prn: String(prn).trim(),
      name: String(name).trim(),
      email: String(email).trim().toLowerCase(),
      phone: phone ? String(phone).trim() : null,
      gender: gender ? String(gender).trim() : null,
      dob: dob ? String(dob).trim() : null,
      department: String(department).trim(),
      course: String(course).trim(),
      year: String(year).trim(),
      semester: parseInt(String(semester), 10) || 1,
      division: String(division).trim().toUpperCase(),
      admissionYear: parseInt(String(admissionYear), 10) || new Date().getFullYear(),
      address: address ? String(address).trim() : null,
      parentName: parentName ? String(parentName).trim() : null,
      parentPhone: parentPhone ? String(parentPhone).trim() : null,
      status: 'ACTIVE',
    }).returning();

    await createAuditLog({
      userLoginId: req.user!.loginId,
      userName: req.user!.name,
      role: req.user!.role,
      action: 'CREATE',
      module: 'Students',
      recordId: newStudent.id,
      details: `Enrolled student ${newStudent.name} (PRN: ${newStudent.prn}, ID: ${newStudent.studentId}).`,
    });

    res.status(201).json({ success: true, student: newStudent });
  } catch (err: any) {
    console.error('Error creating student:', err);
    res.status(500).json({ error: 'Failed to create student record.' });
  }
});

// 4. Update Student
router.put('/:id', requireAuth, requireRoles(['SUPER_ADMIN', 'PRINCIPAL']), async (req: AuthenticatedRequest, res: Response) => {
  try {
    const id = parseInt(req.params.id, 10);
    const existing = await db.select().from(students).where(eq(students.id, id)).limit(1);
    if (existing.length === 0) {
      return res.status(404).json({ error: 'Student not found.' });
    }

    const updates: any = {};
    const allowed = ['name', 'email', 'phone', 'gender', 'dob', 'department', 'course', 'year', 'semester', 'division', 'address', 'parentName', 'parentPhone', 'status'];
    for (const key of allowed) {
      if (req.body[key] !== undefined) {
        updates[key] = req.body[key];
      }
    }

    const [updated] = await db.update(students).set(updates).where(eq(students.id, id)).returning();

    await createAuditLog({
      userLoginId: req.user!.loginId,
      userName: req.user!.name,
      role: req.user!.role,
      action: 'UPDATE',
      module: 'Students',
      recordId: id,
      details: `Updated details for student ${updated.name} (${updated.studentId}).`,
    });

    res.json({ success: true, student: updated });
  } catch (err: any) {
    console.error('Error updating student:', err);
    res.status(500).json({ error: 'Failed to update student.' });
  }
});

// 5. Delete Student
router.delete('/:id', requireAuth, requireRoles(['SUPER_ADMIN']), async (req: AuthenticatedRequest, res: Response) => {
  try {
    const id = parseInt(req.params.id, 10);
    const existing = await db.select().from(students).where(eq(students.id, id)).limit(1);
    if (existing.length === 0) {
      return res.status(404).json({ error: 'Student not found.' });
    }

    const stu = existing[0];
    await db.delete(students).where(eq(students.id, id));

    await createAuditLog({
      userLoginId: req.user!.loginId,
      userName: req.user!.name,
      role: req.user!.role,
      action: 'DELETE',
      module: 'Students',
      recordId: id,
      details: `Deleted student record ${stu.name} (${stu.studentId}).`,
    });

    res.json({ success: true, message: `Student ${stu.name} deleted successfully.` });
  } catch (err: any) {
    console.error('Error deleting student:', err);
    res.status(500).json({ error: 'Failed to delete student record.' });
  }
});

export default router;
