import React from 'react';
import PageHero from '../../components/common/PageHero';
import SectionHeader from '../../components/common/SectionHeader';
import Card from '../../components/ui/Card';
import ContactForm from '../../components/forms/ContactForm';
import { ENV } from '../../config/env';
import { FaPhoneAlt, FaEnvelope, FaMapMarkerAlt, FaClock } from 'react-icons/fa';
import useCMS from '../../hooks/useCMS';
import { useSiteContext } from '../../context/SiteContext';
import images from '../../assets/images';

export const Contact = () => {
  const { content } = useCMS('contact', {});
  const { siteSettings } = useSiteContext();

  const hero = content?.banner || content?.hero || {};
  const offices = (Array.isArray(content?.offices) && content.offices.length > 0)
    ? content.offices
    : [
        {
          id: 'off_1',
          country: 'India (Corporate HQ)',
          address: siteSettings?.general?.address || ENV.ADDRESS_INDIA,
          phone: siteSettings?.general?.phone || ENV.CONTACT_PHONE_INDIA,
          email: siteSettings?.general?.contactEmail || ENV.CONTACT_EMAIL,
        },
        {
          id: 'off_2',
          country: 'UAE (Regional Branch)',
          address: ENV.ADDRESS_UAE,
          phone: ENV.CONTACT_PHONE_UAE,
          email: 'uae@unisparkinnovation.com',
        },
      ];

  return (
    <div>
      <PageHero
        badge={hero.badge || "Contact Us"}
        title={hero.title || "Get in Touch with Our Expert Team"}
        description={hero.subtitle || "Have a technical inquiry, maintenance contract request, or project specification? Connect directly with our solutions team."}
        breadcrumbs={[{ label: 'Contact' }]}
        image={hero.imageUrl || images.contactBg}
      />

      <section className="py-20 bg-[#f1f9ff]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
            {/* Left Contact Info */}
            <div className="lg:col-span-5 space-y-6">
              <SectionHeader
                badge="Direct Support"
                title="Regional Offices & Direct Lines"
                subtitle="We operate dedicated solution support centers across India and the United Arab Emirates."
                center={false}
              />

              <div className="space-y-4">
                {offices.map((office, idx) => (
                  <Card key={office.id || idx} className="space-y-2">
                    <div className="flex items-center gap-3 text-blue-500 font-bold text-sm">
                      <FaMapMarkerAlt className="w-5 h-5 flex-shrink-0" />
                      <span>{office.country || office.city}</span>
                    </div>
                    <p className="text-xs text-gray-600">{office.address}</p>
                    <p className="text-xs text-gray-500 font-mono">Phone: {office.phone}</p>
                    {office.email && (
                      <p className="text-xs text-[#0470aa] hover:underline">
                        <a href={`mailto:${office.email}`}>{office.email}</a>
                      </p>
                    )}
                  </Card>
                ))}

                <Card className="flex items-center gap-4">
                  <FaEnvelope className="w-6 h-6 text-blue-500 flex-shrink-0" />
                  <div>
                    <span className="text-xs font-bold text-gray-500 uppercase tracking-wider block">Email Inquiries</span>
                    <a href={`mailto:${siteSettings?.general?.contactEmail || ENV.CONTACT_EMAIL}`} className="text-sm font-semibold text-gray-900 hover:text-blue-500">
                      {siteSettings?.general?.contactEmail || ENV.CONTACT_EMAIL}
                    </a>
                  </div>
                </Card>
              </div>
            </div>

            {/* Right Contact Form */}
            <div className="lg:col-span-7 bg-[#f1f9ff]/60 border border-slate-800/80 p-8 rounded-2xl backdrop-blur-md shadow-2xl">
              <h3 className="text-xl font-bold text-white mb-6">Send an Inquiry</h3>
              <ContactForm />
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Contact;
