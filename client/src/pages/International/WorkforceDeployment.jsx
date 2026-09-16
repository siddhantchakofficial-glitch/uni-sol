import React from 'react';
import { IntlSubpageContent } from './IntlSubpageContent';

/**
 * WorkforceDeployment — International Enterprise Operations subpage.
 * Connected directly to CMS: real-time live preview, draft autosave, and MongoDB publishing.
 */
export const WorkforceDeployment = ({ data }) => {
  return <IntlSubpageContent slug="workforce-deployment" data={data} />;
};

export default WorkforceDeployment;
