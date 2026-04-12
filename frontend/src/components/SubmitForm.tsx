"use client";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { submitPapers } from "@/lib/api";
import { X } from "lucide-react";
import { useState, type KeyboardEvent } from "react";

function extractId(url: string) {
  const match = url.match(/arxiv\.org\/abs\/(.+)/);
  return match ? match[1] : url;
}

export default function SubmitForm({
  onSubmitted,
}: {
  onSubmitted?: () => void;
}) {
  const [input, setInput] = useState("");
  const [urls, setUrls] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [submitted, setSubmitted] = useState(false);

  function addUrl() {
    const trimmed = input.trim();
    if (trimmed && !urls.includes(trimmed)) {
      setUrls((prev) => [...prev, trimmed]);
      setInput("");
    }
  }

  function removeUrl(index: number) {
    setUrls((prev) => prev.filter((_, i) => i !== index));
  }

  function handleKeyDown(e: KeyboardEvent<HTMLInputElement>) {
    if (e.key === "Enter" || e.key === " ") {
      e.preventDefault();
      addUrl();
    }
    if (e.key === "Backspace" && input === "" && urls.length > 0) {
      removeUrl(urls.length - 1);
    }
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    const allUrls = input.trim() ? [...urls, input.trim()] : urls;
    if (allUrls.length === 0) return;

    setLoading(true);
    setError("");
    setSubmitted(false);

    try {
      await submitPapers(allUrls);
      setUrls([]);
      setInput("");
      setSubmitted(true);
      onSubmitted?.();
    } catch {
      setError("Failed to submit papers. Check the URLs and try again.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="flex flex-col gap-2">
      <form onSubmit={handleSubmit} className="flex items-center gap-3">
        <Input
          type="url"
          placeholder="Paste arxiv URLs and press Enter or Space to add"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={handleKeyDown}
        />
        <Button
          type="submit"
          disabled={loading || (urls.length === 0 && !input.trim())}
        >
          {loading
            ? "Submitting..."
            : `Summarize${urls.length > 1 ? ` (${urls.length})` : ""}`}
        </Button>
      </form>
      {urls.length > 0 && (
        <div className="flex flex-wrap gap-1.5">
          {urls.map((url, i) => (
            <Badge
              key={i}
              variant="secondary"
              className="bg-border! text-foreground hover:shadow-sm transition-shadow gap-0 p-0!"
            >
              <a
                href={url}
                target="_blank"
                rel="noopener noreferrer"
                className="py-0.5 pl-2"
              >
                {extractId(url)}
              </a>
              <button
                type="button"
                className="cursor-pointer py-0.5 pr-1.5 pl-1"
                onClick={() => removeUrl(i)}
                aria-label={`Remove ${url}`}
              >
                <X className="size-3" />
              </button>
            </Badge>
          ))}
        </div>
      )}
      {submitted && (
        <p className="text-sm text-muted-foreground">
          Papers queued for summarization. They will appear below shortly.
        </p>
      )}
      {error && <p className="text-sm text-destructive">{error}</p>}
    </div>
  );
}
