Max_lines_per_chunk = 1

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
        
            chunks.append({
                "file_path":file_path,
                "chunk_index":i,
                "content":chunk_text
            })

        
    return chunks 







