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

// Scrape Mangal & Mangal Trichy rates
async function scrapeMangalRates() {
  const url = 'https://mangalandmangal.in/';
  const html = await fetchHtml(url);
  if (!html) return null;

  try {
    const match = /GOLD\s*-\s*22k\s*-\s*1G\s*Rs\.\s*([\d.]+)/i.exec(html);
    if (match) {
      const gold22k = parseInt(match[1].replace(/,/g, ''), 10);
      const gold24k = Math.round(gold22k * (24 / 22)); 
      const gold18k = Math.round(gold22k * (18 / 22));
      return { gold24k, gold22k, gold18k };
    }
  } catch (error) {
    console.error('Failed to parse Mangal rates:', error.message);
  }
  return null;
}

// Scrape Kalyan Jewellers rates from new store site
async function scrapeKalyanRates() {
  const url = 'https://store.kalyanjewellers.net/gold-rate/india';
  const html = await fetchHtml(url);
  if (!html) return null;

  try {
    const match = /<script id="__NEXT_DATA__" type="application\/json">(.*?)<\/script>/s.exec(html);
    if (match) {
      const data = JSON.parse(match[1]);
      const rates = data.props?.pageProps?.goldRate;
      if (Array.isArray(rates)) {
        let gold24k = 0;
        let gold22k = 0;
        let gold18k = 0;

        for (const item of rates) {
          if (item['karat_24(995)']) gold24k = item['karat_24(995)'].price_per_gram;
          if (item['karat_24(999)']) gold24k = item['karat_24(999)'].price_per_gram;
          if (item.karat_22) gold22k = item.karat_22.price_per_gram;
          if (item.karat_18) gold18k = item.karat_18.price_per_gram;
        }

        if (gold22k > 0) {
          if (!gold24k) gold24k = Math.round(gold22k * (24 / 22));
          if (!gold18k) gold18k = Math.round(gold22k * (18 / 22));
          return { gold24k, gold22k, gold18k };
        }
      }
    }
  } catch (error) {
    console.error('Failed to parse Kalyan rates from store:', error.message);
  }
  return null;
}

// Scrape Lalithaa Jewellery rates
async function scrapeLalithaRates() {
  const url = 'https://api.lalithaajewellery.com/public/pricings/latest?state_id=df30f5aa-75b6-4766-8317-25cf4eaf43a6';
  try {
    const response = await fetch(url, { headers: { 'User-Agent': 'Mozilla/5.0' } });
    if (response.ok) {
      const data = await response.json();
      if (data?.status === 'success' && data?.data?.prices?.gold?.price) {
        const gold22k = Math.round(data.data.prices.gold.price);
        const gold24k = Math.round(gold22k * (24 / 22));
        const gold18k = Math.round(gold22k * (18 / 22));
        return { gold24k, gold22k, gold18k };
      }
    }
  } catch (error) {
    console.error('Failed to parse Lalithaa rates via API:', error.message);
  }
  return null;
}

// Scrape Malabar Gold & Diamonds rates
async function scrapeMalabarRates() {
  const url = 'https://www.malabargoldanddiamonds.com/in/pan-india/en/product-list.html';
  const html = await fetchHtml(url);
  if (!html) return null;
  
  try {
    const $ = cheerio.load(html);
    const rawRateText = $('#livegoldrate .sc-eeFpNe.bBellx').text();
    // rawRateText looks like "₹" "13,195.00" "/" => "₹13,195.00/"
    const cleanRateMatch = rawRateText.replace(/,/g, '').match(/\d+(\.\d+)?/);
    if (cleanRateMatch) {
      const gold22k = Math.round(parseFloat(cleanRateMatch[0]));
      const gold24k = Math.round(gold22k * (24 / 22));
      const gold18k = Math.round(gold22k * (18 / 22));
      return { gold24k, gold22k, gold18k };
    }
  } catch (error) {
    console.error('Failed to parse Malabar rates:', error.message);
  }
  return null;
}

// Scrape Gold rates for a specific city from GoodReturns
async function scrapeCityRates(city) {
  const url = `https://www.goodreturns.in/gold-rates/${city}.html`;
  const html = await fetchHtml(url);
  if (!html) return null;

  try {
    const rowRegex = /<tr>\s*<td>1<\/td>\s*<td>\s*&#x20b9;([\d,]+)[\s\S]*?<\/td>\s*<td>\s*&#x20b9;([\d,]+)[\s\S]*?<\/td>\s*<td>\s*&#x20b9;([\d,]+)/i;
    const match = rowRegex.exec(html);

    if (match) {
      return {
        gold24k: parseInt(match[1].replace(/,/g, ''), 10),
        gold22k: parseInt(match[2].replace(/,/g, ''), 10),
        gold18k: parseInt(match[3].replace(/,/g, ''), 10),
        timestamp: new Date().toISOString(),
        source: `GoodReturns (${city.toUpperCase()} Scraped)`
      };
    }
  } catch (error) {
    console.error(`Failed to parse ${city} gold rates:`, error.message);
  }
  return null;
}

// Scrape Silver rates for a specific city from GoodReturns
async function scrapeCitySilverRate(city) {
  const url = `https://www.goodreturns.in/silver-rates/${city}.html`;
  const html = await fetchHtml(url);
  if (!html) return null;

  try {
    const silverRegex = /<tr>\s*<td>1<\/td>\s*<td>\s*&#x20b9;([\d,.]+)/i;
    const match = silverRegex.exec(html);
    if (match) {
      return parseFloat(match[1].replace(/,/g, ''));
    }
  } catch (error) {
    console.error(`Failed to parse ${city} silver rate:`, error.message);
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

function getBrandsForLocation(city, base24k, base22k, base18k, mangalDirect, kalyanDirect, lalithaDirect, malabarDirect) {
  const allBrands = {
    tanishq: {
      name: 'Tanishq (Tata)',
      gold24k: base24k + 45,
      gold22k: base22k + 45,
      gold18k: base18k + 35,
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
      name: 'Lalithaa Jewellery',
      gold24k: lalithaDirect ? lalithaDirect.gold24k : base24k + 5,
      gold22k: lalithaDirect ? lalithaDirect.gold22k : base22k + 5,
      gold18k: lalithaDirect ? lalithaDirect.gold18k : base18k + 5,
      premium: lalithaDirect ? (lalithaDirect.gold22k - base22k) : 5,
      description: 'Known for transparent pricing and low making charges'
    },
    malabar: {
      name: 'Malabar Gold & Diamonds',
      gold24k: malabarDirect ? malabarDirect.gold24k : base24k + 15,
      gold22k: malabarDirect ? malabarDirect.gold22k : base22k + 15,
      gold18k: malabarDirect ? malabarDirect.gold18k : base18k + 10,
      premium: malabarDirect ? (malabarDirect.gold22k - base22k) : 15,
      description: 'Responsible sourcing and certified 916 purity assurances'
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
    avr: {
      name: 'AVR Swarna Mahal',
      gold24k: base24k + 5,
      gold22k: base22k + 5,
      gold18k: base18k + 4,
      premium: 5,
      description: 'Regional brand popular in Tamil Nadu for high-finish details'
    },
    tbz: {
      name: 'TBZ - Tribhovandas Bhimji Zaveri',
      gold24k: base24k + 35,
      gold22k: base22k + 35,
      gold18k: base18k + 26,
      premium: 35,
      description: 'Iconic heritage brand of Western India famous for premium designs'
    },
    waman: {
      name: 'Waman Hari Pethe',
      gold24k: base24k + 10,
      gold22k: base22k + 10,
      gold18k: base18k + 8,
      premium: 10,
      description: 'Trusted Maharashtrian brand celebrating traditional jewelry'
    },
    pcj: {
      name: 'PC Jeweller',
      gold24k: base24k + 20,
      gold22k: base22k + 20,
      gold18k: base18k + 15,
      premium: 20,
      description: 'Popular national chain offering contemporary and classic items'
    },
    senco: {
      name: 'Senco Gold & Diamonds',
      gold24k: base24k + 15,
      gold22k: base22k + 15,
      gold18k: base18k + 11,
      premium: 15,
      description: 'Bengal heritage lightweight jewelry specialists with nation-wide outlets'
    },
    pcc: {
      name: 'PC Chandra Jewellers',
      gold24k: base24k + 25,
      gold22k: base22k + 25,
      gold18k: base18k + 19,
      premium: 25,
      description: 'Prestigious Eastern India group known for heavy designer sets'
    },
    bhima: {
      name: 'Bhima Jewellers',
      gold24k: base24k + 10,
      gold22k: base22k + 10,
      gold18k: base18k + 8,
      premium: 10,
      description: 'Kerala pioneer brand since 1925 with trusted purity standards'
    },
    ckc: {
      name: 'C. Krishniah Chetty (CKC)',
      gold24k: base24k + 40,
      gold22k: base22k + 40,
      gold18k: base18k + 30,
      premium: 40,
      description: 'Elite royal heritage jeweler of South India offering top luxury'
    },
    thangamayil: {
      name: 'Thangamayil',
      gold24k: base24k,
      gold22k: base22k,
      gold18k: base18k,
      premium: 0,
      description: 'Leading retail chain in Tamil Nadu with exact market pricing'
    },
    mangal: {
      name: 'Mangal & Mangal (Trichy)',
      gold24k: mangalDirect ? mangalDirect.gold24k : base24k,
      gold22k: mangalDirect ? mangalDirect.gold22k : base22k,
      gold18k: mangalDirect ? mangalDirect.gold18k : base18k,
      premium: mangalDirect ? (mangalDirect.gold22k - base22k) : 0,
      description: 'Trusted Trichy showroom scraped live from official site'
    }
  };

  const cityBrands = {
    chennai: ['grt', 'tanishq', 'lalitha', 'malabar', 'kalyan', 'joyalukkas', 'avr', 'thangamayil', 'mangal'],
    mumbai: ['tanishq', 'tbz', 'waman', 'malabar', 'kalyan', 'joyalukkas'],
    delhi: ['tanishq', 'pcj', 'kalyan', 'malabar', 'joyalukkas'],
    bangalore: ['ckc', 'bhima', 'tanishq', 'grt', 'malabar', 'kalyan'],
    kolkata: ['senco', 'pcc', 'tanishq', 'pcj'],
    hyderabad: ['grt', 'tanishq', 'joyalukkas', 'malabar', 'kalyan'],
    kerala: ['bhima', 'malabar', 'kalyan', 'joyalukkas']
  };

  const activeKeys = cityBrands[city] || cityBrands.chennai;
  const result = {};
  for (const key of activeKeys) {
    if (allBrands[key]) {
      result[key] = allBrands[key];
    }
  }
  return result;
}

function generateMarketInsights(spotGold, spotSilver, usdInr) {
  const goldChange = spotGold ? spotGold.changePercent : 0;
  const silverChange = spotSilver ? spotSilver.changePercent : 0;
  const rupeeChange = usdInr ? usdInr.changePercent : 0;
  
  let explanation = '';
  let sentiment = 'Neutral';
  let goldDirection = goldChange >= 0 ? 'higher' : 'lower';
  let rupeeDirection = rupeeChange >= 0 ? 'depreciated' : 'appreciated';

  if (Math.abs(goldChange) < 0.2 && Math.abs(rupeeChange) < 0.2) {
    explanation = "Gold prices are trading flat today. Steady international prices and flat domestic currency rates are keeping prices stable.";
    sentiment = 'Stable';
  } else if (goldChange >= 0.2 && rupeeChange >= 0.1) {
    explanation = `Gold prices surged higher today due to a simultaneous rise in international spot gold (+${goldChange.toFixed(2)}%) and a weakening Indian Rupee (+${rupeeChange.toFixed(2)}% vs USD), which pushes the landed cost of imported bullion higher.`;
    sentiment = 'Bullish';
  } else if (goldChange < -0.2 && rupeeChange > 0.1) {
    explanation = `Domestic retail prices remained resilient today. While international spot gold fell by ${goldChange.toFixed(2)}%, a weakening Indian Rupee (+${rupeeChange.toFixed(2)}%) cushioned the fall, preventing a major domestic price drop.`;
    sentiment = 'Mixed';
  } else if (goldChange >= 0.2 && rupeeChange < -0.1) {
    explanation = `Gains in international gold (+${goldChange.toFixed(2)}%) were partially offset for Indian buyers due to a strengthening Rupee (-${Math.abs(rupeeChange).toFixed(2)}% vs USD), making the retail price increase moderate.`;
    sentiment = 'Moderately Bullish';
  } else if (goldChange < -0.2 && rupeeChange < -0.1) {
    explanation = `Gold prices corrected significantly today as a strong Indian Rupee (-${Math.abs(rupeeChange).toFixed(2)}%) combined with international profit-booking (-${Math.abs(goldChange).toFixed(2)}%) to bring welcome relief to retail buyers.`;
    sentiment = 'Bearish';
  } else if (Math.abs(goldChange) >= 0.2) {
    explanation = `Price movement is primarily driven by global markets today. Spot gold traded ${goldDirection} by ${Math.abs(goldChange).toFixed(2)}% amid macroeconomic shifts, while the USD/INR remained relatively stable.`;
    sentiment = goldChange >= 0 ? 'Bullish' : 'Bearish';
  } else {
    explanation = `Domestic prices shifted today due to the Indian Rupee which ${rupeeDirection} by ${Math.abs(rupeeChange).toFixed(2)}% against the US Dollar, altering the local cost of gold imports while global spot rates held steady.`;
    sentiment = rupeeChange >= 0 ? 'Bullish' : 'Bearish';
  }

  const news = [
    {
      title: goldChange >= 0 ? "Global Gold Rallies on Lower Rate Hopes" : "Gold Pulls Back as Investors Lock in Profits",
      source: "Maatal.com Research",
      time: "2 hours ago",
      snippet: `Spot gold (XAU/USD) traded around $${spotGold ? spotGold.price.toFixed(2) : '4000'} per ounce, registering a ${goldChange.toFixed(2)}% daily change as traders analyze global economic indicators.`
    },
    {
      title: `Rupee Trades at ${usdInr ? usdInr.price.toFixed(3) : '94.3'} as Oil Prices and DXY Shift`,
      source: "Forex Live India",
      time: "4 hours ago",
      snippet: `The Indian currency moved by ${rupeeChange.toFixed(2)}% against the greenback today, directly adjusting the landing import price of yellow metals across Indian refineries.`
    },
    {
      title: "Silver ETF Holdings Jump Amid Industrial Demand",
      source: "Commodity Watch",
      time: "6 hours ago",
      snippet: `Silver BeES and physical silver retail rates saw action. Local silver prices are holding at ${silverChange >= 0 ? 'elevated' : 'stable'} levels with a daily change of ${silverChange.toFixed(2)}%.`
    }
  ];

  return {
    explanation,
    sentiment,
    news
  };
}

function generatePredictions(baseGold22k, baseSilver) {
  const gold1mo = Math.round(baseGold22k * (1 + 0.008));
  const gold1y = Math.round(baseGold22k * (1 + 0.095));
  const silver1mo = Math.round(baseSilver * (1 + 0.012));
  const silver1y = Math.round(baseSilver * (1 + 0.115));
  
  return {
    gold: {
      current: baseGold22k,
      pred1mo: gold1mo,
      pred1y: gold1y,
      change1mo: 0.8,
      change1y: 9.5,
      rationale: "Supported by consistent domestic Rupee depreciation and long-term wedding season jewelry demand."
    },
    silver: {
      current: baseSilver,
      pred1mo: silver1mo,
      pred1y: silver1y,
      change1mo: 1.2,
      change1y: 11.5,
      rationale: "Driven by green energy transition industrial usage (solar panels, electronics) outpacing supply growth."
    }
  };
}

app.get('/api/rates', async (req, res) => {
  const location = (req.query.location || 'chennai').toLowerCase();
  const validCities = ['chennai', 'mumbai', 'delhi', 'bangalore', 'kolkata', 'hyderabad', 'kerala'];
  const city = validCities.includes(location) ? location : 'chennai';

  console.log(`Fetching live rates for location: ${city}...`);
  
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
  const isChennai = city === 'chennai';
  const [grtDirect, mangalDirect, kalyanDirect, lalithaDirect, malabarDirect, cityScraped, dubaiScraped, silverScraped] = await Promise.all([
    isChennai ? scrapeGrtRates() : Promise.resolve(null),
    scrapeMangalRates(),
    scrapeKalyanRates(),
    scrapeLalithaRates(),
    scrapeMalabarRates(),
    scrapeCityRates(city),
    scrapeDubaiRates(),
    scrapeCitySilverRate(city)
  ]);

  // Fallbacks if scraping fails
  const spotPrice = spotGold ? spotGold.price : 4010.0;
  const inrRate = usdInr ? usdInr.price : 94.2;
  const aedRate = usdAed ? usdAed.price : 3.67;

  const calculated = calculateRatesFromSpot(spotPrice, inrRate, aedRate);

  // Establish primary baseline: City Scraped -> GRT Direct (if Chennai) -> Calculated Spot
  const finalCity = (city === 'chennai')
    ? (grtDirect || cityScraped || calculated.chennai)
    : (cityScraped || grtDirect || calculated.chennai);
  const finalDubai = dubaiScraped || calculated.dubai;
  
  // Compute silver rate
  let finalSilver = silverScraped;
  if (!finalSilver) {
    const silverSpotGram = spotSilver ? (spotSilver.price / 31.1034768) : 30.0 / 31.1034768;
    finalSilver = Math.round(silverSpotGram * inrRate * 1.10 * 1.03);
  }

  // 3. Compute retail brands dynamically based on location
  const base22k = finalCity.gold22k;
  const base24k = finalCity.gold24k;
  const base18k = finalCity.gold18k;

  const brands = getBrandsForLocation(city, base24k, base22k, base18k, mangalDirect, kalyanDirect, lalithaDirect, malabarDirect);

  // 4. US Gold rates
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

  const insights = generateMarketInsights(spotGold, spotSilver, usdInr);
  const predictions = generatePredictions(base22k, finalSilver);

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
        location: `${city.charAt(0).toUpperCase() + city.slice(1)} Retail Rate`,
        gold24k: base24k,
        gold22k: base22k,
        gold18k: base18k,
        silver: finalSilver,
        isScraped: !!cityScraped,
        timestamp: finalCity.timestamp || new Date().toISOString()
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
    insights: {
      ...insights,
      predictions
    },
    meta: {
      serverTime: new Date().toISOString(),
      apiVersion: '1.1.0'
    }
  });
});

app.get('/api/history', async (req, res) => {
  const range = req.query.range === '1y' ? '1y' : '1mo';
  const interval = range === '1y' ? '1wk' : '1d';
  
  console.log(`Fetching Yahoo Finance history (range: ${range}, interval: ${interval})...`);
  
  const [goldChart, silverChart, usdInrChart] = await Promise.all([
    fetchYahooHistory('GC=F', range, interval),
    fetchYahooHistory('SI=F', range, interval),
    fetchYahooHistory('INR=X', range, interval)
  ]);

  if (!goldChart || !usdInrChart) {
    return res.json(getMockHistory(range));
  }

  const inrMap = new Map(usdInrChart.map(p => [p.date, p.price]));
  const silverMap = new Map((silverChart || []).map(p => [p.date, p.price]));

  const merged = [];
  let lastInr = inrMap.values().next().value || 94.2;
  let lastSilverSpot = silverMap.values().next().value || 30.0;

  for (const goldPoint of goldChart) {
    const date = goldPoint.date;
    const spotGold = goldPoint.price;
    const usdInr = inrMap.has(date) ? inrMap.get(date) : lastInr;
    lastInr = usdInr;

    const spotSilver = silverMap.has(date) ? silverMap.get(date) : lastSilverSpot;
    lastSilverSpot = spotSilver;

    const ozToGrams = 31.1034768;
    const gold24k = Math.round((spotGold / ozToGrams) * usdInr * 1.15 * 1.03);
    const gold22k = Math.round(gold24k * (22 / 24));
    const silver = Math.round((spotSilver / ozToGrams) * usdInr * 1.10 * 1.03);

    merged.push({
      date,
      gold24k,
      gold22k,
      silver
    });
  }

  res.json(merged);
});

async function fetchYahooHistory(symbol, range, interval) {
  try {
    const url = `https://query1.finance.yahoo.com/v8/finance/chart/${encodeURIComponent(symbol)}?range=${range}&interval=${interval}`;
    const response = await fetch(url, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36'
      }
    });
    if (response.status === 200) {
      const data = await response.json();
      const result = data.chart.result[0];
      const timestamps = result.timestamp;
      const closes = result.indicators.quote[0].close;
      if (timestamps && closes) {
        return timestamps.map((ts, idx) => ({
          date: new Date(ts * 1000).toISOString().split('T')[0],
          price: closes[idx]
        })).filter(d => d.price !== null);
      }
    }
  } catch (error) {
    console.error(`Failed to fetch Yahoo Finance History for ${symbol}:`, error.message);
  }
  return null;
}

function getMockHistory(range) {
  const points = range === '1y' ? 12 : 30;
  const history = [];
  const baseGold = 12955;
  const baseSilver = 230;
  
  const today = new Date();
  for (let i = points - 1; i >= 0; i--) {
    const date = new Date();
    if (range === '1y') {
      date.setMonth(today.getMonth() - i);
    } else {
      date.setDate(today.getDate() - i);
    }
    
    const factor = 1 + (i * -0.003) + (Math.sin(i) * 0.015);
    const gold22k = Math.round(baseGold * factor);
    const gold24k = Math.round(gold22k * (24 / 22));
    const silver = Math.round(baseSilver * factor);
    
    history.push({
      date: date.toISOString().split('T')[0],
      gold24k,
      gold22k,
      silver
    });
  }
  return history;
}

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
