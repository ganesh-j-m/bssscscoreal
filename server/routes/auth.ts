import { Router, Response } from 'express';
import bcrypt from 'bcryptjs';
import { db } from '../../src/db/index.ts';
import { users, students, faculties, parents } from '../../src/db/schema.ts';
import { eq, sql } from 'drizzle-orm';
import { signToken, requireAuth, AuthenticatedRequest } from '../middleware/auth.ts';
import { createAuditLog } from '../services/audit.ts';

const router = Router();

router.post('/login', async (req, res: Response) => {
  try {
    const { loginId, password } = req.body;

    if (!loginId || !password) {
      return res.status(400).json({ error: 'Please enter both Login ID and Password.' });
    }

    const trimmedLoginId = String(loginId).trim();

    // Query user by loginId case-insensitively
    const userRecords = await db
      .select()
      .from(users)
      .where(sql`lower(${users.loginId}) = lower(${trimmedLoginId})`)
      .limit(1);

    if (userRecords.length === 0) {
      return res.status(401).json({ error: 'Invalid Login ID or Password.' });
    }

    const user = userRecords[0];

    if (user.status !== 'ACTIVE') {
      return res.status(403).json({ error: 'This account has been deactivated. Please contact the administrator.' });
    }

    const passwordMatches = await bcrypt.compare(String(password), user.passwordHash);
    if (!passwordMatches) {
      return res.status(401).json({ error: 'Invalid Login ID or Password.' });
    }

    // Role-specific linked data
    let studentDetails = null;
    let facultyDetails = null;
    let parentDetails = null;

    if (user.role === 'STUDENT') {
      const stuList = await db.select().from(students).where(eq(students.userId, user.id)).limit(1);
      if (stuList.length > 0) studentDetails = stuList[0];
    } else if (user.role === 'FACULTY') {
      const facList = await db.select().from(faculties).where(eq(faculties.userId, user.id)).limit(1);
      if (facList.length > 0) facultyDetails = facList[0];
    } else if (user.role === 'PARENT') {
      const parList = await db.select().from(parents).where(eq(parents.userId, user.id)).limit(1);
      if (parList.length > 0) parentDetails = parList[0];
    }

    const safeUser = {
      id: user.id,
      loginId: user.loginId,
      name: user.name,
      email: user.email,
      phone: user.phone,
      role: user.role as any,
      status: user.status,
      avatar: user.avatar,
      studentDetails,
      facultyDetails,
      parentDetails,
    };

    const token = signToken({
      id: user.id,
      loginId: user.loginId,
      name: user.name,
      email: user.email,
      role: user.role as any,
    });

    await createAuditLog({
      userLoginId: user.loginId,
      userName: user.name,
      role: user.role,
      action: 'LOGIN',
      module: 'Auth',
      recordId: user.id,
      details: `User successfully logged into the platform with role ${user.role}.`,
    });

    res.json({
      success: true,
      token,
      user: safeUser,
    });
  } catch (err: any) {
    console.error('Login error:', err);
    res.status(500).json({ error: 'Authentication failed due to server error.' });
  }
});

router.get('/me', requireAuth, async (req: AuthenticatedRequest, res: Response) => {
  try {
    const userRecords = await db
      .select()
      .from(users)
      .where(eq(users.id, req.user!.id))
      .limit(1);

    if (userRecords.length === 0) {
      return res.status(404).json({ error: 'User not found.' });
    }

    const user = userRecords[0];

    let studentDetails = null;
    let facultyDetails = null;
    let parentDetails = null;

    if (user.role === 'STUDENT') {
      const stuList = await db.select().from(students).where(eq(students.userId, user.id)).limit(1);
      if (stuList.length > 0) studentDetails = stuList[0];
    } else if (user.role === 'FACULTY') {
      const facList = await db.select().from(faculties).where(eq(faculties.userId, user.id)).limit(1);
      if (facList.length > 0) facultyDetails = facList[0];
    } else if (user.role === 'PARENT') {
      const parList = await db.select().from(parents).where(eq(parents.userId, user.id)).limit(1);
      if (parList.length > 0) parentDetails = parList[0];
    }

    const safeUser = {
      id: user.id,
      loginId: user.loginId,
      name: user.name,
      email: user.email,
      phone: user.phone,
      role: user.role as any,
      status: user.status,
      avatar: user.avatar,
      studentDetails,
      facultyDetails,
      parentDetails,
    };

    res.json({ user: safeUser });
  } catch (err: any) {
    console.error('Fetch /me error:', err);
    res.status(500).json({ error: 'Failed to retrieve user profile.' });
  }
});

router.post('/logout', requireAuth, async (req: AuthenticatedRequest, res: Response) => {
  try {
    if (req.user) {
      await createAuditLog({
        userLoginId: req.user.loginId,
        userName: req.user.name,
        role: req.user.role,
        action: 'LOGOUT',
        module: 'Auth',
        recordId: req.user.id,
        details: 'User logged out.',
      });
    }
    res.json({ success: true, message: 'Logged out successfully.' });
  } catch (err) {
    res.status(500).json({ error: 'Logout failed.' });
  }
});

export default router;
