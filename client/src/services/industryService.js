import { INDUSTRIES } from '../utils/constants';

export const industryService = {
  getAll: async () => {
    return INDUSTRIES;
  },
  getBySlug: async (slug) => {
    return INDUSTRIES.find((ind) => ind.slug === slug) || INDUSTRIES[0];
  },
};
