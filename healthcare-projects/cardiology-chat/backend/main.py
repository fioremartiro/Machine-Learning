import os
import io
import uuid
from fastapi import FastAPI, HTTPException, UploadFile, File
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from dotenv import load_dotenv
import google.generativeai as genai
from langchain_community.embeddings import HuggingFaceEmbeddings
from pinecone import Pinecone
from pypdf import PdfReader

# 1. Setup
load_dotenv()
app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.get("/")
@app.head("/")
def read_root():
    return {"message": "Cardiology AI Backend is Running!"}

# Initialize Tools
# Pinecone
pc = Pinecone(api_key=os.getenv("PINECONE_API_KEY"))
index = pc.Index("medical-chatbot-local")

# Gemini (Direct SDK)
genai.configure(api_key=os.getenv("GOOGLE_API_KEY"))
model = genai.GenerativeModel('gemini-2.0-flash')

# Embeddings (Gemini API - Lightweight)
# Embeddings (HuggingFace - Local/Server-Side)
# Embeddings (Gemini API - Multilingual & Serverless)
from langchain_google_genai import GoogleGenerativeAIEmbeddings
# No local model to download, uses the API
embeddings = GoogleGenerativeAIEmbeddings(
    model="models/text-embedding-004",
    google_api_key=os.getenv("GOOGLE_API_KEY")
)

class ChatRequest(BaseModel):
    question: str

@app.post("/upload")
async def upload_pdf(file: UploadFile = File(...)):
    try:
        # 1. Read PDF
        content = await file.read()
        pdf_reader = PdfReader(io.BytesIO(content))
        
        text_chunks = []
        for i, page in enumerate(pdf_reader.pages):
            text = page.extract_text()
            if text:
                text_chunks.append(text)
        
        if not text_chunks:
            return {"message": "No text found in PDF"}

        # 2. Embed Chunks
        vectors = embeddings.embed_documents(text_chunks)
        
        # 3. Upsert to Pinecone
        to_upsert = []
        for i, (text, vector) in enumerate(zip(text_chunks, vectors)):
            # Create unique ID: filename_page_uuid
            chunk_id = f"{file.filename}_p{i}_{str(uuid.uuid4())[:8]}"
            to_upsert.append((chunk_id, vector, {"text": text, "source": file.filename}))
        
        index.upsert(vectors=to_upsert)
        
        return {"message": f"Successfully processed {len(text_chunks)} pages from {file.filename}"}
        
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Upload Error: {str(e)}")

@app.post("/chat")
async def chat(request: ChatRequest):
    try:
        # 1. Embed the user's question
        vector = embeddings.embed_query(request.question)
        
        # 2. Search Pinecone for similar info
        search_results = index.query(vector=vector, top_k=3, include_metadata=True)
        
        # 3. Combine info into a "Context"
        context = ""
        for match in search_results['matches']:
            context += match['metadata']['text'] + "\n\n"
        
        # 4. Ask Gemini
        prompt = f"""You are an expert Cardiologist AI Assistant. Your goal is to provide simple, direct, and medically accurate answers.

        CRITICAL INSTRUCTIONS:
        1. **LANGUAGE:** You MUST respond in the SAME LANGUAGE as the user's question (e.g., if asked in Spanish, answer in Spanish).
        2. **DIAGNOSIS:** If clinical data (EKG, symptoms, etc.) points to a specific diagnosis (e.g., AFib with RVR), state it clearly. Do not use vague terms like "tachyarrhythmia" when specific evidence exists.
        3. **TONE:** Be simple, direct, and precise. Imagine explaining to a family member who wants the truth, not a lecture.
           - Avoid "health-website" style padding.
           - Do NOT define basic terms (like tachycardia) unless explicitly asked.
        4. **MANDATORY DISCLAIMER:** You MUST end EVERY response with exactly this disclaimer:
           "**Disclaimer:** This AI is for educational purposes only and does not replace professional medical advice. Always consult a licensed cardiologist for diagnosis and treatment."
        5. **CONTEXT:** Use the provided 'Medical Context' to answer. If the answer is not there, use general knowledge but state: "Based on general knowledge..."

        Medical Context:
        {context}

        Question: {request.question}
        """
        
        response = model.generate_content(prompt)
        
        return {"answer": response.text}
    except Exception as e:
        # Return the actual error message to help debugging
        return {"answer": f"**System Error:** {str(e)}"}

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)