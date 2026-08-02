import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { Mail, Phone, MapPin, Clock, Facebook, Twitter, Instagram, Youtube } from 'lucide-react';
import './Footer.css';

function Footer() {
    const { t } = useTranslation();
    const currentYear = new Date().getFullYear();

    const quickLinks = [
        { path: '/about',     label: t('nav.about') },
        { path: '/faculty',   label: t('nav.faculty') },
        { path: '/events',    label: t('nav.events') },
        { path: '/gallery',   label: t('nav.gallery') },
        { path: '/admission', label: t('nav.admission') },
        { path: '/contact',   label: t('nav.contact') },
    ];

    const socialLinks = [
        { icon: <Facebook size={20} />, label: 'Facebook',  url: '#' },
        { icon: <Twitter  size={20} />, label: 'Twitter',   url: '#' },
        { icon: <Instagram size={20}/>, label: 'Instagram', url: '#' },
        { icon: <Youtube  size={20} />, label: 'YouTube',   url: '#' },
    ];

    return (
        <footer className="footer">
            <div className="container">
                <div className="footer-main">

                    {/* Brand */}
                    <div className="footer-section footer-brand">
                        <div className="footer-logo">
                            <div className="footer-logo-icon">KVY</div>
                            <div className="footer-brand-text">
                                <h3 className="footer-school-name">Kendriya Vidyalaya Yavatmal</h3>
                                <p className="footer-school-location">Yavatmal, Maharashtra</p>
                            </div>
                        </div>
                        <p className="footer-description">{t('footer.aboutDesc')}</p>
                        <div className="footer-social">
                            {socialLinks.map((social) => (
                                <a key={social.label} href={social.url} className="social-link" aria-label={social.label} target="_blank" rel="noopener noreferrer">
                                    {social.icon}
                                </a>
                            ))}
                        </div>
                    </div>

                    {/* Quick Links */}
                    <div className="footer-section">
                        <h4 className="footer-heading">{t('footer.quickLinks')}</h4>
                        <nav className="footer-nav">
                            {quickLinks.map((link) => (
                                <Link key={link.path} to={link.path} className="footer-link">{link.label}</Link>
                            ))}
                        </nav>
                    </div>

                    {/* Contact Info */}
                    <div className="footer-section">
                        <h4 className="footer-heading">{t('footer.contactInfo')}</h4>
                        <div className="contact-info">
                            <div className="contact-item">
                                <MapPin size={18} className="contact-icon" />
                                <span>{t('footer.address')}</span>
                            </div>
                            <div className="contact-item">
                                <Phone size={18} className="contact-icon" />
                                <span>{t('footer.phone')}</span>
                            </div>
                            <div className="contact-item">
                                <Mail size={18} className="contact-icon" />
                                <span>{t('footer.email')}</span>
                            </div>
                            <div className="contact-item">
                                <Clock size={18} className="contact-icon" />
                                <span>{t('footer.officeHours')}</span>
                            </div>
                        </div>
                    </div>

                    {/* Newsletter */}
                    <div className="footer-section footer-newsletter">
                        <h4 className="footer-heading">{t('footer.stayUpdated')}</h4>
                        <p className="newsletter-description">{t('footer.newsletterDesc')}</p>
                        <form className="newsletter-form">
                            <input type="email" placeholder={t('footer.emailPlaceholder')} className="newsletter-input" required />
                            <button type="submit" className="btn btn-primary newsletter-btn">
                                {t('footer.subscribe')}
                            </button>
                        </form>
                    </div>
                </div>

                <div className="footer-divider"></div>

                <div className="footer-bottom">
                    <div className="footer-bottom-content">
                        <p className="copyright">
                            © {currentYear} Kendriya Vidyalaya Yavatmal. {t('footer.copyright').split('.').slice(-1)[0]}
                        </p>
                        <div className="footer-legal">
                            <Link to="/privacy" className="legal-link">{t('footer.privacy')}</Link>
                            <span className="legal-separator">•</span>
                            <Link to="/terms" className="legal-link">{t('footer.terms')}</Link>
                            <span className="legal-separator">•</span>
                            <Link to="/sitemap" className="legal-link">{t('footer.sitemap')}</Link>
                        </div>
                    </div>
                </div>
            </div>
        </footer>
    );
}

export default Footer;