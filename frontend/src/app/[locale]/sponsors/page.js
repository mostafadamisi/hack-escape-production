import styles from "./sponsors.module.css";
import CyberCard from "@/components/CyberCard";
import { fetchData } from "@/lib/api";
import Link from "next/link";

export default async function SponsorsPage({ params }) {
  const { locale } = await params;
  const sponsors = await fetchData('/sponsors', locale) || [];
  const isAr = locale === 'ar';

  const packages = [
    {
      key: 'platinum',
      tier: isAr ? 'البلاتيني' : 'Platinum Partner',
      price: '7,000 JOD',
      variant: 'platinum',
      tagline: isAr
        ? 'أعلى مستويات الشراكة — رؤية لا مثيل لها وحضور تنفيذي'
        : 'The highest level of partnership — unmatched visibility & executive presence',
      categories: [
        {
          label: isAr ? 'الرؤية والعلامة التجارية' : 'Brand Visibility',
          benefits: isAr ? [
            'الشعار في جميع أصول الفعالية — الموقع، المطبوعات، الخلفيات، والاتصالات الرقمية',
            'حضور علامتك التجارية داخل ساحة المنافسة الرئيسية طوال الفعالية',
            'وضع العلامة التجارية على جميع أطقم المشاركين والبضائع الرسمية',
          ] : [
            'Premier logo placement across all event assets — website, printed materials, stage backdrops & digital communications',
            'Exclusive branding inside the main competition arena throughout the event',
            'Brand placement on all participant kits and official event merchandise',
          ]
        },
        {
          label: isAr ? 'الحضور التنفيذي على المسرح' : 'Executive & On-Stage Presence',
          benefits: isAr ? [
            'فرصة لكلمة افتتاحية تنفيذية أو خطاب رئيسي',
            'تمثيل في الصف الأول في جميع الجلسات والحفلات الرئيسية',
          ] : [
            'Reserved opportunity for executive opening remarks or keynote address',
            'Front-row representation at all major event sessions and ceremonies',
          ]
        },
        {
          label: isAr ? 'التسويق والوصول الرقمي' : 'Marketing & Digital Reach',
          benefits: isAr ? [
            'منشورات متعددة مخصصة لإبراز الراعي عبر جميع قنوات التواصل الاجتماعي الرسمية',
            'حضور مميز في جميع مراسلات المشاركين والحضور',
            'رؤية في الحملات قبل الحدث وأثناءه وبعده',
          ] : [
            'Multiple dedicated sponsor spotlight posts across all official social media channels',
            'Featured placement in all participant and attendee communications',
            'Prominent visibility in pre-event, live, and post-event campaign outreach',
          ]
        },
        {
          label: isAr ? 'الشبكات والوصول للمواهب' : 'Networking & Talent Access',
          benefits: isAr ? [
            'وصول مباشر إلى أفضل المواهب في الأمن السيبراني للتجنيد وبناء العلامة التجارية',
            'جناح معروض مميز 6×3 م في موقع المسابقة',
          ] : [
            'Direct access to top cybersecurity talent for recruitment & brand engagement',
            'Premium 6×3 m activated booth space at the competition venue',
          ]
        },
        {
          label: isAr ? 'مزايا حصرية' : 'Exclusive Benefits',
          benefits: isAr ? [
            '6–8 تصاريح VIP مع وصول كامل للفعالية',
            'حصرية الفئة الاختيارية — كن الراعي الوحيد في قطاعك (باتفاق متبادل)',
          ] : [
            '6–8 VIP passes with full event access',
            'Optional category exclusivity — be the sole sponsor in your industry vertical (upon agreement)',
          ]
        },
      ]
    },
    {
      key: 'gold',
      tier: isAr ? 'الذهبي' : 'Gold Partner',
      price: '4,000 JOD',
      variant: 'primary',
      tagline: isAr
        ? 'حضور قوي على أرض الواقع ومشاركة حقيقية مع الجمهور'
        : 'High-impact partnership with strong on-site presence & guaranteed reach',
      categories: [
        {
          label: isAr ? 'الرؤية والعلامة التجارية' : 'Brand Visibility',
          benefits: isAr ? [
            'الشعار في المواد الرئيسية للفعالية، الموقع الرسمي، واتصالات الرعاة',
            'جناح عرض مميز 4×3 م في موقع المسابقة',
          ] : [
            'Prominent logo placement across key event materials, the official website & sponsor communications',
            'Premium 4×3 m branded booth space at the competition venue',
          ]
        },
        {
          label: isAr ? 'الاعتراف على المسرح' : 'On-Stage Recognition',
          benefits: isAr ? [
            'تقديم رسمي خلال حفلتَي الافتتاح والختام',
            'إدراج العلامة التجارية في جميع مقاطع تقدير الرعاة',
          ] : [
            'Formal acknowledgment during both the opening and closing ceremonies',
            'Brand inclusion in all sponsor acknowledgment segments',
          ]
        },
        {
          label: isAr ? 'التسويق والوصول الرقمي' : 'Marketing & Digital Reach',
          benefits: isAr ? [
            '3 منشورات مخصصة مضمونة عبر القنوات الرسمية',
            'وضع العلامة التجارية على أطقم المشاركين وأكياس الهدايا مع مواد ترويجية',
          ] : [
            'Guaranteed 3 dedicated social media mentions across official channels',
            'Brand placement on participant kits and inclusion in event swag bags with promotional materials',
          ]
        },
        {
          label: isAr ? 'الوصول والشبكات' : 'Networking & Access',
          benefits: isAr ? [
            'رؤية بين جمهور متفاعل من الطلاب والمهنيين وعشاق الأمن السيبراني',
            '4–5 تصاريح VIP مع وصول كامل للفعالية',
          ] : [
            'Visibility among an engaged audience of students, professionals & cybersecurity enthusiasts',
            '4–5 VIP passes with full event access',
          ]
        },
      ]
    },
    {
      key: 'silver',
      tier: isAr ? 'الفضي' : 'Silver Partner',
      price: '2,000 JOD',
      variant: 'secondary',
      tagline: isAr
        ? 'شراكة موجهة مع تقدير حقيقي للعلامة التجارية داخل المجتمع'
        : 'Targeted partnership with solid brand recognition within the event community',
      categories: [
        {
          label: isAr ? 'الرؤية والعلامة التجارية' : 'Brand Visibility',
          benefits: isAr ? [
            'الشعار على المطبوعات الرسمية واللافتات',
            'مساحة عرض أو تفعيل للعلامة التجارية 3×2 م في الموقع',
            'الشعار على موقع الفعالية الرسمي وصفحة الرعاة',
          ] : [
            'Logo placement on printed event materials and official signage',
            'Branded 3×2 m display or activation space at the venue',
            'Logo featured on the official event website and sponsor page',
          ]
        },
        {
          label: isAr ? 'الاعتراف على المسرح' : 'On-Stage Recognition',
          benefits: isAr ? [
            'ذكر رسمي خلال حفلة الافتتاح أو الختام',
          ] : [
            'Formal mention during the opening or closing ceremony',
          ]
        },
        {
          label: isAr ? 'التسويق والوصول الرقمي' : 'Marketing & Digital Reach',
          benefits: isAr ? [
            'منشوران مضمونان على وسائل التواصل الاجتماعي',
            'إدراج في مواد تقدير الرعاة الموزعة على جميع الحضور',
          ] : [
            '2 guaranteed social media mentions across official channels',
            'Inclusion in sponsor acknowledgment materials distributed to all attendees',
          ]
        },
        {
          label: isAr ? 'الوصول' : 'Access',
          benefits: isAr ? [
            'تصريحان VIP مع وصول كامل للفعالية',
          ] : [
            '2 VIP passes with full event access',
          ]
        },
      ]
    },
  ];

  const tierSponsors = (key) => sponsors.filter(s => s.tier === key);

  return (
    <div className={styles.container} dir={isAr ? 'rtl' : 'ltr'}>
      <header className={styles.header}>
        <p className={styles.overline}>{isAr ? '// شراكة استراتيجية' : '// STRATEGIC PARTNERSHIP'}</p>
        <h1 className="glow-text">{isAr ? 'باقات الرعاية' : 'Sponsorship Packages'}</h1>
        <p className={styles.subheader}>
          {isAr
            ? 'شارك هاك & إسكيب لتضع علامتك التجارية في طليعة مجتمع الأمن السيبراني في الأردن.'
            : 'Partner with Hack & Escape to position your brand at the forefront of Jordan\'s cybersecurity community.'}
        </p>
      </header>

      <div className={styles.packagesGrid}>
        {packages.map((pkg) => {
          const currentSponsors = tierSponsors(pkg.key);
          return (
            <div key={pkg.key} className={`${styles.packageCard} ${styles[pkg.key]}`}>
              <div className={styles.packageHeader}>
                <div className={styles.tierBadge}>{pkg.tier}</div>
                <div className={styles.price}>{pkg.price}</div>
                <p className={styles.tagline}>{pkg.tagline}</p>
              </div>

              {currentSponsors.length > 0 && (
                <div className={styles.currentSponsors}>
                  <span className={styles.sponsorsLabel}>{isAr ? 'الرعاة الحاليون:' : 'Current Sponsors:'}</span>
                  {currentSponsors.map((s, i) => (
                    <span key={i} className={styles.sponsorName}>{s.name}</span>
                  ))}
                </div>
              )}

              <div className={styles.benefitsSection}>
                {pkg.categories.map((cat, ci) => (
                  <div key={ci} className={styles.benefitCategory}>
                    <h4 className={styles.categoryLabel}>{cat.label}</h4>
                    <ul className={styles.benefitList}>
                      {cat.benefits.map((b, bi) => (
                        <li key={bi}>{b}</li>
                      ))}
                    </ul>
                  </div>
                ))}
              </div>

              <Link href={`/${locale}/contact`} className={`${styles.ctaBtn} ${styles[`cta_${pkg.key}`]}`}>
                {isAr ? `تواصل — باقة ${pkg.tier}` : `Inquire — ${pkg.tier}`}
              </Link>
            </div>
          );
        })}
      </div>

      <div className={styles.customNote}>
        <span className={styles.customIcon}>⚙</span>
        <p>
          {isAr
            ? 'جميع الباقات قابلة للتخصيص. نرحب بجميع أشكال الدعم والشراكات المصممة خصيصاً.'
            : 'All packages are fully customizable. We welcome in-kind support, strategic partnerships, and tailored arrangements.'}
        </p>
        <Link href={`/${locale}/contact`} className={styles.customLink}>
          {isAr ? 'تحدث معنا' : 'Let\'s Talk'}
        </Link>
      </div>
    </div>
  );
}
