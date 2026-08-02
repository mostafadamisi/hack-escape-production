import styles from "./team.module.css";
import CyberCard from "@/components/CyberCard";
import { fetchData } from "@/lib/api";

export default async function TeamPage({ params }) {
  const { locale } = await params;
  const team = await fetchData('team', locale);

  const t = {
    en: { title: "The Brains Behind", subtitle: "Jordan Cyber Club & Volunteers" },
    ar: { title: "العقول المدبرة", subtitle: "نادي الأردن للسيبر والمتطوعين" }
  }[locale] || { title: "The Team", subtitle: "" };

  return (
    <div className={styles.container} dir={locale === 'ar' ? 'rtl' : 'ltr'}>
      <header className={styles.header}>
        <h1 className="glow-text">{t.title}</h1>
        <p className={styles.subtitle}>{t.subtitle}</p>
      </header>

      <div className={styles.grid}>
        {team && team.length > 0 ? (
          team.map((member) => (
            <CyberCard key={member._id} title={member.name} variant="primary">
              <div className={styles.memberInfo}>
                <div className={styles.imagePlaceholder} style={{ overflow: 'hidden' }}>
                  {member.image ? (
                    <img src={member.image} alt={member.name} className={styles.memberImg} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                  ) : (
                    <div className={styles.cyberAvatar}></div>
                  )}
                </div>
                <h3 className={styles.role}>{member.role}</h3>
                <p style={{ color: 'var(--color-primary-cyan)', fontSize: '0.9rem', marginBottom: '0.5rem', fontFamily: 'var(--font-mono)' }}>{member.position}</p>
                <p style={{ fontSize: '0.85rem', color: '#ccc', marginBottom: '1rem', lineHeight: '1.4' }}>{member.bio}</p>
                
                <div className={styles.socials}>
                  {member.linkedin && (
                    <a href={member.linkedin} className={styles.socialIcon} target="_blank" rel="noopener noreferrer" style={{ padding: '0.25rem 0.75rem', border: '1px solid currentColor' }}>
                      LinkedIn
                    </a>
                  )}
                </div>
              </div>
            </CyberCard>
          ))
        ) : (
          <p className={styles.noData}>{locale === 'en' ? 'No team members found.' : 'لا يوجد أعضاء فريق.'}</p>
        )}
      </div>
    </div>
  );
}
