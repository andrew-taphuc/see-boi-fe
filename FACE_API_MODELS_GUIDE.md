# Hướng Dẫn Tải Models cho face-api.js

## Cách 1: Sử dụng CDN (Đã cấu hình sẵn - Khuyến nghị)

Models sẽ tự động được tải từ CDN khi ứng dụng chạy. Không cần tải thủ công.

**CDN đang sử dụng:**
```
https://cdn.jsdelivr.net/npm/@vladmandic/face-api/model
```

## Cách 2: Tải về Local (Nếu muốn tải nhanh hơn hoặc offline)

### Bước 1: Tải models từ GitHub

Truy cập repository chính thức của face-api.js:
- **GitHub**: https://github.com/justadudewhohacks/face-api.js-models
- Hoặc tải trực tiếp từ: https://github.com/justadudewhohacks/face-api.js-models/tree/master/weights

### Bước 2: Tải các model files cần thiết

Cần tải 2 models sau:

#### 1. Tiny Face Detector Model
- `tiny_face_detector_model-weights_manifest.json`
- `tiny_face_detector_model-shard1`

**Link tải trực tiếp:**
- https://raw.githubusercontent.com/justadudewhohacks/face-api.js-models/master/weights/tiny_face_detector_model-weights_manifest.json
- https://raw.githubusercontent.com/justadudewhohacks/face-api.js-models/master/weights/tiny_face_detector_model-shard1

#### 2. Face Landmark 68 Model
- `face_landmark_68_model-weights_manifest.json`
- `face_landmark_68_model-shard1`

**Link tải trực tiếp:**
- https://raw.githubusercontent.com/justadudewhohacks/face-api.js-models/master/weights/face_landmark_68_model-weights_manifest.json
- https://raw.githubusercontent.com/justadudewhohacks/face-api.js-models/master/weights/face_landmark_68_model-shard1

### Bước 3: Đặt models vào project

1. Tạo thư mục `public/models/` trong project:
   ```bash
   mkdir -p client/public/models
   ```

2. Copy các file đã tải vào thư mục `client/public/models/`:
   ```
   client/public/models/
   ├── tiny_face_detector_model-weights_manifest.json
   ├── tiny_face_detector_model-shard1
   ├── face_landmark_68_model-weights_manifest.json
   └── face_landmark_68_model-shard1
   ```

### Bước 4: Code sẽ tự động sử dụng local models

Code đã được cấu hình để tự động fallback sang local models nếu CDN không load được.

## Script tự động tải models (Tùy chọn)

Bạn có thể tạo script để tự động tải models:

```bash
#!/bin/bash
# download_models.sh

MODEL_DIR="client/public/models"
mkdir -p $MODEL_DIR

echo "Downloading Tiny Face Detector Model..."
curl -o "$MODEL_DIR/tiny_face_detector_model-weights_manifest.json" \
  https://raw.githubusercontent.com/justadudewhohacks/face-api.js-models/master/weights/tiny_face_detector_model-weights_manifest.json

curl -o "$MODEL_DIR/tiny_face_detector_model-shard1" \
  https://raw.githubusercontent.com/justadudewhohacks/face-api.js-models/master/weights/tiny_face_detector_model-shard1

echo "Downloading Face Landmark 68 Model..."
curl -o "$MODEL_DIR/face_landmark_68_model-weights_manifest.json" \
  https://raw.githubusercontent.com/justadudewhohacks/face-api.js-models/master/weights/face_landmark_68_model-weights_manifest.json

curl -o "$MODEL_DIR/face_landmark_68_model-shard1" \
  https://raw.githubusercontent.com/justadudewhohacks/face-api.js-models/master/weights/face_landmark_68_model-shard1

echo "Models downloaded successfully!"
```

Chạy script:
```bash
chmod +x download_models.sh
./download_models.sh
```

## Lưu ý

- **CDN**: Nhanh, không cần tải, nhưng phụ thuộc vào internet
- **Local**: Chậm hơn lần đầu (cần tải), nhưng nhanh hơn sau đó và có thể offline
- Models có kích thước khoảng 1-2MB mỗi model
- Code đã được cấu hình để tự động fallback nếu CDN không hoạt động

