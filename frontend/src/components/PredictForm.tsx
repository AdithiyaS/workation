import { useState } from "react";
import { predictPrice, PredictInput, PredictResult } from "@/utils/api";
import { TrendingUp, DollarSign, Activity, Loader2, ChevronDown } from "lucide-react";
import ResultCard from "./ResultCard";

const DESTINATIONS = ["Maldives","Bali","Paris","New York","Tokyo","Dubai","Rome","Barcelona","Sydney","Cape Town","Santorini","Phuket"];
const HOTEL_TYPES  = ["Budget","3-Star","4-Star","5-Star","Resort"];
const TRAVEL_TYPES = ["Solo","Couple","Family","Group"];
const SEASONS      = ["Peak","Off-Peak","Shoulder"];
const AIRLINE      = ["Economy","Business","First Class"];

const DEFAULT: PredictInput = {
  destination: "Bali", hotel_type: "4-Star", travel_type: "Couple",
  season: "Off-Peak", airline_class: "Economy",
  duration_days: 7, num_travelers: 2, activities_count: 3,
  includes_meals: 1, travel_insurance: 1,
};

interface FieldProps { label: string; children: React.ReactNode; hint?: string; }
function Field({ label, children, hint }: FieldProps) {
  return (
    <div className="flex flex-col gap-1.5">
      <label className="text-xs font-semibold text-slate-500 uppercase tracking-wide">{label}</label>
      {children}
      {hint && <span className="text-xs text-slate-400">{hint}</span>}
    </div>
  );
}

function SelectField({ value, onChange, options }: { value: string; onChange: (v: string) => void; options: string[] }) {
  return (
    <div className="relative">
      <select value={value} onChange={e => onChange(e.target.value)} className="select-field pr-8">
        {options.map(o => <option key={o}>{o}</option>)}
      </select>
      <ChevronDown size={14} className="absolute right-3 top-3.5 text-slate-400 pointer-events-none" />
    </div>
  );
}

export default function PredictForm() {
  const [form, setForm]       = useState<PredictInput>(DEFAULT);
  const [result, setResult]   = useState<PredictResult | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError]     = useState<string | null>(null);

  const set = (key: keyof PredictInput) => (val: string | number) =>
    setForm(f => ({ ...f, [key]: val }));

  const handleSubmit = async () => {
    setLoading(true); setError(null); setResult(null);
    try {
      const res = await predictPrice(form);
      setResult(res);
    } catch (e: any) {
      setError(e?.response?.data?.error || "Failed to get prediction. Is the backend running?");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="grid lg:grid-cols-2 gap-8 items-start">
      {/* Form */}
      <div className="card space-y-5">
        <div className="flex items-center gap-2 mb-2">
          <div className="w-8 h-8 bg-ocean/10 rounded-lg flex items-center justify-center">
            <TrendingUp size={16} className="text-ocean" />
          </div>
          <h2 className="font-display text-xl font-semibold text-slate-800">Configure Your Trip</h2>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <Field label="Destination">
            <SelectField value={form.destination} onChange={set("destination")} options={DESTINATIONS} />
          </Field>
          <Field label="Season">
            <SelectField value={form.season} onChange={set("season")} options={SEASONS} />
          </Field>
          <Field label="Hotel Type">
            <SelectField value={form.hotel_type} onChange={set("hotel_type")} options={HOTEL_TYPES} />
          </Field>
          <Field label="Airline Class">
            <SelectField value={form.airline_class} onChange={set("airline_class")} options={AIRLINE} />
          </Field>
          <Field label="Travel Type">
            <SelectField value={form.travel_type} onChange={set("travel_type")} options={TRAVEL_TYPES} />
          </Field>
          <Field label="No. of Travelers">
            <input type="number" min={1} max={20} value={form.num_travelers}
              onChange={e => set("num_travelers")(+e.target.value)}
              className="input-field" />
          </Field>
          <Field label="Duration (days)">
            <input type="number" min={1} max={60} value={form.duration_days}
              onChange={e => set("duration_days")(+e.target.value)}
              className="input-field" />
          </Field>
          <Field label="Activities">
            <input type="number" min={0} max={15} value={form.activities_count}
              onChange={e => set("activities_count")(+e.target.value)}
              className="input-field" />
          </Field>
        </div>

        {/* Toggles */}
        <div className="flex gap-4">
          {([
            ["includes_meals", "Include Meals"],
            ["travel_insurance", "Travel Insurance"],
          ] as const).map(([key, label]) => (
            <label key={key} className="flex items-center gap-2 cursor-pointer group select-none">
              <div
                onClick={() => set(key)(form[key] ? 0 : 1)}
                className={`w-11 h-6 rounded-full transition-colors duration-200 relative ${form[key] ? "bg-ocean" : "bg-slate-200"}`}
              >
                <div className={`absolute top-0.5 w-5 h-5 bg-white rounded-full shadow transition-transform duration-200 ${form[key] ? "translate-x-5" : "translate-x-0.5"}`} />
              </div>
              <span className="text-sm text-slate-600 group-hover:text-ocean transition-colors">{label}</span>
            </label>
          ))}
        </div>

        <button onClick={handleSubmit} disabled={loading} className="btn-primary w-full flex items-center justify-center gap-2">
          {loading ? <><Loader2 size={16} className="animate-spin" />Predicting…</> : <><Activity size={16} />Predict Price</>}
        </button>

        {error && (
          <div className="bg-red-50 border border-red-200 text-red-700 rounded-xl px-4 py-3 text-sm">{error}</div>
        )}
      </div>

      {/* Result */}
      <div>
        {result ? <ResultCard result={result} /> : (
          <div className="card flex flex-col items-center justify-center py-16 text-center gap-3 border-dashed border-2 border-slate-200 bg-slate-50">
            <DollarSign size={40} className="text-slate-300" />
            <p className="font-display text-lg text-slate-400">Your prediction will appear here</p>
            <p className="text-sm text-slate-400">Fill in the trip details and click Predict</p>
          </div>
        )}
      </div>
    </div>
  );
}
