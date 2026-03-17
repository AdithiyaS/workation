"""
/api/predict  — Travel package price prediction endpoint
"""

from flask import Blueprint, request, jsonify
import pandas as pd
import joblib
import os

predict_bp = Blueprint("predict", __name__)

MODEL_DIR = os.path.join(os.path.dirname(__file__), "../models")


def _load(name):
    path = os.path.join(MODEL_DIR, name)
    if not os.path.exists(path):
        return None
    return joblib.load(path)


@predict_bp.post("/predict")
def predict():
    data = request.get_json(force=True)

    required = [
        "destination", "hotel_type", "travel_type", "season",
        "airline_class", "duration_days", "num_travelers",
        "activities_count", "includes_meals", "travel_insurance",
    ]
    missing = [f for f in required if f not in data]
    if missing:
        return jsonify({"error": f"Missing fields: {missing}"}), 400

    try:
        row = pd.DataFrame([{
            "destination":      data["destination"],
            "hotel_type":       data["hotel_type"],
            "travel_type":      data["travel_type"],
            "season":           data["season"],
            "airline_class":    data["airline_class"],
            "duration_days":    int(data["duration_days"]),
            "num_travelers":    int(data["num_travelers"]),
            "activities_count": int(data["activities_count"]),
            "includes_meals":   int(data["includes_meals"]),
            "travel_insurance": int(data["travel_insurance"]),
        }])
    except (ValueError, TypeError) as e:
        return jsonify({"error": f"Invalid input: {e}"}), 400

    lr_model  = _load("linear_regression.pkl")
    xgb_model = _load("xgboost.pkl")
    metadata  = _load("metadata.pkl")

    if lr_model is None or xgb_model is None:
        return jsonify({"error": "Models not trained yet. Run models/train.py first."}), 503

    lr_pred  = float(lr_model.predict(row)[0])
    xgb_pred = float(xgb_model.predict(row)[0])
    ensemble = round((lr_pred * 0.35 + xgb_pred * 0.65), 2)

    return jsonify({
        "linear_regression_price": round(lr_pred, 2),
        "xgboost_price":           round(xgb_pred, 2),
        "ensemble_price":          ensemble,
        "model_metrics":           metadata if metadata else {},
        "input_summary":           data,
    })


@predict_bp.get("/predict/options")
def predict_options():
    """Return valid dropdown options for the frontend form."""
    return jsonify({
        "destinations":    ["Maldives","Bali","Paris","New York","Tokyo","Dubai",
                            "Rome","Barcelona","Sydney","Cape Town","Santorini","Phuket"],
        "hotel_types":     ["Budget","3-Star","4-Star","5-Star","Resort"],
        "travel_types":    ["Solo","Couple","Family","Group"],
        "seasons":         ["Peak","Off-Peak","Shoulder"],
        "airline_classes": ["Economy","Business","First Class"],
    })
