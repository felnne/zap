from flask import Flask, request, jsonify, url_for
from flask_cors import CORS
from openai import OpenAI


def process_completions(config: dict[str, str], model: str, messages: [dict]) -> dict:
    client = OpenAI(
        api_key=config["OPENAI_API_KEY"],
        organization=config["OPENAI_ORGANISATION_ID"],
        project=config["OPENAI_PROJECT_ID"],
    )

    result = client.chat.completions.create(model=model, messages=messages)

    return result.to_json()


def create_app() -> Flask:
    app = Flask(__name__)
    app.config.from_object("zap_openai.config")
    CORS(app)

    @app.route("/v1/meta/health")
    def health() -> dict:
        return {
            "status": "pass",
            "version": 1,
            "releaseId": app.config["VERSION"],
            "description": "Proxy for OpenAI calls used in the Zap ⚡️ experimental metadata editor.",
            "links": {
                "self": url_for(endpoint="health", _external=True),
                "about": "https://gitlab.data.bas.ac.uk/felnne/zap",
            },
        }

    @app.route("/v1/chat/completions", methods=["POST"])
    def chat_completions():
        model = request.json.get("model")
        messages = request.json.get("messages")

        # if messages is not a list of objects with 'role' and 'content' keys, return an 400 error
        if not isinstance(messages, list) or not all(
            isinstance(message, dict) and "role" in message and "content" in message
            for message in messages
        ):
            return jsonify({"error": "Invalid request body"}), 400

        return process_completions(config=app.config, model=model, messages=messages)

    return app
