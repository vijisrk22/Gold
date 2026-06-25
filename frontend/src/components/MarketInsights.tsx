import React, { useState, useEffect } from 'react';
import { 
  TrendingUp, 
  TrendingDown, 
  Minus, 
  Newspaper, 
  Sparkles, 
  Percent, 
  Globe, 
  FileText, 
  DollarSign,
  Bell
} from 'lucide-react';
import type { MarketInsights as InsightsType } from '../utils/api';

interface MarketInsightsProps {
  insights?: InsightsType;
}

export const MarketInsights: React.FC<MarketInsightsProps> = ({ insights }) => {
  const [activeTab, setActiveTab] = useState<'news' | 'predictions' | 'macro' | 'alerts'>('predictions');

  const [alerts, setAlerts] = useState<Array<{ id: string; metal: 'gold' | 'silver'; target: number; channel: 'email' | 'whatsapp'; contact: string }>>([
    { id: '1', metal: 'gold', target: 12800, channel: 'email', contact: 'investor@gold.in' }
  ]);
  const [alertMetal, setAlertMetal] = useState<'gold' | 'silver'>('gold');
  const [alertPrice, setAlertPrice] = useState<string>('');
  const [alertChannel, setAlertChannel] = useState<'email' | 'whatsapp'>('email');
  const [alertContact, setAlertContact] = useState<string>('');
  const [toast, setToast] = useState<{ message: string; type: 'success' | 'alert' } | null>(null);

  useEffect(() => {
    if (toast) {
      const timer = setTimeout(() => setToast(null), 4000);
      return () => clearTimeout(timer);
    }
  }, [toast]);

  const addAlert = (e: React.FormEvent) => {
    e.preventDefault();
    const priceVal = parseFloat(alertPrice);
    if (!priceVal || !alertContact.trim()) return;

    const newAlert = {
      id: Date.now().toString(),
      metal: alertMetal,
      target: priceVal,
      channel: alertChannel,
      contact: alertContact
    };
    setAlerts(prev => [newAlert, ...prev]);
    setAlertPrice('');
    setAlertContact('');
    setToast({
      message: `Alert configured! We will notify you via ${alertChannel === 'email' ? 'Email' : 'WhatsApp'} at ${alertContact}.`,
      type: 'success'
    });
  };

  const simulateAlertTrigger = (alertId: string) => {
    const alertItem = alerts.find(a => a.id === alertId);
    if (!alertItem) return;

    setToast({
      message: `🚨 ALERT TRIGGERED: ${alertItem.metal.toUpperCase()} has hit your target of ₹${alertItem.target.toLocaleString()}/g! Alert sent to ${alertItem.contact}.`,
      type: 'alert'
    });
  };

  const deleteAlert = (id: string) => {
    setAlerts(prev => prev.filter(a => a.id !== id));
  };

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
        <button 
          onClick={() => setActiveTab('alerts')}
          style={{
            background: 'transparent', border: 'none', padding: '8px 4px', fontSize: '0.85rem', fontWeight: 600,
            color: activeTab === 'alerts' ? 'var(--gold-primary)' : 'var(--text-muted)',
            borderBottom: activeTab === 'alerts' ? '2px solid var(--gold-primary)' : '2px solid transparent',
            cursor: 'pointer', display: 'inline-flex', alignItems: 'center', gap: '6px', transition: 'all 0.2s'
          }}
        >
          <Bell size={14} /> Price Alerts
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

        {/* PRICE ALERTS TAB */}
        {activeTab === 'alerts' && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            <span style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', fontWeight: 600 }}>CONFIGURE LIVE PRICE ALERT</span>
            
            {/* Form */}
            <form onSubmit={addAlert} style={{ display: 'flex', flexDirection: 'column', gap: '10px', background: 'rgba(255,255,255,0.01)', border: '1px solid var(--border-color)', borderRadius: '12px', padding: '16px' }}>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                  <label style={{ fontSize: '0.7rem', color: 'var(--text-secondary)' }}>Select Metal</label>
                  <select 
                    value={alertMetal}
                    onChange={(e) => setAlertMetal(e.target.value as any)}
                    style={{ background: 'rgba(7,10,19,0.9)', border: '1px solid var(--border-color)', borderRadius: '6px', padding: '6px', color: 'var(--text-primary)', fontSize: '0.75rem', outline: 'none' }}
                  >
                    <option value="gold">Gold (22K)</option>
                    <option value="silver">Silver</option>
                  </select>
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                  <label style={{ fontSize: '0.7rem', color: 'var(--text-secondary)' }}>Target Price (₹/g)</label>
                  <input 
                    type="number" 
                    value={alertPrice}
                    onChange={(e) => setAlertPrice(e.target.value)}
                    placeholder="e.g. 12800"
                    style={{ background: 'rgba(7,10,19,0.9)', border: '1px solid var(--border-color)', borderRadius: '6px', padding: '6px', color: 'var(--text-primary)', fontSize: '0.75rem', outline: 'none' }}
                  />
                </div>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                  <label style={{ fontSize: '0.7rem', color: 'var(--text-secondary)' }}>Notify via</label>
                  <select 
                    value={alertChannel}
                    onChange={(e) => setAlertChannel(e.target.value as any)}
                    style={{ background: 'rgba(7,10,19,0.9)', border: '1px solid var(--border-color)', borderRadius: '6px', padding: '6px', color: 'var(--text-primary)', fontSize: '0.75rem', outline: 'none' }}
                  >
                    <option value="email">Email Address</option>
                    <option value="whatsapp">WhatsApp Phone</option>
                  </select>
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                  <label style={{ fontSize: '0.7rem', color: 'var(--text-secondary)' }}>Contact Info</label>
                  <input 
                    type="text" 
                    value={alertContact}
                    onChange={(e) => setAlertContact(e.target.value)}
                    placeholder={alertChannel === 'email' ? 'name@domain.com' : '+91 99999 99999'}
                    style={{ background: 'rgba(7,10,19,0.9)', border: '1px solid var(--border-color)', borderRadius: '6px', padding: '6px', color: 'var(--text-primary)', fontSize: '0.75rem', outline: 'none' }}
                  />
                </div>
              </div>

              <button 
                type="submit"
                style={{ background: 'var(--gold-primary)', color: '#000', border: 'none', padding: '8px', borderRadius: '6px', fontSize: '0.8rem', fontWeight: 700, cursor: 'pointer', marginTop: '4px' }}
              >
                Create Price Alert
              </button>
            </form>

            {/* List of active alerts */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
              <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)', fontWeight: 600 }}>ACTIVE ALERTS</span>
              {alerts.length === 0 ? (
                <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>No active alerts configured.</span>
              ) : (
                alerts.map(a => (
                  <div key={a.id} style={{ padding: '10px 12px', background: 'rgba(255,255,255,0.01)', border: '1px solid rgba(255,255,255,0.03)', borderRadius: '8px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <div>
                      <span style={{ fontSize: '0.75rem', fontWeight: 700, textTransform: 'capitalize' }}>
                        {a.metal} @ ₹{a.target.toLocaleString()}/g
                      </span>
                      <span style={{ fontSize: '0.65rem', color: 'var(--text-secondary)', display: 'block' }}>
                        {a.channel === 'email' ? '📧 Email' : '💬 WhatsApp'}: {a.contact}
                      </span>
                    </div>
                    <div style={{ display: 'flex', gap: '8px' }}>
                      <button 
                        onClick={() => simulateAlertTrigger(a.id)}
                        style={{ background: 'rgba(16, 185, 129, 0.1)', border: '1px solid rgba(16, 185, 129, 0.2)', color: 'var(--color-up)', fontSize: '0.65rem', padding: '4px 8px', borderRadius: '4px', cursor: 'pointer', fontWeight: 600 }}
                      >
                        Trigger
                      </button>
                      <button 
                        onClick={() => deleteAlert(a.id)}
                        style={{ background: 'rgba(239, 68, 68, 0.1)', border: '1px solid rgba(239, 68, 68, 0.2)', color: 'var(--color-down)', fontSize: '0.65rem', padding: '4px 8px', borderRadius: '4px', cursor: 'pointer', fontWeight: 600 }}
                      >
                        Delete
                      </button>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        )}

      </div>

      {/* Floating In-App Toast Notification Banner */}
      {toast && (
        <div style={{
          position: 'fixed',
          bottom: '24px',
          right: '24px',
          background: toast.type === 'alert' ? 'rgba(239, 68, 68, 0.95)' : 'rgba(15, 23, 42, 0.95)',
          border: '1px solid var(--border-color)',
          padding: '12px 18px',
          borderRadius: '10px',
          boxShadow: 'var(--shadow-lg), 0 0 15px rgba(0,0,0,0.5)',
          color: 'var(--text-primary)',
          fontSize: '0.8rem',
          maxWidth: '320px',
          zIndex: 9999,
          animation: 'slide-in 0.3s ease-out'
        }}>
          <p style={{ margin: 0, lineHeight: 1.4 }}>{toast.message}</p>
        </div>
      )}
      <style>{`
        @keyframes slide-in {
          from { transform: translateY(100px); opacity: 0; }
          to { transform: translateY(0); opacity: 1; }
        }
      `}</style>
    </div>
  );
};
