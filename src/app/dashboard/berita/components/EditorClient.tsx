"use client";

import * as React from "react";
import { useEditor, EditorContent } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import Underline from "@tiptap/extension-underline";
import Link from "@tiptap/extension-link";
import Image from "@tiptap/extension-image";
import TextAlign from "@tiptap/extension-text-align";
import Placeholder from "@tiptap/extension-placeholder";
import { Button } from "@/components/ui/button";
import { Toggle } from "@/components/ui/toggle";
import { Separator } from "@/components/ui/separator";
import {
  Bold, Italic, Underline as UnderlineIcon, Strikethrough,
  Heading2, List, ListOrdered, Quote, Link as LinkIcon,
  Image as ImageIcon,
} from "lucide-react";
import { cn } from "@/lib/utils";

type EditorProps = {
  value?: string;
  onChange?: (html: string) => void;
  placeholder?: string;
  className?: string;
};

export default function EditorClient({
  value,
  onChange,
  placeholder = "Tulis konten berita di sini…",
  className,
}: EditorProps) {
  const editor = useEditor({
    extensions: [
      StarterKit.configure({ heading: { levels: [2, 3] } }),
      Underline,
      Link.configure({
        openOnClick: true,
        autolink: true,
        HTMLAttributes: { rel: "noopener noreferrer", target: "_blank" },
      }),
      Image.configure({ allowBase64: true }),
      TextAlign.configure({ types: ["heading", "paragraph"] }),
      Placeholder.configure({ placeholder }),
    ],
    content: value || "",
    onUpdate: ({ editor }) => onChange?.(editor.getHTML()),
    editorProps: {
      attributes: {
        class:
          "prose prose-sm max-w-none dark:prose-invert focus:outline-none min-h-[240px]",
      },
    },
    immediatelyRender: false, // penting untuk Next.js
  });

  // Hooks TIDAK conditional (aman)
  const fileInputRef = React.useRef<HTMLInputElement>(null);
  const handlePickImage = () => fileInputRef.current?.click();
  const handleFile = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const f = e.target.files?.[0];
    if (!f) return;
    const b64 = await toBase64(f);
    editor?.chain().focus().setImage({ src: String(b64) }).run();
    e.target.value = "";
  };

  return (
    <div className={cn("rounded-lg border bg-background", className)}>
      {/* Toolbar */}
      <div className="flex flex-wrap items-center gap-1 p-2">
        <Toggle size="sm" pressed={editor?.isActive("bold")} onPressedChange={() => editor?.chain().focus().toggleBold().run()}>
          <Bold className="h-4 w-4" />
        </Toggle>
        <Toggle size="sm" pressed={editor?.isActive("italic")} onPressedChange={() => editor?.chain().focus().toggleItalic().run()}>
          <Italic className="h-4 w-4" />
        </Toggle>
        <Toggle size="sm" pressed={editor?.isActive("underline")} onPressedChange={() => editor?.chain().focus().toggleUnderline().run()}>
          <UnderlineIcon className="h-4 w-4" />
        </Toggle>
        <Toggle size="sm" pressed={editor?.isActive("strike")} onPressedChange={() => editor?.chain().focus().toggleStrike().run()}>
          <Strikethrough className="h-4 w-4" />
        </Toggle>

        <Separator orientation="vertical" className="mx-1 h-6" />

        <Button size="sm" variant={editor?.isActive("heading", { level: 2 }) ? "secondary" : "ghost"}
          onClick={() => editor?.chain().focus().toggleHeading({ level: 2 }).run()}>
          <Heading2 className="h-4 w-4 mr-1" /> H2
        </Button>
        <Button size="sm" variant={editor?.isActive("heading", { level: 3 }) ? "secondary" : "ghost"}
          onClick={() => editor?.chain().focus().toggleHeading({ level: 3 }).run()}>
          <Heading2 className="h-4 w-4 mr-1" /> H3
        </Button>

        <Separator orientation="vertical" className="mx-1 h-6" />

        <Button size="sm" variant={editor?.isActive("bulletList") ? "secondary" : "ghost"}
          onClick={() => editor?.chain().focus().toggleBulletList().run()}>
          <List className="h-4 w-4" />
        </Button>
        <Button size="sm" variant={editor?.isActive("orderedList") ? "secondary" : "ghost"}
          onClick={() => editor?.chain().focus().toggleOrderedList().run()}>
          <ListOrdered className="h-4 w-4" />
        </Button>
        <Button size="sm" variant={editor?.isActive("blockquote") ? "secondary" : "ghost"}
          onClick={() => editor?.chain().focus().toggleBlockquote().run()}>
          <Quote className="h-4 w-4" />
        </Button>

        <Separator orientation="vertical" className="mx-1 h-6" />

        <Button size="sm" variant="ghost" onClick={() => {
          const url = window.prompt("Masukkan URL");
          if (!url) return;
          editor?.chain().focus().extendMarkRange("link").setLink({ href: url }).run();
        }}>
          <LinkIcon className="h-4 w-4" />
        </Button>

        <Button size="sm" variant="ghost" onClick={handlePickImage}>
          <ImageIcon className="h-4 w-4" />
        </Button>
        <input ref={fileInputRef} type="file" accept="image/*" className="hidden" onChange={handleFile} />
      </div>

      <Separator />
      <div className="p-3">
        <EditorContent editor={editor} />
      </div>
    </div>
  );
}

function toBase64(file: File) {
  return new Promise((resolve, reject) => {
    const r = new FileReader();
    r.onload = () => resolve(r.result as string);
    r.onerror = reject;
    r.readAsDataURL(file);
  });
}
