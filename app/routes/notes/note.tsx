import { useNavigate, useParams } from "react-router";
import { useLiveQuery } from "dexie-react-hooks";
import { Button } from "~/components/ui/button";
import { FileText, ChevronLeft, Trash2, Plus } from "lucide-react";
import { db } from "~/lib/db";
import { createNote } from "~/lib/notes";

export async function clientLoader({ params }: { params: { noteId: string } }) {
  const note = await db.notes.get(Number(params.noteId));
  return { note };
}

export default function Note({
  loaderData: { note: initialNote },
}: {
  loaderData: Awaited<ReturnType<typeof clientLoader>>;
}) {
  const navigate = useNavigate();
  const { noteId } = useParams();

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
      navigate(`/note/${id}`);
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
      navigate("/");
    }
  };

  if (!currentNote) {
    return (
      <div className="flex flex-col items-center justify-center h-full text-center p-8">
        <FileText className="h-16 w-16 text-muted-foreground/50 mb-4" />
        <h2 className="text-2xl font-bold text-muted-foreground mb-2">
          Note Not Found
        </h2>
        <p className="text-muted-foreground/80 mb-4 max-w-sm">
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
    <div className="max-w-2xl mx-auto">
      <div className="flex items-center justify-between mb-4">
        <input
          type="text"
          placeholder="Add Title"
          value={currentNote.title}
          onChange={(e) => handleNoteChange("title", e.target.value)}
          className="text-4xl font-bold bg-transparent border-none outline-none placeholder:text-muted-foreground/50"
        />
        <Button
          variant="ghost"
          size="icon"
          className="h-8 w-8 text-muted-foreground hover:text-destructive"
          onClick={handleDeleteNote}
        >
          <Trash2 className="h-4 w-4" />
        </Button>
      </div>
      <textarea
        placeholder="Start your note"
        value={currentNote.content}
        onChange={(e) => handleNoteChange("content", e.target.value)}
        className="w-full h-[calc(100vh-16rem)] bg-transparent border-none outline-none resize-none placeholder:text-muted-foreground/50"
      />
    </div>
  );
}
