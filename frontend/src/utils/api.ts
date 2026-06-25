export interface MarketIndex {
  price: number;
  change: number;
  changePercent: number;
  currency: string;
  symbol: string;
}

export interface ExchangeRates {
  usdInr: number;
  usdAed: number;
  usdInrChangePercent: number;
  usdAedChangePercent: number;
}

export interface MarketData {
  spotGold: MarketIndex;
  spotSilver: MarketIndex;
  exchangeRates: ExchangeRates;
}

export interface AssociationRate {
  location: string;
  gold24k: number;
  gold22k: number;
  gold18k: number;
  silver: number;
  isScraped: boolean;
  timestamp: string;
}

export interface DubaiRate {
  currency: string;
  gold24k_aed: number;
  gold22k_aed: number;
  gold24k_inr: number;
  gold22k_inr: number;
  isScraped: boolean;
  timestamp: string;
}

export interface USRate {
  usd: {
    gold24k_oz: number;
    gold24k: number;
    gold22k: number;
    gold18k: number;
  };
  inr: {
    gold24k: number;
    gold22k: number;
    gold18k: number;
  };
  source: string;
}

export interface RetailBrand {
  name: string;
  gold24k: number;
  gold22k: number;
  gold18k: number;
  premium: number;
  description: string;
}

export interface RetailData {
  associationRate: AssociationRate;
  dubai: DubaiRate;
  us: USRate;
  brands: {
    [key: string]: RetailBrand;
  };
}

export interface GoldRatesPayload {
  market: MarketData;
  retail: RetailData;
  meta: {
    serverTime: string;
    apiVersion: string;
  };
}

const LOCAL_STORAGE_KEY = 'gold_rate_manual_overrides';

export interface ManualOverrides {
  enabled: boolean;
  spotGold: number;
  spotSilver: number;
  usdInr: number;
  gold22k: number; // Chennai base 22K
  gold24k: number; // Chennai base 24K
  silver: number;  // Chennai base silver
  dubai24k_aed: number;
  dubai22k_aed: number;
}

// Default fallback data (used if server is offline and no overrides exist)
export const getFallbackRates = (overrides?: ManualOverrides): GoldRatesPayload => {
  const isOverride = overrides && overrides.enabled;
  
  const spotGold = isOverride ? overrides.spotGold : 4010.50;
  const spotSilver = isOverride ? overrides.spotSilver : 31.40;
  const usdInr = isOverride ? overrides.usdInr : 94.185;
  const usdAed = 3.6725;
  
  const base24k = isOverride ? overrides.gold24k : 14335;
  const base22k = isOverride ? overrides.gold22k : 13140;
  const base18k = Math.round(base24k * (18 / 24));
  const silver = isOverride ? overrides.silver : 105;
  
  const dubai24k_aed = isOverride ? overrides.dubai24k_aed : 486.50;
  const dubai22k_aed = isOverride ? overrides.dubai22k_aed : 450.50;
  
  const dubai24k_inr = Math.round(dubai24k_aed * (usdInr / usdAed));
  const dubai22k_inr = Math.round(dubai22k_aed * (usdInr / usdAed));

  const brands: { [key: string]: RetailBrand } = {
    tanishq: {
      name: 'Tanishq (Tata)',
      gold24k: base24k + 95,
      gold22k: base22k + 90,
      gold18k: base18k + 75,
      premium: 90,
      description: 'Premium branding and certified purity (Tata group)'
    },
    grt: {
      name: 'GRT Jewellers',
      gold24k: base24k + 5,
      gold22k: base22k + 5,
      gold18k: base18k + 5,
      premium: 5,
      description: 'Traditional South Indian patterns and transparent rates'
    },
    lalitha: {
      name: 'Lalitha Jewellery',
      gold24k: base24k,
      gold22k: base22k,
      gold18k: base18k,
      premium: 0,
      description: 'Known for wholesale pricing and lowest making charges'
    },
    atr: {
      name: 'ATR Jewellers',
      gold24k: base24k + 15,
      gold22k: base22k + 15,
      gold18k: base18k + 10,
      premium: 15,
      description: 'Local boutique jewelry with hand-crafted custom designs'
    },
    kalyan: {
      name: 'Kalyan Jewellers',
      gold24k: base24k + 30,
      gold22k: base22k + 30,
      gold18k: base18k + 25,
      premium: 30,
      description: 'National presence with designer and bridal collections'
    },
    joyalukkas: {
      name: 'Joyalukkas',
      gold24k: base24k + 25,
      gold22k: base22k + 25,
      gold18k: base18k + 20,
      premium: 25,
      description: 'World-renowned collections and global standard retail rate'
    },
    malabar: {
      name: 'Malabar Gold & Diamonds',
      gold24k: base24k + 20,
      gold22k: base22k + 20,
      gold18k: base18k + 15,
      premium: 20,
      description: 'Responsible sourcing and certified 916 purity assurances'
    },
    avr: {
      name: 'AVR Swarna Mahal',
      gold24k: base24k + 10,
      gold22k: base22k + 10,
      gold18k: base18k + 8,
      premium: 10,
      description: 'Regional brand popular in Tamil Nadu for high-finish details'
    }
  };

  const us24k = parseFloat((spotGold / 31.1034768).toFixed(2));
  const us22k = parseFloat((us24k * (22 / 24)).toFixed(2));
  const us18k = parseFloat((us24k * (18 / 24)).toFixed(2));

  return {
    market: {
      spotGold: { price: spotGold, change: -12.4, changePercent: -0.31, currency: 'USD', symbol: 'GC=F' },
      spotSilver: { price: spotSilver, change: 0.15, changePercent: 0.48, currency: 'USD', symbol: 'SI=F' },
      exchangeRates: {
        usdInr,
        usdAed,
        usdInrChangePercent: 0.05,
        usdAedChangePercent: 0
      }
    },
    retail: {
      associationRate: {
        location: 'Chennai (Madras Jewellers Association)',
        gold24k: base24k,
        gold22k: base22k,
        gold18k: base18k,
        silver,
        isScraped: false,
        timestamp: new Date().toISOString()
      },
      dubai: {
        currency: 'AED',
        gold24k_aed: dubai24k_aed,
        gold22k_aed: dubai22k_aed,
        gold24k_inr: dubai24k_inr,
        gold22k_inr: dubai22k_inr,
        isScraped: false,
        timestamp: new Date().toISOString()
      },
      us: {
        usd: {
          gold24k_oz: spotGold,
          gold24k: us24k,
          gold22k: us22k,
          gold18k: us18k
        },
        inr: {
          gold24k: Math.round(us24k * usdInr),
          gold22k: Math.round(us22k * usdInr),
          gold18k: Math.round(us18k * usdInr)
        },
        source: 'COMEX Spot Market'
      },
      brands
    },
    meta: {
      serverTime: new Date().toISOString(),
      apiVersion: '1.0.0-fallback'
    }
  };
};

export const getSavedOverrides = (): ManualOverrides => {
  const saved = localStorage.getItem(LOCAL_STORAGE_KEY);
  if (saved) {
    try {
      return JSON.parse(saved);
    } catch {
      // ignore parsing error
    }
  }
  return {
    enabled: false,
    spotGold: 4010.50,
    spotSilver: 31.40,
    usdInr: 94.185,
    gold22k: 13140,
    gold24k: 14335,
    silver: 105,
    dubai24k_aed: 486.50,
    dubai22k_aed: 450.50
  };
};

export const saveOverrides = (overrides: ManualOverrides) => {
  localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(overrides));
};

export const fetchGoldRates = async (): Promise<GoldRatesPayload> => {
  const overrides = getSavedOverrides();
  
  // If overrides are enabled, bypass network and return override calculations
  if (overrides.enabled) {
    console.log('Using manual pricing overrides...');
    return getFallbackRates(overrides);
  }

  try {
    // Try to hit the local Express server
    const res = await fetch('http://localhost:5000/api/rates');
    if (res.ok) {
      return await res.json();
    }
    throw new Error('Server returned error status');
  } catch (err) {
    console.warn('API server unavailable, using local live proxy calculations or default parameters:', err);
    
    // In mobile Capacitor or browser fallback, we can try to query Yahoo Finance directly!
    // Since this runs on the client-side, in web browsers it might trigger a CORS error, but on mobile it works.
    try {
      const goldRes = await fetch('https://query1.finance.yahoo.com/v8/finance/chart/GC=F');
      if (goldRes.ok) {
        const goldData = await goldRes.json();
        const spotPrice = goldData.chart.result[0].meta.regularMarketPrice;
        
        const inrRes = await fetch('https://query1.finance.yahoo.com/v8/finance/chart/INR=X');
        const inrRate = inrRes.ok ? (await inrRes.json()).chart.result[0].meta.regularMarketPrice : 94.185;
        
        console.log(`Direct Yahoo fetch success! Spot Gold: $${spotPrice}, USD/INR: ${inrRate}`);
        
        // Calculate dynamically
        const ozToGrams = 31.1034768;
        const spotInrGram = (spotPrice / ozToGrams) * inrRate;
        const computed24k = Math.round(spotInrGram * 1.15 * 1.03); // 15% customs + 3% GST
        const computed22k = Math.round(computed24k * (22 / 24));
        
        const dynamicOverrides: ManualOverrides = {
          enabled: false,
          spotGold: spotPrice,
          spotSilver: 31.40,
          usdInr: inrRate,
          gold24k: computed24k,
          gold22k: computed22k,
          silver: Math.round((31.40 / ozToGrams) * inrRate * 1.10 * 1.03),
          dubai24k_aed: parseFloat(((spotPrice / ozToGrams) * 3.6725 * 1.015).toFixed(2)),
          dubai22k_aed: parseFloat((((spotPrice / ozToGrams) * 3.6725 * 1.015) * (22/24)).toFixed(2))
        };
        return getFallbackRates(dynamicOverrides);
      }
    } catch (directErr) {
      console.warn('Direct Yahoo Finance fetch blocked by CORS or network, returning fallback data:', directErr);
    }
    
    return getFallbackRates();
  }
};
