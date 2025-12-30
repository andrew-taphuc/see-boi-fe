#!/bin/bash

# Script chạy dự án See Bói
# Lưu ý: Script này KHÔNG copy file .env

set -e  # Dừng nếu có lỗi

echo "=========================================="
echo "🚀 Chạy dự án See Bói"
echo "=========================================="
echo ""

# Màu sắc cho output
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
NC='\033[0m' # No Color

# Kiểm tra Node.js
if ! command -v node &> /dev/null; then
    echo -e "${RED}❌ Node.js chưa được cài đặt. Vui lòng cài đặt Node.js trước.${NC}"
    exit 1
fi

# Hàm kiểm tra dependencies
check_dependencies() {
    local dir=$1
    local name=$2
    
    if [ ! -d "$dir/node_modules" ]; then
        echo -e "${YELLOW}⚠ $name dependencies chưa được cài đặt${NC}"
        echo "   Đang cài đặt..."
        cd "$dir"
        npm install
        cd ..
        echo -e "${GREEN}✓ $name dependencies đã được cài đặt${NC}"
    fi
}

# Kiểm tra và cài đặt dependencies nếu cần
check_dependencies "client" "Frontend"

echo ""
echo "=========================================="
echo "📝 Lưu ý:"
echo "  - File .env KHÔNG được copy tự động"
echo "  - Đảm bảo bạn đã cấu hình .env trước khi chạy"
echo "=========================================="
echo ""

# Chạy Frontend
echo "🌐 Đang khởi động Frontend..."
cd client
npm run dev

