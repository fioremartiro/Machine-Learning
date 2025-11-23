import os
from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from dotenv import load_dotenv
import google.generativeai as genai
from langchain_community.embeddings import HuggingFaceEmbeddings
from pinecone import Pinecone

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

# Initialize Tools
# Pinecone
pc = Pinecone(api_key=os.getenv("PINECONE_API_KEY"))
index = pc.Index("medical-chatbot-local")

# Embeddings (Local)
embeddings = HuggingFaceEmbeddings(model_name="all-MiniLM-L6-v2")

# Gemini (Direct SDK)
genai.configure(api_key=os.getenv("GOOGLE_API_KEY"))
model = genai.GenerativeModel('gemini-2.0-flash')

class ChatRequest(BaseModel):
    question: str

@app.post("/chat")
async def chat(request: ChatRequest):
    # 1. Embed the user's question
    vector = embeddings.embed_query(request.question)
    
    # 2. Search Pinecone for similar info
    search_results = index.query(vector=vector, top_k=3, include_metadata=True)
    
    # 3. Combine info into a "Context"
    context = ""
    for match in search_results['matches']:
        context += match['metadata']['text'] + "\n\n"
    
    # 4. Ask Gemini
    prompt = f"""You are an expert Cardiologist AI Assistant. 
    
    First, check the following 'Medical Context' for the answer.
    If the answer is in the context, use it to provide a detailed response.
    
    If the answer is NOT in the context, you may use your general medical knowledge to answer the question, BUT you must start your answer with:
    "Based on general cardiology knowledge (not from your specific database)..."
    
    Always be professional, empathetic, and remind the user to consult a real doctor.
    
    Format your answer using clear Markdown:
    - **ALWAYS start with a clear Header (## Title)** summarizing the topic.
    - Use **Bold** for key terms and symptoms.
    - Use bullet points for lists.
    - Split long text into paragraphs.
    
    Medical Context:
    {context}
    
    Question: {request.question}
    """
    
    response = model.generate_content(prompt)
    
    return {"answer": response.text}

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)