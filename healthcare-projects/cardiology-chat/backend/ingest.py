import os
import time
from dotenv import load_dotenv
from langchain_community.document_loaders import TextLoader
from langchain_community.embeddings import HuggingFaceEmbeddings
from pinecone import Pinecone, ServerlessSpec

# 1. Load Keys
load_dotenv()
PINECONE_API_KEY = os.getenv("PINECONE_API_KEY")
GOOGLE_API_KEY = os.getenv("GOOGLE_API_KEY")

if not PINECONE_API_KEY or not GOOGLE_API_KEY:
    print("Error: Keys missing! Check .env")
    exit()

# 2. Setup Pinecone
pc = Pinecone(api_key=PINECONE_API_KEY)
index_name = "medical-chatbot-local"

# Check if index exists and delete it if dimensions are wrong (MiniLM is 384)
if index_name in pc.list_indexes().names():
    print(f"Checking index '{index_name}'...")
    index_info = pc.describe_index(index_name)
    if index_info.dimension != 768:
        print("Deleting old index (wrong dimension)...")
        pc.delete_index(index_name)
        time.sleep(5) # Wait for deletion

if index_name not in pc.list_indexes().names():
    print(f"Creating index '{index_name}'...")
    pc.create_index(
        name=index_name,
        dimension=768, # Gemini Embedding Size
        metric="cosine",
        spec=ServerlessSpec(cloud="aws", region="us-east-1")
    )
    # Wait for index to be ready
    while not pc.describe_index(index_name).status['ready']:
        time.sleep(1)

index = pc.Index(index_name)

# 3. Load Data
print("Loading data...")
loader = TextLoader("data/medical_data.txt")
docs = loader.load()
texts = [d.page_content for d in docs]

# Prepare IDs and metadata for all texts
ids = [str(i) for i in range(len(texts))]
metadatas = [{"text": text} for text in texts]

# 4. Embed & Upload
print("Embedding and Uploading data in batches...")
from langchain_google_genai import GoogleGenerativeAIEmbeddings
embeddings_model = GoogleGenerativeAIEmbeddings(model="models/embedding-001")

batch_size = 10  # Process 10 chunks at a time to respect rate limits
total_batches = len(texts) // batch_size + (1 if len(texts) % batch_size > 0 else 0)

for i in range(0, len(texts), batch_size):
    batch_texts = texts[i:i + batch_size]
    batch_metadatas = metadatas[i:i + batch_size]
    batch_ids = ids[i:i + batch_size]
    
    print(f"Processing batch {i // batch_size + 1}/{total_batches}...")
    
    try:
        # Embed batch
        vectors = embeddings_model.embed_documents(batch_texts)
        
        # Zip together for Pinecone
        to_upsert = list(zip(batch_ids, vectors, batch_metadatas))
        
        # Upload batch
        index.upsert(vectors=to_upsert)
        
        # Sleep to respect rate limits (Free tier is ~15-60 requests/min)
        time.sleep(2) 
        
    except Exception as e:
        print(f"Error processing batch {i // batch_size + 1}: {e}")
        # Wait longer if we hit an error (likely rate limit)
        time.sleep(10)

print("Ingestion complete!")