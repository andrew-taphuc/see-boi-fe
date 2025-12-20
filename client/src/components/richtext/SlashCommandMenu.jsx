import React, { useEffect, useState, useRef } from 'react';

/**
 * Component hiển thị menu suggestions khi gõ "/" + chữ cái
 * Props:
 * - editor: Tiptap editor instance
 * - containerRef: Ref của container editor (để tính vị trí relative)
 * - commands: Array of { trigger: string[], label: string, icon?: string, onSelect: () => void }
 *   - trigger: Mảng các từ khóa trigger (ví dụ: ['vote', 'poll'] hoặc ['tag', 'mention'])
 *   - label: Text hiển thị
 *   - icon: Icon emoji hoặc text
 *   - onSelect: Callback khi chọn suggestion
 */
const SlashCommandMenu = ({ editor, containerRef, commands = [] }) => {
  const [showMenu, setShowMenu] = useState(false);
  const [menuPos, setMenuPos] = useState({ top: 0, left: 0 });
  const [matchedCommands, setMatchedCommands] = useState([]);
  const [selectedIndex, setSelectedIndex] = useState(0);

  useEffect(() => {
    if (!editor) return;

    const checkForSlashCommand = () => {
      const { from } = editor.state.selection;
      const text = editor.state.doc.textBetween(0, from);
      
      // Kiểm tra xem có "/" + chữ cái ở cuối không
      const slashMatch = text.match(/\/([a-zA-Z]+)$/);
      
      if (slashMatch) {
        const commandText = slashMatch[1].toLowerCase();
        
        // Tìm các commands phù hợp
        const matched = commands.filter((cmd) => {
          return cmd.trigger.some((trigger) => 
            trigger.toLowerCase().startsWith(commandText)
          );
        });

        if (matched.length > 0) {
          try {
            const coords = editor.view.coordsAtPos(from);
            // Tính toán vị trí relative với container
            if (containerRef?.current) {
              const containerRect = containerRef.current.getBoundingClientRect();
              setMenuPos({
                top: coords.bottom - containerRect.top,
                left: coords.left - containerRect.left,
              });
              setMatchedCommands(matched);
              setSelectedIndex(0);
              setShowMenu(true);
            }
          } catch (e) {
            setShowMenu(false);
          }
        } else {
          setShowMenu(false);
        }
      } else {
        setShowMenu(false);
      }
    };

    editor.on('selectionUpdate', checkForSlashCommand);
    editor.on('update', checkForSlashCommand);

    return () => {
      editor.off('selectionUpdate', checkForSlashCommand);
      editor.off('update', checkForSlashCommand);
    };
  }, [editor, containerRef, commands]);

  // Xử lý keyboard navigation
  useEffect(() => {
    if (!showMenu || matchedCommands.length === 0) return;

    const handleKeyDown = (e) => {
      if (e.key === 'ArrowDown') {
        e.preventDefault();
        setSelectedIndex((prev) => (prev + 1) % matchedCommands.length);
      } else if (e.key === 'ArrowUp') {
        e.preventDefault();
        setSelectedIndex((prev) => (prev - 1 + matchedCommands.length) % matchedCommands.length);
      } else if (e.key === 'Enter' || e.key === 'Tab') {
        e.preventDefault();
        handleSelect(matchedCommands[selectedIndex]);
      } else if (e.key === 'Escape') {
        e.preventDefault();
        setShowMenu(false);
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => {
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, [showMenu, matchedCommands, selectedIndex]);

  const handleSelect = (command) => {
    if (!editor || !command) return;

    const { from } = editor.state.selection;
    const text = editor.state.doc.textBetween(0, from);
    const slashMatch = text.match(/\/([a-zA-Z]+)$/);

    if (slashMatch) {
      // Xóa "/" + chữ cái
      const startPos = from - slashMatch[0].length;
      editor.commands.deleteRange({ from: startPos, to: from });

      // Trigger callback
      command.onSelect?.();
      setShowMenu(false);
    }
  };

  if (!showMenu || matchedCommands.length === 0) return null;

  return (
    <div
      className="absolute z-50 bg-white border border-gray-200 rounded-lg shadow-lg overflow-hidden"
      style={{
        top: `${menuPos.top}px`,
        left: `${menuPos.left}px`,
        marginTop: '4px',
        minWidth: '200px',
      }}
    >
      {matchedCommands.map((cmd, index) => (
        <button
          key={index}
          type="button"
          onClick={() => handleSelect(cmd)}
          className={`w-full flex items-center gap-2 px-3 py-2 text-sm text-left transition-colors ${
            index === selectedIndex
              ? 'bg-blue-50 text-blue-700'
              : 'text-gray-700 hover:bg-gray-50'
          }`}
        >
          {cmd.icon && <span className="text-lg">{cmd.icon}</span>}
          <span>{cmd.label}</span>
        </button>
      ))}
    </div>
  );
};

export default SlashCommandMenu;

