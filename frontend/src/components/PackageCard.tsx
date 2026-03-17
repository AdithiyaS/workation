import { TravelPackage } from "@/utils/api";
import { MapPin, Clock, Star, Users, Utensils, Shield, ChevronRight } from "lucide-react";
import clsx from "clsx";

interface Props { pkg: TravelPackage; onSelect?: (id: number) => void; }

const SEASON_COLORS: Record<string, string> = {
  Peak: "bg-coral/10 text-coral",
  "Off-Peak": "bg-green-50 text-green-600",
  Shoulder: "bg-sand/20 text-sand-dark",
};

const HOTEL_COLORS: Record<string, string> = {
  Budget: "bg-slate-100 text-slate-600",
  "3-Star": "bg-blue-50 text-blue-600",
  "4-Star": "bg-ocean/10 text-ocean",
  "5-Star": "bg-sand/20 text-sand-dark",
  Resort: "bg-purple-50 text-purple-600",
};

const fmt = (n: number) =>
  new Intl.NumberFormat("en-US", { style: "currency", currency: "USD", maximumFractionDigits: 0 }).format(n);

export default function PackageCard({ pkg, onSelect }: Props) {
  return (
    <div className="card hover:shadow-float transition-all duration-300 hover:-translate-y-1 cursor-pointer group"
         onClick={() => onSelect?.(pkg.id)}>
      {/* Header */}
      <div className="flex items-start justify-between mb-3">
        <div>
          <h3 className="font-display font-semibold text-lg text-slate-800 group-hover:text-ocean transition-colors">
            {pkg.name}
          </h3>
          <div className="flex items-center gap-1 text-slate-500 text-sm mt-0.5">
            <MapPin size={12} />
            <span>{pkg.destination}</span>
          </div>
        </div>
        <div className="text-right">
          <p className="font-display font-bold text-2xl text-ocean">{fmt(pkg.price_usd)}</p>
          <p className="text-xs text-slate-400">{fmt(pkg.price_usd / pkg.num_travelers)} / person</p>
        </div>
      </div>

      {/* Chips */}
      <div className="flex flex-wrap gap-1.5 mb-3">
        <span className={clsx("chip", SEASON_COLORS[pkg.season] || "bg-slate-100 text-slate-600")}>{pkg.season}</span>
        <span className={clsx("chip", HOTEL_COLORS[pkg.hotel_type] || "bg-slate-100 text-slate-600")}>{pkg.hotel_type}</span>
        <span className="chip bg-slate-100 text-slate-600">{pkg.airline_class}</span>
        <span className="chip bg-slate-100 text-slate-600">{pkg.travel_type}</span>
      </div>

      {/* Meta row */}
      <div className="flex items-center gap-4 text-slate-500 text-sm mb-3">
        <span className="flex items-center gap-1"><Clock size={13} />{pkg.duration_days} days</span>
        <span className="flex items-center gap-1"><Users size={13} />{pkg.num_travelers} travelers</span>
        <span className="flex items-center gap-1"><Star size={13} className="text-yellow-400 fill-yellow-400" />{pkg.rating}</span>
      </div>

      {/* Highlights */}
      <div className="flex flex-wrap gap-1 mb-3">
        {pkg.highlights.slice(0, 3).map(h => (
          <span key={h} className="text-xs bg-ocean/5 text-ocean px-2 py-0.5 rounded-full">{h}</span>
        ))}
        {pkg.highlights.length > 3 && (
          <span className="text-xs text-slate-400 px-2 py-0.5">+{pkg.highlights.length - 3} more</span>
        )}
      </div>

      {/* Inclusions */}
      <div className="flex items-center gap-3 pt-3 border-t border-slate-100">
        {pkg.includes_meals && (
          <span className="flex items-center gap-1 text-xs text-green-600"><Utensils size={11} />Meals</span>
        )}
        {pkg.travel_insurance && (
          <span className="flex items-center gap-1 text-xs text-green-600"><Shield size={11} />Insurance</span>
        )}
        <div className="ml-auto">
          <ChevronRight size={16} className="text-slate-300 group-hover:text-ocean group-hover:translate-x-0.5 transition-all" />
        </div>
      </div>
    </div>
  );
}
