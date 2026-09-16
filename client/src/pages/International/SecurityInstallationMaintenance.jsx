import React from 'react';
import { IntlSubpageContent } from './IntlSubpageContent';

/**
 * SecurityInstallationMaintenance — International Enterprise Operations subpage.
 * Connected directly to CMS: real-time live preview, draft autosave, and MongoDB publishing.
 */
export const SecurityInstallationMaintenance = ({ data }) => {
  return <IntlSubpageContent slug="security-installation-maintenance" data={data} />;
};

export default SecurityInstallationMaintenance;
