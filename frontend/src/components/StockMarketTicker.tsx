import React from 'react';
import { TrendingUp, TrendingDown } from 'lucide-react';
import type { MarketData } from '../utils/api';

interface StockMarketTickerProps {
  market: MarketData;
}

export const StockMarketTicker: React.FC<StockMarketTickerProps> = ({ market }) => {
  const { spotGold, spotSilver, exchangeRates } = market;

  const renderTickerItem = (
    label: string,
    value: string,
    changePercent: number,
    prefix: string = ''
  ) => {
    const isUp = changePercent >= 0;
    return (
      <div className="ticker-item" key={label}>
        <span className="ticker-label">{label}:</span>
        <span className="ticker-val">
          {prefix}
          {value}
        </span>
        <span className={`ticker-change ${isUp ? 'up' : 'down'}`}>
          {isUp ? (
            <TrendingUp size={14} className="inline mr-1" />
          ) : (
            <TrendingDown size={14} className="inline mr-1" />
          )}
          {isUp ? '+' : ''}
          {changePercent.toFixed(2)}%
        </span>
      </div>
    );
  };



  const tickerItems = [
    renderTickerItem('Spot Gold (XAU/USD)', spotGold.price.toLocaleString(undefined, { minimumFractionDigits: 2 }), spotGold.changePercent, '$'),
    renderTickerItem('Spot Silver (XAG/USD)', spotSilver.price.toLocaleString(undefined, { minimumFractionDigits: 2 }), spotSilver.changePercent, '$'),
    renderTickerItem('USD / INR Exchange', exchangeRates.usdInr.toFixed(3), exchangeRates.usdInrChangePercent, '₹'),
    renderTickerItem('USD / AED Exchange', exchangeRates.usdAed.toFixed(4), exchangeRates.usdAedChangePercent),
  ];

  // Repeat items to fill marquee and make it scroll infinitely
  const repeatedItems = [...tickerItems, ...tickerItems, ...tickerItems];

  return (
    <div className="ticker-container dark-header">
      <div className="ticker-wrap">
        <div className="ticker-track">
          {repeatedItems.map((item, index) => (
            <React.Fragment key={index}>
              {item}
              <span className="text-muted mx-2">•</span>
            </React.Fragment>
          ))}
        </div>
      </div>
    </div>
  );
};
