import ContactConfig from './ContactConfig.js';
import ContactMessage from './ContactMessage.js';
import { getDBStatus } from '../config/db.js';

const defaultContactConfig = {
  bannerTitle: "Get in Touch — We're Ready to Help",
  bannerDesc: "Whether you need a site survey, a product quotation, or information about our annual maintenance contracts — our team is ready to respond quickly and professionally. Contact us by phone, email, or complete the enquiry form below.",
  country: "United Arab Emirates",
  countryCode: "+971",
  phone: "+971 50 288 5874",
  whatsapp: "971502885874",
  email: "info@unisparkinnovation.com",
  address: "Dubai, United Arab Emirates",
  coverage: "Dubai · Abu Dhabi · Sharjah · UAE Nationwide",
  workingHours: "Sunday – Thursday, 8:00 AM – 6:00 PM (UAE)",
  mapEmbedUrl: "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d28884.867909334753!2d55.2707828!3d25.2048493!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3e5f43348a6d0883%3A0x2f57581dbf302924!2sDubai!5e0!3m2!1sen!2sae!4v1625000000000!5m2!1sen!2sae",
  formBadge: "ENQUIRY FORM",
  formTitle: "Send us a message!",
  formSubtitle: "Fill in the details below and our technical engineering team will get back to you promptly.",
  formSuccessTitle: "Enquiry Dispatched!",
  formSuccessDesc: "Thank you for contacting UniSpark Innovation. Our technical engineering division will respond quickly within 2 business hours.",
  partnerLinks: [
    { title: "Looking for IT Services?", label: "Visit Horizon Hive Technology L.L.C", url: "https://horizonhivetechnology.com/" },
    { title: "Looking for HR Solutions?", label: "Visit UniSpark Innovations Human Resource Consultants L.L.C", url: "https://usihr.com/" }
  ]
};

let inMemoryConfig = { ...defaultContactConfig };
let inMemoryMessages = [];

// ======================= CONFIGURATION =======================
export const getContactConfig = async (req, res) => {
  try {
    if (getDBStatus()) {
      let config = await ContactConfig.findOne();
      if (!config) {
        config = await ContactConfig.create(defaultContactConfig);
      }
      return res.json({ success: true, data: config });
    } else {
      return res.json({ success: true, data: inMemoryConfig });
    }
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

export const updateContactConfig = async (req, res) => {
  const updateData = req.body;
  try {
    if (getDBStatus()) {
      const updated = await ContactConfig.findOneAndUpdate(
        {},
        { $set: updateData },
        { upsert: true, new: true, setDefaultsOnInsert: true }
      );
      return res.json({ success: true, message: 'Contact configuration saved', data: updated });
    } else {
      inMemoryConfig = { ...inMemoryConfig, ...updateData };
      return res.json({ success: true, message: 'Contact configuration saved (In-Memory)', data: inMemoryConfig });
    }
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

// ======================= MESSAGES / ENQUIRIES =======================
export const submitMessage = async (req, res) => {
  try {
    // Honeypot Bot Rejection Check
    if (req.body.honeypot && String(req.body.honeypot).trim() !== '') {
      console.warn("Backend rejected automated bot submission.");
      return res.status(400).json({ success: false, message: 'Automated submission rejected' });
    }

    const payload = {
      country: req.body.country || 'United Arab Emirates',
      countryCode: req.body.countryCode || '+971',
      ...req.body
    };
    if (getDBStatus()) {
      const newMessage = await ContactMessage.create(payload);
      return res.status(201).json({ success: true, data: newMessage });
    } else {
      const newMessage = { ...payload, _id: Date.now().toString(), createdAt: new Date().toISOString(), status: 'Unread' };
      inMemoryMessages.push(newMessage);
      return res.status(201).json({ success: true, data: newMessage });
    }
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

export const getMessages = async (req, res) => {
  try {
    if (getDBStatus()) {
      const messages = await ContactMessage.find().sort({ createdAt: -1 });
      return res.json({ success: true, data: messages });
    } else {
      return res.json({ success: true, data: inMemoryMessages.sort((a,b) => new Date(b.createdAt) - new Date(a.createdAt)) });
    }
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

export const markMessageRead = async (req, res) => {
  try {
    if (getDBStatus()) {
      const updated = await ContactMessage.findByIdAndUpdate(req.params.id, { status: 'Read' }, { new: true });
      return res.json({ success: true, data: updated });
    } else {
      const msg = inMemoryMessages.find(m => m._id === req.params.id);
      if (msg) msg.status = 'Read';
      return res.json({ success: true, data: msg });
    }
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

export const deleteMessage = async (req, res) => {
  try {
    if (getDBStatus()) {
      await ContactMessage.findByIdAndDelete(req.params.id);
      return res.json({ success: true, message: 'Message deleted' });
    } else {
      inMemoryMessages = inMemoryMessages.filter(m => m._id !== req.params.id);
      return res.json({ success: true, message: 'Message deleted (In-Memory)' });
    }
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};
