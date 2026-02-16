import React from 'react';
import './cta.css';
const Cta = ({ openAuthModal }) => {
    return (
        <section className="cta">
            <div className="container">
                <div className="cta-content">
                    <h2>Ready to Take Control?</h2>
                    <p>Start your financial journey today. No credit card required.</p>
                    <button className="cta-btn" onClick={openAuthModal}>
                        <span>Get Started Free</span>
                        <i className="ri-arrow-right-line"></i>
                    </button>
                </div>
            </div>
        </section>
    );
};

export default Cta;