import mongoose from 'mongoose';

const partnerSchema = new mongoose.Schema({
  name: { type: String, required: true },
  logoUrl: { type: String, required: true },
  link: { type: String, default: '' }
});

const partnerConfigSchema = new mongoose.Schema({
  badgeText: { type: String, default: 'GLOBAL ALLIANCE' },
  headingText: { type: String, default: 'Powered by the World\'s Leading Security Brands' },
  isVisible: { type: Boolean, default: true },
  bgColor: { type: String, default: '#ffffff' },
  speed: { type: Number, default: 25 },
  partnersList: [partnerSchema]
}, { timestamps: true });

const PartnerConfig = mongoose.model('PartnerConfig', partnerConfigSchema);

export default PartnerConfig;
