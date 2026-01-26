Max_lines_per_chunk = 1

MAX_CHARS = 1000

def chunk_code(documents):
    chunks = [] 
    for doc in documents:
        lines = doc["content"].splitlines()
        file_path = doc["file_path"] 
        for i in range(0,len(lines),Max_lines_per_chunk):
            chunk = lines[i:i+Max_lines_per_chunk]
            chunk_text = "\n".join(chunk).strip()
            if not chunk_text:
                continue 
            
            if len(chunk_text)>MAX_CHARS:
                for j in range(0,len(chunk_text),MAX_CHARS):
                    sub_text = chunk_text[j:j+MAX_CHARS]

                    chunks.append({
                        "file_path":file_path,
                        "chunk_index":f"{i}_{j}",
                        "content":sub_text 
                    })

            else:
                chunks.append({
                    "file_path":file_path,
                    "chunk_index":i,
                    "content":chunk_text 
                })
 
        
    return chunks 







