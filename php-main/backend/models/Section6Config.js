import mongoose from 'mongoose';

const cardSchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: { type: String },
  icon: { type: String, required: true }
});

const section6ConfigSchema = new mongoose.Schema({
  title: { type: String, default: 'WHY CHOOSE UNISPARK' },
  heading: { type: String, default: 'Technical Authority. Trusted Delivery.' },
  description: { type: String, default: 'We combine regulatory expertise, multi-vendor technology integration, and lifecycle ownership to keep your critical assets protected.' },
  button: {
    text: { type: String, default: 'View All Services' },
    link: { type: String, default: '/solutions' }
  },
  cards: [cardSchema]
}, { timestamps: true });

const Section6Config = mongoose.model('Section6Config', section6ConfigSchema);

export default Section6Config;
