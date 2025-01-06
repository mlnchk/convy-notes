import { useNavigate, useSearchParams } from "react-router";
import { useLiveQuery } from "dexie-react-hooks";
import NoteApp from "~/components/note-app";
import { getNotes } from "~/lib/notes";

import type { Info } from "./+types/home";

export async function clientLoader() {
  const notes = await getNotes();
  return { notes };
}

export default function Home({
  loaderData: { notes: initialNotes },
}: {
  loaderData: Info["loaderData"];
}) {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const noteId = searchParams.get("noteId");

  const notes = useLiveQuery(getNotes, [], initialNotes);

  const handleNoteSelect = (noteId: number | null) => {
    if (noteId) {
      navigate(`?noteId=${noteId}`);
    } else {
      navigate(".");
    }
  };

  return (
    <NoteApp
      selectedNoteId={noteId ? Number(noteId) : null}
      onNoteSelect={handleNoteSelect}
      notes={notes}
    />
  );
}
