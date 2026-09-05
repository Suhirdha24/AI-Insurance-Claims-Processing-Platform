export interface IAuditLog {
  id: string;
  userId: string;
  userName?: string;
  userRole?: string;
  action: string;
  resource: string;
  resourceId?: string;
  details: Record<string, any>;
  ipAddress?: string;
  timestamp: string;
}

export interface INotification {
  id: string;
  userId: string;
  title: string;
  message: string;
  type: 'INFO' | 'WARNING' | 'SUCCESS' | 'ACTION_REQUIRED';
  read: boolean;
  link?: string;
  createdAt: string;
}
