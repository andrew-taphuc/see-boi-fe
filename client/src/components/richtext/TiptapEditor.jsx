import React, { useEffect, useRef, useMemo } from 'react';
import { useEditor, EditorContent } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import Placeholder from '@tiptap/extension-placeholder';
import TextAlign from '@tiptap/extension-text-align';
import History from '@tiptap/extension-history';
import Link from '@tiptap/extension-link';
import Underline from '@tiptap/extension-underline';
import CharacterCount from '@tiptap/extension-character-count';
import CustomImage from './extensions/CustomImage';
import CustomLink from './extensions/CustomLink';
import BubbleMenuToolbar from './BubbleMenuToolbar';
import SlashCommandMenu from './SlashCommandMenu';
import './TiptapEditor.css';

const EMPTY_DOC = { type: 'doc', content: [{ type: 'paragraph' }] };

/**
 * Props:
 * - valueJson?: object
 * - onChange?: ({ json, text }) => void
 * - onPollSuggestion?: () => void
 * - onMentionSuggestion?: (query: string) => void (cho tag người sau này)
 */
const TiptapEditor = ({ valueJson, onChange, onPollSuggestion, onMentionSuggestion }) => {
  const containerRef = useRef(null);

  const editor = useEditor({
    extensions: [
      StarterKit.configure({
        // Tắt History trong StarterKit vì sẽ dùng extension riêng
        history: false,
      }),
      History,
      Placeholder.configure({
        placeholder: 'Hãy viết gì đó ...',
      }),
      TextAlign.configure({
        types: ['heading', 'paragraph'],
      }),
      Link.configure({
        openOnClick: false,
        HTMLAttributes: {
          class: 'text-blue-600 underline cursor-pointer',
        },
        autolink: false,
      }),
      CustomLink,
      Underline,
      CharacterCount.configure({
        limit: 4500,
      }),
      CustomImage,
    ],
    content: valueJson ?? EMPTY_DOC,
    onUpdate: ({ editor }) => {
      onChange?.({ json: editor.getJSON(), text: editor.getText() });
    },
  });

  // Sync external value -> editor (khi mở modal reset)
  useEffect(() => {
    if (!editor) return;
    editor.commands.setContent(valueJson ?? EMPTY_DOC);
  }, [editor, valueJson]);

  // Helper function để check URL
  const isUrl = (text) => {
    if (!text) return false;
    const urlPattern = /^(https?:\/\/)?([\da-z\.-]+)\.([a-z\.]{2,6})([\/\w \.-]*)*\/?$/i;
    return urlPattern.test(text.trim());
  };

  // Handle paste link
  useEffect(() => {
    if (!editor) return;

    const handlePaste = (e) => {
      const clipboardData = e.clipboardData;
      if (!clipboardData) return;

      const text = clipboardData.getData('text/plain');
      if (!text || !isUrl(text.trim())) return;

      // Kiểm tra xem có phải là URL thuần túy không (không có text khác)
      const trimmedText = text.trim();
      if (trimmedText !== text || text.includes('\n') || text.split(' ').length > 1) {
        // Nếu có whitespace hoặc nhiều dòng, không xử lý
        return;
      }

      // Nếu paste là URL thuần túy, tự động tạo link
      e.preventDefault();
      e.stopPropagation();
      e.stopImmediatePropagation();
      
      const url = trimmedText;
      editor.chain().focus().insertContent({
        type: 'text',
        text: url,
        marks: [{ type: 'link', attrs: { href: url } }],
      }).run();
    };

    const editorElement = editor.view.dom;
    // Sử dụng capture phase để xử lý trước Tiptap
    editorElement.addEventListener('paste', handlePaste, true);

    return () => {
      editorElement.removeEventListener('paste', handlePaste, true);
    };
  }, [editor]);

  // Handle drag & drop images
  useEffect(() => {
    if (!editor) return;

    const handleDrop = (e) => {
      e.preventDefault();
      e.stopPropagation();
      
      const files = Array.from(e.dataTransfer.files);
      const imageFiles = files.filter((file) => file.type.startsWith('image/'));

      if (imageFiles.length === 0) return;

      // Tính toán vị trí drop trong editor
      const coordinates = editor.view.posAtCoords({
        left: e.clientX,
        top: e.clientY,
      });

      if (!coordinates) return;

      // Set cursor tại vị trí drop
      editor.commands.setTextSelection(coordinates.pos);
      
      for (const file of imageFiles) {
        if (file.size > 5 * 1024 * 1024) {
          alert(`Ảnh ${file.name} vượt quá 5MB`);
          continue;
        }

        // Tạo data URL để preview (chỉ UI, chưa upload)
        const reader = new FileReader();
        reader.onloadend = () => {
          try {
            const dataUrl = reader.result;
            if (!dataUrl || typeof dataUrl !== 'string') {
              throw new Error('Invalid data URL');
            }
            // Insert ảnh vào vị trí drop với data URL
            editor.chain().focus().setImage({ src: dataUrl }).run();
          } catch (error) {
            console.error('Error inserting image:', error);
            alert(`Chèn ảnh ${file.name} thất bại`);
          }
        };
        reader.onerror = () => {
          alert(`Đọc ảnh ${file.name} thất bại`);
        };
        reader.readAsDataURL(file);
      }
    };

    const handleDragOver = (e) => {
      e.preventDefault();
      e.stopPropagation();
    };

    const editorElement = editor.view.dom;
    editorElement.addEventListener('drop', handleDrop);
    editorElement.addEventListener('dragover', handleDragOver);

    return () => {
      editorElement.removeEventListener('drop', handleDrop);
      editorElement.removeEventListener('dragover', handleDragOver);
    };
  }, [editor]);

  // Tạo danh sách commands cho SlashCommandMenu
  const slashCommands = useMemo(() => {
    const commands = [];
    
    if (onPollSuggestion) {
      commands.push({
        trigger: ['vote', 'poll'],
        label: 'Tạo vote',
        icon: '📊',
        onSelect: onPollSuggestion,
      });
    }

    // Có thể thêm commands khác sau này, ví dụ:
    // if (onMentionSuggestion) {
    //   commands.push({
    //     trigger: ['tag', 'mention', '@'],
    //     label: 'Tag người',
    //     icon: '👤',
    //     onSelect: () => onMentionSuggestion(''),
    //   });
    // }

    return commands;
  }, [onPollSuggestion, onMentionSuggestion]);

  if (!editor) {
    return (
      <div className="p-3 text-sm text-gray-500">
        Đang tải trình soạn thảo...
      </div>
    );
  }

  // Get character count from extension storage
  const getCharacterCount = () => {
    if (!editor) return 0;
    const charCount = editor.storage.characterCount;
    if (!charCount) return 0;
    return typeof charCount.characters === 'function' 
      ? charCount.characters() 
      : (charCount.characters || 0);
  };

  const charCount = getCharacterCount();
  const limit = 4500;
  const isNearLimit = charCount > limit * 0.9;
  const isOverLimit = charCount > limit;

  return (
    <div className="relative" ref={containerRef}>
      {/* Bubble Menu (floating toolbar) - tự hiện khi có selection */}
      <BubbleMenuToolbar editor={editor} />

      {/* Slash Command Menu */}
      {editor && (
        <SlashCommandMenu
          editor={editor}
          containerRef={containerRef}
          commands={slashCommands}
        />
      )}

      {/* Editor Content */}
      <EditorContent
        editor={editor}
        className="prose prose-sm max-w-none min-h-[120px]"
      />

      {/* Character Count */}
      <div className="mt-2 flex justify-end">
        <span
          className={`text-xs ${
            isOverLimit
              ? 'text-red-600 font-semibold'
              : isNearLimit
              ? 'text-orange-600'
              : 'text-gray-500'
          }`}
        >
          {charCount.toLocaleString()} / {limit.toLocaleString()} ký tự
          {isOverLimit && ' (Đã vượt quá giới hạn)'}
        </span>
      </div>
    </div>
  );
};

export default TiptapEditor;
