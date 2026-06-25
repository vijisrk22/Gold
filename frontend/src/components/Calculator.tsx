import React, { useState } from 'react';
import { Calculator as CalcIcon, Percent, Layers } from 'lucide-react';
import type { RetailData } from '../utils/api';

interface CalculatorProps {
  retail: RetailData;
}

export const Calculator: React.FC<CalculatorProps> = ({ retail }) => {
  const [weight, setWeight] = useState<number>(8); // default to 1 sovereign (8 grams)
  const [selectedBrand, setSelectedBrand] = useState<string>('lalitha');
  const [makingChargesPct, setMakingChargesPct] = useState<number>(12); // standard 12% making charges
  const [caratType, setCaratType] = useState<'22k' | '24k' | '18k'>('22k');

  const brandKeys = Object.keys(retail.brands);
  
  // Calculate specific billing for selected brand
  const currentBrand = retail.brands[selectedBrand] || retail.brands.lalitha;
  const ratePerGram = caratType === '22k' 
    ? currentBrand.gold22k 
    : caratType === '24k' 
      ? currentBrand.gold24k 
      : currentBrand.gold18k;

  const basePrice = ratePerGram * weight;
  const makingCharges = basePrice * (makingChargesPct / 100);
  const subtotal = basePrice + makingCharges;
  const gst = subtotal * 0.03; // 3% GST
  const grandTotal = subtotal + gst;

  // Comparison list for all brands
  const comparisonList = brandKeys.map(key => {
    const brand = retail.brands[key];
    const rate = caratType === '22k' 
      ? brand.gold22k 
      : caratType === '24k' 
        ? brand.gold24k 
        : brand.gold18k;
    
    // Different brand default making charges (Tanishq: 14%, Kalyan: 12%, Lalitha: 6% wastage, others 10%)
    let defaultPct = 10;
    if (key === 'tanishq') defaultPct = 14;
    else if (key === 'lalitha') defaultPct = 6;
    else if (key === 'kalyan' || key === 'malabar') defaultPct = 12;
    
    const brandBase = rate * weight;
    const brandMaking = brandBase * (defaultPct / 100);
    const brandSub = brandBase + brandMaking;
    const brandGst = brandSub * 0.03;
    const brandTotal = brandSub + brandGst;

    return {
      key,
      name: brand.name,
      rate,
      makingPct: defaultPct,
      grandTotal: brandTotal
    };
  }).sort((a, b) => a.grandTotal - b.grandTotal); // cheapest first

  return (
    <div className="glass-panel" style={{ padding: '24px', display: 'flex', flexDirection: 'column', gap: '20px' }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: '8px', borderBottom: '1px solid rgba(255,255,255,0.05)', paddingBottom: '12px' }}>
        <CalcIcon className="gold-text" size={24} />
        <div>
          <h2 style={{ fontSize: '1.25rem' }}>Smart Jewellery Purchase Planner</h2>
          <p style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>Calculate wastage, GST, and compare estimated costs side-by-side</p>
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '16px' }}>
        {/* Form Inputs */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
          <div>
            <label style={{ fontSize: '0.8rem', fontWeight: 600, color: 'var(--text-secondary)', display: 'block', marginBottom: '4px' }}>Gold Weight (Grams)</label>
            <input 
              type="number" 
              className="custom-input"
              value={weight}
              onChange={(e) => setWeight(Math.max(0.1, parseFloat(e.target.value) || 0))}
              step="0.1"
              min="0.1"
            />
            <div style={{ display: 'flex', gap: '8px', marginTop: '6px' }}>
              {[1, 4, 8, 10, 50].map(w => (
                <button 
                  key={w}
                  onClick={() => setWeight(w)}
                  style={{ flex: 1, padding: '4px', fontSize: '0.75rem', background: weight === w ? 'var(--gold-primary)' : 'rgba(255,255,255,0.03)', color: weight === w ? '#000' : 'var(--text-primary)', border: '1px solid var(--border-color)', borderRadius: '4px', cursor: 'pointer', fontWeight: 600 }}
                >
                  {w}g {w === 8 ? '(1 Sov)' : ''}
                </button>
              ))}
            </div>
          </div>

          <div>
            <label style={{ fontSize: '0.8rem', fontWeight: 600, color: 'var(--text-secondary)', display: 'block', marginBottom: '4px' }}>Gold Purity</label>
            <select 
              className="custom-input"
              value={caratType}
              onChange={(e) => setCaratType(e.target.value as any)}
            >
              <option value="22k">22 Karat (Jewellery Gold - 916)</option>
              <option value="24k">24 Karat (Investment Bullion)</option>
              <option value="18k">18 Karat (Budget Jewelry)</option>
            </select>
          </div>

          <div>
            <label style={{ fontSize: '0.8rem', fontWeight: 600, color: 'var(--text-secondary)', display: 'block', marginBottom: '4px' }}>Target Jeweller</label>
            <select 
              className="custom-input"
              value={selectedBrand}
              onChange={(e) => setSelectedBrand(e.target.value)}
            >
              {brandKeys.map(key => (
                <option key={key} value={key}>{retail.brands[key].name}</option>
              ))}
            </select>
          </div>

          <div>
            <label style={{ fontSize: '0.8rem', fontWeight: 600, color: 'var(--text-secondary)', display: 'block', marginBottom: '4px' }}>Wastage / Making Charges (%)</label>
            <div style={{ display: 'flex', alignItems: 'center', position: 'relative' }}>
              <input 
                type="number" 
                className="custom-input"
                value={makingChargesPct}
                onChange={(e) => setMakingChargesPct(Math.max(0, parseFloat(e.target.value) || 0))}
                min="0"
                max="50"
              />
              <Percent size={16} style={{ position: 'absolute', right: '12px', color: 'var(--text-secondary)' }} />
            </div>
            <p style={{ fontSize: '0.7rem', color: 'var(--text-muted)', marginTop: '4px' }}>
              Average market wastage ranges from 5% to 18% based on design complexity.
            </p>
          </div>
        </div>

        {/* Detailed Bill Output */}
        <div style={{ display: 'flex', flexDirection: 'column', padding: '16px', background: 'rgba(255,255,255,0.02)', border: '1px dashed var(--border-color)', borderRadius: '12px', justifyContent: 'center' }}>
          <span style={{ fontSize: '0.75rem', color: 'var(--gold-primary)', fontWeight: 600, letterSpacing: '0.05em', textTransform: 'uppercase' }}>ESTIMATED INVOICE BREAKDOWN</span>
          <span style={{ fontSize: '1.1rem', fontWeight: 700, margin: '4px 0 16px 0' }}>{currentBrand.name} ({caratType.toUpperCase()})</span>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', fontSize: '0.9rem' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', color: 'var(--text-secondary)' }}>
              <span>Base Gold ({weight}g @ ₹{ratePerGram.toLocaleString()}/g):</span>
              <span style={{ color: 'var(--text-primary)', fontWeight: 600 }}>₹{basePrice.toLocaleString(undefined, { maximumFractionDigits: 0 })}</span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', color: 'var(--text-secondary)' }}>
              <span>Value Addition ({makingChargesPct}%):</span>
              <span style={{ color: 'var(--text-primary)', fontWeight: 600 }}>₹{makingCharges.toLocaleString(undefined, { maximumFractionDigits: 0 })}</span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', color: 'var(--text-secondary)', borderBottom: '1px solid rgba(255,255,255,0.05)', paddingBottom: '8px' }}>
              <span>Subtotal:</span>
              <span style={{ color: 'var(--text-primary)', fontWeight: 600 }}>₹{subtotal.toLocaleString(undefined, { maximumFractionDigits: 0 })}</span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', color: 'var(--text-secondary)', paddingTop: '4px' }}>
              <span>GST (3% on Jewellery Value):</span>
              <span style={{ color: 'var(--text-primary)', fontWeight: 600 }}>₹{gst.toLocaleString(undefined, { maximumFractionDigits: 0 })}</span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', borderTop: '1px solid var(--border-color)', paddingTop: '12px', marginTop: '4px' }}>
              <span style={{ fontWeight: 700, fontSize: '1rem' }} className="gold-text">GRAND TOTAL:</span>
              <span style={{ fontWeight: 800, fontSize: '1.4rem', color: 'var(--gold-primary)', fontFamily: 'var(--font-display)' }}>
                ₹{grandTotal.toLocaleString(undefined, { maximumFractionDigits: 0 })}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Brand Comparison Grid */}
      <div style={{ borderTop: '1px solid rgba(255,255,255,0.05)', paddingTop: '16px' }}>
        <h3 style={{ fontSize: '1rem', display: 'flex', alignItems: 'center', gap: '6px', marginBottom: '12px' }}>
          <Layers size={16} className="gold-text" />
          Comparative Cost Sheet for {weight}g ({caratType.toUpperCase()})
        </h3>
        
        <div style={{ overflowX: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.85rem', textAlign: 'left' }}>
            <thead>
              <tr style={{ borderBottom: '1px solid rgba(255,255,255,0.1)', color: 'var(--text-secondary)' }}>
                <th style={{ padding: '8px 12px' }}>Jeweller</th>
                <th style={{ padding: '8px 12px' }}>Rate / g</th>
                <th style={{ padding: '8px 12px' }}>Est. Wastage</th>
                <th style={{ padding: '8px 12px', textAlign: 'right' }}>Est. Total (incl. 3% GST)</th>
              </tr>
            </thead>
            <tbody>
              {comparisonList.map(item => {
                const isSelected = item.key === selectedBrand;
                return (
                  <tr 
                    key={item.key} 
                    style={{ 
                      borderBottom: '1px solid rgba(255,255,255,0.02)',
                      background: isSelected ? 'rgba(234,179,8,0.04)' : 'transparent',
                      fontWeight: isSelected ? 600 : 400
                    }}
                  >
                    <td style={{ padding: '8px 12px', display: 'flex', alignItems: 'center', gap: '6px' }}>
                      {item.name}
                      {isSelected && <span style={{ fontSize: '0.65rem', background: 'var(--gold-primary)', color: '#000', padding: '1px 4px', borderRadius: '3px', fontWeight: 700 }}>Selected</span>}
                    </td>
                    <td style={{ padding: '8px 12px' }}>₹{item.rate.toLocaleString()}</td>
                    <td style={{ padding: '8px 12px', color: 'var(--text-secondary)' }}>{item.makingPct}%</td>
                    <td style={{ padding: '8px 12px', textAlign: 'right', fontWeight: 700, color: item.key === 'lalitha' ? 'var(--color-up)' : 'var(--text-primary)' }}>
                      ₹{item.grandTotal.toLocaleString(undefined, { maximumFractionDigits: 0 })}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
        <p style={{ fontSize: '0.7rem', color: 'var(--text-muted)', marginTop: '8px' }}>
          *Note: Estimates use typical jeweler markups (Lalitha: 6%, Kalyan/Malabar: 12%, Tanishq: 14%, others: 10%). Actual billing depends on selected ornament design.
        </p>
      </div>
    </div>
  );
};
