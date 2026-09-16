import React from 'react';
import PageHero from '../../components/common/PageHero';
import Story from './Story';
import MissionVision from './Mission';
import Leadership from './Leadership';
import CTASection from '../../components/common/CTASection';
import useCMS from '../../hooks/useCMS';
import images from '../../assets/images';

export const About = () => {
  const { content } = useCMS('about', {});

  const banner = content?.banner || {};
  const overview = content?.overview || {};
  const glanceCards = content?.glanceCards || [];

  return (
    <div>
      <PageHero
        badge={banner.badge || "About UniSpark Innovation"}
        title={banner.title || "Engineering Trust, Security & Digital Excellence"}
        description={banner.subtitle || "Learn more about our DPIIT-recognized enterprise journey, leadership vision, and regional presence across India & UAE."}
        breadcrumbs={[{ label: 'About Us' }]}
        image={banner.imageUrl || images.abtSec}
      />
      <Story overview={overview} glanceCards={glanceCards} />
      <MissionVision data={content?.missionVision} />
      <Leadership data={content?.leadership} />
      <CTASection />
    </div>
  );
};

export default About;
