import mongoose from 'mongoose';

const USER_ROLES = Object.freeze(['user', 'agent', 'admin']);

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
      maxlength: 120,
    },

    email: {
      type: String,
      required: true,
      unique: true,  // this automatically creates an index
      lowercase: true,
      trim: true,
      maxlength: 200,
      match: [/^[^\s@]+@[^\s@]+\.[^\s@]+$/, 'Invalid email format'],
    },

    password_hash: {
      type: String,
      required: true,
      select: false,
    },

    role: {
      type: String,
      enum: USER_ROLES,
      default: 'user',
    },

    is_active: {
      type: Boolean,
      default: true,
    },
  },
  {
    timestamps: true,
    collection: 'users',
  }
);

// Keep only non-email indexes
userSchema.index({ role: 1 });
// userSchema.index({ is_active: 1 }); // optional

const User = mongoose.model('User', userSchema);

export default User;
export { USER_ROLES };
