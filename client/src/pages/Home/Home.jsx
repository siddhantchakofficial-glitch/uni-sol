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

export const Home = ({ _previewData }) => {
  const { content: cmsContent } = useCMS('home', DEFAULT_HOME_DATA);
  const content = _previewData || cmsContent;
  const visibility = content?.visibility || {};

  return (
    <div className="space-y-0">
      {visibility.ticker !== false && content?.ticker?.enabled && content?.ticker?.items?.length > 0 && (
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
      {visibility.hero !== false && <Hero data={content?.hero} />}
      {visibility.whoWeAre !== false && <WhoWeAre data={content?.section2} />}
      {visibility.whyUs !== false && <WhyUniSpark data={content?.whyUs} />}
      {visibility.capabilities !== false && <Capabilities data={content?.divisions} />}
      {visibility.lifecycle !== false && <Lifecycle data={content?.lifecycle} />}
      {visibility.industries !== false && <Industries data={content?.industries} />}
      {visibility.results !== false && <Results data={content?.results} />}
      {visibility.testimonials !== false && <TrustedBy data={content?.testimonials} />}
      {visibility.faqs !== false && <FAQ data={content?.faqs} />}
      {visibility.cta !== false && <FinalCTA data={content?.cta} />}
    </div>
  );
};

export default Home;
