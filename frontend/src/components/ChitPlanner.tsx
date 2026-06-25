import React, { useState } from 'react';
import { 
  Coins, 
  TrendingUp, 
  Info, 
  Award, 
  CheckCircle2, 
  AlertTriangle, 
  ChevronDown,
  ChevronUp,
  HelpCircle
} from 'lucide-react';
import type { RetailData } from '../utils/api';

interface ChitPlannerProps {
  retail: RetailData;
}

interface SchemeDetails {
  name: string;
  type: 'weight' | 'cash';
  bonusFraction: number; // e.g. 1 month bonus = 1.0, 75% bonus = 0.75
  maxWaiverPct: number;  // e.g. 18% = 0.18
  avgWastagePct: number; // typical making charge rate
  trustBadge: string;
  pros: string[];
  cons: string[];
}

const BRAND_SCHEMES: { [key: string]: SchemeDetails } = {
  tanishq: {
    name: 'Tanishq Golden Harvest',
    type: 'cash',
    bonusFraction: 1.0, // 100% of 1 month installment
    maxWaiverPct: 0.0,  // No making charge waiver
    avgWastagePct: 0.14, // 14% average wastage
    trustBadge: 'Tata Trust & Purity',
    pros: ['100% bonus installment', 'Certified HUID 22K/18K purity', 'Excellent modern designs'],
    cons: ['No gold rate lock-in (cash scheme)', 'No making charge waiver (pay 12-16% wastage)']
  },
  grt: {
    name: 'GRT Golden Eleven',
    type: 'weight',
    bonusFraction: 0.0,
    maxWaiverPct: 0.18, // Waives up to 18% wastage
    avgWastagePct: 0.11, // 11% average wastage
    trustBadge: 'Heritage & Flexi',
    pros: ['Gold rate locked in every month', 'Full wastage waiver up to 18%', 'Traditional south Indian designs'],
    cons: ['No cash bonus', 'Special/custom designs may exceed 18% wastage']
  },
  lalitha: {
    name: 'Lalitha 11-Month Purchase Plan',
    type: 'weight',
    bonusFraction: 0.0,
    maxWaiverPct: 0.14, // Waives up to 14% wastage
    avgWastagePct: 0.06, // 6% average wastage
    trustBadge: 'Lowest Overhead',
    pros: ['Gold rate locked in every month', 'Wastage is already lowest (average 6%)', 'No hidden overheads'],
    cons: ['No cash bonus', 'Showrooms have less premium/designer collections']
  },
  malabar: {
    name: 'Malabar Golden Glow',
    type: 'weight',
    bonusFraction: 0.0,
    maxWaiverPct: 0.18,
    avgWastagePct: 0.13,
    trustBadge: '10 Purity Promises',
    pros: ['Gold rate locked in every month', 'Waives making charges up to 18%', 'National exchange and buyback assurance'],
    cons: ['No cash bonus', 'Slightly higher premium on base rate (+₹15/g)']
  },
  kalyan: {
    name: 'Kalyan Dhanvarsha',
    type: 'weight',
    bonusFraction: 0.0,
    maxWaiverPct: 0.14,
    avgWastagePct: 0.12,
    trustBadge: 'Bridal & Designer',
    pros: ['Gold rate locked in every month', 'Waives making charges up to 14%', 'Excellent regional bridal sets'],
    cons: ['No cash bonus', 'Higher base rate premium (+₹25/g)']
  },
  joyalukkas: {
    name: 'Joyalukkas Easy Gold',
    type: 'weight',
    bonusFraction: 0.0,
    maxWaiverPct: 0.18,
    avgWastagePct: 0.12,
    trustBadge: 'Global Presence',
    pros: ['Gold rate locked in every month', 'Wastage waived up to 18%', 'Multi-country exchange validity'],
    cons: ['No cash bonus', 'Higher base rate premium (+₹20/g)']
  },
  avr: {
    name: 'AVR Golden Dream',
    type: 'weight',
    bonusFraction: 0.0,
    maxWaiverPct: 0.18,
    avgWastagePct: 0.11,
    trustBadge: 'High Detail regional',
    pros: ['Gold rate locked in every month', 'Wastage waived up to 18%', 'Superb local Tamil Nadu designs'],
    cons: ['No cash bonus', 'Limited showrooms outside Tamil Nadu']
  },
  atr: {
    name: 'ATR Flexi Savings',
    type: 'cash',
    bonusFraction: 1.0, // 100% of 1 month installment
    maxWaiverPct: 0.10, // Boutique boutique waiver
    avgWastagePct: 0.10,
    trustBadge: 'Custom Boutique',
    pros: ['100% bonus installment', '10% wastage waiver', 'Ideal for fully customized designs'],
    cons: ['No gold rate lock-in (cash scheme)', 'Fewer ready-made items to choose from']
  }
};

// IRR monthly rate solver using Binary Search
const solveMonthlyIRR = (monthlyPayment: number, netProfit: number): number => {
  const cashFlows = Array(11).fill(-monthlyPayment);
  cashFlows.push(11 * monthlyPayment + netProfit);
  
  let low = -0.99;
  let high = 5.0; // max 500% monthly
  const tolerance = 0.00001;
  const maxIterations = 100;
  
  for (let i = 0; i < maxIterations; i++) {
    const mid = (low + high) / 2;
    let npv = 0;
    for (let t = 0; t < cashFlows.length; t++) {
      npv += cashFlows[t] / Math.pow(1 + mid, t);
    }
    
    if (Math.abs(npv) < tolerance) {
      return mid;
    }
    
    if (npv > 0) {
      low = mid;
    } else {
      high = mid;
    }
  }
  return (low + high) / 2;
};

export const ChitPlanner: React.FC<ChitPlannerProps> = ({ retail }) => {
  const [installment, setInstallment] = useState<number>(5000);
  const [trend, setTrend] = useState<'bullish' | 'moderate' | 'flat' | 'bearish'>('moderate');
  const [wastageScenario, setWastageScenario] = useState<'standard' | 'intricate'>('standard');
  const [expandedBrand, setExpandedBrand] = useState<string | null>(null);

  // Growth rate mapping per month
  const growthRates = {
    bullish: 0.015,   // +1.5% per month (~18% annualized)
    moderate: 0.008,  // +0.8% per month (~10% annualized)
    flat: 0.0,        // 0% per month
    bearish: -0.008   // -0.8% per month (~-10% annualized)
  };

  const currentGrowthRate = growthRates[trend];
  const chennaiBaseRate22k = retail.associationRate.gold22k;

  // Project gold prices month by month (1 to 12)
  const getProjectedPrices = (baseRate: number, rate: number) => {
    const prices = [];
    let current = baseRate;
    for (let m = 1; m <= 12; m++) {
      prices.push(Math.round(current));
      current = current * (1 + rate);
    }
    return prices;
  };

  const projectedBaseRates = getProjectedPrices(chennaiBaseRate22k, currentGrowthRate);
  const month12BaseRate = projectedBaseRates[11];

  const brandKeys = Object.keys(retail.brands);

  // Compute metrics for each brand
  const brandMetrics = brandKeys.map(key => {
    const brand = retail.brands[key];
    const scheme = BRAND_SCHEMES[key] || {
      name: brand.name,
      type: 'weight',
      bonusFraction: 0,
      maxWaiverPct: 0.14,
      avgWastagePct: 0.10,
      trustBadge: 'Standard',
      pros: [],
      cons: []
    };

    // Determine wastage percentage based on scenario
    const avgWastage = wastageScenario === 'intricate' ? 0.16 : scheme.avgWastagePct;
    const maxWaiver = scheme.maxWaiverPct;
    const ratePremium = brand.premium;

    // Monthly rates for this brand
    const monthlyBrandRates = projectedBaseRates.map(base => base + ratePremium);
    const month12BrandRate = month12BaseRate + ratePremium;

    let totalWeight = 0;
    let maturityGoldValue = 0;
    let wastageSaved = 0;
    let netWastagePaid = 0;
    let cashTopUp = 0;
    let totalCashPaid = 0;
    let netProfit = 0;
    let cashBonus = 0;

    const totalInstallments = 11 * installment;

    if (scheme.type === 'weight') {
      // Accumulate weight month-by-month
      const weightPerMonth = monthlyBrandRates.slice(0, 11).map(rate => installment / rate);
      totalWeight = weightPerMonth.reduce((sum, w) => sum + w, 0);

      // Month 12 gold value
      maturityGoldValue = totalWeight * month12BrandRate;

      // Wastage calculations
      wastageSaved = maturityGoldValue * Math.min(avgWastage, maxWaiver);
      netWastagePaid = maturityGoldValue * Math.max(0, avgWastage - maxWaiver);

      // GST is 3% on (Gold Value + Net Wastage)
      const gst = 0.03 * (maturityGoldValue + netWastagePaid);

      // Remaining cash top-up required at month 12
      cashTopUp = netWastagePaid + gst;
      totalCashPaid = totalInstallments + cashTopUp;

      // Regular cost if buying this weight without chit at month 12
      const regularWastage = maturityGoldValue * avgWastage;
      const regularGst = 0.03 * (maturityGoldValue + regularWastage);
      const regularCost = maturityGoldValue + regularWastage + regularGst;

      netProfit = regularCost - totalCashPaid;
    } else {
      // Cash scheme: Tanishq, ATR
      cashBonus = installment * scheme.bonusFraction;
      const totalChitCredit = totalInstallments + cashBonus;

      // Calculate how much jewellery they can get with this credit
      const netWastageMultiplier = 1 + Math.max(0, avgWastage - maxWaiver);
      const goldValue = totalChitCredit / (1.03 * netWastageMultiplier);

      totalWeight = goldValue / month12BrandRate;
      maturityGoldValue = goldValue;
      wastageSaved = goldValue * Math.min(avgWastage, maxWaiver);
      netWastagePaid = goldValue * Math.max(0, avgWastage - maxWaiver);

      cashTopUp = 0; // Everything is covered by cash credit
      totalCashPaid = totalInstallments;

      // Regular cost to get this same gold weight at month 12
      const regularWastage = goldValue * avgWastage;
      const regularGst = 0.03 * (goldValue + regularWastage);
      const regularCost = goldValue + regularWastage + regularGst;

      netProfit = regularCost - totalCashPaid;
    }

    const effectiveRate = totalCashPaid / totalWeight;

    // Monthly IRR calculations
    const monthlyIRR = solveMonthlyIRR(installment, netProfit);
    const annualizedIRR = Math.pow(1 + monthlyIRR, 12) - 1;

    return {
      key,
      name: scheme.name,
      type: scheme.type,
      totalWeight,
      maturityGoldValue,
      wastageSaved,
      netWastagePaid,
      cashTopUp,
      totalCashPaid,
      netProfit,
      effectiveRate,
      annualizedIRR: isNaN(annualizedIRR) ? 0 : annualizedIRR * 100,
      badge: scheme.trustBadge,
      avgWastage: avgWastage * 100,
      maxWaiver: maxWaiver * 100,
      pros: scheme.pros,
      cons: scheme.cons,
      month12Rate: month12BrandRate,
      cashBonus,
      monthlyBrandRates
    };
  }).sort((a, b) => b.netProfit - a.netProfit); // Sort by highest net profit first

  const winner = brandMetrics[0];

  return (
    <div className="glass-panel" style={{ padding: '24px', display: 'flex', flexDirection: 'column', gap: '24px', marginBottom: '32px' }}>
      
      {/* Header Area */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '10px', borderBottom: '1px solid rgba(255,255,255,0.05)', paddingBottom: '16px', flexWrap: 'wrap' }}>
        <div style={{ background: 'var(--gold-glow)', padding: '10px', borderRadius: '12px', border: '1px solid var(--border-color)' }}>
          <TrendingUp className="gold-text" size={24} />
        </div>
        <div style={{ flex: 1, minWidth: '240px' }}>
          <h2 style={{ fontSize: '1.4rem', display: 'flex', alignItems: 'center', gap: '8px' }}>
            11-Month Gold Chit Profit Maximizer
            <span style={{ fontSize: '0.75rem', background: 'var(--gold-glow)', color: 'var(--gold-primary)', padding: '2px 8px', borderRadius: '100px', border: '1px solid var(--border-color)', fontWeight: 600 }}>Smart Advisor</span>
          </h2>
          <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>Compare weight-accumulation vs cash-saving schemes across all premium showrooms</p>
        </div>
      </div>

      {/* Control Panel Grid */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '20px', background: 'rgba(255,255,255,0.01)', padding: '20px', borderRadius: '12px', border: '1px solid var(--border-color)' }}>
        
        {/* Installment Slider */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline' }}>
            <label style={{ fontSize: '0.85rem', fontWeight: 600, color: 'var(--text-secondary)' }}>Monthly Investment</label>
            <span style={{ fontSize: '1.2rem', fontWeight: 800 }} className="gold-text">₹{installment.toLocaleString()}</span>
          </div>
          <input 
            type="range" 
            min="1000" 
            max="50000" 
            step="1000"
            value={installment}
            onChange={(e) => setInstallment(parseInt(e.target.value, 10))}
            style={{ width: '100%', accentColor: 'var(--gold-primary)', cursor: 'pointer' }}
          />
          <div style={{ display: 'flex', gap: '6px' }}>
            {[2000, 5000, 10000, 20000].map(val => (
              <button
                key={val}
                onClick={() => setInstallment(val)}
                style={{
                  flex: 1,
                  padding: '4px 6px',
                  fontSize: '0.75rem',
                  fontWeight: 600,
                  backgroundColor: installment === val ? 'var(--gold-primary)' : 'rgba(255,255,255,0.03)',
                  color: installment === val ? '#000' : 'var(--text-primary)',
                  border: '1px solid var(--border-color)',
                  borderRadius: '6px',
                  cursor: 'pointer'
                }}
              >
                ₹{(val / 1000).toFixed(0)}K
              </button>
            ))}
          </div>
        </div>

        {/* Future Gold Trend Projection */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
          <label style={{ fontSize: '0.85rem', fontWeight: 600, color: 'var(--text-secondary)' }}>Projected Gold Price Trend</label>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px' }}>
            {[
              { id: 'bullish', name: 'Bullish (+1.5%/mo)', desc: 'Rising Market' },
              { id: 'moderate', name: 'Moderate (+0.8%/mo)', desc: 'Historical Avg' },
              { id: 'flat', name: 'Flat (0%/mo)', desc: 'Stable Rates' },
              { id: 'bearish', name: 'Bearish (-0.8%/mo)', desc: 'Declining Market' }
            ].map(item => (
              <button
                key={item.id}
                onClick={() => setTrend(item.id as any)}
                style={{
                  padding: '8px',
                  textAlign: 'left',
                  backgroundColor: trend === item.id ? 'var(--gold-glow)' : 'rgba(255,255,255,0.02)',
                  border: trend === item.id ? '1px solid var(--gold-primary)' : '1px solid rgba(255,255,255,0.05)',
                  borderRadius: '8px',
                  cursor: 'pointer',
                  transition: 'all 0.2s'
                }}
              >
                <div style={{ fontSize: '0.8rem', fontWeight: 700, color: trend === item.id ? 'var(--gold-primary)' : 'var(--text-primary)' }}>{item.name}</div>
                <div style={{ fontSize: '0.65rem', color: 'var(--text-secondary)' }}>{item.desc}</div>
              </button>
            ))}
          </div>
        </div>

        {/* Ornament Complexity (Wastage Scenario) */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
          <label style={{ fontSize: '0.85rem', fontWeight: 600, color: 'var(--text-secondary)', display: 'flex', alignItems: 'center', gap: '4px' }}>
            Jewellery Design Category
            <span title="Wastage (making charge) affects how much the waiver saves you." style={{ cursor: 'help', display: 'inline-flex', alignItems: 'center' }}>
              <HelpCircle size={14} style={{ color: 'var(--text-muted)' }} />
            </span>
          </label>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
            <button
              onClick={() => setWastageScenario('standard')}
              style={{
                padding: '10px 14px',
                textAlign: 'left',
                backgroundColor: wastageScenario === 'standard' ? 'var(--gold-glow)' : 'rgba(255,255,255,0.02)',
                border: wastageScenario === 'standard' ? '1px solid var(--gold-primary)' : '1px solid rgba(255,255,255,0.05)',
                borderRadius: '8px',
                cursor: 'pointer',
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center'
              }}
            >
              <div>
                <span style={{ fontSize: '0.85rem', fontWeight: 700, display: 'block' }}>Showroom Default Wastage</span>
                <span style={{ fontSize: '0.7rem', color: 'var(--text-secondary)' }}>Uses average making charges of each jeweller (e.g. Lalitha 6%, Tanishq 14%)</span>
              </div>
              <span style={{ fontSize: '0.75rem', fontWeight: 600, color: 'var(--gold-primary)' }}>Standard</span>
            </button>

            <button
              onClick={() => setWastageScenario('intricate')}
              style={{
                padding: '10px 14px',
                textAlign: 'left',
                backgroundColor: wastageScenario === 'intricate' ? 'var(--gold-glow)' : 'rgba(255,255,255,0.02)',
                border: wastageScenario === 'intricate' ? '1px solid var(--gold-primary)' : '1px solid rgba(255,255,255,0.05)',
                borderRadius: '8px',
                cursor: 'pointer',
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center'
              }}
            >
              <div>
                <span style={{ fontSize: '0.85rem', fontWeight: 700, display: 'block' }}>Heavy / Intricate Work</span>
                <span style={{ fontSize: '0.7rem', color: 'var(--text-secondary)' }}>Forces 16% making charge to test wastage waiver limits</span>
              </div>
              <span style={{ fontSize: '0.75rem', fontWeight: 600, color: 'var(--gold-primary)' }}>16% VA</span>
            </button>
          </div>
        </div>

      </div>

      {/* Advisory recommendation block */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '20px', alignItems: 'stretch' }}>
        
        {/* Dynamic Recommendation Panel */}
        <div style={{ padding: '20px', background: 'linear-gradient(135deg, rgba(7, 10, 19, 0.9) 0%, rgba(234, 179, 8, 0.04) 100%)', border: '1px solid var(--border-color)', borderRadius: '12px', display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px' }}>
              <Award className="gold-text" size={20} />
              <span style={{ fontSize: '0.75rem', color: 'var(--gold-primary)', fontWeight: 700, letterSpacing: '0.05em' }}>EXPERT RECOMMENDATION</span>
            </div>
            
            <h3 style={{ fontSize: '1.25rem', marginBottom: '6px' }}>
              Best Choice: <span className="gold-text">{winner.name}</span>
            </h3>
            
            <p style={{ fontSize: '0.85rem', color: 'var(--text-primary)', lineHeight: 1.4, marginBottom: '12px' }}>
              For a monthly savings of <strong>₹{installment.toLocaleString()}</strong> under a <strong>{trend}</strong> trend, <strong>{winner.name}</strong> offers the highest profit of <strong>₹{Math.round(winner.netProfit).toLocaleString()}</strong>. 
              {winner.type === 'weight' ? (
                ` This is because weight accumulation locks the cheaper gold rate of ₹${Math.round(winner.totalCashPaid / winner.totalWeight).toLocaleString()}/g (average) compared to the final month 12 price of ₹${Math.round(winner.month12Rate).toLocaleString()}/g.`
              ) : (
                " The 100% cash bonus installment offsets the making charges, making it attractive for high-premium design stores."
              )}
            </p>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '6px', fontSize: '0.8rem', color: 'var(--text-secondary)', borderTop: '1px solid rgba(255,255,255,0.05)', paddingTop: '10px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <span>Total Invested (11 Months):</span>
                <span style={{ color: 'var(--text-primary)', fontWeight: 600 }}>₹{(installment * 11).toLocaleString()}</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <span>Jewellery Value Obtained:</span>
                <span style={{ color: 'var(--text-primary)', fontWeight: 600 }}>₹{Math.round(winner.totalWeight * winner.month12Rate * (1 + winner.avgWastage / 100) * 1.03).toLocaleString()}</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <span>Accumulated Gold Weight:</span>
                <span style={{ color: 'var(--text-primary)', fontWeight: 700 }}>{winner.totalWeight.toFixed(3)} grams</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <span>Effective Cost per Gram:</span>
                <span className="gold-text" style={{ fontWeight: 700 }}>₹{Math.round(winner.effectiveRate).toLocaleString()} / g</span>
              </div>
            </div>
          </div>

          <div style={{ marginTop: '16px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', background: 'var(--gold-glow)', padding: '8px 12px', borderRadius: '8px', border: '1px solid var(--border-color)' }}>
            <span style={{ fontSize: '0.75rem', color: 'var(--gold-primary)', fontWeight: 700 }}>ANNUALIZED RETURN (IRR):</span>
            <span style={{ fontSize: '1.1rem', fontWeight: 800 }} className="gold-text">{winner.annualizedIRR.toFixed(1)}%</span>
          </div>
        </div>

        {/* Smart Warnings & Chit Rules */}
        <div style={{ padding: '20px', background: 'rgba(255,255,255,0.02)', border: '1px solid var(--border-color)', borderRadius: '12px', display: 'flex', flexDirection: 'column', gap: '10px', justifyContent: 'space-between' }}>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '4px' }}>
              <Info className="gold-text" size={18} />
              <span style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', fontWeight: 700 }}>CRITICAL CHIT TRADING INSIGHTS</span>
            </div>
            
            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', fontSize: '0.8rem', marginTop: '6px' }}>
              <div style={{ display: 'flex', gap: '8px', alignItems: 'flex-start' }}>
                {trend === 'bullish' || trend === 'moderate' ? (
                  <>
                    <AlertTriangle size={18} style={{ color: 'var(--color-down)', flexShrink: 0, marginTop: '2px' }} />
                    <span style={{ color: 'var(--text-primary)' }}>
                      <strong>Avoid Cash Schemes (like Tanishq)</strong> in rising markets! Locking weight monthly (GRT, Malabar, Lalitha) protects you from price hikes, netting 10-15% extra gold.
                    </span>
                  </>
                ) : (
                  <>
                    <CheckCircle2 size={18} style={{ color: 'var(--color-up)', flexShrink: 0, marginTop: '2px' }} />
                    <span style={{ color: 'var(--text-primary)' }}>
                      <strong>Cash Schemes (Tanishq) preferred</strong> in flat/falling markets, as they provide cash bonuses and you buy gold at the cheaper month-12 price.
                    </span>
                  </>
                )}
              </div>

              <div style={{ display: 'flex', gap: '8px', alignItems: 'flex-start' }}>
                <CheckCircle2 size={18} style={{ color: 'var(--color-up)', flexShrink: 0, marginTop: '2px' }} />
                <span>
                  <strong>Tax Benefit:</strong> In weight-based schemes, when making charges are waived (up to 14/18%), you also save the 3% GST on those making charges.
                </span>
              </div>

              <div style={{ display: 'flex', gap: '8px', alignItems: 'flex-start' }}>
                <AlertTriangle size={18} style={{ color: 'var(--gold-primary)', flexShrink: 0, marginTop: '2px' }} />
                <span>
                  <strong>The 18% Wastage Rule:</strong> Most jewellers waive wastage up to 18%. If you select heavy bridal sets (&gt;18% VA), you must pay the excess wastage in cash at maturity.
                </span>
              </div>
            </div>
          </div>

          <div style={{ fontSize: '0.7rem', color: 'var(--text-muted)', borderTop: '1px solid rgba(255,255,255,0.05)', paddingTop: '8px', lineHeight: 1.3 }}>
            *Disclaimer: IRR (Internal Rate of Return) calculated using monthly cash flow intervals. Savings calculations include GST and standard showroom premiums.
          </div>
        </div>

      </div>

      {/* Comparative Matrix Table */}
      <div style={{ borderTop: '1px solid rgba(255,255,255,0.05)', paddingTop: '16px' }}>
        <h3 style={{ fontSize: '1.1rem', marginBottom: '12px', display: 'flex', alignItems: 'center', gap: '6px' }}>
          <Coins size={18} className="gold-text" />
          Showroom Comparison Matrix (Sorted by Net Profit)
        </h3>
        
        <div style={{ overflowX: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.85rem', textAlign: 'left', minWidth: '700px' }}>
            <thead>
              <tr style={{ borderBottom: '1px solid var(--border-color)', color: 'var(--text-secondary)', fontWeight: 600 }}>
                <th style={{ padding: '12px' }}>Showroom & Scheme</th>
                <th style={{ padding: '12px' }}>Type</th>
                <th style={{ padding: '12px' }}>Gold Weight</th>
                <th style={{ padding: '12px' }}>Wastage Saved</th>
                <th style={{ padding: '12px' }}>Cash Top-up</th>
                <th style={{ padding: '12px' }}>Eff. Rate/g</th>
                <th style={{ padding: '12px' }}>Total Savings</th>
                <th style={{ padding: '12px', textAlign: 'right' }}>Annualized IRR</th>
              </tr>
            </thead>
            <tbody>
              {brandMetrics.map((item, index) => {
                const isSelected = expandedBrand === item.key;
                const isTop = index === 0;

                return (
                  <React.Fragment key={item.key}>
                    <tr 
                      onClick={() => setExpandedBrand(isSelected ? null : item.key)}
                      style={{ 
                        borderBottom: '1px solid rgba(255,255,255,0.02)',
                        background: isTop ? 'rgba(234,179,8,0.03)' : 'transparent',
                        cursor: 'pointer',
                        transition: 'background-color 0.2s'
                      }}
                      className="table-row-hover"
                    >
                      <td style={{ padding: '12px', fontWeight: 600, display: 'flex', alignItems: 'center', gap: '6px' }}>
                        {isSelected ? <ChevronUp size={14} style={{ color: 'var(--gold-primary)' }} /> : <ChevronDown size={14} style={{ color: 'var(--text-muted)' }} />}
                        <div>
                          {item.name}
                          <span style={{ display: 'block', fontSize: '0.7rem', color: 'var(--text-secondary)', fontWeight: 400 }}>{item.badge}</span>
                        </div>
                      </td>
                      <td style={{ padding: '12px' }}>
                        <span style={{
                          fontSize: '0.7rem',
                          padding: '2px 6px',
                          borderRadius: '4px',
                          fontWeight: 700,
                          backgroundColor: item.type === 'weight' ? 'rgba(16,185,129,0.1)' : 'rgba(234,179,8,0.1)',
                          color: item.type === 'weight' ? 'var(--color-up)' : 'var(--gold-primary)',
                          border: `1px solid ${item.type === 'weight' ? 'rgba(16,185,129,0.15)' : 'rgba(234,179,8,0.15)'}`
                        }}>
                          {item.type === 'weight' ? 'Weight-Lock' : 'Cash + Bonus'}
                        </span>
                      </td>
                      <td style={{ padding: '12px', fontWeight: 700 }}>{item.totalWeight.toFixed(3)}g</td>
                      <td style={{ padding: '12px', color: 'var(--color-up)' }}>₹{Math.round(item.wastageSaved).toLocaleString()}</td>
                      <td style={{ padding: '12px', color: item.cashTopUp > 0 ? 'var(--text-primary)' : 'var(--text-muted)' }}>
                        {item.cashTopUp > 0 ? `₹${Math.round(item.cashTopUp).toLocaleString()}` : 'Zero'}
                      </td>
                      <td style={{ padding: '12px' }}>₹{Math.round(item.effectiveRate).toLocaleString()}/g</td>
                      <td style={{ padding: '12px', color: 'var(--color-up)', fontWeight: 700 }}>
                        ₹{Math.round(item.netProfit).toLocaleString()}
                      </td>
                      <td style={{ padding: '12px', textAlign: 'right', fontWeight: 800, color: isTop ? 'var(--gold-primary)' : 'var(--text-primary)' }}>
                        {item.annualizedIRR.toFixed(1)}%
                      </td>
                    </tr>

                    {/* Expandable Detail Panel */}
                    {isSelected && (
                      <tr>
                        <td colSpan={8} style={{ padding: '16px 20px', background: 'rgba(15, 23, 42, 0.4)', borderBottom: '1px solid rgba(253, 224, 71, 0.15)' }}>
                          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '20px' }}>
                            
                            {/* Brand details */}
                            <div>
                              <h4 style={{ fontSize: '0.85rem', color: 'var(--gold-primary)', marginBottom: '8px', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Scheme Features</h4>
                              <div style={{ display: 'flex', flexDirection: 'column', gap: '6px', fontSize: '0.8rem' }}>
                                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                                  <span style={{ color: 'var(--text-secondary)' }}>Showroom Premium:</span>
                                  <span>+₹{retail.brands[item.key].premium} / gram</span>
                                </div>
                                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                                  <span style={{ color: 'var(--text-secondary)' }}>Default VA (Making):</span>
                                  <span>{item.avgWastage.toFixed(1)}%</span>
                                </div>
                                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                                  <span style={{ color: 'var(--text-secondary)' }}>Waiver Limit:</span>
                                  <span>{item.maxWaiver > 0 ? `Up to ${item.maxWaiver.toFixed(1)}% VA` : 'None (Bonus Cash)'}</span>
                                </div>
                                {item.cashBonus > 0 && (
                                  <div style={{ display: 'flex', justifyContent: 'space-between', color: 'var(--color-up)' }}>
                                    <span>Cash Bonus:</span>
                                    <span>₹{item.cashBonus.toLocaleString()} (1 Month)</span>
                                  </div>
                                )}
                              </div>
                            </div>

                            {/* Pros & Cons */}
                            <div>
                              <h4 style={{ fontSize: '0.85rem', color: 'var(--gold-primary)', marginBottom: '8px', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Analysis</h4>
                              <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', fontSize: '0.78rem' }}>
                                <div>
                                  <span style={{ color: 'var(--color-up)', fontWeight: 600, display: 'block', marginBottom: '2px' }}>✓ Advantages</span>
                                  <ul style={{ paddingLeft: '14px', margin: 0, color: 'var(--text-secondary)' }}>
                                    {item.pros.map((pro, i) => <li key={i}>{pro}</li>)}
                                  </ul>
                                </div>
                                <div>
                                  <span style={{ color: 'var(--color-down)', fontWeight: 600, display: 'block', marginBottom: '2px' }}>✗ Disadvantages</span>
                                  <ul style={{ paddingLeft: '14px', margin: 0, color: 'var(--text-secondary)' }}>
                                    {item.cons.map((con, i) => <li key={i}>{con}</li>)}
                                  </ul>
                                </div>
                              </div>
                            </div>

                            {/* Month 1-12 cashflow simulation */}
                            <div>
                              <h4 style={{ fontSize: '0.85rem', color: 'var(--gold-primary)', marginBottom: '8px', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Gold Accumulation Schedule</h4>
                              <div style={{ display: 'flex', flexDirection: 'column', gap: '4px', fontSize: '0.75rem', maxHeight: '140px', overflowY: 'auto', paddingRight: '4px' }}>
                                {item.type === 'weight' ? (
                                  item.monthlyBrandRates.slice(0, 11).map((rate, i) => (
                                    <div key={i} style={{ display: 'flex', justifyContent: 'space-between', color: 'var(--text-secondary)' }}>
                                      <span>Month {i + 1} (Rate: ₹{rate.toLocaleString()}/g):</span>
                                      <span style={{ color: 'var(--text-primary)' }}>+{(installment / rate).toFixed(3)}g</span>
                                    </div>
                                  ))
                                ) : (
                                  <div style={{ color: 'var(--text-secondary)', lineHeight: 1.4 }}>
                                    Cash is saved and gold weight is calculated entirely on Month 12 rate (₹{Math.round(item.month12Rate).toLocaleString()}/g) including the 1-month bonus:
                                    <div style={{ marginTop: '8px', color: 'var(--text-primary)', fontWeight: 600 }}>
                                      Total Credit: ₹{(installment * 11 + item.cashBonus).toLocaleString()}
                                    </div>
                                  </div>
                                )}
                              </div>
                            </div>

                          </div>
                        </td>
                      </tr>
                    )}
                  </React.Fragment>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

    </div>
  );
};
