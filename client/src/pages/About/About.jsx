import React from 'react';
import PageHero from '../../components/common/PageHero';
import Story from './Story';
import MissionVision from './Mission';
import Leadership from './Leadership';
import CTASection from '../../components/common/CTASection';

export const About = () => {
  return (
    <div>
      <PageHero
        badge="About UniSpark Innovation"
        title="Engineering Trust, Security & Digital Excellence"
        description="Learn more about our DPIIT-recognized enterprise journey, leadership vision, and regional presence across India & UAE."
        breadcrumbs={[{ label: 'About Us' }]}
        image="/src/assets/images/abt-sec.jpg"
      />
      <Story />
      <MissionVision />
      <Leadership />
      <CTASection />
    </div>
  );
};

export default About;
