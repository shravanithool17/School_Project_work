import { useState, useEffect, useRef } from 'react';
import { useTranslation } from 'react-i18next';
import Navbar from '../../components/Navbar';
import './Contact.css';

function useInView(options = {}) {
    const ref = useRef(null);
    const [inView, setInView] = useState(false);
    useEffect(() => {
        const observer = new IntersectionObserver(([entry]) => {
            if (entry.isIntersecting) { setInView(true); observer.disconnect(); }
        }, { threshold: 0.15, ...options });
        if (ref.current) observer.observe(ref.current);
        return () => observer.disconnect();
    }, []);
    return [ref, inView];
}

function AnimatedSection({ children, className = '', delay = 0, direction = 'up' }) {
    const [ref, inView] = useInView();
    return (
        <div
            ref={ref}
            className={`anim-wrapper anim-${direction} ${inView ? 'anim-visible' : ''} ${className}`}
            style={{ transitionDelay: `${delay}ms` }}
        >
            {children}
        </div>
    );
}

function Contact() {
    const { t } = useTranslation();
    const [formData, setFormData] = useState({ name: '', email: '', phone: '', subject: '', message: '' });
    const [submitted, setSubmitted] = useState(false);
    const [loading, setLoading] = useState(false);

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        await new Promise(r => setTimeout(r, 1200));
        setSubmitted(true);
        setLoading(false);
    };

    return (
        <div className="page ct-page">
            <Navbar />

            {/* ── Header ── */}
            <section className="ct-header">
                <div className="ct-header__overlay" />
                <div className="container ct-header__content">
                    <span className="ct-header__eyebrow">{t('contact.reachOut')}</span>
                    <h1 className="ct-header__title">
                        {t('contact.title').split(' ').slice(0, -1).join(' ')} <span>{t('contact.title').split(' ').slice(-1)}</span>
                    </h1>
                    <p className="ct-header__subtitle">{t('contact.subtitle')}</p>
                </div>
                <div className="ct-header__wave">
                    <svg viewBox="0 0 1440 80" preserveAspectRatio="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M0,40 C360,80 1080,0 1440,40 L1440,80 L0,80 Z" fill="#f1f5f9"/>
                    </svg>
                </div>
            </section>

            {/* ── Info + Form ── */}
            <section className="ct-section">
                <div className="container ct-grid">

                    {/* Contact Info Card */}
                    <AnimatedSection direction="left" delay={0}>
                        <div className="ct-card ct-info-card">
                            <h2 className="ct-card__heading">{t('contact.contactInfo')}</h2>
                            <div className="ct-card__divider" />
                            <div className="ct-info-list">
                                <div className="ct-info-item">
                                    <div className="ct-info-icon">📍</div>
                                    <div>
                                        <p className="ct-info-label">{t('contact.addressLabel')}</p>
                                        <p className="ct-info-value">New High School, Station Road,<br />Kolhapur, Maharashtra – 416001</p>
                                    </div>
                                </div>
                                <div className="ct-info-item">
                                    <div className="ct-info-icon">📞</div>
                                    <div>
                                        <p className="ct-info-label">{t('contact.phoneLabel')}</p>
                                        <p className="ct-info-value">+91 0231-2650123</p>
                                    </div>
                                </div>
                                <div className="ct-info-item">
                                    <div className="ct-info-icon">✉️</div>
                                    <div>
                                        <p className="ct-info-label">{t('contact.emailLabel')}</p>
                                        <p className="ct-info-value">info@newhighschool.edu.in</p>
                                    </div>
                                </div>
                                <div className="ct-info-item">
                                    <div className="ct-info-icon">🕐</div>
                                    <div>
                                        <p className="ct-info-label">{t('contact.officeHours')}</p>
                                        <p className="ct-info-value">Mon – Sat: 8:00 AM – 4:00 PM</p>
                                    </div>
                                </div>
                            </div>
                            <div className="ct-social">
                                <p className="ct-social__label">{t('contact.followUs')}</p>
                                <div className="ct-social__links">
                                    <a href="#" className="ct-social__btn" aria-label="Facebook">📘</a>
                                    <a href="#" className="ct-social__btn" aria-label="Instagram">📸</a>
                                    <a href="#" className="ct-social__btn" aria-label="YouTube">▶️</a>
                                </div>
                            </div>
                        </div>
                    </AnimatedSection>

                    {/* Message Form Card */}
                    <AnimatedSection direction="right" delay={100}>
                        <div className="ct-card ct-form-card">
                            <h2 className="ct-card__heading">{t('contact.sendMessage')}</h2>
                            <div className="ct-card__divider" />

                            {submitted ? (
                                <div className="ct-success">
                                    <span className="ct-success__icon">✅</span>
                                    <h3>{t('contact.successTitle')}</h3>
                                    <p>{t('contact.successDesc')}</p>
                                    <button className="ct-btn-primary" onClick={() => { setSubmitted(false); setFormData({ name: '', email: '', phone: '', subject: '', message: '' }); }}>
                                        {t('contact.sendAnother')}
                                    </button>
                                </div>
                            ) : (
                                <form className="ct-form" onSubmit={handleSubmit}>
                                    <div className="ct-form__row">
                                        <div className="ct-form__group">
                                            <label className="ct-form__label">{t('contact.name')} *</label>
                                            <input className="ct-form__input" type="text" name="name" value={formData.name} onChange={handleChange} placeholder={t('contact.namePlaceholder')} required />
                                        </div>
                                        <div className="ct-form__group">
                                            <label className="ct-form__label">{t('contact.email')} *</label>
                                            <input className="ct-form__input" type="email" name="email" value={formData.email} onChange={handleChange} placeholder={t('contact.emailPlaceholder')} required />
                                        </div>
                                    </div>
                                    <div className="ct-form__row">
                                        <div className="ct-form__group">
                                            <label className="ct-form__label">{t('contact.phone')}</label>
                                            <input className="ct-form__input" type="tel" name="phone" value={formData.phone} onChange={handleChange} placeholder={t('contact.phonePlaceholder')} />
                                        </div>
                                        <div className="ct-form__group">
                                            <label className="ct-form__label">{t('contact.subject')} *</label>
                                            <select className="ct-form__input ct-form__select" name="subject" value={formData.subject} onChange={handleChange} required>
                                                <option value="">{t('contact.subjectSelect')}</option>
                                                <option value="admission">{t('contact.subjects.admission')}</option>
                                                <option value="academics">{t('contact.subjects.academics')}</option>
                                                <option value="facilities">{t('contact.subjects.facilities')}</option>
                                                <option value="events">{t('contact.subjects.events')}</option>
                                                <option value="other">{t('contact.subjects.other')}</option>
                                            </select>
                                        </div>
                                    </div>
                                    <div className="ct-form__group">
                                        <label className="ct-form__label">{t('contact.message')} *</label>
                                        <textarea className="ct-form__input ct-form__textarea" name="message" value={formData.message} onChange={handleChange} placeholder={t('contact.messagePlaceholder')} rows={5} required />
                                    </div>
                                    <button type="submit" className="ct-btn-primary" disabled={loading}>
                                        {loading ? <span className="ct-btn-spinner" /> : null}
                                        {loading ? t('contact.sending') : t('contact.send')}
                                    </button>
                                </form>
                            )}
                        </div>
                    </AnimatedSection>
                </div>
            </section>

            {/* ── Map Section ── */}
            <section className="ct-map-section">
                <div className="container">
                    <AnimatedSection direction="up" delay={0}>
                        <div className="ct-map-header">
                            <h2>{t('contact.findUs')}</h2>
                            <p>{t('contact.findUsDesc')}</p>
                        </div>
                    </AnimatedSection>
                    <AnimatedSection direction="up" delay={150}>
                        <div className="ct-map-wrapper">
                            <iframe
                                title="NHS Location"
                                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3821.5!2d74.2432!3d16.7050!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x0%3A0x0!2zMTbCsDQyJzE4LjAiTiA3NMKwMTQnMzUuNiJF!5e0!3m2!1sen!2sin!4v1620000000000!5m2!1sen!2sin"
                                width="100%" height="400"
                                style={{ border: 0 }} allowFullScreen="" loading="lazy" referrerPolicy="no-referrer-when-downgrade"
                            />
                        </div>
                    </AnimatedSection>
                </div>
            </section>
        </div>
    );
}

export default Contact;