import styles from './SponsorMarquee.module.css';

export default function SponsorMarquee({ sponsors }) {
  if (!sponsors || sponsors.length === 0) return null;

  // Double the sponsors array to create a seamless loop
  const displaySponsors = [...sponsors, ...sponsors, ...sponsors];

  return (
    <div className={styles.marqueeContainer}>
      <div className={styles.marqueeTrack}>
        {displaySponsors.map((sponsor, index) => (
          <div key={`${sponsor._id}-${index}`} className={styles.sponsorLogo}>
            <img 
              src={sponsor.image.startsWith('http') ? sponsor.image : `http://127.0.0.1:5000${sponsor.image}`} 
              alt="Sponsor" 
            />
          </div>
        ))}
      </div>
    </div>
  );
}
