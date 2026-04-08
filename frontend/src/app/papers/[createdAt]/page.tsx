"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { use } from "react";
import Link from "next/link";
import { useAuth } from "@/components/AuthProvider";
import { getPaper, Paper } from "@/lib/api";
import { Button } from "@/components/ui/button";

export default function PaperPage({
  params,
}: {
  params: Promise<{ createdAt: string }>;
}) {
  const { createdAt } = use(params);
  const { isAuthenticated, isLoading } = useAuth();
  const router = useRouter();
  const [paper, setPaper] = useState<Paper | null>(null);
  const [error, setError] = useState("");

  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      router.push("/login");
    }
  }, [isLoading, isAuthenticated, router]);

  useEffect(() => {
    if (isAuthenticated) {
      getPaper(decodeURIComponent(createdAt))
        .then(setPaper)
        .catch(() => setError("Paper not found"));
    }
  }, [isAuthenticated, createdAt]);

  if (isLoading || !isAuthenticated) return null;

  if (error) {
    return (
      <div className="flex flex-1 flex-col items-center justify-center bg-zinc-50 dark:bg-black">
        <p className="text-muted-foreground">{error}</p>
        <Link href="/">
          <Button variant="ghost" size="sm" className="mt-4">
            &larr; Back
          </Button>
        </Link>
      </div>
    );
  }

  if (!paper) return null;

  return (
    <div className="flex flex-1 flex-col items-center bg-zinc-50 font-sans dark:bg-black">
      <main className="flex w-full max-w-3xl flex-col gap-6 px-6 py-16">
        <Link href="/">
          <Button variant="ghost" size="sm">
            &larr; Back
          </Button>
        </Link>

        <div>
          <h1 className="text-2xl font-semibold tracking-tight">
            {paper.title}
          </h1>
          <p className="mt-1 text-sm text-muted-foreground">
            {paper.authors.join(", ")}
          </p>
          <p className="mt-1 text-xs text-muted-foreground">
            Summarized on{" "}
            {new Date(paper.created_at).toLocaleDateString()}
          </p>
        </div>

        <a
          href={paper.url}
          target="_blank"
          rel="noopener noreferrer"
          className="text-sm text-primary hover:underline"
        >
          View on arxiv
        </a>

        <div className="whitespace-pre-wrap text-sm leading-relaxed">
          {paper.summary}
        </div>
      </main>
    </div>
  );
}
