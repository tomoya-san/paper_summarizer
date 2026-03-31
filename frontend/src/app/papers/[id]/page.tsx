import Link from "next/link";
import { getPaper } from "@/lib/api";
import { Button } from "@/components/ui/button";

export default async function PaperPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const paper = await getPaper(Number(id));

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
