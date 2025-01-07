import { useEditor, EditorContent } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import Placeholder from "@tiptap/extension-placeholder";

interface RichTextEditorProps {
  content: string;
  onChange?: (content: string) => void;
  className?: string;
}

export function RichTextEditor({
  content,
  onChange,
  className,
}: RichTextEditorProps) {
  const editor = useEditor({
    extensions: [
      StarterKit,
      Placeholder.configure({
        placeholder: "Start your note",
      }),
    ],
    autofocus: "end",
    content,
    editorProps: {
      attributes: {
        class:
          "prose lg:prose-lg xl:prose-xl focus:outline-none max-w-none h-full",
      },
    },
    onUpdate: ({ editor }) => {
      const html = editor.getHTML();
      onChange?.(html);
    },
  });

  return <EditorContent editor={editor} className="h-full" />;
}
