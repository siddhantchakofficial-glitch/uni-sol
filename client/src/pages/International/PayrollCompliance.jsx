import React from 'react';
import { IntlSubpageContent } from './IntlSubpageContent';

/**
 * PayrollCompliance — International Enterprise Operations subpage.
 * Connected directly to CMS: real-time live preview, draft autosave, and MongoDB publishing.
 */
export const PayrollCompliance = ({ data }) => {
  return <IntlSubpageContent slug="payroll-compliance" data={data} />;
};

export default PayrollCompliance;
