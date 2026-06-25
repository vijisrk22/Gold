import React from 'react';
import { Landmark, Award, MapPin, DollarSign } from 'lucide-react';

interface GoldCardProps {
  title: string;
  description: string;
  gold22k: number;
  gold24k: number;
  gold18k?: number;
  currency: string;
  badge?: string;
  premium?: number;
  sparklineData?: number[];
  inrEquivalent22k?: number;
  inrEquivalent24k?: number;
  isDubai?: boolean;
  isUS?: boolean;
}

export const GoldCard: React.FC<GoldCardProps> = ({
  title,
  description,
  gold22k,
  gold24k,
  gold18k,
  currency,
  badge,
  premium,
  sparklineData = [100, 98, 101, 102, 99, 103, 101], // standard random history for sparkline
  inrEquivalent22k,
  inrEquivalent24k,
  isDubai = false,
  isUS = false,
}) => {
  // Generate SVG path for the sparkline
  const generateSparklinePath = (data: number[]) => {
    const width = 100;
    const height = 30;
    const max = Math.max(...data);
    const min = Math.min(...data);
    const range = max - min === 0 ? 1 : max - min;
    
    return data
      .map((val, index) => {
        const x = (index / (data.length - 1)) * width;
        const y = height - ((val - min) / range) * height + 2; // minor offset to prevent cutting off
        return `${index === 0 ? 'M' : 'L'} ${x.toFixed(1)} ${y.toFixed(1)}`;
      })
      .join(' ');
  };

  const sparklinePath = generateSparklinePath(sparklineData);

  // Compute color based on trend (last value vs first value)
  const isTrendUp = sparklineData[sparklineData.length - 1] >= sparklineData[0];
  const strokeColor = isTrendUp ? 'var(--color-up)' : 'var(--color-down)';
  
  // Format local currency representation
  const formatCurrency = (val: number, cur: string) => {
    if (cur === 'INR') return `₹${val.toLocaleString()}`;
    if (cur === 'AED') return `${val.toFixed(2)} AED`;
    if (cur === 'USD') return `$${val.toFixed(2)}`;
    return `${val} ${cur}`;
  };

  return (
    <div className="glass-panel" style={{ padding: '20px', display: 'flex', flexDirection: 'column', gap: '12px', minHeight: '260px' }}>
      {/* Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
        <div>
          <h3 style={{ fontSize: '1.25rem', display: 'flex', alignItems: 'center', gap: '6px' }}>
            {isDubai ? <MapPin size={18} className="gold-text" /> : isUS ? <DollarSign size={18} className="gold-text" /> : <Landmark size={18} className="gold-text" />}
            {title}
          </h3>
          <p style={{ color: 'var(--text-secondary)', fontSize: '0.8rem', marginTop: '2px' }}>{description}</p>
        </div>
        {badge && (
          <span className="live-badge" style={{ backgroundColor: 'var(--gold-glow)', color: 'var(--gold-primary)', borderColor: 'var(--border-color)' }}>
            <Award size={12} style={{ marginRight: '2px' }} />
            {badge}
          </span>
        )}
      </div>

      {/* Main Prices */}
      <div style={{ marginTop: '8px', display: 'flex', flexDirection: 'column', gap: '8px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline' }}>
          <div>
            <span style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', display: 'block', fontWeight: 600 }}>22K JEWELLERY RATE</span>
            <span style={{ fontSize: '1.8rem', fontWeight: 800, fontFamily: 'var(--font-display)' }} className="gold-text">
              {formatCurrency(gold22k, currency)}
            </span>
          </div>
          
          <div style={{ textAlign: 'right' }}>
            <span style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', display: 'block', fontWeight: 600 }}>24K PURE GOLD</span>
            <span style={{ fontSize: '1.2rem', fontWeight: 700 }}>
              {formatCurrency(gold24k, currency)}
            </span>
          </div>
        </div>

        {/* 18K Price if available */}
        {gold18k && (
          <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.85rem', color: 'var(--text-secondary)', borderTop: '1px solid rgba(255,255,255,0.05)', paddingTop: '6px' }}>
            <span>18K Budget Rate:</span>
            <span style={{ fontWeight: 600, color: 'var(--text-primary)' }}>{formatCurrency(gold18k, currency)} / g</span>
          </div>
        )}
        
        {/* INR Equivalents for International Rates */}
        {(inrEquivalent22k || inrEquivalent24k) && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '2px', borderTop: '1px solid rgba(255,255,255,0.05)', paddingTop: '6px', fontSize: '0.85rem' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', color: 'var(--text-secondary)' }}>
              <span>INR Equivalent (22K):</span>
              <span style={{ fontWeight: 600, color: 'var(--text-primary)' }}>₹{inrEquivalent22k?.toLocaleString()} / g</span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', color: 'var(--text-secondary)' }}>
              <span>INR Equivalent (24K):</span>
              <span style={{ fontWeight: 600, color: 'var(--text-primary)' }}>₹{inrEquivalent24k?.toLocaleString()} / g</span>
            </div>
          </div>
        )}
      </div>

      {/* Sparkline & Offsets (Footer Area) */}
      <div style={{ marginTop: 'auto', display: 'flex', justifyContent: 'space-between', alignItems: 'center', paddingTop: '10px' }}>
        {/* Premium Markup */}
        <div>
          {premium !== undefined && (
            <span style={{ fontSize: '0.75rem', color: premium > 0 ? 'var(--gold-primary)' : 'var(--color-up)', background: 'rgba(255,255,255,0.03)', padding: '4px 8px', borderRadius: '4px', border: '1px solid rgba(255,255,255,0.05)', fontWeight: 500 }}>
              {premium > 0 ? `Brand Premium: +₹${premium}/g` : 'Zero Markup rate'}
            </span>
          )}
          {(isDubai || isUS) && (
            <span className="live-badge" style={{ padding: '2px 8px', fontSize: '0.7rem' }}>
              Global Feed
            </span>
          )}
        </div>

        {/* Dynamic Sparkline Chart */}
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: '2px' }}>
          <svg width="100" height="35" style={{ overflow: 'visible' }}>
            <path
              d={sparklinePath}
              fill="none"
              stroke={strokeColor}
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
          <span style={{ fontSize: '0.65rem', color: 'var(--text-muted)' }}>7-day Trend</span>
        </div>
      </div>
    </div>
  );
};
