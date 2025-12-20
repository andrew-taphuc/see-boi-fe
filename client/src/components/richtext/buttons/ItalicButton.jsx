import React from 'react';
import { Italic } from 'lucide-react';
import { applyFormat } from '../utils/applyFormat';

/**
 * Italic button component cho Tiptap toolbar
 * Props:
 * - editor: Tiptap editor instance
 * - onClose?: () => void
 */
const ItalicButton = ({ editor, onClose }) => {
  if (!editor) return null;

  return (
    <button
      type="button"
      onMouseDown={(e) => {
        e.preventDefault();
      }}
      onClick={() => {
        applyFormat(editor, () => {
          editor.chain().focus().toggleItalic().run();
        });
        onClose?.();
      }}
      className={`p-2 rounded hover:bg-gray-100 transition-colors ${
        editor.isActive('italic') ? 'bg-blue-100 text-blue-600' : 'text-gray-700'
      }`}
      title="Italic"
    >
      <Italic size={18} />
    </button>
  );
};

export default ItalicButton;

