'use client';
import { use } from 'react';
import styles from './contact.module.css';
import Link from 'next/link';
import { 
  FaInstagram, 
  FaLinkedin, 
  FaEnvelope, 
  FaPhoneAlt,
  FaUserTie
} from 'react-icons/fa';

export default function ContactPage({ params }) {
  const { locale } = use(params);

  const t = {
    en: {
      title: "Contact Jordan Cyber Club",
      subtitle: "Reach out to collaborate, sponsor, or learn more.",
      instagram: "Instagram",
      linkedin: "LinkedIn",
      email: "Email Address",
      pr: "Public Relations – Rahma Al-Dous",
      ceo: "CEO – Ayham Khamees",
      footerTitle: "We’d love to hear from you",
      sponsorBtn: "Become a Sponsor"
    },
    ar: {
      title: "تواصل مع نادي الأردن للسايبر",
      subtitle: "تواصل معنا للتعاون، الرعاية، أو لمعرفة المزيد.",
      instagram: "إنستغرام",
      linkedin: "لينكد إن",
      email: "البريد الإلكتروني",
      pr: "العلاقات العامة – رحمة الدوس",
      ceo: "المدير التنفيذي – أيهم خميس",
      footerTitle: "يسعدنا دائماً سماع رأيك",
      sponsorBtn: "كن شريكاً"
    }
  }[locale];

  const contactItems = [
    {
      id: 1,
      label: t.instagram,
      value: "@jo_cyber_club",
      link: "https://www.instagram.com/jo_cyber_club?igsh=aDZ3MXA1aXJsdGc4",
      icon: <FaInstagram />,
      external: true
    },
    {
      id: 2,
      label: t.linkedin,
      value: "Jordan Cyber Club",
      link: "https://www.linkedin.com/company/jordan-cyber-club/",
      icon: <FaLinkedin />,
      external: true
    },
    {
      id: 3,
      label: t.email,
      value: "official@jordancyberclub.com",
      link: "mailto:official@jordancyberclub.com",
      icon: <FaEnvelope />,
      external: false
    },
    {
      id: 4,
      label: t.pr,
      value: "+962 7 9552 9380",
      link: "tel:+962795529380",
      icon: <FaUserTie />,
      external: false
    },
    {
      id: 5,
      label: t.ceo,
      value: "+962 7 7069 2682",
      link: "tel:+962770692682",
      icon: <FaPhoneAlt />,
      external: false
    }
  ];

  return (
    <div className={styles.container} dir={locale === 'ar' ? 'rtl' : 'ltr'}>
      <header className={styles.header}>
        <h1 className="glow-text">{t.title}</h1>
        <p className={styles.subtitle}>{t.subtitle}</p>
      </header>

      <div className={styles.cardGrid}>
        {contactItems.map((item) => (
          <a
            key={item.id}
            href={item.link}
            target={item.external ? "_blank" : undefined}
            rel={item.external ? "noopener noreferrer" : undefined}
            className={`${styles.contactLink} ${item.id === 5 ? styles.ceoCard : ''}`}
          >
            <div className={styles.cardWrapper}>
              <div className={styles.iconBox}>
                {item.icon}
              </div>
              <div className={styles.info}>
                <span className={styles.label}>{item.label}</span>
                <span className={`${styles.value} mono`}>{item.value}</span>
              </div>
            </div>
          </a>
        ))}
      </div>

      <section className={styles.footerSection}>
        <h2 className="glow-text">{t.footerTitle}</h2>
        <Link href={`/${locale}/register/sponsor`} className={styles.sponsorBtn}>
          {t.sponsorBtn}
        </Link>
      </section>
    </div>
  );
}
