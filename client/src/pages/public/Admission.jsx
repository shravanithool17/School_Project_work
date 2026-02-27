import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useForm } from 'react-hook-form';
import Navbar from '../../components/Navbar';
import { admissionsService } from '../../services';
import './Admission.css';

function Admission() {
    const { t, i18n } = useTranslation();
    const isMr = i18n.language === 'mr';
    const { register, handleSubmit, formState: { errors }, reset } = useForm();
    const [submitting, setSubmitting] = useState(false);
    const [message, setMessage] = useState({ type: '', text: '' });

    const onSubmit = async (data) => {
        setSubmitting(true);
        setMessage({ type: '', text: '' });
        try {
            await admissionsService.submit(data);
            setMessage({ type: 'success', text: t('admission.success') });
            reset();
        } catch {
            setMessage({ type: 'error', text: t('admission.error') });
        } finally {
            setSubmitting(false);
        }
    };

    return (
        <div className="page">
            <Navbar />

            {/* ── Header ── */}
            <section className="page-header">
                <div className="container">
                    <h1>{t('admission.title')}</h1>
                    <p>{t('admission.subtitle')}</p>
                </div>
                <div className="page-header__wave">
                    <svg viewBox="0 0 1440 80" preserveAspectRatio="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M0,40 C360,80 1080,0 1440,40 L1440,80 L0,80 Z" fill="#f1f5f9"/>
                    </svg>
                </div>
            </section>

            {/* ── Form + Info ── */}
            <section className="section">
                <div className="container">
                    <div className="admission-container">

                        {/* Left — Form */}
                        <form onSubmit={handleSubmit(onSubmit)} className="admission-form">

                            <div className="form-group">
                                <label className="form-label">{t('admission.studentName')} *</label>
                                <input type="text" className="form-input" {...register('student_name', { required: true })} />
                                {errors.student_name && <span className="error-text">{t('common.required')}</span>}
                            </div>

                            <div className="form-group">
                                <label className="form-label">{t('admission.parentName')} *</label>
                                <input type="text" className="form-input" {...register('parent_name', { required: true })} />
                                {errors.parent_name && <span className="error-text">{t('common.required')}</span>}
                            </div>

                            <div className="form-row">
                                <div className="form-group">
                                    <label className="form-label">{t('admission.mobile')} *</label>
                                    <input type="tel" className="form-input" {...register('mobile', { required: true, pattern: /^[0-9]{10}$/ })} />
                                    {errors.mobile && <span className="error-text">{t('common.required')}</span>}
                                </div>
                                <div className="form-group">
                                    <label className="form-label">{t('admission.email')}</label>
                                    <input type="email" className="form-input" {...register('email')} />
                                </div>
                            </div>

                            <div className="form-group">
                                <label className="form-label">{t('admission.classApplied')} *</label>
                                <select className="form-select" {...register('class_applied', { required: true })}>
                                    <option value="">{t('admission.selectClass')}</option>
                                    <option value="1st">{isMr ? '१ली इयत्ता' : '1st Standard'}</option>
                                    <option value="2nd">{isMr ? '२री इयत्ता' : '2nd Standard'}</option>
                                    <option value="3rd">{isMr ? '३री इयत्ता' : '3rd Standard'}</option>
                                    <option value="4th">{isMr ? '४थी इयत्ता' : '4th Standard'}</option>
                                    <option value="5th">{isMr ? '५वी इयत्ता' : '5th Standard'}</option>
                                    <option value="6th">{isMr ? '६वी इयत्ता' : '6th Standard'}</option>
                                    <option value="7th">{isMr ? '७वी इयत्ता' : '7th Standard'}</option>
                                    <option value="8th">{isMr ? '८वी इयत्ता' : '8th Standard'}</option>
                                    <option value="9th">{isMr ? '९वी इयत्ता' : '9th Standard'}</option>
                                    <option value="10th">{isMr ? '१०वी इयत्ता' : '10th Standard'}</option>
                                </select>
                                {errors.class_applied && <span className="error-text">{t('common.required')}</span>}
                            </div>

                            <div className="form-group">
                                <label className="form-label">{t('admission.address')}</label>
                                <textarea className="form-textarea" {...register('address')}></textarea>
                            </div>

                            {message.text && (
                                <div className={`alert alert-${message.type}`}>{message.text}</div>
                            )}

                            <button type="submit" className="btn btn-primary btn-lg" disabled={submitting}>
                                {submitting ? t('common.loading') : t('admission.submit')}
                            </button>
                        </form>

                        {/* Right — Info */}
                        <div className="admission-info">
                            <h3>{t('admission.process')}</h3>
                            <ul>
                                <li>{t('admission.processList.step1')}</li>
                                <li>{t('admission.processList.step2')}</li>
                                <li>{t('admission.processList.step3')}</li>
                                <li>{t('admission.processList.step4')}</li>
                            </ul>

                            <h3>{t('admission.documents')}</h3>
                            <ul>
                                <li>{t('admission.documentsList.birth')}</li>
                                <li>{t('admission.documentsList.transfer')}</li>
                                <li>{t('admission.documentsList.marksheet')}</li>
                                <li>{t('admission.documentsList.photo')}</li>
                                <li>{t('admission.documentsList.address')}</li>
                            </ul>
                        </div>

                    </div>
                </div>
            </section>
        </div>
    );
}

export default Admission;