import React from 'react';
import { Landmark, Award, MapPin, DollarSign } from 'lucide-react';

interface GoldCardProps {
  title: string;
  gold22k: number | null;
  gold24k: number | null;
  gold18k?: number | null;
  currency: string;
  badge?: string;
  sparklineData?: number[];
  inrEquivalent22k?: number;
  inrEquivalent24k?: number;
  isDubai?: boolean;
  isUS?: boolean;
}

export const GoldCard: React.FC<GoldCardProps> = ({
  title,
  gold22k,
  gold24k,
  gold18k,
  currency,
  badge,
  inrEquivalent22k,
  inrEquivalent24k,
  isDubai = false,
  isUS = false,
}) => {
  // Format local currency representation
  const formatCurrency = (val: number | null | undefined, cur: string) => {
    if (val === null || val === undefined) return 'N/A';
    if (cur === 'INR') return `₹${val.toLocaleString()}`;
    if (cur === 'AED') return `${val.toFixed(2)} AED`;
    if (cur === 'USD') return `$${val.toFixed(2)}`;
    return `${val} ${cur}`;
  };

  return (
    <div className="glass-panel" style={{ padding: '12px 16px', display: 'flex', flexDirection: 'column', gap: '8px' }}>
      {/* Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
        <div>
          <h3 style={{ fontSize: '1.2rem', display: 'flex', alignItems: 'center', gap: '6px', margin: 0 }}>
            {isDubai ? <MapPin size={18} className="gold-text" /> : isUS ? <DollarSign size={18} className="gold-text" /> : <Landmark size={18} className="gold-text" />}
            {title}
          </h3>
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
            <span>18K Rate:</span>
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


    </div>
  );
};
