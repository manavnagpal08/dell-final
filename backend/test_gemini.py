import os
import google.generativeai as genai

api_key = os.environ.get("GEMINI_API_KEY", "your-api-key-here")
genai.configure(api_key=api_key)

try:
    model = genai.GenerativeModel("gemini-1.5-flash")
    response = model.generate_content("hello")
    print(response.text)
except Exception as e:
    import traceback
    traceback.print_exc()
