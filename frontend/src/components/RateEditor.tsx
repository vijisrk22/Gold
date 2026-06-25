import React, { useState, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { Settings, Save, AlertTriangle, ToggleLeft, ToggleRight } from 'lucide-react';
import { getSavedOverrides, saveOverrides } from '../utils/api';
import type { ManualOverrides } from '../utils/api';

interface RateEditorProps {
  onSave: () => void;
}

export const RateEditor: React.FC<RateEditorProps> = ({ onSave }) => {
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const [config, setConfig] = useState<ManualOverrides>({
    enabled: false,
    spotGold: 4010.50,
    spotSilver: 31.40,
    usdInr: 94.185,
    gold22k: 13140,
    gold24k: 14335,
    silver: 105,
    dubai24k_aed: 486.50,
    dubai22k_aed: 450.50
  });

  useEffect(() => {
    setConfig(getSavedOverrides());
  }, [isOpen]);

  const handleToggle = () => {
    const updated = { ...config, enabled: !config.enabled };
    setConfig(updated);
    saveOverrides(updated);
    onSave();
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    saveOverrides(config);
    setIsOpen(false);
    onSave();
  };

  const handleChange = (field: keyof ManualOverrides, value: number) => {
    setConfig(prev => ({
      ...prev,
      [field]: value
    }));
  };

  return (
    <>
      <button 
        onClick={() => setIsOpen(true)}
        className="glass-panel"
        style={{ 
          padding: '10px', 
          cursor: 'pointer', 
          display: 'flex', 
          alignItems: 'center', 
          justifyContent: 'center',
          gap: '8px', 
          fontSize: '0.85rem',
          color: 'var(--text-primary)',
          fontWeight: 600
        }}
        title="Customizer"
      >
        <Settings size={18} className={config.enabled ? 'gold-text' : ''} />
      </button>

      {isOpen && createPortal(
        <div style={{
          position: 'fixed',
          top: 0,
          left: 0,
          width: '100%',
          height: '100%',
          background: 'rgba(0,0,0,0.7)',
          backdropFilter: 'blur(4px)',
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'flex-start',
          zIndex: 99999,
          padding: '40px 20px',
          overflowY: 'auto'
        }}>
          <div className="glass-panel" style={{
            background: 'var(--bg-main)',
            maxWidth: '500px',
            width: '100%',
            padding: '24px',
            border: '1px solid var(--border-color)',
            display: 'flex',
            flexDirection: 'column',
            gap: '16px',
            margin: '0 auto'
          }}>
            {/* Header */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid rgba(255,255,255,0.05)', paddingBottom: '12px' }}>
              <div>
                <h3 style={{ fontSize: '1.2rem', display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <Settings size={20} className="gold-text" />
                  Manual Rate Customizer
                </h3>
                <p style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', marginTop: '2px' }}>
                  Override live server rates with your custom pricing sheets.
                </p>
              </div>
              <button 
                onClick={() => setIsOpen(false)}
                style={{ background: 'none', border: 'none', color: 'var(--text-secondary)', cursor: 'pointer', fontSize: '1.2rem' }}
              >
                &times;
              </button>
            </div>

            {/* Toggle Status */}
            <div style={{ 
              display: 'flex', 
              justifyContent: 'space-between', 
              alignItems: 'center', 
              background: config.enabled ? 'var(--gold-glow)' : 'rgba(255,255,255,0.02)', 
              padding: '12px 16px', 
              borderRadius: '8px', 
              border: '1px solid ' + (config.enabled ? 'var(--gold-primary)' : 'rgba(255,255,255,0.05)')
            }}>
              <div>
                <span style={{ fontSize: '0.9rem', fontWeight: 700, display: 'block' }}>
                  {config.enabled ? 'Manual Overrides Active' : 'Automatic Live Feed'}
                </span>
                <span style={{ fontSize: '0.75rem', color: 'var(--text-secondary)' }}>
                  {config.enabled ? 'Bypassing live scrapers to use custom numbers' : 'Using real-time aggregator scrapers'}
                </span>
              </div>
              <button 
                onClick={handleToggle} 
                style={{ background: 'none', border: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center' }}
              >
                {config.enabled ? (
                  <ToggleRight size={36} style={{ color: 'var(--gold-primary)' }} />
                ) : (
                  <ToggleLeft size={36} style={{ color: 'var(--text-muted)' }} />
                )}
              </button>
            </div>

            {config.enabled && (
              <form onSubmit={handleSave} style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                  <div>
                    <label style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', display: 'block', marginBottom: '4px' }}>Spot Gold ($/oz)</label>
                    <input 
                      type="number" 
                      className="custom-input" 
                      value={config.spotGold} 
                      onChange={(e) => handleChange('spotGold', parseFloat(e.target.value) || 0)}
                      step="0.01"
                    />
                  </div>
                  <div>
                    <label style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', display: 'block', marginBottom: '4px' }}>USD/INR Rate</label>
                    <input 
                      type="number" 
                      className="custom-input" 
                      value={config.usdInr} 
                      onChange={(e) => handleChange('usdInr', parseFloat(e.target.value) || 0)}
                      step="0.001"
                    />
                  </div>
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                  <div>
                    <label style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', display: 'block', marginBottom: '4px' }}>India 22K Rate (₹/g)</label>
                    <input 
                      type="number" 
                      className="custom-input" 
                      value={config.gold22k} 
                      onChange={(e) => handleChange('gold22k', parseFloat(e.target.value) || 0)}
                    />
                  </div>
                  <div>
                    <label style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', display: 'block', marginBottom: '4px' }}>India 24K Rate (₹/g)</label>
                    <input 
                      type="number" 
                      className="custom-input" 
                      value={config.gold24k} 
                      onChange={(e) => handleChange('gold24k', parseFloat(e.target.value) || 0)}
                    />
                  </div>
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                  <div>
                    <label style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', display: 'block', marginBottom: '4px' }}>Dubai 24K (AED/g)</label>
                    <input 
                      type="number" 
                      className="custom-input" 
                      value={config.dubai24k_aed} 
                      onChange={(e) => handleChange('dubai24k_aed', parseFloat(e.target.value) || 0)}
                      step="0.01"
                    />
                  </div>
                  <div>
                    <label style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', display: 'block', marginBottom: '4px' }}>Dubai 22K (AED/g)</label>
                    <input 
                      type="number" 
                      className="custom-input" 
                      value={config.dubai22k_aed} 
                      onChange={(e) => handleChange('dubai22k_aed', parseFloat(e.target.value) || 0)}
                      step="0.01"
                    />
                  </div>
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                  <div>
                    <label style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', display: 'block', marginBottom: '4px' }}>Silver Base Rate (₹/g)</label>
                    <input 
                      type="number" 
                      className="custom-input" 
                      value={config.silver} 
                      onChange={(e) => handleChange('silver', parseFloat(e.target.value) || 0)}
                    />
                  </div>
                  <div>
                    <label style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', display: 'block', marginBottom: '4px' }}>Spot Silver ($/oz)</label>
                    <input 
                      type="number" 
                      className="custom-input" 
                      value={config.spotSilver} 
                      onChange={(e) => handleChange('spotSilver', parseFloat(e.target.value) || 0)}
                      step="0.01"
                    />
                  </div>
                </div>

                <div style={{ display: 'flex', gap: '8px', background: 'rgba(234,179,8,0.05)', padding: '10px 14px', borderRadius: '8px', border: '1px solid rgba(234,179,8,0.1)', fontSize: '0.75rem', color: 'var(--text-secondary)', alignItems: 'center' }}>
                  <AlertTriangle size={24} style={{ color: 'var(--gold-primary)', flexShrink: 0 }} />
                  <span>
                    Retail store margins (Tanishq, GRT, etc.) will be dynamically calculated relative to your custom Indian baseline rate.
                  </span>
                </div>

                <button type="submit" className="btn-gold" style={{ width: '100%', justifyContent: 'center', padding: '12px' }}>
                  <Save size={16} />
                  Apply Settings
                </button>
              </form>
            )}

            {!config.enabled && (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', alignItems: 'center', padding: '20px 0', color: 'var(--text-secondary)' }}>
                <AlertTriangle size={32} className="gold-text" />
                <span style={{ fontSize: '0.85rem', textAlign: 'center' }}>
                  Live Mode is active. Turn on the override switch above to test custom sheets or run the app offline.
                </span>
                <button onClick={() => setIsOpen(false)} className="btn-gold" style={{ marginTop: '10px' }}>
                  Close
                </button>
              </div>
            )}
          </div>
        </div>,
        document.body
      )}
    </>
  );
};
