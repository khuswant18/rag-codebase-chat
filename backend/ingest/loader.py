import os

IGNORE_DIRS = {
    "node_modules", ".git", "dist", "build",
    "__pycache__", "venv", ".env"
}

ALLOWED_EXTENSIONS = {
    ".py", ".js", ".ts", ".jsx", ".tsx",
    ".java", ".go", ".cpp", ".h",
    ".md", ".json", ".yaml", ".yml"
}


def is_allowed(file:str) -> bool:
    _,extension = os.path.splitext(file)
    return extension.lower() in ALLOWED_EXTENSIONS


def load_codebase(file_path):
    documents = []

    for root,direc,files in os.walk(file_path):

        for file in files:
            if not is_allowed(file):
                continue
        
            full_path = os.path.join(root,file)

            try:
                with open(full_path,"r",encoding="utf-8",errors="ignore") as f:
                    text = f.read()
                documents.append({
                    "file_path":full_path,
                    "content":text 
                }) 

            except Exception as e: 
                print("Could not read file:",full_path) 
    
    return documents






