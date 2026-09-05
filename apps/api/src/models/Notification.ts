import mongoose, { Schema, Document } from 'mongoose';

export interface INotificationModel extends Document {
  userId: mongoose.Types.ObjectId;
  title: string;
  message: string;
  type: 'INFO' | 'WARNING' | 'SUCCESS' | 'ACTION_REQUIRED';
  read: boolean;
  link?: string;
  createdAt: Date;
}

const notificationSchema = new Schema<INotificationModel>(
  {
    userId: { type: Schema.Types.ObjectId, ref: 'User', required: true, index: true },
    title: { type: String, required: true },
    message: { type: String, required: true },
    type: { type: String, enum: ['INFO', 'WARNING', 'SUCCESS', 'ACTION_REQUIRED'], default: 'INFO' },
    read: { type: Boolean, default: false },
    link: String,
  },
  { timestamps: true }
);

export const Notification = mongoose.model<INotificationModel>('Notification', notificationSchema);
