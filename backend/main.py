from fastapi import FastAPI
from pydantic import BaseModel
from fastapi.middleware.cors import CORSMiddleware

from ingest.retriever import retrieve_chunks
from ingest.augmenter import augmented_response



app = FastAPI(title="Codebase RAG API")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

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