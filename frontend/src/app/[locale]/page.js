import styles from "./page.module.css";
import Terminal from "@/components/Terminal";
import CyberCard from "@/components/CyberCard";
import StatsCounter from "@/components/StatsCounter";
import Countdown from "@/components/Countdown";
import SponsorMarquee from "@/components/SponsorMarquee";
import Link from "next/link";
import { fetchData } from "@/lib/api";

export default async function Home({ params }) {
  const { locale } = await params;
  const statsData = await fetchData('stats', locale);
  const eventData = await fetchData('event', locale);
  const sponsors = await fetchData('sponsors', locale);
  const terminalData = await fetchData('terminal', locale);
  
  const terminalLogs = terminalData && terminalData.length > 0
    ? terminalData // fetchData already flattens text properties to the correct locale
    : [];
  
  const content = {
    en: {
      headline: "Building a Cyber-Aware Generation",
      description: eventData?.description || "Hack & Escape is more than a competition. It's a real-world cybersecurity simulation designed to inspire the next generation of talent.",
      cta_sponsor: "Become a Sponsor",
      cta_contact: "Contact Us",
      stats: [
        { target: statsData?.participants?.toString() || "500", label: "Participants" },
        { target: statsData?.teams?.toString() || "120", label: "Teams" },
        { target: statsData?.universities?.toString() || "15", label: "Universities" },
        { target: statsData?.attendees?.toString() || "1000", label: "Attendees" }
      ],
      partner_title: "Partner With Hack & Escape",
      partner_text: "Support the cybersecurity ecosystem and connect with top-tier talent from across Jordan."
    },
    ar: {
      headline: "بناء جيل واعي سيبرانياً",
      description: eventData?.description || "Hack & Escape أكثر من مجرد مسابقة. إنها محاكاة واقعية للأمن السيبراني مصممة لإلهام الجيل القادم من المواهب.",
      cta_sponsor: "كن راعياً",
      cta_contact: "اتصل بنا",
      stats: [
        { target: statsData?.participants?.toString() || "500", label: "مشارك" },
        { target: statsData?.teams?.toString() || "120", label: "فريق" },
        { target: statsData?.universities?.toString() || "15", label: "جامعة" },
        { target: statsData?.attendees?.toString() || "1000", label: "حضور" }
      ],
      partner_title: "شاركنا في Hack & Escape",
      partner_text: "ادعم منظومة الأمن السيبراني وتواصل مع نخبة المواهب من جميع أنحاء الأردن."
    }
  };

  const t = content[locale] || content.en;
  const eventName = eventData?.name || "HACK & ESCAPE";

  return (
    <div className={styles.page} dir={locale === 'ar' ? 'rtl' : 'ltr'}>
      <section 
        className={styles.hero} 
        style={{ 
          backgroundImage: `linear-gradient(rgba(5, 5, 5, 0.4), rgba(5, 5, 5, 0.8)), url('/images/hero-bg.png')`,
          backgroundSize: 'cover',
          backgroundPosition: 'center'
        }}
      >
        <div className={styles.heroContent}>
          <h1 className={`${styles.headline} glow-text`}>
            {eventName}<br/>
            <span>{t.headline}</span>
          </h1>
          <p className={styles.description}>{t.description}</p>
          <Countdown targetDate={eventData?.date || "2026-07-01T09:00:00"} locale={locale} />
        </div>
        <div className={styles.heroVisual}>
          <Terminal locale={locale} logs={terminalLogs} />
        </div>
      </section>

      <section className={styles.stats}>
        <div className={styles.statsGrid}>
          {t.stats.map((stat, i) => (
            <CyberCard key={i} variant={i % 2 === 0 ? "primary" : "secondary"}>
              <StatsCounter target={stat.target} label={stat.label} />
            </CyberCard>
          ))}
        </div>
      </section>

      <section className={styles.sponsorsSection}>
        <SponsorMarquee sponsors={sponsors} />
      </section>

      <section className={styles.ctaBanner}>
        <CyberCard className={styles.bannerCard}>
          <h2>{t.partner_title}</h2>
          <p>{t.partner_text}</p>
          <div className={styles.bannerBtns}>
            <Link href={`/${locale}/register/sponsor`} className={styles.primaryBtn}>
              {t.cta_sponsor}
            </Link>
          </div>
        </CyberCard>
      </section>
    </div>
  );
}
