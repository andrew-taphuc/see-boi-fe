# Hướng dẫn Crawl Dữ liệu Tarot

## Mô tả
Script này crawl dữ liệu từ 78 lá bài tarot từ các URL trong `video_links.json`. Script sẽ lấy tất cả các nội dung được đánh dấu bằng "phuc" ở đầu dòng trong HTML.

## Cài đặt

1. Cài đặt các thư viện cần thiết:
```bash
pip install -r requirements.txt
```

## Sử dụng

Chạy script:
```bash
python crawl_tarot_data.py
```

Script sẽ:
1. Đọc danh sách URLs từ `video_links.json`
2. Crawl từng URL (có delay 1 giây giữa các request)
3. Lưu kết quả vào `tarot_cards_data.json`

## Cấu trúc dữ liệu output

File `tarot_cards_data.json` chứa mảng các object, mỗi object có cấu trúc:

```json
{
  "card_name": "The Hierophant",
  "card_url": "https://tarotoo.com/tarot-card-meanings/the-hierophant",
  "video_mp4": "https://tarotoo.com/wp-content/uploads/5.mp4",
  "video_webm": "https://tarotoo.com/wp-content/uploads/5.webm",
  "status": "success",
  "structured_content": {
    "title": "The Hierophant Tarot Card Meaning",
    "title_html": "<h1>...</h1>",
    "description": "...",
    "image_url": "https://...",
    "paragraphs": [
      {
        "text": "Nội dung text...",
        "html": "<p>Nội dung HTML...</p>"
      }
    ],
    "relationships": {
      "text": "...",
      "html": "<p><strong>In relationships:</strong>...</p>"
    },
    "reversed_meaning": {
      "text": "...",
      "html": "<p><strong>Reversed meaning</strong>:...</p>"
    },
    "yes_no_meaning": {
      "text": "...",
      "html": "<p><strong>Yes / no meaning:</strong>...</p>"
    }
  },
  "phuc_marked_content": [
    {
      "html": "<span class=\"-active\">The Hierophant Tarot Card Meaning</span>",
      "text": "The Hierophant Tarot Card Meaning",
      "line_number": 1127
    },
    {
      "html": "<p>The Hierophant tarot card...</p>",
      "text": "The Hierophant tarot card...",
      "line_number": 1152
    }
  ],
  "total_phuc_items": 8
}
```

## Lưu ý

- Script có delay 1 giây giữa các request để tránh spam server
- Nếu một URL bị lỗi, script sẽ tiếp tục với các URL khác
- Kết quả được lưu với encoding UTF-8 để hỗ trợ tiếng Việt và các ký tự đặc biệt

