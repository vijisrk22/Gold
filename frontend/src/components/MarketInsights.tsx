import React, { useState } from 'react';
import { 
  TrendingUp, 
  TrendingDown, 
  Minus, 
  Newspaper, 
  Sparkles, 
  Percent, 
  Globe, 
  FileText, 
  DollarSign
} from 'lucide-react';
import type { MarketInsights as InsightsType } from '../utils/api';

interface MarketInsightsProps {
  insights?: InsightsType;
}

export const MarketInsights: React.FC<MarketInsightsProps> = ({ insights }) => {
  const [activeTab, setActiveTab] = useState<'news' | 'predictions' | 'macro'>('predictions');

  if (!insights) {
    return (
      <div className="glass-panel" style={{ padding: '24px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <span style={{ color: 'var(--text-secondary)' }}>Market insights and news report loading...</span>
      </div>
    );
  }

  const { explanation, sentiment, news, predictions } = insights;

  const getSentimentBadge = (sent: string) => {
    let color = 'var(--text-secondary)';
    let bg = 'rgba(255,255,255,0.05)';
    let Icon = Minus;

    if (sent.toLowerCase().includes('bullish')) {
      color = 'var(--color-up)';
      bg = 'rgba(16, 185, 129, 0.1)';
      Icon = TrendingUp;
    } else if (sent.toLowerCase().includes('bearish')) {
      color = 'var(--color-down)';
      bg = 'rgba(239, 68, 68, 0.1)';
      Icon = TrendingDown;
    }

    return (
      <span style={{ 
        display: 'inline-flex', 
        alignItems: 'center', 
        gap: '4px', 
        color, 
        background: bg, 
        padding: '4px 10px', 
        borderRadius: '6px', 
        fontSize: '0.75rem', 
        fontWeight: 700, 
        letterSpacing: '0.03em' 
      }}>
        <Icon size={12} />
        {sent.toUpperCase()}
      </span>
    );
  };

  return (
    <div className="glass-panel" style={{ padding: '24px', display: 'flex', flexDirection: 'column', gap: '20px' }}>
      
      {/* Dynamic Sentiment Explanation */}
      <div style={{ background: 'rgba(255, 255, 255, 0.01)', border: '1px solid var(--border-color)', borderRadius: '12px', padding: '16px', display: 'flex', flexDirection: 'column', gap: '8px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <span style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', fontWeight: 600 }}>TODAY'S INTEL REPORT</span>
          {getSentimentBadge(sentiment)}
        </div>
        <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', lineHeight: 1.5, margin: 0 }}>
          {explanation}
        </p>
      </div>

      {/* Tabs Selector */}
      <div style={{ display: 'flex', borderBottom: '1px solid rgba(255,255,255,0.05)', paddingBottom: '1px', gap: '16px' }}>
        <button 
          onClick={() => setActiveTab('predictions')}
          style={{
            background: 'transparent', border: 'none', padding: '8px 4px', fontSize: '0.85rem', fontWeight: 600,
            color: activeTab === 'predictions' ? 'var(--gold-primary)' : 'var(--text-muted)',
            borderBottom: activeTab === 'predictions' ? '2px solid var(--gold-primary)' : '2px solid transparent',
            cursor: 'pointer', display: 'inline-flex', alignItems: 'center', gap: '6px', transition: 'all 0.2s'
          }}
        >
          <Sparkles size={14} /> AI Predictions
        </button>
        <button 
          onClick={() => setActiveTab('news')}
          style={{
            background: 'transparent', border: 'none', padding: '8px 4px', fontSize: '0.85rem', fontWeight: 600,
            color: activeTab === 'news' ? 'var(--gold-primary)' : 'var(--text-muted)',
            borderBottom: activeTab === 'news' ? '2px solid var(--gold-primary)' : '2px solid transparent',
            cursor: 'pointer', display: 'inline-flex', alignItems: 'center', gap: '6px', transition: 'all 0.2s'
          }}
        >
          <Newspaper size={14} /> Market News
        </button>
        <button 
          onClick={() => setActiveTab('macro')}
          style={{
            background: 'transparent', border: 'none', padding: '8px 4px', fontSize: '0.85rem', fontWeight: 600,
            color: activeTab === 'macro' ? 'var(--gold-primary)' : 'var(--text-muted)',
            borderBottom: activeTab === 'macro' ? '2px solid var(--gold-primary)' : '2px solid transparent',
            cursor: 'pointer', display: 'inline-flex', alignItems: 'center', gap: '6px', transition: 'all 0.2s'
          }}
        >
          <Percent size={14} /> Price Drivers
        </button>
      </div>

      {/* Tab Contents */}
      <div style={{ minHeight: '180px', display: 'flex', flexDirection: 'column', gap: '12px' }}>
        
        {/* PREDICTIONS TAB */}
        {activeTab === 'predictions' && predictions && (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '16px' }}>
            {/* Gold Pred */}
            <div style={{ padding: '16px', background: 'rgba(255,255,255,0.01)', border: '1px solid var(--border-color)', borderRadius: '12px', display: 'flex', flexDirection: 'column', gap: '8px' }}>
              <span style={{ fontSize: '0.75rem', color: 'var(--gold-primary)', fontWeight: 700 }}>GOLD (22K) AI TARGETS</span>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px', padding: '8px 0' }}>
                <div>
                  <span style={{ fontSize: '0.65rem', color: 'var(--text-muted)', display: 'block' }}>1 Month Forecast</span>
                  <span style={{ fontSize: '1.1rem', fontWeight: 800 }}>₹{predictions.gold.pred1mo.toLocaleString()}</span>
                  <span style={{ fontSize: '0.7rem', color: 'var(--color-up)', display: 'block', fontWeight: 600 }}>+{predictions.gold.change1mo}%</span>
                </div>
                <div style={{ borderLeft: '1px solid rgba(255,255,255,0.05)', paddingLeft: '12px' }}>
                  <span style={{ fontSize: '0.65rem', color: 'var(--text-muted)', display: 'block' }}>1 Year Forecast</span>
                  <span style={{ fontSize: '1.1rem', fontWeight: 800 }}>₹{predictions.gold.pred1y.toLocaleString()}</span>
                  <span style={{ fontSize: '0.7rem', color: 'var(--color-up)', display: 'block', fontWeight: 600 }}>+{predictions.gold.change1y}%</span>
                </div>
              </div>
              <p style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', margin: 0, borderTop: '1px solid rgba(255,255,255,0.03)', paddingTop: '8px', lineHeight: 1.4 }}>
                <strong>Forecast Base:</strong> {predictions.gold.rationale}
              </p>
            </div>

            {/* Silver Pred */}
            <div style={{ padding: '16px', background: 'rgba(255,255,255,0.01)', border: '1px solid var(--border-color)', borderRadius: '12px', display: 'flex', flexDirection: 'column', gap: '8px' }}>
              <span style={{ fontSize: '0.75rem', color: 'var(--text-primary)', fontWeight: 700 }}>SILVER AI TARGETS</span>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px', padding: '8px 0' }}>
                <div>
                  <span style={{ fontSize: '0.65rem', color: 'var(--text-muted)', display: 'block' }}>1 Month Forecast</span>
                  <span style={{ fontSize: '1.1rem', fontWeight: 800 }}>₹{predictions.silver.pred1mo.toLocaleString()}</span>
                  <span style={{ fontSize: '0.7rem', color: 'var(--color-up)', display: 'block', fontWeight: 600 }}>+{predictions.silver.change1mo}%</span>
                </div>
                <div style={{ borderLeft: '1px solid rgba(255,255,255,0.05)', paddingLeft: '12px' }}>
                  <span style={{ fontSize: '0.65rem', color: 'var(--text-muted)', display: 'block' }}>1 Year Forecast</span>
                  <span style={{ fontSize: '1.1rem', fontWeight: 800 }}>₹{predictions.silver.pred1y.toLocaleString()}</span>
                  <span style={{ fontSize: '0.7rem', color: 'var(--color-up)', display: 'block', fontWeight: 600 }}>+{predictions.silver.change1y}%</span>
                </div>
              </div>
              <p style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', margin: 0, borderTop: '1px solid rgba(255,255,255,0.03)', paddingTop: '8px', lineHeight: 1.4 }}>
                <strong>Forecast Base:</strong> {predictions.silver.rationale}
              </p>
            </div>
          </div>
        )}

        {/* NEWS TAB */}
        {activeTab === 'news' && news && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            {news.map((item, idx) => (
              <div key={idx} style={{ padding: '12px', background: 'rgba(255,255,255,0.01)', border: '1px solid rgba(255,255,255,0.03)', borderRadius: '10px', display: 'flex', flexDirection: 'column', gap: '4px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <span style={{ fontSize: '0.8rem', fontWeight: 700, color: 'var(--text-primary)' }}>{item.title}</span>
                  <span style={{ fontSize: '0.65rem', color: 'var(--text-muted)' }}>{item.time}</span>
                </div>
                <p style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', margin: 0, lineHeight: 1.4 }}>
                  {item.snippet}
                </p>
                <span style={{ fontSize: '0.65rem', color: 'var(--gold-primary)', fontWeight: 600, alignSelf: 'flex-start' }}>
                  Source: {item.source}
                </span>
              </div>
            ))}
          </div>
        )}

        {/* MACRO DRIVERS TAB */}
        {activeTab === 'macro' && (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '12px' }}>
            {/* Fed Rate */}
            <div style={{ padding: '12px', background: 'rgba(255,255,255,0.01)', border: '1px solid rgba(255,255,255,0.02)', borderRadius: '8px', display: 'flex', flexDirection: 'column', gap: '4px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '6px', color: 'var(--gold-primary)' }}>
                <Percent size={14} />
                <span style={{ fontSize: '0.75rem', fontWeight: 700 }}>US Fed Interest Rates</span>
              </div>
              <span style={{ fontSize: '0.65rem', color: 'var(--text-muted)', display: 'block', margin: '4px 0' }}>Correlation: Negative</span>
              <p style={{ fontSize: '0.7rem', color: 'var(--text-secondary)', margin: 0, lineHeight: 1.4 }}>
                When the Fed cuts rates, yield on US Treasuries drops, prompting funds to flow into non-yielding gold, pushing global prices higher.
              </p>
            </div>

            {/* USD/INR */}
            <div style={{ padding: '12px', background: 'rgba(255,255,255,0.01)', border: '1px solid rgba(255,255,255,0.02)', borderRadius: '8px', display: 'flex', flexDirection: 'column', gap: '4px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '6px', color: 'var(--gold-primary)' }}>
                <DollarSign size={14} />
                <span style={{ fontSize: '0.75rem', fontWeight: 700 }}>USD / INR Currency</span>
              </div>
              <span style={{ fontSize: '0.65rem', color: 'var(--text-muted)', display: 'block', margin: '4px 0' }}>Correlation: Positive</span>
              <p style={{ fontSize: '0.7rem', color: 'var(--text-secondary)', margin: 0, lineHeight: 1.4 }}>
                India imports almost 90% of its gold in USD. If the Indian Rupee depreciates against the Dollar, the domestic landed cost of gold rises.
              </p>
            </div>

            {/* DXY Dollar Index */}
            <div style={{ padding: '12px', background: 'rgba(255,255,255,0.01)', border: '1px solid rgba(255,255,255,0.02)', borderRadius: '8px', display: 'flex', flexDirection: 'column', gap: '4px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '6px', color: 'var(--gold-primary)' }}>
                <Globe size={14} />
                <span style={{ fontSize: '0.75rem', fontWeight: 700 }}>US Dollar Index (DXY)</span>
              </div>
              <span style={{ fontSize: '0.65rem', color: 'var(--text-muted)', display: 'block', margin: '4px 0' }}>Correlation: Negative</span>
              <p style={{ fontSize: '0.7rem', color: 'var(--text-secondary)', margin: 0, lineHeight: 1.4 }}>
                A stronger dollar makes gold more expensive for buyers holding other currencies, dampening global purchase demand and driving spot prices down.
              </p>
            </div>

            {/* Customs & Taxes */}
            <div style={{ padding: '12px', background: 'rgba(255,255,255,0.01)', border: '1px solid rgba(255,255,255,0.02)', borderRadius: '8px', display: 'flex', flexDirection: 'column', gap: '4px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '6px', color: 'var(--gold-primary)' }}>
                <FileText size={14} />
                <span style={{ fontSize: '0.75rem', fontWeight: 700 }}>Import Duties (15%+3%)</span>
              </div>
              <span style={{ fontSize: '0.65rem', color: 'var(--text-muted)', display: 'block', margin: '4px 0' }}>Correlation: Direct shifts</span>
              <p style={{ fontSize: '0.7rem', color: 'var(--text-secondary)', margin: 0, lineHeight: 1.4 }}>
                Import tariff changes by the Indian Government instantly shift retail gold price boards across the country, independent of global spots.
              </p>
            </div>
          </div>
        )}
      </div>

      <style>{`
        @keyframes slide-in {
          from { transform: translateY(100px); opacity: 0; }
          to { transform: translateY(0); opacity: 1; }
        }
      `}</style>
    </div>
  );
};
