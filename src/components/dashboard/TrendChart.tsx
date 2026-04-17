"use client";

import { RouteData } from "@/hooks/useFreightData";
import { Area, AreaChart, ResponsiveContainer, Tooltip, XAxis, YAxis, CartesianGrid } from "recharts";

interface TrendChartProps {
  route: RouteData;
}

export function TrendChart({ route }: TrendChartProps) {
  const isUp = route.changePercent > 0;
  // Use red for going up (bad for shipping cost), green for going down
  const strokeColor = isUp ? "#dc2626" : "#059669";
  const fillGradient = isUp ? "url(#colorRedLight)" : "url(#colorGreenLight)";

  return (
    <div className="h-[300px] w-full mt-4">
      <ResponsiveContainer width="100%" height="100%">
        <AreaChart data={route.history} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
          <defs>
            <linearGradient id="colorGreenLight" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#10b981" stopOpacity={0.2}/>
              <stop offset="95%" stopColor="#10b981" stopOpacity={0}/>
            </linearGradient>
            <linearGradient id="colorRedLight" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#ef4444" stopOpacity={0.2}/>
              <stop offset="95%" stopColor="#ef4444" stopOpacity={0}/>
            </linearGradient>
          </defs>
          <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="rgba(0,0,0,0.05)" />
          <XAxis 
            dataKey="time" 
            tick={{ fill: 'rgba(0,0,0,0.4)', fontSize: 11, fontWeight: 500 }}
            tickLine={false}
            axisLine={false}
            minTickGap={30}
          />
          <YAxis 
            domain={['dataMin - 100', 'dataMax + 100']}
            tick={{ fill: 'rgba(0,0,0,0.4)', fontSize: 11, fontWeight: 500 }}
            tickLine={false}
            axisLine={false}
            tickFormatter={(value) => `$${value}`}
            width={55}
          />
          <Tooltip 
            contentStyle={{ backgroundColor: 'white', border: '1px solid #e2e8f0', borderRadius: '12px', boxShadow: '0 10px 15px -3px rgba(0,0,0,0.1)' }}
            itemStyle={{ color: '#0f172a', fontWeight: 'bold' }}
            formatter={(value: any) => [`$${Number(value).toFixed(0)}`, 'Rate']}
            labelStyle={{ color: '#64748b', marginBottom: '5px', fontWeight: 'bold', fontSize: '10px' }}
          />
          <Area 
            type="monotone" 
            dataKey="rate" 
            stroke={strokeColor} 
            strokeWidth={3}
            fillOpacity={1} 
            fill={fillGradient} 
            isAnimationActive={false}
          />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
}
