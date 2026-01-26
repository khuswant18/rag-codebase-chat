from ingest.retriever import retrieve_chunks
from ingest.augmenter import augmented_response

query = "Where is password handled?"

retrieved = retrieve_chunks(query)
response = augmented_response(query,retrieved)

print(response) 