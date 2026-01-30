import React, { useState } from 'react';
import './ContactForm.css';

function ContactForm() {
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        subject: '',
        message: ''
    });
    const [status, setStatus] = useState({
        type: '',
        message: ''
    });
    const [isSubmitting, setIsSubmitting] = useState(false);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsSubmitting(true);
        setStatus({ type: '', message: '' });

        try {
            const response = await fetch('/api/contact', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(formData)
            });

            const data = await response.json();

            if (data.success) {
                setStatus({
                    type: 'success',
                    message: data.message || 'Thank you! Your message has been sent successfully.'
                });
                // Clear form
                setFormData({
                    name: '',
                    email: '',
                    subject: '',
                    message: ''
                });
            } else {
                setStatus({
                    type: 'error',
                    message: data.error || 'Something went wrong. Please try again.'
                });
            }
        } catch (error) {
            setStatus({
                type: 'error',
                message: 'Network error. Please check your connection and try again.'
            });
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <div className="contact-section">
            <div className="contact-container">
                <div className="contact-header">
                    <h2 className="contact-title">📬 Get In Touch</h2>
                    <p className="contact-subtitle">
                        Have a question or want to work together? Send me a message!
                    </p>
                </div>

                <form onSubmit={handleSubmit} className="contact-form">
                    <div className="form-row">
                        <div className="form-group">
                            <label htmlFor="name" className="form-label">
                                Name <span className="required">*</span>
                            </label>
                            <input
                                type="text"
                                id="name"
                                name="name"
                                value={formData.name}
                                onChange={handleChange}
                                className="form-input"
                                placeholder="Your name"
                                required
                            />
                        </div>

                        <div className="form-group">
                            <label htmlFor="email" className="form-label">
                                Email <span className="required">*</span>
                            </label>
                            <input
                                type="email"
                                id="email"
                                name="email"
                                value={formData.email}
                                onChange={handleChange}
                                className="form-input"
                                placeholder="your@email.com"
                                required
                            />
                        </div>
                    </div>

                    <div className="form-group">
                        <label htmlFor="subject" className="form-label">
                            Subject
                        </label>
                        <input
                            type="text"
                            id="subject"
                            name="subject"
                            value={formData.subject}
                            onChange={handleChange}
                            className="form-input"
                            placeholder="What's this about?"
                        />
                    </div>

                    <div className="form-group">
                        <label htmlFor="message" className="form-label">
                            Message <span className="required">*</span>
                        </label>
                        <textarea
                            id="message"
                            name="message"
                            value={formData.message}
                            onChange={handleChange}
                            className="form-textarea"
                            placeholder="Write your message here..."
                            rows="5"
                            required
                        />
                    </div>

                    {status.message && (
                        <div className={`form-status ${status.type}`}>
                            {status.type === 'success' ? '✓' : '✗'} {status.message}
                        </div>
                    )}

                    <button
                        type="submit"
                        className={`submit-btn ${isSubmitting ? 'submitting' : ''}`}
                        disabled={isSubmitting}
                    >
                        {isSubmitting ? (
                            <>
                                <span className="spinner"></span>
                                Sending...
                            </>
                        ) : (
                            <>
                                Send Message
                                <span className="btn-arrow">→</span>
                            </>
                        )}
                    </button>
                </form>
            </div>
        </div>
    );
}

export default ContactForm;
