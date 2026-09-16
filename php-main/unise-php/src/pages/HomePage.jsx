import React, { useState, useEffect } from 'react';
import HeroSection from '../components/HeroSection';
import MarqueeSection from '../components/MarqueeSection';
import AboutSection from '../components/AboutSection';
import SolutionsSection from '../components/SolutionsSection';
import DivisionsSection from '../components/DivisionsSection';
import IndustriesSection from '../components/IndustriesSection';
import WhyUsSection from '../components/WhyUsSection';
import PartnersSection from '../components/PartnersSection';
import StatsSection from '../components/StatsSection';
import OurGroupSection from '../components/OurGroupSection';
import CtaSection from '../components/CtaSection';

export default function HomePage({ onOpenEnquiry }) {
  const [aboutData, setAboutData] = useState(null);

  const loadAboutData = async () => {
    try {
      const apiBase = import.meta.env.VITE_API_BASE_URL || 'https://unispark-backend-api.onrender.com/api';
      const res = await fetch(`${apiBase}/about`);
      const data = await res.json();
      if (data.success && data.data) {
        setAboutData(data.data);
      }
    } catch (err) {
      console.warn('Error fetching about data on HomePage:', err);
    }
  };

  useEffect(() => {
    loadAboutData();
    const handleFocus = () => loadAboutData();
    window.addEventListener('focus', handleFocus);
    const interval = setInterval(loadAboutData, 5000);

    return () => {
      window.removeEventListener('focus', handleFocus);
      clearInterval(interval);
    };
  }, []);

  return (
    <div className="space-y-0">
      <HeroSection onOpenEnquiry={onOpenEnquiry} />
      <MarqueeSection />
      <AboutSection />
      <SolutionsSection />
      <DivisionsSection onOpenEnquiry={onOpenEnquiry} />
      <IndustriesSection />
      <WhyUsSection />
      <PartnersSection />
      <StatsSection />
      <OurGroupSection data={aboutData} />
      <CtaSection data={aboutData} onOpenEnquiry={onOpenEnquiry} />
    </div>
  );
}
