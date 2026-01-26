from ingest.loader import load_codebase
from ingest.chunker import chunk_code

repo_path = "test_repo"

docs = load_codebase(repo_path)
chunks = chunk_code(docs)

for chunk in chunks:
    print(chunk)
# print("Total files read:", len(docs))
# print()
# print(docs)
# for doc in docs:
#     print("FILE:", doc["file_path"])
#     print("CONTENT:")
#     print(doc["content"]) 
#     print("-" * 40) 