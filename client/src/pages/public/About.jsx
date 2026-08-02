import { useState, useEffect, useRef } from 'react';
import { useTranslation } from 'react-i18next';
import './About.css';

function useInView() {
    const ref = useRef(null);
    const [inView, setInView] = useState(false);
    useEffect(() => {
        const observer = new IntersectionObserver(
            ([entry]) => { if (entry.isIntersecting) { setInView(true); observer.disconnect(); } },
            { threshold: 0.2 }
        );
        if (ref.current) observer.observe(ref.current);
        return () => observer.disconnect();
    }, []);
    return [ref, inView];
}

function About() {
    const { t } = useTranslation();
    const [activeTab, setActiveTab] = useState('overview');
    const [visionRef, visionInView] = useInView();
    const [missionRef, missionInView] = useInView();

    const tabs = [
        { id: 'overview',       label: t('about.tabs.overview') },
        { id: 'infrastructure', label: t('about.tabs.infrastructure') },
        { id: 'activities',     label: t('about.tabs.activities') },
        { id: 'initiatives',    label: t('about.tabs.initiatives') },
    ];

    return (
        <div className="page">
            <section className="page-header">
                <div className="container">
                    <h1>{t('about.title')}</h1>
                    <p>{t('about.visionText')}</p>
                </div>
            </section>

            <section className="section">
                <div className="container">
                    <div className="tabs-container">
                        {tabs.map(tab => (
                            <button
                                key={tab.id}
                                className={`tab-button ${activeTab === tab.id ? 'active' : ''}`}
                                onClick={() => setActiveTab(tab.id)}
                            >
                                {tab.label}
                            </button>
                        ))}
                    </div>

                    <div className="tab-content">
                        {activeTab === 'overview' && (
                            <div className="tab-panel">

                                {/* Vision & Mission */}
                                <div className="overview-hero">
                                    <div
                                        ref={visionRef}
                                        className={`overview-card vision-card vm-slide-left ${visionInView ? 'vm-in-view' : ''}`}
                                    >
                                        <div className="overview-icon">🎓</div>
                                        <h2>{t('about.ourVision')}</h2>
                                        <p>{t('about.visionText')}</p>
                                    </div>
                                    <div
                                        ref={missionRef}
                                        className={`overview-card mission-card vm-slide-right ${missionInView ? 'vm-in-view' : ''}`}
                                    >
                                        <div className="overview-icon">🎯</div>
                                        <h2>{t('about.ourMission')}</h2>
                                        <p>{t('about.missionText')}</p>
                                    </div>
                                </div>

                                {/* Core Values */}
                                <div className="values-section">
                                    <h2 className="section-heading">{t('about.coreValues')}</h2>
                                    <div className="values-grid">
                                        <div className="value-item">
                                            <div className="value-icon">🏆</div>
                                            <h3>{t('about.valuesNames.excellence')}</h3>
                                            <p>{t('about.valuesList.excellence')}</p>
                                        </div>
                                        <div className="value-item">
                                            <div className="value-icon">🤝</div>
                                            <h3>{t('about.valuesNames.integrity')}</h3>
                                            <p>{t('about.valuesList.integrity')}</p>
                                        </div>
                                        <div className="value-item">
                                            <div className="value-icon">💡</div>
                                            <h3>{t('about.valuesNames.innovation')}</h3>
                                            <p>{t('about.valuesList.innovation')}</p>
                                        </div>
                                        <div className="value-item">
                                            <div className="value-icon">🌈</div>
                                            <h3>{t('about.valuesNames.inclusivity')}</h3>
                                            <p>{t('about.valuesList.inclusivity')}</p>
                                        </div>
                                        <div className="value-item">
                                            <div className="value-icon">🌟</div>
                                            <h3>{t('about.valuesNames.community')}</h3>
                                            <p>{t('about.valuesList.community')}</p>
                                        </div>
                                    </div>
                                </div>

                                {/* Principal Message */}
                                <div className="principal-section">
                                    <h2 className="section-heading">{t('about.messageFrom')}</h2>
                                    <div className="principal-card-modern">
                                        <div className="principal-photo">
                                            <img
                                                src="/uploads/realprinci.jpg"
                                                alt={t('about.principal.name')}
                                                style={{ width: '100%', height: '100%', objectFit: 'cover', borderRadius: '50%' }}
                                                onError={(e) => { e.target.style.display = 'none'; }}
                                            />
                                        </div>
                                        <div className="principal-content">
                                            <div className="quote-mark">"</div>
                                            <p className="principal-text">
                                                {t('about.principal.message')}
                                            </p>
                                            <div className="principal-info">
                                                <p className="principal-name">{t('about.principal.name')}</p>
                                                <p className="principal-title">{t('about.principal.title')}</p>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        )}

                        {activeTab === 'infrastructure' && (
                            <div className="tab-panel">
                                <div className="facilities-grid">
                                    <div className="facility-card">
                                        <div className="facility-icon">🏫</div>
                                        <h3>{t('about.infrastructureItems.classrooms')}</h3>
                                        <p>{t('about.infrastructureItems.classroomsDesc')}</p>
                                    </div>
                                    <div className="facility-card">
                                        <div className="facility-icon">🔬</div>
                                        <h3>{t('about.infrastructureItems.scienceLabs')}</h3>
                                        <p>{t('about.infrastructureItems.scienceLabsDesc')}</p>
                                    </div>
                                    <div className="facility-card">
                                        <div className="facility-icon">📚</div>
                                        <h3>{t('about.infrastructureItems.library')}</h3>
                                        <p>{t('about.infrastructureItems.libraryDesc')}</p>
                                    </div>
                                    <div className="facility-card">
                                        <div className="facility-icon">⚽</div>
                                        <h3>{t('about.infrastructureItems.sports')}</h3>
                                        <p>{t('about.infrastructureItems.sportsDesc')}</p>
                                    </div>
                                    <div className="facility-card">
                                        <div className="facility-icon">💻</div>
                                        <h3>{t('about.infrastructureItems.computerLab')}</h3>
                                        <p>{t('about.infrastructureItems.computerLabDesc')}</p>
                                    </div>
                                    <div className="facility-card">
                                        <div className="facility-icon">🎭</div>
                                        <h3>{t('about.infrastructureItems.auditorium')}</h3>
                                        <p>{t('about.infrastructureItems.auditoriumDesc')}</p>
                                    </div>
                                </div>
                            </div>
                        )}

                        {activeTab === 'activities' && (
                            <div className="tab-panel">
                                <div className="activities-grid">
                                    <div className="activity-card">
                                        <div className="activity-icon">🎨</div>
                                        <h3>{t('about.activitiesItems.arts')}</h3>
                                        <p>{t('about.activitiesItems.artsDesc')}</p>
                                    </div>
                                    <div className="activity-card">
                                        <div className="activity-icon">🎵</div>
                                        <h3>{t('about.activitiesItems.music')}</h3>
                                        <p>{t('about.activitiesItems.musicDesc')}</p>
                                    </div>
                                    <div className="activity-card">
                                        <div className="activity-icon">🏆</div>
                                        <h3>{t('about.activitiesItems.sports')}</h3>
                                        <p>{t('about.activitiesItems.sportsDesc')}</p>
                                    </div>
                                    <div className="activity-card">
                                        <div className="activity-icon">🎪</div>
                                        <h3>{t('about.activitiesItems.drama')}</h3>
                                        <p>{t('about.activitiesItems.dramaDesc')}</p>
                                    </div>
                                    <div className="activity-card">
                                        <div className="activity-icon">🔬</div>
                                        <h3>{t('about.activitiesItems.science')}</h3>
                                        <p>{t('about.activitiesItems.scienceDesc')}</p>
                                    </div>
                                    <div className="activity-card">
                                        <div className="activity-icon">🌍</div>
                                        <h3>{t('about.activitiesItems.eco')}</h3>
                                        <p>{t('about.activitiesItems.ecoDesc')}</p>
                                    </div>
                                </div>
                            </div>
                        )}

                        {activeTab === 'initiatives' && (
                            <div className="tab-panel">
                                <div className="initiatives-grid">
                                    <div className="initiative-card">
                                        <div className="initiative-icon">🏫</div>
                                        <h3>{t('about.initiativesItems.pmShri')}</h3>
                                        <p>{t('about.initiativesItems.pmShriDesc')}</p>
                                    </div>
                                    <div className="initiative-card">
                                        <div className="initiative-icon">💡</div>
                                        <h3>{t('about.initiativesItems.skill')}</h3>
                                        <p>{t('about.initiativesItems.skillDesc')}</p>
                                    </div>
                                    <div className="initiative-card">
                                        <div className="initiative-icon">🧭</div>
                                        <h3>{t('about.initiativesItems.guidance')}</h3>
                                        <p>{t('about.initiativesItems.guidanceDesc')}</p>
                                    </div>
                                    <div className="initiative-card">
                                        <div className="initiative-icon">🤝</div>
                                        <h3>{t('about.initiativesItems.community')}</h3>
                                        <p>{t('about.initiativesItems.communityDesc')}</p>
                                    </div>
                                    <div className="initiative-card">
                                        <div className="initiative-icon">📖</div>
                                        <h3>{t('about.initiativesItems.vidyanjali')}</h3>
                                        <p>{t('about.initiativesItems.vidyanjaliDesc')}</p>
                                    </div>
                                    <div className="initiative-card">
                                        <div className="initiative-icon">📝</div>
                                        <h3>{t('about.initiativesItems.publication')}</h3>
                                        <p>{t('about.initiativesItems.publicationDesc')}</p>
                                    </div>
                                    <div className="initiative-card">
                                        <div className="initiative-icon">📰</div>
                                        <h3>{t('about.initiativesItems.newsletter')}</h3>
                                        <p>{t('about.initiativesItems.newsletterDesc')}</p>
                                    </div>
                                    <div className="initiative-card">
                                        <div className="initiative-icon">📚</div>
                                        <h3>{t('about.initiativesItems.patrika')}</h3>
                                        <p>{t('about.initiativesItems.patrikaDesc')}</p>
                                    </div>
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            </section>
        </div>
    );
}

export default About;