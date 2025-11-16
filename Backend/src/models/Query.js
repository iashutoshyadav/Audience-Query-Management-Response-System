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
    // Source of query
    source: {
      type: String,
      enum: SOURCE_TYPES,
      default: 'manual',
    },

    // Email sender OR WhatsApp number OR form user
    sender: {
      type: String,
      default: null,
    },

    // Title is required (subject for email, or summary)
    title: {
      type: String,
      required: true,
      trim: true,
      maxlength: 250,
    },

    // MAIN BODY - email body / whatsapp message / manual content
    body: {
      type: String,
      required: true,
    },

    // Tagging from auto-detector (urgent, complaint, personal, etc.)
    tags: {
      type: [String],
      default: [],
    },

    // Priority (computed or manual)
    priority: {
      type: String,
      enum: PRIORITY_LEVELS,
      default: 'medium',
    },

    // Status tracking
    status: {
      type: String,
      enum: STATUS_TYPES,
      default: 'open',
    },

    // For manual creation (staff user)
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      default: null,
    },

    // Assigned person
    assigned_to: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      default: null,
    },

    // NEW FIELD: Was auto-reply sent? (email only)
    replySent: {
      type: Boolean,
      default: false,
    },

    // NEW FIELD: Used to prevent duplicates from IMAP
    messageId: {
      type: String,
      index: true,
      default: null,
    },

    // NEW FIELD: Channel identifier (email, whatsapp, website)
    channel: {
      type: String,
      default: 'email',
    },

    // NEW FIELD: Original received timestamp
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

// Indexes for fast filtering
querySchema.index({ user: 1 });
querySchema.index({ status: 1, priority: 1 });

// Text search index
querySchema.index({ title: 'text', body: 'text', tags: 'text' });

const Query = mongoose.model('Query', querySchema);

export default Query;
export { PRIORITY_LEVELS, STATUS_TYPES, SOURCE_TYPES };
