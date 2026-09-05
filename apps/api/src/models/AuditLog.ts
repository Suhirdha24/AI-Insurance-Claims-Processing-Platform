import mongoose, { Schema, Document } from 'mongoose';

export interface IAuditLogModel extends Document {
  userId: mongoose.Types.ObjectId;
  userName?: string;
  userRole?: string;
  action: string;
  resource: string;
  resourceId?: string;
  details: Record<string, any>;
  ipAddress?: string;
  createdAt: Date;
}

const auditLogSchema = new Schema<IAuditLogModel>(
  {
    userId: { type: Schema.Types.ObjectId, ref: 'User', required: true, index: true },
    userName: String,
    userRole: String,
    action: { type: String, required: true, index: true },
    resource: { type: String, required: true, index: true },
    resourceId: { type: String, index: true },
    details: { type: Schema.Types.Mixed, default: {} },
    ipAddress: String,
  },
  { timestamps: true }
);

export const AuditLog = mongoose.model<IAuditLogModel>('AuditLog', auditLogSchema);
