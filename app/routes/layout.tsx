import { NavLink, Outlet, useNavigate } from "react-router";
import { useLiveQuery } from "dexie-react-hooks";
import { Button } from "~/components/ui/button";
import { Card } from "~/components/ui/card";
import { ChevronLeft, Plus, Search } from "lucide-react";
import { getNotes, createNote } from "~/lib/notes";
import { useState, useMemo } from "react";
import * as NavigationMenu from "@radix-ui/react-navigation-menu";
import { isToday, isYesterday, format } from "date-fns";
import { pipe, groupBy, mapValues } from "remeda";

export async function clientLoader() {
  const notes = await getNotes();
  return { notes };
}

const getDateGroupKey = (date: Date): string => {
  console.log(date);
  if (isToday(date)) return "Today";
  if (isYesterday(date)) return "Yesterday";

  return format(date, "MMMM d, yyyy");
};

export default function Layout({
  loaderData: { notes: initialNotes },
}: {
  loaderData: Awaited<ReturnType<typeof clientLoader>>;
}) {
  const navigate = useNavigate();
  const notes = useLiveQuery(getNotes, [], initialNotes);
  const [searchQuery, setSearchQuery] = useState("");

  const filteredNotes = useMemo(() => {
    if (!notes) return [];

    return notes.filter((note) => {
      if (!note.id) return false;

      const query = searchQuery.toLowerCase();
      return (
        note.title.toLowerCase().includes(query) ||
        note.content.toLowerCase().includes(query)
      );
    });
  }, [notes, searchQuery]);

  const sortedNotes = useMemo(() => {
    if (!filteredNotes.length) return [];

    return filteredNotes.sort(
      (a, b) => b.createdAt.getTime() - a.createdAt.getTime(),
    );
  }, [filteredNotes]);

  const groupedNotes = useMemo(() => {
    if (!sortedNotes.length) return {};

    return groupBy(sortedNotes, (note) => getDateGroupKey(note.createdAt));
  }, [sortedNotes]);

  const handleNewNote = async () => {
    const id = await createNote();
    if (typeof id === "number") {
      navigate(`/note/${id}`);
    }
  };

  return (
    <div className="h-screen p-2.5">
      <div className="flex gap-2.5 h-full">
        {/* Left Sidebar Card */}
        <Card className="w-80 flex flex-col overflow-y-auto">
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
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-content-primary" />
              <input
                type="text"
                placeholder="Search notes..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-9 pr-4 py-2 text-sm bg-on-surface-secondary rounded-md outline-none focus:ring-2 focus:ring-ring"
              />
            </div>
            <NavigationMenu.Root
              orientation="vertical"
              className="flex flex-col gap-0.5"
            >
              <NavigationMenu.List className="flex flex-col gap-4">
                {Object.entries(groupedNotes).map(([date, notes]) => (
                  <div key={date}>
                    <div className="px-4 py-1 text-xs font-medium text-content-secondary">
                      {date}
                    </div>
                    <div className="flex flex-col gap-0.5 mt-1">
                      {notes.map((note) => (
                        <NavigationMenu.Item key={note.id}>
                          <NavigationMenu.Link asChild>
                            <NavLink
                              to={`/note/${note.id}`}
                              className="block w-full justify-start px-4 py-2 h-auto text-content-primary hover:text-foreground aria-[current=page]:text-foreground aria-[current=page]:bg-on-surface-secondary transition-colors hover:bg-on-surface-secondary rounded-md"
                            >
                              <div className="w-full text-left">
                                <div className="font-medium truncate">
                                  {note.title || "Untitled"}
                                </div>
                                <div className="text-xs text-content-secondary">
                                  {format(note.createdAt, "h:mm a")}
                                </div>
                              </div>
                            </NavLink>
                          </NavigationMenu.Link>
                        </NavigationMenu.Item>
                      ))}
                    </div>
                  </div>
                ))}
              </NavigationMenu.List>
            </NavigationMenu.Root>
          </div>
        </Card>

        {/* Main Content Card */}
        <Card className="flex-1 overflow-y-auto">
          <Outlet />
        </Card>
      </div>
    </div>
  );
}
