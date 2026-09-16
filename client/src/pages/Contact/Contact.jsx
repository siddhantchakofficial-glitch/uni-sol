import React from 'react';
import PageHero from '../../components/common/PageHero';
import Card from '../../components/ui/Card';
import ContactForm from '../../components/forms/ContactForm';
import { ENV } from '../../config/env';
import { FaPhoneAlt, FaEnvelope, FaMapMarkerAlt, FaClock } from 'react-icons/fa';
import useCMS from '../../hooks/useCMS';
import { useSiteContext } from '../../context/SiteContext';
import images from '../../assets/images';

/*
 * Contact page — fully CMS-driven via the existing useCMS('contact')
 * pipeline. `data` prop lets the CMS Live Preview render this exact public
 * component with unsaved draft edits (same components, no refresh).
 */
export const Contact = ({ data: dataProp } = {}) => {
  const { content: fetched } = useCMS('contact', {});
  const { siteSettings } = useSiteContext();
  const content = dataProp || fetched;

  const hero = content?.banner || content?.hero || {};
  const contacts = content?.contacts || {};
  const formCfg = content?.form || {};
  const mapCfg = content?.map || {};

  const email = contacts.email || siteSettings?.general?.contactEmail || ENV.CONTACT_EMAIL;
  const supportEmail = contacts.supportEmail || email;
  const phoneIndia = contacts.phoneIndia || ENV.CONTACT_PHONE_INDIA;
  const phoneUAE = contacts.phoneUAE || ENV.CONTACT_PHONE_UAE;
  const whatsapp = contacts.whatsapp || ENV.WHATSAPP_NUMBER;
  const addressIndia = contacts.addressIndia || ENV.ADDRESS_INDIA;
  const addressUAE = contacts.addressUAE || ENV.ADDRESS_UAE;

  const offices = (Array.isArray(content?.offices) && content.offices.length > 0)
    ? content.offices
    : [
        { id: 'off_1', country: 'India (Corporate HQ)', address: addressIndia, phone: phoneIndia, email },
        { id: 'off_2', country: 'UAE (Regional Branch)', address: addressUAE, phone: phoneUAE, email: 'uae@unisparkinnovation.com' },
      ];

  // CMS labels for the info cards / section headers (existing text as defaults).
  const labels = content?.labels || {};
  const showInfoCards = content?.visibility?.infoCards !== false;
  const showMap = content?.visibility?.map !== false;
  const showForm = content?.visibility?.form !== false;

  const mapEmbedSrc = mapCfg.embedUrl ||
    `https://www.google.com/maps?q=${encodeURIComponent(mapCfg.query || 'Business Bay, Dubai, UAE')}&output=embed`;
  const hours = formCfg.workingHours || 'Sunday – Thursday · 9:00 – 18:00';

  return (
    <div>
      <PageHero
        badge={hero.badge || "Contact Us"}
        title={hero.title || "Get in Touch — We're Ready to Help"}
        description={hero.subtitle || "Whether you need a technical inquiry, product quotation, or maintenance contract information, our team is ready to respond quickly and professionally — by phone, email, or the enquiry form below."}
        breadcrumbs={[{ label: 'Contact' }]}
        image={hero.imageUrl || images.contactBg}
      />

      {/* ENQUIRY FORM CARD — full-width white card (reference layout) */}
      {showForm && (
      <section className="py-16 sm:py-20 bg-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-white border border-[#e5e7eb] rounded-2xl shadow-xl shadow-[#0470aa]/5 p-6 sm:p-10">
            <div className="flex items-center gap-2.5 mb-1.5">
              <FaEnvelope className="w-4 h-4 text-[#0470aa]" />
              <span className="text-[11px] font-black uppercase tracking-[0.15em] text-[#0470aa]">
                {formCfg.badge || 'Enquiry Form'}
              </span>
            </div>
            <h2 className="text-xl sm:text-2xl font-bold text-[#000000] mb-6">
              {formCfg.heading || 'Send Us a Message'}
            </h2>
            <ContactForm options={formCfg} />
          </div>
        </div>
      </section>
      )}

      {/* INFO CARDS + MAP — two-column band (reference layout) */}
      {(showInfoCards || showMap) && (
      <section className="py-16 sm:py-20 bg-[#f1f9ff]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
            {/* Info cards column */}
            {showInfoCards && (
            <div className="lg:col-span-5 space-y-4">
              <Card className="flex items-start gap-4">
                <div className="w-10 h-10 rounded-xl bg-[#0470aa]/10 border border-[#0470aa]/20 flex items-center justify-center text-[#0470aa] shrink-0">
                  <FaPhoneAlt className="w-4 h-4" />
                </div>
                <div className="space-y-1">
                  <h3 className="text-sm font-bold text-[#000000]">{labels.callUs || 'Call us'}</h3>
                  <a href={`tel:${phoneIndia.replace(/\s/g, '')}`} className="block text-sm text-[#0470aa] font-semibold hover:underline">
                    {phoneIndia}
                  </a>
                  <a
                    href={`https://wa.me/${whatsapp}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="block text-sm text-emerald-600 font-semibold hover:underline"
                  >
                    {phoneIndia} — WhatsApp Business
                  </a>
                </div>
              </Card>

              <Card className="flex items-start gap-4">
                <div className="w-10 h-10 rounded-xl bg-[#0470aa]/10 border border-[#0470aa]/20 flex items-center justify-center text-[#0470aa] shrink-0">
                  <FaEnvelope className="w-4 h-4" />
                </div>
                <div className="space-y-1">
                  <h3 className="text-sm font-bold text-[#000000]">{labels.emailUs || 'Email us'}</h3>
                  <a href={`mailto:${email}`} className="block text-sm text-[#0470aa] font-semibold hover:underline break-all">
                    {email}
                  </a>
                  <a href={`mailto:${supportEmail}`} className="block text-sm text-[#0470aa] font-semibold hover:underline break-all">
                    {supportEmail}
                  </a>
                </div>
              </Card>

              <Card className="flex items-start gap-4">
                <div className="w-10 h-10 rounded-xl bg-[#0470aa]/10 border border-[#0470aa]/20 flex items-center justify-center text-[#0470aa] shrink-0">
                  <FaMapMarkerAlt className="w-4 h-4" />
                </div>
                <div className="space-y-1">
                  <h3 className="text-sm font-bold text-[#000000]">{labels.addressTitle || 'Company Address & Coverage'}</h3>
                  <p className="text-sm text-[#475467]">{offices[0]?.address || addressIndia}</p>
                  <p className="text-xs text-[#6e6e6e]">Coverage: India · UAE · International</p>
                </div>
              </Card>

              <Card className="flex items-start gap-4">
                <div className="w-10 h-10 rounded-xl bg-amber-50 border border-amber-200 flex items-center justify-center text-amber-600 shrink-0">
                  <FaClock className="w-4 h-4" />
                </div>
                <div className="space-y-1">
                  <h3 className="text-sm font-bold text-[#000000]">{labels.hoursTitle || 'Working Hours'}</h3>
                  <p className="text-sm text-[#475467]">{hours}</p>
                </div>
              </Card>
            </div>
            )}

            {/* Map column */}
            {showMap && (
            <div className="lg:col-span-7">
              <div className="rounded-2xl overflow-hidden border border-[#e5e7eb] shadow-lg h-full min-h-[420px]">
                <iframe
                  title="UniSpark office location map"
                  src={mapEmbedSrc}
                  className="w-full h-full min-h-[420px] border-0"
                  loading="lazy"
                  allowFullScreen
                  referrerPolicy="no-referrer-when-downgrade"
                />
              </div>
            </div>
            )}
          </div>
        </div>
      </section>
      )}
    </div>
  );
};

export default Contact;
