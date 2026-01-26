from qdrant_client import QdrantClient
from qdrant_client.models import VectorParams,Distance

client = QdrantClient(
    url="http://localhost:6333" 
)

COLLECTION_NAME = "code_chunks"

def create_collection(vector_size):
    collections = client.get_collections().collections
    names = [c.name for c in collections]

    if COLLECTION_NAME not in names:
        client.create_collection(
            collection_name=COLLECTION_NAME,
            vectors_config=VectorParams(
                size=vector_size,
                distance=Distance.COSINE
            )

        )

def store_chunks(chunks,embed_functions):
    points = []
    for idx,chunk in enumerate(chunks):
        vector = embed_functions(chunk["content"])

        points.append({
            "id":idx,
            "vector":vector,
            "payload":{
                "file_path":chunk["file_path"],
                "chunk_index":chunk["chunk_index"],
                "content":chunk["content"] 
            }
        })
    
    client.upsert(
        collection_name=COLLECTION_NAME, 
        points=points 
    )
