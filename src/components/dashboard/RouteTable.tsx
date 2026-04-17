"use client";

import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { RouteData } from "@/hooks/useFreightData";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowDownRight, ArrowUpRight, Minus } from "lucide-react";

interface RouteTableProps {
  routes: RouteData[];
  onSelectRoute: (id: string) => void;
  selectedRouteId: string;
}

export function RouteTable({ routes, onSelectRoute, selectedRouteId }: RouteTableProps) {
  return (
    <div className="rounded-xl border border-slate-200 bg-white shadow-xl overflow-hidden">
      <Table>
        <TableHeader className="bg-slate-50/80">
          <TableRow className="border-slate-100 hover:bg-transparent">
            <TableHead className="text-slate-500 font-bold uppercase text-[10px] tracking-widest pl-6">Trade Route</TableHead>
            <TableHead className="text-slate-500 font-bold uppercase text-[10px] tracking-widest text-right">Current Rate (USD)</TableHead>
            <TableHead className="text-slate-500 font-bold uppercase text-[10px] tracking-widest text-right">24h Change</TableHead>
            <TableHead className="text-slate-500 font-bold uppercase text-[10px] tracking-widest text-right pr-6">Market Status</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          <AnimatePresence>
            {routes.map((route) => {
              const isUp = route.changePercent > 0;
              const isDown = route.changePercent < 0;
              const isSelected = selectedRouteId === route.id;
              
              return (
                <TableRow 
                  key={route.id}
                  onClick={() => onSelectRoute(route.id)}
                  className={`cursor-pointer transition-colors border-slate-50 ${isSelected ? 'bg-indigo-50/50 hover:bg-indigo-50' : 'hover:bg-slate-50/50'}`}
                >
                  <TableCell className="py-4 pl-6">
                    <div className="flex flex-col">
                      <span className="font-extrabold text-slate-900 tracking-tight">{route.origin}</span>
                      <span className="text-[10px] text-slate-400 font-bold uppercase tracking-tighter">to {route.destination}</span>
                    </div>
                  </TableCell>
                  <TableCell className="text-right py-4">
                    <div className="flex flex-col items-end">
                      <motion.span
                        key={route.currentRate}
                        initial={{ color: isUp ? '#dc2626' : '#059669' }}
                        animate={{ color: '#0f172a' }}
                        transition={{ duration: 1 }}
                        className="font-black font-mono tracking-tight text-lg"
                      >
                        ${route.currentRate.toLocaleString()}
                      </motion.span>
                      <span className="text-[9px] text-slate-400 font-bold uppercase mt-[-4px]">per FEU</span>
                    </div>
                  </TableCell>
                  <TableCell className="text-right py-4">
                    <div className={`flex items-center justify-end font-mono font-bold text-sm ${isUp ? 'text-red-600' : isDown ? 'text-emerald-600' : 'text-slate-400'}`}>
                      {isUp ? <ArrowUpRight className="h-4 w-4 mr-1" /> : isDown ? <ArrowDownRight className="h-4 w-4 mr-1" /> : <Minus className="h-4 w-4 mr-1" />}
                      {Math.abs(route.changePercent).toFixed(2)}%
                    </div>
                  </TableCell>
                  <TableCell className="text-right py-4 pr-6">
                    <Badge variant={isUp ? "destructive" : isDown ? "success" : "secondary"} className={`font-bold border-0 ${isUp ? 'bg-red-50 text-red-700' : isDown ? 'bg-emerald-50 text-emerald-700' : 'bg-slate-100 text-slate-600'}`}>
                      {isUp ? 'SURGING' : isDown ? 'DROPPING' : 'STABLE'}
                    </Badge>
                  </TableCell>
                </TableRow>
              );
            })}
          </AnimatePresence>
        </TableBody>
      </Table>
    </div>
  );
}
