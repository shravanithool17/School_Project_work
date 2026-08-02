import { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import Navbar from '../../components/Navbar';
import { eventsService } from '../../services';
import './Events.css';

const MOCK_EVENTS = [
    { id: 1,  title: 'Annual Sports Day 2026',         title_mr: 'वार्षिक क्रीडा दिन २०२६',       description: 'Join us for our annual sports day with inter-house competitions, athletics, team sports, and a grand prize ceremony for all participants.',              description_mr: 'आमच्या वार्षिक क्रीडा दिनात सामील व्हा — आंतर-गृह स्पर्धा, क्रीडा प्रकार आणि भव्य बक्षीस समारंभासह.',              type: 'event', event_date: '2026-03-15', image: null },
    { id: 2,  title: 'Science Exhibition',              title_mr: 'विज्ञान प्रदर्शनी',              description: 'Students showcase their innovative science projects. Parents and guests are invited to witness the next generation of scientists and innovators.',         description_mr: 'विद्यार्थी त्यांचे नाविन्यपूर्ण विज्ञान प्रकल्प सादर करतील. पालक आणि पाहुण्यांना आमंत्रण आहे.',                                                   type: 'event', event_date: '2026-02-20', image: null },
    { id: 3,  title: 'New Academic Session Begins',     title_mr: 'नवीन शैक्षणिक सत्र सुरू',       description: 'The new academic session for 2026–27 starts from June. Admissions open for all standards with updated curriculum and digital learning tools.',            description_mr: '२०२६-२७ चे नवीन शैक्षणिक सत्र जूनपासून सुरू होत आहे. सर्व इयत्तांसाठी प्रवेश उघडे आहेत.',                                                         type: 'news',  event_date: '2026-06-01', image: null },
    { id: 4,  title: 'Cultural Fest – Rang Utsav',      title_mr: 'सांस्कृतिक उत्सव – रंग उत्सव', description: 'Our annual cultural festival celebrating art, music, drama, and dance. Students perform classical and folk arts showcasing Maharashtra\'s rich heritage.', description_mr: 'आमचा वार्षिक सांस्कृतिक उत्सव — कला, संगीत, नाटक आणि नृत्याचा आनंद. महाराष्ट्राचा समृद्ध वारसा सादर होईल.',                                       type: 'event', event_date: '2026-04-10', image: null },
    { id: 5,  title: 'Board Exam Results 2025',         title_mr: 'बोर्ड परीक्षा निकाल २०२५',      description: 'NHS students achieve outstanding results in SSC Board Exams 2025. The school recorded a 98.6% pass rate with 42 students scoring above 90%.',           description_mr: 'NHS विद्यार्थ्यांनी SSC बोर्ड परीक्षेत उत्कृष्ट निकाल मिळवला. शाळेचा उत्तीर्ण दर ९८.६% आणि ४२ विद्यार्थ्यांना ९०% पेक्षा अधिक गुण.',         type: 'news',  event_date: '2025-06-20', image: null },
    { id: 6,  title: 'Inter-School Debate Competition', title_mr: 'आंतरशालेय वाद-विवाद स्पर्धा',  description: 'NHS hosts the District-level Inter-School Debate Competition. Students from 20+ schools compete on topics of national importance.',                       description_mr: 'NHS जिल्हास्तरीय आंतरशालेय वाद-विवाद स्पर्धेचे आयोजन करत आहे. २०+ शाळांचे विद्यार्थी राष्ट्रीय विषयांवर स्पर्धा करतील.',                        type: 'event', event_date: '2026-03-28', image: null },
    { id: 7,  title: 'Republic Day Celebration',        title_mr: 'प्रजासत्ताक दिन सोहळा',        description: 'Grand celebration of Republic Day with cultural programs, flag hoisting ceremony, and parade by NCC cadets. Chief Guest: District Collector.',            description_mr: 'सांस्कृतिक कार्यक्रम, ध्वजारोहण आणि NCC कॅडेट्सच्या संचलनासह प्रजासत्ताक दिनाचा भव्य सोहळा.',                                                   type: 'event', event_date: '2026-01-26', image: null },
    { id: 8,  title: 'School Wins Best School Award',   title_mr: 'शाळेला सर्वोत्तम शाळा पुरस्कार', description: 'Kendriya Vidyalaya Yavatmal awarded the Best School Award by the Education Department for academic excellence and infrastructure development.',             description_mr: 'केंद्रीय विद्यालय यवतमाळला शिक्षण विभागाने शैक्षणिक उत्कृष्टता आणि पायाभूत सुविधांसाठी सर्वोत्तम शाळा पुरस्कार दिला.',                            type: 'news',  event_date: '2026-02-14', image: null },
    { id: 9,  title: 'Parent-Teacher Meeting',          title_mr: 'पालक-शिक्षक बैठक',             description: 'Quarterly parent-teacher meeting to discuss student academic progress, attendance, and upcoming examinations for all standards.',                          description_mr: 'विद्यार्थ्यांची शैक्षणिक प्रगती, उपस्थिती आणि आगामी परीक्षांबाबत त्रैमासिक पालक-शिक्षक बैठक.',                                                     type: 'event', event_date: '2026-04-18', image: null },
    { id: 10, title: 'New Computer Lab Inaugurated',    title_mr: 'नवीन संगणक प्रयोगशाळा उद्घाटन', description: 'State-of-the-art computer lab with 60 workstations and high-speed internet inaugurated to enhance digital learning for all students.',                  description_mr: '६० संगणक आणि हाय-स्पीड इंटरनेटसह अत्याधुनिक संगणक प्रयोगशाळेचे उद्घाटन — डिजिटल शिक्षणासाठी.',                                                  type: 'news',  event_date: '2026-01-15', image: null },
    { id: 11, title: 'Scholarship Examination 2026',    title_mr: 'शिष्यवृत्ती परीक्षा २०२६',     description: 'State scholarship examination for Class 5 and Class 8 students. Special coaching sessions arranged by the school to prepare students effectively.',        description_mr: 'इयत्ता ५ वी आणि ८ वी साठी राज्य शिष्यवृत्ती परीक्षा. शाळेतर्फे विशेष मार्गदर्शन वर्गांचे आयोजन.',                                                  type: 'event', event_date: '2026-02-28', image: null },
    { id: 12, title: 'Tree Plantation Drive',           title_mr: 'वृक्षारोपण उपक्रम',            description: 'Eco club organizes a school-wide tree plantation drive. Students, teachers and parents will plant 500 saplings across the school and nearby areas.',      description_mr: 'इको क्लबतर्फे शाळाव्यापी वृक्षारोपण उपक्रम. विद्यार्थी, शिक्षक आणि पालक मिळून ५०० रोपे लावणार.',                                                   type: 'event', event_date: '2026-06-05', image: null },
];

const EventIcon = () => (
    <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
        <rect x="3" y="4" width="18" height="18" rx="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/>
    </svg>
);
const NewsIcon = () => (
    <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
        <path d="M4 22h16a2 2 0 0 0 2-2V4a2 2 0 0 0-2-2H8a2 2 0 0 0-2 2v16a2 2 0 0 1-2 2Zm0 0a2 2 0 0 1-2-2v-9c0-1.1.9-2 2-2h2"/><line x1="10" y1="7" x2="18" y2="7"/><line x1="10" y1="11" x2="18" y2="11"/><line x1="10" y1="15" x2="14" y2="15"/>
    </svg>
);

function EventCard({ event }) {
    const { t, i18n } = useTranslation();                                          // ✅ i18n add kiya
    const isMr = i18n.language === 'mr';                                           // ✅ language check
    const isHi = i18n.language === 'hi';                                           // ✅ Hindi bhi support

    // ✅ Language ke hisaab se sahi field pick karo
    const title       = (isMr && event.title_mr)       ? event.title_mr
                      : (isHi && event.title_hi)       ? event.title_hi
                      : event.title;

    const description = (isMr && event.description_mr) ? event.description_mr
                      : (isHi && event.description_hi) ? event.description_hi
                      : event.description;

    const isEvent = event.type === 'event';
    const dateObj = new Date(event.event_date);
    const day   = dateObj.getDate();
    const month = dateObj.toLocaleString('default', { month: 'short' }).toUpperCase();
    const year  = dateObj.getFullYear();

    return (
        <div className={`ev-card ${isEvent ? 'ev-card--event' : 'ev-card--news'}`}>
            {event.image ? (
                <div className="ev-card__image">
                    <img src={`/uploads/${event.image}`} alt={title}
                        onError={e => e.target.style.display = 'none'} />
                </div>
            ) : (
                <div className="ev-card__image-placeholder">
                    <div className="ev-card__placeholder-icon">
                        {isEvent ? <EventIcon /> : <NewsIcon />}
                    </div>
                </div>
            )}

            <div className="ev-card__date-badge">
                <span className="ev-card__date-day">{day}</span>
                <span className="ev-card__date-month">{month}</span>
                <span className="ev-card__date-year">{year}</span>
            </div>

            <div className="ev-card__body">
                <span className={`ev-tag ev-tag--${event.type}`}>
                    {isEvent ? t('events.eventTag') : t('events.newsTag')}
                </span>
                <h3 className="ev-card__title">{title}</h3>          {/* ✅ title variable */}
                <p className="ev-card__desc">{description}</p>        {/* ✅ description variable */}
                <div className="ev-card__divider" />
                <button className="ev-card__btn">{t('events.readMore')}</button>
            </div>
        </div>
    );
}

function Events() {
    const { t } = useTranslation();
    const [events, setEvents]   = useState([]);
    const [filter, setFilter]   = useState('all');
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchEvents = async () => {
            setLoading(true);
            try {
                const type = filter === 'all' ? null : filter;
                const response = await eventsService.getAll(type);
                setEvents(response.data || []);
            } catch {
                const filtered = filter === 'all'
                    ? MOCK_EVENTS
                    : MOCK_EVENTS.filter(e => e.type === filter);
                setEvents(filtered);
            } finally {
                setLoading(false);
            }
        };
        fetchEvents();
    }, [filter]);

    const tabs = [
        { id: 'all',   label: t('events.all') },
        { id: 'event', label: t('events.events') },
        { id: 'news',  label: t('events.news') },
    ];

    return (
        <div className="page ev-page">
            <Navbar />

            <section className="page-header ev-header">
                <div className="container">
                    <h1>{t('events.title')}</h1>
                    <p>{t('events.pageSubtitle')}</p>
                </div>
            </section>

            <section className="section ev-section">
                <div className="container">
                    <div className="ev-tabs">
                        {tabs.map(tab => (
                            <button
                                key={tab.id}
                                className={`ev-tab ${filter === tab.id ? 'ev-tab--active' : ''}`}
                                onClick={() => setFilter(tab.id)}
                            >
                                {tab.label}
                            </button>
                        ))}
                    </div>

                    <div className="tab-content">
                        {loading ? (
                            <div className="ev-loading">
                                <div className="ev-spinner" />
                                <p>{t('events.loading')}</p>
                            </div>
                        ) : events.length === 0 ? (
                            <div className="ev-empty">
                                <p>{t('events.noData')}</p>
                            </div>
                        ) : (
                            <div className="ev-grid">
                                {events.map(event => (
                                    <EventCard key={event.id} event={event} />
                                ))}
                            </div>
                        )}
                    </div>
                </div>
            </section>
        </div>
    );
}

export default Events;