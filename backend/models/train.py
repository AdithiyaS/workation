"""
Train Linear Regression + XGBoost models for travel price prediction.
Run: python models/train.py
"""

import pandas as pd
import numpy as np
import joblib
import os
from sklearn.model_selection import train_test_split
from sklearn.linear_model import LinearRegression
from sklearn.preprocessing import OneHotEncoder
from sklearn.compose import ColumnTransformer
from sklearn.pipeline import Pipeline
from sklearn.metrics import mean_absolute_error, r2_score
from xgboost import XGBRegressor

DATA_PATH  = os.path.join(os.path.dirname(__file__), "../data/travel_packages.csv")
MODEL_DIR  = os.path.dirname(__file__)

CATEGORICAL = ["destination", "hotel_type", "travel_type", "season", "airline_class"]
NUMERICAL   = ["duration_days", "num_travelers", "activities_count",
               "includes_meals", "travel_insurance"]
TARGET      = "price_usd"


def load_data():
    df = pd.read_csv(DATA_PATH)
    X = df[CATEGORICAL + NUMERICAL]
    y = df[TARGET]
    return X, y


def build_preprocessor():
    return ColumnTransformer(transformers=[
        ("cat", OneHotEncoder(handle_unknown="ignore", sparse_output=False), CATEGORICAL),
        ("num", "passthrough", NUMERICAL),
    ])


def train_and_evaluate(name, estimator, X_train, X_test, y_train, y_test):
    preprocessor = build_preprocessor()
    pipeline = Pipeline([("preprocessor", preprocessor), ("model", estimator)])
    pipeline.fit(X_train, y_train)
    preds = pipeline.predict(X_test)
    mae  = mean_absolute_error(y_test, preds)
    r2   = r2_score(y_test, preds)
    acc  = max(0, 1 - mae / y_test.mean()) * 100
    print(f"  {name:25s} | MAE: ${mae:,.0f}  R²: {r2:.4f}  ~Accuracy: {acc:.1f}%")
    return pipeline, {"mae": mae, "r2": r2, "accuracy": acc}


def main():
    print("Loading dataset …")
    X, y = load_data()
    X_train, X_test, y_train, y_test = train_test_split(X, y, test_size=0.2, random_state=42)

    print(f"Train: {len(X_train)}  Test: {len(X_test)}")
    print("\nTraining models:")

    lr_model, lr_metrics = train_and_evaluate(
        "Linear Regression",
        LinearRegression(),
        X_train, X_test, y_train, y_test
    )

    xgb_model, xgb_metrics = train_and_evaluate(
        "XGBoost",
        XGBRegressor(n_estimators=300, learning_rate=0.05, max_depth=6,
                     subsample=0.8, colsample_bytree=0.8, random_state=42),
        X_train, X_test, y_train, y_test
    )

    joblib.dump(lr_model,  os.path.join(MODEL_DIR, "linear_regression.pkl"))
    joblib.dump(xgb_model, os.path.join(MODEL_DIR, "xgboost.pkl"))

    metadata = {
        "categorical_features": CATEGORICAL,
        "numerical_features": NUMERICAL,
        "target": TARGET,
        "linear_regression": lr_metrics,
        "xgboost": xgb_metrics,
    }
    joblib.dump(metadata, os.path.join(MODEL_DIR, "metadata.pkl"))
    print("\n✓ Models saved to models/")


if __name__ == "__main__":
    main()
