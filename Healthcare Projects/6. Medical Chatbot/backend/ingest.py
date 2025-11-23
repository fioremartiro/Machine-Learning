import os
import time
from dotenv import load_dotenv
from langchain_community.document_loaders import TextLoader
from langchain_google_genai import GoogleGenerativeAIEmbeddings
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

# Check if index exists and delete it if dimensions are wrong (MiniLM was 384, Gemini is 768)
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

# 4. Embed & Upload
print("Embedding data...")
embeddings_model = GoogleGenerativeAIEmbeddings(model="models/embedding-001")
vectors = embeddings_model.embed_documents(texts)

print("Uploading to Pinecone...")
# Prepare data for upload (id, values, metadata)
to_upsert = []
for i, (text, vector) in enumerate(zip(texts, vectors)):
    to_upsert.append((str(i), vector, {"text": text}))

index.upsert(vectors=to_upsert)

print("Success! Data uploaded directly to Pinecone.")