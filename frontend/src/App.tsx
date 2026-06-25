import { useState, useEffect } from 'react';
import { 
  Sparkles, 
  Coins, 
  RotateCw, 
  AlertCircle, 
  BookOpen, 
  Sun, 
  Moon, 
  ArrowUpRight,
  Info,
  MapPin
} from 'lucide-react';
import { fetchGoldRates, getSavedOverrides } from './utils/api';
import type { GoldRatesPayload } from './utils/api';
import { StockMarketTicker } from './components/StockMarketTicker';
import { GoldCard } from './components/GoldCard';
import { Calculator } from './components/Calculator';
import { RateEditor } from './components/RateEditor';
import { ChitPlanner } from './components/ChitPlanner';
import { HistoricalChart } from './components/HistoricalChart';
import { MarketInsights } from './components/MarketInsights';
import { InvestmentComparison } from './components/InvestmentComparison';

const DAILY_TIPS = [
  "Look for the BIS Hallmark: Ensure your jewelry has the BIS logo, purity grade (e.g. 22K916), and the unique 6-digit HUID code before paying.",
  "Bargain on Making Charges: Wastage charges (Value Addition) are highly negotiable. You can often get discounts of 10% to 20% on these charges.",
  "Avoid Weekend Buying: Retail gold rates are locked on Friday evening and do not change on Saturday/Sunday. If spot prices drop on the weekend, wait for Monday morning.",
  "Understand GST: GST on gold is exactly 3% of the final jewelry price (Gold value + Making charges). Always ask for a printed tax invoice.",
  "Gold BeES for investment: If you want to invest in gold without storage fees or making charges, buy Nippon India Gold BeES ETF on the stock exchange.",
  "The Scrap Value Rule: When selling or exchange old gold, jewellers deduct melt wastage. Keep bills of original purchases to claim maximum value.",
  "Compare KDM vs Hallmarked: KDM gold is soldered with cadmium, which is unhealthy. Insist on modern Hallmarked gold soldered with zinc/copper."
];

export default function App() {
  const [data, setData] = useState<GoldRatesPayload | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [theme, setTheme] = useState<'dark' | 'light'>('dark');
  const [lastRefreshed, setLastRefreshed] = useState<Date>(new Date());
  const [tipIndex, setTipIndex] = useState<number>(0);
  const [isRefreshing, setIsRefreshing] = useState<boolean>(false);
  const [location, setLocation] = useState<string>('chennai');

  // Set the current tip index based on day of the month
  useEffect(() => {
    const day = new Date().getDate();
    setTipIndex(day % DAILY_TIPS.length);
  }, []);

  const loadRates = async (currentLoc = location) => {
    setIsRefreshing(true);
    try {
      const payload = await fetchGoldRates(currentLoc);
      setData(payload);
      setLastRefreshed(new Date());
      setError(null);
    } catch (err: any) {
      setError(err.message || 'Failed to fetch rates');
    } finally {
      setLoading(false);
      setIsRefreshing(false);
    }
  };

  useEffect(() => {
    loadRates(location);
  }, [location]);

  // Poll every 30 seconds
  useEffect(() => {
    const interval = setInterval(() => loadRates(location), 30000);
    return () => clearInterval(interval);
  }, [location]);

  // Theme Toggler
  const toggleTheme = () => {
    const nextTheme = theme === 'dark' ? 'light' : 'dark';
    setTheme(nextTheme);
    document.documentElement.setAttribute('data-theme', nextTheme);
  };

  // Sparkline mockup points (historical variations to show dynamic trends)
  const getMockSparkline = (base: number, type: 'up' | 'down' | 'volatile') => {
    if (type === 'up') return [base - 80, base - 60, base - 30, base - 45, base - 10, base + 20, base];
    if (type === 'down') return [base + 90, base + 60, base + 80, base + 40, base + 30, base + 10, base];
    return [base - 20, base + 35, base - 10, base + 45, base - 40, base + 20, base];
  };

  if (loading) {
    return (
      <div style={{ display: 'flex', flexDirection: 'column', height: '100vh', justifyContent: 'center', alignItems: 'center', background: '#070a13', color: '#fff', gap: '16px' }}>
        <div style={{ width: '40px', height: '40px', border: '3px solid var(--border-color)', borderTopColor: 'var(--gold-primary)', borderRadius: '50%', animation: 'float 1s infinite linear' }}></div>
        <h2 style={{ fontFamily: 'var(--font-display)', fontWeight: 600 }} className="gold-text">Synchronizing Gold Exchanges...</h2>
        <p style={{ fontSize: '0.85rem', color: '#64748b' }}>Fetching live rates and scrapers...</p>
      </div>
    );
  }

  const overrides = getSavedOverrides();
  const showManualBadge = overrides.enabled;

  // Arbitrage math
  const india24k = data?.retail.associationRate.gold24k || 14335;
  const dubai24k = data?.retail.dubai.gold24k_inr || 12493;
  const savingsPerGram = india24k - dubai24k;
  const savingsPercent = (savingsPerGram / india24k) * 100;

  return (
    <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column', backgroundColor: 'var(--bg-main)' }}>
      
      {/* Top Banner Marquee Ticker */}
      {data && <StockMarketTicker market={data.market} />}

      {/* Header Area */}
      <header style={{ borderBottom: '1px solid var(--border-color)', padding: '16px 24px', background: 'rgba(7, 10, 19, 0.4)', backdropFilter: 'blur(8px)', zIndex: 10 }}>
        <div style={{ maxWidth: '1280px', margin: '0 auto', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '12px' }}>
          
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <div style={{ background: 'var(--gold-glow)', padding: '8px', borderRadius: '10px', border: '1px solid var(--border-color)' }}>
              <Coins className="gold-text" size={24} />
            </div>
            <div>
              <h1 style={{ fontSize: '1.4rem', fontWeight: 800, lineHeight: 1.1 }} className="gold-text">
                AURUM LIVE
              </h1>
              <p style={{ fontSize: '0.75rem', color: 'var(--text-secondary)' }}>
                Aggregated Jewellers & Bullion Exchange
              </p>
            </div>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            {/* Location Selector Dropdown */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '6px', background: 'rgba(255,255,255,0.03)', border: '1px solid var(--border-color)', borderRadius: '8px', padding: '6px 12px' }}>
              <MapPin size={14} style={{ color: 'var(--gold-primary)' }} />
              <select 
                value={location}
                onChange={(e) => setLocation(e.target.value)}
                style={{
                  background: 'transparent',
                  border: 'none',
                  color: 'var(--text-primary)',
                  fontSize: '0.85rem',
                  fontWeight: 600,
                  outline: 'none',
                  cursor: 'pointer'
                }}
              >
                <option value="chennai" style={{ background: 'var(--bg-main)', color: 'var(--text-primary)' }}>Chennai</option>
                <option value="mumbai" style={{ background: 'var(--bg-main)', color: 'var(--text-primary)' }}>Mumbai</option>
                <option value="delhi" style={{ background: 'var(--bg-main)', color: 'var(--text-primary)' }}>Delhi</option>
                <option value="bangalore" style={{ background: 'var(--bg-main)', color: 'var(--text-primary)' }}>Bangalore</option>
                <option value="kolkata" style={{ background: 'var(--bg-main)', color: 'var(--text-primary)' }}>Kolkata</option>
                <option value="hyderabad" style={{ background: 'var(--bg-main)', color: 'var(--text-primary)' }}>Hyderabad</option>
                <option value="kerala" style={{ background: 'var(--bg-main)', color: 'var(--text-primary)' }}>Kerala</option>
              </select>
            </div>

            {showManualBadge ? (
              <span className="offline-badge" style={{ fontSize: '0.75rem', padding: '6px 12px' }}>Custom Override active</span>
            ) : data?.retail.associationRate.isScraped ? (
              <span className="live-badge" style={{ fontSize: '0.75rem', padding: '6px 12px' }}>Live Scrapers Connected</span>
            ) : (
              <span className="offline-badge" style={{ fontSize: '0.75rem', padding: '6px 12px' }}>Mathematical Spot Feed</span>
            )}

            <button 
              onClick={toggleTheme}
              className="glass-panel"
              style={{ padding: '10px', borderRadius: '50%', cursor: 'pointer', display: 'flex', alignItems: 'center', border: '1px solid var(--border-color)', background: 'none', color: 'var(--text-primary)' }}
              title="Toggle Light/Dark Theme"
            >
              {theme === 'dark' ? <Sun size={16} /> : <Moon size={16} />}
            </button>

            <RateEditor onSave={() => loadRates(location)} />

            <button 
              onClick={() => loadRates(location)}
              className="glass-panel"
              style={{ 
                padding: '10px 16px', 
                cursor: 'pointer', 
                display: 'flex', 
                alignItems: 'center', 
                gap: '8px', 
                fontSize: '0.85rem',
                color: 'var(--text-primary)',
                fontWeight: 600,
                border: '1px solid var(--border-color)'
              }}
              disabled={isRefreshing}
            >
              <RotateCw size={14} className={isRefreshing ? 'spin' : ''} />
              {isRefreshing ? 'Syncing...' : 'Sync'}
            </button>
          </div>

        </div>
      </header>

      {/* Main Dashboard Body */}
      <main style={{ flex: 1, maxWidth: '1280px', width: '100%', margin: '0 auto', padding: '24px' }}>
        
        {error && (
          <div style={{ display: 'flex', gap: '10px', background: 'rgba(239, 68, 68, 0.1)', border: '1px solid rgba(239, 68, 68, 0.2)', color: 'var(--color-down)', padding: '12px 16px', borderRadius: '8px', marginBottom: '20px', alignItems: 'center', fontSize: '0.9rem' }}>
            <AlertCircle size={20} />
            <span><strong>Warning:</strong> {error}. Reconnecting background sync engine.</span>
          </div>
        )}

        {/* Top Summary Block */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '20px', marginBottom: '24px' }}>
          
          {/* Main India Base Card */}
          <div className="glass-panel" style={{ padding: '20px', display: 'flex', flexDirection: 'column', justifyContent: 'space-between', minHeight: '160px', background: 'linear-gradient(135deg, rgba(7, 10, 19, 0.9) 0%, rgba(234, 179, 8, 0.05) 100%)' }}>
            <div>
              <span style={{ fontSize: '0.75rem', color: 'var(--gold-primary)', fontWeight: 700, letterSpacing: '0.05em' }}>OFFICIAL BENCHMARK PRICE</span>
              <h2 style={{ fontSize: '1.6rem', marginTop: '4px' }}>{location.charAt(0).toUpperCase() + location.slice(1)} Retail Rate</h2>
              <p style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>Local board benchmark standard rate (BIS 916)</p>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', marginTop: '16px' }}>
              <div>
                <span style={{ fontSize: '0.7rem', color: 'var(--text-muted)' }}>22K JEWELLERY RATE</span>
                <div style={{ fontSize: '2rem', fontWeight: 800 }} className="gold-text">
                  ₹{(data?.retail.associationRate.gold22k || 13140).toLocaleString()} <span style={{ fontSize: '0.9rem', fontWeight: 500, color: 'var(--text-secondary)' }}>/ g</span>
                </div>
              </div>
              <div style={{ textAlign: 'right' }}>
                <span style={{ fontSize: '0.7rem', color: 'var(--text-muted)' }}>24K BAR PRICE</span>
                <div style={{ fontSize: '1.3rem', fontWeight: 700 }}>
                  ₹{(data?.retail.associationRate.gold24k || 14335).toLocaleString()} / g
                </div>
              </div>
            </div>
          </div>

          {/* India vs Dubai Savings Card */}
          <div className="glass-panel" style={{ padding: '20px', display: 'flex', flexDirection: 'column', justifyContent: 'space-between', minHeight: '160px', background: 'linear-gradient(135deg, rgba(7, 10, 19, 0.9) 0%, rgba(16, 185, 129, 0.05) 100%)' }}>
            <div>
              <span style={{ fontSize: '0.75rem', color: 'var(--color-up)', fontWeight: 700, letterSpacing: '0.05em' }}>ARBITRAGE INDEX</span>
              <h2 style={{ fontSize: '1.6rem', marginTop: '4px', display: 'flex', alignItems: 'center', gap: '6px' }}>
                Dubai vs India Rate
                <ArrowUpRight size={20} style={{ color: 'var(--color-up)' }} />
              </h2>
              <p style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>Tax saving metrics for international buyers</p>
            </div>
            
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginTop: '16px' }}>
              <div>
                <span style={{ fontSize: '0.7rem', color: 'var(--text-muted)' }}>ESTIMATED SAVINGS</span>
                <div style={{ fontSize: '1.8rem', fontWeight: 800, color: 'var(--color-up)' }}>
                  ₹{savingsPerGram.toLocaleString()} <span style={{ fontSize: '0.9rem', fontWeight: 500 }}>/ g cheaper</span>
                </div>
              </div>
              <div style={{ textAlign: 'right', background: 'rgba(16, 185, 129, 0.1)', border: '1px solid rgba(16, 185, 129, 0.2)', padding: '4px 10px', borderRadius: '6px' }}>
                <span style={{ fontSize: '0.8rem', color: 'var(--color-up)', fontWeight: 700 }}>
                  {savingsPercent.toFixed(1)}% Tax Saving
                </span>
              </div>
            </div>
          </div>

          {/* Daily Advice Banner */}
          <div className="glass-panel" style={{ padding: '20px', display: 'flex', flexDirection: 'column', justifyContent: 'space-between', minHeight: '160px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <BookOpen className="gold-text" size={18} />
              <span style={{ fontSize: '0.75rem', color: 'var(--gold-primary)', fontWeight: 700, letterSpacing: '0.05em' }}>DAILY BUYING ADVICE</span>
            </div>
            <p style={{ fontSize: '0.9rem', fontStyle: 'italic', color: 'var(--text-primary)', margin: '10px 0', lineHeight: 1.4 }}>
              "{DAILY_TIPS[tipIndex]}"
            </p>
            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.7rem', color: 'var(--text-muted)' }}>
              <span>Auto updates daily</span>
              <button 
                onClick={() => setTipIndex((prev) => (prev + 1) % DAILY_TIPS.length)}
                style={{ background: 'none', border: 'none', color: 'var(--gold-primary)', cursor: 'pointer', fontWeight: 600, textDecoration: 'underline' }}
              >
                Next Tip
              </button>
            </div>
          </div>

        </div>

        {/* Grid of Jewellers */}
        <div style={{ marginBottom: '32px' }}>
          <h2 style={{ fontSize: '1.4rem', marginBottom: '16px', display: 'flex', alignItems: 'center', gap: '8px' }}>
            <Sparkles size={22} className="gold-text" />
            Live Showroom Pricing Comparison
          </h2>
          
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(290px, 1fr))', gap: '20px' }}>
            
            {data && (
              <>
                {Object.keys(data.retail.brands).map((key) => {
                  const brand = data.retail.brands[key];
                  return (
                    <GoldCard 
                      key={key}
                      title={brand.name}
                      description={brand.description}
                      gold22k={brand.gold22k}
                      gold24k={brand.gold24k}
                      gold18k={brand.gold18k}
                      currency="INR"
                      badge={key === 'tanishq' ? 'Tata Trust' : key === 'lalitha' ? 'Lowest VA' : 'Live Board'}
                      premium={brand.premium}
                      sparklineData={getMockSparkline(brand.gold22k, key === 'lalitha' ? 'down' : 'up')}
                    />
                  );
                })}

                {/* Dubai Gold Rate Card */}
                <GoldCard 
                  title="Dubai Retail Standard"
                  description="Tax-free retail rates in Dubai (DGJG association)"
                  gold22k={data.retail.dubai.gold22k_aed}
                  gold24k={data.retail.dubai.gold24k_aed}
                  currency="AED"
                  isDubai={true}
                  inrEquivalent22k={data.retail.dubai.gold22k_inr}
                  inrEquivalent24k={data.retail.dubai.gold24k_inr}
                  sparklineData={getMockSparkline(data.retail.dubai.gold22k_aed, 'down')}
                />

                {/* US Spot Gold Card */}
                <GoldCard 
                  title="US Commodity Spot"
                  description="Official Spot Exchange Rate (COMEX XAU/USD)"
                  gold22k={data.retail.us.usd.gold22k}
                  gold24k={data.retail.us.usd.gold24k}
                  currency="USD"
                  isUS={true}
                  inrEquivalent22k={data.retail.us.inr.gold22k}
                  inrEquivalent24k={data.retail.us.inr.gold24k}
                  sparklineData={getMockSparkline(data.retail.us.usd.gold22k, 'volatile')}
                />
              </>
            )}

          </div>
        </div>

        {/* Price History & AI predictions Grid */}
        {data && (
          <div style={{ 
            display: 'grid', 
            gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', 
            gap: '24px', 
            marginBottom: '32px'
          }}>
            <div style={{ minWidth: '320px' }}>
              <HistoricalChart />
            </div>
            <div>
              <MarketInsights insights={data.insights} />
            </div>
          </div>
        )}

        {/* Investment Asset Class Comparison (Physical Ornaments vs Gold BeES) */}
        <div style={{ marginBottom: '32px' }}>
          <InvestmentComparison />
        </div>

        {/* 11-Month Gold Chit Comparison Section */}
        {data && <ChitPlanner retail={data.retail} />}

        {/* Split Section: Calculator and Market Stats */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '24px', marginBottom: '32px' }}>
          
          {/* Calculator Section */}
          {data && <Calculator retail={data.retail} />}

          {/* Market Stats & Details panel */}
          <div className="glass-panel" style={{ padding: '24px', display: 'flex', flexDirection: 'column', gap: '16px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', borderBottom: '1px solid rgba(255,255,255,0.05)', paddingBottom: '12px' }}>
              <Info className="gold-text" size={24} />
              <div>
                <h2 style={{ fontSize: '1.25rem' }}>Indian Silver & Commodities</h2>
                <p style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>Daily retail silver rates and stock indices</p>
              </div>
            </div>

            {/* Silver Rate Card */}
            {data && (
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', background: 'rgba(255,255,255,0.02)', padding: '16px', borderRadius: '12px', border: '1px solid var(--border-color)' }}>
                <div>
                  <span style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', display: 'block', fontWeight: 600 }}>CHENNAI RETAIL SILVER</span>
                  <span style={{ fontSize: '1.8rem', fontWeight: 800, fontFamily: 'var(--font-display)' }}>
                    ₹{data.retail.associationRate.silver} <span style={{ fontSize: '1rem', color: 'var(--text-secondary)', fontWeight: 500 }}>/ g</span>
                  </span>
                </div>
                <div style={{ textAlign: 'right' }}>
                  <span style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', display: 'block', fontWeight: 600 }}>PER KILOGRAM</span>
                  <span style={{ fontSize: '1.2rem', fontWeight: 700, color: 'var(--text-primary)' }}>
                    ₹{(data.retail.associationRate.silver * 1000).toLocaleString()}
                  </span>
                </div>
              </div>
            )}

            {/* ETF Rates Section */}
            {data && (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                <span style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', fontWeight: 600 }}>INDIAN EXCHANGE ETFS (NSE)</span>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                  
                  {/* Gold BeES */}
                  <div style={{ 
                    padding: '12px', 
                    background: 'rgba(255,255,255,0.02)', 
                    border: '1px solid var(--border-color)', 
                    borderRadius: '10px',
                    display: 'flex',
                    flexDirection: 'column',
                    gap: '4px'
                  }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <span style={{ fontSize: '0.7rem', color: 'var(--text-secondary)', fontWeight: 600 }}>GOLD BEES</span>
                      <span style={{ 
                        fontSize: '0.65rem', 
                        fontWeight: 700, 
                        color: (data.market.goldBees?.changePercent ?? 0) >= 0 ? 'var(--color-up)' : 'var(--color-down)',
                        background: (data.market.goldBees?.changePercent ?? 0) >= 0 ? 'rgba(16, 185, 129, 0.1)' : 'rgba(239, 68, 68, 0.1)',
                        padding: '1px 4px',
                        borderRadius: '3px'
                      }}>
                        {(data.market.goldBees?.changePercent ?? 0) >= 0 ? '+' : ''}{(data.market.goldBees?.changePercent ?? 0).toFixed(2)}%
                      </span>
                    </div>
                    <span style={{ fontSize: '1.25rem', fontWeight: 800, fontFamily: 'var(--font-display)' }}>
                      ₹{(data.market.goldBees?.price ?? 114.96).toFixed(2)}
                    </span>
                  </div>

                  {/* Silver BeES */}
                  <div style={{ 
                    padding: '12px', 
                    background: 'rgba(255,255,255,0.02)', 
                    border: '1px solid var(--border-color)', 
                    borderRadius: '10px',
                    display: 'flex',
                    flexDirection: 'column',
                    gap: '4px'
                  }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <span style={{ fontSize: '0.7rem', color: 'var(--text-secondary)', fontWeight: 600 }}>SILVER BEES</span>
                      <span style={{ 
                        fontSize: '0.65rem', 
                        fontWeight: 700, 
                        color: (data.market.silverBees?.changePercent ?? 0) >= 0 ? 'var(--color-up)' : 'var(--color-down)',
                        background: (data.market.silverBees?.changePercent ?? 0) >= 0 ? 'rgba(16, 185, 129, 0.1)' : 'rgba(239, 68, 68, 0.1)',
                        padding: '1px 4px',
                        borderRadius: '3px'
                      }}>
                        {(data.market.silverBees?.changePercent ?? 0) >= 0 ? '+' : ''}{(data.market.silverBees?.changePercent ?? 0).toFixed(2)}%
                      </span>
                    </div>
                    <span style={{ fontSize: '1.25rem', fontWeight: 800, fontFamily: 'var(--font-display)' }}>
                      ₹{(data.market.silverBees?.price ?? 206.57).toFixed(2)}
                    </span>
                  </div>

                </div>
              </div>
            )}

            {/* General Info / Market Sentiment */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', flex: 1, justifyContent: 'center' }}>
              <span style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', fontWeight: 600 }}>EXCHANGE SENTIMENT REPORT</span>
              
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                <div style={{ padding: '12px', background: 'rgba(255,255,255,0.01)', border: '1px solid rgba(255,255,255,0.03)', borderRadius: '8px' }}>
                  <span style={{ fontSize: '0.7rem', color: 'var(--text-muted)', display: 'block' }}>Market Volatility</span>
                  <span style={{ fontSize: '1.1rem', fontWeight: 700, color: 'var(--color-up)' }}>Medium-Low</span>
                </div>
                <div style={{ padding: '12px', background: 'rgba(255,255,255,0.01)', border: '1px solid rgba(255,255,255,0.03)', borderRadius: '8px' }}>
                  <span style={{ fontSize: '0.7rem', color: 'var(--text-muted)', display: 'block' }}>Duty Structure</span>
                  <span style={{ fontSize: '1.1rem', fontWeight: 700 }}>15% Duty + 3% GST</span>
                </div>
              </div>

              <div style={{ padding: '12px 16px', background: 'rgba(234,179,8,0.03)', border: '1px solid rgba(234,179,8,0.1)', borderRadius: '8px', fontSize: '0.8rem', color: 'var(--text-secondary)', lineHeight: 1.4 }}>
                <strong>Trading Note:</strong> Indian gold prices are heavily influenced by the USD/INR currency exchange rate and customs duties. Even if global gold spot prices (XAU) remain flat, a weakening Rupee pushes retail jeweler prices higher.
              </div>
            </div>

          </div>

        </div>

      </main>

      {/* Footer Area */}
      <footer style={{ borderTop: '1px solid var(--border-color)', padding: '24px', textAlign: 'center', background: 'rgba(7, 10, 19, 0.6)', color: 'var(--text-secondary)', fontSize: '0.8rem' }}>
        <p>© 2026 Aurum Live. Daily gold and silver rate comparison tracker.</p>
        <p style={{ marginTop: '4px', color: 'var(--text-muted)' }}>
          Data sourced from Madras Jewellers Association scrapers, Dubai Gold Group, and COMEX futures indices.
        </p>
        <p style={{ marginTop: '8px' }}>
          Last Refreshed: {lastRefreshed.toLocaleTimeString()} (Updates automatically every 30s)
        </p>
      </footer>

    </div>
  );
}
