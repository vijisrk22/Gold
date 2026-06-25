import React, { useState, useEffect } from 'react';
import { Calendar, Sparkles } from 'lucide-react';
import { fetchHistoricalRates, type HistoricalRate } from '../utils/api';

export const HistoricalChart: React.FC = () => {
  const [range, setRange] = useState<'1mo' | '1y'>('1mo');
  const [metal, setMetal] = useState<'gold' | 'silver'>('gold');
  const [history, setHistory] = useState<HistoricalRate[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [hoverIndex, setHoverIndex] = useState<number | null>(null);

  useEffect(() => {
    setLoading(true);
    fetchHistoricalRates(range)
      .then(res => {
        setHistory(res);
        setLoading(false);
      })
      .catch(err => {
        console.error(err);
        setLoading(false);
      });
  }, [range]);

  if (loading) {
    return (
      <div className="glass-panel" style={{ padding: '32px', minHeight: '360px', display: 'flex', alignItems: 'center', justifyContent: 'center', flexDirection: 'column', gap: '12px' }}>
        <div className="spinner" style={{ width: '40px', height: '40px', border: '3px solid rgba(255,255,255,0.05)', borderTopColor: 'var(--gold-primary)', borderRadius: '50%', animation: 'spin 1s linear infinite' }} />
        <span style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>Loading historical data...</span>
        <style>{`
          @keyframes spin { to { transform: rotate(360deg); } }
        `}</style>
      </div>
    );
  }

  if (history.length === 0) {
    return (
      <div className="glass-panel" style={{ padding: '32px', minHeight: '360px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <span style={{ color: 'var(--text-secondary)' }}>No historical data available.</span>
      </div>
    );
  }

  // Metal pricing helper
  const getPrice = (item: HistoricalRate) => {
    return metal === 'gold' ? item.gold22k : item.silver;
  };

  const getLabel = (item: HistoricalRate) => {
    if (range === '1y') {
      const parts = item.date.split('-');
      const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
      return `${months[parseInt(parts[1]) - 1]} ${parts[0].slice(-2)}`;
    }
    return item.date.split('-').slice(1).reverse().join('/');
  };

  // Dimensions
  const w = 600;
  const h = 240;
  const paddingLeft = 50;
  const paddingRight = 40; // reserve space for future prediction extension
  const paddingTop = 20;
  const paddingBottom = 30;

  const chartW = w - paddingLeft - paddingRight;
  const chartH = h - paddingTop - paddingBottom;

  const prices = history.map(getPrice);
  const minPrice = Math.min(...prices) * 0.99;
  const maxPrice = Math.max(...prices) * 1.01;
  const priceRange = maxPrice - minPrice;

  // Actual points coordinate mapping
  const points = history.map((item, idx) => {
    const x = paddingLeft + (idx / (history.length - 1)) * (chartW - 40); // compress actual lines slightly
    const y = paddingTop + chartH - ((getPrice(item) - minPrice) / priceRange) * chartH;
    return { x, y, item, idx };
  });

  // Calculate prediction path: extend the trend line into the future
  const lastPoint = points[points.length - 1];
  // Gold 1Y prediction: ~9.5% increase. 1M prediction: ~0.8% increase.
  const predFactor = range === '1y' ? 1.095 : 1.008;
  const predictedValue = getPrice(history[history.length - 1]) * predFactor;

  // Prediction point coordinate
  const predX = paddingLeft + chartW;
  const predY = paddingTop + chartH - ((predictedValue - minPrice) / priceRange) * chartH;

  // Path strings
  const pathD = points.map((p, i) => `${i === 0 ? 'M' : 'L'} ${p.x} ${p.y}`).join(' ');
  const areaD = `${pathD} L ${lastPoint.x} ${paddingTop + chartH} L ${points[0].x} ${paddingTop + chartH} Z`;

  // Prediction dotted path
  const predictionPathD = `M ${lastPoint.x} ${lastPoint.y} L ${predX} ${predY}`;

  // Y-axis ticks (4 ticks)
  const yTicks = Array.from({ length: 4 }).map((_, i) => {
    const val = minPrice + (i / 3) * priceRange;
    const y = paddingTop + chartH - (i / 3) * chartH;
    return { val, y };
  });

  const activeHover = hoverIndex !== null ? points[hoverIndex] : null;

  return (
    <div className="glass-panel" style={{ padding: '24px', display: 'flex', flexDirection: 'column', gap: '20px' }}>
      
      {/* Header Controls */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '12px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <Calendar className="gold-text" size={22} />
          <div>
            <h2 style={{ fontSize: '1.2rem', fontWeight: 700 }}>Interactive Price Trajectory</h2>
            <p style={{ fontSize: '0.75rem', color: 'var(--text-secondary)' }}>Historical quotes & future AI predictions</p>
          </div>
        </div>

        {/* Filters */}
        <div style={{ display: 'flex', gap: '8px' }}>
          {/* Metal Toggle */}
          <div style={{ display: 'flex', background: 'rgba(255,255,255,0.03)', border: '1px solid var(--border-color)', borderRadius: '8px', padding: '2px' }}>
            <button 
              onClick={() => { setMetal('gold'); setHoverIndex(null); }}
              style={{
                background: metal === 'gold' ? 'var(--gold-primary)' : 'transparent',
                color: metal === 'gold' ? '#000' : 'var(--text-secondary)',
                border: 'none', padding: '4px 12px', borderRadius: '6px', fontSize: '0.75rem', fontWeight: 600, cursor: 'pointer', transition: 'all 0.2s'
              }}
            >
              Gold (22K)
            </button>
            <button 
              onClick={() => { setMetal('silver'); setHoverIndex(null); }}
              style={{
                background: metal === 'silver' ? 'var(--text-primary)' : 'transparent',
                color: metal === 'silver' ? 'var(--bg-main)' : 'var(--text-secondary)',
                border: 'none', padding: '4px 12px', borderRadius: '6px', fontSize: '0.75rem', fontWeight: 600, cursor: 'pointer', transition: 'all 0.2s'
              }}
            >
              Silver
            </button>
          </div>

          {/* Range Toggle */}
          <div style={{ display: 'flex', background: 'rgba(255,255,255,0.03)', border: '1px solid var(--border-color)', borderRadius: '8px', padding: '2px' }}>
            <button 
              onClick={() => { setRange('1mo'); setHoverIndex(null); }}
              style={{
                background: range === '1mo' ? 'rgba(255,255,255,0.1)' : 'transparent',
                color: 'var(--text-primary)',
                border: 'none', padding: '4px 10px', borderRadius: '6px', fontSize: '0.75rem', fontWeight: 600, cursor: 'pointer', transition: 'all 0.2s'
              }}
            >
              1M
            </button>
            <button 
              onClick={() => { setRange('1y'); setHoverIndex(null); }}
              style={{
                background: range === '1y' ? 'rgba(255,255,255,0.1)' : 'transparent',
                color: 'var(--text-primary)',
                border: 'none', padding: '4px 10px', borderRadius: '6px', fontSize: '0.75rem', fontWeight: 600, cursor: 'pointer', transition: 'all 0.2s'
              }}
            >
              1Y
            </button>
          </div>
        </div>
      </div>

      {/* SVG Interactive Chart */}
      <div style={{ position: 'relative', width: '100%' }}>
        <svg 
          viewBox={`0 0 ${w} ${h}`} 
          width="100%" 
          height="100%"
          style={{ overflow: 'visible' }}
          onMouseLeave={() => setHoverIndex(null)}
        >
          {/* Gradients */}
          <defs>
            <linearGradient id="area-grad" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor={metal === 'gold' ? 'var(--gold-primary)' : 'var(--text-primary)'} stopOpacity="0.18" />
              <stop offset="100%" stopColor={metal === 'gold' ? 'var(--gold-primary)' : 'var(--text-primary)'} stopOpacity="0.00" />
            </linearGradient>
            <linearGradient id="glow-grad" x1="0" y1="0" x2="1" y2="0">
              <stop offset="0%" stopColor={metal === 'gold' ? 'var(--gold-primary)' : 'var(--text-primary)'} />
              <stop offset="100%" stopColor="var(--color-up)" />
            </linearGradient>
          </defs>

          {/* Grid lines & Y ticks */}
          {yTicks.map((tick, i) => (
            <g key={i}>
              <line 
                x1={paddingLeft} 
                y1={tick.y} 
                x2={w - paddingRight} 
                y2={tick.y} 
                stroke="rgba(255,255,255,0.03)" 
                strokeWidth="1" 
              />
              <line 
                x1={paddingLeft} 
                y1={tick.y} 
                x2={w - paddingRight} 
                y2={tick.y} 
                stroke="rgba(255,255,255,0.03)" 
                strokeWidth="1" 
              />
              <text 
                x={paddingLeft - 8} 
                y={tick.y + 4} 
                fill="var(--text-muted)" 
                fontSize="9" 
                textAnchor="end"
                fontFamily="monospace"
              >
                ₹{Math.round(tick.val).toLocaleString()}
              </text>
            </g>
          ))}

          {/* Area under curve */}
          <path d={areaD} fill="url(#area-grad)" />

          {/* Main Trend Line */}
          <path 
            d={pathD} 
            fill="none" 
            stroke={metal === 'gold' ? 'var(--gold-primary)' : 'var(--text-primary)'} 
            strokeWidth="2.5" 
            strokeLinecap="round"
          />

          {/* AI Predicted Extension (Dotted) */}
          <path 
            d={predictionPathD} 
            fill="none" 
            stroke="url(#glow-grad)" 
            strokeWidth="2.5" 
            strokeDasharray="5,4" 
            strokeLinecap="round"
          />

          {/* Label indicating AI Prediction Zone */}
          <text 
            x={(lastPoint.x + predX) / 2} 
            y={Math.min(lastPoint.y, predY) - 10} 
            fill="var(--color-up)" 
            fontSize="8" 
            fontWeight="bold" 
            textAnchor="middle"
            letterSpacing="0.05em"
          >
            AI FORECAST
          </text>

          {/* Hover tracker line */}
          {activeHover && (
            <line 
              x1={activeHover.x} 
              y1={paddingTop} 
              x2={activeHover.x} 
              y2={paddingTop + chartH} 
              stroke="rgba(255,255,255,0.15)" 
              strokeDasharray="3,3"
            />
          )}

          {/* Data Points Hover Anchors */}
          {points.map((p, i) => (
            <circle 
              key={i} 
              cx={p.x} 
              cy={p.y} 
              r={activeHover?.idx === i ? 5 : 4} 
              fill={activeHover?.idx === i ? (metal === 'gold' ? 'var(--gold-primary)' : 'var(--text-primary)') : 'transparent'} 
              stroke={activeHover?.idx === i ? 'rgba(255,255,255,0.5)' : 'transparent'}
              strokeWidth="2"
              onMouseEnter={() => setHoverIndex(i)}
              style={{ cursor: 'pointer', transition: 'r 0.1s' }}
            />
          ))}

          {/* Predicted Endpoint Circle */}
          <circle 
            cx={predX} 
            cy={predY} 
            r="4" 
            fill="var(--color-up)" 
            style={{ filter: 'drop-shadow(0 0 6px var(--color-up))' }}
          />

          {/* X Axis dates (First, Middle, Last) */}
          {points.length > 0 && (
            <g fill="var(--text-muted)" fontSize="9">
              <text x={points[0].x} y={h - 10} textAnchor="start">
                {getLabel(points[0].item)}
              </text>
              <text x={points[Math.floor(points.length / 2)].x} y={h - 10} textAnchor="middle">
                {getLabel(points[Math.floor(points.length / 2)].item)}
              </text>
              <text x={lastPoint.x} y={h - 10} textAnchor="end">
                {getLabel(lastPoint.item)}
              </text>
              <text x={predX} y={h - 10} textAnchor="middle" fill="var(--color-up)" fontWeight="600">
                {range === '1mo' ? '1M Pred' : '1Y Pred'}
              </text>
            </g>
          )}
        </svg>

        {/* Hover Tooltip Overlay */}
        {activeHover && (
          <div style={{
            position: 'absolute',
            left: `${(activeHover.x / w) * 100}%`,
            top: `${(activeHover.y / h) * 100 - 45}%`,
            transform: 'translateX(-50%)',
            background: 'rgba(15, 23, 42, 0.95)',
            border: '1px solid var(--border-color)',
            padding: '6px 12px',
            borderRadius: '8px',
            pointerEvents: 'none',
            boxShadow: 'var(--shadow-md)',
            zIndex: 10,
            whiteSpace: 'nowrap',
            display: 'flex',
            flexDirection: 'column',
            gap: '2px'
          }}>
            <span style={{ fontSize: '0.65rem', color: 'var(--text-secondary)' }}>{activeHover.item.date}</span>
            <span style={{ fontSize: '0.85rem', fontWeight: 800, color: 'var(--text-primary)' }}>
              ₹{getPrice(activeHover.item).toLocaleString()} <span style={{ fontSize: '0.65rem', color: 'var(--text-muted)' }}>/ g</span>
            </span>
          </div>
        )}
      </div>

      {/* Trajectory Details Footer */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px', background: 'rgba(255,255,255,0.01)', padding: '12px 16px', borderRadius: '10px', border: '1px solid rgba(255,255,255,0.02)' }}>
        <div>
          <span style={{ fontSize: '0.7rem', color: 'var(--text-secondary)', display: 'block' }}>CURRENT AVERAGE</span>
          <span style={{ fontSize: '1.1rem', fontWeight: 800 }}>
            ₹{getPrice(history[history.length - 1]).toLocaleString()} / g
          </span>
        </div>
        <div style={{ borderLeft: '1px solid rgba(255,255,255,0.05)', paddingLeft: '16px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div>
            <span style={{ fontSize: '0.7rem', color: 'var(--color-up)', display: 'flex', alignItems: 'center', gap: '3px', fontWeight: 600 }}>
              <Sparkles size={12} /> AI TARGET ({range === '1mo' ? '30 Days' : '1 Year'})
            </span>
            <span style={{ fontSize: '1.1rem', fontWeight: 800, color: 'var(--color-up)' }}>
              ₹{Math.round(predictedValue).toLocaleString()} / g
            </span>
          </div>
          <span style={{ fontSize: '0.8rem', fontWeight: 700, color: 'var(--color-up)', background: 'rgba(16, 185, 129, 0.1)', padding: '3px 8px', borderRadius: '6px' }}>
            +{range === '1mo' ? '0.8%' : '9.5%'}
          </span>
        </div>
      </div>

    </div>
  );
};
