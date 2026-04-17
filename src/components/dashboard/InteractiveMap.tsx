"use client";

import React, { memo } from "react";
import { ComposableMap, Geographies, Geography, Marker, Line } from "react-simple-maps";
import { RouteData } from "@/hooks/useFreightData";

const geoUrl = "https://cdn.jsdelivr.net/npm/world-atlas@2/countries-110m.json";

interface InteractiveMapProps {
  routes: RouteData[];
  selectedRouteId: string;
  onSelectRoute: (id: string) => void;
}

const InteractiveMap = ({ routes, selectedRouteId, onSelectRoute }: InteractiveMapProps) => {
  return (
    <div className="w-full h-full min-h-[400px] bg-card/20 rounded-xl overflow-hidden relative border border-white/5 shadow-inner">
      <div className="absolute top-4 left-4 z-10 pointer-events-none">
        <h3 className="text-lg font-medium text-foreground/80 tracking-tight">Active Global Routes</h3>
        <p className="text-xs text-muted-foreground">Select a route or hub to view rates</p>
      </div>
      
      <ComposableMap 
        projectionConfig={{ scale: 140, center: [0, 20] }} 
        className="w-full h-full"
      >
        <Geographies geography={geoUrl}>
          {({ geographies }) =>
            geographies.map((geo) => (
              <Geography
                key={geo.rsmKey}
                geography={geo}
                fill="rgba(255,255,255,0.05)"
                stroke="rgba(255,255,255,0.1)"
                strokeWidth={0.5}
                style={{
                  default: { outline: "none" },
                  hover: { fill: "rgba(255,255,255,0.1)", outline: "none" },
                  pressed: { outline: "none" },
                }}
              />
            ))
          }
        </Geographies>

        {routes.map((route) => {
          const isSelected = selectedRouteId === route.id;
          const isUp = route.changePercent > 0;
          const lineColor = isSelected 
            ? (isUp ? "rgba(239, 68, 68, 0.8)" : "rgba(16, 185, 129, 0.8)")
            : "rgba(255, 255, 255, 0.2)";

          return (
            <React.Fragment key={`route-${route.id}`}>
              <Line
                from={route.originCoords}
                to={route.destCoords}
                stroke={lineColor}
                strokeWidth={isSelected ? 3 : 1}
                strokeLinecap="round"
                className={`transition-all duration-300 cursor-pointer ${isSelected ? 'drop-shadow-[0_0_8px_rgba(255,255,255,0.5)]' : ''}`}
                onClick={() => onSelectRoute(route.id)}
              />
              
              {/* Origin Marker */}
              <Marker coordinates={route.originCoords}>
                <circle r={isSelected ? 6 : 4} fill={lineColor} className="transition-all duration-300" />
                <text textAnchor="middle" y={-10} style={{ fill: "white", fontSize: "10px", fontWeight: isSelected ? "bold" : "normal", opacity: isSelected ? 1 : 0.5 }}>
                  {route.origin}
                </text>
              </Marker>
              
              {/* Destination Marker */}
              <Marker coordinates={route.destCoords}>
                <circle r={isSelected ? 6 : 4} fill={lineColor} className="transition-all duration-300" />
                <text textAnchor="middle" y={-10} style={{ fill: "white", fontSize: "10px", fontWeight: isSelected ? "bold" : "normal", opacity: isSelected ? 1 : 0.5 }}>
                  {route.destination}
                </text>
              </Marker>
            </React.Fragment>
          );
        })}
      </ComposableMap>
    </div>
  );
};

export default memo(InteractiveMap);
