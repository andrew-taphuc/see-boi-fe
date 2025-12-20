import React from 'react';
import { AlignJustify } from 'lucide-react';
import { applyFormat } from '../utils/applyFormat';

/**
 * Nút căn đều
 */
const AlignJustifyButton = ({ editor, onClose }) => {
  if (!editor) return null;

  const isActive = editor.isActive({ textAlign: 'justify' });

  const handleClick = () => {
    applyFormat(editor, () => {
      editor.chain().focus().setTextAlign('justify').run();
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
      title="Căn đều"
    >
      <AlignJustify size={18} />
    </button>
  );
};

export default AlignJustifyButton;

