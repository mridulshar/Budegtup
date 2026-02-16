import React, { useState, useEffect } from 'react';
import {
  TrendingUp,
  TrendingDown,
  Wallet,
  Target,
  PieChart,
  ArrowUpRight,
  ArrowDownRight,
  DollarSign,
  CheckCircle,
  Clock,
  Zap,
  Calendar,
  Activity
} from 'lucide-react';
import './Overview.css';
import { useCurrency } from '../../context/CurrencyContext';
import { profileService } from '../../services';
import api from '../../services/api';

export default function Overview({ onAddTransaction }) {
  const { formatAmount } = useCurrency();
  const [loading, setLoading] = useState(true);
  const [transactions, setTransactions] = useState([]);
  const [stats, setStats] = useState({
    totalIncome: 0,
    totalExpenses: 0,
    savingsRate: 0,
    incomeChange: 0,
    expenseChange: 0
  });
  const [categoryBreakdown, setCategoryBreakdown] = useState([]);
  const [goals, setGoals] = useState({
    total: 0,
    achieved: 0,
    ongoing: 0,
    completionRate: 0
  });
  const [profile, setProfile] = useState(null);

  const fetchData = async () => {
    try {
      // Fetch profile for income
      const profileRes = await profileService.getProfile();
      setProfile(profileRes.data);

      // Fetch transactions using configured API
      const txRes = await api.get('/api/transactions');
      const txData = txRes.data;
      setTransactions(txData.slice(0, 5)); // Recent 5

      // Calculate stats from transactions
      const currentMonth = new Date().getMonth();
      const currentYear = new Date().getFullYear();

      const thisMonthTx = txData.filter(t => {
        const d = new Date(t.date);
        return d.getMonth() === currentMonth && d.getFullYear() === currentYear;
      });

      const expenses = thisMonthTx
        .filter(t => t.type === 'expense')
        .reduce((sum, t) => sum + Number(t.amount), 0);

      // Calculate category breakdown
      const categories = {};
      thisMonthTx.filter(t => t.type === 'expense').forEach(t => {
        categories[t.category] = (categories[t.category] || 0) + Number(t.amount);
      });

      const breakdown = Object.entries(categories)
        .map(([category, amount]) => ({
          category,
          amount,
          percentage: expenses > 0 ? Math.round((amount / expenses) * 100) : 0
        }))
        .sort((a, b) => b.amount - a.amount)
        .slice(0, 5);

      setCategoryBreakdown(breakdown);

      // Set stats
      setStats({
        totalExpenses: expenses,
        incomeChange: 2.5, // Mock data for demo
        expenseChange: -1.2, // Mock data for demo
        savingsRate: profileRes.data.monthlyIncome ? Math.max(0, Math.round(((profileRes.data.monthlyIncome - expenses) / profileRes.data.monthlyIncome) * 100)) : 0
      });

      // Fetch goals using configured API
      const goalsRes = await api.get('/api/goals');
      const goalsList = goalsRes.data;
      const achievedGoals = goalsList.filter(g => g.currentAmount >= g.targetAmount).length;
      const ongoingGoals = goalsList.length - achievedGoals;

      setGoals({
        total: goalsList.length,
        achieved: achievedGoals,
        ongoing: ongoingGoals,
        completionRate: goalsList.length > 0 ? Math.round((achievedGoals / goalsList.length) * 100) : 0
      });

    } catch (error) {
      console.error('Error fetching data:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
    const interval = setInterval(fetchData, 30000); // Poll every 30s
    return () => clearInterval(interval);
  }, []);

  const getCategoryIcon = (category) => {
    const icons = {
      'Income': '💰', 'Food & Dining': '🍽️', 'Entertainment': '🎬',
      'Shopping': '🛍️', 'Transportation': '🚗', 'Utilities': '⚡',
      'Health & Fitness': '💪', 'Education': '📚', 'Housing': '🏠', 'Other': '💳'
    };
    return icons[category] || '💳';
  };

  const getCategoryColor = (index) => {
    const colors = ['#4ECDC4', '#FF6B6B', '#A78BFA', '#FFE66D', '#5B7FFF'];
    return colors[index % colors.length];
  };

  const monthlyIncome = profile?.occupation === 'Student'
    ? profile?.pocketMoney || 0
    : profile?.monthlyIncome || 0;

  if (loading) {
    return (
      <div className="overview-container">
        <div className="overview-loading">
          <div className="loading-spinner"></div>
          <p>Loading your financial overview...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="overview-container">
      {/* Header */}
      <div className="overview-header">
        <div className="header-text">
          <h1>Financial Overview</h1>
          <p>Track your income, expenses, and achieve your financial goals</p>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="stats-grid">
        {/* Monthly Income Card */}
        <div className="stat-card income-card">
          <div className="stat-background-circle" style={{ background: '#4ECDC4' }}></div>

          <div className="stat-header">
            <div className="stat-icon" style={{ background: '#4ECDC415' }}>
              <DollarSign size={24} color="#4ECDC4" />
            </div>
            <div className="change-badge positive">
              <ArrowUpRight size={14} />
              {stats?.incomeChange ? Math.abs(stats.incomeChange).toFixed(1) : '2.5'}%
            </div>
          </div>

          <div className="stat-content">
            <p className="stat-label">Monthly Income</p>
            <h2 className="stat-value">{formatAmount(monthlyIncome)}</h2>
            <p className="stat-description">
              {profile?.occupation === 'Student' ? 'Pocket Money' : 'From Profile'}
            </p>
          </div>
        </div>

        {/* Monthly Spent Card */}
        <div className="stat-card spent-card">
          <div className="stat-background-circle" style={{ background: '#FF6B6B' }}></div>

          <div className="stat-header">
            <div className="stat-icon" style={{ background: '#FF6B6B15' }}>
              <Wallet size={24} color="#FF6B6B" />
            </div>
            <div className={`change-badge ${(stats?.expenseChange || 0) < 0 ? 'positive' : 'negative'}`}>
              {(stats?.expenseChange || 0) < 0 ? <ArrowDownRight size={14} /> : <ArrowUpRight size={14} />}
              {Math.abs(stats?.expenseChange || 0).toFixed(1)}%
            </div>
          </div>

          <div className="stat-content">
            <p className="stat-label">Monthly Spending</p>
            <h2 className="stat-value">{formatAmount(stats?.totalExpenses || 0)}</h2>
            <p className="stat-description">Total expenses this month</p>
          </div>
        </div>

        {/* Goals Card */}
        <div className="stat-card goals-card">
          <div className="stat-background-circle" style={{ background: '#A78BFA' }}></div>

          <div className="stat-header">
            <div className="stat-icon" style={{ background: '#A78BFA15' }}>
              <Target size={24} color="#A78BFA" />
            </div>
          </div>

          <div className="stat-content">
            <p className="stat-label">Financial Goals</p>
            <h2 className="stat-value">{goals?.total || 0}</h2>
            <div className="goals-progress">
              <div className="goal-stat">
                <CheckCircle size={18} color="#4ECDC4" />
                <span>{goals?.achieved || 0} Achieved</span>
              </div>
              <div className="goal-stat">
                <Clock size={18} color="#FFE66D" />
                <span>{goals?.ongoing || 0} Ongoing</span>
              </div>
            </div>
          </div>
        </div>

        {/* Savings Rate Card */}
        <div className="stat-card savings-card">
          <div className="stat-background-circle" style={{ background: '#5B7FFF' }}></div>

          <div className="stat-header">
            <div className="stat-icon" style={{ background: '#5B7FFF15' }}>
              <PieChart size={24} color="#5B7FFF" />
            </div>
            <div className={`change-badge ${(stats?.savingsRate || 0) > 0 ? 'positive' : 'negative'}`}>
              {(stats?.savingsRate || 0) > 0 ? <ArrowUpRight size={14} /> : <ArrowDownRight size={14} />}
              {Math.abs(stats?.savingsRate || 0).toFixed(1)}%
            </div>
          </div>

          <div className="stat-content">
            <p className="stat-label">Savings Rate</p>
            <h2 className="stat-value">{stats?.savingsRate || 0}%</h2>
            <div className="comparison-text">
              <TrendingUp size={16} color="#4ECDC4" />
              <span>
                {monthlyIncome > 0
                  ? `Saved ${formatAmount(monthlyIncome - (stats?.totalExpenses || 0))}`
                  : 'Keep up the good work!'}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Charts Section - Always Visible */}
      <div className="chart-section">
        <div className="section-header">
          <div>
            <h2>Spending Breakdown</h2>
            <p>{categoryBreakdown.length > 0 ? 'Top categories this month' : 'Add transactions to see breakdown'}</p>
          </div>
        </div>

        <div className="category-chart">
          {categoryBreakdown.length > 0 ? (
            categoryBreakdown.map((item, index) => (
              <div key={item.category} className="category-item">
                <div className="category-header">
                  <div className="category-info">
                    <span className="category-icon">{getCategoryIcon(item.category)}</span>
                    <span className="category-name">{item.category}</span>
                  </div>
                  <div className="category-amount">
                    <span className="amount">{formatAmount(item.amount)}</span>
                    <span className="percentage">{item.percentage}%</span>
                  </div>
                </div>
                <div className="category-bar">
                  <div
                    className="category-bar-fill"
                    style={{
                      width: `${item.percentage}%`,
                      background: getCategoryColor(index)
                    }}
                  ></div>
                </div>
              </div>
            ))
          ) : (
            <div className="no-transactions">
              <p>📊 Start adding transactions to see your spending breakdown</p>
            </div>
          )}
        </div>
      </div>

      {/* Transactions Section */}
      <div className="transactions-section">
        <div className="section-header">
          <div>
            <h2>Recent Transactions</h2>
            <p>Your latest financial activities</p>
          </div>
          <button className="filter-btn">
            <Calendar size={16} /> This Month
          </button>
        </div>

        {transactions.length > 0 ? (
          <div className="transactions-table">
            <div className="table-header">
              <div className="th">Category</div>
              <div className="th">Merchant</div>
              <div className="th">Amount</div>
              <div className="th">Date</div>
            </div>
            <div className="table-body">
              {transactions.map((t) => (
                <div key={t._id} className="table-row">
                  <div className="td">
                    <span className="category-icon">{getCategoryIcon(t.category)}</span>
                    {t.category}
                  </div>
                  <div className="td">{t.merchant}</div>
                  <div className={`td amount ${t.type === 'income' ? 'positive' : 'negative'}`}>
                    {t.type === 'income' ? '+' : '-'}{formatAmount(Math.abs(t.amount))}
                  </div>
                  <div className="td">
                    {new Date(t.date).toLocaleDateString()}
                  </div>
                </div>
              ))}
            </div>
          </div>
        ) : (
          <div className="no-transactions">
            <p>No transactions found. Start by adding your first transaction!</p>
          </div>
        )}
      </div>
    </div>
  );
}