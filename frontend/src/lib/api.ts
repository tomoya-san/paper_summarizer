import { getIdToken } from "@/lib/auth";

const API_BASE = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000";

export interface Paper {
  user_id: string;
  url: string;
  title: string;
  authors: string[];
  summary: string;
  created_at: string;
  is_read: boolean;
}

async function authFetch(
  url: string,
  options: RequestInit = {},
): Promise<Response> {
  const token = await getIdToken();
  const headers: Record<string, string> = {
    "Content-Type": "application/json",
    ...(options.headers as Record<string, string>),
  };
  if (token) {
    headers["Authorization"] = token;
  }
  return fetch(url, { ...options, headers });
}

export async function submitPapers(
  urls: string[],
): Promise<{ message: string }> {
  const res = await authFetch(`${API_BASE}/papers/summarize`, {
    method: "POST",
    body: JSON.stringify({ urls }),
  });
  if (!res.ok) throw new Error("Failed to submit papers");
  return res.json();
}

function parsePaper(raw: Record<string, unknown>): Paper {
  return {
    ...raw,
    authors:
      typeof raw.authors === "string"
        ? raw.authors.split(",").map((a: string) => a.trim())
        : raw.authors,
  } as Paper;
}

export async function listPapers(): Promise<Paper[]> {
  const res = await authFetch(`${API_BASE}/papers`);
  //DEBUG
  console.log(res);
  if (!res.ok) throw new Error("Failed to fetch papers");
  const data = await res.json();
  return data.map(parsePaper);
}

export async function markAsRead(createdAt: string): Promise<Paper> {
  const res = await authFetch(
    `${API_BASE}/papers/${encodeURIComponent(createdAt)}/read`,
    { method: "PATCH" },
  );
  if (!res.ok) throw new Error("Failed to mark paper as read");
  const data = await res.json();
  return parsePaper(data);
}

export async function getPaper(createdAt: string): Promise<Paper> {
  const res = await authFetch(
    `${API_BASE}/papers/${encodeURIComponent(createdAt)}`,
  );
  if (!res.ok) throw new Error("Paper not found");
  const data = await res.json();
  return parsePaper(data);
}
