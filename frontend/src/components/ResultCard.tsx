import { PredictResult } from "@/utils/api";
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Cell } from "recharts";
import { CheckCircle, TrendingUp, Zap, Award } from "lucide-react";

interface Props { result: PredictResult; }

const fmt = (n: number) =>
  new Intl.NumberFormat("en-US", { style: "currency", currency: "USD", maximumFractionDigits: 0 }).format(n);

const pct = (n: number) => `${(n * 100).toFixed(1)}%`;

export default function ResultCard({ result }: Props) {
  const { linear_regression_price: lr, xgboost_price: xgb, ensemble_price: ens, model_metrics: mm } = result;

  const chartData = [
    { name: "Linear Reg.", value: lr, color: "#00B4D8" },
    { name: "XGBoost",     value: xgb, color: "#0077B6" },
    { name: "Ensemble",    value: ens, color: "#F4A261" },
  ];

  return (
    <div className="space-y-4 animate-fade-up">
      {/* Main price */}
      <div className="card bg-hero-gradient text-white">
        <div className="flex items-start justify-between">
          <div>
            <p className="text-ocean-light text-sm font-medium mb-1">Estimated Total Cost</p>
            <p className="font-display text-4xl font-bold">{fmt(ens)}</p>
            <p className="text-white/70 text-sm mt-1">Ensemble prediction (best estimate)</p>
          </div>
          <div className="w-12 h-12 bg-white/20 rounded-2xl flex items-center justify-center">
            <Award size={24} className="text-white" />
          </div>
        </div>

        {/* Per-person */}
        <div className="mt-4 pt-4 border-t border-white/20 flex gap-6">
          <div>
            <p className="text-white/60 text-xs">Per Person</p>
            <p className="text-white font-semibold">{fmt(ens / result.input_summary.num_travelers)}</p>
          </div>
          <div>
            <p className="text-white/60 text-xs">Per Day</p>
            <p className="text-white font-semibold">{fmt(ens / result.input_summary.duration_days)}</p>
          </div>
          <div>
            <p className="text-white/60 text-xs">Destination</p>
            <p className="text-white font-semibold">{result.input_summary.destination}</p>
          </div>
        </div>
      </div>

      {/* Model comparison */}
      <div className="card">
        <h3 className="font-display text-base font-semibold text-slate-700 mb-4 flex items-center gap-2">
          <TrendingUp size={16} className="text-ocean" /> Model Comparison
        </h3>
        <ResponsiveContainer width="100%" height={160}>
          <BarChart data={chartData} barSize={36}>
            <XAxis dataKey="name" tick={{ fontSize: 11, fill: "#64748b" }} axisLine={false} tickLine={false} />
            <YAxis hide />
            <Tooltip
              formatter={(v: number) => [fmt(v), "Price"]}
              contentStyle={{ borderRadius: 12, border: "none", boxShadow: "0 4px 20px rgba(0,0,0,0.1)" }}
            />
            <Bar dataKey="value" radius={[6, 6, 0, 0]}>
              {chartData.map((d, i) => <Cell key={i} fill={d.color} />)}
            </Bar>
          </BarChart>
        </ResponsiveContainer>

        <div className="grid grid-cols-3 gap-2 mt-2">
          {chartData.map(d => (
            <div key={d.name} className="text-center">
              <p className="text-xs text-slate-500">{d.name}</p>
              <p className="font-semibold text-sm" style={{ color: d.color }}>{fmt(d.value)}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Model metrics */}
      {mm?.xgboost && (
        <div className="card">
          <h3 className="font-display text-base font-semibold text-slate-700 mb-3 flex items-center gap-2">
            <Zap size={16} className="text-ocean" /> Model Accuracy
          </h3>
          <div className="grid grid-cols-2 gap-3">
            {[
              { label: "XGBoost Accuracy", value: `${mm.xgboost.accuracy.toFixed(1)}%`, good: true },
              { label: "XGBoost R²",       value: pct(mm.xgboost.r2) },
              { label: "Lin. Reg. Accuracy", value: `${mm.linear_regression?.accuracy?.toFixed(1) ?? "—"}%` },
              { label: "XGBoost MAE",      value: fmt(mm.xgboost.mae) },
            ].map(({ label, value, good }) => (
              <div key={label} className="bg-slate-50 rounded-xl p-3">
                <p className="text-xs text-slate-500">{label}</p>
                <p className={`font-bold text-sm ${good ? "text-green-600" : "text-ocean"}`}>{value}</p>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
