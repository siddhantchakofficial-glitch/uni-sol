import StatsConfig from '../models/StatsConfig.js';
import { getDBStatus } from '../config/db.js';

const defaultStats = {
  statsList: [
    {
      title: 'UAE-Wide',
      subtitle: 'SERVICE COVERAGE',
      caption: 'Dubai • Abu Dhabi • Sharjah & Beyond',
      icon: 'MapPin'
    },
    {
      title: '6 Industries',
      subtitle: 'SECTORS SERVED',
      caption: 'Aviation to Healthcare',
      icon: 'Building2'
    },
    {
      title: '9 Categories',
      subtitle: 'SERVICE RANGE',
      caption: 'CCTV to System Integration',
      icon: 'Network'
    },
    {
      title: 'AMC/PMC',
      subtitle: 'OPERATIONAL READY',
      caption: 'Annual & Preventive Contracts Available',
      icon: 'FileText'
    }
  ]
};

let inMemoryStats = { ...defaultStats };

export const getStatsConfig = async (req, res) => {
  try {
    if (getDBStatus()) {
      let config = await StatsConfig.findOne();
      if (!config) {
        config = await StatsConfig.create(defaultStats);
      }
      return res.json({ success: true, data: config });
    } else {
      return res.json({ success: true, data: inMemoryStats });
    }
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

export const updateStatsConfig = async (req, res) => {
  const { statsList } = req.body;
  try {
    const updateData = {
      statsList: Array.isArray(statsList) && statsList.length > 0 ? statsList : defaultStats.statsList
    };

    if (getDBStatus()) {
      const updated = await StatsConfig.findOneAndUpdate(
        {},
        { $set: updateData },
        { upsert: true, new: true, setDefaultsOnInsert: true }
      );
      return res.json({ success: true, message: 'Stats configuration saved', data: updated });
    } else {
      inMemoryStats = { ...updateData };
      return res.json({ success: true, message: 'Stats configuration saved (In-Memory)', data: inMemoryStats });
    }
  } catch (error) {
    console.error('Error in updateStatsConfig:', error);
    return res.status(500).json({ success: false, message: error.message });
  }
};
