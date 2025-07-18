import mongoose from 'mongoose'

const UserSchema = new mongoose.Schema(
  {
    email: {
      type: String,
      required: true,
    },
    password: {
      type: String,
      required: true,
    },
    role: {
      type: String,
      default: 'User',
    },
    is_active: {
      type: Boolean,
      default: true,
    },
  },
  { timestamps: true },
)
const User = mongoose.model('User', UserSchema)
export default User