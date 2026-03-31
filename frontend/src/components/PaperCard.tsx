import Link from "next/link";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
} from "@/components/ui/card";
import { Paper } from "@/lib/api";

export default function PaperCard({ paper }: { paper: Paper }) {
  return (
    <Link href={`/papers/${paper.id}`}>
      <Card className="transition-shadow hover:shadow-md">
        <CardHeader>
          <CardTitle>{paper.title}</CardTitle>
          <CardDescription>{paper.authors.join(", ")}</CardDescription>
        </CardHeader>
        <CardContent>
          <p className="line-clamp-3 text-muted-foreground">
            {paper.summary}
          </p>
          <p className="mt-2 text-xs text-muted-foreground">
            {new Date(paper.created_at).toLocaleDateString()}
          </p>
        </CardContent>
      </Card>
    </Link>
  );
}
