import React from 'react';
import './Features.css';

const FeatureCard = ({ iconClass, gradientClass, title, description, cardClass }) => (
    <div className={`feature-card ${cardClass}`}>
        <div className="feature-icon-wrapper">
            <div className={`icon-bg ${gradientClass}`}>
                <i className={iconClass}></i>
            </div>
        </div>
        <h3 className="card-title">{title}</h3>
        <div className="glass-content">
            <p>{description}</p>
        </div>
    </div>
);


const Features = () => {
    return (
        <section id="features" className="modern-features-section">
            <div className="features-header">
                <span className="section-subtitle">Powerful tools to take control of your finances</span>
                <h2 className="section-title">Everything You Need</h2>
            </div>

            <div className="features-grid-custom">
                <FeatureCard
                    cardClass="f1-budgeting"
                    iconClass="fas fa-wallet"
                    gradientClass="green-gradient"
                    title="Smart Budgeting"
                    description="Create custom budgets and get real-time alerts when you're close to your limits."
                />

                <FeatureCard
                    cardClass="f2-analytics"
                    iconClass="fas fa-chart-line"
                    gradientClass="pink-gradient"
                    title="Expense Analytics"
                    description="Visualize your spending patterns with beautiful charts and detailed breakdowns."
                />

                <FeatureCard
                    cardClass="f3-notifications"
                    iconClass="fas fa-bell"
                    gradientClass="blue-gradient"
                    title="Smart Notifications"
                    description="Get notified about unusual spending, bill reminders, and savings opportunities."
                />
                
                <FeatureCard
                    cardClass="f4-goals"
                    iconClass="fas fa-bullseye"
                    gradientClass="peach-gradient"
                    title="Goal Tracking"
                    description="Set financial goals and track your progress with milestone celebrations."
                />
            </div>
        </section>
    );
};

export default Features;