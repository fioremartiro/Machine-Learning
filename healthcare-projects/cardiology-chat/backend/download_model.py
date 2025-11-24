import os
from langchain_community.embeddings import HuggingFaceEmbeddings

# Set cache directory to a folder inside the project
cache_dir = os.path.join(os.getcwd(), "model_cache")
os.makedirs(cache_dir, exist_ok=True)

print(f"Downloading Embedding Model to {cache_dir}...")
embeddings = HuggingFaceEmbeddings(
    model_name="all-MiniLM-L6-v2",
    cache_folder=cache_dir
)
print("Model Downloaded Successfully!")
