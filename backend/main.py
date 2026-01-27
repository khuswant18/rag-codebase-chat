from fastapi import FastAPI
from pydantic import BaseModel

from ingest.retriever import retrieve_chunks
from ingest.augmenter import augmented_response

app = FastAPI(title="Codebase RAG API")

class QueryRequest(BaseModel):
    question:str 

@app.get("/hello")
def hello():
    return "hi"


@app.post('/query')
def query_codebase(request:QueryRequest):
    retrieved = retrieve_chunks(request.question)
    response = augmented_response(request.question,retrieved)

    print(response)
    
    return {
        "question":request.question,
        "results":response
    } 