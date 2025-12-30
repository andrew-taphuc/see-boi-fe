#!/bin/bash

# Script build và restart ứng dụng See Bói
# - Build frontend trong /opt/see-boi-fe/client
# - Nếu build thành công thì restart PM2 process
# - Hỗ trợ rollback tự động nếu build hoặc restart thất bại

# Không dùng set -e để có thể xử lý rollback
set +e

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
DIST_DIR="$CLIENT_DIR/dist"
BACKUP_DIR="$CLIENT_DIR/dist.backup"
ROLLBACK_ENABLED=true

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

# Kiểm tra và cài đặt dependencies nếu cần
echo ""
echo -e "${BLUE}📦 Đang kiểm tra dependencies...${NC}"

NEED_INSTALL=false

# Kiểm tra xem có node_modules không
if [ ! -d "node_modules" ]; then
    echo -e "${YELLOW}⚠️  Không tìm thấy node_modules${NC}"
    NEED_INSTALL=true
else
    # Kiểm tra xem package-lock.json có mới hơn node_modules không
    if [ -f "package-lock.json" ]; then
        if [ "package-lock.json" -nt "node_modules" ]; then
            echo -e "${YELLOW}⚠️  package-lock.json mới hơn node_modules${NC}"
            NEED_INSTALL=true
        fi
    elif [ "package.json" -nt "node_modules" ]; then
        echo -e "${YELLOW}⚠️  package.json mới hơn node_modules${NC}"
        NEED_INSTALL=true
    fi
fi

# Cài đặt dependencies nếu cần
if [ "$NEED_INSTALL" = true ]; then
    echo ""
    echo -e "${BLUE}📥 Đang cài đặt dependencies...${NC}"
    
    if [ -f "package-lock.json" ]; then
        echo -e "${BLUE}   Sử dụng npm ci (clean install)...${NC}"
        npm ci --prefer-offline --no-audit --loglevel=error
    else
        echo -e "${BLUE}   Sử dụng npm install...${NC}"
        npm install --prefer-offline --no-audit --loglevel=error
    fi
    
    if [ $? -eq 0 ]; then
        echo -e "${GREEN}✓ Đã cài đặt dependencies thành công!${NC}"
    else
        echo -e "${RED}❌ Lỗi khi cài đặt dependencies${NC}"
        exit 1
    fi
else
    echo -e "${GREEN}✓ Dependencies đã được cài đặt${NC}"
fi

# Backup thư mục dist hiện tại nếu có (để rollback)
BACKUP_CREATED=false
if [ "$ROLLBACK_ENABLED" = true ] && [ -d "$DIST_DIR" ]; then
    echo ""
    echo -e "${BLUE}💾 Đang backup thư mục dist hiện tại...${NC}"
    
    # Xóa backup cũ nếu có
    if [ -d "$BACKUP_DIR" ]; then
        rm -rf "$BACKUP_DIR"
    fi
    
    # Tạo backup
    cp -r "$DIST_DIR" "$BACKUP_DIR"
    if [ $? -eq 0 ]; then
        BACKUP_CREATED=true
        echo -e "${GREEN}✓ Đã tạo backup thành công tại: $BACKUP_DIR${NC}"
    else
        echo -e "${YELLOW}⚠️  Không thể tạo backup, tiếp tục build...${NC}"
    fi
fi

echo ""
echo -e "${BLUE}🔨 Đang build frontend...${NC}"
echo ""

# Chạy npm run build và lưu exit code
npm run build
BUILD_EXIT_CODE=$?

# Hàm rollback
rollback_dist() {
    if [ "$BACKUP_CREATED" = true ] && [ -d "$BACKUP_DIR" ]; then
        echo ""
        echo -e "${YELLOW}🔄 Đang rollback về phiên bản trước...${NC}"
        
        # Xóa dist hiện tại nếu có
        if [ -d "$DIST_DIR" ]; then
            rm -rf "$DIST_DIR"
        fi
        
        # Khôi phục từ backup
        cp -r "$BACKUP_DIR" "$DIST_DIR"
        
        if [ $? -eq 0 ]; then
            echo -e "${GREEN}✓ Đã rollback thành công!${NC}"
            return 0
        else
            echo -e "${RED}❌ Lỗi khi rollback!${NC}"
            return 1
        fi
    else
        echo -e "${YELLOW}⚠️  Không có backup để rollback${NC}"
        return 1
    fi
}

# Hàm xóa backup sau khi thành công
cleanup_backup() {
    if [ -d "$BACKUP_DIR" ]; then
        echo ""
        echo -e "${BLUE}🧹 Đang xóa backup cũ...${NC}"
        rm -rf "$BACKUP_DIR"
        echo -e "${GREEN}✓ Đã xóa backup${NC}"
    fi
}

# Kiểm tra kết quả build
if [ $BUILD_EXIT_CODE -eq 0 ]; then
    echo ""
    echo -e "${GREEN}✓ Build thành công!${NC}"
    
    # Kiểm tra xem dist có được tạo không
    if [ ! -d "$DIST_DIR" ]; then
        echo ""
        echo -e "${RED}❌ Thư mục dist không được tạo sau khi build!${NC}"
        rollback_dist
        echo ""
        echo -e "${YELLOW}⚠️  Đang khởi động lại tất cả dịch vụ PM2...${NC}"
        pm2 start all || true
        echo -e "${YELLOW}⚠️  Đã khởi động lại dịch vụ PM2${NC}"
        exit 1
    fi
    
    echo ""
    echo -e "${BLUE}▶️  Đang khởi động lại tất cả dịch vụ PM2...${NC}"
    
    # Khởi động lại tất cả dịch vụ PM2
    pm2 start all
    PM2_EXIT_CODE=$?
    
    if [ $PM2_EXIT_CODE -eq 0 ]; then
        echo ""
        echo -e "${GREEN}✓ Đã khởi động lại tất cả dịch vụ PM2 thành công!${NC}"
        
        # Xóa backup sau khi thành công
        cleanup_backup
        
        echo ""
        echo "=========================================="
        echo -e "${GREEN}✅ Hoàn tất!${NC}"
        echo "=========================================="
        exit 0
    else
        echo ""
        echo -e "${RED}❌ Lỗi khi khởi động lại dịch vụ PM2${NC}"
        echo -e "${YELLOW}⚠️  Đang rollback...${NC}"
        
        # Rollback nếu PM2 restart thất bại
        rollback_dist
        
        # Khởi động lại PM2 với phiên bản cũ
        echo ""
        echo -e "${YELLOW}⚠️  Đang khởi động lại PM2 với phiên bản cũ...${NC}"
        pm2 start all || true
        echo -e "${YELLOW}⚠️  Đã khởi động lại dịch vụ PM2${NC}"
        
        exit 1
    fi
else
    echo ""
    echo -e "${RED}❌ Build thất bại!${NC}"
    
    # Rollback nếu build thất bại
    rollback_dist
    
    echo ""
    echo -e "${YELLOW}⚠️  Đang khởi động lại tất cả dịch vụ PM2...${NC}"
    # Vẫn khởi động lại PM2 services với phiên bản cũ
    pm2 start all || true
    echo -e "${YELLOW}⚠️  Đã khởi động lại dịch vụ PM2${NC}"
    exit 1
fi

