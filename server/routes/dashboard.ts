import { Router, Response } from 'express';
import { db } from '../../src/db/index.ts';
import {
  students,
  faculties,
  users,
  admissions,
  attendances,
  fees,
  certificates,
  grievances,
  placements,
  libraryBooks,
  bookIssues,
  departments,
  courses,
  auditLogs,
} from '../../src/db/schema.ts';
import { sql, desc } from 'drizzle-orm';
import { requireAuth, AuthenticatedRequest } from '../middleware/auth.ts';

const router = Router();

router.get('/stats', requireAuth, async (req: AuthenticatedRequest, res: Response) => {
  try {
    const todayStr = new Date().toISOString().split('T')[0];

    // Parallel counts
    const [
      studentsCount,
      facultyCount,
      usersCount,
      admissionsPending,
      todayAttendance,
      feesPending,
      certRequests,
      openGrievances,
      activePlacements,
      totalBooks,
      activeIssues,
      deptCount,
      courseCount,
      recentLogs,
    ] = await Promise.all([
      db.select({ count: sql<number>`count(*)` }).from(students),
      db.select({ count: sql<number>`count(*)` }).from(faculties),
      db.select({ count: sql<number>`count(*)` }).from(users),
      db.select({ count: sql<number>`count(*)` }).from(admissions).where(sql`status = 'PENDING'`),
      db.select({ count: sql<number>`count(*)` }).from(attendances).where(sql`date = ${todayStr}`),
      db.select({ totalPending: sql<number>`coalesce(sum(pending_amount), 0)` }).from(fees),
      db.select({ count: sql<number>`count(*)` }).from(certificates).where(sql`status = 'PENDING'`),
      db.select({ count: sql<number>`count(*)` }).from(grievances).where(sql`status = 'OPEN' or status = 'IN_REVIEW'`),
      db.select({ count: sql<number>`count(*)` }).from(placements).where(sql`status = 'ACTIVE'`),
      db.select({ count: sql<number>`count(*)` }).from(libraryBooks),
      db.select({ count: sql<number>`count(*)` }).from(bookIssues).where(sql`status = 'ISSUED'`),
      db.select({ count: sql<number>`count(*)` }).from(departments),
      db.select({ count: sql<number>`count(*)` }).from(courses),
      db.select().from(auditLogs).orderBy(desc(auditLogs.timestamp)).limit(6),
    ]);

    // Breakdown of students by course for dashboard charts
    const courseBreakdown = await db
      .select({
        course: students.course,
        count: sql<number>`count(*)`,
      })
      .from(students)
      .groupBy(students.course);

    // Monthly attendance breakdown or general metrics
    res.json({
      totalStudents: Number(studentsCount[0]?.count || 0),
      totalFaculty: Number(facultyCount[0]?.count || 0),
      totalUsers: Number(usersCount[0]?.count || 0),
      pendingAdmissions: Number(admissionsPending[0]?.count || 0),
      todayAttendance: Number(todayAttendance[0]?.count || 0),
      totalPendingFees: Number(feesPending[0]?.totalPending || 0),
      pendingCertificates: Number(certRequests[0]?.count || 0),
      openGrievances: Number(openGrievances[0]?.count || 0),
      activePlacements: Number(activePlacements[0]?.count || 0),
      totalLibraryBooks: Number(totalBooks[0]?.count || 0),
      activeBookIssues: Number(activeIssues[0]?.count || 0),
      totalDepartments: Number(deptCount[0]?.count || 0),
      totalCourses: Number(courseCount[0]?.count || 0),
      courseBreakdown: courseBreakdown.map(c => ({
        name: c.course,
        students: Number(c.count),
      })),
      recentActivity: recentLogs,
    });
  } catch (err: any) {
    console.error('Error calculating dashboard stats:', err);
    res.status(500).json({ error: 'Failed to calculate dashboard statistics' });
  }
});

export default router;
