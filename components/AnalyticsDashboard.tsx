import React, { useState } from 'react';

// Structure for our statistical data rows
interface StatItem {
  label: string;
  plays: number;
  timeListened: string;
}

export const AnalyticsDashboard: React.FC = () => {
  // Local active tab tracking system (day, week, month, year)
  const [timeframe, setTimeframe] = useState<'day' | 'week' | 'month' | 'year'>('week');

  // Hardcoded statistical breakdown metrics for Zylo analytics mapping
  const statsData: Record<'day' | 'week' | 'month' | 'year', StatItem[]> = {
    day: [
      { label: 'Morning (6 AM - 12 PM)', plays: 12, timeListened: '42 mins' },
      { label: 'Afternoon (12 PM - 6 PM)', plays: 24, timeListened: '1 hr 15 mins' },
      { label: 'Evening (6 PM - 12 AM)', plays: 38, timeListened: '2 hrs 10 mins' },
    ],
    week: [
      { label: 'Monday', plays: 14, timeListened: '52 mins' },
      { label: 'Wednesday', plays: 32, timeListened: '1 hr 45 mins' },
      { label: 'Friday', plays: 58, timeListened: '3 hrs 12 mins' },
      { label: 'Weekend', plays: 88, timeListened: '4 hrs 40 mins' },
    ],
    month: [
      { label: 'Week 1', plays: 120, timeListened: '7 hrs' },
      { label: 'Week 2', plays: 145, timeListened: '8.5 hrs' },
      { label: 'Week 3', plays: 98, timeListened: '5.8 hrs' },
      { label: 'Week 4', plays: 210, timeListened: '12.2 hrs' },
    ],
    year: [
      { label: 'Pop & Dance', plays: 1240, timeListened: '72 hrs' },
      { label: 'Alternative Rock', plays: 890, timeListened: '51 hrs' },
      { label: 'Deep Sea Ambient', plays: 620, timeListened: '36 hrs' },
    ],
  };

  const activeStats = statsData[timeframe];

  return (
    <div className="zylo-panel-glass" style={{ maxWidth: '500px', margin: '20px auto' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
        <h3 style={{ fontSize: '1.2rem', fontWeight: 'bold' }}>Time Analytics Dashboard</h3>
        <span style={{ fontSize: '0.8rem', color: 'var(--accent-secondary)', fontWeight: 'bold' }}>📊 Live Tracker</span>
      </div>

      {/* Navigation Filter Tabs */}
      <div style={{ display: 'flex', background: 'rgba(0,0,0,0.2)', padding: '4px', borderRadius: '8px', marginBottom: '20px', gap: '4px' }}>
        {(['day', 'week', 'month', 'year'] as const).map((tab) => (
          <button
            key={tab}
            onClick={() => setTimeframe(tab)}
            style={{
              flex: 1,
              background: timeframe === tab ? 'rgba(255, 255, 255, 0.08)' : 'transparent',
              color: timeframe === tab ? 'var(--text-main)' : 'var(--text-muted)',
              border: 'none',
              padding: '6px 0',
              borderRadius: '6px',
              textTransform: 'capitalize',
              fontSize: '0.85rem',
              fontWeight: timeframe === tab ? 'bold' : 'normal',
              cursor: 'pointer',
              transition: 'all 0.2s ease'
            }}
          >
            {tab}
          </button>
        ))}
      </div>

      {/* Visual Analytics Data Distribution List */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
        {activeStats.map((item, index) => {
          // Compute basic visual bar percentage markers
          const maxPlays = Math.max(...activeStats.map(s => s.plays));
          const percentWidth = (item.plays / maxPlays) * 100;

          return (
            <div key={index} style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.85rem' }}>
                <span style={{ fontWeight: 500 }}>{item.label}</span>
                <span style={{ color: 'var(--text-muted)' }}>{item.plays} plays ({item.timeListened})</span>
              </div>
              
              {/* Graphical Percentage Bar Container */}
              <div style={{ height: '8px', background: 'rgba(255,255,255,0.05)', borderRadius: '4px', overflow: 'hidden' }}>
                <div 
                  style={{ 
                    width: `${percentWidth}%`, 
                    height: '100%', 
                    background: 'linear-gradient(90deg, var(--accent-primary), var(--accent-secondary))',
                    borderRadius: '4px',
                    transition: 'width 0.4s ease-out'
                  }} 
                />
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
