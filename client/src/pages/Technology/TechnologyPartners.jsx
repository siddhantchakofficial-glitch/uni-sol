import React from 'react';
import PartnerCard from '../../components/cards/PartnerCard';
import { PARTNERS } from '../../utils/constants';

export const TechnologyPartners = () => {
  return (
    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
      {PARTNERS.map((p, idx) => (
        <PartnerCard key={idx} partner={p} />
      ))}
    </div>
  );
};

export default TechnologyPartners;
