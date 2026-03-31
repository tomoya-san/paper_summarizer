"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { summarizePaper } from "@/lib/api";

export default function SubmitForm() {
  const [url, setUrl] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const router = useRouter();

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const paper = await summarizePaper(url);
      setUrl("");
      router.push(`/papers/${paper.id}`);
    } catch {
      setError("Failed to summarize paper. Check the URL and try again.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="flex gap-3">
      <Input
        type="url"
        placeholder="Paste an arxiv URL (e.g. https://arxiv.org/abs/2301.08745)"
        value={url}
        onChange={(e) => setUrl(e.target.value)}
        required
      />
      <Button type="submit" disabled={loading}>
        {loading ? "Summarizing..." : "Summarize"}
      </Button>
      {error && <p className="text-sm text-destructive">{error}</p>}
    </form>
  );
}
