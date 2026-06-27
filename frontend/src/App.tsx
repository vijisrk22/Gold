import React, { useState, useEffect } from 'react';
import { 
  Sparkles, 
  RotateCw, 
  AlertCircle, 
  BookOpen, 
  Sun, 
  Moon, 
  ArrowUpRight,
  Info,
  MapPin,
  Bell,
  Activity
} from 'lucide-react';
import { SplashScreen } from './components/SplashScreen';
import { fetchGoldRates, getSavedOverrides } from './utils/api';
import type { GoldRatesPayload } from './utils/api';
import { StockMarketTicker } from './components/StockMarketTicker';
import { GoldCard } from './components/GoldCard';
import { Calculator } from './components/Calculator';
import { RateEditor } from './components/RateEditor';
import { ChitPlanner } from './components/ChitPlanner';
import { HistoricalChart } from './components/HistoricalChart';
import { MarketInsights } from './components/MarketInsights';
import { SearchIndexHub } from './components/SearchIndexHub';
import { PriceAlertManager } from './components/PriceAlertManager';

const DAILY_TIPS = [
  "Look for the BIS Hallmark: Ensure your jewelry has the BIS logo, purity grade (e.g. 22K916), and the unique 6-digit HUID code before paying.",
  "Bargain on Making Charges: Wastage charges (Value Addition) are highly negotiable. You can often get discounts of 10% to 20% on these charges.",
  "Avoid Weekend Buying: Retail gold rates are locked on Friday evening and do not change on Saturday/Sunday. If spot prices drop on the weekend, wait for Monday morning.",
  "Understand GST: GST on gold is exactly 3% of the final jewelry price (Gold value + Making charges). Always ask for a printed tax invoice.",
  "The Scrap Value Rule: When selling or exchange old gold, jewellers deduct melt wastage. Keep bills of original purchases to claim maximum value.",
  "Compare KDM vs Hallmarked: KDM gold is soldered with cadmium, which is unhealthy. Insist on modern Hallmarked gold soldered with zinc/copper."
];

const STATES: Record<string, { id: string; name: string }[]> = {
  "Tamil Nadu": [{ id: "chennai", name: "Chennai" }],
  "Maharashtra": [{ id: "mumbai", name: "Mumbai" }],
  "Delhi": [{ id: "delhi", name: "Delhi" }],
  "Karnataka": [{ id: "bangalore", name: "Bangalore" }],
  "West Bengal": [{ id: "kolkata", name: "Kolkata" }],
  "Telangana": [{ id: "hyderabad", name: "Hyderabad" }],
  "Kerala": [{ id: "kerala", name: "Kerala" }]
};

const GoogleTranslateWidget = React.memo(() => {
  useEffect(() => {
    (window as any).googleTranslateElementInit = () => {
      new (window as any).google.translate.TranslateElement({
        pageLanguage: 'en',
        includedLanguages: 'ta,te,hi,ml,kn,en', 
        layout: (window as any).google.translate.TranslateElement.InlineLayout.SIMPLE
      }, 'google_translate_element');
    };

    if (!document.getElementById('google-translate-script')) {
      const script = document.createElement('script');
      script.id = 'google-translate-script';
      script.src = 'https://translate.google.com/translate_a/element.js?cb=googleTranslateElementInit';
      document.body.appendChild(script);
    }

    // Bulletproof MutationObserver to aggressively destroy the top banner
    const observer = new MutationObserver(() => {
      // Force body back to top
      if (document.body.style.top !== '0px') {
        document.body.style.setProperty('top', '0px', 'important');
        document.body.style.setProperty('position', 'static', 'important');
      }

      // Hide all known banner classes
      document.querySelectorAll('.goog-te-banner-frame, .VIpgJd-Zvi9od-ORHb-OEVmcd, #goog-gt-tt').forEach(el => {
        (el as HTMLElement).style.setProperty('display', 'none', 'important');
      });

      // Target the container divs injected into body that are NOT the dropdown menu
      document.querySelectorAll('body > .skiptranslate').forEach(div => {
        const iframe = div.querySelector('iframe');
        // The dropdown menu iframe has the class 'goog-te-menu-frame'
        if (iframe && !iframe.classList.contains('goog-te-menu-frame') && !iframe.id.includes('menu')) {
          (div as HTMLElement).style.setProperty('display', 'none', 'important');
        }
      });
    });

    observer.observe(document.body, { childList: true, subtree: true, attributes: true, attributeFilter: ['style'] });

    return () => observer.disconnect();
  }, []);

  return <div id="google_translate_element" style={{ background: 'rgba(255,255,255,0.03)', borderRadius: '8px', padding: '2px 8px', minWidth: '130px', minHeight: '30px', overflow: 'hidden' }}></div>;
}, () => true);

export default function App() {
  const [showSplash, setShowSplash] = useState(true);
  const [data, setData] = useState<GoldRatesPayload | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [theme, setTheme] = useState<'dark' | 'light'>('dark');
  const [lastRefreshed, setLastRefreshed] = useState<Date>(new Date());
  const [tipIndex, setTipIndex] = useState<number>(0);
  const [isRefreshing, setIsRefreshing] = useState<boolean>(false);
  const [showPriceAlerts, setShowPriceAlerts] = useState<boolean>(false);
  const [selectedState, setSelectedState] = useState<string>('Tamil Nadu');
  const [location, setLocation] = useState<string>('chennai');

  const handleStateChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const newState = e.target.value;
    setSelectedState(newState);
    const firstCity = STATES[newState][0].id;
    setLocation(firstCity);
  };

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
      <>
        {showSplash && <SplashScreen onComplete={() => setShowSplash(false)} />}
        <div style={{ display: 'flex', flexDirection: 'column', height: '100vh', justifyContent: 'center', alignItems: 'center', backgroundColor: 'var(--bg-main)' }}>
          {!showSplash && <div style={{ width: '40px', height: '40px', border: '3px solid var(--border-color)', borderTopColor: 'var(--gold-primary)', borderRadius: '50%', animation: 'spin 1s infinite linear' }}></div>}
        </div>
      </>
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
    <>
      {showSplash && <SplashScreen onComplete={() => setShowSplash(false)} />}
      <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column', backgroundColor: 'var(--bg-main)' }}>
      
      {/* Top Banner Marquee Ticker */}
      {data && <StockMarketTicker market={data.market} />}

      {/* Header Area */}
      <header className="dark-header" style={{ borderBottom: '1px solid var(--border-color)', padding: '16px 24px', background: 'rgba(45, 26, 17, 0.95)', backdropFilter: 'blur(8px)', zIndex: 10 }}>
        <div className="header-container">
          
          <div className="header-logo-section">
            <div>
              <h1 style={{ fontSize: '1.4rem', fontWeight: 800, lineHeight: 1.1 }} className="gold-text notranslate">
                Maatal.com
              </h1>
              <p style={{ fontSize: '0.75rem', color: 'var(--text-secondary)' }}>
                Aggregated Jewellers & Bullion Exchange
              </p>
            </div>
          </div>

          <div className="header-controls">
            <GoogleTranslateWidget />
            {/* Location Selector Dropdown */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '6px', background: 'rgba(255,255,255,0.03)', border: '1px solid var(--border-color)', borderRadius: '8px', padding: '6px 12px' }}>
              <MapPin size={14} style={{ color: 'var(--gold-primary)' }} />
              
              <select 
                value={selectedState}
                onChange={handleStateChange}
                style={{
                  background: 'transparent',
                  border: 'none',
                  color: 'var(--text-primary)',
                  fontSize: '0.85rem',
                  fontWeight: 600,
                  outline: 'none',
                  cursor: 'pointer',
                  borderRight: '1px solid rgba(255,255,255,0.1)',
                  marginRight: '6px',
                  paddingRight: '6px'
                }}
              >
                {Object.keys(STATES).map(st => (
                  <option key={st} value={st} style={{ background: 'var(--bg-main)', color: 'var(--text-primary)' }}>{st}</option>
                ))}
              </select>

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
                {STATES[selectedState].map(city => (
                  <option key={city.id} value={city.id} style={{ background: 'var(--bg-main)', color: 'var(--text-primary)' }}>{city.name}</option>
                ))}
              </select>
            </div>

            {showManualBadge ? (
              <span className="offline-badge" style={{ padding: '8px', display: 'flex', alignItems: 'center', justifyContent: 'center' }} title="Custom Override active">
                <AlertCircle size={16} />
              </span>
            ) : data?.retail.associationRate.isScraped ? (
              <span className="live-badge" style={{ padding: '8px', display: 'flex', alignItems: 'center', justifyContent: 'center' }} title="Live Scrapers Connected">
                <Activity size={16} />
              </span>
            ) : (
              <span className="offline-badge" style={{ padding: '8px', display: 'flex', alignItems: 'center', justifyContent: 'center' }} title="Mathematical Spot Feed">
                <AlertCircle size={16} />
              </span>
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
              onClick={() => setShowPriceAlerts(!showPriceAlerts)}
              className="glass-panel"
              style={{ 
                padding: '10px 16px', 
                cursor: 'pointer', 
                display: 'flex', 
                alignItems: 'center', 
                gap: '8px', 
                fontSize: '0.85rem',
                color: '#000',
                background: 'var(--gold-primary)',
                fontWeight: 700,
                border: 'none',
                borderRadius: '8px'
              }}
            >
              <Bell size={14} />
              Get Price Alert
            </button>

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

        {showPriceAlerts && <PriceAlertManager onClose={() => setShowPriceAlerts(false)} />}

        {/* Top Summary Block */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '20px', marginBottom: '24px' }}>
          
          {/* Main India Base Card */}
          <div className="glass-panel" style={{ padding: '20px', display: 'flex', flexDirection: 'column', justifyContent: 'space-between', minHeight: '160px', background: 'linear-gradient(135deg, var(--bg-surface) 0%, rgba(234, 179, 8, 0.1) 100%)' }}>
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
          <div className="glass-panel" style={{ padding: '20px', display: 'flex', flexDirection: 'column', justifyContent: 'space-between', minHeight: '160px', background: 'linear-gradient(135deg, var(--bg-surface) 0%, rgba(16, 185, 129, 0.1) 100%)' }}>
            <div>
              <span style={{ fontSize: '0.75rem', color: 'var(--color-up)', fontWeight: 700, letterSpacing: '0.05em' }}>ARBITRAGE INDEX</span>
              <h2 style={{ fontSize: '1.6rem', marginTop: '4px', display: 'flex', alignItems: 'center', gap: '6px' }}>
                Dubai vs India Rate
                <ArrowUpRight size={20} style={{ color: 'var(--color-up)' }} />
              </h2>
            </div>
            
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginTop: '16px' }}>
              <div>
                <span style={{ fontSize: '0.75rem', color: 'var(--color-up)', fontWeight: 700 }}>DUBAI IS CHEAPER BY</span>
                <div style={{ fontSize: '1.8rem', fontWeight: 800, color: 'var(--color-up)' }}>
                  ₹{savingsPerGram.toLocaleString()} <span style={{ fontSize: '0.9rem', fontWeight: 500 }}>/ g</span>
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
                      gold22k={brand.gold22k}
                      gold24k={brand.gold24k}
                      gold18k={brand.gold18k}
                      currency="INR"
                      sparklineData={getMockSparkline(brand.gold22k, key === 'lalitha' ? 'down' : 'up')}
                    />
                  );
                })}

                {/* Dubai Gold Rate Card */}
                <GoldCard 
                  title="Dubai Retail Standard"
                  gold22k={data.retail.dubai.gold22k_aed}
                  gold24k={data.retail.dubai.gold24k_aed}
                  currency="AED"
                  isDubai={true}
                  inrEquivalent22k={data.retail.dubai.gold22k_inr}
                  inrEquivalent24k={data.retail.dubai.gold24k_inr}
                />

                {/* US Spot Gold Card */}
                <GoldCard 
                  title="US Commodity Spot"
                  gold22k={data.retail.us.usd.gold22k}
                  gold24k={data.retail.us.usd.gold24k}
                  currency="USD"
                  isUS={true}
                  inrEquivalent22k={data.retail.us.inr.gold22k}
                  inrEquivalent24k={data.retail.us.inr.gold24k}
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

        {/* AI & Search Engine Optimization Index Directory */}
        <SearchIndexHub />

      </main>

      {/* Footer Area */}
      <footer style={{ borderTop: '1px solid var(--border-color)', padding: '24px', textAlign: 'center', background: 'rgba(7, 10, 19, 0.6)', color: 'var(--text-secondary)', fontSize: '0.8rem' }}>
        <p>© 2026 Maatal.com. Daily gold and silver rate comparison tracker.</p>
        <p style={{ marginTop: '4px', color: 'var(--text-muted)' }}>
          Data sourced from Madras Jewellers Association scrapers, Dubai Gold Group, and COMEX futures indices.
        </p>
        <p style={{ marginTop: '8px' }}>
          Last Refreshed: {lastRefreshed.toLocaleTimeString()} (Updates automatically every 30s)
        </p>
      </footer>

      </div>
    </>
  );
}
