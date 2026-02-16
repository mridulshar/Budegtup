import React from 'react';
import './Home.css';

const Home = ({ openAuthModal }) => {
    return (
        <section className="hero">
            <div className="hero-content">
                <h1>Master Your Money, <br /><span className="highlight">Build Your Future</span></h1>
                <p>Track every rupee, understand your spending patterns, and achieve your financial goals with intelligent insights</p>
                <button className="cta-btn" onClick={openAuthModal}>
                    <span>Start Tracking Free</span>
                    <i className="ri-arrow-right-line"></i>
                </button>
            </div>

            <div className="hero-visual">
                {/* Card Balance */}
                <div className="floating-card card-balance">
                    <div className="card-icon">
                        <i className="ri-wallet-3-fill"></i>
                    </div>
                    <div className="card-info">
                        <span className="card-label">Total Balance</span>
                        <h3>₹1,24,580</h3>
                        <div className="trend up">
                            <i className="ri-arrow-up-line"></i>
                            <span>12.5%</span>
                        </div>
                    </div>
                </div>

                {/* Card Expense */}
                <div className="floating-card card-expense">
                    <div className="card-icon purple">
                        <i className="ri-shopping-bag-fill"></i>
                    </div>
                    <div className="card-info">
                        <span className="card-label">This Month</span>
                        <h3>₹24,320</h3>
                        <div className="mini-chart">
                            <div className="bar" style={{ height: '40%' }}></div>
                            <div className="bar" style={{ height: '65%' }}></div>
                            <div className="bar" style={{ height: '45%' }}></div>
                            <div className="bar" style={{ height: '80%' }}></div>
                            <div className="bar" style={{ height: '55%' }}></div>
                        </div>
                    </div>
                </div>

                {/* Card Goal */}
                <div className="floating-card card-goal">
                    <div className="card-icon green">
                        <i className="ri-trophy-fill"></i>
                    </div>
                    <div className="card-info">
                        <span className="card-label">Savings Goal</span>
                        <h3>₹50,000</h3>
                        <div className="progress-ring">
                            <svg>
                                <circle cx="20" cy="20" r="18"></circle>
                                {/* Note: Inline styles like 'stroke-dashoffset' are converted to camelCase in React */}
                                <circle cx="20" cy="20" r="18" style={{ strokeDashoffset: '28' }}></circle>
                            </svg>
                            <span>75%</span>
                        </div>
                    </div>
                </div>

                {/* Blurs */}
                <div className="blur-sphere sphere-1"></div>
                <div className="blur-sphere sphere-2"></div>
            </div>
        </section>
    );
};

export default Home;