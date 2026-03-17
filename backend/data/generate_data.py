"""
Generate synthetic travel package dataset for training/demo.
Run: python data/generate_data.py
"""

import pandas as pd
import numpy as np
import os

np.random.seed(42)
N = 2000

DESTINATIONS = ["Maldives", "Bali", "Paris", "New York", "Tokyo", "Dubai",
                "Rome", "Barcelona", "Sydney", "Cape Town", "Santorini", "Phuket"]
DEST_BASE = {
    "Maldives": 3200, "Bali": 1400, "Paris": 2100, "New York": 1800,
    "Tokyo": 2500, "Dubai": 2800, "Rome": 1700, "Barcelona": 1500,
    "Sydney": 2300, "Cape Town": 1600, "Santorini": 2000, "Phuket": 1200,
}

HOTEL_TYPES   = ["Budget", "3-Star", "4-Star", "5-Star", "Resort"]
HOTEL_MULT    = {"Budget": 0.6, "3-Star": 0.85, "4-Star": 1.1, "5-Star": 1.5, "Resort": 1.8}

TRAVEL_TYPES  = ["Solo", "Couple", "Family", "Group"]
SEASONS       = ["Peak", "Off-Peak", "Shoulder"]
SEASONS_MULT  = {"Peak": 1.3, "Off-Peak": 0.85, "Shoulder": 1.0}

AIRLINES      = ["Economy", "Business", "First Class"]
AIRLINE_MULT  = {"Economy": 1.0, "Business": 1.6, "First Class": 2.5}

destination   = np.random.choice(DESTINATIONS, N)
hotel_type    = np.random.choice(HOTEL_TYPES, N)
travel_type   = np.random.choice(TRAVEL_TYPES, N)
season        = np.random.choice(SEASONS, N, p=[0.35, 0.35, 0.30])
airline_class = np.random.choice(AIRLINES, N, p=[0.6, 0.3, 0.1])
duration_days = np.random.randint(3, 22, N)
num_travelers = np.where(
    travel_type == "Solo", 1,
    np.where(travel_type == "Couple", 2,
    np.where(travel_type == "Family", np.random.randint(3, 6, N),
             np.random.randint(5, 12, N)))
)
activities_count = np.random.randint(0, 8, N)
includes_meals   = np.random.choice([0, 1], N, p=[0.4, 0.6])
travel_insurance = np.random.choice([0, 1], N, p=[0.5, 0.5])

# Price formula
base_price = np.array([DEST_BASE[d] for d in destination])
price = (
    base_price
    * np.array([HOTEL_MULT[h]  for h in hotel_type])
    * np.array([SEASONS_MULT[s] for s in season])
    * np.array([AIRLINE_MULT[a] for a in airline_class])
    + duration_days * 120
    + activities_count * 75
    + includes_meals * 200
    + travel_insurance * 100
)
price = price * num_travelers
price = price * (1 + np.random.normal(0, 0.05, N))  # 5% noise
price = np.round(price, 2)

df = pd.DataFrame({
    "destination": destination,
    "hotel_type": hotel_type,
    "travel_type": travel_type,
    "season": season,
    "airline_class": airline_class,
    "duration_days": duration_days,
    "num_travelers": num_travelers,
    "activities_count": activities_count,
    "includes_meals": includes_meals,
    "travel_insurance": travel_insurance,
    "price_usd": price,
})

os.makedirs(os.path.dirname(__file__) + "/../data", exist_ok=True)
path = os.path.join(os.path.dirname(__file__), "travel_packages.csv")
df.to_csv(path, index=False)
print(f"Dataset saved → {path}  ({N} rows)")
