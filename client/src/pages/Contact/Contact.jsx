import React from 'react';
import PageHero from '../../components/common/PageHero';
import SectionHeader from '../../components/common/SectionHeader';
import Card from '../../components/ui/Card';
import ContactForm from '../../components/forms/ContactForm';
import { ENV } from '../../config/env';
import { FaPhoneAlt, FaEnvelope, FaMapMarkerAlt, FaClock } from 'react-icons/fa';

export const Contact = () => {
  return (
    <div>
      <PageHero
        badge="Contact Us"
        title="Get in Touch with Our Expert Team"
        description="Have a technical inquiry, maintenance contract request, or project specification? Connect directly with our solutions team."
        breadcrumbs={[{ label: 'Contact' }]}
        image="/src/assets/images/contact-bg.jpg"
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
                <Card className="space-y-3">
                  <div className="flex items-center gap-3 text-blue-400 font-bold text-sm">
                    <FaMapMarkerAlt className="w-5 h-5" />
                    <span>India Corporate Headquarters</span>
                  </div>
                  <p className="text-xs text-slate-300">{ENV.ADDRESS_INDIA}</p>
                  <p className="text-xs text-slate-400">Phone: {ENV.CONTACT_PHONE_INDIA}</p>
                </Card>

                <Card className="space-y-3">
                  <div className="flex items-center gap-3 text-cyan-400 font-bold text-sm">
                    <FaMapMarkerAlt className="w-5 h-5" />
                    <span>UAE Regional Branch</span>
                  </div>
                  <p className="text-xs text-slate-300">{ENV.ADDRESS_UAE}</p>
                  <p className="text-xs text-slate-400">Phone: {ENV.CONTACT_PHONE_UAE}</p>
                </Card>

                <Card className="flex items-center gap-4">
                  <FaEnvelope className="w-6 h-6 text-blue-400 flex-shrink-0" />
                  <div>
                    <span className="text-xs font-bold text-slate-400 uppercase tracking-wider block">Email Inquiries</span>
                    <a href={`mailto:${ENV.CONTACT_EMAIL}`} className="text-sm font-semibold text-slate-100 hover:text-blue-400">
                      {ENV.CONTACT_EMAIL}
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
