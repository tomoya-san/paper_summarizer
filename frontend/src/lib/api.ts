const API_BASE = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000";

export interface Paper {
  id: string;
  url: string;
  title: string;
  authors: string[];
  summary: string;
  created_at: string;
}

export async function submitPapers(urls: string[]): Promise<{ message: string }> {
  const res = await fetch(`${API_BASE}/papers/summarize`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ urls }),
  });
  if (!res.ok) throw new Error("Failed to submit papers");
  return res.json();
}

function parsePaper(raw: Record<string, unknown>): Paper {
  return {
    ...raw,
    authors: typeof raw.authors === "string"
      ? raw.authors.split(",").map((a: string) => a.trim())
      : raw.authors,
  } as Paper;
}

export async function listPapers(): Promise<Paper[]> {
  const res = await fetch(`${API_BASE}/papers`);
  if (!res.ok) throw new Error("Failed to fetch papers");
  const data = await res.json();
  return data.map(parsePaper);
}

export async function getPaper(id: string): Promise<Paper> {
  const res = await fetch(`${API_BASE}/papers/${id}`);
  if (!res.ok) throw new Error("Paper not found");
  const data = await res.json();
  return parsePaper(data);
}
