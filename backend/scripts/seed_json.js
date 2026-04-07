const fs = require('fs');
const path = require('path');

const seedData = {
  events: [{
    name: "Hack & Escape",
    organizer: "Jordan Cyber Club",
    location: "Sports City (Al-Madina Al-Riyadiya), Amman, Jordan",
    date: "2026-07-01T09:00:00",
    description: {
      en: "Hack & Escape is a national cybersecurity competition that merges escape room logic puzzles with real cybersecurity scenarios. Born from a group of students joking about university assignments, it challenges traditional CTFs to introduce locally built Jordanian innovation.",
      ar: "Hack & Escape هي مسابقة وطنية للأمن السيبراني تدمج ألغاز منطق غرف الهروب مع سيناريوهات حقيقية للأمن السيبراني. ولدت الفكرة من مجموعة طلاب يمزحون حول مهام الجامعة، وتتحدى التنسيقات التقليدية لتقديم ابتكار أردني محلي الصنع."
    },
    mission: {
      en: "Build a cyber-aware generation and push participants to think beyond traditional CTF formats.",
      ar: "بناء جيل واعي سيبرانياً ودفع المشاركين للتفكير خارج أطر مسابقات CTF التقليدية."
    }
  }],
  stats: [{
    participants: 45,
    teams: 15,
    universities: 15,
    attendees: 550,
    volunteers: 50
  }],
  members: [
    { name: "Jordan Cyber Club Core Team", role: { en: "Main Organizers", ar: "المنظمون الرئيسيون" }, bio: { en: "A passionate group of Jordanian innovators in cyber education.", ar: "مجموعة شغوفة من المبتكرين الأردنيين في مجال التعليم السيبراني." }, image: "https://images.unsplash.com/photo-1522071820081-009f0129c71c?auto=format&fit=crop&q=80&w=400" }
  ],
  sponsors: [
    { name: "Strategic Tech Partner", tier: "partner", logo: "SP" },
    { name: "Gold Cyber Shield", tier: "gold", logo: "GS" }
  ],
  timeline: [
    { title: { en: "Team Formation", ar: "تكوين الفريق" }, date: "Jan 2026", order: 1 },
    { title: { en: "Challenge Dev", ar: "تطوير التحديات" }, date: "Mar 2026", order: 2 },
    { title: { en: "Event Launch", ar: "إطلاق الفعالية" }, date: "July 2026", order: 5 }
  ],
  gallery: [
    { title: { en: "Hack & Escape 2025 Highlights", ar: "لقطات من Hack & Escape ٢٠٢٥" }, image: "https://images.unsplash.com/photo-1550751827-4bd374c3f58b?auto=format&fit=crop&q=80&w=800", type: "photo", category: { en: "Competition", ar: "المنافسة" } }
  ],
  media: [
    { 
      title: { 
        en: "Jordan Cyber Club Launches 'Hack & Escape' Competition", 
        ar: "نادي الأردن للسايبر يطلق مسابقة 'Hack & Escape'" 
      }, 
      sourceName: "Jordan Times", 
      link: "https://www.jordantimes.com/news/local/cyber-club-launches-national-competition",
      date: "2025-05-12T10:00:00Z"
    },
    { 
      title: { 
        en: "Future Cybersecurity Leaders Shine in Amman", 
        ar: "قادة الأمن السيبراني في المستقبل يتألقون في عمان" 
      }, 
      sourceName: "Al-Ghad News", 
      link: "https://alghad.com/cyber-security-leaders-amman/",
      date: "2025-06-25T09:30:00Z"
    },
    { 
      title: { 
        en: "The Innovation Behind the Jordanian Escape Room CTF", 
        ar: "الابتكار وراء مسابقة غرف الهروب الأردنية" 
      }, 
      sourceName: "Tech Trends MEA", 
      link: "https://techtrends.io/jordanian-ctf-innovation",
      date: "2025-07-05T14:00:00Z"
    },
    { 
      title: { 
        en: "National Cybersecurity Strategy: Empowering Youth", 
        ar: "الاستراتيجية الوطنية للأمن السيبراني: تمكين الشباب" 
      }, 
      sourceName: "Ammon News", 
      link: "https://ammonnews.net/article/123456",
      date: "2025-08-15T11:00:00Z"
    },
    { 
      title: { 
        en: "Cybersecurity Training: Building a Resilient Digital Future", 
        ar: "التدريب على الأمن السيبراني: بناء مستقبل رقمي مرن" 
      }, 
      sourceName: "Roya News", 
      link: "https://royanews.tv/cyber-training-jordan",
      date: "2025-09-02T16:45:00Z"
    }
  ]
};

const runSeed = () => {
  const dataDir = path.join(__dirname, '../data');
  if (!fs.existsSync(dataDir)) fs.mkdirSync(dataDir);

  Object.keys(seedData).forEach(collection => {
    const dataWithIds = seedData[collection].map((item, i) => ({
      ...item,
      _id: (i + 1).toString(),
      createdAt: new Date().toISOString()
    }));
    fs.writeFileSync(path.join(dataDir, `${collection}.json`), JSON.stringify(dataWithIds, null, 2));
    console.log(`Seeded collection: ${collection}`);
  });
};

runSeed();
