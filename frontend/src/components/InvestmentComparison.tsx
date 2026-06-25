import React, { useState } from 'react';
import { Scale, AlertTriangle, Calculator, Plane, Percent } from 'lucide-react';

export const InvestmentComparison: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'fees' | 'customs' | 'sip'>('fees');

  // Tab 1: Leakage Simulator State
  const [amount, setAmount] = useState<number>(100000);
  const [makingCharges, setMakingCharges] = useState<number>(14);

  // Tab 2: Dubai Customs State
  const [gender, setGender] = useState<'male' | 'female'>('female');
  const [weight, setWeight] = useState<number>(50);
  const [stayPeriod, setStayPeriod] = useState<'>1year' | '<1year'>('>1year');

  // Tab 3: Gold SIP State
  const [sipAmount, setSipAmount] = useState<number>(5000);
  const [sipYears, setSipYears] = useState<3 | 5 | 10>(5);

  // Math variables for Leakage Simulator
  const gstPct = 0.03;
  const makingChargesPct = makingCharges / 100;
  const physicalBaseGoldValue = amount / ((1 + makingChargesPct) * (1 + gstPct));
  const physicalMakingFee = physicalBaseGoldValue * makingChargesPct;
  const physicalGstPaid = (physicalBaseGoldValue + physicalMakingFee) * gstPct;
  const beesBaseGoldValue = amount / 1.001; 
  const beesFees = amount - beesBaseGoldValue;

  const cagr = 0.10;
  const physicalProjValue = physicalBaseGoldValue * (1 + cagr);
  const beesProjValue = beesBaseGoldValue * (1 + cagr);
  const leakedAmount = amount - physicalBaseGoldValue;

  // Math variables for Dubai Customs Calculator
  // Mock current rates: Dubai gold 22k = ~₹5,800/g. India gold 22k = ~₹6,477/g (derived from 12955 per g / 2 KT? Wait! Base rate is ₹12,955 per g? No, base rate is ₹12,955 per g 22K in Chennai!)
  // Let's use the local Chennai rate for India gold rate, and Dubai rate in INR.
  // In Chennai, let's say base gold 22K is ₹12,955/g. Dubai 22K is AED 450.50 * 25.7 (AED/INR) = ~₹11,577/g.
  const indiaGoldRate = 12955;
  const dubaiGoldRate = 11577;
  
  const dutyFreeLimit = stayPeriod === '>1year' ? (gender === 'female' ? 40 : 20) : 0;
  const excessWeight = Math.max(0, weight - dutyFreeLimit);
  const excessDubaiValue = excessWeight * dubaiGoldRate;
  
  // Custom duty on gold imported above allowance is flat 15%
  const customsTax = excessDubaiValue * 0.15;
  const totalCostDubai = (weight * dubaiGoldRate) + customsTax;
  const costIndia = weight * indiaGoldRate;
  const customsSavings = costIndia - totalCostDubai;

  // Math variables for SIP Planner
  const monthlyRate = 0.10 / 12; // 10% CAGR
  const totalMonths = sipYears * 12;
  const totalSipInvested = sipAmount * totalMonths;

  // Future Value compounding formula: P * [((1+r)^n - 1) / r] * (1+r)
  // Gold BeES (0.1% entry fee)
  const compoundBees = sipAmount * ((Math.pow(1 + monthlyRate, totalMonths) - 1) / monthlyRate) * (1 + monthlyRate) * 0.999;
  
  // Physical Gold (leaks making charges + GST on every monthly purchase, so only compounding 85% of investment!)
  const monthlyAllocatedPhysical = sipAmount / ((1 + makingChargesPct) * (1 + gstPct));
  const compoundPhysical = monthlyAllocatedPhysical * ((Math.pow(1 + monthlyRate, totalMonths) - 1) / monthlyRate) * (1 + monthlyRate);

  return (
    <div className="glass-panel" style={{ padding: '24px', display: 'flex', flexDirection: 'column', gap: '20px' }}>
      
      {/* Header Info */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '8px', borderBottom: '1px solid rgba(255,255,255,0.05)', paddingBottom: '12px' }}>
        <Scale className="gold-text" size={24} />
        <div>
          <h2 style={{ fontSize: '1.25rem', fontWeight: 700 }}>Investment Allocation suite</h2>
          <p style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>Compare physical ornaments, dynamic customs duty rates, and wealth compounders</p>
        </div>
      </div>

      {/* Tabs Selector */}
      <div style={{ display: 'flex', borderBottom: '1px solid rgba(255,255,255,0.05)', paddingBottom: '1px', gap: '16px' }}>
        <button 
          onClick={() => setActiveTab('fees')}
          style={{
            background: 'transparent', border: 'none', padding: '8px 4px', fontSize: '0.85rem', fontWeight: 600,
            color: activeTab === 'fees' ? 'var(--gold-primary)' : 'var(--text-muted)',
            borderBottom: activeTab === 'fees' ? '2px solid var(--gold-primary)' : '2px solid transparent',
            cursor: 'pointer', display: 'inline-flex', alignItems: 'center', gap: '6px', transition: 'all 0.2s'
          }}
        >
          <Percent size={14} /> Wastage Simulator
        </button>
        <button 
          onClick={() => setActiveTab('customs')}
          style={{
            background: 'transparent', border: 'none', padding: '8px 4px', fontSize: '0.85rem', fontWeight: 600,
            color: activeTab === 'customs' ? 'var(--gold-primary)' : 'var(--text-muted)',
            borderBottom: activeTab === 'customs' ? '2px solid var(--gold-primary)' : '2px solid transparent',
            cursor: 'pointer', display: 'inline-flex', alignItems: 'center', gap: '6px', transition: 'all 0.2s'
          }}
        >
          <Plane size={14} /> Dubai Customs Calculator
        </button>
        <button 
          onClick={() => setActiveTab('sip')}
          style={{
            background: 'transparent', border: 'none', padding: '8px 4px', fontSize: '0.85rem', fontWeight: 600,
            color: activeTab === 'sip' ? 'var(--gold-primary)' : 'var(--text-muted)',
            borderBottom: activeTab === 'sip' ? '2px solid var(--gold-primary)' : '2px solid transparent',
            cursor: 'pointer', display: 'inline-flex', alignItems: 'center', gap: '6px', transition: 'all 0.2s'
          }}
        >
          <Calculator size={14} /> Gold SIP Compounder
        </button>
      </div>

      {/* Tab Contents */}
      <div style={{ minHeight: '260px', display: 'flex', flexDirection: 'column', gap: '20px' }}>
        
        {/* WASTAGE SIMULATOR */}
        {activeTab === 'fees' && (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '24px' }}>
            {/* Inputs */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                <label style={{ fontSize: '0.75rem', color: 'var(--text-secondary)' }}>Investment Amount (₹)</label>
                <input 
                  type="number" 
                  value={amount}
                  onChange={(e) => setAmount(Math.max(1000, parseInt(e.target.value) || 0))}
                  style={{ background: 'rgba(255,255,255,0.02)', border: '1px solid var(--border-color)', borderRadius: '8px', padding: '10px 12px', color: 'var(--text-primary)', fontSize: '1rem', fontWeight: 600, outline: 'none' }}
                />
              </div>

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
                  style={{ width: '100%', accentColor: 'var(--gold-primary)', background: 'rgba(255,255,255,0.1)', height: '6px', borderRadius: '3px', cursor: 'pointer' }}
                />
              </div>

              <div style={{ padding: '12px 14px', background: 'rgba(239, 68, 68, 0.03)', border: '1px solid rgba(239, 68, 68, 0.1)', borderRadius: '8px', display: 'flex', gap: '8px', alignItems: 'flex-start' }}>
                <AlertTriangle size={16} style={{ color: 'var(--color-down)', flexShrink: 0, marginTop: '2px' }} />
                <p style={{ fontSize: '0.7rem', color: 'var(--text-secondary)', margin: 0, lineHeight: 1.4 }}>
                  <strong>Immediate Value Leak:</strong> Investing ₹{amount.toLocaleString()} in ornaments means <strong>₹{Math.round(leakedAmount).toLocaleString()}</strong> goes to design fees and tax. Melt value starts at ₹{Math.round(physicalBaseGoldValue).toLocaleString()}.
                </p>
              </div>
            </div>

            {/* Results */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              <span style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', fontWeight: 600 }}>1-YEAR PROJECTED WEALTH (@ 10% MARKET GROWTH)</span>
              <div>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.75rem', marginBottom: '4px' }}>
                  <span>Physical Ornaments</span>
                  <span>Melt value: ₹{Math.round(physicalBaseGoldValue).toLocaleString()}</span>
                </div>
                <div style={{ display: 'flex', height: '20px', borderRadius: '6px', overflow: 'hidden', border: '1px solid rgba(255,255,255,0.05)' }}>
                  <div style={{ width: `${(physicalBaseGoldValue / amount) * 100}%`, background: 'var(--gold-secondary)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '0.7rem', color: '#000', fontWeight: 700 }}>
                    {Math.round((physicalBaseGoldValue / amount) * 100)}% Gold
                  </div>
                  <div style={{ width: `${(physicalMakingFee / amount) * 100}%`, background: 'rgba(239, 68, 68, 0.3)' }} />
                  <div style={{ width: `${(physicalGstPaid / amount) * 100}%`, background: 'rgba(255, 255, 255, 0.1)' }} />
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.7rem', color: 'var(--text-secondary)', marginTop: '4px' }}>
                  <span>Value in 1-Yr: <strong>₹{Math.round(physicalProjValue).toLocaleString()}</strong></span>
                  <span style={{ color: 'var(--color-down)' }}>Loss to fees: -₹{Math.round(leakedAmount).toLocaleString()}</span>
                </div>
              </div>

              <div>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.75rem', marginBottom: '4px' }}>
                  <span style={{ color: 'var(--color-up)', fontWeight: 600 }}>Nippon India Gold BeES ETF</span>
                  <span>Asset value: ₹{Math.round(beesBaseGoldValue).toLocaleString()}</span>
                </div>
                <div style={{ display: 'flex', height: '20px', borderRadius: '6px', overflow: 'hidden', border: '1px solid rgba(255,255,255,0.05)' }}>
                  <div style={{ width: `${(beesBaseGoldValue / amount) * 100}%`, background: 'var(--color-up)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '0.7rem', color: '#000', fontWeight: 700 }}>
                    99.9% Gold Asset
                  </div>
                  <div style={{ width: `${(beesFees / amount) * 100}%`, background: 'rgba(255,255,255,0.1)' }} />
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.7rem', color: 'var(--text-secondary)', marginTop: '4px' }}>
                  <span>Value in 1-Yr: <strong>₹{Math.round(beesProjValue).toLocaleString()}</strong></span>
                  <span style={{ color: 'var(--color-up)' }}>Gain Difference: +₹{Math.round(beesProjValue - physicalProjValue).toLocaleString()}</span>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* DUBAI CUSTOMS ESTIMATOR */}
        {activeTab === 'customs' && (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '24px' }}>
            {/* Inputs */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                  <label style={{ fontSize: '0.75rem', color: 'var(--text-secondary)' }}>Passenger Gender</label>
                  <select 
                    value={gender}
                    onChange={(e) => setGender(e.target.value as any)}
                    style={{ background: 'rgba(255,255,255,0.02)', border: '1px solid var(--border-color)', borderRadius: '6px', padding: '8px', color: 'var(--text-primary)', fontSize: '0.8rem', outline: 'none' }}
                  >
                    <option value="female">Female (Duty-free: 40g)</option>
                    <option value="male">Male (Duty-free: 20g)</option>
                  </select>
                </div>
                
                <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                  <label style={{ fontSize: '0.75rem', color: 'var(--text-secondary)' }}>Stay Abroad</label>
                  <select 
                    value={stayPeriod}
                    onChange={(e) => setStayPeriod(e.target.value as any)}
                    style={{ background: 'rgba(255,255,255,0.02)', border: '1px solid var(--border-color)', borderRadius: '6px', padding: '8px', color: 'var(--text-primary)', fontSize: '0.8rem', outline: 'none' }}
                  >
                    <option value=">1year">More than 1 Year</option>
                    <option value="<1year">Less than 1 Year</option>
                  </select>
                </div>
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                <label style={{ fontSize: '0.75rem', color: 'var(--text-secondary)' }}>Gold Weight Bought (g)</label>
                <input 
                  type="number" 
                  value={weight}
                  onChange={(e) => setWeight(Math.max(1, parseInt(e.target.value) || 0))}
                  style={{ background: 'rgba(255,255,255,0.02)', border: '1px solid var(--border-color)', borderRadius: '8px', padding: '10px 12px', color: 'var(--text-primary)', fontSize: '1rem', fontWeight: 600, outline: 'none' }}
                />
              </div>

              <div style={{ padding: '10px 12px', background: 'rgba(255,255,255,0.01)', border: '1px solid rgba(255,255,255,0.02)', borderRadius: '8px', fontSize: '0.7rem', color: 'var(--text-secondary)', lineHeight: 1.3 }}>
                <strong>Duty Free Limits:</strong> Residing abroad &gt; 1 year allows ₹1 Lakh allowance for women (~40g) and ₹50,000 for men (~20g). Excess weight is taxed at a flat customs duty of <strong>15%</strong>.
              </div>
            </div>

            {/* Calculations */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '16px', background: 'rgba(255,255,255,0.01)', border: '1px solid var(--border-color)', borderRadius: '12px', padding: '16px' }}>
              <span style={{ fontSize: '0.8rem', color: 'var(--gold-primary)', fontWeight: 700 }}>BILLING & CUSTOMS SUMMARY</span>
              
              <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', fontSize: '0.8rem' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                  <span style={{ color: 'var(--text-secondary)' }}>Dubai Purchase Price (g)</span>
                  <span>₹{(weight * dubaiGoldRate).toLocaleString()}</span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                  <span style={{ color: 'var(--text-secondary)' }}>Duty-Free Offset</span>
                  <span style={{ color: 'var(--color-up)' }}>-{dutyFreeLimit} g (Offset)</span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                  <span style={{ color: 'var(--text-secondary)' }}>Customs Duty to Pay (15% on excess)</span>
                  <span style={{ color: customsTax > 0 ? 'var(--color-down)' : 'var(--color-up)' }}>
                    ₹{Math.round(customsTax).toLocaleString()}
                  </span>
                </div>
                <hr style={{ border: 'none', borderTop: '1px solid rgba(255,255,255,0.05)' }} />
                <div style={{ display: 'flex', justifyContent: 'space-between', fontWeight: 700 }}>
                  <span>Net Cost (Dubai + Customs)</span>
                  <span>₹{Math.round(totalCostDubai).toLocaleString()}</span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', color: 'var(--text-secondary)' }}>
                  <span>Indian Retail Price Cost</span>
                  <span>₹{(weight * indiaGoldRate).toLocaleString()}</span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', color: 'var(--color-up)', fontSize: '0.9rem', fontWeight: 800, background: 'rgba(16, 185, 129, 0.05)', padding: '6px 8px', borderRadius: '6px', marginTop: '6px' }}>
                  <span>NET MONEY SAVED</span>
                  <span>₹{Math.round(customsSavings).toLocaleString()}</span>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* GOLD SIP COMPOUNDER */}
        {activeTab === 'sip' && (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '24px' }}>
            {/* Inputs */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                <label style={{ fontSize: '0.75rem', color: 'var(--text-secondary)' }}>Monthly Contribution (₹)</label>
                <input 
                  type="number" 
                  value={sipAmount}
                  onChange={(e) => setSipAmount(Math.max(500, parseInt(e.target.value) || 0))}
                  style={{ background: 'rgba(255,255,255,0.02)', border: '1px solid var(--border-color)', borderRadius: '8px', padding: '10px 12px', color: 'var(--text-primary)', fontSize: '1rem', fontWeight: 600, outline: 'none' }}
                />
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                <label style={{ fontSize: '0.75rem', color: 'var(--text-secondary)' }}>Investment Duration</label>
                <div style={{ display: 'flex', gap: '8px' }}>
                  {[3, 5, 10].map(y => (
                    <button 
                      key={y}
                      onClick={() => setSipYears(y as any)}
                      style={{
                        flex: 1,
                        background: sipYears === y ? 'var(--gold-primary)' : 'rgba(255,255,255,0.02)',
                        color: sipYears === y ? '#000' : 'var(--text-primary)',
                        border: '1px solid var(--border-color)',
                        padding: '8px', borderRadius: '6px', fontSize: '0.8rem', fontWeight: 700, cursor: 'pointer', transition: 'all 0.2s'
                      }}
                    >
                      {y} Years
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* Calculations */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              <span style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', fontWeight: 600 }}>PROJECTED WEALTH GROWTH (10% CAGR COMPLETED)</span>
              
              <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                <div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.75rem', marginBottom: '4px' }}>
                    <span>Gold BeES ETF Portfolio</span>
                    <span style={{ color: 'var(--color-up)', fontWeight: 600 }}>₹{Math.round(compoundBees).toLocaleString()}</span>
                  </div>
                  <div style={{ display: 'flex', height: '14px', borderRadius: '4px', overflow: 'hidden', background: 'rgba(255,255,255,0.03)' }}>
                    <div style={{ width: '100%', background: 'var(--color-up)' }} />
                  </div>
                </div>

                <div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.75rem', marginBottom: '4px' }}>
                    <span>Physical Ornaments Portfolio</span>
                    <span style={{ color: 'var(--gold-secondary)', fontWeight: 600 }}>₹{Math.round(compoundPhysical).toLocaleString()}</span>
                  </div>
                  <div style={{ display: 'flex', height: '14px', borderRadius: '4px', overflow: 'hidden', background: 'rgba(255,255,255,0.03)' }}>
                    <div style={{ width: `${(compoundPhysical / compoundBees) * 100}%`, background: 'var(--gold-secondary)' }} />
                  </div>
                </div>

                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.7rem', color: 'var(--text-secondary)', borderTop: '1px solid rgba(255,255,255,0.03)', paddingTop: '8px' }}>
                  <span>Total Principal Invested: <strong>₹{totalSipInvested.toLocaleString()}</strong></span>
                  <span style={{ color: 'var(--color-up)' }}>ETF Benefit: +₹{Math.round(compoundBees - compoundPhysical).toLocaleString()}</span>
                </div>
              </div>
            </div>
          </div>
        )}

      </div>

      {/* Feature Comparison Table */}
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
