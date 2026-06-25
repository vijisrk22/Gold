import React, { useState } from 'react';
import { Scale, AlertTriangle } from 'lucide-react';

export const InvestmentComparison: React.FC = () => {
  const [amount, setAmount] = useState<number>(100000);
  const [makingCharges, setMakingCharges] = useState<number>(14);

  // Math calculations
  const gstPct = 0.03;
  const makingChargesPct = makingCharges / 100;

  // Physical Gold calculations
  // Ornaments purchase price breakdown: Gold Price (100%) + Making Charges (e.g. 14%) + GST (3% on Total)
  // Let's model standard retail billing:
  // If user invests 'amount':
  // Billing: BaseGold + MakingCharges + GST = amount
  // Let BaseGold = X. Making = X * makingChargesPct. GST = (X + Making) * gstPct
  // X * (1 + makingChargesPct) * (1 + gstPct) = amount
  // X = amount / [(1 + makingChargesPct) * (1 + gstPct)]
  const physicalBaseGoldValue = amount / ((1 + makingChargesPct) * (1 + gstPct));
  const physicalMakingFee = physicalBaseGoldValue * makingChargesPct;
  const physicalGstPaid = (physicalBaseGoldValue + physicalMakingFee) * gstPct;

  // Gold BeES calculations
  // No GST on purchase, Demat brokerage is typically near zero (e.g. max ₹20 flat or 0.1%), let's model 0.1% total buy cost
  const beesBaseGoldValue = amount / 1.001; 
  const beesFees = amount - beesBaseGoldValue;

  // 1-Year Projected Value (assuming 10% gold price CAGR)
  const cagr = 0.10;
  const physicalProjValue = physicalBaseGoldValue * (1 + cagr);
  const beesProjValue = beesBaseGoldValue * (1 + cagr);
  const leakedAmount = amount - physicalBaseGoldValue;

  return (
    <div className="glass-panel" style={{ padding: '24px', display: 'flex', flexDirection: 'column', gap: '24px' }}>
      
      {/* Header Info */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '8px', borderBottom: '1px solid rgba(255,255,255,0.05)', paddingBottom: '12px' }}>
        <Scale className="gold-text" size={24} />
        <div>
          <h2 style={{ fontSize: '1.25rem', fontWeight: 700 }}>Investment Allocation Analyzer</h2>
          <p style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>Compare Physical Gold Ornaments vs. Liquid Gold BeES ETF</p>
        </div>
      </div>

      {/* Yield Leakage Simulator */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '24px' }}>
        
        {/* Simulator Inputs */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          <span style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', fontWeight: 600 }}>SIMULATION PARAMETERS</span>
          
          {/* Investment Amount Input */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
            <label style={{ fontSize: '0.75rem', color: 'var(--text-secondary)' }}>Investment Amount (₹)</label>
            <input 
              type="number" 
              value={amount}
              onChange={(e) => setAmount(Math.max(1000, parseInt(e.target.value) || 0))}
              style={{
                background: 'rgba(255,255,255,0.02)',
                border: '1px solid var(--border-color)',
                borderRadius: '8px',
                padding: '10px 12px',
                color: 'var(--text-primary)',
                fontSize: '1rem',
                fontWeight: 600,
                outline: 'none'
              }}
            />
          </div>

          {/* Making Charges Slider */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.75rem' }}>
              <span style={{ color: 'var(--text-secondary)' }}>Physical making charges & wastage</span>
              <span style={{ color: 'var(--gold-primary)', fontWeight: 600 }}>{makingCharges}%</span>
            </div>
            <input 
              type="range" 
              min="3" 
              max="25" 
              value={makingCharges}
              onChange={(e) => setMakingCharges(parseInt(e.target.value))}
              style={{
                width: '100%',
                accentColor: 'var(--gold-primary)',
                background: 'rgba(255,255,255,0.1)',
                height: '6px',
                borderRadius: '3px',
                cursor: 'pointer'
              }}
            />
            <span style={{ fontSize: '0.65rem', color: 'var(--text-muted)' }}>Typical charges range from 6% (simple chains) to 22% (intricate bridal pieces)</span>
          </div>

          <div style={{ padding: '12px 14px', background: 'rgba(239, 68, 68, 0.03)', border: '1px solid rgba(239, 68, 68, 0.1)', borderRadius: '8px', display: 'flex', gap: '8px', alignItems: 'flex-start' }}>
            <AlertTriangle size={16} style={{ color: 'var(--color-down)', flexShrink: 0, marginTop: '2px' }} />
            <p style={{ fontSize: '0.7rem', color: 'var(--text-secondary)', margin: 0, lineHeight: 1.4 }}>
              <strong>Immediate Value Leak:</strong> Investing ₹{amount.toLocaleString()} in ornaments means <strong>₹{Math.round(leakedAmount).toLocaleString()}</strong> goes to design fees and tax. Your gold assets start with an actual melt value of only ₹{Math.round(physicalBaseGoldValue).toLocaleString()}.
            </p>
          </div>
        </div>

        {/* Visual Bar Comparison & Numbers */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          <span style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', fontWeight: 600 }}>YIELD SIMULATOR (1-YEAR PROJECTION @ 10% CAGR)</span>
          
          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            
            {/* Physical gold bar */}
            <div>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.75rem', marginBottom: '4px' }}>
                <span style={{ fontWeight: 600 }}>Physical Ornaments</span>
                <span style={{ color: 'var(--text-secondary)' }}>Melt value: ₹{Math.round(physicalBaseGoldValue).toLocaleString()}</span>
              </div>
              <div style={{ display: 'flex', height: '24px', borderRadius: '6px', overflow: 'hidden', border: '1px solid rgba(255,255,255,0.05)' }}>
                <div style={{ width: `${(physicalBaseGoldValue / amount) * 100}%`, background: 'var(--gold-secondary)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '0.7rem', color: '#000', fontWeight: 700 }}>
                  {Math.round((physicalBaseGoldValue / amount) * 100)}% Gold
                </div>
                <div style={{ width: `${(physicalMakingFee / amount) * 100}%`, background: 'rgba(239, 68, 68, 0.3)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '0.7rem', color: 'var(--text-primary)' }}>
                  Making
                </div>
                <div style={{ width: `${(physicalGstPaid / amount) * 100}%`, background: 'rgba(255, 255, 255, 0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '0.7rem', color: 'var(--text-secondary)' }}>
                  GST
                </div>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.7rem', color: 'var(--text-secondary)', marginTop: '4px' }}>
                <span>1-Yr Value: <strong>₹{Math.round(physicalProjValue).toLocaleString()}</strong></span>
                <span style={{ color: 'var(--color-down)' }}>Loss to fees: -₹{Math.round(leakedAmount).toLocaleString()}</span>
              </div>
            </div>

            {/* Gold BeES bar */}
            <div>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.75rem', marginBottom: '4px' }}>
                <span style={{ fontWeight: 600, color: 'var(--color-up)' }}>Nippon India Gold BeES ETF</span>
                <span style={{ color: 'var(--text-secondary)' }}>Asset value: ₹{Math.round(beesBaseGoldValue).toLocaleString()}</span>
              </div>
              <div style={{ display: 'flex', height: '24px', borderRadius: '6px', overflow: 'hidden', border: '1px solid rgba(255,255,255,0.05)' }}>
                <div style={{ width: `${(beesBaseGoldValue / amount) * 100}%`, background: 'var(--color-up)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '0.7rem', color: '#000', fontWeight: 700 }}>
                  99.9% Gold Asset
                </div>
                <div style={{ width: `${(beesFees / amount) * 100}%`, background: 'rgba(255,255,255,0.1)' }} />
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.7rem', color: 'var(--text-secondary)', marginTop: '4px' }}>
                <span>1-Yr Value: <strong>₹{Math.round(beesProjValue).toLocaleString()}</strong></span>
                <span style={{ color: 'var(--color-up)' }}>Gain difference: +₹{Math.round(beesProjValue - physicalProjValue).toLocaleString()}</span>
              </div>
            </div>

          </div>
        </div>

      </div>

      {/* Comparison Grid Table */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
        <span style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', fontWeight: 600 }}>FEATURE COMPARISON</span>
        
        <div style={{ overflowX: 'auto', border: '1px solid var(--border-color)', borderRadius: '10px' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.8rem', minWidth: '500px' }}>
            <thead>
              <tr style={{ background: 'rgba(255,255,255,0.02)', borderBottom: '1px solid var(--border-color)' }}>
                <th style={{ padding: '12px 16px', textAlign: 'left', fontWeight: 600, color: 'var(--text-secondary)' }}>Feature</th>
                <th style={{ padding: '12px 16px', textAlign: 'left', fontWeight: 600, color: 'var(--gold-primary)' }}>Physical Ornaments</th>
                <th style={{ padding: '12px 16px', textAlign: 'left', fontWeight: 600, color: 'var(--color-up)' }}>Nippon India Gold BeES ETF</th>
              </tr>
            </thead>
            <tbody>
              <tr style={{ borderBottom: '1px solid rgba(255,255,255,0.03)' }}>
                <td style={{ padding: '10px 16px', fontWeight: 600 }}>Making Charges</td>
                <td style={{ padding: '10px 16px', color: 'var(--color-down)' }}>High (8% to 25% waste fee)</td>
                <td style={{ padding: '10px 16px', color: 'var(--color-up)' }}>Zero</td>
              </tr>
              <tr style={{ borderBottom: '1px solid rgba(255,255,255,0.03)' }}>
                <td style={{ padding: '10px 16px', fontWeight: 600 }}>GST / Taxes</td>
                <td style={{ padding: '10px 16px', color: 'var(--color-down)' }}>3% GST on total price</td>
                <td style={{ padding: '10px 16px', color: 'var(--color-up)' }}>Zero GST</td>
              </tr>
              <tr style={{ borderBottom: '1px solid rgba(255,255,255,0.03)' }}>
                <td style={{ padding: '10px 16px', fontWeight: 600 }}>Storage & Safety</td>
                <td style={{ padding: '10px 16px', color: 'var(--text-secondary)' }}>Requires safe/bank locker (fees apply)</td>
                <td style={{ padding: '10px 16px', color: 'var(--color-up)' }}>Demat secure storage (Free)</td>
              </tr>
              <tr style={{ borderBottom: '1px solid rgba(255,255,255,0.03)' }}>
                <td style={{ padding: '10px 16px', fontWeight: 600 }}>Purity Risks</td>
                <td style={{ padding: '10px 16px', color: 'var(--text-secondary)' }}>Requires HUID tracking to avoid impurities</td>
                <td style={{ padding: '10px 16px', color: 'var(--color-up)' }}>Guaranteed 99.5% pure physical gold back-up</td>
              </tr>
              <tr style={{ borderBottom: '1px solid rgba(255,255,255,0.03)' }}>
                <td style={{ padding: '10px 16px', fontWeight: 600 }}>Liquidity (Selling)</td>
                <td style={{ padding: '10px 16px', color: 'var(--text-secondary)' }}>Moderate (must visit shop, buyback cuts)</td>
                <td style={{ padding: '10px 16px', color: 'var(--color-up)' }}>Instant (sell on stock exchange during hours)</td>
              </tr>
              <tr style={{ borderBottom: '1px solid rgba(255,255,255,0.03)' }}>
                <td style={{ padding: '10px 16px', fontWeight: 600 }}>Min. Investment</td>
                <td style={{ padding: '10px 16px', color: 'var(--text-secondary)' }}>High (~1 gram, ₹7,000+)</td>
                <td style={{ padding: '10px 16px', color: 'var(--color-up)' }}>Very low (~₹115 per unit, ~0.01 gram)</td>
              </tr>
              <tr>
                <td style={{ padding: '10px 16px', fontWeight: 600 }}>Utility Value</td>
                <td style={{ padding: '10px 16px', color: 'var(--color-up)' }}>High (Can be worn for functions/weddings)</td>
                <td style={{ padding: '10px 16px', color: 'var(--text-muted)' }}>None (pure financial instrument)</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

    </div>
  );
};
