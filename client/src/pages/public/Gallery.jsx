import { useState, useEffect, useRef } from 'react';
import { useTranslation } from 'react-i18next';
import { galleryService } from '../../services';
import './Gallery.css';

const MOCK_GALLERY = [
    { id: 1, title: 'Kendriya Vidyalaya Yavatmal Main Building', title_mr: 'केव्ही यवतमाळ मुख्य इमारत व परिसर', category: 'Campus', category_mr: 'परिसर', image_path: 'kv_campus.png' },
    { id: 2, title: 'Annual Sports Day Track & Athletics', title_mr: 'वार्षिक क्रीडा दिन व मैदानी खेळ', category: 'Sports', category_mr: 'क्रीडा', image_path: 'kv_sports_day.png' },
    { id: 3, title: 'Cultural Fest Dance & Celebration', title_mr: 'सांस्कृतिक उत्सव व वार्षिक स्नेहसंमेलन', category: 'Cultural', category_mr: 'सांस्कृतिक', image_path: 'kv_cultural_fest.png' },
    { id: 4, title: 'Science Exhibition & Physics/Chemistry Lab', title_mr: 'विज्ञान प्रदर्शन व प्रयोगशाळा प्रात्यक्षिक', category: 'Science', category_mr: 'विज्ञान', image_path: 'kv_science_lab.png' },
    { id: 5, title: 'School Assembly & Flag Hoisting', title_mr: 'शालेय परिपाठ व ध्वजारोहण', category: 'Events', category_mr: 'कार्यक्रम', image_path: 'kv_campus.png' },
    { id: 6, title: 'Inter-House Sports Tournament', title_mr: 'आंतर-गृह क्रीडा स्पर्धा', category: 'Sports', category_mr: 'क्रीडा', image_path: 'kv_sports_day.png' },
    { id: 7, title: 'Annual Cultural Festival Stage Performance', title_mr: 'वार्षिक सांस्कृतिक मंच सादरीकरण', category: 'Cultural', category_mr: 'सांस्कृतिक', image_path: 'kv_cultural_fest.png' },
    { id: 8, title: 'Student Science Demonstration', title_mr: 'विद्यार्थी विज्ञान प्रात्यक्षिक', category: 'Science', category_mr: 'विज्ञान', image_path: 'kv_science_lab.png' },
];

const MOCK_CATEGORIES = ['Campus', 'Sports', 'Cultural', 'Science', 'Events', 'Activities'];

function Gallery() {
    const { t, i18n } = useTranslation();
    const lang = i18n.language;

    const [images, setImages]               = useState(MOCK_GALLERY);
    const [categories, setCategories]       = useState(MOCK_CATEGORIES);
    const [selectedCategory, setSelectedCategory] = useState('');
    const [loading, setLoading]             = useState(false);
    const [activeIndex, setActiveIndex]     = useState(0);
    const [lightbox, setLightbox]           = useState(null);
    const timerRef = useRef(null);

    useEffect(() => {
        galleryService.getCategories()
            .then(r => setCategories(r.data && r.data.length > 0 ? r.data : MOCK_CATEGORIES))
            .catch(() => setCategories(MOCK_CATEGORIES));
    }, []);

    useEffect(() => {
        setLoading(true);
        galleryService.getAll(selectedCategory || null)
            .then(r => {
                const list = (r.data && r.data.length > 0) 
                    ? r.data 
                    : MOCK_GALLERY.filter(i => !selectedCategory || i.category === selectedCategory);
                setImages(list);
                setActiveIndex(0);
            })
            .catch(() => {
                const list = MOCK_GALLERY.filter(i => !selectedCategory || i.category === selectedCategory);
                setImages(list);
            })
            .finally(() => setLoading(false));
    }, [selectedCategory]);

    useEffect(() => {
        if (images.length < 2) return;
        timerRef.current = setInterval(() => {
            setActiveIndex(p => (p + 1) % images.length);
        }, 5000);
        return () => clearInterval(timerRef.current);
    }, [images.length]);

    useEffect(() => {
        const handler = (e) => {
            if (!lightbox) return;
            const idx = images.findIndex(i => i.id === lightbox.id);
            if (e.key === 'ArrowRight') setLightbox(images[(idx + 1) % images.length]);
            if (e.key === 'ArrowLeft')  setLightbox(images[(idx - 1 + images.length) % images.length]);
            if (e.key === 'Escape')     setLightbox(null);
        };
        window.addEventListener('keydown', handler);
        return () => window.removeEventListener('keydown', handler);
    }, [lightbox, images]);

    const getTitle    = img => (!img ? '' : (lang === 'mr' && img.title_mr)    ? img.title_mr    : img.title);
    const getCategory = img => (!img ? '' : (lang === 'mr' && img.category_mr) ? img.category_mr : img.category);
    const imgSrc      = path => `/uploads/${path}`;

    const goTo   = (i) => { clearInterval(timerRef.current); setActiveIndex(i); };
    const goPrev = () => goTo((activeIndex - 1 + images.length) % images.length);
    const goNext = () => goTo((activeIndex + 1) % images.length);

    return (
        <div className="page">
            <section className="page-header">
                <div className="container">
                    <h1>{t('gallery.title')}</h1>
                    <p>{t('gallery.subtitle')}</p>
                </div>
            </section>

            <section className="section">
                <div className="container">
                    <div className="gallery-filter">
                        <button
                            className={`filter-btn ${selectedCategory === '' ? 'active' : ''}`}
                            onClick={() => setSelectedCategory('')}
                        >
                            {t('gallery.allCategories')}
                        </button>
                        {categories.map(cat => (
                            <button
                                key={cat}
                                className={`filter-btn ${selectedCategory === cat ? 'active' : ''}`}
                                onClick={() => setSelectedCategory(cat)}
                            >
                                {cat}
                            </button>
                        ))}
                    </div>

                    {loading ? (
                        <div className="loading-container"><div className="spinner" /></div>
                    ) : images.length === 0 ? (
                        <div className="no-data"><p>{t('common.noData')}</p></div>
                    ) : (
                        <>
                            <div className="cinematic-slider">
                                <div className="cinematic-counter">
                                    <span className="counter-dot" />
                                    {activeIndex + 1} / {images.length}
                                </div>

                                <div className="cinematic-track" style={{ transform: `translateX(-${activeIndex * 100}%)` }}>
                                    {images.map((img, i) => (
                                        <div
                                            key={img.id}
                                            className={`cinematic-slide ${i === activeIndex ? 'active' : ''}`}
                                            onClick={() => setLightbox(img)}
                                        >
                                            <img
                                                src={imgSrc(img.image_path)}
                                                alt={getTitle(img)}
                                                onError={e => { e.target.src = `https://picsum.photos/seed/${img.id}/1200/600`; }}
                                            />
                                            <div className="cinematic-gradient" />
                                            <div className="cinematic-caption">
                                                <div className="caption-left">
                                                    <div className="slide-number">{String(i + 1).padStart(2, '0')}</div>
                                                    {img.category && <span className="cinematic-badge">{getCategory(img)}</span>}
                                                    <h2 className="cinematic-title">{getTitle(img)}</h2>
                                                    <div className="cinematic-accent" />
                                                </div>
                                                <div className="caption-right">
                                                    <button className="cinematic-view-btn" onClick={e => { e.stopPropagation(); setLightbox(img); }}>
                                                        <span className="view-btn-icon">🔍</span>
                                                        {t('gallery.viewPhoto')}
                                                    </button>
                                                </div>
                                            </div>
                                        </div>
                                    ))}
                                </div>

                                <div className="thumbnail-strip">
                                    <div className="thumbnail-progress" style={{ width: `${((activeIndex + 1) / images.length) * 100}%` }} />
                                </div>

                                <button className="cinematic-arrow cinematic-arrow-left" onClick={goPrev}>&#8249;</button>
                                <button className="cinematic-arrow cinematic-arrow-right" onClick={goNext}>&#8250;</button>

                                <div className="cinematic-dots">
                                    {images.map((_, i) => (
                                        <button key={i} className={`cinematic-dot ${i === activeIndex ? 'active' : ''}`} onClick={() => goTo(i)} />
                                    ))}
                                </div>
                            </div>

                            <div className="gallery-grid-section">
                                <h2 className="grid-title">{t('gallery.allPhotos')}</h2>
                                <div className="grid-title-underline"><span /></div>
                                <div className="gallery-grid">
                                    {images.map(image => (
                                        <div key={image.id} className="gallery-item" onClick={() => setLightbox(image)}>
                                            <img
                                                src={imgSrc(image.image_path)}
                                                alt={getTitle(image)}
                                                onError={e => { e.target.src = `https://picsum.photos/seed/${image.id}/400/300`; }}
                                            />
                                            <div className="gallery-overlay">
                                                <h4>{getTitle(image)}</h4>
                                                {image.category && <span className="badge">{getCategory(image)}</span>}
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </>
                    )}
                </div>
            </section>

            {lightbox && (
                <div className="lightbox-overlay" onClick={() => setLightbox(null)}>
                    <div className="lightbox-box" onClick={e => e.stopPropagation()}>
                        <button className="lb-close" onClick={() => setLightbox(null)}>&#10005;</button>
                        <button className="lb-arrow lb-left" onClick={() => {
                            const idx = images.findIndex(i => i.id === lightbox.id);
                            setLightbox(images[(idx - 1 + images.length) % images.length]);
                        }}>&#8249;</button>
                        <img src={imgSrc(lightbox.image_path)} alt={getTitle(lightbox)} onError={e => { e.target.src = `https://picsum.photos/seed/${lightbox.id}/800/600`; }} />
                        <button className="lb-arrow lb-right" onClick={() => {
                            const idx = images.findIndex(i => i.id === lightbox.id);
                            setLightbox(images[(idx + 1) % images.length]);
                        }}>&#8250;</button>
                        <div className="lb-caption">
                            <p>{getTitle(lightbox)}</p>
                            {lightbox.category && <span>{getCategory(lightbox)}</span>}
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}

export default Gallery;