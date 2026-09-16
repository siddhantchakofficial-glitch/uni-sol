import mongoose from 'mongoose';

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Name is required'],
    trim: true
  },
  email: {
    type: String,
    required: [true, 'Email is required'],
    unique: true,
    lowercase: true,
    trim: true
  },
  password: {
    type: String,
    required: [true, 'Password is required'],
    default: 'password123'
  },
  role: {
    type: String,
    enum: ['Super Admin', 'Admin', 'Editor', 'Viewer'],
    default: 'Editor'
  },
  status: {
    type: String,
    enum: ['Active', 'Inactive', 'Pending'],
    default: 'Active'
  },
  avatar: {
    type: String,
    default: ''
  }
}, {
  timestamps: true
});

const User = mongoose.model('User', userSchema);
export default User;
