import { Router, Response } from 'express';
import { db } from '../../src/db/index.ts';
import {
  fees,
  certificates,
  admissions,
  placements,
  libraryBooks,
  bookIssues,
  grievances,
  auditLogs,
  notifications,
  students,
} from '../../src/db/schema.ts';
import { eq, desc, sql } from 'drizzle-orm';
import { requireAuth, requireRoles, AuthenticatedRequest } from '../middleware/auth.ts';
import { createAuditLog } from '../services/audit.ts';

const router = Router();

// ================= FEES =================
router.get('/fees', requireAuth, async (req: AuthenticatedRequest, res: Response) => {
  try {
    const list = await db.select().from(fees).orderBy(desc(fees.createdAt));
    res.json({ fees: list });
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch fees' });
  }
});

router.get('/fees/student/:loginId', requireAuth, async (req: AuthenticatedRequest, res: Response) => {
  try {
    const target = req.params.loginId.toUpperCase();
    if (req.user!.role === 'STUDENT' && req.user!.loginId.toUpperCase() !== target) {
      return res.status(403).json({ error: 'Forbidden' });
    }
    const list = await db.select().from(fees).where(sql`upper(${fees.studentLoginId}) = ${target}`).orderBy(desc(fees.createdAt));
    res.json({ fees: list });
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch student fees' });
  }
});

router.post('/fees', requireAuth, requireRoles(['SUPER_ADMIN']), async (req: AuthenticatedRequest, res: Response) => {
  try {
    const { studentLoginId, studentName, feeType, totalAmount, dueDate } = req.body;
    const total = parseInt(String(totalAmount), 10);
    const [fee] = await db.insert(fees).values({
      studentLoginId: String(studentLoginId).trim().toUpperCase(),
      studentName: studentName || 'Student',
      feeType,
      totalAmount: total,
      paidAmount: 0,
      pendingAmount: total,
      dueDate,
      status: 'PENDING',
    }).returning();
    res.status(201).json({ success: true, fee });
  } catch (err) {
    res.status(500).json({ error: 'Failed to create fee record' });
  }
});

router.put('/fees/:id/pay', requireAuth, requireRoles(['SUPER_ADMIN']), async (req: AuthenticatedRequest, res: Response) => {
  try {
    const id = parseInt(req.params.id, 10);
    const { amountPaid, paymentMode = 'Cash / Desk', receiptNumber } = req.body;
    const feeItem = await db.select().from(fees).where(eq(fees.id, id)).limit(1);
    if (feeItem.length === 0) return res.status(404).json({ error: 'Fee record not found' });

    const current = feeItem[0];
    const paying = parseInt(String(amountPaid), 10);
    const newPaid = current.paidAmount + paying;
    const newPending = Math.max(0, current.totalAmount - newPaid);
    const newStatus = newPending === 0 ? 'PAID' : 'PARTIAL';
    const rcpt = receiptNumber || `RCP-${Date.now().toString().slice(-6)}`;

    const [updated] = await db.update(fees).set({
      paidAmount: newPaid,
      pendingAmount: newPending,
      status: newStatus,
      paymentDate: new Date().toISOString().split('T')[0],
      paymentMode,
      receiptNumber: rcpt,
    }).where(eq(fees.id, id)).returning();

    await createAuditLog({
      userLoginId: req.user!.loginId,
      userName: req.user!.name,
      role: req.user!.role,
      action: 'PAYMENT_RECORDED',
      module: 'Fees',
      recordId: id,
      details: `Recorded payment of ₹${paying} for ${updated.studentLoginId}. Receipt: ${rcpt}`,
    });

    res.json({ success: true, fee: updated });
  } catch (err) {
    res.status(500).json({ error: 'Failed to record fee payment' });
  }
});

// ================= CERTIFICATES =================
router.get('/certificates', requireAuth, async (req: AuthenticatedRequest, res: Response) => {
  try {
    const list = await db.select().from(certificates).orderBy(desc(certificates.createdAt));
    res.json({ certificates: list });
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch certificates' });
  }
});

router.get('/certificates/student/:loginId', requireAuth, async (req: AuthenticatedRequest, res: Response) => {
  try {
    const target = req.params.loginId.toUpperCase();
    if (req.user!.role === 'STUDENT' && req.user!.loginId.toUpperCase() !== target) {
      return res.status(403).json({ error: 'Forbidden' });
    }
    const list = await db.select().from(certificates).where(sql`upper(${certificates.studentLoginId}) = ${target}`).orderBy(desc(certificates.createdAt));
    res.json({ certificates: list });
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch certificates' });
  }
});

router.post('/certificates', requireAuth, async (req: AuthenticatedRequest, res: Response) => {
  try {
    const { certificateType, reason } = req.body;
    const studentLoginId = req.user!.loginId;
    const studentName = req.user!.name;

    const [cert] = await db.insert(certificates).values({
      studentLoginId,
      studentName,
      certificateType,
      reason,
      status: 'PENDING',
      appliedDate: new Date().toISOString().split('T')[0],
    }).returning();

    await createAuditLog({
      userLoginId: req.user!.loginId,
      userName: req.user!.name,
      role: req.user!.role,
      action: 'CREATE',
      module: 'Certificates',
      recordId: cert.id,
      details: `Applied for ${certificateType}.`,
    });

    res.status(201).json({ success: true, certificate: cert });
  } catch (err) {
    res.status(500).json({ error: 'Failed to apply for certificate' });
  }
});

router.put('/certificates/:id', requireAuth, requireRoles(['SUPER_ADMIN', 'PRINCIPAL']), async (req: AuthenticatedRequest, res: Response) => {
  try {
    const id = parseInt(req.params.id, 10);
    const { status, adminNotes } = req.body;
    const certNum = status === 'APPROVED' ? `CERT-${Date.now().toString().slice(-6)}` : null;

    const [updated] = await db.update(certificates).set({
      status,
      adminNotes,
      issuedDate: status === 'APPROVED' ? new Date().toISOString().split('T')[0] : null,
      certificateNumber: certNum,
    }).where(eq(certificates.id, id)).returning();

    res.json({ success: true, certificate: updated });
  } catch (err) {
    res.status(500).json({ error: 'Failed to update certificate status' });
  }
});

// ================= ADMISSIONS =================
// Public admissions application form submission
router.post('/admissions', async (req, res: Response) => {
  try {
    const { applicantName, email, phone, course, previousPercentage, previousCollege, category = 'General', notes } = req.body;
    if (!applicantName || !email || !phone || !course) {
      return res.status(400).json({ error: 'Name, Email, Phone, and Course are required.' });
    }

    const appNumber = `ADM-${new Date().getFullYear()}-${Math.floor(1000 + Math.random() * 9000)}`;

    const [adm] = await db.insert(admissions).values({
      applicationNumber: appNumber,
      applicantName,
      email,
      phone,
      course,
      previousPercentage: String(previousPercentage || ''),
      previousCollege: String(previousCollege || ''),
      category,
      notes,
      appliedDate: new Date().toISOString().split('T')[0],
      status: 'PENDING',
    }).returning();

    res.status(201).json({
      success: true,
      message: 'Admission application submitted successfully! Save your application number for reference.',
      applicationNumber: appNumber,
      admission: adm,
    });
  } catch (err) {
    console.error('Admission submit error:', err);
    res.status(500).json({ error: 'Failed to submit admission application' });
  }
});

router.get('/admissions', requireAuth, requireRoles(['SUPER_ADMIN', 'PRINCIPAL']), async (req: AuthenticatedRequest, res: Response) => {
  try {
    const list = await db.select().from(admissions).orderBy(desc(admissions.createdAt));
    res.json({ admissions: list });
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch admissions' });
  }
});

router.put('/admissions/:id', requireAuth, requireRoles(['SUPER_ADMIN', 'PRINCIPAL']), async (req: AuthenticatedRequest, res: Response) => {
  try {
    const id = parseInt(req.params.id, 10);
    const { status, notes } = req.body;
    const [updated] = await db.update(admissions).set({ status, notes }).where(eq(admissions.id, id)).returning();
    res.json({ success: true, admission: updated });
  } catch (err) {
    res.status(500).json({ error: 'Failed to update admission application' });
  }
});

// ================= PLACEMENTS =================
router.get('/placements', async (req, res: Response) => {
  try {
    const list = await db.select().from(placements).orderBy(desc(placements.createdAt));
    res.json({ placements: list });
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch placements' });
  }
});

router.post('/placements', requireAuth, requireRoles(['SUPER_ADMIN']), async (req: AuthenticatedRequest, res: Response) => {
  try {
    const { company, logo, jobTitle, package: pkg, location, eligibility, coursesAllowed, driveDate, deadline, description } = req.body;
    const [item] = await db.insert(placements).values({
      company,
      logo: logo || 'https://images.unsplash.com/photo-1542744094-24638eff58bb?auto=format&fit=crop&q=80&w=200',
      jobTitle,
      package: pkg,
      location,
      eligibility,
      coursesAllowed,
      driveDate,
      deadline,
      description,
      status: 'ACTIVE',
    }).returning();
    res.status(201).json({ success: true, placement: item });
  } catch (err) {
    res.status(500).json({ error: 'Failed to create placement drive' });
  }
});

router.delete('/placements/:id', requireAuth, requireRoles(['SUPER_ADMIN']), async (req: AuthenticatedRequest, res: Response) => {
  try {
    const id = parseInt(req.params.id, 10);
    await db.delete(placements).where(eq(placements.id, id));
    res.json({ success: true, message: 'Placement drive deleted' });
  } catch (err) {
    res.status(500).json({ error: 'Failed to delete placement drive' });
  }
});

// ================= LIBRARY =================
router.get('/library/books', async (req, res: Response) => {
  try {
    const { search, category } = req.query;
    let list = await db.select().from(libraryBooks).orderBy(desc(libraryBooks.createdAt));
    if (category && category !== 'ALL') list = list.filter(b => b.category === category);
    if (search) {
      const q = String(search).toLowerCase();
      list = list.filter(b => b.title.toLowerCase().includes(q) || b.author.toLowerCase().includes(q) || b.isbn.includes(q));
    }
    res.json({ books: list });
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch library books' });
  }
});

router.post('/library/books', requireAuth, requireRoles(['SUPER_ADMIN']), async (req: AuthenticatedRequest, res: Response) => {
  try {
    const { title, author, isbn, category, edition, publisher, totalCopies = 1, shelfLocation } = req.body;
    const copies = parseInt(String(totalCopies), 10);
    const [book] = await db.insert(libraryBooks).values({
      title,
      author,
      isbn,
      category,
      edition,
      publisher,
      totalCopies: copies,
      availableCopies: copies,
      shelfLocation,
      coverImage: 'https://images.unsplash.com/photo-1532012164546-f432f2e3777f?auto=format&fit=crop&q=80&w=400',
    }).returning();
    res.status(201).json({ success: true, book });
  } catch (err) {
    res.status(500).json({ error: 'Failed to add book to catalog' });
  }
});

router.get('/library/issues', requireAuth, async (req: AuthenticatedRequest, res: Response) => {
  try {
    const { studentLoginId } = req.query;
    let list = await db.select().from(bookIssues).orderBy(desc(bookIssues.createdAt));
    if (req.user!.role === 'STUDENT') {
      list = list.filter(i => i.studentLoginId.toUpperCase() === req.user!.loginId.toUpperCase());
    } else if (studentLoginId) {
      list = list.filter(i => i.studentLoginId === studentLoginId);
    }
    res.json({ issues: list });
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch book issue records' });
  }
});

router.post('/library/issue', requireAuth, requireRoles(['SUPER_ADMIN']), async (req: AuthenticatedRequest, res: Response) => {
  try {
    const { bookId, studentLoginId, dueDate } = req.body;
    const bk = await db.select().from(libraryBooks).where(eq(libraryBooks.id, bookId)).limit(1);
    if (bk.length === 0 || bk[0].availableCopies < 1) {
      return res.status(400).json({ error: 'Book is not available for issue' });
    }

    const [issue] = await db.insert(bookIssues).values({
      bookId,
      bookTitle: bk[0].title,
      studentLoginId: String(studentLoginId).toUpperCase(),
      studentName: 'Student',
      issueDate: new Date().toISOString().split('T')[0],
      dueDate,
      status: 'ISSUED',
    }).returning();

    await db.update(libraryBooks).set({ availableCopies: bk[0].availableCopies - 1 }).where(eq(libraryBooks.id, bookId));

    res.status(201).json({ success: true, issue });
  } catch (err) {
    res.status(500).json({ error: 'Failed to issue book' });
  }
});

router.put('/library/return/:id', requireAuth, requireRoles(['SUPER_ADMIN']), async (req: AuthenticatedRequest, res: Response) => {
  try {
    const id = parseInt(req.params.id, 10);
    const issueList = await db.select().from(bookIssues).where(eq(bookIssues.id, id)).limit(1);
    if (issueList.length === 0) return res.status(404).json({ error: 'Issue record not found' });

    const issue = issueList[0];
    const [updated] = await db.update(bookIssues).set({
      status: 'RETURNED',
      returnDate: new Date().toISOString().split('T')[0],
    }).where(eq(bookIssues.id, id)).returning();

    if (issue.bookId) {
      const bk = await db.select().from(libraryBooks).where(eq(libraryBooks.id, issue.bookId)).limit(1);
      if (bk.length > 0) {
        await db.update(libraryBooks).set({ availableCopies: bk[0].availableCopies + 1 }).where(eq(libraryBooks.id, issue.bookId));
      }
    }

    res.json({ success: true, issue: updated });
  } catch (err) {
    res.status(500).json({ error: 'Failed to return book' });
  }
});

// ================= GRIEVANCES =================
router.get('/grievances', requireAuth, async (req: AuthenticatedRequest, res: Response) => {
  try {
    let list = await db.select().from(grievances).orderBy(desc(grievances.createdAt));
    if (req.user!.role === 'STUDENT') {
      list = list.filter(g => g.studentLoginId.toUpperCase() === req.user!.loginId.toUpperCase());
    }
    res.json({ grievances: list });
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch grievances' });
  }
});

router.post('/grievances', requireAuth, async (req: AuthenticatedRequest, res: Response) => {
  try {
    const { category, title, description } = req.body;
    if (!category || !title || !description) {
      return res.status(400).json({ error: 'Category, Title, and Description are required.' });
    }

    const [g] = await db.insert(grievances).values({
      studentLoginId: req.user!.loginId,
      studentName: req.user!.name,
      category,
      title,
      description,
      status: 'OPEN',
    }).returning();

    await createAuditLog({
      userLoginId: req.user!.loginId,
      userName: req.user!.name,
      role: req.user!.role,
      action: 'CREATE',
      module: 'Grievances',
      recordId: g.id,
      details: `Filed grievance: "${title}" (${category}).`,
    });

    res.status(201).json({ success: true, grievance: g });
  } catch (err) {
    res.status(500).json({ error: 'Failed to submit grievance' });
  }
});

router.put('/grievances/:id', requireAuth, requireRoles(['SUPER_ADMIN', 'PRINCIPAL']), async (req: AuthenticatedRequest, res: Response) => {
  try {
    const id = parseInt(req.params.id, 10);
    const { status, adminResponse } = req.body;
    const [updated] = await db.update(grievances).set({
      status,
      adminResponse,
      resolvedAt: status === 'RESOLVED' ? new Date().toISOString().split('T')[0] : null,
    }).where(eq(grievances.id, id)).returning();

    res.json({ success: true, grievance: updated });
  } catch (err) {
    res.status(500).json({ error: 'Failed to resolve grievance' });
  }
});

// ================= AUDIT LOGS =================
router.get('/audit-logs', requireAuth, requireRoles(['SUPER_ADMIN']), async (req: AuthenticatedRequest, res: Response) => {
  try {
    const { module, action, search, page = '1', limit = '25' } = req.query;
    const pageNum = Math.max(1, parseInt(page as string, 10) || 1);
    const limitNum = Math.max(1, Math.min(100, parseInt(limit as string, 10) || 25));
    const offset = (pageNum - 1) * limitNum;

    let logs = await db.select().from(auditLogs).orderBy(desc(auditLogs.timestamp));
    if (module && module !== 'ALL') logs = logs.filter(l => l.module === module);
    if (action && action !== 'ALL') logs = logs.filter(l => l.action === action);
    if (search) {
      const q = String(search).toLowerCase();
      logs = logs.filter(l =>
        l.userLoginId.toLowerCase().includes(q) ||
        l.userName.toLowerCase().includes(q) ||
        l.details?.toLowerCase().includes(q)
      );
    }

    const total = logs.length;
    const paginated = logs.slice(offset, offset + limitNum);

    res.json({
      logs: paginated,
      total,
      page: pageNum,
      totalPages: Math.ceil(total / limitNum) || 1,
    });
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch audit logs' });
  }
});

// ================= NOTIFICATIONS =================
router.get('/notifications', requireAuth, async (req: AuthenticatedRequest, res: Response) => {
  try {
    const userLogin = req.user!.loginId.toUpperCase();
    const list = await db
      .select()
      .from(notifications)
      .where(sql`upper(${notifications.recipientLoginId}) = ${userLogin} or upper(${notifications.recipientLoginId}) = 'ALL'`)
      .orderBy(desc(notifications.createdAt))
      .limit(20);

    res.json({ notifications: list });
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch notifications' });
  }
});

export default router;
