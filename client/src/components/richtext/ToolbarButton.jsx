import React from 'react';
import BoldButton from './buttons/BoldButton';
import ItalicButton from './buttons/ItalicButton';
import StrikeButton from './buttons/StrikeButton';
import UnderlineButton from './buttons/UnderlineButton';
import LinkButton from './buttons/LinkButton';
import BulletListButton from './buttons/BulletListButton';
import OrderedListButton from './buttons/OrderedListButton';
import H2Button from './buttons/H2Button';
import H3Button from './buttons/H3Button';
import QuoteButton from './buttons/QuoteButton';
import ImageButton from './buttons/ImageButton';
import AlignLeftButton from './buttons/AlignLeftButton';
import AlignCenterButton from './buttons/AlignCenterButton';
import AlignRightButton from './buttons/AlignRightButton';
import AlignJustifyButton from './buttons/AlignJustifyButton';
import ToolbarDivider from './buttons/ToolbarDivider';

/**
 * Component toolbar button cho Tiptap editor
 * Props:
 * - editor: Tiptap editor instance
 * - onClose?: () => void (để đóng toolbar khi cần)
 */
const ToolbarButton = ({ editor, onClose }) => {
  if (!editor) return null;

  return (
    <>
      <BoldButton editor={editor} onClose={onClose} />
      <ItalicButton editor={editor} onClose={onClose} />
      <StrikeButton editor={editor} onClose={onClose} />
      <UnderlineButton editor={editor} onClose={onClose} />
      <LinkButton editor={editor} onClose={onClose} />
      <ToolbarDivider />
      <BulletListButton editor={editor} onClose={onClose} />
      <OrderedListButton editor={editor} onClose={onClose} />
      <ToolbarDivider />
      <div className="flex items-center gap-0">
        <H2Button editor={editor} onClose={onClose} />
        <H3Button editor={editor} onClose={onClose} />
      </div>
      <QuoteButton editor={editor} onClose={onClose} />
      <ImageButton editor={editor} onClose={onClose} />
      <ToolbarDivider />
      <AlignLeftButton editor={editor} onClose={onClose} />
      <AlignCenterButton editor={editor} onClose={onClose} />
      <AlignRightButton editor={editor} onClose={onClose} />
      <AlignJustifyButton editor={editor} onClose={onClose} />
    </>
  );
};

export default ToolbarButton;

