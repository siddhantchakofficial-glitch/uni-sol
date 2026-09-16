import React from 'react';
import { IntlSubpageContent } from './IntlSubpageContent';

/**
 * SecurityEquipmentAccessControl — International Enterprise Operations subpage.
 * Connected directly to CMS: real-time live preview, draft autosave, and MongoDB publishing.
 */
export const SecurityEquipmentAccessControl = ({ data }) => {
  return <IntlSubpageContent slug="security-equipment-access-control" data={data} />;
};

export default SecurityEquipmentAccessControl;
