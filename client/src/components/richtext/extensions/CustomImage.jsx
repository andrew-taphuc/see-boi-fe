import React from 'react';
import { Node, mergeAttributes } from '@tiptap/core';
import { ReactNodeViewRenderer, NodeViewWrapper } from '@tiptap/react';
import { X } from 'lucide-react';

/**
 * Custom Image NodeView Component với nút xóa (chỉ hiện khi editable)
 */
const ImageNodeView = ({ node, deleteNode, editor }) => {
  const isEditable = editor?.isEditable ?? false;
  
  return (
    <NodeViewWrapper className="relative group my-4 flex justify-center">
      <img
        src={node.attrs.src}
        alt={node.attrs.alt || ''}
        className="max-w-full h-auto rounded-lg"
        style={{ display: 'block', margin: '0 auto' }}
      />
      {isEditable && (
        <button
          type="button"
          onClick={deleteNode}
          className="absolute top-2 right-2 bg-red-500 hover:bg-red-600 text-white rounded-full p-1.5 opacity-0 group-hover:opacity-100 transition-opacity shadow-lg"
          title="Xóa ảnh"
        >
          <X size={16} />
        </button>
      )}
    </NodeViewWrapper>
  );
};

/**
 * Custom Image Extension với NodeView React
 */
const CustomImage = Node.create({
  name: 'image',
  group: 'block',
  draggable: true,
  addAttributes() {
    return {
      src: {
        default: null,
      },
      alt: {
        default: null,
      },
      title: {
        default: null,
      },
    };
  },
  parseHTML() {
    return [
      {
        tag: 'img[src]',
      },
    ];
  },
  renderHTML({ HTMLAttributes }) {
    return ['img', mergeAttributes(HTMLAttributes)];
  },
  addCommands() {
    return {
      setImage: (options) => ({ commands }) => {
        return commands.insertContent({
          type: this.name,
          attrs: options,
        });
      },
    };
  },
  addNodeView() {
    return ReactNodeViewRenderer((props) => {
      const deleteNode = () => {
        const { editor, getPos } = props;
        const pos = getPos();
        
        if (typeof pos === 'number') {
          // Xóa node tại vị trí cụ thể
          editor.commands.command(({ tr, state }) => {
            const node = state.doc.nodeAt(pos);
            if (node) {
              tr.delete(pos, pos + node.nodeSize);
              return true;
            }
            return false;
          });
        }
      };

      return <ImageNodeView node={props.node} deleteNode={deleteNode} editor={props.editor} />;
    });
  },
});

export default CustomImage;

