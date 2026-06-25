import React, { useState, useEffect } from 'react';
import { X } from 'lucide-react';

export const PriceAlertManager: React.FC<{ onClose: () => void }> = ({ onClose }) => {
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

  return (
    <div className="glass-panel" style={{ padding: '24px', display: 'flex', flexDirection: 'column', gap: '20px', marginBottom: '24px', border: '1px solid var(--gold-primary)', position: 'relative' }}>
      <button onClick={onClose} style={{ position: 'absolute', top: '16px', right: '16px', background: 'transparent', border: 'none', color: 'var(--text-secondary)', cursor: 'pointer' }}>
        <X size={20} />
      </button>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
        <span style={{ fontSize: '0.75rem', color: 'var(--gold-primary)', fontWeight: 700 }}>CONFIGURE LIVE PRICE ALERT</span>
        
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
    </div>
  );
};
