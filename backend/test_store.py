from ingest.loader import load_codebase
from ingest.chunker import chunk_code
from ingest.vector_store import create_collection,store_chunks
from ingest.embedder import embed_text

docs = load_codebase("test_repo")
chunks = chunk_code(docs)

all_vector = embed_text(chunks) 
sample_vector = embed_text(chunks[0]["content"])

create_collection(len(sample_vector))

store_chunks(chunks,embed_text) 

print("all_vector",all_vector)
print()
print("sample_vector",sample_vector)
print()
print("create_collection",create_collection)
print() 
print("store_chunks",store_chunks) 