import React, { useState, useEffect, useRef } from 'react';
import { Send, Loader, Bot, User as UserIcon, TrendingUp, PieChart, DollarSign, Target, Sparkles } from 'lucide-react';
import aiAgentService from '../../services/aiAgentService';
import { formatCurrency } from '../../utils/formatters';
import { AI_QUICK_ACTIONS } from '../../utils/constants';
import './AIAgentChat.css';

export default function AIAgentChat() {
    const [messages, setMessages] = useState([]);
    const [inputMessage, setInputMessage] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [insights, setInsights] = useState([]);
    const [recommendations, setRecommendations] = useState([]);
    const [showWelcome, setShowWelcome] = useState(true);
    const messagesEndRef = useRef(null);

    useEffect(() => {
        loadInitialData();
    }, []);

    useEffect(() => {
        scrollToBottom();
    }, [messages]);

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    };

    const loadInitialData = async () => {
        try {
            const [insightsData, recommendationsData] = await Promise.all([
                aiAgentService.getInsights(),
                aiAgentService.getRecommendations()
            ]);
            setInsights(insightsData.data || []);
            setRecommendations(recommendationsData.data || []);
        } catch (error) {
            console.error('Error loading AI data:', error);
        }
    };

    const handleSendMessage = async (message = inputMessage) => {
        if (!message.trim()) return;

        setShowWelcome(false);

        const userMessage = {
            id: Date.now(),
            type: 'user',
            content: message,
            timestamp: new Date()
        };

        setMessages(prev => [...prev, userMessage]);
        setInputMessage('');
        setIsLoading(true);

        try {
            const response = await aiAgentService.chat(message);

            const aiMessage = {
                id: Date.now() + 1,
                type: 'ai',
                content: response.data.message,
                data: response.data.data,
                suggestions: response.data.suggestions,
                timestamp: new Date()
            };

            setMessages(prev => [...prev, aiMessage]);
        } catch (error) {
            const errorMessage = {
                id: Date.now() + 1,
                type: 'ai',
                content: 'Sorry, I encountered an error. Please try again.',
                timestamp: new Date()
            };
            setMessages(prev => [...prev, errorMessage]);
        } finally {
            setIsLoading(false);
        }
    };

    const handleQuickAction = async (action) => {
        setShowWelcome(false);
        setIsLoading(true);

        try {
            const response = await aiAgentService.analyze(action.focusArea);

            const aiMessage = {
                id: Date.now(),
                type: 'ai',
                content: response.data.summary,
                insights: response.data.insights,
                suggestions: response.data.suggestions,
                score: response.data.score,
                timestamp: new Date()
            };

            setMessages(prev => [...prev, aiMessage]);
        } catch (error) {
            console.error('Quick action error:', error);
        } finally {
            setIsLoading(false);
        }
    };

    const getIconComponent = (iconName) => {
        const icons = {
            PieChart,
            TrendingUp,
            DollarSign,
            Target,
            Sparkles
        };
        return icons[iconName] || Sparkles;
    };

    return (
        <div className="ai-agent-container">
            {/* Header */}
            <div className="ai-chat-header">
                <div className="ai-header-icon">
                    <Bot size={24} />
                </div>
                <div>
                    <h2>AI Financial Assistant</h2>
                    <p>Get personalized financial advice and insights</p>
                </div>
            </div>

            {/* Insights & Recommendations Sidebar */}
            {showWelcome && (insights.length > 0 || recommendations.length > 0) && (
                <div className="ai-insights-panel">
                    {insights.length > 0 && (
                        <div className="insights-section">
                            <h3>💡 Current Insights</h3>
                            {insights.slice(0, 3).map((insight, idx) => (
                                <div key={idx} className={`insight-card ${insight.type}`}>
                                    <div className="insight-title">{insight.title}</div>
                                    <p>{insight.description}</p>
                                </div>
                            ))}
                        </div>
                    )}

                    {recommendations.length > 0 && (
                        <div className="recommendations-section">
                            <h3>✨ Top Recommendations</h3>
                            {recommendations.slice(0, 3).map((rec, idx) => (
                                <div key={idx} className={`recommendation-card priority-${rec.priority}`}>
                                    <div className="rec-header">
                                        <span className="rec-title">{rec.title}</span>
                                        <span className={`priority-badge ${rec.priority}`}>{rec.priority}</span>
                                    </div>
                                    <p>{rec.description}</p>
                                    {rec.actionable && <div className="actionable">💡 {rec.actionable}</div>}
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            )}

            {/* Chat Messages */}
            <div className="ai-chat-messages">
                {showWelcome && messages.length === 0 ? (
                    <div className="welcome-screen">
                        <div className="welcome-icon">
                            <Bot size={48} />
                        </div>
                        <h2>Hello! I'm your AI Financial Assistant 👋</h2>
                        <p>I can help you analyze your spending, improve savings, and achieve your financial goals.</p>

                        <div className="quick-actions-grid">
                            {AI_QUICK_ACTIONS.map(action => {
                                const IconComponent = getIconComponent(action.icon);
                                return (
                                    <button
                                        key={action.id}
                                        onClick={() => handleQuickAction(action)}
                                        className="quick-action-btn"
                                    >
                                        <IconComponent size={20} />
                                        {action.label}
                                    </button>
                                );
                            })}
                        </div>

                        <div className="welcome-prompt">
                            <p>Or ask me anything about your finances!</p>
                        </div>
                    </div>
                ) : (
                    <>
                        {messages.map(message => (
                            <div key={message.id} className={`message ${message.type}`}>
                                <div className="message-avatar">
                                    {message.type === 'user' ? <UserIcon size={20} /> : <Bot size={20} />}
                                </div>
                                <div className="message-content">
                                    <div className="message-text">{message.content}</div>

                                    {/* Display insights if available */}
                                    {message.insights && message.insights.length > 0 && (
                                        <div className="message-insights">
                                            {message.insights.map((insight, idx) => (
                                                <div key={idx} className={`inline-insight ${insight.type}`}>
                                                    <strong>{insight.title}</strong>
                                                    <p>{insight.description}</p>
                                                </div>
                                            ))}
                                        </div>
                                    )}

                                    {/* Display suggestions if available */}
                                    {message.suggestions && message.suggestions.length > 0 && (
                                        <div className="message-suggestions">
                                            <strong>Suggestions:</strong>
                                            {message.suggestions.map((sug, idx) => (
                                                <div key={idx} className="inline-suggestion">
                                                    • {sug.title}: {sug.actionable}
                                                </div>
                                            ))}
                                        </div>
                                    )}

                                    {/* Display score if available */}
                                    {message.score !== undefined && (
                                        <div className="financial-score">
                                            <span>Financial Health Score: </span>
                                            <strong className={`score ${message.score >= 70 ? 'good' : message.score >= 50 ? 'medium' : 'low'}`}>
                                                {message.score}/100
                                            </strong>
                                        </div>
                                    )}

                                    <div className="message-time">
                                        {message.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                    </div>
                                </div>
                            </div>
                        ))}
                        {isLoading && (
                            <div className="message ai">
                                <div className="message-avatar">
                                    <Bot size={20} />
                                </div>
                                <div className="message-content">
                                    <div className="typing-indicator">
                                        <span></span>
                                        <span></span>
                                        <span></span>
                                    </div>
                                </div>
                            </div>
                        )}
                        <div ref={messagesEndRef} />
                    </>
                )}
            </div>

            {/* Input Area */}
            <div className="ai-chat-input-area">
                <div className="chat-input-container">
                    <input
                        type="text"
                        value={inputMessage}
                        onChange={(e) => setInputMessage(e.target.value)}
                        onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
                        placeholder="Ask me about your finances..."
                        disabled={isLoading}
                        className="chat-input"
                    />
                    <button
                        onClick={() => handleSendMessage()}
                        disabled={!inputMessage.trim() || isLoading}
                        className="send-button"
                    >
                        {isLoading ? <Loader size={20} className="spin" /> : <Send size={20} />}
                    </button>
                </div>

                {!showWelcome && (
                    <div className="quick-prompts">
                        <button onClick={() => handleSendMessage('How can I save more money?')}>
                            How to save more?
                        </button>
                        <button onClick={() => handleSendMessage('What are my top expenses?')}>
                            Top expenses
                        </button>
                        <button onClick={() => handleSendMessage('How are my goals progressing?')}>
                            Goal progress
                        </button>
                    </div>
                )}
            </div>
        </div>
    );
}
