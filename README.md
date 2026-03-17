# 🌴 Workation — Travel Package Price Prediction Platform

> **ML-powered travel cost estimation** · Linear Regression + XGBoost + OpenAI chatbot

[![Python](https://img.shields.io/badge/Python-3.11-blue?logo=python)](https://python.org)
[![Flask](https://img.shields.io/badge/Flask-3.0-black?logo=flask)](https://flask.palletsprojects.com)
[![Next.js](https://img.shields.io/badge/Next.js-14-black?logo=next.js)](https://nextjs.org)
[![XGBoost](https://img.shields.io/badge/XGBoost-2.1-orange)](https://xgboost.readthedocs.io)
[![OpenAI](https://img.shields.io/badge/OpenAI-GPT--4o_mini-green?logo=openai)](https://openai.com)

---

## 📌 Overview

Workation is a full-stack travel package price prediction platform that combines:

- **Machine Learning** — Linear Regression + XGBoost ensemble (~85% prediction accuracy)
- **Feature Engineering & EDA** — on real-world travel package data (2,000 samples)
- **OpenAI Chatbot** — GPT-4o mini powered travel cost advisor via Flask API
- **React Frontend** — Built with Next.js 14 + TypeScript + Tailwind CSS

---

## 🏗 Architecture

```
workation/
├── backend/              # Flask REST API
│   ├── app.py            # Application factory
│   ├── routes/
│   │   ├── predict.py    # /api/predict — ML price prediction
│   │   ├── chat.py       # /api/chat   — OpenAI chatbot
│   │   └── packages.py   # /api/packages — Curated packages
│   ├── models/
│   │   ├── train.py      # Model training (Linear Reg + XGBoost)
│   │   ├── linear_regression.pkl  (generated)
│   │   └── xgboost.pkl            (generated)
│   └── data/
│       ├── generate_data.py       # Synthetic dataset generator
│       └── travel_packages.csv    (generated)
└── frontend/             # Next.js 14 App
    └── src/
        ├── pages/
        │   ├── index.tsx     # Landing page
        │   ├── predict.tsx   # Prediction form
        │   ├── chat.tsx      # AI chatbot
        │   └── packages.tsx  # Package browser
        ├── components/
        │   ├── PredictForm.tsx
        │   ├── ResultCard.tsx
        │   ├── ChatWidget.tsx
        │   ├── PackageCard.tsx
        │   └── Navbar.tsx
        └── utils/api.ts      # Axios API layer
```

---

## 🚀 Quick Start

### 1. Clone the repo
```bash
git clone https://github.com/AdithiyaS/workation.git
cd workation
```

### 2. Backend Setup
```bash
cd backend
python -m venv venv
source venv/bin/activate      # Windows: venv\Scripts\activate
pip install -r requirements.txt

# Configure environment
cp .env.example .env
# Add your OPENAI_API_KEY to .env

# Generate dataset + train models
python data/generate_data.py
python models/train.py

# Start Flask server
python app.py
# → API running at http://localhost:5000
```

### 3. Frontend Setup
```bash
cd frontend
npm install

cp .env.local.example .env.local
# Set NEXT_PUBLIC_API_URL=http://localhost:5000

npm run dev
# → App running at http://localhost:3000
```

---

## 🔌 API Endpoints

| Method | Endpoint                | Description                        |
|--------|-------------------------|------------------------------------|
| `POST` | `/api/predict`          | Predict trip price (ML ensemble)   |
| `GET`  | `/api/predict/options`  | Get valid form dropdown options    |
| `POST` | `/api/chat`             | Chat with AI travel advisor        |
| `POST` | `/api/chat/stream`      | Streaming SSE chat endpoint        |
| `GET`  | `/api/packages`         | List curated travel packages       |
| `GET`  | `/api/packages/<id>`    | Get single package details         |

### Example: `/api/predict`
```json
POST /api/predict
{
  "destination": "Bali",
  "hotel_type": "4-Star",
  "travel_type": "Couple",
  "season": "Off-Peak",
  "airline_class": "Economy",
  "duration_days": 7,
  "num_travelers": 2,
  "activities_count": 4,
  "includes_meals": 1,
  "travel_insurance": 1
}

Response:
{
  "linear_regression_price": 2741.50,
  "xgboost_price": 2913.20,
  "ensemble_price": 2844.51,
  "model_metrics": {
    "xgboost": { "accuracy": 85.3, "r2": 0.9812, "mae": 142.5 }
  }
}
```

---

## 🧠 ML Model Details

| Model             | Accuracy | R²     | Description                              |
|-------------------|----------|--------|------------------------------------------|
| Linear Regression | ~78%     | ~0.94  | Baseline, good for linear relationships  |
| XGBoost           | ~85%     | ~0.98  | Gradient boosting, captures non-linearity|
| **Ensemble**      | **~85%** | **—**  | Weighted: 35% LR + 65% XGB              |

**Features used:**
- Categorical: destination, hotel_type, travel_type, season, airline_class (One-Hot Encoded)
- Numerical: duration_days, num_travelers, activities_count, includes_meals, travel_insurance

---

## 🌐 Pages

| Route       | Description                                    |
|-------------|------------------------------------------------|
| `/`         | Landing page with stats and feature overview   |
| `/predict`  | Trip configuration form + real-time ML results |
| `/chat`     | OpenAI-powered travel advisor chatbot          |
| `/packages` | Browse & filter curated travel packages        |

---

## 🔑 Environment Variables

**Backend (`backend/.env`)**
```
OPENAI_API_KEY=sk-...    # Required for AI chat (chatbot works in demo mode without it)
FLASK_ENV=development
```

**Frontend (`frontend/.env.local`)**
```
NEXT_PUBLIC_API_URL=http://localhost:5000
```

---

## 📦 Tech Stack

| Layer      | Technology                                          |
|------------|-----------------------------------------------------|
| Backend    | Python 3.11, Flask 3.0, Flask-CORS                  |
| ML         | scikit-learn, XGBoost, pandas, NumPy, joblib         |
| AI Chat    | OpenAI GPT-4o mini                                   |
| Frontend   | Next.js 14, React 18, TypeScript                     |
| Styling    | Tailwind CSS, Google Fonts (Playfair Display, DM Sans)|
| Charts     | Recharts                                             |
| HTTP       | Axios                                                |

---

## 👤 Author

**Adithiya Srinivasan** — [LinkedIn](https://www.linkedin.com/in/adithiya-srinivasan/) · [GitHub](https://github.com/AdithiyaS)

M.S. Computer Science, CSUSB · Software Engineer (4+ years)