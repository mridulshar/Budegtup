import React, { useState } from 'react';
import { X, DollarSign, Calendar, Tag, FileText, Zap, AlertCircle } from 'lucide-react';
import './Create.css';
import transactionService from "../../services/transactionService";

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

export default function Create({ isOpen, onClose, onSuccess }) {
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
  const [saving, setSaving] = useState(false);

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
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

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (validateForm()) {
      try {
        setSaving(true);
        const transactionData = {
          type: formData.type,
          amount: parseFloat(formData.amount),
          category: formData.category,
          merchant: formData.merchant,
          description: formData.description,
          date: formData.date,
          isRecurring: formData.isRecurring
        };

        await transactionService.create(transactionData);

        setFormData({
          merchant: '',
          amount: '',
          category: '',
          date: new Date().toISOString().split('T')[0],
          description: '',
          isRecurring: false,
          type: 'expense'
        });
        setErrors({});

        if (onSuccess) {
          onSuccess();
        }

        if (onClose) {
          onClose();
        }
      } catch (error) {
        console.error('Error saving transaction:', error);
        setErrors({ submit: 'Failed to save transaction. Please try again.' });
      } finally {
        setSaving(false);
      }
    }
  };

  if (!isOpen) return null;

  return (
    <div className="create-modal-overlay" onClick={onClose}>
      <div className="create-modal-container" onClick={(e) => e.stopPropagation()}>
        <button className="create-modal-close" onClick={onClose} aria-label="Close modal">
          <X size={20} />
        </button>

        <div className="create-modal-header">
          <h2>Add New Transaction</h2>
          <p>Enter the details of your transaction</p>
        </div>

        <form onSubmit={handleSubmit} className="create-transaction-form">
          {errors.submit && (
            <div className="create-error-banner" style={{ padding: '0.75rem', marginBottom: '1rem', background: 'rgba(255, 107, 107, 0.1)', border: '1px solid var(--danger)', borderRadius: '10px', display: 'flex', alignItems: 'center', gap: '0.5rem', color: 'var(--danger)' }}>
              <AlertCircle size={16} />
              {errors.submit}
            </div>
          )}

          <div className="create-form-group">
            <label className="create-form-label">Transaction Type</label>
            <div className="create-type-toggle">
              <button
                type="button"
                className={`create-type-btn ${formData.type === 'expense' ? 'active' : ''}`}
                onClick={() => setFormData(prev => ({ ...prev, type: 'expense' }))}
              >
                <span className="create-type-icon">💸</span>
                Expense
              </button>
              <button
                type="button"
                className={`create-type-btn ${formData.type === 'income' ? 'active' : ''}`}
                onClick={() => setFormData(prev => ({ ...prev, type: 'income' }))}
              >
                <span className="create-type-icon">💰</span>
                Income
              </button>
            </div>
          </div>

          <div className="create-form-group">
            <label htmlFor="merchant" className="create-form-label">
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
              className={`create-form-input ${errors.merchant ? 'error' : ''}`}
            />
            {errors.merchant && (
              <span className="create-error-message">
                <AlertCircle size={14} />
                {errors.merchant}
              </span>
            )}
          </div>

          <div className="create-form-group">
            <label htmlFor="amount" className="create-form-label">
              <DollarSign size={16} />
              Amount
            </label>
            <div className="create-input-with-prefix">
              <span className="create-input-prefix">$</span>
              <input
                type="number"
                id="amount"
                name="amount"
                value={formData.amount}
                onChange={handleInputChange}
                placeholder="0.00"
                step="0.01"
                min="0"
                className={`create-form-input with-prefix ${errors.amount ? 'error' : ''}`}
              />
            </div>
            {errors.amount && (
              <span className="create-error-message">
                <AlertCircle size={14} />
                {errors.amount}
              </span>
            )}
          </div>

          <div className="create-form-group">
            <label htmlFor="category" className="create-form-label">
              <Tag size={16} />
              Category
            </label>
            <div className="create-category-grid">
              {CATEGORIES.map((cat) => (
                <button
                  key={cat.value}
                  type="button"
                  className={`create-category-option ${formData.category === cat.label ? 'selected' : ''}`}
                  onClick={() => setFormData(prev => ({ ...prev, category: cat.label }))}
                >
                  <span className="create-category-option-icon">{cat.icon}</span>
                  <span className="create-category-option-label">{cat.label}</span>
                </button>
              ))}
            </div>
            {errors.category && (
              <span className="create-error-message">
                <AlertCircle size={14} />
                {errors.category}
              </span>
            )}
          </div>

          <div className="create-form-group">
            <label htmlFor="date" className="create-form-label">
              <Calendar size={16} />
              Date
            </label>
            <input
              type="date"
              id="date"
              name="date"
              value={formData.date}
              onChange={handleInputChange}
              className={`create-form-input ${errors.date ? 'error' : ''}`}
            />
            {errors.date && (
              <span className="create-error-message">
                <AlertCircle size={14} />
                {errors.date}
              </span>
            )}
          </div>

          <div className="create-form-group">
            <label htmlFor="description" className="create-form-label">
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
              className="create-form-textarea"
            />
          </div>

          <div className="create-form-group">
            <label className="create-checkbox-label">
              <input
                type="checkbox"
                name="isRecurring"
                checked={formData.isRecurring}
                onChange={handleInputChange}
                className="create-form-checkbox"
              />
              <div className="create-checkbox-content">
                <div className="create-checkbox-icon">
                  <Zap size={18} />
                </div>
                <div className="create-checkbox-text">
                  <span className="create-checkbox-title">Recurring Payment / Auto-pay</span>
                  <span className="create-checkbox-description">
                    This transaction repeats monthly (e.g., subscriptions, utilities)
                  </span>
                </div>
              </div>
            </label>
          </div>

          <div className="create-form-actions">
            <button type="button" onClick={onClose} className="create-btn-cancel" disabled={saving}>
              Cancel
            </button>
            <button type="submit" className="create-btn-submit" disabled={saving}>
              {saving ? 'Saving...' : 'Add Transaction'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}