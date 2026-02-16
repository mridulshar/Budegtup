import React from 'react';
import './HowItWorks.css';

const HowItWorks = () => {
    return (
        <section id="how-it-works" className="how-it-works">
            <div className="container">
                <div className="section-header">
                    <span className="tag">Process</span>
                    <h2>How It Works</h2>
                    <p>Three simple steps to financial clarity</p>
                </div>

                <div className="steps">
                    <div className="step">
                        <div className="step-number">
                            <span>01</span>
                        </div>
                        <div className="step-icon">
                            <i className="ri-upload-cloud-line"></i>
                        </div>
                        <h3>Upload & Connect</h3>
                        <p>Upload transaction to get started instantly</p>
                    </div>

                    <div className="step-line"></div>

                    <div className="step">
                        <div className="step-number">
                            <span>02</span>
                        </div>
                        <div className="step-icon">
                            <i className="ri-bar-chart-2-line"></i>
                        </div>
                        <h3>Analyze & Track</h3>
                        <p>Automatically categorizes spending and provides insights to help you budget smarter</p>
                    </div>

                    <div className="step-line"></div>

                    <div className="step">
                        <div className="step-number">
                            <span>03</span>
                        </div>
                        <div className="step-icon">
                            <i className="ri-rocket-line"></i>
                        </div>
                        <h3>Grow & Achieve</h3>
                        <p>Set goals, track progress, and watch your wealth grow</p>
                    </div>
                </div>
            </div>
        </section>
    );
};

export default HowItWorks;