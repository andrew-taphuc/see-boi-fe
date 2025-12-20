import React from 'react';
import { BubbleMenu } from '@tiptap/react';
import ToolbarButton from './ToolbarButton';

/**
 * Component BubbleMenu toolbar cho Tiptap editor
 * Props:
 * - editor: Tiptap editor instance
 */
const BubbleMenuToolbar = ({ editor }) => {
  if (!editor) return null;

  return (
    <BubbleMenu
      editor={editor}
      tippyOptions={{ 
        duration: 100,
        placement: 'top',
        interactive: true,
        hideOnClick: false,
        zIndex: 50,
      }}
      shouldShow={({ state }) => {
        try {
          const { from, to } = state.selection;
          return from !== to;
        } catch (err) {
          console.error('Error in shouldShow:', err);
          return false;
        }
      }}
    >
      <div className="flex items-center gap-1 bg-white border border-gray-300 rounded-lg shadow-lg p-1 z-50 flex-wrap max-w-[90vw]">
        <ToolbarButton 
          editor={editor} 
          onClose={() => {
            // Không đóng ngay, để user có thể click nhiều nút
          }}
        />
      </div>
    </BubbleMenu>
  );
};

export default BubbleMenuToolbar;

