// App-wide constants

// Transaction categories
export const TRANSACTION_CATEGORIES = [
    'Food & Dining',
    'Transportation',
    'Shopping',
    'Entertainment',
    'Bills & Utilities',
    'Healthcare',
    'Education',
    'Travel',
    'Groceries',
    'Personal Care',
    'Gifts & Donations',
    'Home & Garden',
    'Income',
    'Other'
];

// Payment methods
export const PAYMENT_METHODS = [
    { value: 'cash', label: 'Cash' },
    { value: 'card', label: 'Credit/Debit Card' },
    { value: 'bank_transfer', label: 'Bank Transfer' },
    { value: 'digital_wallet', label: 'Digital Wallet' },
    { value: 'other', label: 'Other' }
];

// Goal categories
export const GOAL_CATEGORIES = [
    { value: 'savings', label: 'Savings' },
    { value: 'investment', label: 'Investment' },
    { value: 'debt_payment', label: 'Debt Payment' },
    { value: 'purchase', label: 'Purchase' },
    { value: 'other', label: 'Other' }
];

// Goal priorities
export const GOAL_PRIORITIES = [
    { value: 'low', label: 'Low', color: '#5B7FFF' },
    { value: 'medium', label: 'Medium', color: '#FFB547' },
    { value: 'high', label: 'High', color: '#FF6B6B' }
];

// Budget periods
export const BUDGET_PERIODS = [
    { value: 'weekly', label: 'Weekly' },
    { value: 'monthly', label: 'Monthly' },
    { value: 'yearly', label: 'Yearly' }
];

// Chart colors
export const CHART_COLORS = [
    '#5B7FFF',
    '#4ECDC4',
    '#FF6B6B',
    '#A78BFA',
    '#FFB547',
    '#F87171',
    '#60A5FA',
    '#34D399',
    '#FBBF24',
    '#F472B6'
];

// Category colors mapping
export const CATEGORY_COLORS = {
    'Food & Dining': '#FF6B6B',
    'Transportation': '#5B7FFF',
    'Shopping': '#A78BFA',
    'Entertainment': '#FFB547',
    'Bills & Utilities': '#4ECDC4',
    'Healthcare': '#F472B6',
    'Education': '#60A5FA',
    'Travel': '#FBBF24',
    'Groceries': '#34D399',
    'Personal Care': '#F87171',
    'Gifts & Donations': '#A78BFA',
    'Home & Garden': '#4ECDC4',
    'Income': '#4ECDC4',
    'Other': '#9CA3AF'
};

// Transaction type icons
export const TRANSACTION_ICONS = {
    income: '💰',
    expense: '💸',
    'Food & Dining': '🍔',
    'Transportation': '🚗',
    'Shopping': '🛍️',
    'Entertainment': '🎬',
    'Bills & Utilities': '💡',
    'Healthcare': '⚕️',
    'Education': '📚',
    'Travel': '✈️',
    'Groceries': '🛒',
    'Personal Care': '💅',
    'Gifts & Donations': '🎁',
    'Home & Garden': '🏡',
    'Income': '💵',
    'Other': '📌'
};

// AI Agent quick actions
export const AI_QUICK_ACTIONS = [
    {
        id: 'analyze-spending',
        label: 'Analyze My Spending',
        icon: 'PieChart',
        focusArea: 'spending'
    },
    {
        id: 'improve-savings',
        label: 'How to Save More?',
        icon: 'TrendingUp',
        focusArea: 'saving'
    },
    {
        id: 'budget-tips',
        label: 'Budget Tips',
        icon: 'DollarSign',
        focusArea: 'general'
    },
    {
        id: 'goal-advice',
        label: 'Goal Achievement Tips',
        icon: 'Target',
        focusArea: 'goals'
    }
];

// Time periods
export const TIME_PERIODS = [
    { value: 'week', label: 'This Week' },
    { value: 'month', label: 'This Month' },
    { value: 'year', label: 'This Year' }
];
