import React from 'react';
import { List } from 'lucide-react';
import { applyFormat } from '../utils/applyFormat';

/**
 * Bullet List button component cho Tiptap toolbar
 * Props:
 * - editor: Tiptap editor instance
 * - onClose?: () => void
 */
const BulletListButton = ({ editor, onClose }) => {
  if (!editor) return null;

  return (
    <button
      type="button"
      onMouseDown={(e) => {
        e.preventDefault();
      }}
      onClick={() => {
        applyFormat(editor, () => {
          editor.chain().focus().toggleBulletList().run();
        });
        onClose?.();
      }}
      className={`p-2 rounded hover:bg-gray-100 transition-colors ${
        editor.isActive('bulletList') ? 'bg-blue-100 text-blue-600' : 'text-gray-700'
      }`}
      title="Bullet List"
    >
      <List size={18} />
    </button>
  );
};

export default BulletListButton;

