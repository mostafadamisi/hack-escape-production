'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useParams, useRouter, usePathname } from 'next/navigation';
import { MdMenu, MdClose } from 'react-icons/md';
import styles from './Navbar.module.css';

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const params = useParams();
  const router = useRouter();
  const pathname = usePathname();
  const locale = params?.locale || 'en';

  const toggleLanguage = () => {
    const nextLocale = locale === 'en' ? 'ar' : 'en';
    const newPath = pathname.replace(`/${locale}`, `/${nextLocale}`);
    router.push(newPath || `/${nextLocale}`);
    setIsOpen(false);
  };

  const toggleMenu = () => setIsOpen(!isOpen);

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
        <Link href={`/${locale}`} onClick={() => setIsOpen(false)}>HACK & ESCAPE</Link>
      </div>

      <button className={styles.mobileToggle} onClick={toggleMenu} aria-label="Toggle Menu">
        {isOpen ? <MdClose /> : <MdMenu />}
      </button>

      <div className={`${styles.links} ${isOpen ? styles.linksOpen : ''}`}>
        {navLinks.map((link) => (
          <Link 
            key={link.href} 
            href={`/${locale}${link.href}`}
            onClick={() => setIsOpen(false)}
          >
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
