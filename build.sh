#!/bin/bash

# Script build và restart ứng dụng See Bói
# - Build frontend trong /opt/see-boi-fe/client
# - Nếu build thành công thì restart PM2 process

set -e  # Dừng nếu có lỗi

echo "=========================================="
echo "🔨 Build và Restart See Bói"
echo "=========================================="
echo ""

# Màu sắc cho output
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Đường dẫn đến thư mục client
CLIENT_DIR="/opt/see-boi-fe/client"
PM2_APP_NAME="see-boi-fe"

# Kiểm tra thư mục client có tồn tại không
if [ ! -d "$CLIENT_DIR" ]; then
    echo -e "${RED}❌ Thư mục $CLIENT_DIR không tồn tại!${NC}"
    exit 1
fi

# Kiểm tra Node.js
if ! command -v node &> /dev/null; then
    echo -e "${RED}❌ Node.js chưa được cài đặt. Vui lòng cài đặt Node.js trước.${NC}"
    exit 1
fi

# Kiểm tra PM2
if ! command -v pm2 &> /dev/null; then
    echo -e "${RED}❌ PM2 chưa được cài đặt. Vui lòng cài đặt PM2 trước.${NC}"
    exit 1
fi

# Dừng tất cả dịch vụ PM2 trước khi build
echo ""
echo -e "${YELLOW}⏸️  Đang dừng tất cả dịch vụ PM2...${NC}"
pm2 stop all || true  # || true để không dừng script nếu không có process nào đang chạy
echo -e "${GREEN}✓ Đã dừng tất cả dịch vụ PM2${NC}"
echo ""

echo -e "${BLUE}📂 Đang chuyển đến thư mục: $CLIENT_DIR${NC}"
cd "$CLIENT_DIR"

# Kiểm tra package.json có tồn tại không
if [ ! -f "package.json" ]; then
    echo -e "${RED}❌ Không tìm thấy package.json trong $CLIENT_DIR${NC}"
    exit 1
fi

# Thiết lập memory limit cho Node.js (1GB)
export NODE_OPTIONS="--max-old-space-size=1024"
echo -e "${BLUE}💾 Đã thiết lập Node.js memory limit: 1024MB${NC}"

echo ""
echo -e "${BLUE}🔨 Đang build frontend...${NC}"
echo ""

# Chạy npm run build và lưu exit code
npm run build
BUILD_EXIT_CODE=$?

# Kiểm tra kết quả build
if [ $BUILD_EXIT_CODE -eq 0 ]; then
    echo ""
    echo -e "${GREEN}✓ Build thành công!${NC}"
    echo ""
    echo -e "${BLUE}▶️  Đang khởi động lại tất cả dịch vụ PM2...${NC}"
    
    # Khởi động lại tất cả dịch vụ PM2
    pm2 start all
    
    if [ $? -eq 0 ]; then
        echo ""
        echo -e "${GREEN}✓ Đã khởi động lại tất cả dịch vụ PM2 thành công!${NC}"
        echo ""
        echo "=========================================="
        echo -e "${GREEN}✅ Hoàn tất!${NC}"
        echo "=========================================="
    else
        echo ""
        echo -e "${RED}❌ Lỗi khi khởi động lại dịch vụ PM2${NC}"
        exit 1
    fi
else
    echo ""
    echo -e "${RED}❌ Build thất bại!${NC}"
    echo ""
    echo -e "${YELLOW}⚠️  Đang khởi động lại tất cả dịch vụ PM2...${NC}"
    # Vẫn khởi động lại PM2 services ngay cả khi build thất bại
    pm2 start all || true
    echo -e "${YELLOW}⚠️  Đã khởi động lại dịch vụ PM2${NC}"
    exit 1
fi

