import React from 'react';
import { IntlSubpageContent } from './IntlSubpageContent';

/**
 * HRAdvisory — International Enterprise Operations subpage.
 * Connected directly to CMS: real-time live preview, draft autosave, and MongoDB publishing.
 */
export const HRAdvisory = ({ data }) => {
  return <IntlSubpageContent slug="hr-advisory" data={data} />;
};

export default HRAdvisory;
