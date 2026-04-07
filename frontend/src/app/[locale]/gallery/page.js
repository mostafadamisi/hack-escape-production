import styles from "./gallery.module.css";
import { fetchData } from "@/lib/api";

export default async function GalleryPage({ params }) {
  const { locale } = await params;
  const items = await fetchData('gallery', locale);

  const t = {
    en: { title: "Operational Gallery", subtitle: "Archived captures from the Hack & Escape simulation.", noData: "Gallery records not found." },
    ar: { title: "معرض العمليات", subtitle: "لقطات مؤرشفة من محاكاة Hack & Escape.", noData: "سجلات المعرض غير موجودة." }
  }[locale];

  // Flatten images for a unified grid view, or show as blocks
  const allImages = items?.flatMap(block => {
    // Handle both new "images" array and legacy "image" or "imageUrl" string
    const images = Array.isArray(block.images) ? block.images : (block.image || block.imageUrl ? [block.image || block.imageUrl] : []);
    return images.map(img => ({
      url: img,
      title: block.title,
      category: block.category,
      _id: block._id
    }));
  }) || [];

  return (
    <div className={styles.container} dir={locale === 'ar' ? 'rtl' : 'ltr'}>
      <header className={styles.header}>
        <h1 className="glow-text">{t.title}</h1>
        <p className={styles.subtitle}>{t.subtitle}</p>
      </header>

      <div className={styles.masonry}>
        {allImages.length > 0 ? (
          allImages.map((img, i) => (
            <div key={`${img._id}-${i}`} className={styles.galleryItem}>
              <div className={styles.imageWrapper}>
                <img 
                  src={img.url} 
                  alt={typeof img.title === 'string' ? img.title : (img.title?.[locale] || img.title?.en)} 
                  className={styles.actualImage} 
                />
                <div className={styles.overlay}>
                  <span className={styles.category}>
                    {typeof img.category === 'string' ? img.category : (img.category?.[locale] || img.category?.en || (locale==='en'?'Field Ops':'عمليات ميدانية'))}
                  </span>
                  <h3 className={styles.itemTitle}>
                    {typeof img.title === 'string' ? img.title : (img.title?.[locale] || img.title?.en)}
                  </h3>
                </div>
              </div>
            </div>
          ))
        ) : (
          <div className="py-20 text-center w-full">
             <p className={styles.noData}>{t.noData}</p>
          </div>
        )}
      </div>
    </div>
  );
}
