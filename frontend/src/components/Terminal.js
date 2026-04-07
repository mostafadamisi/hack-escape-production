'use client';
import { useState, useEffect } from 'react';
import styles from './Terminal.module.css';

export default function Terminal({ locale, logs = [] }) {
  const [displayItems, setDisplayItems] = useState([]);
  const [currentText, setCurrentText] = useState('');
  const [currentIndex, setCurrentIndex] = useState(-1);

  const defaultText = locale === 'en' 
    ? '> Initializing Hack & Escape 2026...\n> System: Online\n> Mission: Building a Cyber-Aware Generation'
    : '> جاري تشغيل Hack & Escape 2026...\n> النظام: متصل\n> المهمة: بناء جيل واعي سيبرانياً';

  useEffect(() => {
    if (logs.length > 0) {
      let currentLogIndex = 0;
      let currentCharIndex = 0;
      let completedLogs = [];
      let isWaiting = false;
      
      const interval = setInterval(() => {
        if (isWaiting) return;

        const currentLog = logs[currentLogIndex];
        if (!currentLog) {
            isWaiting = true;
            setTimeout(() => {
                completedLogs = [];
                setDisplayItems([]);
                setCurrentText('');
                currentLogIndex = 0;
                currentCharIndex = 0;
                setCurrentIndex(-1);
                isWaiting = false;
            }, 3000);
            return;
        }

        setCurrentIndex(currentLogIndex);
        setCurrentText(currentLog.text.slice(0, currentCharIndex));

        currentCharIndex++;
        if (currentCharIndex > currentLog.text.length) {
            completedLogs.push(currentLog);
            setDisplayItems([...completedLogs]);
            setCurrentText('');
            currentLogIndex++;
            currentCharIndex = 0;
        }
      }, 20);

      return () => clearInterval(interval);
    }

    let index = 0;
    const interval = setInterval(() => {
      setCurrentText(defaultText.slice(0, index));
      index++;
      if (index > defaultText.length) clearInterval(interval);
    }, 40);
    return () => clearInterval(interval);
  }, [defaultText, logs]);

  return (
    <div className={styles.terminal}>
      <div className={styles.header}>
        <div className={styles.dot} style={{ backgroundColor: '#ff5f56' }}></div>
        <div className={styles.dot} style={{ backgroundColor: '#ffbd2e' }}></div>
        <div className={styles.dot} style={{ backgroundColor: '#27c93f' }}></div>
        <span className={styles.title}>system_shell — 80x24</span>
      </div>
      <div className={styles.content}>
        {displayItems.map((item, i) => (
          <span key={i} className={`${styles.line} ${styles[item.type] || styles.info}`}>
            {item.text}
          </span>
        ))}
        {currentIndex < logs.length && logs[currentIndex] && (
           <span className={`${styles.line} ${styles[logs[currentIndex].type] || styles.info}`}>
             {currentText}
             <span className={styles.cursor}>_</span>
           </span>
        )}
        {!logs.length && (
            <pre>
                <code>{currentText}</code>
                <span className={styles.cursor}>_</span>
            </pre>
        )}
      </div>
    </div>
  );
}
