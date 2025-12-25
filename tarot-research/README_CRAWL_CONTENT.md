# Hướng dẫn Crawl Nội dung Tarot Cards

Script này sẽ crawl nội dung từ các trang tarot card từ file `tarot_card.json` và lưu kết quả vào file JSON.

## Yêu cầu

- Python 3.7 trở lên
- pip (Python package manager)

## Cài đặt

### 1. Tạo virtual environment (venv)

```bash
cd tarot-research
python3 -m venv venv
```

### 2. Kích hoạt virtual environment

**Trên macOS/Linux:**
```bash
source venv/bin/activate
```

**Trên Windows:**
```bash
venv\Scripts\activate
```

### 3. Cài đặt dependencies

```bash
pip install -r requirements.txt
```

Các package sẽ được cài đặt:
- `beautifulsoup4`: Để parse HTML
- `lxml`: Parser cho BeautifulSoup
- `requests`: Để gửi HTTP requests

## Chạy script

Sau khi đã kích hoạt venv và cài đặt dependencies:

```bash
python crawl_tarot_content.py
```

Script sẽ:
1. Đọc file `tarot_card.json` để lấy danh sách 78 lá bài
2. Crawl từng trang theo URL trong `card_url`
3. Trích xuất nội dung từ `div.content__body`
4. Lấy các thẻ: `<p>`, `<ul>`, `<li>`, `<h1>`, `<h2>`, `<h3>`
5. Bỏ qua các `<li>` có chứa thẻ `<a>` bên trong
6. Lưu kết quả vào file `tarot_cards_content.json`

## Kết quả

File output `tarot_cards_content.json` sẽ chứa mảng 78 objects, mỗi object có format:

```json
{
  "url": "https://tarotoo.com/tarot-card-meanings/the-hermit",
  "status": "success",
  "cardId": 10,
  "total_blocks": 13,
  "blocks": [
    {
      "index": 1,
      "type": "p",
      "html": "<p>The Hermit is quite a literal card...</p>"
    },
    {
      "index": 2,
      "type": "h2",
      "html": "<h2>Upright Meaning</h2>"
    },
    {
      "index": 3,
      "type": "ul",
      "html": "<ul><li>Look within for answers</li><li>Retreat...</li></ul>"
    }
  ]
}
```

## Lưu ý

- Script có delay giữa các request để tránh bị block (1 giây giữa mỗi request chính, 0.5 giây giữa các request phụ)
- Nếu một trang không crawl được, `status` sẽ là `"error"` và có thêm trường `error` chứa thông tin lỗi
- Nếu không tìm thấy nội dung, `status` sẽ là `"warning"`
- Dữ liệu đã được sanitize để có thể lưu vào database dạng JSONB

## Troubleshooting

### Lỗi "ModuleNotFoundError"

Đảm bảo bạn đã:
1. Tạo và kích hoạt venv
2. Cài đặt dependencies: `pip install -r requirements.txt`

### Lỗi kết nối mạng

- Kiểm tra kết nối internet
- Một số trang có thể cần thời gian chờ lâu hơn, script đã set timeout 30 giây

### Lỗi "No module named 'lxml'"

Cài đặt lại lxml:
```bash
pip install lxml
```

Nếu vẫn lỗi trên macOS, có thể cần cài thêm:
```bash
brew install libxml2 libxslt
```

## Tắt virtual environment

Sau khi hoàn thành, bạn có thể tắt venv:

```bash
deactivate
```

