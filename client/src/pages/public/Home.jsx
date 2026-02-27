import { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import Navbar from '../../components/Navbar';
import Footer from '../../components/Footer';
import { announcementsService, eventsService } from '../../services';
import './Home.css';

/* ── Animated Counter Hook ── */
function useCounter(target, duration = 2000, start = false) {
    const [count, setCount] = useState(0);
    useEffect(() => {
        if (!start) return;
        let startTime = null;
        const step = (timestamp) => {
            if (!startTime) startTime = timestamp;
            const progress = Math.min((timestamp - startTime) / duration, 1);
            const eased = 1 - Math.pow(1 - progress, 3);
            setCount(Math.floor(eased * target));
            if (progress < 1) requestAnimationFrame(step);
        };
        requestAnimationFrame(step);
    }, [target, duration, start]);
    return count;
}

/* ── Stats Counter Card ── */
function StatCard({ number, suffix = '+', label, icon, delay = 0 }) {
    const ref = useRef(null);
    const [visible, setVisible] = useState(false);
    const count = useCounter(number, 2000, visible);

    useEffect(() => {
        const observer = new IntersectionObserver(
            ([entry]) => { if (entry.isIntersecting) setVisible(true); },
            { threshold: 0.3 }
        );
        if (ref.current) observer.observe(ref.current);
        return () => observer.disconnect();
    }, []);

    return (
        <div className="stat-card" ref={ref} style={{ animationDelay: `${delay}ms` }}>
            <div className="stat-icon">{icon}</div>
            <div className="stat-number">
                {visible ? count : 0}{suffix}
            </div>
            <div className="stat-label">{label}</div>
        </div>
    );
}

/* ── Ticker Bar ── */
function TickerBar({ items }) {
    const doubled = [...items, ...items];
    return (
        <div className="ticker-wrap">
            <div className="ticker-label">
                <span>LIVE</span>
            </div>
            <div className="ticker-track">
                <div className="ticker-content">
                    {doubled.map((item, i) => (
                        <span key={i} className="ticker-item">
                            <span className="ticker-dot" />
                            {item}
                        </span>
                    ))}
                </div>
            </div>
        </div>
    );
}

/* ── Event Preview Card ── */
function EventPreviewCard({ event }) {
    const { i18n } = useTranslation();
    const isMr = i18n.language === 'mr';
    const isHi = i18n.language === 'hi';

    const isEvent = event.type === 'event';
    const date = new Date(event.event_date);
    const day = date.getDate();
    const month = date.toLocaleString('default', { month: 'short' }).toUpperCase();

    const title = (isMr && event.title_mr) ? event.title_mr
                : (isHi && event.title_hi) ? event.title_hi
                : event.title;

    const description = (isMr && event.description_mr) ? event.description_mr
                      : (isHi && event.description_hi) ? event.description_hi
                      : event.description;

    return (
        <div className={`ep-card ${isEvent ? 'ep-card--event' : 'ep-card--news'}`}>
            <div className="ep-date">
                <span className="ep-day">{day}</span>
                <span className="ep-month">{month}</span>
            </div>
            <div className="ep-body">
                <span className="ep-tag">{isEvent ? 'Event' : 'News'}</span>
                <h3 className="ep-title">{title}</h3>
                <p className="ep-desc">{description?.substring(0, 80)}...</p>
            </div>
        </div>
    );
}

/* ── Quick Link Card ── */
function QuickLink({ icon, label, desc, to }) {
    return (
        <Link to={to} className="ql-card">
            <div className="ql-icon">{icon}</div>
            <div className="ql-text">
                <span className="ql-label">{label}</span>
                <span className="ql-desc">{desc}</span>
            </div>
            <span className="ql-arrow">→</span>
        </Link>
    );
}

/* ── Helper: convert number to Marathi numerals ── */
function toMarathiNumerals(str) {
    const map = { '0':'०','1':'१','2':'२','3':'३','4':'४','5':'५','6':'६','7':'७','8':'८','9':'९' };
    return String(str).replace(/[0-9]/g, d => map[d]);
}

/* ── Topper Card ── */
function TopperCard({ name, nameMr, score, stream, streamMr, photo, rank }) {
    const { i18n } = useTranslation();
    const isMr = i18n.language === 'mr';

    const displayName   = (isMr && nameMr)   ? nameMr   : name;
    const displayStream = (isMr && streamMr)  ? streamMr : stream;
    const displayScore  = isMr ? toMarathiNumerals(score) : score;
    const displayRank   = isMr ? toMarathiNumerals(rank)  : rank;

    return (
        <div className="topper-card">
            {rank === 1 && <div className="topper-crown">👑</div>}
            <div className="topper-photo-wrap">
                <img
                    src={photo}
                    alt={displayName}
                    className="topper-photo"
                    onError={e => {
                        e.target.src = `https://ui-avatars.com/api/?name=${encodeURIComponent(name)}&size=200&background=1d4ed8&color=fff&bold=true&font-size=0.4`;
                    }}
                />
                {rank <= 3 && (
                    <div className={`topper-rank rank-${rank}`}>#{displayRank}</div>
                )}
            </div>
            <h4 className="topper-name">{displayName}</h4>
            {stream && <p className="topper-stream">{displayStream}</p>}
            <div className="topper-score">{displayScore}%</div>
        </div>
    );
}

/* ── Mock Events with Marathi ── */
const MOCK_HOME_EVENTS = [
    {
        id: 1, type: 'event', event_date: '2026-03-15',
        title: 'Annual Sports Day 2026',
        title_mr: 'वार्षिक क्रीडा दिन २०२६',
        description: 'Inter-house competitions, athletics, and grand prize ceremony.',
        description_mr: 'आंतर-गृह स्पर्धा, क्रीडा प्रकार आणि भव्य बक्षीस समारंभ.',
    },
    {
        id: 2, type: 'event', event_date: '2026-03-28',
        title: 'Inter-School Debate',
        title_mr: 'आंतरशालेय वाद-विवाद',
        description: 'District-level debate competition, students from 20+ schools.',
        description_mr: 'जिल्हास्तरीय वाद-विवाद स्पर्धा, २०+ शाळांचे विद्यार्थी.',
    },
    {
        id: 3, type: 'news', event_date: '2026-06-01',
        title: 'Admissions Open 2026-27',
        title_mr: 'प्रवेश उघडे २०२६-२७',
        description: 'New academic session begins. Applications open for all standards.',
        description_mr: 'नवीन शैक्षणिक सत्र सुरू. सर्व इयत्तांसाठी अर्ज उघडे.',
    },
];

/* ══════════════════════════════
   MAIN HOME COMPONENT
══════════════════════════════ */
export default function Home() {
    const { t, i18n } = useTranslation();
    const isMr = i18n.language === 'mr';

    const [announcements, setAnnouncements] = useState([]);
    const [events, setEvents] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        Promise.all([
            announcementsService.getActive(),
            eventsService.getAll()
        ]).then(([annRes, evRes]) => {
            setAnnouncements(annRes.data || []);
            setEvents(evRes.data?.slice(0, 3) || []);
        }).catch(console.error)
          .finally(() => setLoading(false));
    }, []);

    const tickerItems = announcements.length > 0
        ? announcements.map(a => a.title)
        : [
            t('home.hero.badge'),
            'Scholarship Form Available — Apply Before 31st March',
            'Annual Sports Day on 25th March 2026',
            'Board Results 2025: 98.6% Pass Rate',
            'New Computer Lab Inaugurated',
            'Inter-School Debate Competition — Register Now',
          ];

    const quickLinks = [
        { icon: '📋', label: t('home.quickLinks.admission'),  desc: t('home.quickLinks.admissionDesc'),  to: '/admission' },
        { icon: '📅', label: t('home.quickLinks.calendar'),   desc: t('home.quickLinks.calendarDesc'),   to: '/events' },
        { icon: '👨‍🏫', label: t('home.quickLinks.faculty'),    desc: t('home.quickLinks.facultyDesc'),    to: '/faculty' },
        { icon: '🖼️', label: t('home.quickLinks.gallery'),    desc: t('home.quickLinks.galleryDesc'),    to: '/gallery' },
        { icon: '📰', label: t('home.quickLinks.events'),     desc: t('home.quickLinks.eventsDesc'),     to: '/events' },
        { icon: '📞', label: t('home.quickLinks.contact'),    desc: t('home.quickLinks.contactDesc'),    to: '/contact' },
    ];

    const displayEvents = events.length > 0 ? events : MOCK_HOME_EVENTS;

    return (
        <div className="page">
            <Navbar />

            {/* ── TICKER ── */}
            <TickerBar items={tickerItems} />

            {/* ── HERO ── */}
            <section className="hero">
                <div className="hero-bg-shapes">
                    <div className="hero-shape hero-shape-1" />
                    <div className="hero-shape hero-shape-2" />
                    <div className="hero-shape hero-shape-3" />
                </div>
                <div className="container">
                    <div className="hero-content">
                        <div className="hero-badge">{t('home.hero.badge')}</div>
                        <h1 className="hero-title">{t('home.welcome')}</h1>
                        <p className="hero-subtitle">{t('home.hero.subtitle')}</p>
                        <div className="hero-actions">
                            <Link to="/admission" className="btn-hero-primary">
                                {t('home.hero.applyBtn')}
                                <span className="btn-arrow">→</span>
                            </Link>
                            <Link to="/about" className="btn-hero-outline">
                                {t('home.hero.exploreBtn')}
                            </Link>
                        </div>
                        <div className="hero-stats-mini">
                            <div className="hero-stat"><strong>25+</strong><span>{t('home.hero.years')}</span></div>
                            <div className="hero-divider" />
                            <div className="hero-stat"><strong>1200+</strong><span>{t('home.hero.students')}</span></div>
                            <div className="hero-divider" />
                            <div className="hero-stat"><strong>98.6%</strong><span>{t('home.hero.results')}</span></div>
                        </div>
                    </div>
                </div>
                <div className="hero-scroll-hint">
                    <div className="scroll-mouse"><div className="scroll-dot" /></div>
                </div>
            </section>

            {/* ── STATS COUNTER ── */}
            <section className="stats-section">
                <div className="stats-bg-pattern" />
                <div className="container">
                    <div className="stats-grid">
                        <StatCard number={1200} suffix="+" label={t('home.stats.students')} icon="🎓" delay={0} />
                        <StatCard number={75}   suffix="+" label={t('home.stats.faculty')}  icon="👩‍🏫" delay={100} />
                        <StatCard number={25}   suffix="+" label={t('home.stats.awards')}   icon="🏆" delay={200} />
                        <StatCard number={30}   suffix="+" label={t('home.stats.years')}    icon="⭐" delay={300} />
                    </div>
                </div>
            </section>

            {/* ── QUICK LINKS ── */}
            <section className="section ql-section">
                <div className="container">
                    <div className="home-section-header">
                        <h2 className="home-section-title">{t('home.quickAccessTitle')}</h2>
                        <p className="home-section-sub">{t('home.quickAccessSub')}</p>
                    </div>
                    <div className="ql-grid">
                        {quickLinks.map((ql, i) => (
                            <QuickLink key={i} {...ql} />
                        ))}
                    </div>
                </div>
            </section>

            {/* ── UPCOMING EVENTS ── */}
            <section className="section ev-preview-section">
                <div className="container">
                    <div className="home-section-header-row">
                        <div>
                            <h2 className="home-section-title">{t('home.upcomingEvents')}</h2>
                            <p className="home-section-sub">{t('home.upcomingEventsSub')}</p>
                        </div>
                        <Link to="/events" className="view-all-btn">{t('home.viewAll2')}</Link>
                    </div>
                    {loading ? (
                        <div className="loading-container"><div className="spinner" /></div>
                    ) : (
                        <div className="ep-grid">
                            {displayEvents.map(ev => <EventPreviewCard key={ev.id} event={ev} />)}
                        </div>
                    )}
                </div>
            </section>

            {/* ── TOPPERS ── */}
            <section className="section toppers-section">
                <div className="container">
                    <div className="home-section-header">
                        <h2 className="home-section-title">{t('home.toppersTitle')}</h2>
                        <p className="home-section-sub">{t('home.toppersSub')}</p>
                    </div>
                    <div className="toppers-wrapper">
                        {/* Class X */}
                        <div className="toppers-group">
                            <div className="toppers-group-label">
                                {isMr ? 'इयत्ता दहावी' : 'Class X'}
                            </div>
                            <div className="toppers-row">
                                <TopperCard rank={1} name="Akshara Jaisingpure" nameMr="अक्षरा जैसिंगपुरे" score="98.0" photo="http://localhost:5000/uploads/akshara_image.jpg" />
                                <TopperCard rank={2} name="Atharva Kale"        nameMr="अथर्व काळे"         score="96.4" photo="http://localhost:5000/uploads/atharva_image.jpg" />
                                <TopperCard rank={3} name="Manaswa Gadhave"     nameMr="मानस्वा गाढवे"      score="95.8" photo="http://localhost:5000/uploads/manaswa_image.jpg" />
                            </div>
                        </div>
                        <div className="toppers-divider" />
                        {/* Class XII */}
                        <div className="toppers-group">
                            <div className="toppers-group-label">
                                {isMr ? 'इयत्ता बारावी' : 'Class XII'}
                            </div>
                            <div className="toppers-row">
                                <TopperCard rank={1} name="Siddhi Wattamwar" nameMr="सिद्धी वट्टमवार" score="83.20" stream="Science"  streamMr="विज्ञान"   photo="http://localhost:5000/uploads/siddhi.jpg" />
                                <TopperCard rank={2} name="Tanishka Yadav"   nameMr="तनिष्का यादव"    score="82.6"  stream="Science"  streamMr="विज्ञान"   photo="http://localhost:5000/uploads/tanishka.jpg" />
                                <TopperCard rank={3} name="Mayank Ramapure"  nameMr="मयंक रामापुरे"   score="81.0"  stream="Commerce" streamMr="वाणिज्य"  photo="http://localhost:5000/uploads/mayank.jpg" />
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* ── ADMISSION CTA ── */}
            <section className="cta-section">
                <div className="cta-bg-shapes">
                    <div className="cta-shape-1" />
                    <div className="cta-shape-2" />
                </div>
                <div className="container">
                    <div className="cta-content">
                        <div className="cta-badge">{t('home.admissionOpen')}</div>
                        <h2 className="cta-title">{t('home.ctaTitle')}</h2>
                        <p className="cta-desc">{t('home.ctaDesc')}</p>
                        <div className="cta-actions">
                            <Link to="/admission" className="cta-btn-primary">{t('home.applyNowBtn')}</Link>
                            <Link to="/contact"   className="cta-btn-outline">{t('home.contactAdmission')}</Link>
                        </div>
                        <div className="cta-note">{t('home.ctaNote')}</div>
                    </div>
                </div>
            </section>

            {/* ── PRINCIPAL MESSAGE TEASER ── */}
            <section className="section principal-teaser-section">
                <div className="container">
                    <div className="principal-teaser">
                        <div className="principal-teaser-photo">
                            <img
                                src="http://localhost:5000/uploads/principal.jpg"
                                alt="Principal"
                                onError={e => {
                                    e.target.style.display = 'none';
                                    e.target.nextSibling.style.display = 'flex';
                                }}
                            />
                            <div className="principal-avatar-fallback" style={{ display: 'none' }}>
                                <span>👨‍🏫</span>
                            </div>
                        </div>
                        <div className="principal-teaser-content">
                            <div className="principal-teaser-quote">"</div>
                            <p className="principal-teaser-text">
                                {t('about.principal.message')}
                            </p>
                            <div className="principal-teaser-sig">
                                <strong>{t('about.principal.name')}, {t('about.principal.title')}</strong>
                                <span></span>
                            </div>
                            <Link to="/about" className="principal-teaser-link">{t('home.readFullMessage')}</Link>
                        </div>
                    </div>
                </div>
            </section>

        </div>
    );
}