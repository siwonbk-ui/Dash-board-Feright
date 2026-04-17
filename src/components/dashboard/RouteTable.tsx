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
    <div className="rounded-xl border border-white/10 bg-card/50 backdrop-blur-md overflow-hidden shadow-2xl">
      <Table>
        <TableHeader className="bg-muted/30">
          <TableRow className="border-white/10">
            <TableHead className="text-foreground/70">Route</TableHead>
            <TableHead className="text-foreground/70 text-right">Current Rate</TableHead>
            <TableHead className="text-foreground/70 text-right">24h Change</TableHead>
            <TableHead className="text-foreground/70 text-right">Status</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          <AnimatePresence>
            {routes.map((route) => {
              const isUp = route.changePercent > 0;
              const isDown = route.changePercent < 0;
              
              return (
                <TableRow 
                  key={route.id}
                  onClick={() => onSelectRoute(route.id)}
                  className={`cursor-pointer transition-colors border-white/5 ${selectedRouteId === route.id ? 'bg-primary/20 hover:bg-primary/30' : 'hover:bg-white/5'}`}
                >
                  <TableCell className="font-medium">
                    <div className="flex flex-col">
                      <span className="text-foreground">{route.origin}</span>
                      <span className="text-xs text-muted-foreground font-mono">to {route.destination}</span>
                    </div>
                  </TableCell>
                  <TableCell className="text-right">
                    <motion.span
                      key={route.currentRate}
                      initial={{ color: isUp ? '#ef4444' : '#10b981' }}
                      animate={{ color: 'var(--color-foreground)' }}
                      transition={{ duration: 1 }}
                      className="font-bold font-mono tracking-tight"
                    >
                      ${route.currentRate.toLocaleString()}
                    </motion.span>
                  </TableCell>
                  <TableCell className="text-right">
                    <div className={`flex items-center justify-end font-mono text-sm ${isUp ? 'text-red-400' : isDown ? 'text-emerald-400' : 'text-foreground/50'}`}>
                      {isUp ? <ArrowUpRight className="h-4 w-4 mr-1" /> : isDown ? <ArrowDownRight className="h-4 w-4 mr-1" /> : <Minus className="h-4 w-4 mr-1" />}
                      {Math.abs(route.changePercent).toFixed(2)}%
                    </div>
                  </TableCell>
                  <TableCell className="text-right">
                    <Badge variant={isUp ? "destructive" : isDown ? "success" : "secondary"} className="font-mono bg-opacity-20 border-0">
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
