import React from 'react';
import { Heading3 } from 'lucide-react';
import { applyFormat } from '../utils/applyFormat';

/**
 * Nút Heading 3
 */
const H3Button = ({ editor, onClose }) => {
  if (!editor) return null;

  const isActive = editor.isActive('heading', { level: 3 });

  const handleClick = () => {
    applyFormat(editor, () => {
      if (isActive) {
        // Nếu đang là H3, chuyển về paragraph
        editor.chain().focus().setParagraph().run();
      } else {
        // Nếu đang là H2 hoặc không phải heading, set thành H3
        // Tiptap tự động thay thế heading hiện tại (nếu có) bằng H3
        editor.chain().focus().toggleHeading({ level: 3 }).run();
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
      title="Heading 3"
    >
      <Heading3 size={18} />
    </button>
  );
};

export default H3Button;

