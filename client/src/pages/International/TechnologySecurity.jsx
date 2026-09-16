import React from 'react';
import { IntlSubpageContent } from './IntlSubpageContent';

/**
 * TechnologySecurity — International Enterprise Operations subpage.
 * Connected directly to CMS: real-time live preview, draft autosave, and MongoDB publishing.
 */
export const TechnologySecurity = ({ data }) => {
  return <IntlSubpageContent slug="technology-security" data={data} />;
};

export default TechnologySecurity;
