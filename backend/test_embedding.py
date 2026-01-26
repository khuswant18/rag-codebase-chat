from backend.ingest.embedder import embed_text
from ingest.loader import load_codebase
from ingest.chunker import chunk_code


docs = load_codebase("test_repo")
chunk = chunk_code(docs) 

for c in chunk:
    ch = embed_text(c["content"])
    print("File:", c["file_path"])
    print("Vector size:", len(ch))
    print("Sample values:", ch[:5])
    print("-" * 40) 