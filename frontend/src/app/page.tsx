"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/components/AuthProvider";
import SubmitForm from "@/components/SubmitForm";
import PaperCard from "@/components/PaperCard";
import { listPapers, Paper } from "@/lib/api";
import { Button } from "@/components/ui/button";
import { useCallback } from "react";

export default function Home() {
  const { isAuthenticated, isLoading, signOut } = useAuth();
  const router = useRouter();
  const [papers, setPapers] = useState<Paper[]>([]);

  const refreshPapers = useCallback(() => {
    listPapers().then(setPapers).catch(console.error);
  }, []);

  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      router.push("/login");
    }
  }, [isLoading, isAuthenticated, router]);

  useEffect(() => {
    if (isAuthenticated) {
      refreshPapers();
    }
  }, [isAuthenticated, refreshPapers]);

  if (isLoading || !isAuthenticated) return null;

  return (
    <div className="flex flex-1 flex-col items-center bg-zinc-50 font-sans dark:bg-black">
      <main className="flex w-full max-w-3xl flex-col gap-8 px-6 py-16">
        <div className="flex items-start justify-between">
          <div>
            <h1 className="text-3xl font-semibold tracking-tight">
              Paper Summarizer
            </h1>
            <p className="mt-2 text-muted-foreground">
              Paste an arxiv URL to get an AI-generated summary.
            </p>
          </div>
          <Button variant="ghost" size="sm" onClick={signOut}>
            Sign out
          </Button>
        </div>

        <SubmitForm onSubmitted={refreshPapers} />

        <div className="flex flex-col gap-4">
          {papers.length === 0 ? (
            <p className="text-center text-muted-foreground">
              No papers yet. Submit an arxiv URL to get started.
            </p>
          ) : (
            papers.map((paper) => (
              <PaperCard key={paper.created_at} paper={paper} onRead={refreshPapers} />
            ))
          )}
        </div>
      </main>
    </div>
  );
}
