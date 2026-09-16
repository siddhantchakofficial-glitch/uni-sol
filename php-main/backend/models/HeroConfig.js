import mongoose from 'mongoose';

const heroConfigSchema = new mongoose.Schema({
  title: {
    type: String,
    default: 'Welcome to Unise'
  },
  heading: {
    type: String,
    default: "UAE's Trusted Security Systems Partner"
  },
  words: {
    type: [String],
    default: ["Design.", "Supply.", "Installation.", "Maintenance."]
  },
  description: {
    type: String,
    default: 'Protecting businesses, assets, and people across Dubai, Abu Dhabi, Sharjah, and the UAE — with world-class physical security infrastructure, expert engineers, and zero-compromise service.'
  },
  button1: {
    text: { type: String, default: 'Request a Free Site Survey' },
    link: { type: String, default: '/contact-us' }
  },
  button2: {
    text: { type: String, default: 'Call Us Now: +971 50 288 5874' },
    link: { type: String, default: 'tel:+971502885874' }
  },
  videoUrl: {
    type: String,
    default: ''
  }
}, {
  timestamps: true
});

const HeroConfig = mongoose.model('HeroConfig', heroConfigSchema);
export default HeroConfig;
