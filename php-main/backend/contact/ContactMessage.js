import mongoose from 'mongoose';

const contactMessageSchema = new mongoose.Schema({
  fullName: { type: String, required: true },
  companyName: { type: String, required: true },
  email: { type: String, required: true },
  country: { type: String, default: 'United Arab Emirates' },
  countryCode: { type: String, default: '+971' },
  phone: { type: String, required: true },
  location: { type: String, default: 'Dubai' },
  enquiryType: { type: String, required: true },
  service: { type: String, default: '' },
  message: { type: String, required: true },
  status: { type: String, enum: ['Unread', 'Read'], default: 'Unread' }
}, { timestamps: true });

export default mongoose.model('ContactMessage', contactMessageSchema);
