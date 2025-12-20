import React from 'react';
import { Strikethrough } from 'lucide-react';
import { applyFormat } from '../utils/applyFormat';

/**
 * Nút gạch ngang (strikethrough)
 */
const StrikeButton = ({ editor, onClose }) => {
  if (!editor) return null;

  const isActive = editor.isActive('strike');

  const handleClick = () => {
    applyFormat(editor, () => {
      editor.chain().focus().toggleStrike().run();
    });
    onClose?.();
  };

  return (
    <button
      type="button"
      onMouseDown={(e) => e.preventDefault()}
      onClick={handleClick}
      className={`p-2 rounded hover:bg-gray-100 transition-colors ${
        isActive ? 'bg-blue-100 text-blue-700' : 'text-gray-700'
      }`}
      title="Gạch ngang"
    >
      <Strikethrough size={18} />
    </button>
  );
};

export default StrikeButton;

