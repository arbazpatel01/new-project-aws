import React, { useState, useEffect } from 'react';
import './App.css';

function App() {
    const [serverStatus, setServerStatus] = useState({
        status: 'loading',
        message: 'Checking...',
        timestamp: null
    });

    useEffect(() => {
        checkServerHealth();
    }, []);

    const checkServerHealth = async () => {
        try {
            const response = await fetch('/api/health');
            const data = await response.json();
            setServerStatus({
                status: 'healthy',
                message: data.message,
                timestamp: new Date(data.timestamp).toLocaleString()
            });
        } catch (error) {
            setServerStatus({
                status: 'error',
                message: 'Server unavailable',
                timestamp: null
            });
        }
    };

    return (
        <div className="app">
            {/* Animated Background */}
            <div className="bg-animation"></div>
            <div className="orb orb-1"></div>
            <div className="orb orb-2"></div>
            <div className="orb orb-3"></div>

            {/* Hero Section */}
            <section className="hero">
                <div className="logo-container">
                    <div className="logo">
                        <svg viewBox="0 0 24 24" fill="white">
                            <path d="M19.35 10.04C18.67 6.59 15.64 4 12 4 9.11 4 6.6 5.64 5.35 8.04 2.34 8.36 0 10.91 0 14c0 3.31 2.69 6 6 6h13c2.76 0 5-2.24 5-5 0-2.64-2.05-4.78-4.65-4.96zM14 13v4h-4v-4H7l5-5 5 5h-3z" />
                        </svg>
                    </div>
                </div>

                <h1 className="title">AWS Lightsail Demo</h1>
                <p className="subtitle">
                    A modern React + Node.js application ready for cloud deployment
                </p>

                <div className="badge">
                    <span className="badge-dot"></span>
                    Deployed Successfully
                </div>
            </section>

            {/* Features Cards */}
            <div className="cards-grid">
                <div className="card">
                    <div className="card-icon react">⚛️</div>
                    <h3 className="card-title">React Frontend</h3>
                    <p className="card-description">
                        Modern React 18 with hooks, optimized for performance and seamless user experience.
                    </p>
                </div>

                <div className="card">
                    <div className="card-icon node">🟢</div>
                    <h3 className="card-title">Node.js Backend</h3>
                    <p className="card-description">
                        Express.js API server handling requests and serving static files in production.
                    </p>
                </div>

                <div className="card">
                    <div className="card-icon aws">☁️</div>
                    <h3 className="card-title">AWS Lightsail</h3>
                    <p className="card-description">
                        Deployed on Amazon Lightsail with automatic scaling and high availability.
                    </p>
                </div>
            </div>

            {/* Server Status */}
            <div className="status-section">
                <h3 className="status-title">
                    📡 Server Status
                </h3>

                <div className="status-item">
                    <span className="status-label">API Status</span>
                    <span className={`status-value ${serverStatus.status}`}>
                        {serverStatus.status === 'healthy' ? '✓ Online' :
                            serverStatus.status === 'loading' ? '⏳ Checking' : '✗ Offline'}
                    </span>
                </div>

                <div className="status-item">
                    <span className="status-label">Message</span>
                    <span className="status-value" style={{ background: 'rgba(102, 126, 234, 0.15)', color: '#667eea' }}>
                        {serverStatus.message}
                    </span>
                </div>

                {serverStatus.timestamp && (
                    <div className="status-item">
                        <span className="status-label">Last Check</span>
                        <span className="status-value" style={{ background: 'rgba(255, 255, 255, 0.08)', color: '#fff' }}>
                            {serverStatus.timestamp}
                        </span>
                    </div>
                )}
            </div>

            {/* Footer */}
            <footer className="footer">
                <p>
                    Made with ❤️ for AWS Lightsail •
                    <a href="https://aws.amazon.com/lightsail/" target="_blank" rel="noopener noreferrer"> Learn More</a>
                </p>
            </footer>
        </div>
    );
}

export default App;
