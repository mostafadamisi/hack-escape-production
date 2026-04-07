import styles from "./media.module.css";
import CyberCard from "@/components/CyberCard";
import { fetchData } from "@/lib/api";

export default async function MediaPage({ params }) {
  const { locale } = await params;
  const articles = await fetchData('media', locale);

  const t = {
    en: { title: "Media Artifacts", subtitle: "Official reports and intelligence mentions.", noData: "No recent signal detected." },
    ar: { title: "الأرشيف الإعلامي", subtitle: "التقارير الرسمية والإشارات الإعلامية.", noData: "لم يتم اكتشاف إشارات حديثة." }
  }[locale];

  return (
    <div className={styles.container} dir={locale === 'ar' ? 'rtl' : 'ltr'}>
      <header className={styles.header}>
        <h1 className="glow-text">{t.title}</h1>
        <p className={styles.subtitle}>{t.subtitle}</p>
      </header>

      <div className={styles.grid}>
        {articles && articles.length > 0 ? (
          articles.map((article, index) => (
            <a 
              key={article._id} 
              href={article.link} 
              target="_blank" 
              rel="noopener noreferrer" 
              className={styles.cardWrapper}
              style={{ '--index': index }}
            >
              <CyberCard variant="secondary">
                <div className={styles.articleBody}>
                  <div className={styles.sourceTag}>{article.sourceName}</div>
                  <h3 className={styles.articleTitle}>
                    {article.title?.[locale] || article.title?.en || (typeof article.title === 'string' ? article.title : '')}
                  </h3>
                  <div className={styles.footer}>
                    <span className={styles.date}>
                      {article.date ? new Date(article.date).toLocaleDateString(locale, { year: 'numeric', month: 'long', day: 'numeric' }) : ''}
                    </span>
                    <span className={styles.readMore}>
                      {locale === 'en' ? 'Decrypt Full Report →' : 'فك كود التقرير ←'}
                    </span>
                  </div>
                </div>
              </CyberCard>
            </a>
          ))
        ) : (
          <p className={styles.noData}>{t.noData}</p>
        )}
      </div>
    </div>
  );
}
