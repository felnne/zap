from flask import Flask, request, jsonify
from flask_cors import CORS
from openai import OpenAI

app = Flask(__name__)
app.config.from_object("zap_openai.config")
CORS(app, resources='/*', allow_headers=['Content-Type'])


def process_completions(model: str, messages: [dict]) -> dict:
    client = OpenAI(
        api_key=app.config["OPENAI_API_KEY"],
        organization=app.config["OPENAI_ORGANISATION_ID"],
        project=app.config["OPENAI_PROJECT_ID"],
    )

    result = client.chat.completions.create(model=model, messages=messages)

    return result.to_json()


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

    return process_completions(model, messages)


if __name__ == "__main__":
    app.run()
