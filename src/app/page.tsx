"use client";

import { useState } from "react";
import { useFreightData } from "@/hooks/useFreightData";
import { OverviewPanel } from "@/components/dashboard/OverviewPanel";
import InteractiveMap from "@/components/dashboard/InteractiveMap";
import { RouteTable } from "@/components/dashboard/RouteTable";
import { TrendChart } from "@/components/dashboard/TrendChart";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Ship, Globe, Info } from "lucide-react";

export default function Dashboard() {
  const { routes, globalAverage } = useFreightData();
  const [selectedRouteId, setSelectedRouteId] = useState<string>(routes[0]?.id || "TH-CN");

  const selectedRoute = routes.find(r => r.id === selectedRouteId) || routes[0];

  return (
    <div className="min-h-screen relative selection:bg-indigo-100 pb-20">
      <div className="container mx-auto p-4 md:p-8 space-y-6 max-w-7xl relative z-10">
        
        {/* Header */}
        <header className="flex flex-col md:flex-row md:items-center justify-between mb-8 pb-6 border-b border-slate-200 gap-4">
          <div className="flex items-center space-x-4">
            <div className="w-14 h-14 rounded-2xl bg-indigo-600 flex items-center justify-center shadow-lg shadow-indigo-200">
              <Ship className="text-white h-8 w-8" />
            </div>
            <div>
              <h1 className="text-3xl font-black tracking-tighter text-slate-900">
                Nexus<span className="text-indigo-600">Freight</span>
              </h1>
              <div className="flex items-center text-[11px] font-black text-slate-400 uppercase tracking-[0.2em] mt-0.5">
                <Globe className="h-3 w-3 mr-1.5" />
                Global Container Index Platform
              </div>
            </div>
          </div>
          
          <div className="flex flex-wrap items-center gap-3">
            <div className="flex items-center space-x-2 bg-slate-900 text-white rounded-xl px-4 py-2 shadow-xl">
               <span className="text-[10px] font-black uppercase tracking-widest text-indigo-300">Unit:</span>
               <span className="text-xs font-bold font-mono">USD / 40ft (FEU)</span>
            </div>
            <div className="flex items-center space-x-2 bg-white rounded-xl px-4 py-2 border border-slate-200 shadow-sm">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
              </span>
              <span className="text-[10px] font-black text-slate-600 tracking-wide uppercase">Real-time Feed</span>
            </div>
          </div>
        </header>

        {/* Top Row: KPIs and Map */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-1 space-y-8">
            <OverviewPanel globalAverage={globalAverage} />
            
            <Card className="bg-white border-slate-200 shadow-2xl relative overflow-hidden group">
              <div className="absolute top-0 right-0 p-3 opacity-20 group-hover:opacity-40 transition-opacity">
                 <Info className="h-4 w-4 text-slate-400" />
              </div>
              <CardHeader className="pb-2 border-b border-slate-50 bg-slate-50/30">
                <CardTitle className="text-[10px] font-black text-slate-400 uppercase tracking-widest">
                  Live Trend Analysis (USD/FEU)
                </CardTitle>
                <div className="text-xl font-black mt-2 flex items-baseline gap-2 text-slate-800">
                  {selectedRoute?.origin} <span className="text-slate-300 text-sm font-light">→</span> {selectedRoute?.destination}
                </div>
              </CardHeader>
              <CardContent>
                <TrendChart route={selectedRoute} />
                <div className="mt-4 pt-4 border-t border-slate-100 flex items-center justify-between">
                   <div className="text-[9px] font-bold text-slate-400 uppercase">Reporting Basis</div>
                   <Badge className="bg-slate-100 text-slate-600 border-0 hover:bg-slate-100">FCL - Ocean Freight</Badge>
                </div>
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
            <h2 className="text-xl font-black tracking-tight text-slate-800 flex items-center">
              Active Export Segments
              <span className="ml-3 px-2 py-0.5 bg-indigo-600 text-white text-[9px] font-black rounded uppercase tracking-tighter">
                {routes.length} Active Routes
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
