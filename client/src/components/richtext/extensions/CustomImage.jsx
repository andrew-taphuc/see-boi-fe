import React, { useState, useRef, useEffect } from 'react';
import { Node, mergeAttributes } from '@tiptap/core';
import { ReactNodeViewRenderer, NodeViewWrapper } from '@tiptap/react';
import { X } from 'lucide-react';

/**
 * Custom Image NodeView Component với nút xóa (chỉ hiện khi editable)
 */
const ImageNodeView = ({ node, deleteNode, editor }) => {
  const isEditable = editor?.isEditable ?? false;
  const [imageStyle, setImageStyle] = useState({
    maxWidth: '100%',
    height: 'auto',
  });
  const imgRef = useRef(null);
  
  const updateImageStyle = (img) => {
    if (!img || !img.naturalWidth || !img.naturalHeight) return;
    
    const width = img.naturalWidth;
    const height = img.naturalHeight;
    
    // Phát hiện ảnh ngang hay dọc
    if (width > height) {
      // Ảnh ngang: chiều ngang nhỏ hơn để căn giữa đẹp hơn (75%)
      setImageStyle({
        maxWidth: '75%',
        height: 'auto',
      });
    } else {
      // Ảnh dọc: cố định chiều cao để tránh ảnh quá to (400px)
      setImageStyle({
        maxHeight: '400px',
        width: 'auto',
      });
    }
  };
  
  const handleImageLoad = (e) => {
    updateImageStyle(e.target);
  };
  
  // Xử lý trường hợp ảnh đã được cache (onLoad có thể không fire)
  useEffect(() => {
    // Reset style về mặc định khi src thay đổi
    setImageStyle({
      maxWidth: '100%',
      height: 'auto',
    });
    
    // Kiểm tra nếu ảnh đã load sẵn (cached)
    if (imgRef.current && imgRef.current.complete && imgRef.current.naturalWidth > 0) {
      updateImageStyle(imgRef.current);
    }
  }, [node.attrs.src]);
  
  return (
    <NodeViewWrapper className="relative group my-4 flex justify-center">
      <img
        ref={imgRef}
        src={node.attrs.src}
        alt={node.attrs.alt || ''}
        className="rounded-lg"
        style={{ 
          display: 'block', 
          margin: '0 auto',
          ...imageStyle
        }}
        onLoad={handleImageLoad}
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

