import { useState, useEffect, useRef } from 'react';
import { useTranslation } from 'react-i18next';
import Navbar from '../../components/Navbar';
import { facultyService } from '../../services';
import './Faculty.css';

import teacher1 from '../../assets/teacher1.jpg';
import teacher2 from '../../assets/teacher2.jpg';
import teacher3 from '../../assets/teacher3.jpg';

const facultyImages = { teacher1, teacher2, teacher3 };

const MOCK_FACULTY = [
    {
        id: 1,
        name: 'Kiran K Mendhe',
        name_mr: 'किरण के. मेंढे',
        designation: 'Principal',
        designation_mr: 'मुख्याध्यापक',
        department: 'Administration',
        department_mr: 'प्रशासन',
        qualification: 'M.Sc., B.Ed., M.Ed.',
        qualification_mr: 'एम.एससी., बी.एड., एम.एड.',
        experience: 25,
        profile_image: 'realprinci.jpg'
    },
    {
        id: 2,
        name: 'Dr. Sunita Patil',
        name_mr: 'डॉ. सुनिता पाटील',
        designation: 'Head of Department',
        designation_mr: 'विभागप्रमुख',
        department: 'Science',
        department_mr: 'विज्ञान',
        qualification: 'Ph.D. in Physics, M.Sc., B.Ed.',
        qualification_mr: 'पीएच.डी., एम.एससी., बी.एड.',
        experience: 18,
        profile_image: 'teacher1.jpg'
    },
    {
        id: 3,
        name: 'Amit Deshmukh',
        name_mr: 'अमित देशमुख',
        designation: 'Senior PGT Teacher',
        designation_mr: 'वरिष्ठ पीजीटी शिक्षक',
        department: 'Mathematics',
        department_mr: 'गणित',
        qualification: 'M.Sc. Mathematics, B.Ed.',
        qualification_mr: 'एम.एससी. गणित, बी.एड.',
        experience: 14,
        profile_image: 'teacher2.jpg'
    },
    {
        id: 4,
        name: 'Anjali Sharma',
        name_mr: 'अंजली शर्मा',
        designation: 'PGT English',
        designation_mr: 'पीजीटी इंग्रजी',
        department: 'Languages',
        department_mr: 'भाषा',
        qualification: 'M.A. English, B.Ed.',
        qualification_mr: 'एम.ए. इंग्रजी, बी.एड.',
        experience: 12,
        profile_image: 'teacher3.jpg'
    },
    {
        id: 5,
        name: 'Baljit Singh',
        name_mr: 'बलजित सिंग',
        designation: 'Physical Education Teacher',
        designation_mr: 'क्रीडा शिक्षक',
        department: 'Sports',
        department_mr: 'क्रीडा',
        qualification: 'M.P.Ed.',
        qualification_mr: 'एम.पी.एड.',
        experience: 10,
        profile_image: 'profile_baljit.jpg'
    },
    {
        id: 6,
        name: 'Manmeet Kaur',
        name_mr: 'मनमीत कौर',
        designation: 'TGT Computer Science',
        designation_mr: 'संगणक शिक्षक',
        department: 'Computer Science',
        department_mr: 'संगणक विज्ञान',
        qualification: 'M.C.A., B.Ed.',
        qualification_mr: 'एम.सी.ए., बी.एड.',
        experience: 9,
        profile_image: 'profile_manmeet.jpg'
    }
];

const getImage = (member, index) => {
    if (member.profile_image) {
        if (member.profile_image.startsWith('http://') || member.profile_image.startsWith('https://')) return member.profile_image;
        return `/uploads/${member.profile_image}`;
    }
    if (member.image_key && facultyImages[member.image_key])
        return facultyImages[member.image_key];
    const keys = ['teacher1', 'teacher2', 'teacher3'];
    if (index < keys.length && facultyImages[keys[index]])
        return facultyImages[keys[index]];
    const colors = ['1d4ed8','10b981','3b82f6','f59e0b','8b5cf6','ec4899','06b6d4','ef4444'];
    const bg = colors[(member.id || index) % colors.length];
    return `https://ui-avatars.com/api/?name=${encodeURIComponent(member.name)}&size=400&background=${bg}&color=fff&bold=true&font-size=0.4`;
};

const VISIBLE = 3;

function FacultyCarousel({ members }) {
    const [index, setIndex] = useState(0);
    const timerRef          = useRef(null);
    const total             = members.length;
    const maxIndex          = Math.max(0, total - VISIBLE);

    const go = (i) => {
        clearInterval(timerRef.current);
        setIndex(Math.max(0, Math.min(i, maxIndex)));
    };

    useEffect(() => {
        if (total <= VISIBLE) return;
        timerRef.current = setInterval(() => {
            setIndex(p => p >= maxIndex ? 0 : p + 1);
        }, 4000);
        return () => clearInterval(timerRef.current);
    }, [total, maxIndex]);

    const offset = -(index * (100 / VISIBLE));

    if (total <= VISIBLE) {
        return (
            <div className="faculty-grid-simple">
                {members.map((m, i) => <FacultyCard key={m.id || i} member={m} index={i} />)}
            </div>
        );
    }

    return (
        <>
            <div className="faculty-carousel-section">
                <div className="faculty-carousel-track-wrapper">
                    <div className="faculty-carousel-track" style={{ transform: `translateX(${offset}%)` }}>
                        {members.map((m, i) => (
                            <FacultyCard key={m.id || i} member={m} index={i} />
                        ))}
                    </div>
                </div>
            </div>
            <div className="carousel-controls">
                <button className="carousel-arrow" onClick={() => go(index - 1)} disabled={index === 0}>&#8249;</button>
                <div className="carousel-dots">
                    {Array.from({ length: maxIndex + 1 }).map((_, i) => (
                        <button key={i} className={`carousel-dot ${i === index ? 'active' : ''}`} onClick={() => go(i)} />
                    ))}
                </div>
                <span className="carousel-counter">{index + 1} / {maxIndex + 1}</span>
                <button className="carousel-arrow" onClick={() => go(index + 1)} disabled={index >= maxIndex}>&#8250;</button>
            </div>
        </>
    );
}

function FacultyCard({ member, index }) {
    const { t, i18n } = useTranslation();
    const isMr = i18n.language === 'mr';
    const isHi = i18n.language === 'hi';

    const name = (isMr && member.name_mr)
        ? member.name_mr
        : (isHi && member.name_hi)
        ? member.name_hi
        : member.name;

    const designation = (isMr && member.designation_mr)
        ? member.designation_mr
        : (isHi && member.designation_hi)
        ? member.designation_hi
        : member.designation;

    const department = (isMr && member.department_mr)
        ? member.department_mr
        : (isHi && member.department_hi)
        ? member.department_hi
        : member.department;

    const qualification = (isMr && member.qualification_mr)
        ? member.qualification_mr
        : (isHi && member.qualification_hi)
        ? member.qualification_hi
        : member.qualification;

    return (
        <div className="faculty-card">
            <div className="faculty-image">
                <img
                    src={getImage(member, index)}
                    alt={name}
                    onError={e => {
                        e.target.src = `https://ui-avatars.com/api/?name=${encodeURIComponent(member.name)}&size=400&background=64748b&color=fff&bold=true`;
                    }}
                />
            </div>
            <div className="faculty-info">
                <h3>{name}</h3>
                {designation && <p className="faculty-designation">{designation}</p>}
                {department  && <span className="faculty-department">{department}</span>}
                <div className="faculty-meta">
                    {qualification && (
                        <div className="faculty-meta-item">
                            <strong>{t('faculty.qualification')}:</strong>
                            <span>{qualification}</span>
                        </div>
                    )}
                    {member.experience && (
                        <div className="faculty-meta-item">
                            <strong>{t('faculty.experience')}:</strong>
                            <span>{member.experience} {t('faculty.years')}</span>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}

function Faculty() {
    const { t, i18n } = useTranslation();
    const [faculty, setFaculty]     = useState([]);
    const [filtered, setFiltered]   = useState([]);
    const [departments, setDepts]   = useState([]);
    const [activeTab, setActiveTab] = useState('All');
    const [loading, setLoading]     = useState(true);

    useEffect(() => {
        facultyService.getAll()
            .then(r => {
                const data = (r.data && r.data.length > 0) ? r.data : MOCK_FACULTY;
                setFaculty(data);
                setFiltered(data);
                const depts = ['All', ...new Set(data.map(m => m.department).filter(Boolean))];
                setDepts(depts);
            })
            .catch(() => {
                setFaculty(MOCK_FACULTY);
                setFiltered(MOCK_FACULTY);
                const depts = ['All', ...new Set(MOCK_FACULTY.map(m => m.department).filter(Boolean))];
                setDepts(depts);
            })
            .finally(() => setLoading(false));
    }, []);

    const handleFilter = (dept) => {
        setActiveTab(dept);
        setFiltered(dept === 'All' ? faculty : faculty.filter(m => m.department === dept));
    };

    const getDeptLabel = (dept) => {
        if (dept === 'All') return t('common.all');
        const isMr = i18n.language === 'mr';
        const isHi = i18n.language === 'hi';
        const match = faculty.find(m => m.department === dept);
        if (!match) return dept;
        return (isMr && match.department_mr) ? match.department_mr
             : (isHi && match.department_hi) ? match.department_hi
             : dept;
    };

    return (
        <div className="page">
            <Navbar />

            <section className="page-header">
                <div className="container">
                    <h1>{t('faculty.title')}</h1>
                    <p>{t('faculty.meetStaff')}</p>
                </div>
            </section>

            <section className="section">
                <div className="container">
                    {loading ? (
                        <div className="loading-container"><div className="spinner" /></div>
                    ) : faculty.length === 0 ? (
                        <div className="no-data"><p>{t('faculty.noFaculty')}</p></div>
                    ) : (
                        <>
                            {departments.length > 2 && (
                                <div className="faculty-filters">
                                    {departments.map(dept => (
                                        <button
                                            key={dept}
                                            className={`faculty-filter-btn ${activeTab === dept ? 'active' : ''}`}
                                            onClick={() => handleFilter(dept)}
                                        >
                                            {getDeptLabel(dept)}
                                        </button>
                                    ))}
                                </div>
                            )}
                            <FacultyCarousel members={filtered} />
                        </>
                    )}
                </div>
            </section>
        </div>
    );
}

export default Faculty;