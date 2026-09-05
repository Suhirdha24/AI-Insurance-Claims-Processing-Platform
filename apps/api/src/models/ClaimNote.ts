import mongoose, { Schema, Document } from 'mongoose';

export interface IClaimNoteModel extends Document {
  claimId: mongoose.Types.ObjectId;
  authorId: mongoose.Types.ObjectId;
  authorName: string;
  authorRole: string;
  text: string;
  isInternal: boolean;
  createdAt: Date;
}

const claimNoteSchema = new Schema<IClaimNoteModel>(
  {
    claimId: { type: Schema.Types.ObjectId, ref: 'Claim', required: true, index: true },
    authorId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    authorName: { type: String, required: true },
    authorRole: { type: String, required: true },
    text: { type: String, required: true },
    isInternal: { type: Boolean, default: true },
  },
  { timestamps: true }
);

export const ClaimNote = mongoose.model<IClaimNoteModel>('ClaimNote', claimNoteSchema);
