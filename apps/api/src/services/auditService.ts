import { AuditLog } from '../models/AuditLog';

export class AuditService {
  async log(params: {
    userId: string;
    userName?: string;
    userRole?: string;
    action: string;
    resource: string;
    resourceId?: string;
    details?: Record<string, any>;
    ipAddress?: string;
  }) {
    try {
      await AuditLog.create({
        userId: params.userId,
        userName: params.userName,
        userRole: params.userRole,
        action: params.action,
        resource: params.resource,
        resourceId: params.resourceId,
        details: params.details || {},
        ipAddress: params.ipAddress,
      });
    } catch (err) {
      console.error('[AuditLog Error]:', err);
    }
  }

  async getLogs(filter: any = {}, page = 1, limit = 50) {
    const skip = (page - 1) * limit;
    const logs = await AuditLog.find(filter).sort({ createdAt: -1 }).skip(skip).limit(limit);
    const total = await AuditLog.countDocuments(filter);
    return { logs, total, page, totalPages: Math.ceil(total / limit) };
  }
}

export const auditService = new AuditService();
