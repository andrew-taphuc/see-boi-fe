import React, { useEffect } from 'react';
import { useEditor, EditorContent } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import TextAlign from '@tiptap/extension-text-align';
import Link from '@tiptap/extension-link';
import Underline from '@tiptap/extension-underline';
import CustomImage from './extensions/CustomImage';
import './TiptapViewer.css';

/**
 * Render ProseMirror JSON từ Tiptap ở chế độ read-only.
 * Props:
 * - contentJson?: object
 */
const TiptapViewer = ({ contentJson }) => {
  const editor = useEditor({
    extensions: [
      StarterKit,
      TextAlign.configure({
        types: ['heading', 'paragraph'],
      }),
      Link.configure({
        openOnClick: true,
        HTMLAttributes: {
          class: 'text-blue-600 underline cursor-pointer',
        },
      }),
      Underline,
      CustomImage,
    ],
    content: contentJson,
    editable: false,
  });

  // Sync content khi contentJson thay đổi
  useEffect(() => {
    if (!editor || !contentJson) return;
    
    // Parse nếu contentJson là string
    let parsedContent = contentJson;
    if (typeof contentJson === 'string') {
      try {
        parsedContent = JSON.parse(contentJson);
      } catch (e) {
        console.error('Error parsing contentJson:', e);
        return;
      }
    }
    
    // Chỉ update nếu content thực sự thay đổi
    const currentContent = editor.getJSON();
    if (JSON.stringify(currentContent) !== JSON.stringify(parsedContent)) {
      editor.commands.setContent(parsedContent);
    }
  }, [editor, contentJson]);

  // Nếu không có contentJson hoặc editor chưa sẵn sàng, không render gì
  if (!contentJson) return null;
  if (!editor) return null;

  return (
    <div className="prose max-w-none">
      <EditorContent editor={editor} />
    </div>
  );
};

export default TiptapViewer;


