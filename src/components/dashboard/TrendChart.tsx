"use client";

import { RouteData } from "@/hooks/useFreightData";
import { Area, AreaChart, ResponsiveContainer, Tooltip, XAxis, YAxis, CartesianGrid } from "recharts";

interface TrendChartProps {
  route: RouteData;
}

export function TrendChart({ route }: TrendChartProps) {
  const isUp = route.changePercent > 0;
  // Use red for going up (bad for shipping cost), green for going down
  const strokeColor = isUp ? "#ef4444" : "#10b981";
  const fillGradient = isUp ? "url(#colorRed)" : "url(#colorGreen)";

  return (
    <div className="h-[300px] w-full mt-4">
      <ResponsiveContainer width="100%" height="100%">
        <AreaChart data={route.history} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
          <defs>
            <linearGradient id="colorGreen" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#10b981" stopOpacity={0.3}/>
              <stop offset="95%" stopColor="#10b981" stopOpacity={0}/>
            </linearGradient>
            <linearGradient id="colorRed" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#ef4444" stopOpacity={0.3}/>
              <stop offset="95%" stopColor="#ef4444" stopOpacity={0}/>
            </linearGradient>
          </defs>
          <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="rgba(255,255,255,0.1)" />
          <XAxis 
            dataKey="time" 
            tick={{ fill: 'rgba(255,255,255,0.5)', fontSize: 12 }}
            tickLine={false}
            axisLine={false}
            minTickGap={30}
          />
          <YAxis 
            domain={['dataMin - 100', 'dataMax + 100']}
            tick={{ fill: 'rgba(255,255,255,0.5)', fontSize: 12 }}
            tickLine={false}
            axisLine={false}
            tickFormatter={(value) => `$${value}`}
            width={60}
          />
          <Tooltip 
            contentStyle={{ backgroundColor: 'rgba(0,0,0,0.8)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '8px' }}
            itemStyle={{ color: '#fff', fontWeight: 'bold' }}
            formatter={(value: any) => [`$${Number(value).toFixed(0)}`, 'Rate']}
            labelStyle={{ color: 'rgba(255,255,255,0.5)', marginBottom: '5px' }}
          />
          <Area 
            type="monotone" 
            dataKey="rate" 
            stroke={strokeColor} 
            strokeWidth={3}
            fillOpacity={1} 
            fill={fillGradient} 
            isAnimationActive={false} // Disable to avoid jumping on fast tick updates
          />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
}
