import { useEditor, EditorContent } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import Placeholder from "@tiptap/extension-placeholder";

interface RichTextEditorProps {
  content: string;
  className?: string;
  editable?: boolean;
  onChange?: (content: string) => void;
}

export function RichTextEditor({
  content,
  editable = true,
  className,
  onChange,
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
    editable,
    onFocus: () => {
      /* Handling multiple tabs situation */
      editor?.commands.setContent(content);
    },
    onUpdate: ({ editor }) => {
      const html = editor.getHTML();
      onChange?.(html);
    },
  });

  return <EditorContent editor={editor} className="h-full" />;
}
