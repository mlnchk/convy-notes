import { Button } from "~/components/ui/button";
import { RichTextEditor } from "~/components/rich-text-editor";
import { Copy, FileText } from "lucide-react";
import { createNote } from "~/lib/notes";
import { decodeNote, type ShareableNote } from "~/lib/sharing";
import { createRoute, useNavigate } from "@tanstack/react-router";
import { LayoutRoute } from "~/routes/layout";

const Route = createRoute({
  getParentRoute: () => LayoutRoute,
  path: "/shared/$encodedNote",
  component: SharedNote,
});

function SharedNote() {
  const { encodedNote } = Route.useParams();
  const navigate = useNavigate();

  if (!encodedNote) {
    return (
      <div className="flex flex-col items-center justify-center h-full text-center p-8">
        <FileText className="h-16 w-16 text-content-primary/50 mb-4" />
        <h2 className="text-2xl font-bold text-content-primary mb-2">
          Note Not Found
        </h2>
        <p className="text-content-primary/80 mb-4 max-w-sm">
          The shared note link appears to be invalid
        </p>
      </div>
    );
  }

  let decodedNote: ShareableNote;
  try {
    decodedNote = decodeNote(encodedNote);
  } catch (error) {
    return (
      <div className="flex flex-col items-center justify-center h-full text-center p-8">
        <FileText className="h-16 w-16 text-content-primary/50 mb-4" />
        <h2 className="text-2xl font-bold text-content-primary mb-2">
          Invalid Note Data
        </h2>
        <p className="text-content-primary/80 mb-4 max-w-sm">
          The shared note data appears to be corrupted
        </p>
      </div>
    );
  }

  const handleCopyNote = async () => {
    const id = await createNote({
      title: decodedNote.title,
      content: decodedNote.content,
    });

    if (typeof id === "number") {
      navigate({ to: "/note/$noteId", params: { noteId: id.toString() } });
    }
  };

  return (
    <div className="max-w-2xl py-20 px-5 mx-auto flex flex-col">
      <div className="flex items-center justify-between mb-4">
        <h1 className="text-4xl font-bold text-content-primary">
          {decodedNote.title || "Untitled"}
        </h1>
        <Button onClick={handleCopyNote}>
          <Copy className="h-4 w-4 mr-2 text-content-primary" />
          Make a Copy
        </Button>
      </div>
      <RichTextEditor
        editable={false}
        content={decodedNote.content}
        onChange={() => {}}
        className="flex-1 [&_.ProseMirror]:pointer-events-none"
      />
    </div>
  );
}

export default Route;
