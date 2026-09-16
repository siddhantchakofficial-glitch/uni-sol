import mongoose from 'mongoose';

const cardSchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: { type: String, required: true },
  icon: { type: String, default: 'fa-screwdriver-wrench' },
  buttonText: { type: String },
  buttonLink: { type: String }
});

const section4ConfigSchema = new mongoose.Schema({
  title: { type: String, default: 'Our Two Divisions' },
  heading: { type: String, default: 'One Partner. Two Specialist Divisions.' },
  cards: [cardSchema]
}, { timestamps: true });

const Section4Config = mongoose.model('Section4Config', section4ConfigSchema);

export default Section4Config;
