import React from 'react';
import { Node, mergeAttributes } from '@tiptap/core';
import { ReactNodeViewRenderer } from '@tiptap/react';
import { X } from 'lucide-react';

/**
 * Custom Image NodeView Component với nút xóa
 */
const ImageNodeView = ({ node, deleteNode }) => {
  return (
    <div className="relative group my-4 flex justify-center">
      <img
        src={node.attrs.src}
        alt={node.attrs.alt || ''}
        className="max-w-full h-auto rounded-lg"
        style={{ display: 'block', margin: '0 auto' }}
      />
      <button
        type="button"
        onClick={deleteNode}
        className="absolute top-2 right-2 bg-red-500 hover:bg-red-600 text-white rounded-full p-1.5 opacity-0 group-hover:opacity-100 transition-opacity shadow-lg"
        title="Xóa ảnh"
      >
        <X size={16} />
      </button>
    </div>
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
        props.editor.commands.deleteNode('image');
      };

      return <ImageNodeView node={props.node} deleteNode={deleteNode} />;
    });
  },
});

export default CustomImage;

