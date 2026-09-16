import React from 'react';
import useCMS from '../../hooks/useCMS';
import { AboutContent } from './AboutContent';
import { DEFAULT_ABOUT_DATA } from '../../constants/aboutDefaults';

export const About = () => {
  const { content } = useCMS('about', DEFAULT_ABOUT_DATA);

  return (
    <main>
      <AboutContent data={content} isPreview={false} />
    </main>
  );
};

export default About;
