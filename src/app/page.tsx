"use client";

import { useState } from "react";
import { useFreightData } from "@/hooks/useFreightData";
import { OverviewPanel } from "@/components/dashboard/OverviewPanel";
import InteractiveMap from "@/components/dashboard/InteractiveMap";
import { RouteTable } from "@/components/dashboard/RouteTable";
import { TrendChart } from "@/components/dashboard/TrendChart";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Ship } from "lucide-react";

export default function Dashboard() {
  const { routes, globalAverage } = useFreightData();
  const [selectedRouteId, setSelectedRouteId] = useState<string>(routes[0]?.id || "CN-US");

  const selectedRoute = routes.find(r => r.id === selectedRouteId) || routes[0];

  return (
    <div className="min-h-screen relative selection:bg-primary/30">
      <div className="container mx-auto p-4 md:p-8 space-y-6 max-w-7xl relative z-10">
        
        {/* Header */}
        <header className="flex items-center justify-between mb-8 pb-4 border-b border-white/10">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center shadow-lg shadow-indigo-500/20">
              <Ship className="text-white h-5 w-5" />
            </div>
            <div>
              <h1 className="text-2xl font-bold tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-white to-white/60">
                Nexus<span className="font-light text-white/50">Freight</span>
              </h1>
              <p className="text-xs text-muted-foreground uppercase tracking-widest">Real-time Global Index</p>
            </div>
          </div>
          
          <div className="flex items-center space-x-2 bg-black/20 rounded-full px-4 py-1.5 border border-white/5 backdrop-blur-md">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
            </span>
            <span className="text-xs font-mono text-emerald-400">LIVE FEED</span>
          </div>
        </header>

        {/* Top Row: KPIs and Map */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-1 space-y-6">
            <OverviewPanel globalAverage={globalAverage} />
            
            <Card className="bg-card/50 backdrop-blur-xl border-white/10 shadow-2xl">
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground uppercase tracking-widest">
                  Live Market View
                </CardTitle>
                <div className="text-2xl font-semibold mt-1 flex items-baseline gap-2">
                  {selectedRoute?.origin} <span className="text-muted-foreground text-sm font-normal">to</span> {selectedRoute?.destination}
                </div>
              </CardHeader>
              <CardContent>
                <TrendChart route={selectedRoute} />
              </CardContent>
            </Card>
          </div>
          
          <div className="lg:col-span-2 min-h-[400px]">
             <InteractiveMap 
               routes={routes} 
               selectedRouteId={selectedRouteId} 
               onSelectRoute={setSelectedRouteId} 
             />
          </div>
        </div>

        {/* Bottom Row: Table */}
        <div className="grid grid-cols-1 pt-4">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-medium tracking-tight">Active Trade Routes</h2>
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
