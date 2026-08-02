import styles from "./timeline-page.module.css";
import Timeline from "@/components/Timeline";
import { fetchData } from "@/lib/api";

export default async function TimelinePage({ params }) {
  const { locale } = await params;
  const apiMilestones = await fetchData('/timeline', locale);

  const milestones = apiMilestones && apiMilestones.length > 0 
    ? apiMilestones.map(m => ({
        date: m.date,
        title: m.title,
        desc: m.description || m.desc || ""
      }))
    : [
    { 
      date: "2025", 
      title: locale === 'en' ? "Concept Validation" : "التحقق من المفهوم", 
      desc: locale === 'en' ? "Conducting initial feasibility studies and technical prototyping of hybrid mechanics." : "إجراء دراسات الجدوى الأولية والنماذج التقنية للآليات الهجينة." 
    },
    { 
      date: "DEC 2025", 
      title: locale === 'en' ? "First Edition Completed" : "إتمام النسخة الأولى", 
      desc: locale === 'en' ? "Successful execution of the internal pilot competition and proof-of-concept." : "التنفيذ الناجح للمسابقة التجريبية الداخلية وإثبات المفهوم." 
    },
    { 
      date: "JAN 2026", 
      title: locale === 'en' ? "Strategic Team Assembly" : "تكوين الفريق الاستراتيجي", 
      desc: locale === 'en' ? "Building the core team, defining key technical roles, and operational roadmap." : "بناء الفريق الأساسي، وتحديد الأدوار التقنية الرئيسية، وخارطة الطريق التشغيلية." 
    },
    { 
      date: "MAR 2026", 
      title: locale === 'en' ? "Challenge Architecture" : "هندسة التحديات", 
      desc: locale === 'en' ? "Designing and testing high-fidelity cybersecurity challenges and physical puzzles." : "تطوير واختبار تحديات الأمن السيبراني عالية الدقة والألغاز المادية." 
    },
    { 
      date: "MAY 2026", 
      title: locale === 'en' ? "Infrastructure Deployment" : "تجهيز البنية التحتية", 
      desc: locale === 'en' ? "Preparing technical environments, cloud systems, and secure simulation ranges." : "إعداد البيئات التقنية، وأنظمة السحابة، ونطاقات المحاكاة الآمنة." 
    },
    { 
      date: "JUN 2026", 
      title: locale === 'en' ? "Sponsor Partnerships" : "شراكات الرعاة", 
      desc: locale === 'en' ? "Securing strategic industry collaborations and academic support for the event." : "تأمين التعاون الاستراتيجي مع الصناعة والدعم الأكاديمي للفعالية." 
    },
    { 
      date: "JULY 1, 2026", 
      title: locale === 'en' ? "Grand Event Launch" : "انطلاق الفعالية الكبرى", 
      desc: locale === 'en' ? "Official execution of Hack & Escape with regional teams and live coverage." : "التنفيذ الرسمي لـ Hack & Escape مع فرق إقليمية وتغطية مباشرة." 
    }
  ];

  return (
    <div className={styles.container} dir={locale === 'ar' ? 'rtl' : 'ltr'}>
      <header className={styles.header}>
        <h1 className="glow-text">{locale === 'en' ? 'Roadmap' : 'خارطة الطريق'}</h1>
        <p className={styles.subtitle}>{locale === 'en' ? 'Tracking our progress toward the ultimate cyber simulation.' : 'تتبع تقدمنا نحو المحاكاة السيبرانية القصوى.'}</p>
      </header>

      <Timeline milestones={milestones} locale={locale} />
    </div>
  );
}
