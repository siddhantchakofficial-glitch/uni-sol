import React from 'react';
import { IntlSubpageContent } from './IntlSubpageContent';

/**
 * ITITeSOperations — International Enterprise Operations subpage.
 * Connected directly to CMS: real-time live preview, draft autosave, and MongoDB publishing.
 */
export const ITITeSOperations = ({ data }) => {
  return <IntlSubpageContent slug="it-ites-operations" data={data} />;
};

export default ITITeSOperations;
