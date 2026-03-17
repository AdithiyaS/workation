"""
/api/chat  — OpenAI-powered travel cost estimation chatbot
"""

from flask import Blueprint, request, jsonify, Response, stream_with_context
from openai import OpenAI
import os

chat_bp = Blueprint("chat", __name__)

SYSTEM_PROMPT = """You are Workation AI — a friendly, expert travel cost advisor.
Your job is to help users estimate travel package costs and answer travel budget questions.

Key behaviors:
- Give concrete dollar estimates when asked (e.g., "A 7-day Bali trip for 2 on a 4-star budget typically costs $2,800–$3,500.")
- Break down costs into: flights, accommodation, activities, food, misc.
- Ask clarifying questions naturally (destination, duration, travelers, hotel preference, season).
- Mention when peak/off-peak season significantly affects price.
- Be concise, warm, and practical.
- When a user gives enough info, suggest they use the prediction form for a precise ML-based estimate.

Always respond in plain text (no markdown). Keep replies under 150 words unless the user asks for detail.
"""


def _client():
    api_key = os.getenv("OPENAI_API_KEY")
    if not api_key:
        return None
    return OpenAI(api_key=api_key)


@chat_bp.post("/chat")
def chat():
    body    = request.get_json(force=True)
    messages = body.get("messages", [])

    if not messages:
        return jsonify({"error": "messages array required"}), 400

    client = _client()
    if client is None:
        # Fallback mock response when no API key is set (for demo / GitHub showcase)
        last_user = next((m["content"] for m in reversed(messages) if m["role"] == "user"), "")
        mock = (
            f"Demo mode (no OPENAI_API_KEY set). You asked: \"{last_user[:80]}\". "
            "In production this would connect to OpenAI and give you a detailed travel cost breakdown. "
            "Use the prediction form above for ML-based estimates right now!"
        )
        return jsonify({"reply": mock})

    try:
        full_messages = [{"role": "system", "content": SYSTEM_PROMPT}] + messages
        response = client.chat.completions.create(
            model="gpt-4o-mini",
            messages=full_messages,
            max_tokens=300,
            temperature=0.7,
        )
        reply = response.choices[0].message.content
        return jsonify({"reply": reply})
    except Exception as e:
        return jsonify({"error": str(e)}), 500


@chat_bp.post("/chat/stream")
def chat_stream():
    """Server-sent event streaming endpoint."""
    body     = request.get_json(force=True)
    messages = body.get("messages", [])
    client   = _client()

    if client is None:
        def gen():
            yield "data: Demo mode — OPENAI_API_KEY not set.\n\n"
            yield "data: [DONE]\n\n"
        return Response(stream_with_context(gen()), content_type="text/event-stream")

    def generate():
        full_messages = [{"role": "system", "content": SYSTEM_PROMPT}] + messages
        stream = client.chat.completions.create(
            model="gpt-4o-mini",
            messages=full_messages,
            max_tokens=300,
            temperature=0.7,
            stream=True,
        )
        for chunk in stream:
            delta = chunk.choices[0].delta.content or ""
            if delta:
                yield f"data: {delta}\n\n"
        yield "data: [DONE]\n\n"

    return Response(stream_with_context(generate()), content_type="text/event-stream")
