import React from 'react';
import { IntlSubpageContent } from './IntlSubpageContent';

/**
 * ManagedITServices — International Enterprise Operations subpage.
 * Connected directly to CMS: real-time live preview, draft autosave, and MongoDB publishing.
 */
export const ManagedITServices = ({ data }) => {
  return <IntlSubpageContent slug="managed-it-services" data={data} />;
};

export default ManagedITServices;
