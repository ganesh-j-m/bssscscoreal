import { Router, Response } from 'express';
import bcrypt from 'bcryptjs';
import { db } from '../../src/db/index.ts';
import { faculties, users } from '../../src/db/schema.ts';
import { eq, desc, or, sql } from 'drizzle-orm';
import { requireAuth, requireRoles, AuthenticatedRequest } from '../middleware/auth.ts';
import { createAuditLog } from '../services/audit.ts';

const router = Router();

// 1. List faculty (publicly accessible for public /faculty page, with full info)
router.get('/', async (req, res: Response) => {
  try {
    const { department, search } = req.query;
    let list = await db.select().from(faculties).orderBy(desc(faculties.createdAt));

    if (department && department !== 'ALL') {
      list = list.filter(f => f.department === department);
    }
    if (search) {
      const q = String(search).toLowerCase();
      list = list.filter(f =>
        f.name.toLowerCase().includes(q) ||
        f.department.toLowerCase().includes(q) ||
        f.designation.toLowerCase().includes(q) ||
        f.specialization?.toLowerCase().includes(q)
      );
    }

    res.json({ faculty: list });
  } catch (err) {
    console.error('Error fetching faculty:', err);
    res.status(500).json({ error: 'Failed to fetch faculty list' });
  }
});

// 2. Create Faculty (Super Admin / Principal)
router.post('/', requireAuth, requireRoles(['SUPER_ADMIN', 'PRINCIPAL']), async (req: AuthenticatedRequest, res: Response) => {
  try {
    const {
      facultyId,
      name,
      email,
      phone,
      designation,
      department,
      qualification,
      specialization,
      experience,
      joiningDate,
      photo,
      initialPassword = 'Faculty@123',
    } = req.body;

    if (!facultyId || !name || !email || !designation || !department) {
      return res.status(400).json({ error: 'Faculty ID, Name, Email, Designation, and Department are required.' });
    }

    // Check duplicate facultyId
    const existing = await db.select().from(faculties).where(eq(faculties.facultyId, String(facultyId).trim())).limit(1);
    if (existing.length > 0) {
      return res.status(409).json({ error: `Faculty ID "${facultyId}" already exists.` });
    }

    // Create or find user account
    const cleanLoginId = String(facultyId).trim().toUpperCase();
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
        role: 'FACULTY',
        passwordHash,
        status: 'ACTIVE',
        avatar: photo || null,
      }).returning({ id: users.id });
      userId = createdUser.id;
    }

    const [newFaculty] = await db.insert(faculties).values({
      userId,
      facultyId: cleanLoginId,
      name: String(name).trim(),
      email: String(email).trim().toLowerCase(),
      phone: phone ? String(phone).trim() : null,
      designation: String(designation).trim(),
      department: String(department).trim(),
      qualification: qualification ? String(qualification).trim() : null,
      specialization: specialization ? String(specialization).trim() : null,
      experience: experience ? String(experience).trim() : null,
      joiningDate: joiningDate ? String(joiningDate).trim() : null,
      photo: photo || 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=400',
      status: 'ACTIVE',
    }).returning();

    await createAuditLog({
      userLoginId: req.user!.loginId,
      userName: req.user!.name,
      role: req.user!.role,
      action: 'CREATE',
      module: 'Faculty',
      recordId: newFaculty.id,
      details: `Added faculty member ${newFaculty.name} (${newFaculty.designation}, ${newFaculty.department}).`,
    });

    res.status(201).json({ success: true, faculty: newFaculty });
  } catch (err: any) {
    console.error('Error creating faculty:', err);
    res.status(500).json({ error: 'Failed to create faculty record.' });
  }
});

// 3. Update Faculty
router.put('/:id', requireAuth, requireRoles(['SUPER_ADMIN', 'PRINCIPAL']), async (req: AuthenticatedRequest, res: Response) => {
  try {
    const id = parseInt(req.params.id, 10);
    const existing = await db.select().from(faculties).where(eq(faculties.id, id)).limit(1);
    if (existing.length === 0) {
      return res.status(404).json({ error: 'Faculty not found.' });
    }

    const updates: any = {};
    const allowed = ['name', 'email', 'phone', 'designation', 'department', 'qualification', 'specialization', 'experience', 'joiningDate', 'photo', 'status'];
    for (const key of allowed) {
      if (req.body[key] !== undefined) {
        updates[key] = req.body[key];
      }
    }

    const [updated] = await db.update(faculties).set(updates).where(eq(faculties.id, id)).returning();

    await createAuditLog({
      userLoginId: req.user!.loginId,
      userName: req.user!.name,
      role: req.user!.role,
      action: 'UPDATE',
      module: 'Faculty',
      recordId: id,
      details: `Updated faculty member ${updated.name}.`,
    });

    res.json({ success: true, faculty: updated });
  } catch (err: any) {
    console.error('Error updating faculty:', err);
    res.status(500).json({ error: 'Failed to update faculty record.' });
  }
});

// 4. Delete Faculty
router.delete('/:id', requireAuth, requireRoles(['SUPER_ADMIN']), async (req: AuthenticatedRequest, res: Response) => {
  try {
    const id = parseInt(req.params.id, 10);
    const existing = await db.select().from(faculties).where(eq(faculties.id, id)).limit(1);
    if (existing.length === 0) {
      return res.status(404).json({ error: 'Faculty not found.' });
    }

    const fac = existing[0];
    await db.delete(faculties).where(eq(faculties.id, id));

    await createAuditLog({
      userLoginId: req.user!.loginId,
      userName: req.user!.name,
      role: req.user!.role,
      action: 'DELETE',
      module: 'Faculty',
      recordId: id,
      details: `Deleted faculty record ${fac.name} (${fac.facultyId}).`,
    });

    res.json({ success: true, message: `Faculty ${fac.name} deleted successfully.` });
  } catch (err: any) {
    console.error('Error deleting faculty:', err);
    res.status(500).json({ error: 'Failed to delete faculty record.' });
  }
});

export default router;
