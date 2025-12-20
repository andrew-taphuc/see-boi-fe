import React from 'react';
import { ListOrdered } from 'lucide-react';
import { applyFormat } from '../utils/applyFormat';

/**
 * Ordered List button component cho Tiptap toolbar
 * Props:
 * - editor: Tiptap editor instance
 * - onClose?: () => void
 */
const OrderedListButton = ({ editor, onClose }) => {
  if (!editor) return null;

  return (
    <button
      type="button"
      onMouseDown={(e) => {
        e.preventDefault();
      }}
      onClick={() => {
        applyFormat(editor, () => {
          editor.chain().focus().toggleOrderedList().run();
        });
        onClose?.();
      }}
      className={`p-2 rounded hover:bg-gray-100 transition-colors ${
        editor.isActive('orderedList') ? 'bg-blue-100 text-blue-600' : 'text-gray-700'
      }`}
      title="Numbered List"
    >
      <ListOrdered size={18} />
    </button>
  );
};

export default OrderedListButton;

