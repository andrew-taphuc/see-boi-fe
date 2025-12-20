import React from 'react';
import { AlignLeft } from 'lucide-react';
import { applyFormat } from '../utils/applyFormat';

/**
 * Nút căn lề trái
 */
const AlignLeftButton = ({ editor, onClose }) => {
  if (!editor) return null;

  const isActive = editor.isActive({ textAlign: 'left' });

  const handleClick = () => {
    applyFormat(editor, () => {
      editor.chain().focus().setTextAlign('left').run();
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
      title="Căn trái"
    >
      <AlignLeft size={18} />
    </button>
  );
};

export default AlignLeftButton;

