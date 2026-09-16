import mongoose from 'mongoose';

const marqueeItemSchema = new mongoose.Schema({
  text: { type: String, required: true },
  icon: { type: String, default: 'fa-star' },
  link: { type: String, default: '' },
  badge: { type: String, default: '' },
  isActive: { type: Boolean, default: true }
});

const marqueeConfigSchema = new mongoose.Schema({
  enabled: { type: Boolean, default: true },
  speed: { type: Number, default: 25 }, // Duration in seconds for full loop
  bgColor: { type: String, default: '#ffffff' },
  textColor: { type: String, default: '#0f172a' },
  items: [marqueeItemSchema]
}, { timestamps: true });

const MarqueeConfig = mongoose.model('MarqueeConfig', marqueeConfigSchema);

export default MarqueeConfig;
