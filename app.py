from flask import Flask, request, Response
from flask_cors import CORS
import google.generativeai as genai
import os
from dotenv import load_dotenv

# Load API key from .env file
load_dotenv()
genai.configure(api_key=os.getenv("GEMINI_API_KEY"))

app = Flask(__name__)
CORS(app)

model = genai.GenerativeModel("models/gemini-1.5-flash")

@app.route('/')
def index():
    return "Backend is running!"

@app.route('/chat', methods=['POST'])
def chat():
    try:
        data = request.get_json()
        prompt = data.get("prompt", "")

        system_prompt = (
            "You are a helpful assistant named SHIFRA. "
            "Reply in max 10 short sentences. No markdown, no bullet points, only plain text."
        )
        full_prompt = f"{system_prompt}\nUser: {prompt}"

        def generate():
            for chunk in model.generate_content(full_prompt, stream=True):
                if chunk.text:
                    # Send each chunk followed by a newline separator
                    yield chunk.text

        return Response(generate(), mimetype="text/plain")

    except Exception as e:
        print("Gemini Error:", e)
        return Response(f"Error: {str(e)}", status=500, mimetype="text/plain")


if __name__ == '__main__':
    app.run(debug=True)


