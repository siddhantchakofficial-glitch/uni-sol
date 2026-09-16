import React from 'react';
import { IntlSubpageContent } from './IntlSubpageContent';

/**
 * SecurityInfrastructure — International Enterprise Operations subpage.
 * Connected directly to CMS: real-time live preview, draft autosave, and MongoDB publishing.
 */
export const SecurityInfrastructure = ({ data }) => {
  return <IntlSubpageContent slug="security-infrastructure" data={data} />;
};

export default SecurityInfrastructure;
