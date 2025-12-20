/**
 * Helper function để preserve selection khi apply format
 * @param {Object} editor - Tiptap editor instance
 * @param {Function} commandFn - Function để execute command
 */
export const applyFormat = (editor, commandFn) => {
  if (!editor) return;

  const { from, to } = editor.state.selection;
  const hasSelection = from !== to;
  
  if (hasSelection) {
    // Lưu selection
    const selection = { from, to };
    
    // Apply command
    commandFn();
    
    // Restore selection sau khi apply
    setTimeout(() => {
      try {
        editor.commands.setTextSelection(selection);
        editor.commands.focus();
      } catch (e) {
        // Ignore nếu selection không hợp lệ
      }
    }, 0);
  } else {
    // Nếu không có selection, chỉ apply command bình thường
    commandFn();
  }
};

