import { Button } from "~/components/ui/button";
import { Card } from "~/components/ui/card";
import { ChevronLeft, Plus, FileText } from "lucide-react";
import { useLiveQuery } from "dexie-react-hooks";
import { db, type Note } from "~/lib/db";

interface EmptyStateProps {
  onNewNote: () => void;
}

function EmptyState({ onNewNote }: EmptyStateProps) {
  return (
    <div className="flex flex-col items-center justify-center h-full text-center p-8">
      <FileText className="h-16 w-16 text-muted-foreground/50 mb-4" />
      <h2 className="text-2xl font-bold text-muted-foreground mb-2">
        No Note Selected
      </h2>
      <p className="text-muted-foreground/80 mb-4 max-w-sm">
        Select a note from the sidebar or create a new one to get started
      </p>
      <Button onClick={onNewNote}>
        <Plus className="h-4 w-4 mr-2" />
        Create New Note
      </Button>
    </div>
  );
}

interface NotFoundStateProps {
  onBack: () => void;
}

function NotFoundState({ onBack }: NotFoundStateProps) {
  return (
    <div className="flex flex-col items-center justify-center h-full text-center p-8">
      <FileText className="h-16 w-16 text-muted-foreground/50 mb-4" />
      <h2 className="text-2xl font-bold text-muted-foreground mb-2">
        Note Not Found
      </h2>
      <p className="text-muted-foreground/80 mb-4 max-w-sm">
        The note you're looking for doesn't exist or has been deleted
      </p>
      <Button onClick={onBack}>
        <ChevronLeft className="h-4 w-4 mr-2" />
        Back to Notes
      </Button>
    </div>
  );
}

interface NoteAppProps {
  selectedNoteId: number | null;
  onNoteSelect: (noteId: number | null) => void;
}

export default function NoteApp({
  selectedNoteId,
  onNoteSelect,
}: NoteAppProps) {
  // Fetch all notes
  const notes = useLiveQuery(() =>
    db.notes.orderBy("createdAt").reverse().toArray(),
  );

  // Create a new note
  const handleNewNote = async () => {
    const today = new Date().toLocaleDateString("en-US", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    });

    const newNote: Note = {
      title: "",
      content: "",
      date: today,
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    const id = await db.notes.add(newNote);
    if (typeof id === "number") {
      onNoteSelect(id);
    }
  };

  // Get current note
  const currentNote = useLiveQuery(async () => {
    if (!selectedNoteId) return null;
    return db.notes.get(selectedNoteId);
  }, [selectedNoteId]);

  // Save note changes
  const handleNoteChange = async (
    field: "title" | "content",
    value: string,
  ) => {
    if (!selectedNoteId) return;

    const updatedNote = {
      ...currentNote,
      [field]: value,
      updatedAt: new Date(),
    };

    await db.notes.update(selectedNoteId, updatedNote);
  };

  return (
    <div className="min-h-screen bg-zinc-50 p-4 md:p-8">
      <div className="flex gap-4 md:gap-8 h-[calc(100vh-4rem)]">
        {/* Left Sidebar Card */}
        <Card className="w-80 flex flex-col bg-white overflow-hidden">
          <div className="flex items-center justify-between p-4 border-b">
            <div className="flex items-center gap-2">
              <Button
                variant="ghost"
                size="icon"
                className="h-8 w-8"
                onClick={() => onNoteSelect(null)}
              >
                <ChevronLeft className="h-4 w-4" />
              </Button>
              <span className="font-medium">Notes</span>
            </div>
            <Button
              variant="ghost"
              size="icon"
              className="h-8 w-8"
              onClick={handleNewNote}
            >
              <Plus className="h-4 w-4" />
            </Button>
          </div>
          <div className="flex-1 overflow-auto">
            <div className="p-2">
              <Button
                variant="ghost"
                className="w-full justify-start text-muted-foreground hover:text-foreground px-4 py-2 h-auto"
                onClick={handleNewNote}
              >
                New note
              </Button>
              {notes?.map((note) => (
                <Button
                  key={note.id}
                  variant="ghost"
                  className={`w-full justify-start px-4 py-2 h-auto ${
                    selectedNoteId === note.id
                      ? "bg-muted text-foreground"
                      : "text-muted-foreground hover:text-foreground"
                  }`}
                  onClick={() => note.id && onNoteSelect(note.id)}
                >
                  <div className="w-full text-left">
                    <div className="font-medium truncate">
                      {note.title || "Untitled"}
                    </div>
                    <div className="text-xs text-muted-foreground">
                      {note.date}
                    </div>
                  </div>
                </Button>
              ))}
            </div>
          </div>
        </Card>

        {/* Main Content Card */}
        <Card className="flex-1 bg-white p-8">
          {!selectedNoteId ? (
            <EmptyState onNewNote={handleNewNote} />
          ) : !currentNote ? (
            <NotFoundState onBack={() => onNoteSelect(null)} />
          ) : (
            <div className="max-w-2xl mx-auto space-y-4">
              <input
                type="text"
                placeholder="Add Title"
                value={currentNote.title}
                onChange={(e) => handleNoteChange("title", e.target.value)}
                className="w-full text-4xl font-bold bg-transparent border-none outline-none placeholder:text-muted-foreground/50"
              />
              <textarea
                placeholder="Start your note"
                value={currentNote.content}
                onChange={(e) => handleNoteChange("content", e.target.value)}
                className="w-full h-[calc(100vh-16rem)] bg-transparent border-none outline-none resize-none placeholder:text-muted-foreground/50"
              />
            </div>
          )}
        </Card>
      </div>
    </div>
  );
}
