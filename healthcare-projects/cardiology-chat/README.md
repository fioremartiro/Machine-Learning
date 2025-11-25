# Cardiology AI Assistant 🫀

A specialized **Retrieval-Augmented Generation (RAG)** application designed to provide accurate, context-aware answers to cardiology-related questions. This project utilizes a **Hybrid RAG Architecture**, combining the reasoning power of **Google Gemini 2.0** with the privacy and speed of **Local HuggingFace Embeddings**.

![License](https://img.shields.io/badge/license-MIT-blue.svg)
![Python](https://img.shields.io/badge/python-3.11+-blue.svg)
![TypeScript](https://img.shields.io/badge/typescript-5.0+-blue.svg)
![Next.js](https://img.shields.io/badge/Next.js-15-black)
![FastAPI](https://img.shields.io/badge/FastAPI-0.109-teal)

## 🏗️ Architecture

The system is built on a decoupled client-server architecture:

1.  **Frontend (Client):** Built with **Next.js 15 (App Router)** and **Tailwind CSS**. It handles user interaction, real-time streaming of AI responses, and PDF file uploads.
2.  **Backend (Server):** A **FastAPI** service that orchestrates the RAG pipeline.
3.  **Vector Database:** **Pinecone** stores vector embeddings of medical knowledge (Heart Failure, CAD, Arrhythmias, etc.).
4.  **Embeddings Engine:** **HuggingFace (`all-MiniLM-L6-v2`)** running locally on the server. This eliminates API costs for embeddings and ensures data privacy during vectorization.
5.  **LLM (Reasoning):** **Google Gemini 2.0 Flash** generates the final natural language response based on the retrieved context.

## 🚀 Key Features

*   **Hybrid RAG Pipeline:** Uses local embeddings for retrieval and cloud LLM for generation.
*   **PDF Analysis:** Users can upload medical reports (PDF). The backend extracts text, creates embeddings on-the-fly, and upserts them to Pinecone for instant Q&A.
*   **Streaming Responses:** Real-time token streaming for a responsive chat experience.
*   **Medical Safety:** Strict system prompts ensure the AI acts as an educational tool, not a doctor, with mandatory disclaimers.
*   **Responsive UI:** Mobile-optimized "Hero" interface and persistent chat history.

## 🛠️ Tech Stack

### Frontend
*   **Framework:** Next.js 15
*   **Language:** TypeScript
*   **Styling:** Tailwind CSS
*   **Markdown Rendering:** `react-markdown`

### Backend
*   **Framework:** FastAPI
*   **Language:** Python 3.11+
*   **Orchestration:** LangChain
*   **Vector DB:** Pinecone
*   **Embeddings:** `sentence-transformers/all-MiniLM-L6-v2` (Local)
*   **LLM:** Google Gemini 2.0 Flash (`google-generativeai`)
*   **PDF Processing:** `pypdf`

## ⚙️ Local Setup

### Prerequisites
*   Node.js 18+
*   Python 3.10+
*   Pinecone API Key
*   Google Gemini API Key

### 1. Clone the Repository
```bash
git clone https://github.com/yourusername/Machine-Learning.git
cd "healthcare-projects/cardiology-chat"
```

### 2. Backend Setup
```bash
cd backend
python -m venv venv
source venv/bin/activate  # On Windows: venv\Scripts\activate
pip install -r requirements.txt

# Create .env file
echo "GOOGLE_API_KEY=your_key" > .env
echo "PINECONE_API_KEY=your_key" >> .env

# Run the server
python main.py
```
*Server runs on `http://localhost:8000`*

### 3. Frontend Setup
```bash
cd ../frontend
npm install

# Create .env.local
echo "NEXT_PUBLIC_API_URL=http://localhost:8000" > .env.local

# Run the client
npm run dev
```
*Client runs on `http://localhost:3000`*

## ☁️ Deployment

### Backend (Render)
1.  **New Web Service:** Connect your repo.
2.  **Root Directory:** `healthcare-projects/cardiology-chat/backend`
3.  **Build Command:** `pip install -r requirements.txt && python download_model.py`
    *   *Note: `download_model.py` pre-downloads the embedding model to prevent runtime timeouts.*
4.  **Start Command:** `uvicorn main:app --host 0.0.0.0 --port $PORT`
5.  **Environment Variables:** Set `GOOGLE_API_KEY` and `PINECONE_API_KEY`.

### Frontend (Vercel)
1.  **New Project:** Import your repo.
2.  **Root Directory:** `healthcare-projects/cardiology-chat/frontend`
3.  **Environment Variables:**
    *   `NEXT_PUBLIC_API_URL`: Your Render Backend URL (e.g., `https://your-app.onrender.com`).

## ⚠️ Disclaimer
This application is for **educational purposes only**. It is not a substitute for professional medical advice, diagnosis, or treatment. Always seek the advice of your physician or other qualified health provider with any questions you may have regarding a medical condition.
