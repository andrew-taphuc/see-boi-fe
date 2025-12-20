import React from 'react';
import { Heading2 } from 'lucide-react';
import { applyFormat } from '../utils/applyFormat';

/**
 * Nút Heading 2
 */
const H2Button = ({ editor, onClose }) => {
  if (!editor) return null;

  const isActive = editor.isActive('heading', { level: 2 });

  const handleClick = () => {
    applyFormat(editor, () => {
      if (isActive) {
        // Nếu đang là H2, chuyển về paragraph
        editor.chain().focus().setParagraph().run();
      } else {
        // Nếu đang là H3 hoặc không phải heading, set thành H2
        // Tiptap tự động thay thế heading hiện tại (nếu có) bằng H2
        editor.chain().focus().toggleHeading({ level: 2 }).run();
      }
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
      title="Heading 2"
    >
      <Heading2 size={18} />
    </button>
  );
};

export default H2Button;

