"use client";

import { useState, ReactNode } from "react";

interface Match {
  file_path: string;
  score: number;
  content: string;
}

interface Response {
  results: ReactNode;
  matches: Match[];
}

export default function Home() {
  const [question, setQuestion] = useState("");
  const [response, setResponse] = useState<Response | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const askQuestion = async () => {
    if (!question.trim()) return;

    setLoading(true);
    setError(null);
    setResponse(null);

    try {
      const res = await fetch("http://localhost:8000/query", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ question }),
      });

      if (!res.ok) {
        throw new Error("Backend error"); 
      }

      const data = await res.json();
      setResponse(data);
    } catch (error) {
      console.log(error) 
      setError("Failed to connect to backend");
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="min-h-screen p-10 bg-gray-100">
      <h1 className="text-2xl font-bold mb-4">
        Codebase RAG Search
      </h1>

      <textarea
        className="w-full p-3 border rounded mb-4"
        rows={4}
        placeholder="Ask a question about the codebase..."
        value={question}
        onChange={(e) => setQuestion(e.target.value)}
      />

      <button
        className="px-4 py-2 bg-black text-white rounded"
        disabled={loading}
        onClick={askQuestion}
      >
        {loading ? "Searching..." : "Ask"}
      </button>

      {response?.results && (
  <pre className="mt-6 p-4 bg-white border rounded overflow-x-auto">
    {response.results} 
  </pre> 
)}
    </main>
  );
} 
