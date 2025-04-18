import { useNavigate, useRouter } from "@tanstack/react-router";
import { useLiveQuery } from "dexie-react-hooks";
import { Button } from "~/components/ui/button";
import { FileText, Trash2, Plus, Share2, Route } from "lucide-react";
import { db } from "~/lib/db";
import { createNote } from "~/lib/notes";
import { RichTextEditor } from "~/components/rich-text-editor";
import { encodeNote, createShareUrl } from "~/lib/sharing";
import { useState } from "react";
import { createRoute } from "@tanstack/react-router";
import { LayoutRoute } from "~/routes/layout";
import { SummarizeButton } from "~/components/summarize-button";

export const NoteRoute = createRoute({
  getParentRoute: () => LayoutRoute,
  path: "/note/$noteId",
  loader: async ({ params: { noteId } }) => {
    const note = await db.notes.get(Number(noteId));
    return { note };
  },
  component: Note,
});

function Note() {
  const navigate = useNavigate();
  const router = useRouter();
  const { noteId } = NoteRoute.useParams();
  const { note: initialNote } = NoteRoute.useLoaderData();

  const currentNote = useLiveQuery(
    async () => {
      if (!noteId) return null;
      return db.notes.get(Number(noteId));
    },
    [noteId],
    initialNote,
  );

  const handleNewNote = async () => {
    const id = await createNote();
    if (typeof id === "number") {
      navigate({ to: "/note/$noteId", params: { noteId: id.toString() } });
    }
  };

  // Save note changes
  const handleNoteChange = async (
    field: "title" | "content",
    value: string,
  ) => {
    if (!noteId) return;

    const updatedNote = {
      ...currentNote,
      [field]: value,
      updatedAt: new Date(),
    };

    await db.notes.update(Number(noteId), updatedNote);
  };

  // Delete note
  const handleDeleteNote = async () => {
    if (!noteId) return;

    if (window.confirm("Are you sure you want to delete this note?")) {
      await db.notes.delete(Number(noteId));
      navigate({ to: "/" });
    }
  };

  const handleShareNote = () => {
    if (!currentNote) return;

    const noteData = {
      title: currentNote.title,
      content: currentNote.content,
    };

    const encodedNote = encodeNote(noteData);
    const shareUrl = createShareUrl(encodedNote);

    navigator.clipboard.writeText(shareUrl).then(() => {
      alert("Share link copied to clipboard!");
    });
  };

  const handleSummarize = async (summary: string) => {
    if (!noteId || !currentNote) return;

    try {
      const summaryNoteId = await createNote({
        title: `${currentNote.title || "Untitled"} - Summary`,
        content: summary,
      });

      if (typeof summaryNoteId === "number") {
        navigate({
          to: "/note/$noteId",
          params: { noteId: summaryNoteId.toString() },
        });
      }
    } catch (error) {
      console.error("Failed to create summary note:", error);
    }
  };

  if (!currentNote) {
    return (
      <div className="flex flex-col items-center justify-center h-full text-center p-8">
        <FileText className="h-16 w-16 text-content-primary/50 mb-4" />
        <h2 className="text-2xl font-bold text-content-primary mb-2">
          Note Not Found
        </h2>
        <p className="text-content-primary/80 mb-4 max-w-sm">
          The note you're looking for doesn't exist or has been deleted
        </p>
        <div className="flex gap-2">
          <Button onClick={handleNewNote}>
            <Plus className="h-4 w-4 mr-2" />
            Create New Note
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-2xl py-20 px-5 mx-auto flex flex-col">
      <div className="flex items-center justify-between mb-4">
        <input
          type="text"
          placeholder="Add Title"
          value={currentNote.title}
          onChange={(e) => handleNoteChange("title", e.target.value)}
          className="text-4xl font-bold bg-transparent border-none outline-none placeholder:text-on-surface-primary text-content-primary"
        />
        <div className="flex gap-2">
          <SummarizeButton
            content={currentNote.content}
            onSummarize={handleSummarize}
          />
          <Button
            variant="ghost"
            size="icon"
            className="h-8 w-8 text-content-primary hover:text-primary"
            onClick={handleShareNote}
          >
            <Share2 className="h-4 w-4" />
          </Button>
          <Button
            variant="ghost"
            size="icon"
            className="h-8 w-8 text-content-primary hover:text-destructive"
            onClick={handleDeleteNote}
          >
            <Trash2 className="h-4 w-4" />
          </Button>
        </div>
      </div>
      <RichTextEditor
        key={currentNote.id}
        content={currentNote.content}
        onChange={(value) => handleNoteChange("content", value)}
        className="flex-1"
      />
    </div>
  );
}
