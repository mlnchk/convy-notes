import { useNavigate } from "react-router";
import { Button } from "~/components/ui/button";
import { FileText, Plus } from "lucide-react";

export default function NotesIndex() {
  const navigate = useNavigate();

  return (
    <div className="flex flex-col items-center justify-center h-full text-center p-8">
      <FileText className="h-16 w-16 text-muted-foreground/50 mb-4" />
      <h2 className="text-2xl font-bold text-muted-foreground mb-2">
        No Note Selected
      </h2>
      <p className="text-muted-foreground/80 mb-4 max-w-sm">
        Select a note from the sidebar or create a new one to get started
      </p>
      <Button onClick={() => navigate("/note/new")}>
        <Plus className="h-4 w-4 mr-2" />
        Create New Note
      </Button>
    </div>
  );
}
