def augmented_response(query,retreived_chunks):
    if not retreived_chunks:
        return "No relevant code found in this repository."

    output = []
    output.append(f"User Query:\n{query}\n")
    output.append("Relevant Code Context:\n")

    for i,chunk in enumerate(retreived_chunks,1):
        output.append(f"{i}. File:{chunk["file_path"]}")
        output.append(f". Similarity:{chunk['score']:.2f}")
        output.append("   Code:")
        output.append(chunk["content"])
        output.append("-"*40)
    
    return "\n".join(output)  