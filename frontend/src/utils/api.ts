import axios from "axios";

const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000",
  timeout: 15000,
  headers: { "Content-Type": "application/json" },
});

// ── Prediction ─────────────────────────────────────────────────────────────

export interface PredictInput {
  destination: string;
  hotel_type: string;
  travel_type: string;
  season: string;
  airline_class: string;
  duration_days: number;
  num_travelers: number;
  activities_count: number;
  includes_meals: number;  // 0 | 1
  travel_insurance: number; // 0 | 1
}

export interface PredictResult {
  linear_regression_price: number;
  xgboost_price: number;
  ensemble_price: number;
  model_metrics: {
    xgboost?: { accuracy: number; r2: number; mae: number };
    linear_regression?: { accuracy: number; r2: number; mae: number };
  };
  input_summary: PredictInput;
}

export async function predictPrice(input: PredictInput): Promise<PredictResult> {
  const { data } = await api.post<PredictResult>("/api/predict", input);
  return data;
}

export async function getOptions() {
  const { data } = await api.get("/api/predict/options");
  return data;
}

// ── Chat ───────────────────────────────────────────────────────────────────

export interface ChatMessage { role: "user" | "assistant"; content: string; }

export async function sendChat(messages: ChatMessage[]): Promise<string> {
  const { data } = await api.post<{ reply: string }>("/api/chat", { messages });
  return data.reply;
}

// ── Packages ───────────────────────────────────────────────────────────────

export interface TravelPackage {
  id: number; name: string; destination: string;
  duration_days: number; hotel_type: string; airline_class: string;
  season: string; travel_type: string; num_travelers: number;
  activities_count: number; includes_meals: boolean; travel_insurance: boolean;
  price_usd: number; highlights: string[]; rating: number;
}

export async function getPackages(filters?: {
  destination?: string; travel_type?: string; max_price?: number;
}): Promise<TravelPackage[]> {
  const { data } = await api.get<{ packages: TravelPackage[] }>("/api/packages", {
    params: filters,
  });
  return data.packages;
}
