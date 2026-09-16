import React from 'react';
import { IntlSubpageContent } from './IntlSubpageContent';

/**
 * HRSolutions — International Enterprise Operations subpage.
 * Connected directly to CMS: real-time live preview, draft autosave, and MongoDB publishing.
 */
export const HRSolutions = ({ data }) => {
  return <IntlSubpageContent slug="hr-solutions" data={data} />;
};

export default HRSolutions;
