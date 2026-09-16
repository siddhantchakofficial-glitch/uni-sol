import React from 'react';
import { IntlSubpageContent } from './IntlSubpageContent';

/**
 * SkilledWorkforce — International Enterprise Operations subpage.
 * Connected directly to CMS: real-time live preview, draft autosave, and MongoDB publishing.
 */
export const SkilledWorkforce = ({ data }) => {
  return <IntlSubpageContent slug="skilled-workforce" data={data} />;
};

export default SkilledWorkforce;
