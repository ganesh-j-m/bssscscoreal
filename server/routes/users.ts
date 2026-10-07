import { Router, Response } from 'express';
import bcrypt from 'bcryptjs';
import { db } from '../../src/db/index.ts';
import { users } from '../../src/db/schema.ts';
import { eq, desc, sql, ilike, or } from 'drizzle-orm';
import { requireAuth, requireRoles, AuthenticatedRequest } from '../middleware/auth.ts';
import { createAuditLog } from '../services/audit.ts';

const router = Router();

// 1. Get users with search, filter, pagination
router.get('/', requireAuth, requireRoles(['SUPER_ADMIN', 'PRINCIPAL']), async (req: AuthenticatedRequest, res: Response) => {
  try {
    const { search, role, status, page = '1', limit = '15' } = req.query;

    const pageNum = Math.max(1, parseInt(page as string, 10) || 1);
    const limitNum = Math.max(1, Math.min(100, parseInt(limit as string, 10) || 15));
    const offset = (pageNum - 1) * limitNum;

    const allUsers = await db.select({
      id: users.id,
      loginId: users.loginId,
      name: users.name,
      email: users.email,
      phone: users.phone,
      role: users.role,
      status: users.status,
      avatar: users.avatar,
      createdAt: users.createdAt,
    })
    .from(users)
    .orderBy(desc(users.createdAt));

    let filtered = allUsers;
    if (role && role !== 'ALL') {
      filtered = filtered.filter(u => u.role === role);
    }
    if (status && status !== 'ALL') {
      filtered = filtered.filter(u => u.status === status);
    }
    if (search) {
      const q = String(search).toLowerCase();
      filtered = filtered.filter(u => 
        u.name.toLowerCase().includes(q) ||
        u.loginId.toLowerCase().includes(q) ||
        u.email.toLowerCase().includes(q)
      );
    }

    const total = filtered.length;
    const paginated = filtered.slice(offset, offset + limitNum);

    res.json({
      users: paginated,
      total,
      page: pageNum,
      totalPages: Math.ceil(total / limitNum) || 1,
    });
  } catch (err: any) {
    console.error('Error fetching users:', err);
    res.status(500).json({ error: 'Failed to fetch users' });
  }
});

// 2. Create User
router.post('/', requireAuth, requireRoles(['SUPER_ADMIN']), async (req: AuthenticatedRequest, res: Response) => {
  try {
    const { loginId, name, email, phone, role, password, status = 'ACTIVE' } = req.body;

    if (!loginId || !name || !email || !role || !password) {
      return res.status(400).json({ error: 'Login ID, Name, Email, Role, and Password are required.' });
    }

    // Check unique loginId and email
    const existing = await db
      .select()
      .from(users)
      .where(or(
        sql`lower(${users.loginId}) = lower(${String(loginId).trim()})`,
        sql`lower(${users.email}) = lower(${String(email).trim()})`
      ))
      .limit(1);

    if (existing.length > 0) {
      if (existing[0].loginId.toLowerCase() === String(loginId).trim().toLowerCase()) {
        return res.status(409).json({ error: `Login ID "${loginId}" is already registered.` });
      }
      return res.status(409).json({ error: `Email "${email}" is already registered.` });
    }

    const passwordHash = await bcrypt.hash(String(password), 10);

    const [newUser] = await db.insert(users).values({
      loginId: String(loginId).trim().toUpperCase(),
      name: String(name).trim(),
      email: String(email).trim().toLowerCase(),
      phone: phone ? String(phone).trim() : null,
      role: String(role).trim(),
      passwordHash,
      status: String(status).trim(),
    }).returning({
      id: users.id,
      loginId: users.loginId,
      name: users.name,
      email: users.email,
      phone: users.phone,
      role: users.role,
      status: users.status,
      createdAt: users.createdAt,
    });

    await createAuditLog({
      userLoginId: req.user!.loginId,
      userName: req.user!.name,
      role: req.user!.role,
      action: 'CREATE',
      module: 'Users',
      recordId: newUser.id,
      details: `Created user ${newUser.loginId} (${newUser.name}) with role ${newUser.role}.`,
    });

    res.status(201).json({ success: true, user: newUser });
  } catch (err: any) {
    console.error('Error creating user:', err);
    res.status(500).json({ error: 'Failed to create user.' });
  }
});

// 3. Update User
router.put('/:id', requireAuth, requireRoles(['SUPER_ADMIN']), async (req: AuthenticatedRequest, res: Response) => {
  try {
    const id = parseInt(req.params.id, 10);
    const { name, email, phone, role, status, password } = req.body;

    const existing = await db.select().from(users).where(eq(users.id, id)).limit(1);
    if (existing.length === 0) {
      return res.status(404).json({ error: 'User not found.' });
    }

    const updates: any = { updatedAt: new Date() };
    if (name) updates.name = String(name).trim();
    if (email) updates.email = String(email).trim().toLowerCase();
    if (phone !== undefined) updates.phone = phone ? String(phone).trim() : null;
    if (role) updates.role = String(role).trim();
    if (status) updates.status = String(status).trim();
    if (password && String(password).trim().length >= 6) {
      updates.passwordHash = await bcrypt.hash(String(password).trim(), 10);
    }

    const [updatedUser] = await db
      .update(users)
      .set(updates)
      .where(eq(users.id, id))
      .returning({
        id: users.id,
        loginId: users.loginId,
        name: users.name,
        email: users.email,
        phone: users.phone,
        role: users.role,
        status: users.status,
      });

    await createAuditLog({
      userLoginId: req.user!.loginId,
      userName: req.user!.name,
      role: req.user!.role,
      action: 'UPDATE',
      module: 'Users',
      recordId: id,
      details: `Updated user profile for ${updatedUser.loginId}.`,
    });

    res.json({ success: true, user: updatedUser });
  } catch (err: any) {
    console.error('Error updating user:', err);
    res.status(500).json({ error: 'Failed to update user.' });
  }
});

// 4. Delete User
router.delete('/:id', requireAuth, requireRoles(['SUPER_ADMIN']), async (req: AuthenticatedRequest, res: Response) => {
  try {
    const id = parseInt(req.params.id, 10);
    const existing = await db.select().from(users).where(eq(users.id, id)).limit(1);
    if (existing.length === 0) {
      return res.status(404).json({ error: 'User not found.' });
    }

    const targetUser = existing[0];
    if (targetUser.loginId === req.user!.loginId) {
      return res.status(400).json({ error: 'Cannot delete your own active administrator account.' });
    }

    await db.delete(users).where(eq(users.id, id));

    await createAuditLog({
      userLoginId: req.user!.loginId,
      userName: req.user!.name,
      role: req.user!.role,
      action: 'DELETE',
      module: 'Users',
      recordId: id,
      details: `Deleted user ${targetUser.loginId} (${targetUser.name}).`,
    });

    res.json({ success: true, message: `User ${targetUser.loginId} deleted successfully.` });
  } catch (err: any) {
    console.error('Error deleting user:', err);
    res.status(500).json({ error: 'Failed to delete user.' });
  }
});

// 5. CSV Bulk Import Users
router.post('/import', requireAuth, requireRoles(['SUPER_ADMIN']), async (req: AuthenticatedRequest, res: Response) => {
  try {
    const { rows } = req.body; // Expects array of objects: { loginId, name, email, role, phone, password }

    if (!Array.isArray(rows) || rows.length === 0) {
      return res.status(400).json({ error: 'Invalid CSV import data. Array of user rows is required.' });
    }

    const validRoles = ['SUPER_ADMIN', 'PRINCIPAL', 'FACULTY', 'STUDENT', 'PARENT', 'ALUMNI'];

    let successful = 0;
    let duplicate = 0;
    let invalid = 0;
    const errors: string[] = [];

    // Pre-fetch all existing loginIds and emails for quick duplicate detection
    const existingUsers = await db.select({ loginId: users.loginId, email: users.email }).from(users);
    const existingLoginIds = new Set(existingUsers.map(u => u.loginId.toUpperCase()));
    const existingEmails = new Set(existingUsers.map(u => u.email.toLowerCase()));

    for (let i = 0; i < rows.length; i++) {
      const row = rows[i];
      const rowNum = i + 1;

      const loginId = row.loginId ? String(row.loginId).trim().toUpperCase() : '';
      const name = row.name ? String(row.name).trim() : '';
      const email = row.email ? String(row.email).trim().toLowerCase() : '';
      const role = row.role ? String(row.role).trim().toUpperCase() : 'STUDENT';
      const phone = row.phone ? String(row.phone).trim() : null;
      const rawPassword = row.password ? String(row.password).trim() : 'College@123';

      if (!loginId || !name || !email) {
        invalid++;
        errors.push(`Row ${rowNum}: Missing mandatory fields (Login ID, Name, or Email).`);
        continue;
      }

      if (!validRoles.includes(role)) {
        invalid++;
        errors.push(`Row ${rowNum} (${loginId}): Invalid role "${role}". Allowed roles: ${validRoles.join(', ')}.`);
        continue;
      }

      if (existingLoginIds.has(loginId)) {
        duplicate++;
        errors.push(`Row ${rowNum}: Login ID "${loginId}" already exists.`);
        continue;
      }

      if (existingEmails.has(email)) {
        duplicate++;
        errors.push(`Row ${rowNum}: Email "${email}" already exists.`);
        continue;
      }

      const passwordHash = await bcrypt.hash(rawPassword, 10);

      await db.insert(users).values({
        loginId,
        name,
        email,
        phone,
        role,
        passwordHash,
        status: 'ACTIVE',
      });

      existingLoginIds.add(loginId);
      existingEmails.add(email);
      successful++;
    }

    await createAuditLog({
      userLoginId: req.user!.loginId,
      userName: req.user!.name,
      role: req.user!.role,
      action: 'IMPORT',
      module: 'Users',
      details: `Bulk CSV Import completed. Total: ${rows.length}, Success: ${successful}, Duplicates: ${duplicate}, Invalid: ${invalid}.`,
    });

    res.json({
      total: rows.length,
      successful,
      failed: duplicate + invalid,
      duplicate,
      invalid,
      errors: errors.slice(0, 50),
    });
  } catch (err: any) {
    console.error('CSV import error:', err);
    res.status(500).json({ error: 'Failed to process CSV import.' });
  }
});

export default router;
