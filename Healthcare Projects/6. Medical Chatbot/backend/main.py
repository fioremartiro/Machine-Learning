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
        raise HTTPException(status_code=500, detail=str(e))

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