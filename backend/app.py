"""
Workation - Travel Package Price Prediction Platform
Flask API Entry Point
"""

from flask import Flask
from flask_cors import CORS
from dotenv import load_dotenv
import os

load_dotenv()

def create_app():
    app = Flask(__name__)
    CORS(app, resources={r"/api/*": {"origins": "*"}})

    # Register blueprints
    from routes.predict import predict_bp
    from routes.chat import chat_bp
    from routes.packages import packages_bp

    app.register_blueprint(predict_bp, url_prefix="/api")
    app.register_blueprint(chat_bp, url_prefix="/api")
    app.register_blueprint(packages_bp, url_prefix="/api")

    @app.get("/")
    def health():
        return {"status": "ok", "service": "Workation API", "version": "1.0.0"}

    return app


if __name__ == "__main__":
    app = create_app()
    app.run(debug=True, host="0.0.0.0", port=5000)
