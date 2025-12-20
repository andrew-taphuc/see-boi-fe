import { Extension } from '@tiptap/core';

/**
 * Custom Link Extension để xử lý:
 * - Tự động tắt link khi gặp dấu cách
 */
const CustomLink = Extension.create({
  name: 'customLink',

  addKeyboardShortcuts() {
    return {
      Space: () => {
        // Nếu đang trong link và ấn space, tắt link
        if (this.editor.isActive('link')) {
          const { from, to } = this.editor.state.selection;
          if (from === to) {
            // Chỉ tắt link nếu cursor đang ở trong link (không phải selection)
            const $pos = this.editor.state.doc.resolve(from);
            const linkMark = this.editor.state.schema.marks.link;
            const linkMarkAtPos = $pos.marks().find(mark => mark.type === linkMark);
            
            if (linkMarkAtPos) {
              // Insert space và tắt link
              this.editor.chain().insertContent(' ').unsetLink().run();
              return true;
            }
          }
        }
        return false;
      },
    };
  },
});

export default CustomLink;

