'use client';
import { useState, use } from 'react';
import styles from '../register.module.css'; // Reuse styles

export default function TeamRegisterPage({ params }) {
  const { locale } = use(params);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    teamName: '',
    university: '',
    message: ''
  });
  const [status, setStatus] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setStatus('loading');

    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/inquiries`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...formData,
          type: 'team',
          details: { teamName: formData.teamName, university: formData.university }
        })
      });

      if (res.ok) {
        setStatus('success');
        setFormData({ name: '', email: '', teamName: '', university: '', message: '' });
      } else {
        setStatus('error');
      }
    } catch (err) {
      setStatus('error');
    }
  };

  const t = {
    en: {
      title: "Register Your Team",
      subtitle: "Prepare for the ultimate cyber-escape challenge.",
      teamName: "Team Name",
      captain: "Captain Name",
      email: "Captain Email",
      university: "University / Institute",
      message: "Why do you want to join?",
      submit: "Submit Registration",
      success: "Registration Sent. We'll notify you about the qualifiers.",
      error: "Error sending registration."
    },
    ar: {
      title: "سجل فريقك",
      subtitle: "استعد لتحدي الهروب السيبراني النهائي.",
      teamName: "اسم الفريق",
      captain: "اسم القائد",
      email: "البريد الإلكتروني للقائد",
      university: "الجامعة / المعهد",
      message: "لماذا تريد الانضمام؟",
      submit: "إرسال التسجيل",
      success: "تم إرسال التسجيل. سنقوم بإبلاغكم بمواعيد التصفيات.",
      error: "خطأ في إرسال التسجيل."
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
            <label>{t.teamName}</label>
            <input
              type="text"
              required
              value={formData.teamName}
              onChange={(e) => setFormData({ ...formData, teamName: e.target.value })}
              placeholder="Team Alpha"
            />
          </div>

          <div className={styles.inputGroup}>
            <label>{t.university}</label>
            <input
              type="text"
              required
              value={formData.university}
              onChange={(e) => setFormData({ ...formData, university: e.target.value })}
              placeholder="University of Jordan"
            />
          </div>

          <div className={styles.inputGroup}>
            <label>{t.captain}</label>
            <input
              type="text"
              required
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              placeholder="Leader Name"
            />
          </div>

          <div className={styles.inputGroup}>
            <label>{t.email}</label>
            <input
              type="email"
              required
              value={formData.email}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              placeholder="captain@uni.edu"
            />
          </div>

          <div className={styles.inputGroup}>
            <label>{t.message}</label>
            <textarea
              rows="3"
              value={formData.message}
              onChange={(e) => setFormData({ ...formData, message: e.target.value })}
              placeholder="Optional message..."
            ></textarea>
          </div>

          <button type="submit" className={styles.submitBtn} disabled={status === 'loading'}>
            {status === 'loading' ? 'Processing...' : t.submit}
          </button>

          {status === 'success' && <p className={styles.success}>{t.success}</p>}
          {status === 'error' && <p className={styles.error}>{t.error}</p>}
        </form>
      </div>
    </div>
  );
}
