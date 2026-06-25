const express = require('express');
const cors = require('cors');

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

// Helper function to fetch page content with a standard User-Agent
async function fetchHtml(url) {
  try {
    const response = await fetch(url, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36'
      }
    });
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    return await response.text();
  } catch (error) {
    console.error(`Failed to fetch URL: ${url}`, error.message);
    return null;
  }
}

// Scrape live rates directly from GRT Jewellers (primary baseline)
async function scrapeGrtRates() {
  const url = 'https://www.grtjewels.com/';
  const html = await fetchHtml(url);
  if (!html) return null;

  try {
    const match = /\\"gold_rate\\":\s*\[([\s\S]*?)\]/.exec(html);
    if (match) {
      const rawArrayStr = match[1];
      const cleanJson = `[${rawArrayStr.replace(/\\"/g, '"')}]`;
      const rates = JSON.parse(cleanJson);
      
      const gold22k = rates.find(r => r.type === 'GOLD' && r.purity === '22 KT')?.amount;
      const gold24k = rates.find(r => r.type === 'GOLD' && r.purity === '24 KT')?.amount;
      const gold18k = rates.find(r => r.type === 'GOLD' && r.purity === '18 KT')?.amount;

      if (gold22k && gold24k) {
        return {
          gold24k: parseInt(gold24k, 10),
          gold22k: parseInt(gold22k, 10),
          gold18k: gold18k ? parseInt(gold18k, 10) : Math.round(parseInt(gold24k, 10) * (18 / 24)),
          timestamp: new Date().toISOString(),
          source: 'GRT Jewellers Website (Direct)'
        };
      }
    }
  } catch (error) {
    console.error('Failed to parse GRT jewellers direct rates:', error.message);
  }
  return null;
}

// Scrape Chennai Gold rates from GoodReturns
async function scrapeChennaiRates() {
  const url = 'https://www.goodreturns.in/gold-rates/chennai.html';
  const html = await fetchHtml(url);
  if (!html) return null;

  try {
    // Look for the first table which contains the 24K, 22K, 18K rates per gram
    // Target matches like:
    // <tr> <td>1</td> <td> &#x20b9;14,335 ... </td> <td> &#x20b9;13,140 ... </td>
    // We match the 24K, 22K, and 18K values
    const rowRegex = /<tr>\s*<td>1<\/td>\s*<td>\s*&#x20b9;([\d,]+)[\s\S]*?<\/td>\s*<td>\s*&#x20b9;([\d,]+)[\s\S]*?<\/td>\s*<td>\s*&#x20b9;([\d,]+)/i;
    const match = rowRegex.exec(html);

    if (match) {
      return {
        gold24k: parseInt(match[1].replace(/,/g, ''), 10),
        gold22k: parseInt(match[2].replace(/,/g, ''), 10),
        gold18k: parseInt(match[3].replace(/,/g, ''), 10),
        timestamp: new Date().toISOString(),
        source: 'GoodReturns (Chennai Scraped)'
      };
    }
  } catch (error) {
    console.error('Failed to parse Chennai gold rates:', error.message);
  }
  return null;
}

// Scrape Chennai Silver rates from GoodReturns
async function scrapeChennaiSilverRate() {
  const url = 'https://www.goodreturns.in/silver-rates/chennai.html';
  const html = await fetchHtml(url);
  if (!html) return null;

  try {
    // Silver table contains:
    // <tr> <td>1</td> <td> &#x20b9;230 ... </td>
    const silverRegex = /<tr>\s*<td>1<\/td>\s*<td>\s*&#x20b9;([\d,.]+)/i;
    const match = silverRegex.exec(html);
    if (match) {
      return parseFloat(match[1].replace(/,/g, ''));
    }
  } catch (error) {
    console.error('Failed to parse Chennai silver rate:', error.message);
  }
  return null;
}

// Scrape Dubai Gold rates from GoodReturns
async function scrapeDubaiRates() {
  const url = 'https://www.goodreturns.in/gold-rates/dubai.html';
  const html = await fetchHtml(url);
  if (!html) return null;

  try {
    // Extract Dubai rate in AED
    // <tr> <td>1</td> <td> <span class='currency-symbol-left'> د.إ </span>486.50 ... </td> <td> <span class='currency-symbol-left'> د.إ </span>450.50 ... </td>
    const aedRegex = /<tr>\s*<td>1<\/td>\s*<td>\s*<span[^>]*>\s*د\.إ\s*<\/span>\s*([\d,.]+)[\s\S]*?<\/td>\s*<td>\s*<span[^>]*>\s*د\.إ\s*<\/span>\s*([\d,.]+)/i;
    const aedMatch = aedRegex.exec(html);

    // Extract Dubai rate in INR equivalent
    // Table #2 contains INR values
    // <tr> <td>1</td> <td> &#x20b9;12,493 ... </td> <td> &#x20b9;11,569 ... </td>
    const inrRegex = /<table[\s\S]*?<table[^>]*>[\s\S]*?<tr>\s*<td>1<\/td>\s*<td>\s*&#x20b9;([\d,]+)[\s\S]*?<\/td>\s*<td>\s*&#x20b9;([\d,]+)/i;
    const inrMatch = inrRegex.exec(html);

    if (aedMatch) {
      return {
        aed: {
          gold24k: parseFloat(aedMatch[1]),
          gold22k: parseFloat(aedMatch[2]),
        },
        inr: inrMatch ? {
          gold24k: parseInt(inrMatch[1].replace(/,/g, ''), 10),
          gold22k: parseInt(inrMatch[2].replace(/,/g, ''), 10),
        } : null,
        timestamp: new Date().toISOString()
      };
    }
  } catch (error) {
    console.error('Failed to parse Dubai gold rates:', error.message);
  }
  return null;
}

// Fetch financial indexes from Yahoo Finance
async function fetchYahooFinanceIndex(symbol) {
  try {
    const res = await fetch(`https://query1.finance.yahoo.com/v8/finance/chart/${encodeURIComponent(symbol)}`);
    if (res.status === 200) {
      const data = await res.json();
      const meta = data.chart.result[0].meta;
      const price = meta.regularMarketPrice;
      const prevClose = meta.previousClose;
      const change = price - prevClose;
      const changePercent = (change / prevClose) * 100;
      
      return {
        price,
        change,
        changePercent,
        currency: meta.currency,
        symbol
      };
    }
  } catch (error) {
    console.error(`Failed to fetch Yahoo Finance for ${symbol}:`, error.message);
  }
  return null;
}

// Dynamic fallback calculator when scraping fails
function calculateRatesFromSpot(spotUsd, usdInr, usdAed) {
  const ozToGrams = 31.1034768;
  const spotUsdGram = spotUsd / ozToGrams;
  const spotInrGram = spotUsdGram * usdInr;
  const spotAedGram = spotUsdGram * usdAed;

  // India landing price: spot price in INR + 9% customs duty + 3% GST
  const india24kCalculated = Math.round(spotInrGram * 1.09 * 1.03);
  const india22kCalculated = Math.round(india24kCalculated * (22 / 24));
  const india18kCalculated = Math.round(india24kCalculated * (18 / 24));

  // Dubai retail: spot price in AED + 1.5% premium (Dubai Gold Group benchmark)
  const dubai24kAed = parseFloat((spotAedGram * 1.015).toFixed(2));
  const dubai22kAed = parseFloat((dubai24kAed * (22 / 24)).toFixed(2));

  const dubai24kInr = Math.round(dubai24kAed * (usdInr / usdAed));
  const dubai22kInr = Math.round(dubai22kAed * (usdInr / usdAed));

  return {
    chennai: {
      gold24k: india24kCalculated,
      gold22k: india22kCalculated,
      gold18k: india18kCalculated,
      source: 'Calculated (Spot Gold + India Duties)'
    },
    dubai: {
      aed: {
        gold24k: dubai24kAed,
        gold22k: dubai22kAed
      },
      inr: {
        gold24k: dubai24kInr,
        gold22k: dubai22kInr
      },
      source: 'Calculated (Spot Gold + Dubai Premium)'
    }
  };
}

app.get('/api/rates', async (req, res) => {
  console.log('Fetching live gold rates...');
  
  // 1. Fetch live stock market indexes in parallel
  const [spotGold, spotSilver, usdInr, usdAed, goldBees, silverBees] = await Promise.all([
    fetchYahooFinanceIndex('GC=F'),
    fetchYahooFinanceIndex('SI=F'),
    fetchYahooFinanceIndex('INR=X'),
    fetchYahooFinanceIndex('AED=X'),
    fetchYahooFinanceIndex('GOLDBEES.NS'),
    fetchYahooFinanceIndex('SILVERBEES.NS')
  ]);

  // 2. Attempt scraping
  const [grtDirect, chennaiScraped, dubaiScraped, silverScraped] = await Promise.all([
    scrapeGrtRates(),
    scrapeChennaiRates(),
    scrapeDubaiRates(),
    scrapeChennaiSilverRate()
  ]);

  // Fallbacks if scraping fails
  const spotPrice = spotGold ? spotGold.price : 4010.0;
  const inrRate = usdInr ? usdInr.price : 94.2;
  const aedRate = usdAed ? usdAed.price : 3.67;

  const calculated = calculateRatesFromSpot(spotPrice, inrRate, aedRate);

  // Establish primary baseline: GRT Direct -> GoodReturns Scraped -> Calculated Spot
  const finalChennai = grtDirect || chennaiScraped || calculated.chennai;
  const finalDubai = dubaiScraped || calculated.dubai;
  
  // Compute silver rate
  let finalSilver = silverScraped;
  if (!finalSilver) {
    // Fallback: Spot Silver (oz) -> convert to grams * Exchange Rate + 10% duty + 3% GST
    const silverSpotGram = spotSilver ? (spotSilver.price / 31.1034768) : 30.0 / 31.1034768;
    finalSilver = Math.round(silverSpotGram * inrRate * 1.10 * 1.03);
  }

  // 3. Compute retail brands (adding premiums to the Chennai baseline rate)
  const base22k = finalChennai.gold22k;
  const base24k = finalChennai.gold24k;
  const base18k = finalChennai.gold18k;

  const brands = {
    tanishq: {
      name: 'Tanishq (Tata)',
      gold24k: base24k + 39,
      gold22k: base22k + 45,
      gold18k: base18k + 30,
      premium: 45,
      description: 'Premium branding and certified purity (Tata group)'
    },
    grt: {
      name: 'GRT Jewellers',
      gold24k: base24k,
      gold22k: base22k,
      gold18k: base18k,
      premium: 0,
      description: 'Traditional South Indian patterns and transparent rates'
    },
    lalitha: {
      name: 'Lalitha Jewellery',
      gold24k: base24k - 5,
      gold22k: base22k - 5,
      gold18k: base18k - 4,
      premium: -5,
      description: 'Known for wholesale pricing and lowest making charges'
    },
    atr: {
      name: 'ATR Jewellers',
      gold24k: base24k + 10,
      gold22k: base22k + 10,
      gold18k: base18k + 8,
      premium: 10,
      description: 'Local boutique jewelry with hand-crafted custom designs'
    },
    kalyan: {
      name: 'Kalyan Jewellers',
      gold24k: base24k + 25,
      gold22k: base22k + 25,
      gold18k: base18k + 20,
      premium: 25,
      description: 'National presence with designer and bridal collections'
    },
    joyalukkas: {
      name: 'Joyalukkas',
      gold24k: base24k + 20,
      gold22k: base22k + 20,
      gold18k: base18k + 15,
      premium: 20,
      description: 'World-renowned collections and global standard retail rate'
    },
    malabar: {
      name: 'Malabar Gold & Diamonds',
      gold24k: base24k + 15,
      gold22k: base22k + 15,
      gold18k: base18k + 10,
      premium: 15,
      description: 'Responsible sourcing and certified 916 purity assurances'
    },
    avr: {
      name: 'AVR Swarna Mahal',
      gold24k: base24k + 5,
      gold22k: base22k + 5,
      gold18k: base18k + 4,
      premium: 5,
      description: 'Regional brand popular in Tamil Nadu for high-finish details'
    }
  };

  // 4. US Gold rates (derived directly from spot price)
  const usGrams24k = parseFloat((spotPrice / 31.1034768).toFixed(2));
  const usGrams22k = parseFloat((usGrams24k * (22 / 24)).toFixed(2));
  const usGrams18k = parseFloat((usGrams24k * (18 / 24)).toFixed(2));

  const usGold = {
    usd: {
      gold24k_oz: spotPrice,
      gold24k: usGrams24k,
      gold22k: usGrams22k,
      gold18k: usGrams18k
    },
    inr: {
      gold24k: Math.round(usGrams24k * inrRate),
      gold22k: Math.round(usGrams22k * inrRate),
      gold18k: Math.round(usGrams18k * inrRate)
    },
    source: 'COMEX Spot Market'
  };

  // Compile final API payload
  res.json({
    market: {
      spotGold: spotGold || { price: spotPrice, change: 0, changePercent: 0, currency: 'USD' },
      spotSilver: spotSilver || { price: spotSilver ? spotSilver.price : 30.0, change: 0, changePercent: 0, currency: 'USD' },
      goldBees: goldBees || { price: 115.03, change: 0, changePercent: 0, currency: 'INR', symbol: 'GOLDBEES.NS' },
      silverBees: silverBees || { price: 206.57, change: 0, changePercent: 0, currency: 'INR', symbol: 'SILVERBEES.NS' },
      exchangeRates: {
        usdInr: inrRate,
        usdAed: aedRate,
        usdInrChangePercent: usdInr ? usdInr.changePercent : 0,
        usdAedChangePercent: usdAed ? usdAed.changePercent : 0
      }
    },
    retail: {
      associationRate: {
        location: 'Chennai (Madras Jewellers Association)',
        gold24k: base24k,
        gold22k: base22k,
        gold18k: base18k,
        silver: finalSilver,
        isScraped: !!chennaiScraped,
        timestamp: finalChennai.timestamp || new Date().toISOString()
      },
      dubai: {
        currency: 'AED',
        gold24k_aed: finalDubai.aed.gold24k,
        gold22k_aed: finalDubai.aed.gold22k,
        gold24k_inr: finalDubai.inr ? finalDubai.inr.gold24k : Math.round(finalDubai.aed.gold24k * (inrRate / aedRate)),
        gold22k_inr: finalDubai.inr ? finalDubai.inr.gold22k : Math.round(finalDubai.aed.gold22k * (inrRate / aedRate)),
        isScraped: !!dubaiScraped,
        timestamp: finalDubai.timestamp || new Date().toISOString()
      },
      us: usGold,
      brands
    },
    meta: {
      serverTime: new Date().toISOString(),
      apiVersion: '1.0.0'
    }
  });
});

const path = require('path');

// Serve static assets from the React frontend build
app.use(express.static(path.join(__dirname, '../frontend/dist')));

// Handle client-side routing fallback - serve index.html for non-API routes
app.get('*', (req, res, next) => {
  if (req.path.startsWith('/api')) {
    return next();
  }
  res.sendFile(path.join(__dirname, '../frontend/dist/index.html'));
});

app.listen(PORT, () => {
  console.log(`Gold Rate Server running on port ${PORT}`);
});
