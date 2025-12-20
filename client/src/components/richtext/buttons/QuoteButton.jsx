import React from 'react';
import { Quote } from 'lucide-react';
import { applyFormat } from '../utils/applyFormat';

/**
 * Quote/Blockquote button component cho Tiptap toolbar
 * Props:
 * - editor: Tiptap editor instance
 * - onClose?: () => void
 */
const QuoteButton = ({ editor, onClose }) => {
  if (!editor) return null;

  return (
    <button
      type="button"
      onMouseDown={(e) => {
        e.preventDefault();
      }}
      onClick={() => {
        applyFormat(editor, () => {
          editor.chain().focus().toggleBlockquote().run();
        });
        onClose?.();
      }}
      className={`p-2 rounded hover:bg-gray-100 transition-colors ${
        editor.isActive('blockquote') ? 'bg-blue-100 text-blue-600' : 'text-gray-700'
      }`}
      title="Quote"
    >
      <Quote size={18} />
    </button>
  );
};

export default QuoteButton;

