'use client';
import { useState, use } from 'react';
import styles from '../register.module.css';

export default function SponsorRegisterPage({ params }) {
  const { locale } = use(params);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    companyName: '',
    tierInterest: 'platinum',
    message: ''
  });
  const [status, setStatus] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setStatus('loading');

    try {
      const res = await fetch('/api/inquiries', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...formData,
          type: 'sponsor'
        })
      });

      if (res.ok) {
        setStatus('success');
        setFormData({ name: '', email: '', phone: '', companyName: '', tierInterest: 'platinum', message: '' });
      } else {
        setStatus('error');
      }
    } catch (err) {
      console.error(err);
      setStatus('error');
    }
  };

  const t = {
    en: {
      title: "Become a Partner",
      subtitle: "Join forces with the next generation of cyber talent.",
      company: "Company Name",
      contactName: "Contact Person",
      email: "Corporate Email",
      phone: "Phone Number",
      tier: "Interest Tier",
      message: "Additional Details / Goals",
      submit: "Submit Proposal",
      success: "Your request has been sent successfully. Our team will contact you soon.",
      error: "Something went wrong. Please try again later."
    },
    ar: {
      title: "كن شريكاً",
      subtitle: "انضم إلى قوى الجيل القادم من المواهب السيبرانية.",
      company: "اسم الشركة",
      contactName: "اسم الشخص المسؤول",
      email: "البريد الإلكتروني للشركة",
      phone: "رقم الهاتف",
      tier: "فئة الاهتمام",
      message: "تفاصيل إضافية / أهداف",
      submit: "إرسال المقترح",
      success: "تم إرسال طلبك بنجاح. سيتواصل معك فريقنا قريباً.",
      error: "حدث خطأ ما. يرجى المحاولة مرة أخرى لاحقاً."
    }
  }[locale];

  return (
    <div className={styles.container} dir={locale === 'ar' ? 'rtl' : 'ltr'}>
      <header className={styles.header}>
        <h1 className="glow-text">{t.title}</h1>
        <p className={styles.subtitle}>{t.subtitle}</p>
      </header>

      <div className={styles.formWrapper}>
        <form onSubmit={handleSubmit} className={styles.form}>
          <div className={styles.inputGroup}>
            <label>{t.company} *</label>
            <input
              type="text"
              required
              value={formData.companyName}
              onChange={(e) => setFormData({ ...formData, companyName: e.target.value })}
              placeholder="Tech Corp Inc."
            />
          </div>

          <div className={styles.inputGroup}>
            <label>{t.contactName} *</label>
            <input
              type="text"
              required
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              placeholder="Full Name"
            />
          </div>

          <div className={styles.inputGroup}>
            <label>{t.email} *</label>
            <input
              type="email"
              required
              value={formData.email}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              placeholder="partners@techcorp.com"
            />
          </div>

          <div className={styles.inputGroup}>
            <label>{t.phone} *</label>
            <input
              type="tel"
              required
              style={{ direction: 'ltr' }}
              value={formData.phone}
              onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
              placeholder="+962 7X XXX XXXX"
            />
          </div>

          <div className={styles.inputGroup}>
            <label>{t.tier} *</label>
            <select
              required
              value={formData.tierInterest}
              onChange={(e) => setFormData({ ...formData, tierInterest: e.target.value })}
              className={styles.select}
            >
              <option value="platinum">{locale === 'en' ? 'Platinum' : 'بلاتيني'}</option>
              <option value="gold">{locale === 'en' ? 'Gold' : 'ذهبي'}</option>
              <option value="silver">{locale === 'en' ? 'Silver' : 'فضي'}</option>
              <option value="others">{locale === 'en' ? 'Others' : 'أخرى'}</option>
            </select>
          </div>

          <div className={styles.inputGroup}>
            <label>{t.message} *</label>
            <textarea
              required
              rows="4"
              value={formData.message}
              onChange={(e) => setFormData({ ...formData, message: e.target.value })}
              placeholder={locale === 'en' ? "Tell us about your sponsorship goals..." : "أخبرنا عن أهدافك من الرعاية..."}
            ></textarea>
          </div>

          <button type="submit" className={styles.submitBtn} disabled={status === 'loading'}>
            {status === 'loading' ? (locale === 'en' ? 'Sending...' : 'جاري الإرسال...') : t.submit}
          </button>

          {status === 'success' && <p className={styles.success}>{t.success}</p>}
          {status === 'error' && <p className={styles.error}>{t.error}</p>}
        </form>
      </div>
    </div>
  );
}
