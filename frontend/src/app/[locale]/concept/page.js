import styles from "./concept.module.css";
import CyberCard from "@/components/CyberCard";

export default async function ConceptPage({ params }) {
  const { locale } = await params;

  const content = {
    en: {
      title: "The Hybrid Concept",
      subtitle: "Where Logical Puzzles Meet High-Stakes Cyber Defense",
      intro: "Hack & Escape isn't a typical sit-down competition. It's an immersive physical and digital experience.",
      sections: [
        {
          title: "The Physical Layer",
          desc: "Teams are placed in a physical 'Locked Room' environment. To progress, you must solve biological, mechanical, and logical puzzles that represent real-world physical security breaches."
        },
        {
          title: "The Digital Layer",
          desc: "Every physical breakthrough unlocks a digital terminal. Participants must perform forensics, vulnerability assessment, and attack-defense maneuvers to obtain the next 'key'."
        },
        {
          title: "The Scenario",
          desc: "Everything is tied to a cohesive narrative. You might be a state-sponsored response team stopping a blackout, or an internal audit team uncovering a data heist."
        }
      ]
    },
    ar: {
      title: "المفهوم الهجين",
      subtitle: "حيث تلتقي الألغاز المنطقية مع الدفاع السيبراني عالي المخاطر",
      intro: "Hack & Escape ليست مجرد مسابقة جلوس عادية. إنها تجربة بدنية ورقمية غامرة.",
      sections: [
        {
          title: "الطبقة المادية",
          desc: "يتم وضع الفرق في بيئة 'غرفة مغلقة' حقيقية. للتقدم، يجب عليك حل الألغاز البيولوجية والميكانيكية والمنطقية التي تمثل خروقات الأمن المادي في العالم الحقيقي."
        },
        {
          title: "الطبقة الرقمية",
          desc: "كل اختراق مادي يفتح محطة رقمية. يجب على المشاركين إجراء التحقيقات الجنائية الرقمية وتقييم الثغرات الأمنية ومناورات الهجوم والدفاع للحصول على 'المفتاح' التالي."
        },
        {
          title: "السيناريو",
          desc: "كل شيء مرتبط بسرد متماسك. قد تكون فريق استجابة مدعوم من الدولة يوقف انقطاع التيار الكهربائي، أو فريق تدقيق داخلي يكشف عن سرقة بيانات."
        }
      ]
    }
  };

  const t = content[locale] || content.en;

  return (
    <div className={styles.container} dir={locale === 'ar' ? 'rtl' : 'ltr'}>
      <header className={styles.header}>
        <h1 className="glow-text">{t.title}</h1>
        <p className={styles.subtitle}>{t.subtitle}</p>
        <p className={styles.intro}>{t.intro}</p>
      </header>

      <div className={styles.layers}>
        {t.sections.map((section, i) => (
          <div key={i} className={styles.layerCard}>
            <div className={styles.layerNum}>0{i+1}</div>
            <div className={styles.layerLine}></div>
            <CyberCard title={section.title} variant={i === 1 ? 'secondary' : 'primary'}>
              <p>{section.desc}</p>
            </CyberCard>
          </div>
        ))}
      </div>
    </div>
  );
}
