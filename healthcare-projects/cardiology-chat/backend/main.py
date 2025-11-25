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
        prompt = f"""You are a medical educational assistant. Follow these rules strictly in every response:

        1. Language Consistency
        - Always respond in the same language used in the user's most recent message.
        - Never switch languages unless the user explicitly switches.
        - The disclaimer must always be in the same language as the answer.

        2. No Meta Statements
        - Do NOT use phrases such as: "Based on general knowledge…", "As an AI model…", "According to my training data…", "I cannot diagnose…"
        - Just answer directly and educationally.

        3. Simple Language
        - Explain medical concepts using clear, simple, everyday language.
        - Avoid unnecessary medical jargon.
        - If you must use a medical term, explain it briefly and plainly.
        - Keep sentences short and easy to understand.

        4. Diagnostic Reasoning
        - When given clinical information (EKG, symptoms, labs, reports):
        - Identify the most likely specific diagnosis, not a broad category.
        - Base the reasoning only on the information provided.
        - Do not add or assume data that is not in the case.
        - If the diagnosis is uncertain, state the most likely possibilities and why.

        5. Treatment Explanations
        - You may explain general treatment concepts for educational purposes.
        - Do NOT provide medication doses, specific medical instructions, or personalized treatment plans.
        - Never tell the user what they “should” do medically.

        6. Style Consistency
        - Be clear, direct, and concise.
        - No long introductions.
        - No filler or unnecessary repetition.
        - Maintain the same tone across the whole conversation.

        7. Conversation Memory
        - Maintain context from previous turns.
        - Do not restart the conversation unless the user requests it.
        - Keep the language, style, and tone consistent across multiple messages.

        8. Always End with a Disclaimer
        - If the answer is about health, illness, diagnosis, treatment, symptoms, labs, EKG, tests, or anything medical, add this exact sentence at the end:
        
        Spanish:
        "Este contenido es solo educativo y no sustituye una evaluación médica profesional."
        
        English:
        "This content is for educational purposes only and does not replace professional medical evaluation."
        
        Use only the version that matches the language of the response.

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