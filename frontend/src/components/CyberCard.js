import styles from './CyberCard.module.css';

export default function CyberCard({ children, title, subtitle, variant = 'primary', className = '' }) {
  return (
    <div className={`${styles.card} ${styles[variant]} ${className}`}>
      <div className={styles.noise}></div>
      <div className={styles.scanlines}></div>
      <div className={styles.corner_tl}></div>
      <div className={styles.corner_tr}></div>
      <div className={styles.corner_bl}></div>
      <div className={styles.corner_br}></div>
      <div className={styles.glow}></div>
      <div className={styles.content}>
        {title && <h3 className={styles.title}>{title}</h3>}
        {subtitle && <p className={styles.subtitle}>{subtitle}</p>}
        <div className={styles.body}>
          {children}
        </div>
      </div>
    </div>
  );
}
