"use client";

import { useState } from "react";
import { useFreightData } from "@/hooks/useFreightData";
import { OverviewPanel } from "@/components/dashboard/OverviewPanel";
import InteractiveMap from "@/components/dashboard/InteractiveMap";
import { RouteTable } from "@/components/dashboard/RouteTable";
import { TrendChart } from "@/components/dashboard/TrendChart";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Ship, Globe } from "lucide-react";

export default function Dashboard() {
  const { routes, globalAverage } = useFreightData();
  const [selectedRouteId, setSelectedRouteId] = useState<string>(routes[0]?.id || "CN-US");

  const selectedRoute = routes.find(r => r.id === selectedRouteId) || routes[0];

  return (
    <div className="min-h-screen relative selection:bg-indigo-100">
      <div className="container mx-auto p-4 md:p-8 space-y-6 max-w-7xl relative z-10">
        
        {/* Header */}
        <header className="flex items-center justify-between mb-8 pb-6 border-b border-slate-200">
          <div className="flex items-center space-x-4">
            <div className="w-12 h-12 rounded-2xl bg-indigo-600 flex items-center justify-center shadow-lg shadow-indigo-200">
              <Ship className="text-white h-6 w-6" />
            </div>
            <div>
              <h1 className="text-3xl font-black tracking-tight text-slate-900">
                Nexus<span className="text-indigo-600">Freight</span>
              </h1>
              <div className="flex items-center text-[10px] font-bold text-slate-400 uppercase tracking-[0.2em]">
                <Globe className="h-3 w-3 mr-1" />
                Real-time Intelligence Platform
              </div>
            </div>
          </div>
          
          <div className="flex items-center space-x-2 bg-white rounded-full px-5 py-2 border border-slate-200 shadow-sm">
            <span className="relative flex h-2.5 w-2.5">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-emerald-500 text-white"></span>
            </span>
            <span className="text-xs font-bold text-slate-600 tracking-wide uppercase">Live Market Data</span>
          </div>
        </header>

        {/* Top Row: KPIs and Map */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-1 space-y-8">
            <OverviewPanel globalAverage={globalAverage} />
            
            <Card className="bg-white border-slate-200 shadow-xl">
              <CardHeader className="pb-2 border-b border-slate-50">
                <CardTitle className="text-xs font-bold text-slate-400 uppercase tracking-widest">
                  Live Trend Analysis
                </CardTitle>
                <div className="text-xl font-bold mt-2 flex items-baseline gap-2 text-slate-800">
                  {selectedRoute?.origin} <span className="text-slate-300 text-sm font-medium">→</span> {selectedRoute?.destination}
                </div>
              </CardHeader>
              <CardContent>
                <TrendChart route={selectedRoute} />
              </CardContent>
            </Card>
          </div>
          
          <div className="lg:col-span-2">
             <InteractiveMap 
               routes={routes} 
               selectedRouteId={selectedRouteId} 
               onSelectRoute={setSelectedRouteId} 
             />
          </div>
        </div>

        {/* Bottom Row: Table */}
        <div className="grid grid-cols-1 pt-4">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-bold tracking-tight text-slate-800 flex items-center">
              Active Trade Segments
              <span className="ml-3 px-2 py-0.5 bg-slate-100 text-slate-500 text-[10px] rounded-md border border-slate-200 uppercase tracking-tighter">
                {routes.length} Active
              </span>
            </h2>
          </div>
          <RouteTable 
            routes={routes} 
            onSelectRoute={setSelectedRouteId}
            selectedRouteId={selectedRouteId} 
          />
        </div>
        
      </div>
    </div>
  );
}
