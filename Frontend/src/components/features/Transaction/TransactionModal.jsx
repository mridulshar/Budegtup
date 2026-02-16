import React, { useEffect, useRef, useState } from 'react';
import { createPortal } from 'react-dom';
import { X, DollarSign, Calendar, Tag, FileText, Zap, AlertCircle } from 'lucide-react';
import './TransactionModal.css';

const CATEGORIES = [
    { value: 'income', label: 'Income', icon: '💰' },
    { value: 'food-dining', label: 'Food & Dining', icon: '🍽️' },
    { value: 'entertainment', label: 'Entertainment', icon: '🎬' },
    { value: 'shopping', label: 'Shopping', icon: '🛍️' },
    { value: 'transportation', label: 'Transportation', icon: '🚗' },
    { value: 'utilities', label: 'Utilities', icon: '⚡' },
    { value: 'health-fitness', label: 'Health & Fitness', icon: '💪' },
    { value: 'education', label: 'Education', icon: '📚' },
    { value: 'housing', label: 'Housing', icon: '🏠' },
    { value: 'other', label: 'Other', icon: '💳' }
];

function TransactionModal({ isOpen, onClose, onSave, transaction }) {
    const overlayRef = useRef(null);
    const dialogRef = useRef(null);
    const previouslyFocusedRef = useRef(null);

    const [formData, setFormData] = useState({
        merchant: '',
        amount: '',
        category: '',
        date: new Date().toISOString().split('T')[0],
        description: '',
        isRecurring: false,
        type: 'expense'
    });

    const [errors, setErrors] = useState({});

    // Reset form when transaction changes or modal opens
    useEffect(() => {
        if (isOpen) {
            if (transaction) {
                setFormData({
                    merchant: transaction.merchant || '',
                    amount: transaction.amount ? Math.abs(transaction.amount).toString() : '',
                    category: transaction.category || '',
                    date: transaction.date || new Date().toISOString().split('T')[0],
                    description: transaction.description || '',
                    isRecurring: transaction.isRecurring || false,
                    type: transaction.type || 'expense'
                });
            } else {
                setFormData({
                    merchant: '',
                    amount: '',
                    category: '',
                    date: new Date().toISOString().split('T')[0],
                    description: '',
                    isRecurring: false,
                    type: 'expense'
                });
            }
            setErrors({});
        }
    }, [isOpen, transaction]);

    // Handle modal open/close effects
    useEffect(() => {
        if (!isOpen) return;

        previouslyFocusedRef.current = document.activeElement;

        const focusDialog = () => {
            const focusables = dialogRef.current?.querySelectorAll(
                'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
            );
            if (focusables && focusables.length) {
                focusables[0].focus();
            } else {
                dialogRef.current?.focus();
            }
        };

        const scrollY = window.scrollY;
        document.body.style.position = 'fixed';
        document.body.style.top = `-${scrollY}px`;
        document.body.style.width = '100%';

        const timeout = setTimeout(focusDialog, 20);

        return () => {
            const top = document.body.style.top;
            document.body.style.position = '';
            document.body.style.top = '';
            document.body.style.width = '';
            if (top) window.scrollTo(0, parseInt(top || '0') * -1);

            if (previouslyFocusedRef.current instanceof HTMLElement) {
                previouslyFocusedRef.current.focus();
            }
            clearTimeout(timeout);
        };
    }, [isOpen]);

    // Handle keyboard events
    useEffect(() => {
        if (!isOpen) return;

        const handleKeydown = (e) => {
            if (e.key === 'Escape') {
                e.stopPropagation();
                onClose?.();
            } else if (e.key === 'Tab') {
                const focusables = dialogRef.current?.querySelectorAll(
                    'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
                );
                if (!focusables || focusables.length === 0) return;

                const list = Array.from(focusables);
                const first = list[0];
                const last = list[list.length - 1];

                if (e.shiftKey && document.activeElement === first) {
                    e.preventDefault();
                    last.focus();
                } else if (!e.shiftKey && document.activeElement === last) {
                    e.preventDefault();
                    first.focus();
                }
            }
        };

        document.addEventListener('keydown', handleKeydown, true);
        return () => document.removeEventListener('keydown', handleKeydown, true);
    }, [isOpen, onClose]);

    if (!isOpen) return null;

    const handleOverlayMouseDown = (e) => {
        if (e.target === overlayRef.current) {
            onClose?.();
        }
    };

    const handleInputChange = (e) => {
        const { name, value, type, checked } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: type === 'checkbox' ? checked : value
        }));
        // Clear error for this field
        if (errors[name]) {
            setErrors(prev => ({ ...prev, [name]: '' }));
        }
    };

    const validateForm = () => {
        const newErrors = {};

        if (!formData.merchant.trim()) {
            newErrors.merchant = 'Merchant name is required';
        }

        if (!formData.amount || parseFloat(formData.amount) <= 0) {
            newErrors.amount = 'Please enter a valid amount';
        }

        if (!formData.category) {
            newErrors.category = 'Please select a category';
        }

        if (!formData.date) {
            newErrors.date = 'Please select a date';
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSubmit = (e) => {
        e.preventDefault();

        if (validateForm()) {
            const transactionData = {
                ...formData,
                amount: parseFloat(formData.amount),
                id: transaction?.id || Date.now()
            };
            onSave?.(transactionData);
        }
    };

    const modal = (
        <div
            ref={overlayRef}
            className="transaction-modal-overlay"
            onMouseDown={handleOverlayMouseDown}
        >
            <div
                ref={dialogRef}
                className="transaction-modal-container"
                role="dialog"
                aria-modal="true"
                aria-labelledby="transaction-modal-title"
                tabIndex={-1}
            >
                <button className="transaction-modal-close" onClick={onClose} aria-label="Close modal">
                    <X size={20} />
                </button>

                <div className="transaction-modal-header">
                    <h2 id="transaction-modal-title">
                        {transaction ? 'Edit Transaction' : 'Add New Transaction'}
                    </h2>
                    <p>Enter the details of your transaction</p>
                </div>

                <form onSubmit={handleSubmit} className="transaction-form">
                    {/* Type Toggle */}
                    <div className="form-group">
                        <label className="form-label">Transaction Type</label>
                        <div className="type-toggle">
                            <button
                                type="button"
                                className={`type-btn ${formData.type === 'expense' ? 'active' : ''}`}
                                onClick={() => setFormData(prev => ({ ...prev, type: 'expense' }))}
                            >
                                <span className="type-icon">💸</span>
                                Expense
                            </button>
                            <button
                                type="button"
                                className={`type-btn ${formData.type === 'income' ? 'active' : ''}`}
                                onClick={() => setFormData(prev => ({ ...prev, type: 'income' }))}
                            >
                                <span className="type-icon">💰</span>
                                Income
                            </button>
                        </div>
                    </div>

                    {/* Merchant Name */}
                    <div className="form-group">
                        <label htmlFor="merchant" className="form-label">
                            <FileText size={16} />
                            Merchant / Payment Name
                        </label>
                        <input
                            type="text"
                            id="merchant"
                            name="merchant"
                            value={formData.merchant}
                            onChange={handleInputChange}
                            placeholder="e.g., Netflix, Amazon, Salary"
                            className={`form-input ${errors.merchant ? 'error' : ''}`}
                        />
                        {errors.merchant && (
                            <span className="error-message">
                                <AlertCircle size={14} />
                                {errors.merchant}
                            </span>
                        )}
                    </div>

                    {/* Amount */}
                    <div className="form-group">
                        <label htmlFor="amount" className="form-label">
                            <DollarSign size={16} />
                            Amount
                        </label>
                        <div className="input-with-prefix">
                            <span className="input-prefix">$</span>
                            <input
                                type="number"
                                id="amount"
                                name="amount"
                                value={formData.amount}
                                onChange={handleInputChange}
                                placeholder="0.00"
                                step="0.01"
                                min="0"
                                className={`form-input with-prefix ${errors.amount ? 'error' : ''}`}
                            />
                        </div>
                        {errors.amount && (
                            <span className="error-message">
                                <AlertCircle size={14} />
                                {errors.amount}
                            </span>
                        )}
                    </div>

                    {/* Category */}
                    <div className="form-group">
                        <label htmlFor="category" className="form-label">
                            <Tag size={16} />
                            Category
                        </label>
                        <div className="category-grid">
                            {CATEGORIES.map((cat) => (
                                <button
                                    key={cat.value}
                                    type="button"
                                    className={`category-option ${formData.category === cat.label ? 'selected' : ''}`}
                                    onClick={() => setFormData(prev => ({ ...prev, category: cat.label }))}
                                >
                                    <span className="category-option-icon">{cat.icon}</span>
                                    <span className="category-option-label">{cat.label}</span>
                                </button>
                            ))}
                        </div>
                        {errors.category && (
                            <span className="error-message">
                                <AlertCircle size={14} />
                                {errors.category}
                            </span>
                        )}
                    </div>

                    {/* Date */}
                    <div className="form-group">
                        <label htmlFor="date" className="form-label">
                            <Calendar size={16} />
                            Date
                        </label>
                        <input
                            type="date"
                            id="date"
                            name="date"
                            value={formData.date}
                            onChange={handleInputChange}
                            className={`form-input ${errors.date ? 'error' : ''}`}
                        />
                        {errors.date && (
                            <span className="error-message">
                                <AlertCircle size={14} />
                                {errors.date}
                            </span>
                        )}
                    </div>

                    {/* Description */}
                    <div className="form-group">
                        <label htmlFor="description" className="form-label">
                            <FileText size={16} />
                            Description (Optional)
                        </label>
                        <textarea
                            id="description"
                            name="description"
                            value={formData.description}
                            onChange={handleInputChange}
                            placeholder="Add any additional notes..."
                            rows="3"
                            className="form-textarea"
                        />
                    </div>

                    {/* Recurring Payment */}
                    <div className="form-group">
                        <label className="checkbox-label">
                            <input
                                type="checkbox"
                                name="isRecurring"
                                checked={formData.isRecurring}
                                onChange={handleInputChange}
                                className="form-checkbox"
                            />
                            <div className="checkbox-content">
                                <div className="checkbox-icon">
                                    <Zap size={18} />
                                </div>
                                <div className="checkbox-text">
                                    <span className="checkbox-title">Recurring Payment / Auto-pay</span>
                                    <span className="checkbox-description">
                                        This transaction repeats monthly (e.g., subscriptions, utilities)
                                    </span>
                                </div>
                            </div>
                        </label>
                    </div>

                    {/* Form Actions */}
                    <div className="form-actions">
                        <button type="button" onClick={onClose} className="btn-cancel">
                            Cancel
                        </button>
                        <button type="submit" className="btn-submit">
                            {transaction ? 'Update Transaction' : 'Add Transaction'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );

    return createPortal(modal, document.body);
}

export default TransactionModal;
