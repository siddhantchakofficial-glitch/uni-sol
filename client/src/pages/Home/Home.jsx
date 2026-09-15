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

import useCMS from '../../hooks/useCMS';
import { DEFAULT_HOME_DATA } from '../../constants/defaultCMS';

export const Home = () => {
  const { content } = useCMS('home', DEFAULT_HOME_DATA);

  return (
    <div className="space-y-0">
      {content?.ticker?.enabled && content?.ticker?.items?.length > 0 && (
        <div className="bg-[#0284c7] text-white py-2 px-4 text-xs font-semibold overflow-hidden whitespace-nowrap flex items-center shadow-md">
          <span className="bg-[#0f172a] text-sky-400 uppercase text-[10px] px-2 py-0.5 rounded mr-3 tracking-wider flex-shrink-0">
            Live Updates
          </span>
          <div className="animate-marquee inline-block space-x-8">
            {content.ticker.items.map((item, idx) => (
              <span key={idx} className="inline-flex items-center gap-2">
                <span>•</span>
                <span>{item}</span>
              </span>
            ))}
          </div>
        </div>
      )}
      <Hero data={content?.hero} />
      <WhoWeAre data={content?.section2} />
      <WhyUniSpark data={content?.whyUs} />
      <Capabilities data={content?.divisions} />
      <Lifecycle />
      <Industries data={content?.industries} />
      <Results />
      <TrustedBy />
      <FAQ />
      <FinalCTA />
    </div>
  );
};

export default Home;
