import React, { useState, useEffect } from 'react';
import { MessageCircle, X, Minimize2, Maximize2, Sparkles, Send } from 'lucide-react';
import { aiAgentService } from "../../../services";
import './AIAgentWidget.css';

export default function AIAgentWidget() {
    const [isOpen, setIsOpen] = useState(false);
    const [isMinimized, setIsMinimized] = useState(false);
    const [messages, setMessages] = useState([]);
    const [input, setInput] = useState('');
    const [loading, setLoading] = useState(false);
    const [insights, setInsights] = useState(null);
    const [hasNewInsights, setHasNewInsights] = useState(false);

    // Load initial insights when widget opens
    useEffect(() => {
        if (isOpen && !insights) {
            loadInsights();
        }
    }, [isOpen]);

    const loadInsights = async () => {
        try {
            const response = await aiAgentService.getInsights();
            setInsights(response.data);
            setHasNewInsights(true);
        } catch (error) {
            console.error('Failed to load insights:', error);
        }
    };

    const handleSendMessage = async () => {
        if (!input.trim() || loading) return;

        const userMessage = { role: 'user', content: input };
        setMessages(prev => [...prev, userMessage]);
        setInput('');
        setLoading(true);

        try {
            const response = await aiAgentService.chat(input);
            const aiMessage = { role: 'assistant', content: response.data.message };
            setMessages(prev => [...prev, aiMessage]);
        } catch (error) {
            const errorMessage = {
                role: 'assistant',
                content: 'Sorry, I encountered an error. Please try again.'
            };
            setMessages(prev => [...prev, errorMessage]);
        } finally {
            setLoading(false);
        }
    };

    const handleQuickAction = async (action) => {
        const prompts = {
            analyze: "Analyze my spending patterns",
            save: "How can I save more money?",
            budget: "Review my budget status",
            goals: "Check my financial goals progress"
        };

        setInput(prompts[action]);
        setTimeout(() => handleSendMessage(), 100);
    };

    const toggleWidget = () => {
        setIsOpen(!isOpen);
        if (!isOpen) {
            setIsMinimized(false);
            setHasNewInsights(false);
        }
    };

    const toggleMinimize = () => {
        setIsMinimized(!isMinimized);
    };

    return (
        <>
            {/* Floating Button */}
            {!isOpen && (
                <button
                    className="ai-widget-button"
                    onClick={toggleWidget}
                    aria-label="Open AI Assistant"
                >
                    <Sparkles size={24} />
                    {hasNewInsights && <span className="notification-badge"></span>}
                </button>
            )}

            {/* Chat Panel */}
            {isOpen && (
                <div className={`ai-widget-panel ${isMinimized ? 'minimized' : ''}`}>
                    {/* Header */}
                    <div className="ai-widget-header">
                        <div className="header-content">
                            <div className="ai-avatar">
                                <Sparkles size={20} />
                            </div>
                            <div className="header-text">
                                <h3>AI Financial Assistant</h3>
                                <span className="status-indicator">● Online</span>
                            </div>
                        </div>
                        <div className="header-actions">
                            <button
                                onClick={toggleMinimize}
                                className="icon-btn"
                                aria-label={isMinimized ? "Maximize" : "Minimize"}
                            >
                                {isMinimized ? <Maximize2 size={18} /> : <Minimize2 size={18} />}
                            </button>
                            <button
                                onClick={toggleWidget}
                                className="icon-btn"
                                aria-label="Close"
                            >
                                <X size={18} />
                            </button>
                        </div>
                    </div>

                    {/* Body */}
                    {!isMinimized && (
                        <div className="ai-widget-body">
                            {/* Welcome / Insights */}
                            {messages.length === 0 && (
                                <div className="ai-welcome">
                                    <div className="welcome-icon">
                                        <Sparkles size={32} />
                                    </div>
                                    <h4>Hi! I'm your AI Financial Assistant 👋</h4>
                                    <p>I can help you with:</p>
                                    <div className="quick-actions">
                                        <button onClick={() => handleQuickAction('analyze')}>
                                            📊 Analyze Spending
                                        </button>
                                        <button onClick={() => handleQuickAction('save')}>
                                            💰 Save Money
                                        </button>
                                        <button onClick={() => handleQuickAction('budget')}>
                                            📈 Check Budget
                                        </button>
                                        <button onClick={() => handleQuickAction('goals')}>
                                            🎯 Review Goals
                                        </button>
                                    </div>

                                    {/* Insights Card */}
                                    {insights && (
                                        <div className="insights-card">
                                            <h5>💡 Today's Insights</h5>
                                            <div className="insight-score">
                                                <div className="score-circle">
                                                    {insights.financialHealthScore || 75}
                                                </div>
                                                <span>Financial Health</span>
                                            </div>
                                            <div className="insight-tips">
                                                {insights.tips?.slice(0, 2).map((tip, index) => (
                                                    <div key={index} className="tip-item">
                                                        ✓ {tip}
                                                    </div>
                                                ))}
                                            </div>
                                        </div>
                                    )}
                                </div>
                            )}

                            {/* Messages */}
                            <div className="ai-messages">
                                {messages.map((message, index) => (
                                    <div
                                        key={index}
                                        className={`message ${message.role}`}
                                    >
                                        {message.role === 'assistant' && (
                                            <div className="message-avatar">
                                                <Sparkles size={16} />
                                            </div>
                                        )}
                                        <div className="message-content">
                                            {message.content}
                                        </div>
                                    </div>
                                ))}
                                {loading && (
                                    <div className="message assistant">
                                        <div className="message-avatar">
                                            <Sparkles size={16} />
                                        </div>
                                        <div className="message-content typing">
                                            <span></span><span></span><span></span>
                                        </div>
                                    </div>
                                )}
                            </div>
                        </div>
                    )}

                    {/* Input */}
                    {!isMinimized && (
                        <div className="ai-widget-input">
                            <input
                                type="text"
                                value={input}
                                onChange={(e) => setInput(e.target.value)}
                                onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
                                placeholder="Ask me anything about your finances..."
                                disabled={loading}
                            />
                            <button
                                onClick={handleSendMessage}
                                disabled={!input.trim() || loading}
                                className="send-btn"
                            >
                                <Send size={18} />
                            </button>
                        </div>
                    )}
                </div>
            )}
        </>
    );
}
