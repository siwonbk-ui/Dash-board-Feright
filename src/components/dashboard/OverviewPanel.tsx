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
    <Card className="bg-card/80 backdrop-blur-xl border-slate-200 shadow-xl relative overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-transparent pointer-events-none" />
      <CardHeader className="flex flex-row items-center justify-between pb-2">
        <CardTitle className="text-sm font-semibold uppercase tracking-widest text-slate-500">
          Global Average Freight Cost
        </CardTitle>
        <Activity className="h-5 w-5 text-indigo-600" />
      </CardHeader>
      <CardContent>
        <div className="flex items-baseline space-x-4">
          <motion.div 
            key={globalAverage}
            initial={{ scale: 0.95, opacity: 0.8 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 0.3 }}
            className="text-5xl font-bold tracking-tighter text-slate-900"
          >
            ${globalAverage.toLocaleString(undefined, { maximumFractionDigits: 0 })}
          </motion.div>
          <div className="flex items-center text-sm font-semibold text-emerald-600 bg-emerald-50 px-2 py-1 rounded-full border border-emerald-100">
            <ArrowDownIcon className="h-4 w-4 mr-1" />
            1.2%
          </div>
        </div>
        <p className="mt-2 text-sm text-slate-500 font-medium">
          Comprehensive market index (24h update)
        </p>
      </CardContent>
    </Card>
  );
}
