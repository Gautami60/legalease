import { Schema, model, models, Types } from 'mongoose';

const CaseSchema = new Schema(
  {
    userId: { type: Types.ObjectId, ref: 'User', required: true },
    title: { type: String, required: true },
    caseNumber: { type: String },
    status: { type: String, enum: ['OPEN', 'CLOSED', 'ON_HOLD'], default: 'OPEN' },
    priority: { type: String, enum: ['LOW', 'MEDIUM', 'HIGH'], default: 'MEDIUM' },
    court: { type: String },
    filingDate: { type: Date },
    hearingDates: [{ type: Date }],
    parties: [{ name: String, role: String }],
    lawyer: { name: String, email: String },
    tags: [String],
    notes: String,
    attachments: [{ name: String, url: String }],
  },
  { timestamps: { createdAt: 'createdAt', updatedAt: 'lastUpdatedAt' } }
);

CaseSchema.index({ title: 'text', caseNumber: 'text', notes: 'text', tags: 'text' });

export default models.Case || model('Case', CaseSchema);
