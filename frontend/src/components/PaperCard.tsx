"use client";

import { useState } from "react";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
} from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { markAsRead, Paper } from "@/lib/api";

export default function PaperCard({
  paper,
  onRead,
}: {
  paper: Paper;
  onRead?: () => void;
}) {
  const [open, setOpen] = useState(false);

  function handleOpen() {
    setOpen(true);
    if (!paper.is_read) {
      markAsRead(paper.created_at)
        .then(() => onRead?.())
        .catch(console.error);
    }
  }

  return (
    <>
      <Card
        className={`cursor-pointer transition-shadow hover:shadow-md ${!paper.is_read ? "border-l-4 border-l-blue-500" : ""}`}
        onClick={handleOpen}
      >
        <CardHeader>
          <CardTitle>{paper.title}</CardTitle>
          <CardDescription>{paper.authors.join(", ")}</CardDescription>
        </CardHeader>
        <CardContent>
          <p className="line-clamp-3 text-muted-foreground">{paper.summary}</p>
          <p className="mt-2 text-xs text-muted-foreground">
            {new Date(paper.created_at).toLocaleDateString()}
          </p>
        </CardContent>
      </Card>

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="max-w-3xl max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>{paper.title}</DialogTitle>
            <DialogDescription>{paper.authors.join(", ")}</DialogDescription>
          </DialogHeader>
          <div className="mt-4">
            <p className="whitespace-pre-wrap text-base leading-relaxed">
              {paper.summary}
            </p>
            <p className="mt-6 text-xs text-muted-foreground">
              {new Date(paper.created_at).toLocaleDateString()}
            </p>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}
