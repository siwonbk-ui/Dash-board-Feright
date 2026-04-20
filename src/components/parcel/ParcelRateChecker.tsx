"use client";

import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Package, MapPin, Truck, Search, Loader2, AlertCircle } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

interface Rate {
  id: string;
  carrier: string;
  service: string;
  price: string;
  currency: string;
  estimated_days?: number;
  provider_image?: string;
}

const COUNTRIES = [
  { code: 'US', name: 'United States', zip: '90001' },
  { code: 'TH', name: 'Thailand', zip: '10100' },
  { code: 'CN', name: 'China', zip: '200000' },
  { code: 'JP', name: 'Japan', zip: '100-0001' },
  { code: 'GB', name: 'United Kingdom', zip: 'E1 6AN' },
  { code: 'DE', name: 'Germany', zip: '10115' },
];

export function ParcelRateChecker() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [rates, setRates] = useState<Rate[]>([]);
  const [hasSearched, setHasSearched] = useState(false);
  
  const [formData, setFormData] = useState({
    from_country: "US",
    from_zip: "94117",
    to_country: "US",
    to_zip: "90001",
    weight: "2",
    length: "5",
    width: "5",
    height: "5"
  });

  const handleCountryChange = (type: 'from' | 'to', countryCode: string) => {
    const country = COUNTRIES.find(c => c.code === countryCode);
    if (!country) return;

    if (type === 'from') {
      setFormData({ ...formData, from_country: countryCode, from_zip: country.zip });
    } else {
      setFormData({ ...formData, to_country: countryCode, to_zip: country.zip });
    }
  };

  const handleFetchRates = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setRates([]);
    setHasSearched(true);

    try {
      const response = await fetch("/api/shippo/rates", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      const data = await response.json();
      if (!response.ok) throw new Error(data.error || "Something went wrong");

      setRates(data.rates || []);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
      {/* Form Section */}
      <div className="lg:col-span-4 space-y-6">
        <Card className="border-slate-200 shadow-xl overflow-hidden">
          <CardHeader className="bg-slate-50/50 border-b border-slate-100">
            <CardTitle className="text-sm font-black text-slate-800 uppercase tracking-widest flex items-center">
              <Package className="h-4 w-4 mr-2 text-indigo-600" />
              Parcel Details
            </CardTitle>
          </CardHeader>
          <CardContent className="pt-6">
            <form onSubmit={handleFetchRates} className="space-y-6">
              {/* Origin Section */}
              <div className="space-y-3">
                <label className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">Origin (From)</label>
                <div className="grid grid-cols-2 gap-3">
                  <div className="space-y-1.5">
                    <label className="text-[9px] font-bold text-slate-500 uppercase">Country</label>
                    <select 
                      value={formData.from_country}
                      onChange={(e) => handleCountryChange('from', e.target.value)}
                      className="w-full h-10 rounded-xl border border-slate-200 bg-slate-50 px-2 text-xs font-bold text-slate-700 focus:ring-2 focus:ring-indigo-500 outline-none transition-all"
                    >
                      {COUNTRIES.map(c => <option key={c.code} value={c.code}>{c.name}</option>)}
                    </select>
                  </div>
                  <div className="space-y-1.5">
                    <label className="text-[9px] font-bold text-slate-500 uppercase">ZIP / Postal</label>
                    <Input 
                      value={formData.from_zip} 
                      onChange={(e) => setFormData({...formData, from_zip: e.target.value})}
                      className="bg-slate-50 border-slate-200 text-xs font-mono" 
                      placeholder="ZIP" 
                    />
                  </div>
                </div>
              </div>

              {/* Destination Section */}
              <div className="space-y-3">
                <label className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">Destination (To)</label>
                <div className="grid grid-cols-2 gap-3">
                  <div className="space-y-1.5">
                    <label className="text-[9px] font-bold text-slate-500 uppercase">Country</label>
                    <select 
                      value={formData.to_country}
                      onChange={(e) => handleCountryChange('to', e.target.value)}
                      className="w-full h-10 rounded-xl border border-slate-200 bg-slate-50 px-2 text-xs font-bold text-slate-700 focus:ring-2 focus:ring-indigo-500 outline-none transition-all"
                    >
                      {COUNTRIES.map(c => <option key={c.code} value={c.code}>{c.name}</option>)}
                    </select>
                  </div>
                  <div className="space-y-1.5">
                    <label className="text-[9px] font-bold text-slate-500 uppercase">ZIP / Postal</label>
                    <Input 
                      value={formData.to_zip} 
                      onChange={(e) => setFormData({...formData, to_zip: e.target.value})}
                      className="bg-slate-50 border-slate-200 text-xs font-mono" 
                      placeholder="ZIP" 
                    />
                  </div>
                </div>
              </div>

              <div className="space-y-2">
                <div className="flex justify-between items-center">
                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-wider">Weight (lbs)</label>
                  <span className="text-[9px] font-bold text-indigo-500">Max 70-150 lbs</span>
                </div>
                <div className="relative">
                  <Package className="absolute left-3 top-2.5 h-4 w-4 text-slate-300" />
                  <Input 
                    type="number"
                    value={formData.weight}
                    onChange={(e) => setFormData({...formData, weight: e.target.value})}
                    className="pl-9 bg-slate-50 border-slate-200" 
                    placeholder="2" 
                    min="0.1"
                    step="0.1"
                  />
                </div>
              </div>

              <div className="grid grid-cols-3 gap-2">
                <div className="space-y-1">
                  <label className="text-[9px] font-bold text-slate-400 uppercase">L (in)</label>
                  <Input value={formData.length} onChange={(e) => setFormData({...formData, length: e.target.value})} className="bg-slate-50 px-2 text-center" />
                </div>
                <div className="space-y-1">
                  <label className="text-[9px] font-bold text-slate-400 uppercase">W (in)</label>
                  <Input value={formData.width} onChange={(e) => setFormData({...formData, width: e.target.value})} className="bg-slate-50 px-2 text-center" />
                </div>
                <div className="space-y-1">
                  <label className="text-[9px] font-bold text-slate-400 uppercase">H (in)</label>
                  <Input value={formData.height} onChange={(e) => setFormData({...formData, height: e.target.value})} className="bg-slate-50 px-2 text-center" />
                </div>
              </div>

              <Button 
                type="submit" 
                disabled={loading}
                className="w-full bg-slate-900 hover:bg-black text-white font-black uppercase text-xs tracking-widest h-12 rounded-xl transition-all shadow-lg"
              >
                {loading ? <Loader2 className="h-4 w-4 animate-spin mr-2" /> : <Search className="h-4 w-4 mr-2" />}
                Check Live Rates
              </Button>
            </form>
          </CardContent>
        </Card>


        <div className="bg-indigo-50 border border-indigo-100 p-4 rounded-2xl flex items-start space-x-3">
          <AlertCircle className="h-5 w-5 text-indigo-500 mt-0.5" />
          <div className="text-[10px] text-indigo-700 leading-relaxed font-medium">
            <span className="font-black uppercase tracking-tight block mb-1">Test Mode Active</span>
            Currently using the Shippo Test Key. Rates shown are accurate reflections of carrier pricing but no real labels will be charged.
          </div>
        </div>
      </div>

      {/* Results Section */}
      <div className="lg:col-span-8 space-y-4">
        <div className="flex items-center justify-between mb-2 px-2">
          <h3 className="text-sm font-black text-slate-800 uppercase tracking-widest flex items-center">
            <Truck className="h-4 w-4 mr-2 text-indigo-600" />
            Carrier Options
            {rates.length > 0 && (
              <span className="ml-3 px-2 py-0.5 bg-emerald-500 text-white text-[9px] font-black rounded uppercase">
                {rates.length} Carriers Found
              </span>
            )}
          </h3>
          <div className="text-[10px] font-bold text-slate-400 uppercase">Sorted by Lowest Price</div>
        </div>

        <div className="space-y-3">
          <AnimatePresence mode="popLayout">
            {loading ? (
              <motion.div 
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="flex flex-col items-center justify-center py-20 bg-white/50 rounded-3xl border-2 border-dashed border-slate-200"
              >
                <Loader2 className="h-10 w-10 text-indigo-600 animate-spin mb-4" />
                <p className="text-sm font-bold text-slate-500 animate-pulse">Contacting shipping carriers...</p>
              </motion.div>
            ) : error ? (
              <motion.div 
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="p-6 bg-red-50 border border-red-100 rounded-3xl text-center"
              >
                <div className="text-red-600 font-black uppercase text-xs mb-2">Error Occurred</div>
                <p className="text-red-500 text-sm">{error}</p>
              </motion.div>
            ) : rates.length > 0 ? (
              rates.map((rate, index) => (
                <motion.div
                  key={rate.id}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.05 }}
                  className="group bg-white p-4 rounded-2xl border border-slate-100 shadow-sm hover:shadow-xl hover:border-indigo-100 transition-all flex items-center justify-between"
                >
                  <div className="flex items-center space-x-4">
                    <div className="w-12 h-12 rounded-xl bg-slate-50 flex items-center justify-center p-2 group-hover:bg-indigo-50 transition-colors">
                      {rate.provider_image ? (
                        <img src={rate.provider_image} alt={rate.carrier} className="max-h-full max-w-full" />
                      ) : (
                        <Truck className="h-6 w-6 text-slate-300" />
                      )}
                    </div>
                    <div>
                      <div className="text-xs font-black text-slate-500 uppercase tracking-tighter mb-0.5">{rate.carrier}</div>
                      <div className="text-sm font-bold text-slate-800">{rate.service}</div>
                      {rate.estimated_days && (
                        <div className="flex items-center mt-1">
                          <Badge variant="outline" className="text-[9px] font-bold py-0 h-4 bg-slate-50 border-slate-100 text-slate-500">
                             Est. {rate.estimated_days} Days Deliver
                          </Badge>
                        </div>
                      )}
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Total Rate</div>
                    <div className="text-2xl font-black text-indigo-600 tracking-tighter">
                      <span className="text-sm align-top mt-1 mr-0.5">$</span>
                      {rate.price}
                    </div>
                  </div>
                </motion.div>
              ))
            ) : hasSearched ? (
              <motion.div 
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="flex flex-col items-center justify-center py-20 bg-amber-50 rounded-3xl border border-amber-100"
              >
                <AlertCircle className="h-10 w-10 text-amber-500 mb-4" />
                <p className="text-sm font-bold text-amber-700">No rates found for this shipment</p>
                <p className="text-xs text-amber-600 mt-2">Try reducing the weight or checking the ZIP codes.</p>
              </motion.div>
            ) : (
              <div className="flex flex-col items-center justify-center py-20 bg-slate-50 rounded-3xl border border-slate-100">
                <Search className="h-10 w-10 text-slate-200 mb-4" />
                <p className="text-sm font-bold text-slate-400">Enter details to see real-time parcel rates</p>
              </div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </div>

  );
}
