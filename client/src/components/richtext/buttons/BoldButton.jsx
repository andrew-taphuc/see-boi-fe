import React from 'react';
import { Bold } from 'lucide-react';
import { applyFormat } from '../utils/applyFormat';

/**
 * Bold button component cho Tiptap toolbar
 * Props:
 * - editor: Tiptap editor instance
 * - onClose?: () => void
 */
const BoldButton = ({ editor, onClose }) => {
  if (!editor) return null;

  return (
    <button
      type="button"
      onMouseDown={(e) => {
        e.preventDefault();
      }}
      onClick={() => {
        applyFormat(editor, () => {
          editor.chain().focus().toggleBold().run();
        });
        onClose?.();
      }}
      className={`p-2 rounded hover:bg-gray-100 transition-colors ${
        editor.isActive('bold') ? 'bg-blue-100 text-blue-600' : 'text-gray-700'
      }`}
      title="Bold"
    >
      <Bold size={18} />
    </button>
  );
};

export default BoldButton;

