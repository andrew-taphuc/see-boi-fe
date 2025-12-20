import React from 'react';
import { AlignCenter } from 'lucide-react';
import { applyFormat } from '../utils/applyFormat';

/**
 * Nút căn giữa
 */
const AlignCenterButton = ({ editor, onClose }) => {
  if (!editor) return null;

  const isActive = editor.isActive({ textAlign: 'center' });

  const handleClick = () => {
    applyFormat(editor, () => {
      editor.chain().focus().setTextAlign('center').run();
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
      title="Căn giữa"
    >
      <AlignCenter size={18} />
    </button>
  );
};

export default AlignCenterButton;

