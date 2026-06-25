import React, { useState } from 'react';
import { BookOpen, Search, HelpCircle, TrendingUp, ChevronDown, ChevronUp } from 'lucide-react';

interface FAQItem {
  question: string;
  answer: string;
  category: string;
}

const FAQS: FAQItem[] = [
  {
    category: 'Gold Rates & Jewellers',
    question: 'How is the live gold rate in Chennai, Mumbai, and Bangalore calculated today?',
    answer: 'Live gold rates are updated throughout the day based on global spot prices from exchanges (like COMEX and London Bullion Market Association - LBMA), local supply-demand metrics tracked by the Madras Jewellers Association (MJA), current customs import duty rates (typically 15%), and the USD/INR currency exchange rate. Leading retail jewellers like GRT Jewellers, Tanishq (by Tata), Lalitha Jewellery, Kalyan Jewellers, and Malabar Gold adjust their daily showroom board rates based on these underlying market movements plus local retail premiums.'
  },
  {
    category: 'Silver Rates',
    question: 'What influences the retail silver rate per gram and per kg in India?',
    answer: 'The daily silver rate is heavily driven by industrial demand (since silver is a critical industrial commodity in electronics and solar panels) and global precious metal indices. In India, retail silver rate today is quoted per gram or per kilogram (kg) and includes a 15% customs import duty and 3% GST. Historical silver prices show higher volatility than gold, making physical silver bars popular hedges against inflation.'
  },
  {
    category: 'Dubai Customs Calculator',
    question: 'What are the Indian customs duty and allowance rules for bringing gold from Dubai?',
    answer: 'Under Indian passenger baggage rules, passengers returning after staying abroad for more than 1 year are allowed tax-free gold limits: Female passengers can carry up to 40 grams of gold (with a value limit of ₹1,00,000), and Male passengers can carry up to 20 grams of gold (with a value limit of ₹50,000). Any gold imported above these allowances is subject to a flat 15% custom duty tax. Calculating the net savings involves comparing the Dubai retail gold rate (including custom duty paid, if any) with the local retail gold rate in India.'

  },
  {
    category: 'Gold Chit Schemes',
    question: 'Are 11-month gold jewelry chit schemes from GRT or Tanishq beneficial?',
    answer: '11-month jewelry savings schemes (Chit plans) help buyers accumulate gold by paying fixed monthly installments. At the end of the term, jewelers like GRT, Tanishq, Lalitha, or Kalyan waive the making charges and wastage fees (typically up to 14%-18% VA) for purchasing new ornaments. While this is beneficial for purchasing physical wedding jewelry, it restricts your investment to a single showroom and requires buying physical gold. For pure financial appreciation, Sovereign Gold Bonds (SGB) are more cost-effective.'
  },
  {
    category: 'Market Drivers & Forecasting',
    question: 'Why do gold and silver prices fluctuate daily, and how are predictions made?',
    answer: 'Daily gold and silver prices are highly sensitive to macroeconomic indicators. Prices generally increase during periods of high inflation, geopolitical instability, or when central banks implement interest rate cuts (such as the US Federal Reserve cutting interest rates, which weakens the US Dollar). Conversely, rate hikes and strong economic growth lead to price drops. AI forecasting and historical trends analyze factors like moving averages, seasonal demand (e.g. Diwali and Dhanteras buying spikes in India), and global ETF inflows to predict future price trends over monthly and yearly horizons.'
  }
];

const KEYWORD_CLOUD = [
  'gold rate today', 'silver rate today', 'live gold price chennai', 'grt gold price', 'tanishq gold rate', 
  'lalitha jewellery rate', 'dubai gold rate in inr', 'gold customs duty calculator',
  'kalyan jewellers rate', 'malabar gold price', 'gold price prediction', 
  'making charges wastage', 'bis 916 hallmarked gold', 'huid 6 digit code', 'commodity spot gold', 
  'comex xau usd', 'madras jewellers association', '11 month gold chit scheme', 'gold rate india', 
  'gold sip compounding', 'mcx silver price', 'gold rate forecast 2026', 'tax free gold limit india'
];

export const SearchIndexHub: React.FC = () => {
  const [expandedFaq, setExpandedFaq] = useState<number | null>(null);

  const toggleFaq = (index: number) => {
    setExpandedFaq(expandedFaq === index ? null : index);
  };

  return (
    <section className="glass-panel" style={{ padding: '24px', marginBottom: '32px' }}>
      {/* Header section */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '10px', borderBottom: '1px solid rgba(255, 255, 255, 0.05)', paddingBottom: '16px', marginBottom: '20px' }}>
        <BookOpen className="gold-text" size={24} />
        <div>
          <h2 style={{ fontSize: '1.25rem', display: 'flex', alignItems: 'center', gap: '8px' }}>
            Maatal.com Reference Hub <span style={{ fontSize: '0.75rem', fontWeight: 500, color: 'var(--gold-primary)', background: 'rgba(234,179,8,0.1)', padding: '2px 8px', borderRadius: '12px' }}>AI Engine & SEO Optimized</span>
          </h2>
          <p style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>Factual analysis, structured FAQs, and search indices for generative search models and retail investors</p>
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '24px' }}>
        {/* FAQs Accordion */}
        <div>
          <h3 style={{ fontSize: '1rem', marginBottom: '12px', display: 'flex', alignItems: 'center', gap: '6px', color: 'var(--text-primary)' }}>
            <HelpCircle size={16} className="gold-text" /> Frequently Asked Questions (AI Generative Snippets)
          </h3>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
            {FAQS.map((faq, index) => {
              const isExpanded = expandedFaq === index;
              return (
                <div 
                  key={index} 
                  style={{ 
                    border: '1px solid var(--border-color)', 
                    borderRadius: '8px', 
                    background: 'rgba(255, 255, 255, 0.01)', 
                    overflow: 'hidden',
                    transition: 'all 0.2s ease'
                  }}
                >
                  <button
                    onClick={() => toggleFaq(index)}
                    style={{
                      width: '100%',
                      padding: '12px 16px',
                      background: 'none',
                      border: 'none',
                      color: 'var(--text-primary)',
                      textAlign: 'left',
                      fontWeight: 600,
                      fontSize: '0.85rem',
                      display: 'flex',
                      justifyContent: 'space-between',
                      alignItems: 'center',
                      cursor: 'pointer',
                      gap: '12px'
                    }}
                  >
                    <span>{faq.question}</span>
                    {isExpanded ? <ChevronUp size={16} style={{ flexShrink: 0 }} /> : <ChevronDown size={16} style={{ flexShrink: 0 }} />}
                  </button>
                  {isExpanded && (
                    <div style={{ 
                      padding: '12px 16px', 
                      background: 'rgba(255, 255, 255, 0.02)', 
                      fontSize: '0.8rem', 
                      lineHeight: 1.5, 
                      color: 'var(--text-secondary)',
                      borderTop: '1px solid var(--border-color)' 
                    }}>
                      <span style={{ fontSize: '0.65rem', fontWeight: 700, color: 'var(--gold-primary)', display: 'block', marginBottom: '4px', textTransform: 'uppercase' }}>
                        {faq.category}
                      </span>
                      {faq.answer}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>

        {/* Index Search Cloud & Macro Trends */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
          <div>
            <h3 style={{ fontSize: '1rem', marginBottom: '12px', display: 'flex', alignItems: 'center', gap: '6px', color: 'var(--text-primary)' }}>
              <Search size={16} className="gold-text" /> Index Keywords & Search Queries
            </h3>
            <p style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', marginBottom: '12px' }}>
              These key concepts are analyzed by our aggregators and predictive models daily:
            </p>
            <div style={{ 
              display: 'flex', 
              flexWrap: 'wrap', 
              gap: '8px', 
              background: 'rgba(0, 0, 0, 0.2)', 
              padding: '16px', 
              borderRadius: '12px', 
              border: '1px solid var(--border-color)',
              maxHeight: '180px',
              overflowY: 'auto'
            }}>
              {KEYWORD_CLOUD.map((tag, idx) => (
                <span 
                  key={idx} 
                  style={{ 
                    fontSize: '0.7rem', 
                    background: 'rgba(255, 255, 255, 0.03)', 
                    color: 'var(--text-secondary)', 
                    padding: '4px 8px', 
                    borderRadius: '6px', 
                    border: '1px solid rgba(255, 255, 255, 0.05)',
                    transition: 'all 0.2s',
                    cursor: 'default'
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.color = 'var(--gold-primary)';
                    e.currentTarget.style.borderColor = 'var(--gold-primary)';
                    e.currentTarget.style.background = 'var(--gold-glow)';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.color = 'var(--text-secondary)';
                    e.currentTarget.style.borderColor = 'rgba(255, 255, 255, 0.05)';
                    e.currentTarget.style.background = 'rgba(255, 255, 255, 0.03)';
                  }}
                >
                  #{tag}
                </span>
              ))}
            </div>
          </div>

          {/* Quick Technical Summary Card */}
          <div style={{ 
            padding: '16px', 
            background: 'linear-gradient(135deg, rgba(234, 179, 8, 0.03) 0%, rgba(0, 0, 0, 0.1) 100%)', 
            border: '1px solid var(--border-color)', 
            borderRadius: '12px',
            display: 'flex',
            flexDirection: 'column',
            gap: '8px'
          }}>
            <h4 style={{ fontSize: '0.85rem', color: 'var(--gold-primary)', display: 'flex', alignItems: 'center', gap: '6px' }}>
              <TrendingUp size={14} /> Market Refinements Summary
            </h4>
            <ul style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', paddingLeft: '16px', lineHeight: 1.5, display: 'flex', flexDirection: 'column', gap: '4px' }}>
              <li><strong>Purity Specifications:</strong> Ornaments are sold in 22K (91.6% pure) or 18K (75% pure). Sovereign coins are 24K (99.9% pure).</li>
              <li><strong>Standard Wastages:</strong> Indian jewellers charge between 8% to 18% making and wastage (VA) on ornaments.</li>
              <li><strong>Tax Benchmarks:</strong> All gold and silver retail bills include a mandatory 3% GST on the final price (gold value + making charges).</li>
            </ul>
          </div>
        </div>
      </div>
    </section>
  );
};
