import os
import requests
from dotenv import load_dotenv

load_dotenv()
api_key = os.getenv("GOOGLE_API_KEY")

if not api_key:
    print("Error: GOOGLE_API_KEY not found in .env")
    exit()

url = f"https://generativelanguage.googleapis.com/v1beta/models?key={api_key}"

print("Checking available models via REST API...")
try:
    response = requests.get(url)
    if response.status_code != 200:
        print(f"Error: {response.status_code} - {response.text}")
    else:
        models = response.json().get('models', [])
        for m in models:
            if "generateContent" in m.get('supportedGenerationMethods', []):
                print(f"- {m['name']}")
except Exception as e:
    print(f"Error: {e}")
