import images from '../assets/images';

export const TEAM_MEMBERS = [
  {
    name: 'Bhuwan Chander Upadhyay',
    role: 'Chief Executive Officer & Founder',
    bio: 'Over 24 years of executive technology leadership across enterprise cloud, cybersecurity, physical security, and infrastructure transformation.',
    image: images.abtSec,
  },
  {
    name: 'Krishna Baruta',
    role: 'Director of Business Operations',
    bio: 'Specialist in enterprise operations, SLA governance, and multi-country project execution across India & UAE.',
    image: images.aboutVision,
  },
  {
    name: 'Sushma Saxena',
    role: 'Director & Board Member',
    bio: 'Drives strategic corporate growth, financial stewardship, and international partnership alignment.',
    image: images.homeCta,
  },
];

export const teamService = {
  getAll: async () => {
    return TEAM_MEMBERS;
  },
};
