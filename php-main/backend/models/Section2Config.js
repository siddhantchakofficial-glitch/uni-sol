import mongoose from 'mongoose';

const section2ConfigSchema = new mongoose.Schema({
  title: {
    type: String,
    default: 'Pioneering the Future of Secured Intelligence'
  },
  heading: {
    type: String,
    default: 'Next-Gen Architecture'
  },
  description: {
    type: String,
    default: 'UniSpark Innovation architectures orchestrate friction-free continuous analysis across critical enterprise vectors, neutralizing vulnerabilities before they cross your network perimeter.'
  },
  card1: {
    title: { type: String, default: 'Cognitive Shielding' },
    description: { type: String, default: 'Self-learning neural vectors adapt instantly to network threats.' }
  },
  card2: {
    title: { type: String, default: 'Microsecond Latency' },
    description: { type: String, default: 'Sub-atomic detection layers processing continuous data streams.' }
  },
  ecosystemButton: {
    text: { type: String, default: 'Our Ecosystem' },
    link: { type: String, default: '/about-us' }
  },
  imageUrl: {
    type: String,
    default: '/images/about-vision.jpg'
  },
  imageButton: {
    text: { type: String, default: '99.99% Threat Isolation' },
    link: { type: String, default: '/solutions' }
  }
}, {
  timestamps: true
});

const Section2Config = mongoose.model('Section2Config', section2ConfigSchema);
export default Section2Config;
