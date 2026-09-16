import React from 'react';
import { IntlSubpageContent } from './IntlSubpageContent';

/**
 * Workforce — International Enterprise Operations subpage.
 * Connected directly to CMS: real-time live preview, draft autosave, and MongoDB publishing.
 */
export const Workforce = ({ data }) => {
  return <IntlSubpageContent slug="workforce" data={data} />;
};

export default Workforce;
