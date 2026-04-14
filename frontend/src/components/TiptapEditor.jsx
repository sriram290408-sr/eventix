import React from "react";
import { Box, Button } from "@mui/material";
import { EditorContent } from "@tiptap/react";

function EditorToolbar({ editor }) {
  if (!editor) return null;

  return (
    <Box sx={{ display: "flex", gap: 1, flexWrap: "wrap", mb: 1 }}>
      <Button
        size="small"
        variant={editor.isActive("paragraph") ? "contained" : "outlined"}
        onClick={() => editor.chain().focus().setParagraph().run()}
      >
        Paragraph
      </Button>

      <Button
        size="small"
        variant={editor.isActive("heading", { level: 1 }) ? "contained" : "outlined"}
        onClick={() => editor.chain().focus().toggleHeading({ level: 1 }).run()}
      >
        H1
      </Button>

      <Button
        size="small"
        variant={editor.isActive("heading", { level: 2 }) ? "contained" : "outlined"}
        onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()}
      >
        H2
      </Button>

      <Button
        size="small"
        variant={editor.isActive("bold") ? "contained" : "outlined"}
        onClick={() => editor.chain().focus().toggleBold().run()}
      >
        Bold
      </Button>

      <Button
        size="small"
        variant={editor.isActive("italic") ? "contained" : "outlined"}
        onClick={() => editor.chain().focus().toggleItalic().run()}
      >
        Italic
      </Button>

      <Button
        size="small"
        variant={editor.isActive("bulletList") ? "contained" : "outlined"}
        onClick={() => editor.chain().focus().toggleBulletList().run()}
      >
        Bullet
      </Button>

      <Button
        size="small"
        variant={editor.isActive("orderedList") ? "contained" : "outlined"}
        onClick={() => editor.chain().focus().toggleOrderedList().run()}
      >
        Number
      </Button>
    </Box>
  );
}

function TiptapEditor({ editor }) {
  return (
    <Box
      sx={{
        mt: 1.5,
        borderRadius: "14px",
        background: "rgba(255,255,255,0.08)",
        border: "1px solid rgba(255,255,255,0.15)",
        p: 2,
        color: "white",
      }}
    >
      {/* Toolbar */}
      <EditorToolbar editor={editor} />

      {/* Editor */}
      <Box
        sx={{
          borderRadius: "12px",
          background: "rgba(0,0,0,0.25)",
          p: 2,
          minHeight: "160px",
          "& .ProseMirror": {
            outline: "none",
            color: "white",
            minHeight: "120px",
          },
          "& .ProseMirror h1": {
            fontSize: "24px",
            fontWeight: 800,
          },
          "& .ProseMirror h2": {
            fontSize: "20px",
            fontWeight: 700,
          },
          "& .ProseMirror p": {
            fontSize: "14px",
            lineHeight: 1.7,
          },
        }}
      >
        <EditorContent editor={editor} />
      </Box>
    </Box>
  );
}

export default TiptapEditor;
