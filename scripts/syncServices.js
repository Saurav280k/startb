import mongoose from 'mongoose';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';
import Service from '../models/Service.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

dotenv.config({ path: path.join(__dirname, '../.env') });

const newServices = [
  {
    title: 'YouTube Automation & Cashcow Channel Setup',
    category: 'Growth',
    tag: 'Passive Income',
    shortDesc: 'Turnkey faceless YouTube channel with niche research, viral scriptwriting, AI voiceover, and editing.',
    description: 'Complete setup of an automated YouTube cashcow channel designed to generate steady AdSense and affiliate revenue on autopilot.',
    iconName: 'TrendingUp',
    deliveryDays: 12,
    pricingTiers: [
      {
        tierName: 'Starter Cashcow Setup',
        price: 6999,
        turnaroundDays: 5,
        features: ['High-CPM Niche & Competitor Research', '3 High-Retention Faceless Videos', 'Viral Scriptwriting & AI Voiceover', 'Click-Worthy Thumbnail Suite'],
        isPopular: false,
      },
      {
        tierName: 'Monetization Sprint Pack',
        price: 15999,
        turnaroundDays: 12,
        features: ['10 Produced Faceless Videos', 'Complete Channel SEO & Tags', 'Channel Art & Intro Animation', '4000h Watchtime Algorithm Strategy'],
        isPopular: true,
      },
      {
        tierName: 'Complete Empire Automated Suite',
        price: 34999,
        turnaroundDays: 25,
        features: ['25 Fully Produced Videos', 'Dedicated Video Editor & Scriptwriter', 'Automated Content Pipeline', 'Monetization & Sponsorship Playbook'],
        isPopular: false,
      },
    ],
    rating: 4.9,
    completedProjects: 142,
  },
  {
    title: 'Shopify & E-Commerce High-Converting Store Architecture',
    category: 'Development',
    tag: 'Sales Booster',
    shortDesc: 'Custom high-converting online stores built on Shopify, Next.js, or WooCommerce with UPI payment gateways.',
    description: 'Professional e-commerce storefront with 1-second load times, checkout upsells, abandoned cart recovery, and mobile-first UX.',
    iconName: 'Code',
    deliveryDays: 8,
    pricingTiers: [
      {
        tierName: 'Single Product / D2C Launch',
        price: 7999,
        turnaroundDays: 4,
        features: ['High-Converting Landing Page', 'Direct UPI & Card Checkout', 'Meta Pixel & Google Analytics', '1-Click WhatsApp Support Widget'],
        isPopular: false,
      },
      {
        tierName: 'Pro Brand Storefront',
        price: 18499,
        turnaroundDays: 8,
        features: ['Up to 50 Product Catalog Setup', 'Automated Courier & Shipping API', 'Abandoned Cart WhatsApp/Email Recovery', 'Conversion Rate Optimization (CRO)'],
        isPopular: true,
      },
      {
        tierName: 'Enterprise Custom E-Commerce',
        price: 39999,
        turnaroundDays: 18,
        features: ['Headless Next.js Storefront', 'Multi-Currency International Checkout', 'ERP & Inventory Synchronization', 'Dedicated 60-Day Scaling Support'],
        isPopular: false,
      },
    ],
    rating: 5.0,
    completedProjects: 89,
  },
  {
    title: 'Cross-Platform Mobile App Development (iOS & Android)',
    category: 'Development',
    tag: 'Mobile Native',
    shortDesc: 'Modern React Native & Flutter apps with seamless UI, push notifications, and offline capability.',
    description: 'End-to-end mobile app engineering from interactive Figma design to Google Play Store & Apple App Store launch.',
    iconName: 'Code',
    deliveryDays: 20,
    pricingTiers: [
      {
        tierName: 'App MVP Sprint',
        price: 19999,
        turnaroundDays: 10,
        features: ['iOS & Android Compatible App', '5 Fully Functional Screens', 'User Authentication & Database', 'Smooth 60FPS UI Animations'],
        isPopular: false,
      },
      {
        tierName: 'Full Production App',
        price: 44999,
        turnaroundDays: 20,
        features: ['Google Play & App Store Release', 'Push Notifications Integration', 'In-App UPI & Card Payments', 'Admin Analytics Panel'],
        isPopular: true,
      },
      {
        tierName: 'Enterprise Scale App',
        price: 89999,
        turnaroundDays: 35,
        features: ['Real-time Chat & WebSockets', 'High-Concurrency Cloud Architecture', 'Automated CI/CD App Store Pipeline', '6 Months Dedicated Developer SLA'],
        isPopular: false,
      },
    ],
    rating: 4.9,
    completedProjects: 56,
  },
  {
    title: 'Payment Gateway & UPI AutoPay Integration',
    category: 'Cloud & DevOps',
    tag: 'Instant Payouts',
    shortDesc: 'Seamless integration of Razorpay, Cashfree, PhonePe UPI, Stripe, and webhook handling with auto-reconciliation.',
    description: 'Reliable and secure payment stack integration with instant QR generation, recurring subscriptions, and zero-failure webhooks.',
    iconName: 'Server',
    deliveryDays: 4,
    pricingTiers: [
      {
        tierName: 'Standard UPI & Card Gateway',
        price: 3999,
        turnaroundDays: 2,
        features: ['Razorpay / Cashfree Merchant Setup', 'Test Mode & Live Keys Verification', 'Instant Order Webhooks', 'Basic Failover Handling'],
        isPopular: false,
      },
      {
        tierName: 'Multi-Gateway & Dynamic QR',
        price: 8999,
        turnaroundDays: 4,
        features: ['Dynamic Real-Time UPI QR Codes', 'Auto-Retry on Bank Failure', 'Refund Webhook Automated Engine', 'Admin Transaction Ledger'],
        isPopular: true,
      },
      {
        tierName: 'Global Fintech & Subscriptions',
        price: 17499,
        turnaroundDays: 8,
        features: ['Multi-Currency Stripe Integration', 'UPI AutoPay Recurring Billing', 'Automated GST Invoice Generation', 'High-Security Webhook Signature Verification'],
        isPopular: false,
      },
    ],
    rating: 5.0,
    completedProjects: 112,
  },
  {
    title: 'AI Voiceover, Dubbing & Global Video Localization',
    category: 'Growth',
    tag: 'Global Audience',
    shortDesc: 'Translate and dub your videos into Hindi, English, Spanish, German, and Arabic with natural AI emotion.',
    description: 'Reach millions of non-English and regional viewers by translating your audio, voice clones, and subtitles with lip-sync technology.',
    iconName: 'TrendingUp',
    deliveryDays: 5,
    pricingTiers: [
      {
        tierName: 'Starter 5 Video Dubbing',
        price: 2999,
        turnaroundDays: 2,
        features: ['5 Videos Dubbed into 1 Language', 'Natural Neural AI Voice Actor', 'Time-Synced SRT Subtitles', 'Audio Background Music Preservation'],
        isPopular: false,
      },
      {
        tierName: 'Global Reach 15 Pack',
        price: 7499,
        turnaroundDays: 5,
        features: ['15 Videos Translated into 3 Languages', 'Original Speaker Voice Cloning', 'Regional Title & Thumbnail Localization', 'YouTube Multi-Language Audio Setup'],
        isPopular: true,
      },
      {
        tierName: 'Multilingual Creator Empire',
        price: 14999,
        turnaroundDays: 10,
        features: ['35 Localized Multi-Language Videos', 'Lip-Sync AI Visual Alignment', 'Full Channel Regional Repurposing', 'Monthly Growth Analytics Report'],
        isPopular: false,
      },
    ],
    rating: 4.9,
    completedProjects: 180,
  },
];

const syncServices = async () => {
  try {
    console.log('Connecting to MongoDB...');
    await mongoose.connect(process.env.MONGO_URI);
    console.log('Connected to MongoDB.');

    let addedCount = 0;
    let existingCount = 0;

    for (const srv of newServices) {
      const existing = await Service.findOne({ title: srv.title });
      if (!existing) {
        await Service.create(srv);
        console.log(`+ Added new service: "${srv.title}"`);
        addedCount++;
      } else {
        console.log(`- Service already exists: "${srv.title}"`);
        existingCount++;
      }
    }

    console.log(`\nSync Complete: ${addedCount} new services added, ${existingCount} already present.`);
    const totalServices = await Service.countDocuments();
    console.log(`Total active services in MongoDB: ${totalServices}`);

    process.exit(0);
  } catch (error) {
    console.error('Error syncing services:', error);
    process.exit(1);
  }
};

syncServices();
