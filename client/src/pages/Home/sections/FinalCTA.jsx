import React from 'react';
import CTASection from '../../../components/common/CTASection';

export const FinalCTA = ({ data }) => {
  return (
    <CTASection
      title={data?.title}
      subtitle={data?.subtitle}
      backgroundImage={data?.imageUrl}
    />
  );
};

export default FinalCTA;
