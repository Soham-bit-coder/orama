"use client";

import React, { useCallback } from 'react';
import { useEditor, EditorContent } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import EmojiPicker from './EmojiPicker';

const EMPTY_CONTENT = '<p></p>';

export default function RichTextEditor({ content = EMPTY_CONTENT, onInput, disabled = false, className = '' }) {
  const editor = useEditor({
    extensions: [
      StarterKit.configure({
        heading: false,
        bulletList: false,
        orderedList: false,
        code: false,
        codeBlock: false,
        blockquote: false,
        horizontalRule: false,
        hardBreak: false,
        history: {},
      }),
    ],
    content: EMPTY_CONTENT,
    editable: !disabled,
    onUpdate: ({ editor }) => {
      const html = editor.getHTML();
      if (onInput) onInput(html);
    },
    editorProps: {
      attributes: {
        class: 'prose prose-invert max-w-none min-h-[120px] p-4 focus:outline-none',
      },
    },
  });

  const clear = useCallback(() => {
    if (editor) {
      editor.commands.setContent(EMPTY_CONTENT);
      if (onInput) onInput(EMPTY_CONTENT);
    }
  }, [editor, onInput]);

  const handleEmojiSelect = (emoji) => {
    if (editor) {
      editor.commands.insertContent(emoji);
    }
  };

  if (!editor) return null;

  return (
    <div className={`relative ${className} bg-transparent rounded-lg border border-gray-700/50 overflow-hidden`}>
      <EditorContent editor={editor} />

      <div className="border-t border-gray-700/50 p-2 flex gap-2 bg-gray-900/30">
        <button
          type="button"
          className={`p-1 rounded hover:bg-gray-700/50 transition-colors ${editor.isActive('bold') ? 'text-primary-500' : 'text-gray-400'}`}
          onClick={() => editor.chain().focus().toggleBold().run()}
          disabled={disabled}
          aria-label="Bold"
          title="Bold"
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 24 24" fill="currentColor">
            <path d="M15.6 11.79c.97-.67 1.65-1.77 1.65-2.79 0-2.26-1.75-4-4-4H7v14h7.04c2.09 0 3.71-1.7 3.71-3.79 0-1.52-.86-2.82-2.15-3.42zM10 7.5h3c.83 0 1.5.67 1.5 1.5s-.67 1.5-1.5 1.5h-3v-3zm3.5 9H10v-3h3.5c.83 0 1.5.67 1.5 1.5s-.67 1.5-1.5 1.5z"/>
          </svg>
        </button>

        <button
          type="button"
          className={`p-1 rounded hover:bg-gray-700/50 transition-colors ${editor.isActive('italic') ? 'text-primary-500' : 'text-gray-400'}`}
          onClick={() => editor.chain().focus().toggleItalic().run()}
          disabled={disabled}
          aria-label="Italic"
          title="Italic"
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 24 24" fill="currentColor">
            <path d="M10 4v3h2.21l-3.42 8H6v3h8v-3h-2.21l3.42-8H18V4z"/>
          </svg>
        </button>

        <button
          type="button"
          className={`p-1 rounded hover:bg-gray-700/50 transition-colors ${editor.isActive('strike') ? 'text-primary-500' : 'text-gray-400'}`}
          onClick={() => editor.chain().focus().toggleStrike().run()}
          disabled={disabled}
          aria-label="Strikethrough"
          title="Strikethrough"
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 24 24" fill="currentColor">
            <path d="M7.24 8.75c-.26-.48-.39-1.03-.39-1.67 0-.61.13-1.16.4-1.67.26-.5.63-.93 1.11-1.29.48-.35 1.05-.63 1.7-.83.66-.19 1.39-.29 2.18-.29.81 0 1.54.11 2.21.34.66.22 1.23.54 1.69.94.47.4.83.88 1.08 1.43.25.55.38 1.15.38 1.81h-3.01c0-.31-.05-.59-.15-.85-.09-.27-.24-.49-.44-.68-.2-.19-.45-.33-.75-.44-.3-.1-.66-.16-1.06-.16-.39 0-.74.04-1.03.13-.29.09-.53.21-.72.36-.19.16-.34.34-.44.55-.1.21-.15.43-.15.66 0 .48.25.88.74 1.21.38.25.77.48 1.41.7H7.39c-.05-.08-.11-.17-.15-.25zM21 12v-2H3v2h9.62c.18.07.4.14.55.2.37.17.66.34.87.51.21.17.35.36.43.57.07.2.11.43.11.69 0 .23-.05.45-.14.66-.09.2-.23.38-.42.53-.19.15-.42.26-.71.35-.29.08-.63.13-1.01.13-.43 0-.83-.04-1.18-.13s-.66-.23-.91-.42c-.25-.19-.45-.44-.59-.75-.14-.31-.25-.76-.25-1.21H6.4c0 .55.08 1.13.24 1.58.16.45.37.85.65 1.21.28.35.6.66.98.92.37.26.78.48 1.22.65.44.17.9.3 1.38.39.48.08.96.13 1.44.13.8 0 1.53-.09 2.18-.28s1.21-.45 1.67-.79c.46-.34.82-.77 1.07-1.27s.38-1.07.38-1.71c0-.6-.1-1.14-.31-1.61-.05-.11-.11-.23-.17-.33H21z"/>
          </svg>
        </button>

        <div className="flex-1"></div>

        <EmojiPicker
          onSelect={handleEmojiSelect}
          disabled={disabled}
        />
      </div>
    </div>
  );
}
