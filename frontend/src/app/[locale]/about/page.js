import styles from "./about.module.css";
import CyberCard from "@/components/CyberCard";

export default async function AboutPage({ params }) {
  const { locale } = await params;

  const content = {
    en: {
      title: "Our Story",
      mission: "To build a cyber-aware generation and push participants beyond traditional technical boundaries.",
      originStory: "It started in a locked room. A group of students joking that whoever solved the assignment first could leave. That moment of pressure and logic inspired Hack & Escape.",
      problem: "Traditional CTFs focus on isolated technical flags. They lack real-world pressure and integrated problem-solving.",
      solution: "Hack & Escape merges escape room logic with high-fidelity cyber scenarios, forcing teams to collaborate and think creatively under immersion."
    },
    ar: {
      title: "قصتنا",
      mission: "بناء جيل واعي سيبرانياً ودفع المشاركين لتجاوز الحدود التقنية التقليدية.",
      originStory: "بدأ الأمر في غرفة مغلقة. مجموعة من الطلاب يمزحون بأن من يحل المهمة أولاً يمكنه مغادرة الغرفة. ألهمت تلك اللحظة من الضغط والمنطق فكرة Hack & Escape.",
      problem: "تركز مسابقات CTF التقليدية على أعلام تقنية معزولة. إنها تفتقر إلى ضغط العالم الحقيقي وحل المشكلات المتكامل.",
      solution: "يجمع Hack & Escape بين منطق غرفة الهروب وسيناريوهات سيبرانية عالية الدقة، مما يجبر الفرق على التعاون والتفكير بشكل إبداعي تحت الانغماس."
    }
  };

  const t = content[locale] || content.en;

  return (
    <div className={styles.container} dir={locale === 'ar' ? 'rtl' : 'ltr'}>
      <header className={styles.header}>
        <h1 className="glow-text">{t.title}</h1>
        <p className={styles.subtitle}>{t.mission}</p>
      </header>

      <section className={styles.grid}>
        <CyberCard title={locale === 'en' ? "The Spark" : "الشرارة"} variant="primary">
          <p className={styles.cardText}>{t.originStory}</p>
        </CyberCard>

        <div className={styles.comparism}>
          <div className={styles.col}>
            <h3>{locale === 'en' ? "The Problem" : "المشكلة"}</h3>
            <p>{t.problem}</p>
          </div>
          <div className={styles.vs}>VS</div>
          <div className={styles.col}>
            <h3 className="glow-text">{locale === 'en' ? "The Solution" : "الحل"}</h3>
            <p>{t.solution}</p>
          </div>
        </div>
      </section>
    </div>
  );
}
