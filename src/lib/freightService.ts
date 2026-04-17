/**
 * Freight Service Wrapper
 * This service centralizes API calls to freight providers like SeaRates or Upply.
 * It normalizes data into the format expected by our Dashboard UI.
 */

export interface FreightRateResponse {
  rate: number;
  change24h: number;
  history: { time: string; rate: number }[];
}

const PROVIDER = process.env.NEXT_PUBLIC_FREIGHT_PROVIDER || 'MOCK';
const API_KEY = process.env.FREIGHT_API_KEY;

export async function fetchRouteRate(origin: string, destination: string): Promise<FreightRateResponse> {
  // If mock or no API key, return null to fall back to simulated data
  if (PROVIDER === 'MOCK' || !API_KEY) {
    return {
      rate: 0, 
      change24h: 0,
      history: []
    };
  }

  try {
    switch (PROVIDER) {
      case 'SEARATES':
        return await fetchSeaRates(origin, destination);
      case 'UPPLY':
        return await fetchUpply(origin, destination);
      default:
        throw new Error('Unknown Provider');
    }
  } catch (error) {
    console.error('Error fetching freight rate:', error);
    throw error;
  }
}

/**
 * SeaRates Integration Implementation
 * Docs: https://developer.searates.com/
 */
async function fetchSeaRates(origin: string, destination: string): Promise<FreightRateResponse> {
  // Replace with actual SeaRates endpoint logic
  // e.g., const res = await fetch(`https://api.searates.com/v1/rates?origin=${origin}&dest=${destination}&api_key=${API_KEY}`);
  // const data = await res.json();
  
  return {
    rate: 5200, // Placeholder
    change24h: 2.5,
    history: [] // Populate from API if available
  };
}

/**
 * Upply Integration Implementation
 */
async function fetchUpply(origin: string, destination: string): Promise<FreightRateResponse> {
  // Implementation for Upply benchmark API
  return {
    rate: 4800,
    change24h: -1.2,
    history: []
  };
}
