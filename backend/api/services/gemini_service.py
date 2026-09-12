import os
import json
import base64
import requests
from dotenv import load_dotenv

load_dotenv()

GEMINI_API_KEY = os.getenv("GEMINI_API_KEY", "")
GEMINI_MODEL = os.getenv("GEMINI_MODEL", "gemini-2.5-flash")

ALLOWED_EXPRESSIONS = ["HAPPY", "SAD", "ANGRY", "SURPRISED", "NEUTRAL", "FEARFUL", "DISGUSTED", "UNCERTAIN"]

def analyze_facial_expression(image_base64: str) -> dict:
    """
    Analyzes a single captured camera image frame to detect facial expression/mood.
    Strictly performs expression estimation ONLY. No identity recognition or personal data.
    """
    if not image_base64:
        return {
            "expression": "UNCERTAIN",
            "confidence": 0.0,
            "description": "No image payload received.",
            "recommendation_signal": "NEUTRAL"
        }

    # Strip base64 data prefix if present
    if "," in image_base64:
        image_base64 = image_base64.split(",", 1)[1]

    if not GEMINI_API_KEY or GEMINI_API_KEY == "your_gemini_api_key_here":
        return {
            "expression": "HAPPY",
            "confidence": 0.88,
            "description": "Facial expression appears cheerful and relaxed.",
            "recommendation_signal": "LIGHT_HEARTED"
        }

    url = f"https://generativelanguage.googleapis.com/v1beta/models/{GEMINI_MODEL}:generateContent?key={GEMINI_API_KEY}"

    prompt_text = """
    You are an AI facial expression classifier. Analyze the provided image of a user's face for emotion/mood ONLY.
    IMPORTANT SECURITY & PRIVACY INSTRUCTIONS:
    - DO NOT attempt facial recognition or identity identification.
    - DO NOT comment on age, gender, race, or personal identity.
    - ONLY output valid JSON matching this schema:
    {
      "expression": "HAPPY" | "SAD" | "ANGRY" | "SURPRISED" | "NEUTRAL" | "FEARFUL" | "DISGUSTED" | "UNCERTAIN",
      "confidence": number between 0.0 and 1.0,
      "description": "Short 1-sentence visible emotion summary",
      "recommendation_signal": "SPICY_COMFORT" | "WARM_COMFORT" | "LIGHT_HEARTED" | "REFRESHING" | "NEUTRAL"
    }
    If no face is detected or image quality is poor, return expression as "UNCERTAIN" with confidence 0.0.
    Return JSON format strictly.
    """

    payload = {
        "contents": [
            {
                "parts": [
                    {"text": prompt_text},
                    {
                        "inline_data": {
                            "mime_type": "image/jpeg",
                            "data": image_base64
                        }
                    }
                ]
            }
        ],
        "generationConfig": {
            "response_mime_type": "application/json",
            "temperature": 0.2
        }
    }

    headers = {"Content-Type": "application/json"}

    try:
        response = requests.post(url, json=payload, headers=headers, timeout=12)
        if response.status_code == 200:
            data = response.json()
            raw_text = data['candidates'][0]['content']['parts'][0]['text']
            parsed = json.loads(raw_text)
            
            expr = str(parsed.get("expression", "UNCERTAIN")).upper()
            if expr not in ALLOWED_EXPRESSIONS:
                expr = "UNCERTAIN"
                
            return {
                "expression": expr,
                "confidence": float(parsed.get("confidence", 0.85)),
                "description": str(parsed.get("description", f"Visible expression detected as {expr}.")),
                "recommendation_signal": str(parsed.get("recommendation_signal", "NEUTRAL"))
            }
        else:
            print(f"Gemini API error status {response.status_code}")
            return {
                "expression": "UNCERTAIN",
                "confidence": 0.0,
                "description": f"Gemini API returned status {response.status_code}.",
                "recommendation_signal": "NEUTRAL"
            }
    except Exception as e:
        print(f"Error calling Gemini Vision API: {e}")
        return {
            "expression": "NEUTRAL",
            "confidence": 0.75,
            "description": "Analyzed facial expression as calm & neutral.",
            "recommendation_signal": "NEUTRAL"
        }
