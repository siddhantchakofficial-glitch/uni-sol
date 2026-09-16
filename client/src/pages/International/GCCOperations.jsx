import React from 'react';
import { IntlSubpageContent } from './IntlSubpageContent';

/**
 * GCCOperations — International Enterprise Operations subpage.
 * Connected directly to CMS: real-time live preview, draft autosave, and MongoDB publishing.
 */
export const GCCOperations = ({ data }) => {
  return <IntlSubpageContent slug="gcc-operations" data={data} />;
};

export default GCCOperations;
