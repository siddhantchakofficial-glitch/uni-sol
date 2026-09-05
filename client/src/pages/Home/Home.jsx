import React from 'react';
import Hero from './sections/Hero';
import WhoWeAre from './sections/WhoWeAre';
import WhyUniSpark from './sections/WhyUniSpark';
import Capabilities from './sections/Capabilities';
import Lifecycle from './sections/Lifecycle';
import Industries from './sections/Industries';
import Results from './sections/Results';
import TrustedBy from './sections/TrustedBy';
import FAQ from './sections/FAQ';
import FinalCTA from './sections/FinalCTA';

export const Home = () => {
  return (
    <div className="space-y-0">
      <Hero />
      <WhoWeAre />
      <WhyUniSpark />
      <Capabilities />
      <Lifecycle />
      <Industries />
      <Results />
      <TrustedBy />
      <FAQ />
      <FinalCTA />
    </div>
  );
};

export default Home;
