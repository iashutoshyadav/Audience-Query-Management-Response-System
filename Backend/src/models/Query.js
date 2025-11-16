import mongoose from 'mongoose';

const PRIORITY_LEVELS = Object.freeze([
  'low',
  'medium',
  'high',
  'urgent'
]);

const STATUS_TYPES = Object.freeze([
  'open',
  'in_progress',
  'resolved',
  'closed'
]);

const SOURCE_TYPES = Object.freeze([
  'email',
  'whatsapp',
  'manual'
]);

const querySchema = new mongoose.Schema(
  {
    source: {
      type: String,
      enum: SOURCE_TYPES,
      default: 'manual',
    },
    sender: {
      type: String,
      default: null,
    },
    title: {
      type: String,
      required: true,
      trim: true,
      maxlength: 250,
    },
    body: {
      type: String,
      required: true,
    },
    tags: {
      type: [String],
      default: [],
    },
    priority: {
      type: String,
      enum: PRIORITY_LEVELS,
      default: 'medium',
    },
    status: {
      type: String,
      enum: STATUS_TYPES,
      default: 'open',
    },
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      default: null,
    },
    assigned_to: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      default: null,
    },
    replySent: {
      type: Boolean,
      default: false,
    },
    messageId: {
      type: String,
      index: true,
      default: null,
    },
    channel: {
      type: String,
      default: 'email',
    },
    receivedAt: {
      type: Date,
      default: Date.now,
    },
  },
  {
    timestamps: true,
    collection: 'queries',
  }
);
querySchema.index({ user: 1 });
querySchema.index({ status: 1, priority: 1 });
querySchema.index({ title: 'text', body: 'text', tags: 'text' });

const Query = mongoose.model('Query', querySchema);

export default Query;
export { PRIORITY_LEVELS, STATUS_TYPES, SOURCE_TYPES };
