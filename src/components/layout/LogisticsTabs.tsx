import React from "react";
import { Ship, Package } from "lucide-react";

interface LogisticsTabsProps {
  activeTab: "ocean" | "parcel";
  onTabChange: (tab: "ocean" | "parcel") => void;
}

export function LogisticsTabs({ activeTab, onTabChange }: LogisticsTabsProps) {
  return (
    <div className="flex items-center space-x-1 bg-slate-100 p-1 rounded-2xl w-fit shadow-inner">
      <button
        onClick={() => onTabChange("ocean")}
        className={`flex items-center space-x-2 px-6 py-2.5 rounded-xl transition-all duration-300 ${
          activeTab === "ocean"
            ? "bg-white text-indigo-600 shadow-md translate-y-[0px]"
            : "text-slate-500 hover:text-slate-700 hover:bg-white/50"
        }`}
      >
        <Ship className={`h-4 w-4 ${activeTab === "ocean" ? "text-indigo-600" : "text-slate-400"}`} />
        <span className="text-sm font-black tracking-tight uppercase">Ocean Container</span>
      </button>
      <button
        onClick={() => onTabChange("parcel")}
        className={`flex items-center space-x-2 px-6 py-2.5 rounded-xl transition-all duration-300 ${
          activeTab === "parcel"
            ? "bg-white text-indigo-600 shadow-md translate-y-[0px]"
            : "text-slate-500 hover:text-slate-700 hover:bg-white/50"
        }`}
      >
        <Package className={`h-4 w-4 ${activeTab === "parcel" ? "text-indigo-600" : "text-slate-400"}`} />
        <span className="text-sm font-black tracking-tight uppercase">Parcel Package</span>
      </button>
    </div>
  );
}
