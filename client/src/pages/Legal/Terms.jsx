import React from 'react';
import PageHero from '../../components/common/PageHero';

export const Terms = () => {
  return (
    <div>
      <PageHero
        badge="Legal & Compliance"
        title="Terms of Service"
        description="Terms and conditions governing the use of UniSpark Innovation websites and services."
        breadcrumbs={[{ label: 'Terms of Service' }]}
      />
      <section className="py-16 bg-[#f1f9ff] text-slate-300 text-sm leading-relaxed max-w-4xl mx-auto px-4 space-y-6">
        <h3 className="text-xl font-bold text-white">1. Acceptance of Terms</h3>
        <p>
          By accessing www.unisparkinnovation.com, you agree to comply with these terms of service and all applicable laws and regulations.
        </p>
        <h3 className="text-xl font-bold text-white">2. Intellectual Property</h3>
        <p>
          All trademarks, software designs, content, and logos presented on this website are the intellectual property of UNISPARK INNOVATION PRIVATE LIMITED.
        </p>
      </section>
    </div>
  );
};

export default Terms;
