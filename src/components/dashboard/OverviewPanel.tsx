"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ArrowDownIcon, ArrowUpIcon, Activity } from "lucide-react";
import { motion } from "framer-motion";

interface OverviewPanelProps {
  globalAverage: number;
}

export function OverviewPanel({ globalAverage }: OverviewPanelProps) {
  return (
    <Card className="bg-card/50 backdrop-blur-xl border-white/10 shadow-2xl relative overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-br from-primary/10 to-transparent pointer-events-none" />
      <CardHeader className="flex flex-row items-center justify-between pb-2">
        <CardTitle className="text-xl font-medium tracking-tight text-foreground/80">
          Global Average Freight Cost
        </CardTitle>
        <Activity className="h-5 w-5 text-primary" />
      </CardHeader>
      <CardContent>
        <div className="flex items-baseline space-x-4">
          <motion.div 
            key={globalAverage}
            initial={{ scale: 0.9, opacity: 0.5, color: '#10b981' }}
            animate={{ scale: 1, opacity: 1, color: 'inherit' }}
            transition={{ duration: 0.5 }}
            className="text-5xl font-bold tracking-tighter text-transparent bg-clip-text bg-gradient-to-r from-white to-white/70"
          >
            ${globalAverage.toLocaleString(undefined, { maximumFractionDigits: 0 })}
          </motion.div>
          <div className="flex items-center text-sm font-medium text-emerald-400 bg-emerald-400/10 px-2 py-1 rounded-full">
            <ArrowDownIcon className="h-4 w-4 mr-1" />
            1.2% (24h)
          </div>
        </div>
        <p className="mt-2 text-sm text-muted-foreground">
          Aggregated index based on major trade routes.
        </p>
      </CardContent>
    </Card>
  );
}
