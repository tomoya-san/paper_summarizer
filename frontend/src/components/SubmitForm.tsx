"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { submitPapers } from "@/lib/api";

export default function SubmitForm() {
  const [url, setUrl] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [submitted, setSubmitted] = useState(false);
  const router = useRouter();

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError("");
    setSubmitted(false);

    try {
      await submitPapers([url]);
      setUrl("");
      setSubmitted(true);
      router.refresh();
    } catch {
      setError("Failed to submit paper. Check the URL and try again.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="flex flex-col gap-2">
      <form onSubmit={handleSubmit} className="flex gap-3">
        <Input
          type="url"
          placeholder="Paste an arxiv URL (e.g. https://arxiv.org/abs/2301.08745)"
          value={url}
          onChange={(e) => setUrl(e.target.value)}
          required
        />
        <Button type="submit" disabled={loading}>
          {loading ? "Submitting..." : "Summarize"}
        </Button>
      </form>
      {submitted && (
        <p className="text-sm text-muted-foreground">
          Paper queued for summarization. It will appear below shortly.
        </p>
      )}
      {error && <p className="text-sm text-destructive">{error}</p>}
    </div>
  );
}
