"""
/api/packages  — Pre-built curated travel package suggestions
"""

from flask import Blueprint, jsonify, request

packages_bp = Blueprint("packages", __name__)

PACKAGES = [
    {
        "id": 1, "name": "Bali Bliss", "destination": "Bali",
        "duration_days": 7, "hotel_type": "4-Star", "airline_class": "Economy",
        "season": "Off-Peak", "travel_type": "Couple", "num_travelers": 2,
        "activities_count": 4, "includes_meals": True, "travel_insurance": True,
        "price_usd": 2850, "image_keyword": "bali-rice-terraces",
        "highlights": ["Tegallalang Rice Terraces", "Ubud Monkey Forest", "Seminyak Beach", "Cooking Class"],
        "rating": 4.7,
    },
    {
        "id": 2, "name": "Maldives Escape", "destination": "Maldives",
        "duration_days": 5, "hotel_type": "Resort", "airline_class": "Business",
        "season": "Peak", "travel_type": "Couple", "num_travelers": 2,
        "activities_count": 3, "includes_meals": True, "travel_insurance": True,
        "price_usd": 9800, "image_keyword": "maldives-overwater-bungalow",
        "highlights": ["Overwater Villa", "Private Snorkeling", "Sunset Cruise", "Spa Treatment"],
        "rating": 4.9,
    },
    {
        "id": 3, "name": "Paris Romance", "destination": "Paris",
        "duration_days": 6, "hotel_type": "4-Star", "airline_class": "Economy",
        "season": "Shoulder", "travel_type": "Couple", "num_travelers": 2,
        "activities_count": 5, "includes_meals": False, "travel_insurance": True,
        "price_usd": 4200, "image_keyword": "paris-eiffel-tower",
        "highlights": ["Eiffel Tower", "Louvre Museum", "Seine River Cruise", "Versailles Day Trip", "Montmartre Walk"],
        "rating": 4.6,
    },
    {
        "id": 4, "name": "Tokyo Explorer", "destination": "Tokyo",
        "duration_days": 10, "hotel_type": "3-Star", "airline_class": "Economy",
        "season": "Peak", "travel_type": "Solo", "num_travelers": 1,
        "activities_count": 7, "includes_meals": False, "travel_insurance": True,
        "price_usd": 3100, "image_keyword": "tokyo-shibuya-crossing",
        "highlights": ["Shibuya Crossing", "Tsukiji Fish Market", "Harajuku", "Mt. Fuji Day Trip", "Akihabara", "TeamLab Planets"],
        "rating": 4.8,
    },
    {
        "id": 5, "name": "Dubai Luxe", "destination": "Dubai",
        "duration_days": 5, "hotel_type": "5-Star", "airline_class": "Business",
        "season": "Off-Peak", "travel_type": "Couple", "num_travelers": 2,
        "activities_count": 4, "includes_meals": True, "travel_insurance": True,
        "price_usd": 7500, "image_keyword": "dubai-burj-khalifa",
        "highlights": ["Burj Khalifa", "Desert Safari", "Dubai Mall", "Gold Souk"],
        "rating": 4.7,
    },
    {
        "id": 6, "name": "Family Fun Bali", "destination": "Bali",
        "duration_days": 9, "hotel_type": "Resort", "airline_class": "Economy",
        "season": "Shoulder", "travel_type": "Family", "num_travelers": 4,
        "activities_count": 6, "includes_meals": True, "travel_insurance": True,
        "price_usd": 8400, "image_keyword": "bali-family-resort",
        "highlights": ["Water Park", "Elephant Safari", "Cooking Class", "Kuta Beach", "Tanah Lot Temple"],
        "rating": 4.5,
    },
]


@packages_bp.get("/packages")
def list_packages():
    destination = request.args.get("destination")
    travel_type = request.args.get("travel_type")
    max_price   = request.args.get("max_price", type=float)

    results = PACKAGES
    if destination:
        results = [p for p in results if p["destination"].lower() == destination.lower()]
    if travel_type:
        results = [p for p in results if p["travel_type"].lower() == travel_type.lower()]
    if max_price:
        results = [p for p in results if p["price_usd"] <= max_price]

    return jsonify({"packages": results, "total": len(results)})


@packages_bp.get("/packages/<int:pkg_id>")
def get_package(pkg_id):
    pkg = next((p for p in PACKAGES if p["id"] == pkg_id), None)
    if not pkg:
        return jsonify({"error": "Package not found"}), 404
    return jsonify(pkg)
