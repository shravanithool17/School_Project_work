import { Link, useLocation } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { useState, useEffect, useRef } from 'react';
import { useAuth } from '../context/AuthContext';
import LanguageSwitcher from './LanguageSwitcher';
import { Menu, X, ChevronDown, User } from 'lucide-react';
import './Navbar.css';

function Navbar() {
    const { t } = useTranslation();
    const { user, isAuthenticated, logout } = useAuth();
    const [showUserMenu, setShowUserMenu] = useState(false);
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
    const [scrolled, setScrolled] = useState(false);
    const [activeLink, setActiveLink] = useState('/');
    const location = useLocation();
    const userMenuRef = useRef(null);

    // Handle scroll effect
    useEffect(() => {
        const handleScroll = () => {
            setScrolled(window.scrollY > 20);
        };
        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    // Update active link based on location
    useEffect(() => {
        setActiveLink(location.pathname);
        setMobileMenuOpen(false);
    }, [location]);

    // Close user menu on outside click
    useEffect(() => {
        const handleClickOutside = (event) => {
            if (userMenuRef.current && !userMenuRef.current.contains(event.target)) {
                setShowUserMenu(false);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    const handleLogout = () => {
        logout();
        setShowUserMenu(false);
    };

    const navLinks = [
        { path: '/', label: t('nav.home') },
        { path: '/about', label: t('nav.about') },
        { path: '/faculty', label: t('nav.faculty') },
        { path: '/events', label: t('nav.events') },
        { path: '/gallery', label: t('nav.gallery') },
        { path: '/contact', label: t('nav.contact') },
    ];

    return (
        <>
            <nav className={`navbar ${scrolled ? 'navbar-scrolled' : ''} ${mobileMenuOpen ? 'mobile-open' : ''}`}>
                <div className="container">
                    <div className="navbar-container">
                        {/* Logo/Brand */}
                        <div className="navbar-brand">
                            <Link to="/" className="brand-link">
                                <div className="brand-logo">
                                    <div className="logo-icon">KVY</div>
                                </div>
                                <div className="brand-text">
                                    <h1 className="brand-title">Kendriya Vidyalaya Yavatmal</h1>
                                    <p className="brand-subtitle">Yavatmal, Maharashtra</p>
                                </div>
                            </Link>
                        </div>

                        {/* Desktop Navigation */}
                        <div className="navbar-menu">
                            <div className="nav-links">
                                {navLinks.map((link) => (
                                    <Link
                                        key={link.path}
                                        to={link.path}
                                        className={`nav-link ${activeLink === link.path ? 'nav-link-active' : ''}`}
                                    >
                                        <span className="nav-link-text">{link.label}</span>
                                        <span className="nav-link-underline"></span>
                                    </Link>
                                ))}
                            </div>

                            <div className="navbar-actions">
                                {/* Admission CTA */}
                                <Link to="/admission" className="btn btn-primary btn-admission">
                                   
                                    {t('nav.admission')}
                                </Link>

                                {/* Language Switcher */}
                                <div className="language-switcher-wrapper">
                                    <LanguageSwitcher />
                                </div>

                                {/* Authentication */}
                                {isAuthenticated ? (
                                    <div className="user-menu-container" ref={userMenuRef}>
                                        <button
                                            className="user-menu-trigger"
                                            onClick={() => setShowUserMenu(!showUserMenu)}
                                            aria-expanded={showUserMenu}
                                            aria-label="User menu"
                                        >
                                            {user?.profile_picture ? (
                                                <img
                                                    src={`http://localhost:5000/uploads/${user.profile_picture}`}
                                                    alt={user.full_name}
                                                    className="user-avatar"
                                                />
                                            ) : (
                                                <div className="user-avatar-placeholder">
                                                    <User size={20} />
                                                </div>
                                            )}
                                            <span className="user-name">{user?.full_name}</span>
                                            <ChevronDown size={16} className={`dropdown-icon ${showUserMenu ? 'rotate-180' : ''}`} />
                                        </button>

                                        {showUserMenu && (
                                            <div className="user-dropdown">
                                                <div className="dropdown-header">
                                                    <p className="user-email">{user?.email}</p>
                                                </div>
                                                <Link 
                                                    to="/profile" 
                                                    className="dropdown-item"
                                                    onClick={() => setShowUserMenu(false)}
                                                >
                                                    <User size={16} />
                                                    <span>My Profile</span>
                                                </Link>
                                                <button 
                                                    onClick={handleLogout} 
                                                    className="dropdown-item dropdown-item-logout"
                                                >
                                                    <span>Logout</span>
                                                </button>
                                            </div>
                                        )}
                                    </div>
                                ) : (
                                    <div className="auth-buttons">
                                        <Link to="/login" className="btn btn-outline">
                                            Sign In
                                        </Link>
                                        <Link to="/signup" className="btn btn-primary">
                                            Sign Up
                                        </Link>
                                    </div>
                                )}
                            </div>
                        </div>

                        {/* Mobile Menu Toggle */}
                        <button 
                            className="mobile-menu-toggle"
                            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                            aria-label="Toggle menu"
                        >
                            {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
                        </button>
                    </div>
                </div>

                {/* Mobile Menu */}
                <div className={`mobile-menu ${mobileMenuOpen ? 'mobile-menu-open' : ''}`}>
                    <div className="mobile-menu-content">
                        <div className="mobile-nav-links">
                            {navLinks.map((link) => (
                                <Link
                                    key={link.path}
                                    to={link.path}
                                    className={`mobile-nav-link ${activeLink === link.path ? 'mobile-nav-link-active' : ''}`}
                                    onClick={() => setMobileMenuOpen(false)}
                                >
                                    {link.label}
                                </Link>
                            ))}
                            <Link 
                                to="/admission" 
                                className="mobile-nav-link mobile-nav-link-admission"
                                onClick={() => setMobileMenuOpen(false)}
                            >
                                {t('nav.admission')}
                            </Link>
                        </div>

                        {isAuthenticated ? (
                            <div className="mobile-user-section">
                                <div className="mobile-user-info">
                                    {user?.profile_picture ? (
                                        <img
                                            src={`http://localhost:5000/uploads/${user.profile_picture}`}
                                            alt={user.full_name}
                                            className="mobile-user-avatar"
                                        />
                                    ) : (
                                        <div className="mobile-user-avatar-placeholder">
                                            {user?.full_name?.charAt(0).toUpperCase()}
                                        </div>
                                    )}
                                    <div>
                                        <p className="mobile-user-name">{user?.full_name}</p>
                                        <p className="mobile-user-email">{user?.email}</p>
                                    </div>
                                </div>
                                <div className="mobile-user-actions">
                                    <Link to="/profile" className="btn btn-outline btn-mobile" onClick={() => setMobileMenuOpen(false)}>
                                        Profile
                                    </Link>
                                    <button onClick={handleLogout} className="btn btn-primary btn-mobile">
                                        Logout
                                    </button>
                                </div>
                            </div>
                        ) : (
                            <div className="mobile-auth-section">
                                <Link to="/login" className="btn btn-outline btn-mobile" onClick={() => setMobileMenuOpen(false)}>
                                    Sign In
                                </Link>
                                <Link to="/signup" className="btn btn-primary btn-mobile" onClick={() => setMobileMenuOpen(false)}>
                                    Sign Up
                                </Link>
                            </div>
                        )}

                        <div className="mobile-language-switcher">
                            <LanguageSwitcher />
                        </div>
                    </div>
                </div>
            </nav>

            {/* <div className="announcement-ticker">
    <div className="ticker-content">
        🎉 Admissions Open for 2026-27 | 📚 Annual Day on March 15th | 🏆 Top School Award 2025 | ✨ New Computer Lab Inaugurated
    </div>
</div> */}
            
            {/* Overlay for mobile menu */}
            {mobileMenuOpen && (
                <div className="mobile-menu-overlay" onClick={() => setMobileMenuOpen(false)} />
            )}
        </>
    );
}

export default Navbar;