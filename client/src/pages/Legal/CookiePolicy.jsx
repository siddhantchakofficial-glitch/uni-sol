import React from 'react';
import PageHero from '../../components/common/PageHero';

export const CookiePolicy = () => {
  return (
    <div>
      <PageHero
        badge="Legal & Compliance"
        title="Cookie Policy"
        description="Understanding how we use technical cookies to enhance browsing experience."
        breadcrumbs={[{ label: 'Cookie Policy' }]}
      />
      <section className="py-16 bg-[#f1f9ff] text-slate-300 text-sm leading-relaxed max-w-4xl mx-auto px-4 space-y-6">
        <h3 className="text-xl font-bold text-white">Use of Technical Cookies</h3>
        <p>
          We use essential technical cookies to maintain session states and improve website navigation. You may disable cookies in your browser settings if preferred.
        </p>
      </section>
    </div>
  );
};

export default CookiePolicy;
