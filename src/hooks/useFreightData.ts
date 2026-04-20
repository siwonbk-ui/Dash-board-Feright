import { useState, useEffect } from 'react';
import { fetchRouteRate } from '@/lib/freightService';

export interface RouteData {
  id: string;
  origin: string;
  destination: string;
  originCoords: [number, number]; // [lng, lat]
  destCoords: [number, number];
  currentRate: number;
  previousRate: number;
  changePercent: number;
  history: { time: string; rate: number }[];
  dailyHistory: { time: string; rate: number }[];
}

const THAILAND_COORDS: [number, number] = [100.91, 13.06]; // Laem Chabang

const generateDailyHistory = (baseRate: number) => {
  return Array.from({ length: 30 }, (_, i) => {
    const date = new Date();
    date.setDate(date.getDate() - (30 - i));
    return {
      time: date.toLocaleDateString([], { month: 'short', day: 'numeric' }),
      rate: Math.round(baseRate * (0.9 + Math.random() * 0.2))
    };
  });
};

const INITIAL_ROUTES: RouteData[] = [
  {
    id: 'TH-CN', origin: 'Laem Chabang', destination: 'Shanghai',
    originCoords: THAILAND_COORDS, destCoords: [121.4737, 31.2304],
    currentRate: 1250, previousRate: 1200, changePercent: 4.17,
    history: Array.from({ length: 20 }, (_, i) => ({
      time: new Date(Date.now() - (20 - i) * 60000).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      rate: 1100 + Math.random() * 200
    })),
    dailyHistory: generateDailyHistory(1200)
  },
  {
    id: 'TH-US', origin: 'Laem Chabang', destination: 'Los Angeles',
    originCoords: THAILAND_COORDS, destCoords: [-118.2437, 34.0522],
    currentRate: 4850, previousRate: 4700, changePercent: 3.19,
    history: Array.from({ length: 20 }, (_, i) => ({
      time: new Date(Date.now() - (20 - i) * 60000).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      rate: 4600 + Math.random() * 400
    })),
    dailyHistory: generateDailyHistory(4700)
  },
  {
    id: 'TH-EU', origin: 'Laem Chabang', destination: 'Rotterdam',
    originCoords: THAILAND_COORDS, destCoords: [4.4792, 51.9225],
    currentRate: 3400, previousRate: 3550, changePercent: -4.22,
    history: Array.from({ length: 20 }, (_, i) => ({
      time: new Date(Date.now() - (20 - i) * 60000).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      rate: 3200 + Math.random() * 400
    })),
    dailyHistory: generateDailyHistory(3500)
  },
  {
    id: 'TH-ME', origin: 'Laem Chabang', destination: 'Dubai',
    originCoords: THAILAND_COORDS, destCoords: [55.2708, 25.2048],
    currentRate: 2100, previousRate: 2100, changePercent: 0,
    history: Array.from({ length: 20 }, (_, i) => ({
      time: new Date(Date.now() - (20 - i) * 60000).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      rate: 1900 + Math.random() * 300
    })),
    dailyHistory: generateDailyHistory(2100)
  },
  {
    id: 'TH-JP', origin: 'Laem Chabang', destination: 'Tokyo',
    originCoords: THAILAND_COORDS, destCoords: [139.6917, 35.6895],
    currentRate: 1850, previousRate: 1800, changePercent: 2.78,
    history: Array.from({ length: 20 }, (_, i) => ({
      time: new Date(Date.now() - (20 - i) * 60000).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      rate: 1700 + Math.random() * 250
    })),
    dailyHistory: generateDailyHistory(1800)
  }
];

export function useFreightData() {
  const [routes, setRoutes] = useState<RouteData[]>(INITIAL_ROUTES);
  const [globalAverage, setGlobalAverage] = useState(0);

  useEffect(() => {
    setGlobalAverage(routes.reduce((acc, curr) => acc + curr.currentRate, 0) / routes.length);
  }, [routes]);

  useEffect(() => {
    const updateAllRates = async () => {
      const updatedRoutes = await Promise.all(routes.map(async (route) => {
        // Attempt to fetch real rate
        const apiData = await fetchRouteRate(route.origin, route.destination);
        
        let newRate: number;
        let changePercent: number;
        
        if (apiData && apiData.rate > 0) {
          // Use real data
          newRate = apiData.rate;
          changePercent = apiData.change24h;
        } else {
          // Fallback to simulation
          const volatility = 0.05;
          const change = 1 + (Math.random() * volatility * 2 - volatility);
          newRate = Math.round(route.currentRate * change);
          if (newRate < 800) newRate = 800 + Math.random() * 400;
          if (newRate > 12000) newRate = 12000 - Math.random() * 500;
          changePercent = ((newRate - route.currentRate) / route.currentRate) * 100;
        }

        const newHistory = [...route.history.slice(1), {
          time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' }),
          rate: newRate
        }];

        return {
          ...route,
          previousRate: route.currentRate,
          currentRate: newRate,
          changePercent,
          history: newHistory
        };
      }));
      
      setRoutes(updatedRoutes);
    };

    const interval = setInterval(updateAllRates, 5000); // Polling every 5 seconds

    return () => clearInterval(interval);
  }, [routes]);

  return { routes, globalAverage };
}
