import * as faceapi from 'face-api.js';

let modelsLoaded = false;

/**
 * Load face-api.js models
 * Ưu tiên load từ local, nếu không có thì fallback sang CDN
 */
export const loadFaceModels = async () => {
  if (modelsLoaded) {
    return true;
  }

  const LOCAL_MODEL_URL = '/models';
  const CDN_MODEL_URL = 'https://cdn.jsdelivr.net/npm/@vladmandic/face-api/model';

  // Thử load từ local trước (offline)
  try {
    console.log('[Face Detection] Đang tải models từ local (offline)...');
    await Promise.all([
      faceapi.nets.tinyFaceDetector.loadFromUri(LOCAL_MODEL_URL),
      faceapi.nets.faceLandmark68Net.loadFromUri(LOCAL_MODEL_URL),
    ]);

    modelsLoaded = true;
    console.log('[Face Detection] ✓ Models đã được tải từ local (offline)');
    return true;
  } catch (localError) {
    console.warn('[Face Detection] ⚠ Không tìm thấy models ở local, đang fallback sang CDN...');
    console.warn('[Face Detection] Lỗi local:', localError.message);
    
    // Fallback: thử load từ CDN
    try {
      console.log('[Face Detection] Đang tải models từ CDN...');
      await Promise.all([
        faceapi.nets.tinyFaceDetector.loadFromUri(CDN_MODEL_URL),
        faceapi.nets.faceLandmark68Net.loadFromUri(CDN_MODEL_URL),
      ]);

      modelsLoaded = true;
      console.log('[Face Detection] ✓ Models đã được tải từ CDN (fallback)');
      console.log('[Face Detection] 💡 Tip: Tải models về local để tải nhanh hơn. Chạy: ./download_face_models.sh');
      return true;
    } catch (cdnError) {
      console.error('[Face Detection] ✗ Không thể tải models từ cả local và CDN');
      console.error('[Face Detection] Lỗi CDN:', cdnError.message);
      return false;
    }
  }
};

/**
 * Detect face trong ảnh
 * @param {File|string} imageFile - File ảnh hoặc data URL
 * @returns {Promise<faceapi.WithFaceLandmarks<faceapi.WithFaceDetection<faceapi.FaceDetection>, faceapi.FaceLandmarks68>[]>} Mảng các khuôn mặt được detect
 */
export const detectFace = async (imageFile) => {
  try {
    // Đảm bảo models đã được load
    const loaded = await loadFaceModels();
    if (!loaded) {
      throw new Error('Không thể load face detection models');
    }

    // Tạo image element từ file
    let image;
    if (imageFile instanceof File) {
      // Chuyển File thành data URL rồi load image
      const dataUrl = await new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.onload = () => resolve(reader.result);
        reader.onerror = reject;
        reader.readAsDataURL(imageFile);
      });
      image = await faceapi.fetchImage(dataUrl);
    } else if (typeof imageFile === 'string') {
      // Nếu là data URL hoặc URL
      image = await faceapi.fetchImage(imageFile);
    } else {
      throw new Error('Invalid image file type');
    }

    // Detect face với landmarks
    const detections = await faceapi
      .detectAllFaces(image, new faceapi.TinyFaceDetectorOptions())
      .withFaceLandmarks();

    return detections;
  } catch (error) {
    console.error('Error detecting face:', error);
    throw error;
  }
};

/**
 * Crop ảnh cận mặt với padding
 * @param {File|string} imageFile - File ảnh gốc
 * @param {faceapi.WithFaceLandmarks} detection - Kết quả detect face
 * @param {number} padding - Padding xung quanh mặt (tỷ lệ, default: 0.3 = 30%)
 * @returns {Promise<File>} File ảnh đã được crop
 */
export const cropFaceImage = async (imageFile, detection, padding = 0.3) => {
  return new Promise((resolve, reject) => {
    try {
      // Tạo image element
      const img = new Image();
      
      img.onload = () => {
        try {
          const box = detection.detection.box;
          
          // Tính toán vùng crop với padding
          const paddingX = box.width * padding;
          const paddingY = box.height * padding;
          
          const x = Math.max(0, box.x - paddingX);
          const y = Math.max(0, box.y - paddingY);
          const width = Math.min(img.width - x, box.width + paddingX * 2);
          const height = Math.min(img.height - y, box.height + paddingY * 2);
          
          // Tạo canvas để crop
          const canvas = document.createElement('canvas');
          canvas.width = width;
          canvas.height = height;
          const ctx = canvas.getContext('2d');
          
          // Vẽ phần ảnh cần crop lên canvas
          ctx.drawImage(img, x, y, width, height, 0, 0, width, height);
          
          // Chuyển canvas thành blob rồi thành File
          canvas.toBlob((blob) => {
            if (!blob) {
              reject(new Error('Không thể tạo ảnh đã crop'));
              return;
            }
            
            // Tạo File từ blob
            const croppedFile = new File([blob], imageFile.name || 'cropped-face.jpg', {
              type: imageFile.type || 'image/jpeg',
              lastModified: Date.now()
            });
            
            resolve(croppedFile);
          }, imageFile.type || 'image/jpeg', 0.95);
        } catch (error) {
          reject(error);
        }
      };
      
      img.onerror = () => {
        reject(new Error('Không thể load ảnh'));
      };
      
      // Set source cho image
      if (imageFile instanceof File) {
        const reader = new FileReader();
        reader.onload = (e) => {
          img.src = e.target.result;
        };
        reader.onerror = () => {
          reject(new Error('Không thể đọc file ảnh'));
        };
        reader.readAsDataURL(imageFile);
      } else if (typeof imageFile === 'string') {
        img.src = imageFile;
      } else {
        reject(new Error('Invalid image file type'));
      }
    } catch (error) {
      reject(error);
    }
  });
};

/**
 * Validate và crop ảnh khuôn mặt
 * @param {File} imageFile - File ảnh cần validate và crop
 * @returns {Promise<{success: boolean, file?: File, error?: string, detection?: any}>}
 */
export const validateAndCropFace = async (imageFile) => {
  try {
    // Đảm bảo models đã được load
    const loaded = await loadFaceModels();
    if (!loaded) {
      return {
        success: false,
        error: 'Không thể tải models nhận diện khuôn mặt. Vui lòng kiểm tra kết nối internet và thử lại.'
      };
    }

    // Detect face
    console.log('[Face Detection] Đang nhận diện khuôn mặt...');
    const detections = await detectFace(imageFile);
    
    if (!detections || detections.length === 0) {
      console.warn('[Face Detection] Không tìm thấy khuôn mặt trong ảnh');
      return {
        success: false,
        error: '❌ Không tìm thấy khuôn mặt trong ảnh.\n\nVui lòng:\n• Chọn ảnh có khuôn mặt rõ ràng, chụp chính diện\n• Đảm bảo khuôn mặt không bị che khuất\n• Tránh ảnh quá tối hoặc quá sáng\n• Tránh ảnh bị mờ hoặc không rõ nét'
      };
    }
    
    if (detections.length > 1) {
      console.warn(`[Face Detection] Tìm thấy ${detections.length} khuôn mặt trong ảnh`);
      return {
        success: false,
        error: `❌ Ảnh có ${detections.length} khuôn mặt.\n\nVui lòng chọn ảnh chỉ có một khuôn mặt để phân tích chính xác.`
      };
    }
    
    console.log('[Face Detection] ✓ Đã tìm thấy 1 khuôn mặt, đang cắt ảnh cận mặt...');
    
    // Crop ảnh cận mặt
    const croppedFile = await cropFaceImage(imageFile, detections[0]);
    
    console.log('[Face Detection] ✓ Đã cắt ảnh cận mặt thành công');
    
    return {
      success: true,
      file: croppedFile,
      detection: detections[0]
    };
  } catch (error) {
    console.error('[Face Detection] ✗ Lỗi khi xử lý ảnh:', error);
    
    // Xử lý các loại lỗi cụ thể
    let errorMessage = 'Có lỗi xảy ra khi xử lý ảnh. Vui lòng thử lại.';
    
    if (error.message) {
      if (error.message.includes('load face detection models')) {
        errorMessage = '❌ Không thể tải models nhận diện khuôn mặt.\n\nVui lòng kiểm tra kết nối internet và thử lại.';
      } else if (error.message.includes('Invalid image file type')) {
        errorMessage = '❌ Định dạng ảnh không hợp lệ.\n\nVui lòng chọn file ảnh (JPG, JPEG, PNG, WEBP).';
      } else if (error.message.includes('load ảnh') || error.message.includes('đọc file')) {
        errorMessage = '❌ Không thể đọc file ảnh.\n\nVui lòng kiểm tra file ảnh có bị hỏng không và thử lại.';
      } else {
        errorMessage = `❌ Lỗi: ${error.message}\n\nVui lòng thử lại hoặc chọn ảnh khác.`;
      }
    }
    
    return {
      success: false,
      error: errorMessage
    };
  }
};

