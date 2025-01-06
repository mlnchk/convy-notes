import { Outlet, useNavigate } from "react-router";
import { useLiveQuery } from "dexie-react-hooks";
import { Button } from "~/components/ui/button";
import { Card } from "~/components/ui/card";
import { ChevronLeft, Plus } from "lucide-react";
import { getNotes, createNote } from "~/lib/notes";

export async function clientLoader() {
  const notes = await getNotes();
  return { notes };
}

export default function Layout({
  loaderData: { notes: initialNotes },
}: {
  loaderData: Awaited<ReturnType<typeof clientLoader>>;
}) {
  const navigate = useNavigate();
  const notes = useLiveQuery(getNotes, [], initialNotes);

  const handleNewNote = async () => {
    const id = await createNote();
    if (typeof id === "number") {
      navigate(`/note/${id}`);
    }
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
                onClick={() => navigate("/")}
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
                  className="w-full justify-start px-4 py-2 h-auto text-muted-foreground hover:text-foreground"
                  onClick={() => note.id && navigate(`/note/${note.id}`)}
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
          <Outlet />
        </Card>
      </div>
    </div>
  );
}
