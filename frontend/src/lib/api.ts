const API_BASE = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000";

export interface Paper {
  id: number;
  url: string;
  title: string;
  authors: string[];
  summary: string;
  created_at: string;
}

export async function summarizePaper(url: string): Promise<Paper> {
  const res = await fetch(`${API_BASE}/papers/summarize`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ url }),
  });
  if (!res.ok) throw new Error("Failed to summarize paper");
  return res.json();
}

export async function listPapers(): Promise<Paper[]> {
  const res = await fetch(`${API_BASE}/papers/`);
  if (!res.ok) throw new Error("Failed to fetch papers");
  return res.json();
}

export async function getPaper(id: number): Promise<Paper> {
  const res = await fetch(`${API_BASE}/papers/${id}`);
  if (!res.ok) throw new Error("Paper not found");
  return res.json();
}
