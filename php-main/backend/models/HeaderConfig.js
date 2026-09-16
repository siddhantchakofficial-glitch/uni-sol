import mongoose from 'mongoose';

const headerConfigSchema = new mongoose.Schema({
  email: {
    type: String,
    default: 'contact@unise.com'
  },
  socialLinks: {
    facebook: { type: String, default: 'https://facebook.com/unise' },
    instagram: { type: String, default: 'https://instagram.com/unise' },
    twitter: { type: String, default: 'https://twitter.com/unise' },
    linkedin: { type: String, default: 'https://linkedin.com/company/unise' }
  },
  logoUrl: {
    type: String,
    default: ''
  }
}, {
  timestamps: true
});

const HeaderConfig = mongoose.model('HeaderConfig', headerConfigSchema);
export default HeaderConfig;
