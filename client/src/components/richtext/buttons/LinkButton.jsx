import React, { useState, useEffect } from 'react';
import { Link as LinkIcon } from 'lucide-react';
import { applyFormat } from '../utils/applyFormat';

/**
 * Hàm kiểm tra xem text có phải là URL không
 */
const isUrl = (text) => {
  if (!text) return false;
  const urlPattern = /^(https?:\/\/)?([\da-z\.-]+)\.([a-z\.]{2,6})([\/\w \.-]*)*\/?$/i;
  return urlPattern.test(text.trim());
};

/**
 * Nút thêm/chỉnh sửa link
 */
const LinkButton = ({ editor, onClose }) => {
  const [url, setUrl] = useState('');
  const [text, setText] = useState('');
  const [isOpen, setIsOpen] = useState(false);

  if (!editor) return null;

  const isActive = editor.isActive('link');

  const handleClick = () => {
    if (isActive) {
      // Nếu đã có link, xóa link
      editor.chain().focus().unsetLink().run();
      onClose?.();
      return;
    }

    // Lấy selected text
    const { from, to } = editor.state.selection;
    const selectedText = editor.state.doc.textBetween(from, to, ' ');

    // Lấy link hiện tại nếu có
    const linkAttrs = editor.getAttributes('link');
    const currentUrl = linkAttrs.href || '';

    // Auto-fill logic
    let initialUrl = currentUrl;
    let initialText = selectedText;

    if (selectedText) {
      if (isUrl(selectedText)) {
        // Nếu selected text là URL, fill vào ô link
        initialUrl = selectedText;
        initialText = '';
      } else {
        // Nếu selected text là text bình thường, fill vào ô text
        initialText = selectedText;
      }
    }

    setUrl(initialUrl);
    setText(initialText);
    setIsOpen(true);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    // Validate: không điền link thì không submit
    if (!url.trim()) {
      return;
    }

    // Nếu text trống, tự động set text = link
    const finalText = text.trim() || url.trim();

    // Thêm hoặc cập nhật link
    applyFormat(editor, () => {
      const { from, to } = editor.state.selection;
      const hasSelection = from !== to;

      if (hasSelection) {
        // Nếu có selection, thay thế text và thêm link
        editor
          .chain()
          .focus()
          .deleteSelection()
          .insertContent({
            type: 'text',
            text: finalText,
            marks: [{ type: 'link', attrs: { href: url.trim() } }],
          })
          .run();
      } else {
        // Nếu không có selection, chỉ thêm link vào text hiện tại
        editor
          .chain()
          .focus()
          .extendMarkRange('link')
          .setLink({ href: url.trim() })
          .run();
      }
    });

    setIsOpen(false);
    setUrl('');
    setText('');
    onClose?.();
  };

  const handleCancel = () => {
    setIsOpen(false);
    setUrl('');
    setText('');
  };

  // Auto-fill text khi url thay đổi và text trống
  useEffect(() => {
    if (isOpen && !text.trim() && url.trim()) {
      // Không tự động fill, để user có thể nhập text riêng
      // Chỉ fill khi submit
    }
  }, [url, text, isOpen]);

  return (
    <div className="relative">
      <button
        type="button"
        onMouseDown={(e) => e.preventDefault()}
        onClick={handleClick}
        className={`p-2 rounded hover:bg-gray-100 transition-colors ${
          isActive ? 'bg-blue-100 text-blue-700' : 'text-gray-700'
        }`}
        title="Thêm link"
      >
        <LinkIcon size={18} />
      </button>

      {isOpen && (
        <div className="absolute top-full left-0 mt-2 bg-white border border-gray-300 rounded-lg shadow-lg p-3 z-50 min-w-[320px]">
          <form onSubmit={handleSubmit}>
            <div className="mb-3">
              <label className="block text-xs font-medium text-gray-700 mb-1">
                Text
              </label>
              <input
                type="text"
                value={text}
                onChange={(e) => setText(e.target.value)}
                placeholder="Nhập text hiển thị..."
                className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
              />
            </div>
            <div className="mb-3">
              <label className="block text-xs font-medium text-gray-700 mb-1">
                Link <span className="text-red-500">*</span>
              </label>
              <input
                type="url"
                value={url}
                onChange={(e) => setUrl(e.target.value)}
                placeholder="https://..."
                className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
                required
                autoFocus
              />
            </div>
            <div className="flex gap-2">
              <button
                type="submit"
                disabled={!url.trim()}
                className={`px-3 py-1.5 rounded text-sm flex-1 ${
                  url.trim()
                    ? 'bg-blue-500 text-white hover:bg-blue-600'
                    : 'bg-gray-300 text-gray-500 cursor-not-allowed'
                }`}
              >
                Áp dụng
              </button>
              <button
                type="button"
                onClick={handleCancel}
                className="px-3 py-1.5 bg-gray-200 text-gray-700 rounded hover:bg-gray-300 text-sm"
              >
                Hủy
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
};

export default LinkButton;

