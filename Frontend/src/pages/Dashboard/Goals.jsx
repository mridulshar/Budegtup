import React from 'react';
import { Target, Plus } from 'lucide-react';

export default function Goals() {
  return (
    <div style={{ padding: '2rem', maxWidth: '1600px', margin: '0 auto' }}>
      {/* Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
        <div>
          <h1 style={{ margin: '0 0 0.5rem 0', fontSize: '2rem', fontWeight: 700 }}>Financial Goals</h1>
          <p style={{ margin: 0, opacity: 0.7 }}>Track your savings and achieve your dreams</p>
        </div>
        <button style={{
          display: 'flex',
          alignItems: 'center',
          gap: '0.5rem',
          padding: '0.875rem 1.5rem',
          background: '#4ECDC4',
          color: 'white',
          border: 'none',
          borderRadius: '12px',
          fontWeight: 600,
          cursor: 'pointer'
        }}>
          <Plus size={20} />
          <span>New Goal</span>
        </button>
      </div>

      {/* Empty State */}
      <div style={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        padding: '4rem 2rem',
        textAlign: 'center',
        minHeight: '400px',
        background: 'rgba(255,255,255,0.05)',
        borderRadius: '24px',
        border: '1px solid rgba(255,255,255,0.1)'
      }}>
        <div style={{
          width: '80px',
          height: '80px',
          borderRadius: '50%',
          background: 'rgba(78, 205, 196, 0.15)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          marginBottom: '1.5rem',
          color: '#4ECDC4'
        }}>
          <Target size={48} />
        </div>
        <h3 style={{ margin: '0 0 1rem 0', fontSize: '1.5rem', fontWeight: 700 }}>No Goals Yet</h3>
        <p style={{ margin: '0 0 2rem 0', opacity: 0.7, maxWidth: '500px' }}>
          Start setting your financial goals and track your progress towards achieving them
        </p>
        <button style={{
          display: 'flex',
          alignItems: 'center',
          gap: '0.5rem',
          padding: '1rem 2rem',
          background: '#4ECDC4',
          color: 'white',
          border: 'none',
          borderRadius: '12px',
          fontWeight: 600,
          cursor: 'pointer'
        }}>
          <Plus size={20} />
          Create Your First Goal
        </button>
      </div>
    </div>
  );
}