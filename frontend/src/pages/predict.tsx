import PredictForm from "@/components/PredictForm";

export default function PredictPage() {
  return (
    <div className="max-w-6xl mx-auto px-4 py-12">
      <div className="mb-10">
        <h1 className="font-display text-4xl font-bold text-slate-800 mb-3">Price Predictor</h1>
        <p className="text-slate-500 max-w-xl">
          Enter your trip details and our ML ensemble (Linear Regression + XGBoost) will estimate your total package cost.
          Trained on 2,000+ travel packages with feature engineering and EDA.
        </p>
      </div>
      <PredictForm />
    </div>
  );
}
