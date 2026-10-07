import { db } from '../../src/db/index.ts';
import { auditLogs } from '../../src/db/schema.ts';

export async function createAuditLog({
  userLoginId,
  userName,
  role,
  action,
  module,
  recordId,
  details,
}: {
  userLoginId: string;
  userName: string;
  role: string;
  action: string;
  module: string;
  recordId?: string | number;
  details?: string;
}) {
  try {
    await db.insert(auditLogs).values({
      userLoginId,
      userName,
      role,
      action,
      module,
      recordId: recordId ? String(recordId) : null,
      details: details || null,
    });
  } catch (error) {
    console.error('Failed to write audit log:', error);
  }
}
