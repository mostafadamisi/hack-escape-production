const mongoose = require('mongoose');
const dotenv = require('dotenv');
const Event = require('../src/models/Event');
const Sponsor = require('../src/models/Sponsor');
const Timeline = require('../src/models/Timeline');
const Stats = require('../src/models/Stats');
const Member = require('../src/models/Member');
const Gallery = require('../src/models/Gallery');
const Media = require('../models/Media');

dotenv.config();

const seedData = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('Connected to MongoDB for seeding...');

    // Clear existing data
    await Event.deleteMany({});
    await Sponsor.deleteMany({});
    await Timeline.deleteMany({});
    await Stats.deleteMany({});
    await Member.deleteMany({});
    await Gallery.deleteMany({});
    await Media.deleteMany({});

    // 1. Stats (2025 Edition)
    await Stats.create({
      participants: 45,
      teams: 15,
      universities: 15,
      attendees: 550,
      volunteers: 50
    });

    // 2. Event (2026)
    await Event.create({
      name: { en: "Hack & Escape 2026", ar: "Hack & Escape ٢٠٢٦" },
      description: { 
        en: "The national cybersecurity competition merging escape room logic with real cyber scenarios.", 
        ar: "المسابقة الوطنية للأمن السيبراني التي تدمج منطق غرفة الهروب مع سيناريوهات سيبرانية حقيقية." 
      },
      date: new Date('2026-07-01'),
      location: "Amman, Jordan",
      venue: "Sports City (Al-Madina Al-Riyadiya)",
      status: 'upcoming'
    });

    // 3. Sponsors
    await Sponsor.create([
      {
        name: "Strategic Partner",
        tier: "strategic",
        logo: "/sponsors/strategic1.png",
        description: { en: "Government and Security Entities", ar: "جهات حكومية وأمنية" }
      },
      {
        name: "Gold Cyber Corp",
        tier: "gold",
        logo: "/sponsors/gold1.png",
        description: { en: "Leading Cyber Innovation", ar: "الابتكار السيبراني الرائد" }
      }
    ]);

    // 4. Timeline (2026 Goals)
    await Timeline.create([
      {
        milestone: { en: "Team Formation", ar: "تشكيل الفريق" },
        description: { en: "Core organizing committee formation.", ar: "تشكيل اللجنة التنظيمية الأساسية." },
        date: "Jan 2026",
        status: "completed",
        order: 1
      },
      {
        milestone: { en: "Challenge Design", ar: "تصميم التحديات" },
        description: { en: "Creating hybrid escape-cyber scenarios.", ar: "إنشاء سيناريوهات الهروب والسيبر الهجينة." },
        date: "March 2026",
        status: "in-progress",
        order: 2
      },
      {
        milestone: { en: "Event Launch", ar: "إطلاق الفعالية" },
        description: { en: "The main competition day.", ar: "يوم المسابقة الرئيسي." },
        date: "July 2026",
        status: "pending",
        order: 5
      }
    ]);

    // 5. Team Members
    await Member.create([
      {
        name: "Organizing Team",
        role: { en: "Jordan Cyber Club", ar: "نادي الأردن للسيبر" },
        bio: { en: "The primary force behind Hack & Escape.", ar: "القوة الرئيسية وراء Hack & Escape." },
        image: "/team/jcc-logo.png",
        order: 1
      }
    ]);

    // 6. Gallery (2025)
    await Gallery.create([
      {
        title: { en: "Hack & Escape 2025 Opening", ar: "افتتاح Hack & Escape ٢٠٢٥" },
        imageUrl: "/gallery/event1.jpg",
        category: "event",
        year: "2025"
      },
      {
        title: { en: "Team Solving Puzzles", ar: "فريق يحل الألغاز" },
        imageUrl: "/gallery/prep1.jpg",
        category: "prep",
        year: "2025"
      }
    ]);

    // 7. Media
    await Media.create([
      {
        sourceName: "Jordan News",
        title: { 
          en: "Local Innovation in Cyber Education", 
          ar: "ابتكار محلي في التعليم السيبراني" 
        },
        link: "https://example.com/news1",
        logo: "/media/news-logo.png"
      }
    ]);

    console.log('Full expansion data seeded successfully!');
    process.exit();
  } catch (error) {
    console.error('Error seeding data:', error);
    process.exit(1);
  }
};

seedData();
