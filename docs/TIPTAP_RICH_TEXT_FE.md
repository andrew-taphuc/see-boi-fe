# Hướng dẫn FE: Rich Text (JSON) với Tiptap

Tài liệu này hướng dẫn triển khai **đăng bài viết rich text** ở phía frontend bằng **Tiptap** và **lưu nội dung dưới dạng JSON** (ProseMirror document).

## Mục tiêu

- Người dùng soạn thảo nội dung bài viết bằng Tiptap (bold/italic/heading/list/link…).
- Khi tạo/sửa bài viết: FE gửi **`contentJson`** (object JSON) + **`contentText`** (plain text) lên backend.
- Khi hiển thị bài viết: FE render lại từ **`contentJson`** (read-only).

## 1) Thư viện cần cài

Trong project Vite/React:

```bash
npm i @tiptap/react @tiptap/starter-kit
```

Gợi ý tính năng thêm (tuỳ nhu cầu):

```bash
npm i @tiptap/extension-link @tiptap/extension-placeholder
```

## 2) Quy ước data contract (FE dùng)

### Khi tạo/cập nhật post

FE gửi payload:

- `title?: string`
- `contentJson?: object` (ProseMirror JSON)
- `contentText?: string` (text rút ra từ editor)
- `visibility?: 'PUBLIC' | 'FOLLOWERS' | 'PRIVATE' | 'ANONYMOUS'`
- `type?: 'NORMAL' | 'POLL'`
- `isDraft?: boolean`
- `poll?` (nếu `type='POLL'`)

> Lưu ý: `contentText` rất quan trọng để backend làm search/preview/list nhanh.

### Khi lấy post

- `GET /post/:id`: backend nên trả đầy đủ `contentJson` + các field khác
- `GET /post`: backend có thể trả `contentPreview` hoặc `contentText` để feed nhẹ hơn; nhưng nếu muốn render rich text ngay ở list, thì trả `contentJson` (nặng hơn).

## 3) Tạo component Editor (Tiptap)

Khuyến nghị tạo 1 component tái sử dụng:

- Nhận `initialContentJson`
- Emit `onChange({ json, text })`

Ví dụ skeleton (bạn có thể copy/paste vào codebase khi cần):

```tsx
import React, { useEffect } from 'react';
import { useEditor, EditorContent } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import Link from '@tiptap/extension-link';

type Props = {
  initialContentJson?: any;
  onChange?: (v: { json: any; text: string }) => void;
  placeholder?: string;
  editable?: boolean;
};

export function RichTextEditor({
  initialContentJson,
  onChange,
  placeholder,
  editable = true,
}: Props) {
  const editor = useEditor({
    extensions: [
      StarterKit,
      Link.configure({ openOnClick: false }),
      // Placeholder.configure({ placeholder: placeholder || 'Nhập nội dung...' }),
    ],
    content: initialContentJson ?? { type: 'doc', content: [{ type: 'paragraph' }] },
    editable,
    onUpdate: ({ editor }) => {
      const json = editor.getJSON();
      const text = editor.getText();
      onChange?.({ json, text });
    },
  });

  // Nếu cần update content khi mở modal/đổi post:
  useEffect(() => {
    if (!editor) return;
    editor.commands.setContent(initialContentJson ?? { type: 'doc', content: [{ type: 'paragraph' }] });
  }, [editor, initialContentJson]);

  return (
    <div className="border border-gray-300 rounded-lg">
      {/* Toolbar tuỳ bạn implement */}
      <div className="border-b border-gray-200 p-2 text-sm text-gray-600">
        Toolbar...
      </div>
      <div className="p-3">
        <EditorContent editor={editor} />
      </div>
    </div>
  );
}
```

## 4) Lưu JSON + text khi submit

Trong modal tạo bài viết, thay `textarea content` bằng `RichTextEditor`.

Trạng thái cần có:

- `contentJson` (object)
- `contentText` (string)

Khi submit:

- `payload.contentJson = contentJson`
- `payload.contentText = contentText`

Nếu bạn bật poll:

- `payload.type = 'POLL'`
- `payload.poll = { options: string[], expiresAt?: string }`

## 5) Render bài viết từ JSON (read-only)

### Cách 1 (khuyến nghị): dùng Tiptap read-only

Tạo component `RichTextViewer`:

- `editable={false}`
- `content` = `contentJson`

Ví dụ skeleton:

```tsx
import React from 'react';
import { useEditor, EditorContent } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import Link from '@tiptap/extension-link';

export function RichTextViewer({ contentJson }: { contentJson: any }) {
  const editor = useEditor({
    extensions: [StarterKit, Link],
    content: contentJson,
    editable: false,
  });

  if (!contentJson) return null;
  return <EditorContent editor={editor} />;
}
```

### Cách 2: convert JSON → HTML rồi render

Không khuyến nghị nếu bạn không sanitize HTML. Nếu bắt buộc, hãy sanitize.

## 6) Xử lý “đang soạn dở” (draft prompt)

UX yêu cầu:

- Khi user đóng modal mà đang soạn: hỏi **có lưu nháp không**
- Nếu chọn lưu nháp: FE gọi `POST /post` với `isDraft=true`

Trong thực tế, bạn nên xác định “dirty” bằng:

- title/contentText/contentJson/pollOptions có thay đổi

## 7) Lưu ý quan trọng

- **Giới hạn kích thước**: contentJson có thể lớn → nên giới hạn ở FE (ví dụ 50KB–200KB) trước khi submit, để tránh backend reject.
- **Undo/Redo**: Tiptap hỗ trợ sẵn qua StarterKit.
- **Link**: cần extension Link nếu muốn.
- **Ảnh upload**: cần endpoint upload riêng (backend), rồi embed image node (extension image) hoặc dán URL.
- **Backwards compatibility**: nếu bạn đang có post `content` dạng text cũ, bạn có thể:
  - render text cũ bình thường
  - hoặc convert text → doc JSON (paragraph).


