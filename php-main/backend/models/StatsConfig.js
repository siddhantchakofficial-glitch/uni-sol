import mongoose from 'mongoose';

const statItemSchema = new mongoose.Schema({
  title: { type: String, required: true },
  subtitle: { type: String, required: true },
  caption: { type: String, default: '' },
  icon: { type: String, default: 'MapPin' }
});

const statsConfigSchema = new mongoose.Schema({
  statsList: [statItemSchema]
}, { timestamps: true });

const StatsConfig = mongoose.model('StatsConfig', statsConfigSchema);

export default StatsConfig;
