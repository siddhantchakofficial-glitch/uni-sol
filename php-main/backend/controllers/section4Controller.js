import Section4Config from '../models/Section4Config.js';
import { getDBStatus } from '../config/db.js';

const defaultSection4 = {
  title: 'Our Two Divisions',
  heading: 'One Partner. Two Specialist Divisions.',
  cards: [
    {
      title: 'Installation & Maintenance',
      description: 'Professional design, supply, installation, commissioning, and AMC/PMC services across all physical security systems. SLA-governed, UAE-wide coverage.',
      icon: 'fa-screwdriver-wrench',
      buttonText: 'Explore Installation Services',
      buttonLink: '/solutions'
    },
    {
      title: 'Security Equipment Trading',
      description: 'Supply of globally-recognised security hardware — cameras, recorders, access control, alarm panels, biometric devices, cabling — with UAE stock for fast delivery.',
      icon: 'fa-truck-ramp-box',
      buttonText: 'Request a Survey',
      buttonLink: '/contact-us'
    }
  ]
};

let inMemorySection4 = { ...defaultSection4 };

export const getSection4Config = async (req, res) => {
  try {
    if (getDBStatus()) {
      let config = await Section4Config.findOne();
      if (!config) {
        config = await Section4Config.create(defaultSection4);
      }
      return res.json({ success: true, data: config });
    } else {
      return res.json({ success: true, data: inMemorySection4 });
    }
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

export const updateSection4Config = async (req, res) => {
  const { title, heading, cards } = req.body;

  try {
    const updateData = {
      title: title || defaultSection4.title,
      heading: heading || defaultSection4.heading,
      cards: Array.isArray(cards) && cards.length > 0 ? cards : defaultSection4.cards
    };

    if (getDBStatus()) {
      const updated = await Section4Config.findOneAndUpdate(
        {},
        { $set: updateData },
        { upsert: true, new: true, setDefaultsOnInsert: true }
      );
      return res.json({ success: true, message: 'Section 4 configuration saved', data: updated });
    } else {
      inMemorySection4 = { ...updateData };
      return res.json({ success: true, message: 'Section 4 configuration saved (In-Memory)', data: inMemorySection4 });
    }
  } catch (error) {
    console.error('Error in updateSection4Config:', error);
    return res.status(500).json({ success: false, message: error.message });
  }
};
