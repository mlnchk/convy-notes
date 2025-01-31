import { useNavigate } from "@tanstack/react-router";
import { Button } from "~/components/ui/button";
import { FileText, Plus } from "lucide-react";
import { createNote } from "~/lib/notes";

export default function NotesIndex() {
  const navigate = useNavigate();

  const handleNewNote = async () => {
    const id = await createNote();
    if (typeof id === "number") {
      navigate({ to: "/note/$noteId", params: { noteId: id.toString() } });
    }
  };

  return (
    <div className="flex flex-col items-center justify-center h-full text-center p-8">
      <FileText className="h-16 w-16 text-content-primary/50 mb-4" />
      <h2 className="text-2xl font-bold text-content-primary mb-2">
        No Note Selected
      </h2>
      <p className="text-content-primary/80 mb-4 max-w-sm">
        Select a note from the sidebar or create a new one to get started
      </p>
      <Button onClick={handleNewNote}>
        <Plus className="h-4 w-4 mr-2" />
        Create New Note
      </Button>
    </div>
  );
}
