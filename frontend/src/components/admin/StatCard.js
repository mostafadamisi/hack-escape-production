'use client';
import styles from './StatCard.module.css';

export default function StatCard({ label, value, trend, icon: Icon }) {
    return (
        <div className={styles.card}>
            <div className={styles.glow}></div>
            <div className={styles.content}>
                <div className="flex justify-between items-start mb-4">
                    <div className={styles.label}>{label}</div>
                    {Icon && <Icon className={styles.icon} />}
                </div>
                <div className={styles.value}>{value}</div>
                {trend && (
                    <div className={`${styles.trend} ${trend.startsWith('+') ? styles.up : styles.down}`}>
                        {trend} vs last_period
                    </div>
                )}
            </div>
            <div className={styles.scanner}></div>
        </div>
    );
}
