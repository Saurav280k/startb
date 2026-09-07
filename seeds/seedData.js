import mongoose from 'mongoose';
import dotenv from 'dotenv';
import Account from '../models/Account.js';
import Service from '../models/Service.js';
import Internship from '../models/Internship.js';
import User from '../models/User.js';

dotenv.config();

const accountsSeed = [
  {
    title: '148K Tech & AI Viral Page',
    platform: 'Instagram',
    handle: '@techfuture.ai',
    followersCount: 148200,
    engagementRate: 6.8,
    niche: 'Tech & AI',
    price: 18500,
    originalPrice: 24000,
    verifiedBadge: true,
    monetizationEnabled: true,
    monthlyRevenue: 12000,
    accountAgeYears: 3,
    audienceStats: {
      topCountries: ['India (45%)', 'United States (25%)', 'UK (15%)'],
      genderDistribution: '65% Male / 35% Female',
      primaryAgeGroup: '18-32 years (80%)',
    },
    screenshots: [
      'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&w=1200&q=80',
      'https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&w=1200&q=80',
      'https://images.unsplash.com/photo-1460925895917-afdab827c52f?auto=format&fit=crop&w=1200&q=80',
    ],
    description: 'Verified blue-tick tech page with active daily story reach and monthly brand sponsorships.',
    highlights: [
      'Official Blue Badge Verified',
      'Original email and full password access given',
      'Reel reach averages 350K+ real views',
      'Monthly brand deal earnings active',
    ],
    status: 'available',
    transferTimeHours: 1,
  },
  {
    title: '84K Finance & Investing Channel',
    platform: 'YouTube',
    handle: '@wealthblueprint.hq',
    followersCount: 84500,
    engagementRate: 9.2,
    niche: 'Crypto/Finance',
    price: 32000,
    originalPrice: 42000,
    verifiedBadge: true,
    monetizationEnabled: true,
    monthlyRevenue: 24000,
    accountAgeYears: 2,
    audienceStats: {
      topCountries: ['India (60%)', 'United States (20%)', 'UAE (10%)'],
      genderDistribution: '70% Male / 30% Female',
      primaryAgeGroup: '20-40 years (85%)',
    },
    screenshots: [
      'https://images.unsplash.com/photo-1590283603385-17ffb3a7f29f?auto=format&fit=crop&w=1200&q=80',
      'https://images.unsplash.com/photo-1611974789855-9c2a0a7236a3?auto=format&fit=crop&w=1200&q=80',
      'https://images.unsplash.com/photo-1551836022-d5d88e9218df?auto=format&fit=crop&w=1200&q=80',
    ],
    description: 'Fully monetized channel earning regular monthly income through Google AdSense.',
    highlights: [
      'Google AdSense monetization already active',
      'Zero copyright strikes, clean history',
      'Over 4.2 Million lifetime views',
      'Instant ownership transfer to your Gmail',
    ],
    status: 'available',
    transferTimeHours: 2,
  },
  {
    title: '310K Luxury Lifestyle & Supercars',
    platform: 'Instagram',
    handle: '@luxurydrive.club',
    followersCount: 310000,
    engagementRate: 5.4,
    niche: 'Luxury & Travel',
    price: 45000,
    originalPrice: 55000,
    verifiedBadge: false,
    monetizationEnabled: true,
    monthlyRevenue: 30000,
    accountAgeYears: 4,
    audienceStats: {
      topCountries: ['India (40%)', 'UAE / Dubai (30%)', 'USA (15%)'],
      genderDistribution: '68% Male / 32% Female',
      primaryAgeGroup: '18-35 years (82%)',
    },
    screenshots: [
      'https://images.unsplash.com/photo-1503376780353-7e6692767b70?auto=format&fit=crop&w=1200&q=80',
      'https://images.unsplash.com/photo-1544829099-b9a0c07fad1a?auto=format&fit=crop&w=1200&q=80',
      'https://images.unsplash.com/photo-1512453979798-5ea266f8880c?auto=format&fit=crop&w=1200&q=80',
    ],
    description: 'Massive automotive page with high viewer engagement and regular promotion requests.',
    highlights: [
      '310K+ genuine active followers',
      'Clean email and phone number change',
      'High story views and comment interactions',
      'Safe transfer with complete account access',
    ],
    status: 'available',
    transferTimeHours: 1,
  },
  {
    title: '95K Tech News & Startups Insider',
    platform: 'X/Twitter',
    handle: '@siliconalpha_x',
    followersCount: 95400,
    engagementRate: 8.1,
    niche: 'Tech & AI',
    price: 22000,
    originalPrice: 28000,
    verifiedBadge: true,
    monetizationEnabled: true,
    monthlyRevenue: 15000,
    accountAgeYears: 3,
    audienceStats: {
      topCountries: ['India (50%)', 'United States (30%)', 'Singapore (10%)'],
      genderDistribution: '72% Male / 28% Female',
      primaryAgeGroup: '22-38 years (88%)',
    },
    screenshots: [
      'https://images.unsplash.com/photo-1618042164219-62c820f10723?auto=format&fit=crop&w=1200&q=80',
      'https://images.unsplash.com/photo-1507238691740-187a5b1d37b8?auto=format&fit=crop&w=1200&q=80',
      'https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?auto=format&fit=crop&w=1200&q=80',
    ],
    description: 'Verified X account followed by startup founders, coders, and top investors.',
    highlights: [
      'Official Blue Verified Tick',
      'X ad-revenue sharing active',
      'High retweet and impression numbers',
      'Quick email transfer within 1 hour',
    ],
    status: 'available',
    transferTimeHours: 1,
  },
  {
    title: '520K Viral Memes & Reels Hub',
    platform: 'TikTok',
    handle: '@viralspark.official',
    followersCount: 520000,
    engagementRate: 11.5,
    niche: 'Humor/Memes',
    price: 38000,
    originalPrice: 48000,
    verifiedBadge: true,
    monetizationEnabled: true,
    monthlyRevenue: 28000,
    accountAgeYears: 2,
    audienceStats: {
      topCountries: ['Global (70%)', 'India (15%)', 'USA (15%)'],
      genderDistribution: '50% Male / 50% Female',
      primaryAgeGroup: '16-28 years (90%)',
    },
    screenshots: [
      'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?auto=format&fit=crop&w=1200&q=80',
      'https://images.unsplash.com/photo-1534438327276-14e5300c3a48?auto=format&fit=crop&w=1200&q=80',
    ],
    description: 'High reach viral page with over 18 million likes and creator rewards enabled.',
    highlights: [
      'Creator monetization program active',
      '18M+ likes across all videos',
      'Viral format templates included',
      'Safe ownership handoff guaranteed',
    ],
    status: 'available',
    transferTimeHours: 2,
  },
  {
    title: '65K Trading Calls & Market VIP',
    platform: 'Telegram',
    handle: '@alphatrader_vip',
    followersCount: 65000,
    engagementRate: 18.0,
    niche: 'Crypto/Finance',
    price: 19500,
    originalPrice: 25000,
    verifiedBadge: false,
    monetizationEnabled: true,
    monthlyRevenue: 18000,
    accountAgeYears: 2,
    audienceStats: {
      topCountries: ['India (75%)', 'Dubai (15%)', 'UK (10%)'],
      genderDistribution: '82% Male / 18% Female',
      primaryAgeGroup: '20-42 years (92%)',
    },
    screenshots: [
      'https://images.unsplash.com/photo-1621416894569-0f39ed31d247?auto=format&fit=crop&w=1200&q=80',
      'https://images.unsplash.com/photo-1642790106117-e829e14a795f?auto=format&fit=crop&w=1200&q=80',
    ],
    description: 'Active trading community channel with monthly paid subscribers and high open rates.',
    highlights: [
      'High 42% message view rate',
      'Active monthly VIP group members',
      'Direct ownership transfer to your phone number',
    ],
    status: 'available',
    transferTimeHours: 1,
  },
];

const servicesSeed = [
  {
    title: 'Full Stack Website & App Development',
    category: 'Development',
    tag: 'Most Popular',
    shortDesc: 'Custom fast websites and apps built using React, Node.js, and MongoDB.',
    description: 'Complete website development with payment gateway, responsive design, and free maintenance.',
    iconName: 'Code',
    deliveryDays: 10,
    pricingTiers: [
      {
        tierName: 'Starter Website',
        price: 9999,
        turnaroundDays: 5,
        features: ['5 Responsive Pages', 'Mobile Friendly Design', 'Contact & WhatsApp Form', '1 Month Free Support'],
        isPopular: false,
      },
      {
        tierName: 'Pro Full Stack App',
        price: 24999,
        turnaroundDays: 10,
        features: ['Full Stack MERN System', 'UPI / Card Payment Gateway', 'Admin Management Dashboard', '3 Months Free Support'],
        isPopular: true,
      },
      {
        tierName: 'Enterprise App',
        price: 49999,
        turnaroundDays: 20,
        features: ['Custom Mobile & Web App', 'High Speed Cloud Setup', 'Live Notifications & Chat', '6 Months Priority Support'],
        isPopular: false,
      },
    ],
    rating: 4.9,
    completedProjects: 180,
  },
  {
    title: 'Organic Social Media Growth Sprint',
    category: 'Growth',
    tag: 'Quick Results',
    shortDesc: 'Grow your real followers and video views organically through algorithm strategies.',
    description: 'Proven content strategy to push your videos into recommendation feeds without fake bots.',
    iconName: 'TrendingUp',
    deliveryDays: 15,
    pricingTiers: [
      {
        tierName: 'Growth Sprint',
        price: 4999,
        turnaroundDays: 10,
        features: ['10 Trending Video Hooks', 'Hashtags & Caption Strategy', 'Real Audience Reach Boost', 'Weekly Growth Report'],
        isPopular: false,
      },
      {
        tierName: 'Viral Booster',
        price: 9999,
        turnaroundDays: 20,
        features: ['25 Ready Video Edits', 'Algorithm Optimization', 'Follower Growth Strategy', '1-on-1 Creator Call'],
        isPopular: true,
      },
    ],
    rating: 4.8,
    completedProjects: 240,
  },
  {
    title: 'Modern Brand Identity & UI/UX Design',
    category: 'Design',
    tag: 'Premium Quality',
    shortDesc: 'High-end modern logos, Figma product designs, and sleek branding kits.',
    description: 'Clean modern designs that give your business a professional and trusted look.',
    iconName: 'Palette',
    deliveryDays: 7,
    pricingTiers: [
      {
        tierName: 'Logo & Brand Kit',
        price: 3999,
        turnaroundDays: 4,
        features: ['Modern Vector Logo', 'Color Palette & Typography', 'Social Media DP & Banners', 'All Source Files (Figma/PNG)'],
        isPopular: false,
      },
      {
        tierName: 'Complete UI/UX Design',
        price: 11999,
        turnaroundDays: 8,
        features: ['Complete Figma App/Web Design', 'Modern Dark & Light UI', 'Interactive Prototype', 'Ready for Developers'],
        isPopular: true,
      },
    ],
    rating: 5.0,
    completedProjects: 115,
  },
  {
    title: 'Cloud Server Setup & Speed Optimization',
    category: 'Cloud & DevOps',
    tag: 'High Speed',
    shortDesc: 'Fast server setup with SSL certificate, automatic backup, and 99.9% uptime.',
    description: 'Deploy your websites on fast cloud servers with zero lag and strong security.',
    iconName: 'Server',
    deliveryDays: 3,
    pricingTiers: [
      {
        tierName: 'Speed & SSL Setup',
        price: 2999,
        turnaroundDays: 2,
        features: ['Free SSL Certificate', 'Fast CDN Configuration', 'Server Security Hardening', 'Database Backup Automation'],
        isPopular: true,
      },
      {
        tierName: 'Cloud Server Migration',
        price: 6999,
        turnaroundDays: 4,
        features: ['Complete Server Migration', 'Zero Downtime Guarantee', 'Email Server Setup', '1 Month Monitoring'],
        isPopular: false,
      },
    ],
    rating: 4.9,
    completedProjects: 85,
  },
];

const internshipsSeed = [
  {
    title: 'Full Stack Web Developer Intern',
    domain: 'Full Stack',
    stipend: '₹20,000 - ₹35,000 / month',
    duration: '3 - 6 Months',
    location: 'Work From Home (Remote)',
    openings: 4,
    deadline: 'Open Now',
    summary: 'Build real-world web apps using React, Node.js, and MongoDB with senior software engineers.',
    responsibilities: [
      'Write clean React and Tailwind frontend code',
      'Build fast REST APIs using Node.js and Express',
      'Work with MongoDB database and UPI payment gateway',
      'Learn best coding practices from senior tech leads',
    ],
    requirements: [
      'Basic knowledge of JavaScript, React, and Node.js',
      'Interest in building practical real-world websites',
      'Ability to complete assigned tasks on time',
    ],
    perks: [
      'Job Offer (PPO) opportunity after internship',
      'Official Internship Certificate & Letter of Recommendation',
      'Flexible working hours from home',
      'Direct guidance from experienced developers',
    ],
    skills: ['React', 'Node.js', 'MongoDB', 'Tailwind CSS', 'JavaScript', 'Git'],
    status: 'active',
  },
  {
    title: 'Frontend & UI Animation Intern',
    domain: 'Frontend',
    stipend: '₹18,000 - ₹30,000 / month',
    duration: '3 Months',
    location: 'Work From Home (Remote)',
    openings: 3,
    deadline: 'Open Now',
    summary: 'Design smooth webpage animations and attractive modern components using React and GSAP.',
    responsibilities: [
      'Create smooth animations using GSAP and Tailwind CSS',
      'Convert Figma UI designs into responsive React pages',
      'Make sure website runs fast on both mobile and PC',
    ],
    requirements: [
      'Good eye for clean UI design, spacing, and colors',
      'Basic knowledge of HTML, CSS, React, and animations',
    ],
    perks: [
      'Build an impressive portfolio with live projects',
      'Monthly performance bonus for quality work',
      'Certificate and recommendation letter',
    ],
    skills: ['React', 'Tailwind CSS', 'GSAP', 'HTML5', 'CSS3', 'Figma'],
    status: 'active',
  },
  {
    title: 'Backend & Cloud Systems Intern',
    domain: 'Backend',
    stipend: '₹22,000 - ₹38,000 / month',
    duration: '3 - 6 Months',
    location: 'Work From Home (Remote)',
    openings: 2,
    deadline: 'Open Now',
    summary: 'Work on secure payment systems, database queries, and server performance.',
    responsibilities: [
      'Create secure API routes with JWT login authentication',
      'Integrate payment confirmation and automated emails',
      'Optimize database queries for faster page loads',
    ],
    requirements: [
      'Understanding of Node.js, Express, and databases',
      'Problem solving skills and interest in backend logic',
    ],
    perks: [
      'High monthly stipend with growth bonus',
      'Pre-Placement Offer (PPO) for full-time role',
      'Hands-on experience with production systems',
    ],
    skills: ['Node.js', 'Express', 'MongoDB', 'REST APIs', 'JWT', 'Git'],
    status: 'active',
  },
  {
    title: 'AI & Python Development Intern',
    domain: 'AI & Machine Learning',
    stipend: '₹25,000 - ₹40,000 / month',
    duration: '3 - 6 Months',
    location: 'Work From Home (Remote)',
    openings: 3,
    deadline: 'Open Now',
    summary: 'Build smart AI tools, chatbot features, and automated data extractors with Python.',
    responsibilities: [
      'Connect OpenAI & Gemini APIs with web platforms',
      'Write Python scripts to automate data tasks',
      'Test AI prompts and build useful smart features',
    ],
    requirements: [
      'Basic Python programming knowledge',
      'Familiarity with AI APIs and prompt engineering',
    ],
    perks: [
      'Highest starting monthly stipend',
      'Work on cutting-edge AI technologies',
      'Official completion certificate and mentorship',
    ],
    skills: ['Python', 'AI APIs', 'Prompt Engineering', 'FastAPI', 'Git'],
    status: 'active',
  },
  {
    title: 'UI/UX App & Web Design Intern',
    domain: 'UI/UX Design',
    stipend: '₹15,000 - ₹25,000 / month',
    duration: '3 Months',
    location: 'Work From Home (Remote)',
    openings: 2,
    deadline: 'Open Now',
    summary: 'Design modern dark and light mode UI screens, app mockups, and social graphics in Figma.',
    responsibilities: [
      'Design clean mobile and desktop screens in Figma',
      'Create icons, color systems, and component libraries',
      'Collaborate with developers to turn designs into reality',
    ],
    requirements: [
      'Comfortable using Figma for app/website design',
      'Good understanding of clean typography and colors',
    ],
    perks: [
      'Showcase your designs on live products',
      'Design portfolio review with senior designers',
      'Full-time designer placement opportunity',
    ],
    skills: ['Figma', 'UI/UX Design', 'Wireframing', 'Color Theory', 'Prototyping'],
    status: 'active',
  },
  {
    title: 'Digital Marketing & Growth Intern',
    domain: 'Digital Marketing',
    stipend: '₹15,000 - ₹25,000 / month',
    duration: '3 Months',
    location: 'Work From Home (Remote)',
    openings: 3,
    deadline: 'Open Now',
    summary: 'Manage social media campaigns, create viral reels, and connect with tech creators.',
    responsibilities: [
      'Plan and post engaging content on Instagram & LinkedIn',
      'Track video reach, follower growth, and user queries',
      'Help creators and customers on WhatsApp desk',
    ],
    requirements: [
      'Active user of Instagram, YouTube, and LinkedIn',
      'Good communication and creative thinking skills',
    ],
    perks: [
      'Performance incentives on successful deals',
      'Internship certificate & industry networking',
    ],
    skills: ['Social Media', 'Content Creation', 'Canva', 'Copywriting', 'Analytics'],
    status: 'active',
  },
];

const seedDB = async () => {
  try {
    const conn = await mongoose.connect(process.env.MONGO_URI);
    console.log(`Connected to MongoDB for seeding: ${conn.connection.host}`);

    await Account.deleteMany({});
    await Service.deleteMany({});
    await Internship.deleteMany({});

    await Account.insertMany(accountsSeed);
    await Service.insertMany(servicesSeed);
    await Internship.insertMany(internshipsSeed);

    console.log('Seeded updated data with 1-line info, simple Indian English, and UPI pricing! 🌱');
    process.exit(0);
  } catch (error) {
    console.error('Error seeding data:', error.message);
    process.exit(1);
  }
};

seedDB();
