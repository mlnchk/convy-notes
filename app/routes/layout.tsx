import { NavLink, Outlet, useNavigate } from "react-router";
import { useLiveQuery } from "dexie-react-hooks";
import { Button } from "~/components/ui/button";
import { Card } from "~/components/ui/card";
import { ChevronLeft, Plus, Search } from "lucide-react";
import { getNotes, createNote } from "~/lib/notes";
import { useState } from "react";
import * as NavigationMenu from "@radix-ui/react-navigation-menu";

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
  const [searchQuery, setSearchQuery] = useState("");

  const filteredNotes = notes?.filter((note) => {
    const query = searchQuery.toLowerCase();
    return (
      note.title.toLowerCase().includes(query) ||
      note.content.toLowerCase().includes(query)
    );
  });

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
        <Card className="w-80 flex flex-col bg-white overflow-y-auto">
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
          <div className="flex-1 overflow-auto p-2">
            {/* Search Input */}
            <div className="relative mb-2">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <input
                type="text"
                placeholder="Search notes..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-9 pr-4 py-2 text-sm bg-muted rounded-md outline-none focus:ring-2 focus:ring-ring"
              />
            </div>
            <NavigationMenu.Root
              orientation="vertical"
              className="flex flex-col gap-0.5"
            >
              <NavigationMenu.List>
                {filteredNotes?.map((note) => (
                  <NavigationMenu.Item key={note.id}>
                    <NavigationMenu.Link asChild>
                      <NavLink
                        to={`/note/${note.id}`}
                        className="block w-full justify-start px-4 py-2 h-auto text-muted-foreground hover:text-foreground aria-[current=page]:text-foreground aria-[current=page]:bg-muted transition-colors hover:bg-muted rounded-md"
                      >
                        <div className="w-full text-left">
                          <div className="font-medium truncate">
                            {note.title || "Untitled"}
                          </div>
                          <div className="text-xs text-muted-foreground">
                            {note.date}
                          </div>
                        </div>
                      </NavLink>
                    </NavigationMenu.Link>
                  </NavigationMenu.Item>
                ))}
              </NavigationMenu.List>
            </NavigationMenu.Root>
          </div>
        </Card>

        {/* Main Content Card */}
        <Card className="flex-1 bg-white p-8 overflow-y-auto">
          <Outlet />
        </Card>
      </div>
    </div>
  );
}
