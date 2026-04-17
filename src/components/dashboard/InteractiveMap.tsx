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
    <div className="w-full h-full min-h-[400px] bg-slate-50 rounded-xl overflow-hidden relative border border-slate-200 shadow-inner">
      <div className="absolute top-4 left-4 z-10 pointer-events-none">
        <h3 className="text-lg font-bold text-slate-800 tracking-tight">Global Trade Lanes</h3>
        <p className="text-xs text-slate-500 font-medium">Click a hub or route for analytics</p>
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
                fill="#e2e8f0"
                stroke="#cbd5e1"
                strokeWidth={0.5}
                style={{
                  default: { outline: "none" },
                  hover: { fill: "#cbd5e1", outline: "none" },
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
            ? (isUp ? "rgba(220, 38, 38, 0.9)" : "rgba(5, 150, 105, 0.9)")
            : "rgba(100, 116, 139, 0.3)";

          return (
            <React.Fragment key={`route-${route.id}`}>
              <Line
                from={route.originCoords}
                to={route.destCoords}
                stroke={lineColor}
                strokeWidth={isSelected ? 4 : 2}
                strokeLinecap="round"
                className={`transition-all duration-300 cursor-pointer ${isSelected ? 'drop-shadow-lg' : ''}`}
                onClick={() => onSelectRoute(route.id)}
              />
              
              {/* Origin Marker */}
              <Marker coordinates={route.originCoords}>
                <circle r={isSelected ? 6 : 4} fill={lineColor} className="transition-all duration-300" stroke="white" strokeWidth={2} />
                <text textAnchor="middle" y={-12} style={{ fill: "#1e293b", fontSize: "10px", fontWeight: isSelected ? "800" : "600", opacity: isSelected ? 1 : 0.6 }}>
                  {route.origin}
                </text>
              </Marker>
              
              {/* Destination Marker */}
              <Marker coordinates={route.destCoords}>
                <circle r={isSelected ? 6 : 4} fill={lineColor} className="transition-all duration-300" stroke="white" strokeWidth={2} />
                <text textAnchor="middle" y={-12} style={{ fill: "#1e293b", fontSize: "10px", fontWeight: isSelected ? "800" : "600", opacity: isSelected ? 1 : 0.6 }}>
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
