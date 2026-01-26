from ingest.embedder import embed_text
from qdrant_client import QdrantClient

COLLECTION_NAME = "code_chunks"

client = QdrantClient(url="https://localhost:6333")

def retrieve_chunks(query,top_k=3,threshold=0.4):

    query_vector = embed_text(query) 
    
    result = client.search(
        collection_name = COLLECTION_NAME,
        query_vector=query_vector,
        limit=top_k 
    ) 

    retrieved = []

    
    for res in result:
        if res.score < threshold:
            continue 
    
        retrieved.append({
            "file_path":res.payload["file_path"],
            "chunk_index":res.payload["chunk_index"],
            "content":res.payload["content"],
            "score":res.score 
        })

    
    return retrieved


