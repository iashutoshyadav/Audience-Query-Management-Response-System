import mongoose from 'mongoose';

const noteSchema = new mongoose.Schema(
  {
    content: {
      type: String,
      required: true,
      trim: true,
      maxlength: 2000,
    },

    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },

    query: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Query',
      required: true,
    },

    deleted: {
      type: Boolean,
      default: false,
    }
  },
  {
    timestamps: true,
    collection: 'notes',
  }
);
noteSchema.index({ query: 1 });
const Note = mongoose.model('Note', noteSchema);

export default Note;
