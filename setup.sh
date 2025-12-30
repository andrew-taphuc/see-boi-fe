#!/bin/bash

# Script setup dự án See Bói
# Lưu ý: Script này KHÔNG copy file .env

set -e  # Dừng nếu có lỗi

echo "=========================================="
echo "🚀 Setup dự án See Bói"
echo "=========================================="
echo ""

# Màu sắc cho output
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Kiểm tra Node.js
if ! command -v node &> /dev/null; then
    echo "❌ Node.js chưa được cài đặt. Vui lòng cài đặt Node.js trước."
    exit 1
fi

echo "✓ Node.js version: $(node --version)"
echo "✓ npm version: $(npm --version)"
echo ""

# Setup Frontend
echo "📦 Đang cài đặt dependencies cho Frontend..."
cd client
if [ ! -d "node_modules" ]; then
    npm install
    echo -e "${GREEN}✓ Frontend dependencies đã được cài đặt${NC}"
else
    echo -e "${YELLOW}⚠ Frontend dependencies đã tồn tại, bỏ qua...${NC}"
fi
cd ..

echo ""
echo "=========================================="
echo "✅ Setup hoàn tất!"
echo "=========================================="
echo ""
echo "📝 Lưu ý:"
echo "  - File .env KHÔNG được copy tự động"
echo "  - Vui lòng tạo file .env thủ công nếu cần"
echo "  - Xem README.md để biết cách cấu hình .env"
echo ""
echo "🚀 Để chạy dự án:"
echo "  - Frontend: cd client && npm run dev"
echo "  - Backend: cd backend && npm run start:dev"
echo ""

