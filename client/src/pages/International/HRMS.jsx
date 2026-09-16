import React from 'react';
import { IntlSubpageContent } from './IntlSubpageContent';

/**
 * HRMS — International Enterprise Operations subpage.
 * Connected directly to CMS: real-time live preview, draft autosave, and MongoDB publishing.
 */
export const HRMS = ({ data }) => {
  return <IntlSubpageContent slug="hrms" data={data} />;
};

export default HRMS;
