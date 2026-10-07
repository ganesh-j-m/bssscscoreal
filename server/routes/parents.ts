import { Router, Response } from 'express';
import bcrypt from 'bcryptjs';
import { db } from '../../src/db/index.ts';
import { parents, students, users } from '../../src/db/schema.ts';
import { eq, desc } from 'drizzle-orm';
import { requireAuth, requireRoles, AuthenticatedRequest } from '../middleware/auth.ts';
import { createAuditLog } from '../services/audit.ts';

const router = Router();

// 1. List parents
router.get('/', requireAuth, async (req: AuthenticatedRequest, res: Response) => {
  try {
    const list = await db
      .select({
        id: parents.id,
        name: parents.name,
        email: parents.email,
        phone: parents.phone,
        occupation: parents.occupation,
        studentId: parents.studentId,
        relation: parents.relation,
        address: parents.address,
        createdAt: parents.createdAt,
      })
      .from(parents)
      .orderBy(desc(parents.createdAt));

    res.json({ parents: list });
  } catch (err) {
    console.error('Error fetching parents:', err);
    res.status(500).json({ error: 'Failed to fetch parents' });
  }
});

// 2. Create Parent
router.post('/', requireAuth, requireRoles(['SUPER_ADMIN']), async (req: AuthenticatedRequest, res: Response) => {
  try {
    const { name, email, phone, occupation, studentId, relation = 'Parent', address, initialPassword = 'Parent@123' } = req.body;

    if (!name || !email || !phone) {
      return res.status(400).json({ error: 'Name, Email, and Phone are required.' });
    }

    // Auto-generate Login ID e.g. PAR + timestamp suffix
    const loginId = `PAR${Math.floor(1000 + Math.random() * 9000)}`;
    const passwordHash = await bcrypt.hash(initialPassword, 10);

    const [createdUser] = await db.insert(users).values({
      loginId,
      name: String(name).trim(),
      email: String(email).trim().toLowerCase(),
      phone: String(phone).trim(),
      role: 'PARENT',
      passwordHash,
      status: 'ACTIVE',
    }).returning({ id: users.id });

    const [newParent] = await db.insert(parents).values({
      userId: createdUser.id,
      name: String(name).trim(),
      email: String(email).trim().toLowerCase(),
      phone: String(phone).trim(),
      occupation: occupation ? String(occupation).trim() : null,
      studentId: studentId ? parseInt(String(studentId), 10) : null,
      relation: String(relation).trim(),
      address: address ? String(address).trim() : null,
    }).returning();

    await createAuditLog({
      userLoginId: req.user!.loginId,
      userName: req.user!.name,
      role: req.user!.role,
      action: 'CREATE',
      module: 'Parents',
      recordId: newParent.id,
      details: `Created parent profile for ${newParent.name} (Login: ${loginId}).`,
    });

    res.status(201).json({ success: true, parent: newParent, loginId });
  } catch (err) {
    console.error('Error creating parent:', err);
    res.status(500).json({ error: 'Failed to create parent record.' });
  }
});

// 3. Update Parent
router.put('/:id', requireAuth, requireRoles(['SUPER_ADMIN']), async (req: AuthenticatedRequest, res: Response) => {
  try {
    const id = parseInt(req.params.id, 10);
    const { name, email, phone, occupation, studentId, relation, address } = req.body;

    const [updated] = await db.update(parents).set({
      name,
      email,
      phone,
      occupation,
      studentId: studentId ? parseInt(String(studentId), 10) : null,
      relation,
      address,
    }).where(eq(parents.id, id)).returning();

    res.json({ success: true, parent: updated });
  } catch (err) {
    res.status(500).json({ error: 'Failed to update parent record.' });
  }
});

// 4. Delete Parent
router.delete('/:id', requireAuth, requireRoles(['SUPER_ADMIN']), async (req: AuthenticatedRequest, res: Response) => {
  try {
    const id = parseInt(req.params.id, 10);
    await db.delete(parents).where(eq(parents.id, id));
    res.json({ success: true, message: 'Parent record deleted.' });
  } catch (err) {
    res.status(500).json({ error: 'Failed to delete parent.' });
  }
});

export default router;
