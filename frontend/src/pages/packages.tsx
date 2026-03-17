import { useState, useEffect } from "react";
import { getPackages, TravelPackage } from "@/utils/api";
import PackageCard from "@/components/PackageCard";
import { Search, SlidersHorizontal } from "lucide-react";

const DESTINATIONS = ["All", "Maldives","Bali","Paris","New York","Tokyo","Dubai","Rome","Barcelona","Sydney","Cape Town","Santorini","Phuket"];
const TRAVEL_TYPES = ["All", "Solo","Couple","Family","Group"];

export default function PackagesPage() {
  const [packages, setPackages] = useState<TravelPackage[]>([]);
  const [loading, setLoading]   = useState(true);
  const [dest, setDest]         = useState("All");
  const [type, setType]         = useState("All");
  const [maxPrice, setMaxPrice] = useState("");

  const load = async () => {
    setLoading(true);
    try {
      const filters: any = {};
      if (dest !== "All") filters.destination = dest;
      if (type !== "All") filters.travel_type  = type;
      if (maxPrice)        filters.max_price   = +maxPrice;
      const pkgs = await getPackages(filters);
      setPackages(pkgs);
    } catch {
      console.error("Failed to load packages");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { load(); }, [dest, type, maxPrice]);

  return (
    <div className="max-w-6xl mx-auto px-4 py-12">
      <div className="mb-8">
        <h1 className="font-display text-4xl font-bold text-slate-800 mb-3">Travel Packages</h1>
        <p className="text-slate-500">Curated packages with transparent pricing. Filter by destination, travel style, or budget.</p>
      </div>

      {/* Filters */}
      <div className="card mb-8 flex flex-wrap gap-4 items-end">
        <div className="flex items-center gap-2 text-slate-500 mr-2">
          <SlidersHorizontal size={16} /> <span className="text-sm font-medium">Filters</span>
        </div>
        <div className="flex flex-col gap-1">
          <label className="text-xs text-slate-400 uppercase font-semibold tracking-wide">Destination</label>
          <select value={dest} onChange={e => setDest(e.target.value)} className="select-field text-sm py-2 pr-8">
            {DESTINATIONS.map(d => <option key={d}>{d}</option>)}
          </select>
        </div>
        <div className="flex flex-col gap-1">
          <label className="text-xs text-slate-400 uppercase font-semibold tracking-wide">Travel Type</label>
          <select value={type} onChange={e => setType(e.target.value)} className="select-field text-sm py-2 pr-8">
            {TRAVEL_TYPES.map(t => <option key={t}>{t}</option>)}
          </select>
        </div>
        <div className="flex flex-col gap-1">
          <label className="text-xs text-slate-400 uppercase font-semibold tracking-wide">Max Budget (USD)</label>
          <input type="number" placeholder="e.g. 5000" value={maxPrice}
            onChange={e => setMaxPrice(e.target.value)}
            className="input-field text-sm py-2 w-36" />
        </div>
        <div className="text-sm text-slate-400 ml-auto self-end">
          {loading ? "Loading…" : `${packages.length} packages`}
        </div>
      </div>

      {/* Grid */}
      {loading ? (
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[...Array(6)].map((_, i) => (
            <div key={i} className="card animate-pulse">
              <div className="h-6 bg-slate-100 rounded mb-3 w-3/4" />
              <div className="h-4 bg-slate-100 rounded mb-2 w-1/2" />
              <div className="h-4 bg-slate-100 rounded mb-4 w-full" />
              <div className="h-4 bg-slate-100 rounded w-2/3" />
            </div>
          ))}
        </div>
      ) : packages.length === 0 ? (
        <div className="text-center py-20 text-slate-400">
          <Search size={40} className="mx-auto mb-3 opacity-30" />
          <p>No packages match your filters.</p>
        </div>
      ) : (
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {packages.map(pkg => <PackageCard key={pkg.id} pkg={pkg} />)}
        </div>
      )}
    </div>
  );
}
