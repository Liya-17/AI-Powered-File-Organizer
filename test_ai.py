import os, sys
from dotenv import load_dotenv
load_dotenv()

# Redirect all output to a file
f = open("test_output.log", "w")
sys.stdout = f
sys.stderr = f

api_key = os.getenv("GEMINI_API_KEY")
print(f"Key: {api_key[:10]}..., len={len(api_key)}")

import google.generativeai as genai
genai.configure(api_key=api_key)

for model_name in ["gemini-1.5-flash", "gemini-2.0-flash", "gemini-pro", "gemini-1.5-pro"]:
    try:
        print(f"\nTrying {model_name}...")
        model = genai.GenerativeModel(model_name)
        response = model.generate_content("Say hello in one word")
        print(f"  SUCCESS: {response.text}")
        print(f"  WORKING_MODEL={model_name}")
        break
    except Exception as e:
        print(f"  FAIL: {str(e)[:300]}")

f.close()
