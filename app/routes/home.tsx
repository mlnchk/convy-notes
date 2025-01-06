import { useNavigate, useSearchParams } from "react-router";
import NoteApp from "~/components/note-app";

export default function Home() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const noteId = searchParams.get("noteId");

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
    />
  );
}
