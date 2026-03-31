export const dynamic = "force-dynamic";

import SubmitForm from "@/components/SubmitForm";
import PaperCard from "@/components/PaperCard";
import { listPapers } from "@/lib/api";

export default async function Home() {
  let papers: Awaited<ReturnType<typeof listPapers>> = [];
  try {
    papers = await listPapers();
  } catch (e) {
    console.error("Failed to fetch papers:", e);
  }

  return (
    <div className="flex flex-1 flex-col items-center bg-zinc-50 font-sans dark:bg-black">
      <main className="flex w-full max-w-3xl flex-col gap-8 px-6 py-16">
        <div>
          <h1 className="text-3xl font-semibold tracking-tight">
            Paper Summarizer
          </h1>
          <p className="mt-2 text-muted-foreground">
            Paste an arxiv URL to get an AI-generated summary.
          </p>
        </div>

        <SubmitForm />

        <div className="flex flex-col gap-4">
          {papers.length === 0 ? (
            <p className="text-center text-muted-foreground">
              No papers yet. Submit an arxiv URL to get started.
            </p>
          ) : (
            papers.map((paper) => (
              <PaperCard key={paper.id} paper={paper} />
            ))
          )}
        </div>
      </main>
    </div>
  );
}
