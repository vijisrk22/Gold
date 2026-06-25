import React, { useState } from 'react';
import { 
  Coins, 
  Info, 
  Award, 
  CheckCircle2, 
  AlertTriangle, 
  ChevronDown,
  ChevronUp,
  HelpCircle,
  Sparkles,
  Target,
  FileText,
  UserCheck,
  ArrowRight,
  Scale
} from 'lucide-react';
import type { RetailData } from '../utils/api';

interface ChitPlannerProps {
  retail: RetailData;
}

interface SchemeDetails {
  name: string;
  type: 'weight' | 'cash';
  bonusFraction: number; // e.g. 1 month bonus = 1.0
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
    bonusFraction: 1.0, 
    maxWaiverPct: 0.0,  
    avgWastagePct: 0.14, 
    trustBadge: 'Highest Purity Guarantee',
    pros: ['100% bonus installment', 'Certified HUID 22K/18K purity', 'Excellent modern designs'],
    cons: ['No gold rate lock-in (cash scheme)', 'No making charge waiver (pay 12-16% wastage)']
  },
  grt: {
    name: 'GRT Golden Eleven',
    type: 'weight',
    bonusFraction: 0.0,
    maxWaiverPct: 0.18, 
    avgWastagePct: 0.11, 
    trustBadge: 'Heritage & Flexi',
    pros: ['Gold rate locked in every month', 'Full wastage waiver up to 18%', 'Traditional south Indian designs'],
    cons: ['No cash bonus', 'Special/custom designs may exceed 18% wastage']
  },
  lalitha: {
    name: 'Lalitha 11-Month Purchase Plan',
    type: 'weight',
    bonusFraction: 0.0,
    maxWaiverPct: 0.14, 
    avgWastagePct: 0.06, 
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
    avgWastagePct: 0.14,
    trustBadge: 'High Detail Design',
    pros: ['Gold rate locked in every month', 'Waives making charges up to 18%', 'Great fine-detail regional designs'],
    cons: ['No cash bonus']
  },
  thangamayil: {
    name: 'Thangamayil Super Gold',
    type: 'weight',
    bonusFraction: 0.0,
    maxWaiverPct: 0.18,
    avgWastagePct: 0.12,
    trustBadge: 'Regional Chain',
    pros: ['Gold rate locked in every month', 'Waives making charges up to 18%', 'Vast presence across TN'],
    cons: ['No cash bonus']
  },
  mangal: {
    name: 'Mangal & Mangal Gold Plan',
    type: 'weight',
    bonusFraction: 0.0,
    maxWaiverPct: 0.15,
    avgWastagePct: 0.10,
    trustBadge: 'Trichy Local Trust',
    pros: ['Gold rate locked in every month', 'Waives making charges up to 15%', 'Highly reputed single-store branch'],
    cons: ['No cash bonus', 'Only located in Trichy']
  },
  atr: {
    name: 'ATR Flexi Savings',
    type: 'cash',
    bonusFraction: 1.0, 
    maxWaiverPct: 0.10, 
    avgWastagePct: 0.10,
    trustBadge: 'Custom Boutique',
    pros: ['100% bonus installment', '10% wastage waiver', 'Ideal for fully customized designs'],
    cons: ['No gold rate lock-in (cash scheme)', 'Fewer ready-made items to choose from']
  },
  tbz: {
    name: 'TBZ Kalpavruksha Scheme',
    type: 'cash',
    bonusFraction: 1.0, 
    maxWaiverPct: 0.0,  
    avgWastagePct: 0.14, 
    trustBadge: 'Heritage Artistry',
    pros: ['100% bonus on 12th installment', 'Valid for premium bridal diamond & gold collections', 'Iconic designer trust'],
    cons: ['No weight locking (cash based)', 'Making charges are on the higher side']
  },
  waman: {
    name: 'Waman Hari Pethe Sanchay Scheme',
    type: 'weight',
    bonusFraction: 0.0,
    maxWaiverPct: 0.14,
    avgWastagePct: 0.09,
    trustBadge: 'Maharashtrian Legacy',
    pros: ['Gold weight locked monthly', 'Specialized Maharashtrian design waivers', 'Highly trusted local brand'],
    cons: ['No direct cash bonus', 'Fewer showrooms outside Maharashtra']
  },
  pcj: {
    name: 'PC Jeweller Jewel Mangal',
    type: 'cash',
    bonusFraction: 1.0,
    maxWaiverPct: 0.0,
    avgWastagePct: 0.12,
    trustBadge: 'Modern Flexi',
    pros: ['Flexible monthly payment options', 'End-of-term cash discount equivalent to 1 month', 'Nationwide exchange networks'],
    cons: ['No rate lock-in protection', 'Making charges apply fully']
  },
  senco: {
    name: 'Senco Swarna Yojana',
    type: 'weight',
    bonusFraction: 0.0,
    maxWaiverPct: 0.18,
    avgWastagePct: 0.10,
    trustBadge: 'Lightweight Specialist',
    pros: ['Monthly weight locking against inflation', 'Up to 18% making charge waiver', 'Excellent light, modern designs'],
    cons: ['No cash installment bonus', 'Showrooms primarily in East/North India']
  },
  pcc: {
    name: 'PC Chandra Dhanvriddhi Scheme',
    type: 'weight',
    bonusFraction: 0.0,
    maxWaiverPct: 0.15,
    avgWastagePct: 0.12,
    trustBadge: 'Bengal Craftsmanship',
    pros: ['Gold rate locked upon installment payment', 'Waivers on premium handcrafted filigree works', 'Excellent buyback guarantees'],
    cons: ['No cash bonus', 'Higher making charges on custom heavy ornaments']
  },
  bhima: {
    name: 'Bhima Golden Key Scheme',
    type: 'weight',
    bonusFraction: 0.0,
    maxWaiverPct: 0.18,
    avgWastagePct: 0.10,
    trustBadge: 'Kerala Pioneer since 1925',
    pros: ['Full weight lock-in against Rupee drop', '18% wastage waiver covers standard ornaments completely', 'Highest purity reputation'],
    cons: ['No direct cash bonus payout']
  },
  ckc: {
    name: 'CKC Paper Gold & Savings Scheme',
    type: 'weight',
    bonusFraction: 0.0,
    maxWaiverPct: 0.20,
    avgWastagePct: 0.16,
    trustBadge: 'Royal Jeweller since 1869',
    pros: ['Weight lock-in protection', 'High making charge waiver up to 20% on royal heritage collections', 'Certified conflict-free gems'],
    cons: ['No cash bonus', 'Higher base premium than average market rate']
  }
};

const solveMonthlyIRR = (monthlyPayment: number, netProfit: number): number => {
  const cashFlows = Array(11).fill(-monthlyPayment);
  cashFlows.push(11 * monthlyPayment + netProfit);
  
  let low = -0.99;
  let high = 5.0; 
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
  // Navigation Tabs
  const [activeTab, setActiveTab] = useState<'wizard' | 'goal' | 'budget'>('wizard');

  // Input states
  const [installment, setInstallment] = useState<number>(5000);
  const [trend, setTrend] = useState<'bullish' | 'moderate' | 'flat' | 'bearish'>('moderate');
  const [wastageScenario, setWastageScenario] = useState<'standard' | 'intricate'>('standard');
  const [expandedBrand, setExpandedBrand] = useState<string | null>(null);

  // Goal Planner States
  const [targetWeight, setTargetWeight] = useState<number>(24); // 24g (3 sovereigns) default
  const [selectedGoalPreset, setSelectedGoalPreset] = useState<string>('necklace');

  // Wizard States
  const [wizardPriority, setWizardPriority] = useState<'weight' | 'design' | 'premium'>('weight');
  const [wizardTrend, setWizardTrend] = useState<'rising' | 'stable' | 'falling'>('rising');
  const [wizardBudget, setWizardBudget] = useState<number>(5000);

  // Growth rates definitions
  const growthRates = {
    bullish: 0.015,   
    moderate: 0.008,  
    flat: 0.0,        
    bearish: -0.008   
  };

  const currentGrowthRate = growthRates[trend];
  const chennaiBaseRate22k = retail.associationRate.gold22k;

  // Project prices
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

  // Calculate generic showroom metrics (for budget calculator)
  const getBrandMetrics = (instVal: number) => {
    return brandKeys.map(key => {
      const brand = retail.brands[key];
      const scheme = BRAND_SCHEMES[key] || BRAND_SCHEMES.grt;
      const avgWastage = wastageScenario === 'intricate' ? 0.16 : scheme.avgWastagePct;
      const maxWaiver = scheme.maxWaiverPct;
      const ratePremium = brand.premium;

      const monthlyBrandRates = projectedBaseRates.map(base => base + ratePremium);
      const month12BrandRate = month12BaseRate + ratePremium;
      const totalInstallments = 11 * instVal;

      let totalWeight = 0;
      let maturityGoldValue = 0;
      let wastageSaved = 0;
      let netWastagePaid = 0;
      let cashTopUp = 0;
      let totalCashPaid = 0;
      let netProfit = 0;
      let cashBonus = 0;

      if (scheme.type === 'weight') {
        const weightPerMonth = monthlyBrandRates.slice(0, 11).map(rate => instVal / rate);
        totalWeight = weightPerMonth.reduce((sum, w) => sum + w, 0);
        maturityGoldValue = totalWeight * month12BrandRate;
        wastageSaved = maturityGoldValue * Math.min(avgWastage, maxWaiver);
        netWastagePaid = maturityGoldValue * Math.max(0, avgWastage - maxWaiver);
        const gst = 0.03 * (maturityGoldValue + netWastagePaid);

        cashTopUp = netWastagePaid + gst;
        totalCashPaid = totalInstallments + cashTopUp;

        const regularWastage = maturityGoldValue * avgWastage;
        const regularGst = 0.03 * (maturityGoldValue + regularWastage);
        const regularCost = maturityGoldValue + regularWastage + regularGst;

        netProfit = regularCost - totalCashPaid;
      } else {
        cashBonus = instVal * scheme.bonusFraction;
        const totalChitCredit = totalInstallments + cashBonus;
        const netWastageMultiplier = 1 + Math.max(0, avgWastage - maxWaiver);
        const goldValue = totalChitCredit / (1.03 * netWastageMultiplier);

        totalWeight = goldValue / month12BrandRate;
        maturityGoldValue = goldValue;
        wastageSaved = goldValue * Math.min(avgWastage, maxWaiver);
        netWastagePaid = goldValue * Math.max(0, avgWastage - maxWaiver);

        cashTopUp = 0;
        totalCashPaid = totalInstallments;

        const regularWastage = goldValue * avgWastage;
        const regularGst = 0.03 * (goldValue + regularWastage);
        const regularCost = goldValue + regularWastage + regularGst;

        netProfit = regularCost - totalCashPaid;
      }

      const effectiveRate = totalCashPaid / totalWeight;
      const monthlyIRR = solveMonthlyIRR(instVal, netProfit);
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
    }).sort((a, b) => b.netProfit - a.netProfit);
  };

  const activeMetrics = getBrandMetrics(installment);
  const winner = activeMetrics[0];

  // Calculations for Goal Planner (Milestone Tracker)
  const goalBrandMetrics = brandKeys.map(key => {
    const brand = retail.brands[key];
    const scheme = BRAND_SCHEMES[key] || BRAND_SCHEMES.grt;
    const avgWastage = wastageScenario === 'intricate' ? 0.16 : scheme.avgWastagePct;
    const maxWaiver = scheme.maxWaiverPct;
    const ratePremium = brand.premium;

    const monthlyBrandRates = projectedBaseRates.map(base => base + ratePremium);
    const month12BrandRate = month12BaseRate + ratePremium;

    let requiredInstallment = 0;
    let totalCashPaid = 0;
    let netProfit = 0;
    let cashTopUp = 0;
    let wastageSaved = 0;
    let netWastagePaid = 0;
    let maturityGoldValue = targetWeight * month12BrandRate;

    if (scheme.type === 'weight') {
      // W_target = I * \sum_{m=1}^{11} (1 / G_brand_m)
      const sumReciprocals = monthlyBrandRates.slice(0, 11).reduce((sum, rate) => sum + (1 / rate), 0);
      requiredInstallment = targetWeight / sumReciprocals;
      
      wastageSaved = maturityGoldValue * Math.min(avgWastage, maxWaiver);
      netWastagePaid = maturityGoldValue * Math.max(0, avgWastage - maxWaiver);
      const gst = 0.03 * (maturityGoldValue + netWastagePaid);
      cashTopUp = netWastagePaid + gst;
      totalCashPaid = requiredInstallment * 11 + cashTopUp;

      const regularWastage = maturityGoldValue * avgWastage;
      const regularGst = 0.03 * (maturityGoldValue + regularWastage);
      const regularCost = maturityGoldValue + regularWastage + regularGst;
      netProfit = regularCost - totalCashPaid;
    } else {
      // Cash Scheme: W_target = goldValue / month12BrandRate
      // goldValue = W_target * month12BrandRate
      // subtotal = goldValue * (1 + max(0, avgWastage - maxWaiver))
      // totalCredit = 1.03 * subtotal = I * (11 + bonusFraction)
      // I = 1.03 * subtotal / (11 + bonusFraction)
      const netWastageMultiplier = 1 + Math.max(0, avgWastage - maxWaiver);
      const goldValue = targetWeight * month12BrandRate;
      const subtotal = goldValue * netWastageMultiplier;
      const totalCredit = 1.03 * subtotal;
      requiredInstallment = totalCredit / (11 + scheme.bonusFraction);

      totalCashPaid = requiredInstallment * 11;
      wastageSaved = goldValue * Math.min(avgWastage, maxWaiver);
      netWastagePaid = goldValue * Math.max(0, avgWastage - maxWaiver);
      cashTopUp = 0;

      const regularWastage = goldValue * avgWastage;
      const regularGst = 0.03 * (goldValue + regularWastage);
      const regularCost = goldValue + regularWastage + regularGst;
      netProfit = regularCost - totalCashPaid;
    }

    const effectiveRate = totalCashPaid / targetWeight;
    const monthlyIRR = solveMonthlyIRR(requiredInstallment, netProfit);
    const annualizedIRR = Math.pow(1 + monthlyIRR, 12) - 1;

    return {
      key,
      name: scheme.name,
      type: scheme.type,
      requiredInstallment,
      totalCashPaid,
      netProfit,
      effectiveRate,
      annualizedIRR: isNaN(annualizedIRR) ? 0 : annualizedIRR * 100,
      badge: scheme.trustBadge,
      wastageSaved,
      cashTopUp,
      avgWastage,
      maxWaiver
    };
  }).sort((a, b) => a.requiredInstallment - b.requiredInstallment); // cheapest monthly installment wins

  const goalWinner = goalBrandMetrics[0];

  // Presets trigger for goal planner
  const selectGoalPreset = (id: string, weight: number) => {
    setSelectedGoalPreset(id);
    setTargetWeight(weight);
  };

  // Wizard matching score calculation
  const getWizardMatch = () => {
    // Priority vs scheme matching logic
    // rateOutlook matches
    const isGoldRising = wizardTrend === 'rising';
    const suggestedType = isGoldRising ? 'weight' : 'cash';

    const rankedMatches = brandKeys.map(key => {
      const brand = retail.brands[key];
      const scheme = BRAND_SCHEMES[key];
      if (!scheme) return null;
      let score = 50;

      // 1. Match on scheme type
      if (scheme.type === suggestedType) {
        score += 30;
      } else {
        score -= 10;
      }

      // 2. Match on priorities
      if (wizardPriority === 'weight') {
        // Lalitha is wholesale low wastage
        if (key === 'lalitha') score += 25;
        else if (scheme.type === 'weight') score += 10;
      } else if (wizardPriority === 'design') {
        // Kalyan, Malabar, AVR are famous for bridal & details
        if (key === 'kalyan' || key === 'malabar' || key === 'avr') score += 20;
      } else if (wizardPriority === 'premium') {
        // Tanishq, Joyalukkas
        if (key === 'tanishq' || key === 'joyalukkas') score += 25;
      }

      // 3. Rate premium checks
      if (brand.premium > 20) {
        score -= 5; // higher rate premium slightly lowers score if user is price-conscious
      } else {
        score += 5;
      }

      return {
        key,
        score,
        brandName: scheme.name,
        badge: scheme.trustBadge,
        type: scheme.type as 'weight' | 'cash',
        avgWastage: scheme.avgWastagePct * 100,
        maxWaiver: scheme.maxWaiverPct * 100
      };
    }).filter((match): match is { key: string, score: number, type: "weight" | "cash", maxWaiver: number, avgWastage: number, badge: string, brandName: string } => match !== null).sort((a, b) => b.score - a.score);

    return rankedMatches[0] || { key: '', score: 0, brandName: '', badge: '', type: 'weight', avgWastage: 0, maxWaiver: 0 };
  };

  const wizardMatch = getWizardMatch();

  // Print Quote Handler
  const handlePrintQuote = (brandKey: string, instVal: number) => {
    const scheme = BRAND_SCHEMES[brandKey];
    const metrics = activeMetrics.find(m => m.key === brandKey) || winner;
    
    const printWindow = window.open('', '_blank');
    if (!printWindow) {
      alert('Pop-up blocked! Please allow pop-ups to download the comparison quote.');
      return;
    }

    const todayStr = new Date().toLocaleDateString(undefined, {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });

    printWindow.document.write(`
      <!DOCTYPE html>
      <html>
        <head>
          <title>Investment Quote - ${scheme.name}</title>
          <style>
            @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800&display=swap');
            body {
              font-family: 'Inter', sans-serif;
              color: #0f172a;
              background: #ffffff;
              padding: 40px;
              line-height: 1.5;
            }
            .header {
              border-bottom: 2px solid #eab308;
              padding-bottom: 20px;
              margin-bottom: 30px;
              display: flex;
              justify-content: space-between;
              align-items: center;
            }
            .title {
              font-size: 26px;
              font-weight: 800;
              color: #0f172a;
              margin: 0;
              letter-spacing: -0.02em;
            }
            .subtitle {
              font-size: 13px;
              color: #64748b;
              margin-top: 4px;
              text-transform: uppercase;
              font-weight: 600;
            }
            .meta-info {
              text-align: right;
              font-size: 13px;
              color: #475569;
            }
            .section {
              margin-bottom: 25px;
            }
            .section-title {
              font-size: 15px;
              font-weight: 700;
              color: #a16207;
              border-bottom: 1px solid #e2e8f0;
              padding-bottom: 6px;
              margin-bottom: 12px;
              text-transform: uppercase;
              letter-spacing: 0.05em;
            }
            .card-grid {
              display: grid;
              grid-template-columns: 1fr 1fr;
              gap: 16px;
              margin-bottom: 20px;
            }
            .quote-card {
              border: 1px solid #e2e8f0;
              background-color: #f8fafc;
              padding: 16px;
              border-radius: 8px;
            }
            .quote-card h4 {
              margin: 0 0 8px 0;
              font-size: 13px;
              color: #64748b;
              text-transform: uppercase;
            }
            .quote-card .value {
              font-size: 22px;
              font-weight: 800;
              color: #0f172a;
            }
            table {
              width: 100%;
              border-collapse: collapse;
              margin-top: 10px;
            }
            th {
              background-color: #f8fafc;
              color: #475569;
              font-weight: 600;
              font-size: 12px;
              text-transform: uppercase;
              padding: 12px;
              border-bottom: 1px solid #cbd5e1;
              text-align: left;
            }
            td {
              padding: 12px;
              border-bottom: 1px solid #f1f5f9;
              font-size: 14px;
            }
            .total-row {
              font-weight: 700;
              background-color: #fefce8;
              border-top: 2px solid #eab308;
            }
            .badge {
              display: inline-block;
              background-color: #fef9c3;
              color: #854d0e;
              font-size: 11px;
              font-weight: 700;
              padding: 2px 8px;
              border-radius: 4px;
              text-transform: uppercase;
            }
            .footer {
              margin-top: 50px;
              border-top: 1px solid #e2e8f0;
              padding-top: 20px;
              text-align: center;
              font-size: 12px;
              color: #94a3b8;
            }
            .sig-area {
              margin-top: 40px;
              display: flex;
              justify-content: space-between;
              padding: 0 20px;
            }
            .sig-box {
              border-top: 1px dashed #cbd5e1;
              width: 200px;
              text-align: center;
              padding-top: 8px;
              font-size: 12px;
              color: #64748b;
            }
            @media print {
              body { padding: 0; }
              button { display: none; }
            }
          </style>
        </head>
        <body>
          <div class="header">
            <div>
              <div class="title"><span class="notranslate">Maatal.com</span> INVESTMENT QUOTE</div>
              <div class="subtitle">Official Scheme Comparison Calculator</div>
            </div>
            <div class="meta-info">
              <div>Date: <strong>${todayStr}</strong></div>
              <div>Quote ID: <strong>ALQ-${Math.floor(100000 + Math.random() * 900000)}</strong></div>
            </div>
          </div>

          <div class="section">
            <div class="section-title">Investment Summary</div>
            <div class="card-grid">
              <div class="quote-card">
                <h4>Selected Showroom & Scheme</h4>
                <div class="value">${scheme.name}</div>
                <div class="badge" style="margin-top: 6px;">${scheme.trustBadge}</div>
              </div>
              <div class="quote-card">
                <h4>Monthly Savings Installment</h4>
                <div class="value">₹${instVal.toLocaleString()}</div>
                <div style="font-size:12px; color:#64748b; margin-top:4px;">Payable: 11 Months</div>
              </div>
            </div>
          </div>

          <div class="section">
            <div class="section-title">Benefit Ledger</div>
            <table>
              <thead>
                <tr>
                  <th>Particulars</th>
                  <th>Chit Savings Route</th>
                  <th>Market Purchase Route</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td>Total Cash Installments Paid (11 Months)</td>
                  <td><strong>₹${(instVal * 11).toLocaleString()}</strong></td>
                  <td>-</td>
                </tr>
                <tr>
                  <td>Brand Base Gold Rate (Month 12)</td>
                  <td>₹${Math.round(metrics.month12Rate).toLocaleString()} / gram</td>
                  <td>₹${Math.round(metrics.month12Rate).toLocaleString()} / gram</td>
                </tr>
                <tr>
                  <td>Acquired Gold Weight</td>
                  <td><strong>${metrics.totalWeight.toFixed(3)} grams</strong></td>
                  <td>${metrics.totalWeight.toFixed(3)} grams</td>
                </tr>
                <tr>
                  <td>Maturity Gold Asset Value (Month 12)</td>
                  <td>₹${Math.round(metrics.maturityGoldValue).toLocaleString()}</td>
                  <td>₹${Math.round(metrics.maturityGoldValue).toLocaleString()}</td>
                </tr>
                <tr>
                  <td>Showroom Making Charges (VA @ ${metrics.avgWastage.toFixed(1)}%)</td>
                  <td>₹${Math.round(metrics.maturityGoldValue * (metrics.avgWastage / 100)).toLocaleString()}</td>
                  <td>₹${Math.round(metrics.maturityGoldValue * (metrics.avgWastage / 100)).toLocaleString()}</td>
                </tr>
                <tr>
                  <td><strong>Wastage Waiver Savings (VA Discount)</strong></td>
                  <td style="color:#15803d; font-weight:600;">- ₹${Math.round(metrics.wastageSaved).toLocaleString()} (Waived)</td>
                  <td>₹0 (No Discount)</td>
                </tr>
                <tr>
                  <td>Taxable Subtotal</td>
                  <td>₹${Math.round(metrics.maturityGoldValue + metrics.netWastagePaid).toLocaleString()}</td>
                  <td>₹${Math.round(metrics.maturityGoldValue + (metrics.maturityGoldValue * (metrics.avgWastage / 100))).toLocaleString()}</td>
                </tr>
                <tr>
                  <td>Goods & Services Tax (3% GST)</td>
                  <td>₹${Math.round(0.03 * (metrics.maturityGoldValue + metrics.netWastagePaid)).toLocaleString()}</td>
                  <td>₹${Math.round(0.03 * (metrics.maturityGoldValue + (metrics.maturityGoldValue * (metrics.avgWastage / 100)))).toLocaleString()}</td>
                </tr>
                <tr class="total-row">
                  <td>Net Cost / Cash Outflow</td>
                  <td>₹${Math.round(metrics.totalCashPaid).toLocaleString()}</td>
                  <td>₹${Math.round(metrics.maturityGoldValue * (1 + metrics.avgWastage / 100) * 1.03).toLocaleString()}</td>
                </tr>
                <tr class="total-row" style="background-color: #f0fdf4;">
                  <td style="color: #166534;">NET CHIT PROFIT & SAVINGS</td>
                  <td colspan="2" style="color: #166534; font-size: 16px;">₹${Math.round(metrics.netProfit).toLocaleString()} (${metrics.annualizedIRR.toFixed(1)}% Annualized IRR)</td>
                </tr>
              </tbody>
            </table>
          </div>

          <div class="section" style="margin-top: 20px;">
            <div class="section-title">Disclaimers & Notes</div>
            <ul style="font-size: 11px; color:#64748b; padding-left: 18px;">
              <li>Weight-Lock calculations are based on the selected rate trend of <strong>${trend.toUpperCase()}</strong>. Actual gold rates will vary according to market bullion spot changes.</li>
              <li>GST rates are calculated at the official Indian tariff of 3%. Making charge waivers apply up to the limits set by each brand.</li>
              <li>The Internal Rate of Return (IRR) solves the monthly discount rate that zeroes the NPV of savings and is annualized.</li>
            </ul>
          </div>

          <div class="sig-area">
            <div class="sig-box">Investor Signature</div>
            <div class="sig-box">Maatal.com Advisor Seal</div>
          </div>

          <div class="footer">
            Generated via Maatal.com Gold Comparison Dashboard. Clean paper copies are tax-advisory summaries only.
          </div>
        </body>
      </html>
    `);
    printWindow.document.close();
    printWindow.print();
  };

  // SVG Chart Dimensions & Computations
  const renderGrowthChart = () => {
    // Render an SVG bar chart showing the return comparison of three options:
    // 1. Weight-Lock Chit (cheapest effective rate / most value)
    // 2. Cash Chit (installments + 1 month bonus)
    // 3. Mattress Cash Savings (putting ₹installment in cash every month)
    const mattressValue = installment * 11;
    const cashChitValue = mattressValue + installment; // +1 month bonus
    
    // Weight chit asset value at Month 12 gold price
    // (Value of gold acquired + GST + Wastage saved)
    const weightChitWinner = activeMetrics.find(m => m.type === 'weight') || winner;
    const weightChitValue = weightChitWinner.totalWeight * weightChitWinner.month12Rate * (1 + weightChitWinner.avgWastage / 100) * 1.03;

    // SVG scaling variables
    const chartHeight = 220;
    const chartWidth = 500;
    const maxVal = Math.max(weightChitValue, cashChitValue, mattressValue) * 1.15;

    const scaleY = (val: number) => chartHeight - (val / maxVal) * chartHeight;

    const wHeight = (weightChitValue / maxVal) * chartHeight;
    const cHeight = (cashChitValue / maxVal) * chartHeight;
    const mHeight = (mattressValue / maxVal) * chartHeight;

    return (
      <div style={{ background: 'rgba(255,255,255,0.01)', border: '1px solid var(--border-color)', borderRadius: '12px', padding: '20px', display: 'flex', flexDirection: 'column', gap: '16px' }}>
        <h4 style={{ fontSize: '0.9rem', color: 'var(--gold-primary)', display: 'flex', alignItems: 'center', gap: '6px' }}>
          <Scale size={16} />
          Visual Maturity Asset Value (Month 12 Yield)
        </h4>

        <div style={{ display: 'flex', justifyContent: 'center', margin: '10px 0' }}>
          <svg viewBox={`0 0 ${chartWidth} 260`} width="100%" height="240" style={{ overflow: 'visible' }}>
            {/* Gradients */}
            <defs>
              <linearGradient id="weightGrad" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#fef08a" />
                <stop offset="100%" stopColor="#ca8a04" />
              </linearGradient>
              <linearGradient id="cashGrad" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#67e8f9" />
                <stop offset="100%" stopColor="#0891b2" />
              </linearGradient>
              <linearGradient id="mattressGrad" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#94a3b8" />
                <stop offset="100%" stopColor="#475569" />
              </linearGradient>
            </defs>

            {/* Grid lines */}
            <line x1="40" y1={chartHeight} x2={chartWidth} y2={chartHeight} stroke="rgba(255,255,255,0.1)" strokeWidth="1" />
            <line x1="40" y1={chartHeight / 2} x2={chartWidth} y2={chartHeight / 2} stroke="rgba(255,255,255,0.05)" strokeDasharray="4 4" />
            <line x1="40" y1="20" x2={chartWidth} y2="20" stroke="rgba(255,255,255,0.05)" strokeDasharray="4 4" />

            {/* Mattress Bar */}
            <rect 
              x="60" 
              y={scaleY(mattressValue)} 
              width="90" 
              height={mHeight} 
              fill="url(#mattressGrad)" 
              rx="8" 
              style={{ transition: 'all 0.5s ease-in-out' }}
            />
            {/* Cash Chit Bar */}
            <rect 
              x="200" 
              y={scaleY(cashChitValue)} 
              width="90" 
              height={cHeight} 
              fill="url(#cashGrad)" 
              rx="8" 
              style={{ transition: 'all 0.5s ease-in-out' }}
            />
            {/* Weight Lock Chit Bar */}
            <rect 
              x="340" 
              y={scaleY(weightChitValue)} 
              width="90" 
              height={wHeight} 
              fill="url(#weightGrad)" 
              rx="8" 
              style={{ transition: 'all 0.5s ease-in-out' }}
            />

            {/* Labels and values above bars */}
            <text x="105" y={scaleY(mattressValue) - 10} textAnchor="middle" fill="var(--text-secondary)" fontSize="12" fontWeight="700">
              ₹{Math.round(mattressValue).toLocaleString()}
            </text>
            <text x="245" y={scaleY(cashChitValue) - 10} textAnchor="middle" fill="#22d3ee" fontSize="12" fontWeight="700">
              ₹{Math.round(cashChitValue).toLocaleString()}
            </text>
            <text x="385" y={scaleY(weightChitValue) - 10} textAnchor="middle" fill="var(--gold-light)" fontSize="13" fontWeight="800">
              ₹{Math.round(weightChitValue).toLocaleString()}
            </text>

            {/* Bottom labels */}
            <text x="105" y={chartHeight + 20} textAnchor="middle" fill="var(--text-muted)" fontSize="11" fontWeight="600">
              Mattress Cash
            </text>
            <text x="105" y={chartHeight + 35} textAnchor="middle" fill="var(--text-muted)" fontSize="10">
              (No Returns)
            </text>

            <text x="245" y={chartHeight + 20} textAnchor="middle" fill="#0891b2" fontSize="11" fontWeight="600">
              Cash Chit + Bonus
            </text>
            <text x="245" y={chartHeight + 35} textAnchor="middle" fill="var(--text-muted)" fontSize="10">
              (Tanishq / ATR)
            </text>

            <text x="385" y={chartHeight + 20} textAnchor="middle" fill="var(--gold-primary)" fontSize="11" fontWeight="700">
              Weight-Lock Chit
            </text>
            <text x="385" y={chartHeight + 35} textAnchor="middle" fill="var(--gold-light)" fontSize="10" fontWeight="600">
              (Winner: {weightChitWinner.name})
            </text>

            {/* Glow / Savings callout indicator */}
            {weightChitValue > mattressValue && (
              <path 
                d={`M 155 ${scaleY(mattressValue)} L 335 ${scaleY(weightChitValue)}`} 
                stroke="var(--gold-primary)" 
                strokeWidth="2" 
                strokeDasharray="4 4"
              />
            )}
          </svg>
        </div>

        <div style={{ padding: '12px 14px', background: 'rgba(234,179,8,0.03)', border: '1px solid rgba(234,179,8,0.1)', borderRadius: '8px', fontSize: '0.8rem', color: 'var(--text-secondary)', lineHeight: 1.4 }}>
          <strong>Inflation Hedge Math:</strong> Saving ₹{installment.toLocaleString()}/month in bank deposits gets you ₹{mattressValue.toLocaleString()} at maturity. But locking gold rates monthly in a weight chit protects you from gold inflation. Under the <strong>{trend}</strong> projection, a weight chit nets you jewellery valued at <strong>₹{Math.round(weightChitValue).toLocaleString()}</strong>, yielding a massive savings differential of <strong>₹{Math.round(weightChitValue - mattressValue).toLocaleString()}</strong>!
        </div>
      </div>
    );
  };

  return (
    <div className="glass-panel" style={{ padding: '24px', display: 'flex', flexDirection: 'column', gap: '24px', marginBottom: '32px' }}>
      
      {/* Header Area */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid rgba(255,255,255,0.05)', paddingBottom: '16px', flexWrap: 'wrap', gap: '16px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <div style={{ background: 'var(--gold-glow)', padding: '10px', borderRadius: '12px', border: '1px solid var(--border-color)', display: 'flex', alignItems: 'center' }}>
            <Sparkles className="gold-text" size={24} />
          </div>
          <div>
            <h2 style={{ fontSize: '1.5rem', display: 'flex', alignItems: 'center', gap: '8px', lineHeight: 1.2 }}>
              11-Month Gold Savings Suite
              <span style={{ fontSize: '0.75rem', background: 'var(--gold-glow)', color: 'var(--gold-primary)', padding: '2px 8px', borderRadius: '100px', border: '1px solid var(--border-color)', fontWeight: 600 }}>Active Advice Feed</span>
            </h2>
            <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>Maximize your purchase weight & interest returns across leading jewellery brands</p>
          </div>
        </div>

        {/* Tab Selection */}
        <div style={{ display: 'flex', background: 'rgba(255,255,255,0.03)', padding: '4px', borderRadius: '8px', border: '1px solid var(--border-color)' }}>
          {[
            { id: 'wizard', label: 'Match Wizard', icon: <UserCheck size={14} /> },
            { id: 'goal', label: 'Goal Planner', icon: <Target size={14} /> },
            { id: 'budget', label: 'Budget Calculator', icon: <Coins size={14} /> }
          ].map(tab => (
            <button
              key={tab.id}
              onClick={() => {
                setActiveTab(tab.id as any);
                setExpandedBrand(null);
              }}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '6px',
                padding: '8px 14px',
                fontSize: '0.8rem',
                fontWeight: 600,
                border: 'none',
                borderRadius: '6px',
                cursor: 'pointer',
                background: activeTab === tab.id ? 'var(--gold-primary)' : 'transparent',
                color: activeTab === tab.id ? '#000' : 'var(--text-primary)',
                transition: 'all 0.2s'
              }}
            >
              {tab.icon}
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      {/* Main Mode Panel Body */}
      {activeTab === 'wizard' && (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '24px' }}>
          {/* Wizard Controls */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '20px', background: 'rgba(255,255,255,0.01)', border: '1px solid var(--border-color)', padding: '20px', borderRadius: '12px' }}>
            <h3 style={{ fontSize: '1.1rem', display: 'flex', alignItems: 'center', gap: '6px' }}>
              <UserCheck size={18} className="gold-text" />
              Find Your Perfect Savings Scheme Match
            </h3>

            {/* Step 1: Savings Goal Priority */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
              <label style={{ fontSize: '0.85rem', fontWeight: 600, color: 'var(--text-secondary)' }}>1. What is your buying preference?</label>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                {[
                  { id: 'weight', title: 'Maximize Gold Weight', desc: 'Cheapest overall rates, basic designs, simple savings.' },
                  { id: 'design', title: 'Bridal & Designer Ornaments', desc: 'Heavy wastage jewellery, large collection choice.' },
                  { id: 'premium', title: 'Premium Branding & Gifting', desc: 'Tata/Tanishq designer collections, certified purity.' }
                ].map(item => (
                  <button
                    key={item.id}
                    onClick={() => setWizardPriority(item.id as any)}
                    style={{
                      padding: '10px 12px',
                      textAlign: 'left',
                      backgroundColor: wizardPriority === item.id ? 'var(--gold-glow)' : 'rgba(255,255,255,0.01)',
                      border: wizardPriority === item.id ? '1px solid var(--gold-primary)' : '1px solid rgba(255,255,255,0.05)',
                      borderRadius: '8px',
                      cursor: 'pointer',
                      transition: 'all 0.2s'
                    }}
                  >
                    <div style={{ fontSize: '0.85rem', fontWeight: 700, color: wizardPriority === item.id ? 'var(--gold-primary)' : 'var(--text-primary)' }}>{item.title}</div>
                    <div style={{ fontSize: '0.7rem', color: 'var(--text-secondary)', marginTop: '2px' }}>{item.desc}</div>
                  </button>
                ))}
              </div>
            </div>

            {/* Step 2: Rate Outlook */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
              <label style={{ fontSize: '0.85rem', fontWeight: 600, color: 'var(--text-secondary)' }}>2. What is your gold price outlook?</label>
              <div style={{ display: 'flex', gap: '8px' }}>
                {[
                  { id: 'rising', label: 'Will Rise 📈' },
                  { id: 'stable', label: 'Stable ➖' },
                  { id: 'falling', label: 'Will Drop 📉' }
                ].map(item => (
                  <button
                    key={item.id}
                    onClick={() => {
                      setWizardTrend(item.id as any);
                      // sync to main trend projection
                      if (item.id === 'rising') setTrend('moderate');
                      else if (item.id === 'stable') setTrend('flat');
                      else setTrend('bearish');
                    }}
                    style={{
                      flex: 1,
                      padding: '10px 8px',
                      fontSize: '0.8rem',
                      fontWeight: 600,
                      backgroundColor: wizardTrend === item.id ? 'var(--gold-glow)' : 'rgba(255,255,255,0.01)',
                      border: wizardTrend === item.id ? '1px solid var(--gold-primary)' : '1px solid rgba(255,255,255,0.05)',
                      borderRadius: '8px',
                      cursor: 'pointer',
                      transition: 'all 0.2s',
                      textAlign: 'center'
                    }}
                  >
                    {item.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Step 3: Monthly Budget */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline' }}>
                <label style={{ fontSize: '0.85rem', fontWeight: 600, color: 'var(--text-secondary)' }}>3. Monthly Savings Budget</label>
                <span style={{ fontSize: '1.1rem', fontWeight: 800 }} className="gold-text">₹{wizardBudget.toLocaleString()}</span>
              </div>
              <input 
                type="range" 
                min="1000" 
                max="50000" 
                step="1000"
                value={wizardBudget}
                onChange={(e) => {
                  setWizardBudget(parseInt(e.target.value, 10));
                  setInstallment(parseInt(e.target.value, 10)); // sync to budget tab
                }}
                style={{ width: '100%', accentColor: 'var(--gold-primary)', cursor: 'pointer' }}
              />
            </div>
          </div>

          {/* Wizard Results Banner */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '20px', justifyContent: 'space-between' }}>
            <div style={{ padding: '24px', background: 'linear-gradient(135deg, var(--bg-surface) 0%, rgba(234, 179, 8, 0.1) 100%)', border: '1px solid var(--gold-primary)', borderRadius: '12px', boxShadow: 'var(--shadow-glow)' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px' }}>
                <Sparkles size={20} className="gold-text" />
                <span style={{ fontSize: '0.75rem', color: 'var(--gold-primary)', fontWeight: 700, letterSpacing: '0.05em' }}>PERSONALIZED MATCH VERDICT</span>
              </div>

              <h3 style={{ fontSize: '1.4rem', margin: '4px 0 10px 0', color: 'var(--text-primary)' }}>
                Perfect Match: <span className="gold-text">{wizardMatch.brandName}</span>
              </h3>

              <p style={{ fontSize: '0.85rem', color: 'var(--text-primary)', lineHeight: 1.4, marginBottom: '16px' }}>
                Based on your preference for <strong>{wizardPriority === 'weight' ? 'maximizing gold weight' : wizardPriority === 'design' ? ' bridal styles' : 'premium shopping trust'}</strong> and a <strong>{wizardTrend}</strong> gold rate outlook, <strong>{wizardMatch.brandName}</strong> is your ideal fit. 
                {wizardMatch.type === 'weight' ? (
                  " Weight-Locking schemes lock the price on your savings day, securing more grams in a rising gold market."
                ) : (
                  " Paying in cash with a bonus month installment shields you from losing money if making charges at premium stores are high."
                )}
              </p>

              <div style={{ padding: '12px', background: 'var(--bg-main)', borderRadius: '8px', border: '1px solid var(--border-color)', display: 'flex', flexDirection: 'column', gap: '6px', fontSize: '0.8rem', color: 'var(--text-secondary)' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                  <span>Scheme Mode:</span>
                  <span style={{ color: 'var(--text-primary)', fontWeight: 600 }}>{wizardMatch.type === 'weight' ? 'Weight-Lock Accumulation' : 'Cash + Bonus Credit'}</span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                  <span>Showroom Purity Badge:</span>
                  <span style={{ color: 'var(--gold-primary)', fontWeight: 700 }}>{wizardMatch.badge}</span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                  <span>Average Wastage:</span>
                  <span style={{ color: 'var(--text-primary)', fontWeight: 600 }}>{wizardMatch.avgWastage.toFixed(0)}% VA</span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                  <span>Wastage Waiver Limit:</span>
                  <span style={{ color: 'var(--color-up)', fontWeight: 600 }}>{wizardMatch.maxWaiver > 0 ? `Up to ${wizardMatch.maxWaiver.toFixed(0)}%` : 'No Waiver (Bonus Cash)'}</span>
                </div>
              </div>
            </div>

            <div style={{ display: 'flex', gap: '12px' }}>
              <button
                onClick={() => {
                  setActiveTab('budget');
                  setExpandedBrand(wizardMatch.key);
                }}
                className="btn-gold"
                style={{ flex: 1, padding: '12px', justifyContent: 'center' }}
              >
                Configure Cashflows
                <ArrowRight size={16} />
              </button>

              <button
                onClick={() => handlePrintQuote(wizardMatch.key, wizardBudget)}
                style={{
                  flex: 1,
                  padding: '12px',
                  backgroundColor: 'rgba(255,255,255,0.03)',
                  border: '1px solid var(--border-color)',
                  color: 'var(--text-primary)',
                  fontWeight: 600,
                  borderRadius: '8px',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '8px'
                }}
              >
                <FileText size={16} className="gold-text" />
                Print Quote
              </button>
            </div>
          </div>
        </div>
      )}

      {activeTab === 'goal' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
          {/* Goal Targets Picker */}
          <div style={{ background: 'rgba(255,255,255,0.01)', border: '1px solid var(--border-color)', padding: '20px', borderRadius: '12px', display: 'flex', flexDirection: 'column', gap: '16px' }}>
            <div>
              <h3 style={{ fontSize: '1.1rem', display: 'flex', alignItems: 'center', gap: '6px', marginBottom: '4px' }}>
                <Target size={18} className="gold-text" />
                Select Your Saving Milestone Target
              </h3>
              <p style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>Choose a preset milestone template or input your specific gold weight target below</p>
            </div>

            {/* Presets Cards */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(130px, 1fr))', gap: '12px' }}>
              {[
                { id: 'ring', label: 'Diamond Ring', weight: 4, icon: '💍' },
                { id: 'diwali', label: 'Diwali Coin', weight: 8, icon: '🪙' },
                { id: 'bangle', label: 'Gold Bangles', weight: 16, icon: '📿' },
                { id: 'necklace', label: 'Bridal Necklace', weight: 24, icon: '👑' },
                { id: 'wedding', label: 'Wedding Set', weight: 48, icon: '💝' }
              ].map(preset => (
                <button
                  key={preset.id}
                  onClick={() => selectGoalPreset(preset.id, preset.weight)}
                  style={{
                    padding: '12px 8px',
                    textAlign: 'center',
                    backgroundColor: selectedGoalPreset === preset.id ? 'var(--gold-glow)' : 'rgba(255,255,255,0.01)',
                    border: selectedGoalPreset === preset.id ? '1px solid var(--gold-primary)' : '1px solid rgba(255,255,255,0.05)',
                    borderRadius: '8px',
                    cursor: 'pointer',
                    transition: 'all 0.2s'
                  }}
                >
                  <span style={{ fontSize: '1.4rem', display: 'block', marginBottom: '4px' }}>{preset.icon}</span>
                  <span style={{ fontSize: '0.8rem', fontWeight: 700, display: 'block', color: selectedGoalPreset === preset.id ? 'var(--gold-primary)' : 'var(--text-primary)' }}>{preset.label}</span>
                  <span style={{ fontSize: '0.65rem', color: 'var(--text-secondary)' }}>{preset.weight} grams</span>
                </button>
              ))}
            </div>

            {/* Custom Input */}
            <div style={{ borderTop: '1px solid rgba(255,255,255,0.05)', paddingTop: '16px', display: 'flex', alignItems: 'center', gap: '16px', flexWrap: 'wrap' }}>
              <div style={{ flex: 1, minWidth: '200px' }}>
                <label style={{ fontSize: '0.8rem', fontWeight: 600, color: 'var(--text-secondary)', display: 'block', marginBottom: '4px' }}>Custom Weight Target (Grams)</label>
                <input 
                  type="number" 
                  className="custom-input"
                  value={targetWeight}
                  onChange={(e) => {
                    setTargetWeight(Math.max(0.5, parseFloat(e.target.value) || 0));
                    setSelectedGoalPreset('custom');
                  }}
                  step="0.5"
                  min="0.5"
                />
              </div>

              <div style={{ flex: 2, minWidth: '280px', padding: '12px 16px', background: 'var(--gold-glow)', border: '1px solid var(--border-color)', borderRadius: '8px' }}>
                <span style={{ fontSize: '0.75rem', color: 'var(--gold-primary)', fontWeight: 700, display: 'block' }}>MILESTONE ADVISOR VERDICT</span>
                <span style={{ fontSize: '0.85rem', color: 'var(--text-primary)', marginTop: '2px', display: 'block', lineHeight: 1.3 }}>
                  To secure a <strong>{targetWeight}g</strong> gold asset, the cheapest route is <strong>{goalWinner.name}</strong>, requiring a monthly installment of just <strong style={{ color: 'var(--gold-light)' }}>₹{Math.round(goalWinner.requiredInstallment).toLocaleString()}/month</strong>. You will save a total of <strong>₹{Math.round(goalWinner.netProfit).toLocaleString()}</strong> in making charges.
                </span>
              </div>
            </div>
          </div>

          {/* Goal Matrix Comparison */}
          <div>
            <h3 style={{ fontSize: '1.1rem', marginBottom: '12px', display: 'flex', alignItems: 'center', gap: '6px' }}>
              <Scale size={18} className="gold-text" />
              Monthly Installment Required for {targetWeight}g (Sorted by Cheapest)
            </h3>
            
            <div style={{ overflowX: 'auto' }}>
              <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.85rem', textAlign: 'left', minWidth: '700px' }}>
                <thead>
                  <tr style={{ borderBottom: '1px solid var(--border-color)', color: 'var(--text-secondary)', fontWeight: 600 }}>
                    <th style={{ padding: '12px' }}>Showroom & Scheme</th>
                    <th style={{ padding: '12px' }}>Type</th>
                    <th style={{ padding: '12px' }}>Required Monthly Payment</th>
                    <th style={{ padding: '12px' }}>Total Cash Outflow</th>
                    <th style={{ padding: '12px' }}>Wastage Savings</th>
                    <th style={{ padding: '12px' }}>Effective Gold Cost</th>
                    <th style={{ padding: '12px', textAlign: 'right' }}>Total Savings</th>
                  </tr>
                </thead>
                <tbody>
                  {goalBrandMetrics.map((item, index) => {
                    const isTop = index === 0;
                    return (
                      <tr 
                        key={item.key} 
                        style={{ 
                          borderBottom: '1px solid rgba(255,255,255,0.02)',
                          background: isTop ? 'rgba(234,179,8,0.03)' : 'transparent'
                        }}
                      >
                        <td style={{ padding: '12px', fontWeight: 600 }}>
                          {item.name}
                          <span style={{ display: 'block', fontSize: '0.7rem', color: 'var(--text-secondary)', fontWeight: 400 }}>{item.badge}</span>
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
                        <td style={{ padding: '12px', fontWeight: 800 }} className="gold-text">
                          ₹{Math.round(item.requiredInstallment).toLocaleString()} <span style={{ fontSize: '0.7rem', color: 'var(--text-secondary)', fontWeight: 400 }}>/ mo</span>
                        </td>
                        <td style={{ padding: '12px' }}>₹{Math.round(item.totalCashPaid).toLocaleString()}</td>
                        <td style={{ padding: '12px', color: 'var(--color-up)' }}>₹{Math.round(item.wastageSaved).toLocaleString()}</td>
                        <td style={{ padding: '12px' }}>₹{Math.round(item.effectiveRate).toLocaleString()}/g</td>
                        <td style={{ padding: '12px', textAlign: 'right', fontWeight: 800, color: 'var(--color-up)' }}>
                          ₹{Math.round(item.netProfit).toLocaleString()}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {activeTab === 'budget' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
          {/* Controls Panel */}
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
                onChange={(e) => {
                  setInstallment(parseInt(e.target.value, 10));
                  setWizardBudget(parseInt(e.target.value, 10)); // sync to wizard
                }}
                style={{ width: '100%', accentColor: 'var(--gold-primary)', cursor: 'pointer' }}
              />
              <div style={{ display: 'flex', gap: '6px' }}>
                {[2000, 5000, 10000, 20000].map(val => (
                  <button
                    key={val}
                    onClick={() => {
                      setInstallment(val);
                      setWizardBudget(val);
                    }}
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
                    onClick={() => {
                      setTrend(item.id as any);
                      // sync back to wizard
                      if (item.id === 'bullish' || item.id === 'moderate') setWizardTrend('rising');
                      else if (item.id === 'flat') setWizardTrend('stable');
                      else setWizardTrend('falling');
                    }}
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

            {/* Ornament Complexity */}
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
                    <span style={{ fontSize: '0.7rem', color: 'var(--text-secondary)' }}>Uses average making charges of each showroom (6% to 14%)</span>
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

          {/* Quick advisor section */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '20px', alignItems: 'stretch' }}>
            
            {/* Dynamic Recommendation Panel */}
            <div style={{ padding: '20px', background: 'linear-gradient(135deg, rgba(7, 10, 19, 0.9) 0%, rgba(234, 179, 8, 0.04) 100%)', border: '1px solid var(--border-color)', borderRadius: '12px', display: 'flex', flexDirection: 'column', justifyItems: 'stretch', justifyContent: 'space-between' }}>
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
                  {activeMetrics.map((item, index) => {
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

                                  <div style={{ marginTop: '12px', display: 'flex', gap: '8px' }}>
                                    <button 
                                      onClick={() => handlePrintQuote(item.key, installment)}
                                      className="btn-gold" 
                                      style={{ padding: '6px 12px', fontSize: '0.75rem' }}
                                    >
                                      <FileText size={12} />
                                      Print Invoice Quote
                                    </button>
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
      )}

      {/* SVG Asset Growth and Inflation Chart */}
      {renderGrowthChart()}

    </div>
  );
};
