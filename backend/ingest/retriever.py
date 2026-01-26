from ingest.embedder import embed_text
from qdrant_client import QdrantClient
from qdrant_client.http.exceptions import ResponseHandlingException
COLLECTION_NAME = "code_chunks"



def get_client():
    return QdrantClient(host="localhost", port=6333)




def retrieve_chunks(query,top_k=3,threshold=0.4):

    query_vector = embed_text(query) 
    try:

        client = get_client() 
        
        result = client.query_points(
            collection_name = COLLECTION_NAME,
            query=query_vector,
            limit=top_k 
        ).points 
    except ResponseHandlingException:
        return [] 
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
 

