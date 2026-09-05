import { CAPABILITIES } from '../utils/constants';

export const capabilityService = {
  getAll: async () => {
    return CAPABILITIES;
  },
  getBySlug: async (slug) => {
    return CAPABILITIES.find((cap) => cap.slug === slug) || CAPABILITIES[0];
  },
};
