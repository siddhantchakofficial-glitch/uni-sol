import mongoose from 'mongoose';

const partnerLinkSchema = new mongoose.Schema({
  title: { type: String },
  url: { type: String },
  label: { type: String }
});

const contactConfigSchema = new mongoose.Schema({
  bannerTitle: { type: String, default: "Get in Touch — We're Ready to Help" },
  bannerDesc: { type: String, default: "Whether you need a site survey, a product quotation, or information about our annual maintenance contracts — our team is ready to respond quickly and professionally. Contact us by phone, email, or complete the enquiry form below." },
  
  country: { type: String, default: "United Arab Emirates" },
  countryCode: { type: String, default: "+971" },
  
  phone: { type: String, default: "+971 50 288 5874" },
  whatsapp: { type: String, default: "971502885874" },
  email: { type: String, default: "info@unisparkinnovation.com" },
  
  address: { type: String, default: "Dubai, United Arab Emirates" },
  coverage: { type: String, default: "Dubai · Abu Dhabi · Sharjah · UAE Nationwide" },
  workingHours: { type: String, default: "Sunday – Thursday, 8:00 AM – 6:00 PM (UAE)" },
  
  mapEmbedUrl: { type: String, default: "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d28884.867909334753!2d55.2707828!3d25.2048493!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3e5f43348a6d0883%3A0x2f57581dbf302924!2sDubai!5e0!3m2!1sen!2sae!4v1625000000000!5m2!1sen!2sae" },
  
  // Enquiry Form CMS
  formBadge: { type: String, default: "ENQUIRY FORM" },
  formTitle: { type: String, default: "Send us a message!" },
  formSubtitle: { type: String, default: "Fill in the details below and our technical engineering team will get back to you promptly." },
  formSuccessTitle: { type: String, default: "Enquiry Dispatched!" },
  formSuccessDesc: { type: String, default: "Thank you for contacting UniSpark Innovation. Our technical engineering division will respond quickly within 2 business hours." },
  
  partnerLinks: [partnerLinkSchema]
}, { timestamps: true });

export default mongoose.model('ContactConfig', contactConfigSchema);
