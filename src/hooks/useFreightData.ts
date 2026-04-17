import { useState, useEffect } from 'react';

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
}

const INITIAL_ROUTES: RouteData[] = [
  {
    id: 'CN-US', origin: 'Shanghai', destination: 'Los Angeles',
    originCoords: [121.4737, 31.2304], destCoords: [-118.2437, 34.0522],
    currentRate: 4250, previousRate: 4100, changePercent: 3.65,
    history: Array.from({ length: 20 }, (_, i) => ({
      time: new Date(Date.now() - (20 - i) * 60000).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      rate: 4000 + Math.random() * 300
    }))
  },
  {
    id: 'EU-AS', origin: 'Rotterdam', destination: 'Singapore',
    originCoords: [4.4792, 51.9225], destCoords: [103.8198, 1.3521],
    currentRate: 3100, previousRate: 3250, changePercent: -4.61,
    history: Array.from({ length: 20 }, (_, i) => ({
      time: new Date(Date.now() - (20 - i) * 60000).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      rate: 3000 + Math.random() * 400
    }))
  },
  {
    id: 'US-EU', origin: 'New York', destination: 'Hamburg',
    originCoords: [-74.006, 40.7128], destCoords: [9.9937, 53.5511],
    currentRate: 2800, previousRate: 2750, changePercent: 1.81,
    history: Array.from({ length: 20 }, (_, i) => ({
      time: new Date(Date.now() - (20 - i) * 60000).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      rate: 2600 + Math.random() * 300
    }))
  },
  {
    id: 'AS-ME', origin: 'Busan', destination: 'Dubai',
    originCoords: [129.0756, 35.1796], destCoords: [55.2708, 25.2048],
    currentRate: 3600, previousRate: 3600, changePercent: 0,
    history: Array.from({ length: 20 }, (_, i) => ({
      time: new Date(Date.now() - (20 - i) * 60000).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      rate: 3400 + Math.random() * 300
    }))
  }
];

export function useFreightData() {
  const [routes, setRoutes] = useState<RouteData[]>(INITIAL_ROUTES);
  const [globalAverage, setGlobalAverage] = useState(0);

  useEffect(() => {
    setGlobalAverage(routes.reduce((acc, curr) => acc + curr.currentRate, 0) / routes.length);
  }, [routes]);

  // Simulate real-time WebSocket updates
  useEffect(() => {
    const interval = setInterval(() => {
      setRoutes(currentRoutes => 
        currentRoutes.map(route => {
          // Adjust rate randomly between -5% and +5%
          const volatility = 0.05;
          const change = 1 + (Math.random() * volatility * 2 - volatility);
          let newRate = Math.round(route.currentRate * change);
          
          // boundary checks
          if (newRate < 1000) newRate = 1000 + Math.random() * 500;
          if (newRate > 10000) newRate = 10000 - Math.random() * 500;

          const changePercent = ((newRate - route.currentRate) / route.currentRate) * 100;
          
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
        })
      );
    }, 4000); // Polling every 4 seconds

    return () => clearInterval(interval);
  }, []);

  return { routes, globalAverage };
}
