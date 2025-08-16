import google.generativeai as genai

genai.configure(api_key="AIzaSyAv0NxBr04kOCEHsNi_wd8wtjm1klvXyJs")

try:
    # ✅ Use a valid model from your list
    model = genai.GenerativeModel("models/gemini-2.5-pro")
    
    response = model.generate_content("Tell me 3 career tips for AI students.")
    
    print("\n✅ API Key is working!")
    print("Gemini Response:", response.text)

except Exception as e:
    print("\n❌ API Key is NOT working.")
    print("Error:", e)


