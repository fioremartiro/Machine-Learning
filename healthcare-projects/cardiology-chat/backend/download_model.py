from langchain_community.embeddings.fastembed import FastEmbedEmbeddings

print("Downloading FastEmbed Model...")
# Initializing the class triggers the download
embeddings = FastEmbedEmbeddings(model_name="BAAI/bge-small-en-v1.5")
print("Model Downloaded Successfully!")
