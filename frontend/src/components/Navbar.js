'use client';
import Link from 'next/link';
import { useParams, useRouter, usePathname } from 'next/navigation';
import styles from './Navbar.module.css';

export default function Navbar() {
  const params = useParams();
  const router = useRouter();
  const pathname = usePathname();
  const locale = params?.locale || 'en';

  const toggleLanguage = () => {
    const nextLocale = locale === 'en' ? 'ar' : 'en';
    const newPath = pathname.replace(`/${locale}`, `/${nextLocale}`);
    router.push(newPath || `/${nextLocale}`);
  };

  const navLinks = [
    { href: '', label: locale === 'en' ? 'Home' : 'الرئيسية' },
    { href: '/about', label: locale === 'en' ? 'About' : 'حول' },
    { href: '/concept', label: locale === 'en' ? 'Concept' : 'المفهوم' },
    { href: '/timeline', label: locale === 'en' ? 'Journey' : 'الرحلة' },
    { href: '/team', label: locale === 'en' ? 'Team' : 'الفريق' },
    { href: '/gallery', label: locale === 'en' ? 'Gallery' : 'المعرض' },
    { href: '/media', label: locale === 'en' ? 'Media' : 'الإعلام' },
    { href: '/sponsors', label: locale === 'en' ? 'Sponsors' : 'الرعاة' },
    { href: '/contact', label: locale === 'en' ? 'Contact' : 'تواصل معنا' },
  ];

  return (
    <nav className={styles.nav} dir={locale === 'ar' ? 'rtl' : 'ltr'}>
      <div className={styles.logo}>
        <Link href={`/${locale}`}>HACK & ESCAPE</Link>
      </div>
      <div className={styles.links}>
        {navLinks.map((link) => (
          <Link key={link.href} href={`/${locale}${link.href}`}>
            {link.label}
          </Link>
        ))}
        <button onClick={toggleLanguage} className={styles.langSwitch}>
          {locale === 'en' ? 'AR' : 'EN'}
        </button>
      </div>
    </nav>
  );
}
