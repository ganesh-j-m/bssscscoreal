import { Router, Response } from 'express';
import { db } from '../../src/db/index.ts';
import {
  notices,
  events,
  galleryItems,
  facilities,
  achievements,
  cmsContent,
} from '../../src/db/schema.ts';
import { eq, desc } from 'drizzle-orm';
import { requireAuth, requireRoles, AuthenticatedRequest } from '../middleware/auth.ts';
import { createAuditLog } from '../services/audit.ts';

const router = Router();

// ================= NOTICES =================
router.get('/notices', async (req, res: Response) => {
  try {
    const list = await db.select().from(notices).orderBy(desc(notices.isPinned), desc(notices.date));
    res.json({ notices: list });
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch notices' });
  }
});

router.post('/notices', requireAuth, requireRoles(['SUPER_ADMIN', 'PRINCIPAL']), async (req: AuthenticatedRequest, res: Response) => {
  try {
    const { title, category, content, date, isPinned = false, targetAudience = 'All', attachmentUrl } = req.body;
    if (!title || !content) return res.status(400).json({ error: 'Title and Content are required.' });

    const [item] = await db.insert(notices).values({
      title,
      category: category || 'General',
      content,
      date: date || new Date().toISOString().split('T')[0],
      isPinned: Boolean(isPinned),
      targetAudience: targetAudience || 'All',
      attachmentUrl,
      status: 'PUBLISHED',
    }).returning();

    await createAuditLog({
      userLoginId: req.user!.loginId,
      userName: req.user!.name,
      role: req.user!.role,
      action: 'CREATE',
      module: 'Notices',
      recordId: item.id,
      details: `Published notice: "${title}".`,
    });

    res.status(201).json({ success: true, notice: item });
  } catch (err) {
    res.status(500).json({ error: 'Failed to create notice' });
  }
});

router.delete('/notices/:id', requireAuth, requireRoles(['SUPER_ADMIN']), async (req: AuthenticatedRequest, res: Response) => {
  try {
    const id = parseInt(req.params.id, 10);
    await db.delete(notices).where(eq(notices.id, id));
    res.json({ success: true, message: 'Notice deleted' });
  } catch (err) {
    res.status(500).json({ error: 'Failed to delete notice' });
  }
});

// ================= EVENTS =================
router.get('/events', async (req, res: Response) => {
  try {
    const list = await db.select().from(events).orderBy(desc(events.date));
    res.json({ events: list });
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch events' });
  }
});

router.post('/events', requireAuth, requireRoles(['SUPER_ADMIN', 'PRINCIPAL']), async (req: AuthenticatedRequest, res: Response) => {
  try {
    const { title, category, date, time, venue, description, image } = req.body;
    if (!title || !date || !venue) return res.status(400).json({ error: 'Title, Date, and Venue are required.' });

    const [item] = await db.insert(events).values({
      title,
      category: category || 'Campus',
      date,
      time: time || '10:00 AM',
      venue,
      description: description || '',
      image: image || 'https://images.unsplash.com/photo-1540575467063-178a50c2df87?auto=format&fit=crop&q=80&w=800',
      status: 'UPCOMING',
    }).returning();

    await createAuditLog({
      userLoginId: req.user!.loginId,
      userName: req.user!.name,
      role: req.user!.role,
      action: 'CREATE',
      module: 'Events',
      recordId: item.id,
      details: `Created event: "${title}".`,
    });

    res.status(201).json({ success: true, event: item });
  } catch (err) {
    res.status(500).json({ error: 'Failed to create event' });
  }
});

router.delete('/events/:id', requireAuth, requireRoles(['SUPER_ADMIN']), async (req: AuthenticatedRequest, res: Response) => {
  try {
    const id = parseInt(req.params.id, 10);
    await db.delete(events).where(eq(events.id, id));
    res.json({ success: true, message: 'Event deleted' });
  } catch (err) {
    res.status(500).json({ error: 'Failed to delete event' });
  }
});

// ================= GALLERY =================
router.get('/gallery', async (req, res: Response) => {
  try {
    const list = await db.select().from(galleryItems).orderBy(desc(galleryItems.createdAt));
    res.json({ gallery: list });
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch gallery items' });
  }
});

router.post('/gallery', requireAuth, requireRoles(['SUPER_ADMIN']), async (req: AuthenticatedRequest, res: Response) => {
  try {
    const { title, category, imageUrl, caption } = req.body;
    if (!title || !imageUrl) return res.status(400).json({ error: 'Title and Image URL are required.' });

    const [item] = await db.insert(galleryItems).values({
      title,
      category: category || 'Campus',
      imageUrl,
      caption: caption || '',
    }).returning();

    res.status(201).json({ success: true, item });
  } catch (err) {
    res.status(500).json({ error: 'Failed to add gallery item' });
  }
});

router.delete('/gallery/:id', requireAuth, requireRoles(['SUPER_ADMIN']), async (req: AuthenticatedRequest, res: Response) => {
  try {
    const id = parseInt(req.params.id, 10);
    await db.delete(galleryItems).where(eq(galleryItems.id, id));
    res.json({ success: true, message: 'Gallery item deleted' });
  } catch (err) {
    res.status(500).json({ error: 'Failed to delete gallery item' });
  }
});

// ================= FACILITIES =================
router.get('/facilities', async (req, res: Response) => {
  try {
    const list = await db.select().from(facilities).orderBy(desc(facilities.createdAt));
    res.json({ facilities: list });
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch facilities' });
  }
});

router.post('/facilities', requireAuth, requireRoles(['SUPER_ADMIN']), async (req: AuthenticatedRequest, res: Response) => {
  try {
    const { name, category, description, imageUrl, features } = req.body;
    const [item] = await db.insert(facilities).values({
      name,
      category: category || 'Academic',
      description,
      imageUrl: imageUrl || 'https://images.unsplash.com/photo-1581092918056-0c4c3acd3789?auto=format&fit=crop&q=80&w=800',
      features,
    }).returning();
    res.status(201).json({ success: true, facility: item });
  } catch (err) {
    res.status(500).json({ error: 'Failed to add facility' });
  }
});

router.delete('/facilities/:id', requireAuth, requireRoles(['SUPER_ADMIN']), async (req: AuthenticatedRequest, res: Response) => {
  try {
    const id = parseInt(req.params.id, 10);
    await db.delete(facilities).where(eq(facilities.id, id));
    res.json({ success: true, message: 'Facility deleted' });
  } catch (err) {
    res.status(500).json({ error: 'Failed to delete facility' });
  }
});

// ================= ACHIEVEMENTS =================
router.get('/achievements', async (req, res: Response) => {
  try {
    const list = await db.select().from(achievements).orderBy(desc(achievements.year));
    res.json({ achievements: list });
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch achievements' });
  }
});

router.post('/achievements', requireAuth, requireRoles(['SUPER_ADMIN']), async (req: AuthenticatedRequest, res: Response) => {
  try {
    const { title, recipient, category, year, description, imageUrl } = req.body;
    const [item] = await db.insert(achievements).values({
      title,
      recipient,
      category: category || 'Academic',
      year: year || String(new Date().getFullYear()),
      description,
      imageUrl: imageUrl || 'https://images.unsplash.com/photo-1523240795612-9a054b0db644?auto=format&fit=crop&q=80&w=800',
    }).returning();
    res.status(201).json({ success: true, achievement: item });
  } catch (err) {
    res.status(500).json({ error: 'Failed to add achievement' });
  }
});

router.delete('/achievements/:id', requireAuth, requireRoles(['SUPER_ADMIN']), async (req: AuthenticatedRequest, res: Response) => {
  try {
    const id = parseInt(req.params.id, 10);
    await db.delete(achievements).where(eq(achievements.id, id));
    res.json({ success: true, message: 'Achievement deleted' });
  } catch (err) {
    res.status(500).json({ error: 'Failed to delete achievement' });
  }
});

// ================= CMS CONTENT =================
// Public get section content
router.get('/cms/:sectionKey', async (req, res: Response) => {
  try {
    const { sectionKey } = req.params;
    const items = await db.select().from(cmsContent).where(eq(cmsContent.sectionKey, sectionKey)).limit(1);
    if (items.length === 0) {
      return res.json({ sectionKey, data: null });
    }
    const parsed = JSON.parse(items[0].data);
    res.json({ sectionKey, data: parsed, updatedAt: items[0].updatedAt });
  } catch (err) {
    res.status(500).json({ error: 'Failed to retrieve CMS content' });
  }
});

// Admin update section content
router.post('/cms/:sectionKey', requireAuth, requireRoles(['SUPER_ADMIN']), async (req: AuthenticatedRequest, res: Response) => {
  try {
    const { sectionKey } = req.params;
    const { data } = req.body;

    const jsonString = typeof data === 'string' ? data : JSON.stringify(data);

    const existing = await db.select().from(cmsContent).where(eq(cmsContent.sectionKey, sectionKey)).limit(1);

    let result;
    if (existing.length > 0) {
      const [updated] = await db.update(cmsContent).set({
        data: jsonString,
        updatedBy: req.user!.loginId,
        updatedAt: new Date(),
      }).where(eq(cmsContent.sectionKey, sectionKey)).returning();
      result = updated;
    } else {
      const [inserted] = await db.insert(cmsContent).values({
        sectionKey,
        data: jsonString,
        updatedBy: req.user!.loginId,
      }).returning();
      result = inserted;
    }

    await createAuditLog({
      userLoginId: req.user!.loginId,
      userName: req.user!.name,
      role: req.user!.role,
      action: 'CMS_UPDATE',
      module: 'CMS',
      recordId: sectionKey,
      details: `Updated CMS section "${sectionKey}".`,
    });

    res.json({ success: true, sectionKey, result });
  } catch (err) {
    console.error('CMS update error:', err);
    res.status(500).json({ error: 'Failed to save CMS section' });
  }
});

export default router;
