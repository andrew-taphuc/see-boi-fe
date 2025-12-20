import React from 'react';
import { Underline } from 'lucide-react';
import { applyFormat } from '../utils/applyFormat';

/**
 * Nút gạch chân (underline)
 */
const UnderlineButton = ({ editor, onClose }) => {
  if (!editor) return null;

  const isActive = editor.isActive('underline');

  const handleClick = () => {
    applyFormat(editor, () => {
      editor.chain().focus().toggleUnderline().run();
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
      title="Gạch chân"
    >
      <Underline size={18} />
    </button>
  );
};

export default UnderlineButton;

