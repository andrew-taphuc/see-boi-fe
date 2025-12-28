import { useEffect, useRef, useState } from 'react';

/**
 * Component hiển thị ảnh khuôn mặt với các điểm landmarks được đánh dấu
 * @param {string} imageSrc - Base64 image hoặc URL
 * @param {object} landmarks - Object chứa các điểm landmarks
 */
const FaceImageWithLandmarks = ({ imageSrc, landmarks }) => {
  const canvasRef = useRef(null);
  const imageRef = useRef(null);
  const containerRef = useRef(null);
  const [imageLoaded, setImageLoaded] = useState(false);
  const [imageError, setImageError] = useState(false);
  const [processedImageSrc, setProcessedImageSrc] = useState(null);

  // Xử lý imageSrc để đảm bảo format đúng
  useEffect(() => {
    if (!imageSrc) {
      setProcessedImageSrc(null);
      return;
    }

    // Debug
    console.log('FaceImageWithLandmarks - imageSrc type:', typeof imageSrc);
    console.log('FaceImageWithLandmarks - imageSrc length:', imageSrc?.length);
    console.log('FaceImageWithLandmarks - imageSrc preview:', imageSrc?.substring(0, 100));

    // Nếu đã là data URL hoặc URL hợp lệ, dùng trực tiếp
    if (typeof imageSrc === 'string') {
      if (imageSrc.startsWith('data:image/')) {
        // Đã có prefix data:image/, dùng trực tiếp
        console.log('Using imageSrc as-is (has data: prefix)');
        setProcessedImageSrc(imageSrc);
      } else if (imageSrc.startsWith('http://') || imageSrc.startsWith('https://')) {
        // Là URL, dùng trực tiếp
        console.log('Using imageSrc as-is (is URL)');
        setProcessedImageSrc(imageSrc);
      } else {
        // Có thể là base64 string không có prefix
        // Kiểm tra xem có phải base64 không (chỉ chứa ký tự base64)
        const base64Regex = /^[A-Za-z0-9+/=]+$/;
        const first100 = imageSrc.substring(0, 100).replace(/\s/g, ''); // Remove whitespace
        
        if (imageSrc.length > 100 && base64Regex.test(first100)) {
          // Có vẻ là base64, thêm prefix
          // Thử detect format từ một vài ký tự đầu
          let mimeType = 'image/jpeg'; // Default
          const trimmed = imageSrc.trim();
          if (trimmed.startsWith('/9j/') || trimmed.startsWith('iVBORw0KGgo')) {
            // JPEG hoặc PNG
            mimeType = trimmed.startsWith('/9j/') ? 'image/jpeg' : 'image/png';
          }
          const processed = `data:${mimeType};base64,${trimmed}`;
          console.log('Added data: prefix to base64 string');
          setProcessedImageSrc(processed);
        } else {
          // Không phải base64, dùng trực tiếp (có thể là URL tương đối)
          console.log('Using imageSrc as-is (not base64)');
          setProcessedImageSrc(imageSrc);
        }
      }
    } else {
      setProcessedImageSrc(imageSrc);
    }
  }, [imageSrc]);

  useEffect(() => {
    if (!processedImageSrc || !imageLoaded) return;

    const canvas = canvasRef.current;
    const image = imageRef.current;

    if (!canvas || !image) return;

    // Đợi một chút để đảm bảo ảnh đã render xong
    const timeoutId = setTimeout(() => {
      try {
        const ctx = canvas.getContext('2d');
        if (!ctx) return;
        
        // Lấy kích thước thực của ảnh
        const naturalWidth = image.naturalWidth || image.width;
        const naturalHeight = image.naturalHeight || image.height;
        
        if (naturalWidth === 0 || naturalHeight === 0) {
          // Ảnh chưa load xong, bỏ qua
          return;
        }
        
        // Lấy kích thước hiển thị của ảnh
        const displayWidth = image.offsetWidth || image.clientWidth;
        const displayHeight = image.offsetHeight || image.clientHeight;
        
        if (displayWidth === 0 || displayHeight === 0) {
          // Ảnh chưa có kích thước hiển thị, bỏ qua
          return;
        }
        
        // Set canvas size to match displayed image size
        canvas.width = displayWidth;
        canvas.height = displayHeight;
        
        // Tính tỷ lệ scale
        const scaleX = displayWidth / naturalWidth;
        const scaleY = displayHeight / naturalHeight;

        // Clear canvas
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        
        // Nếu không có landmarks, chỉ cần clear canvas và return
        if (!landmarks) {
          return;
        }

        // Vẽ các điểm landmarks
        if (landmarks && typeof landmarks === 'object') {
          // Hàm chuyển đổi point thành tọa độ [x, y]
          const getPointCoords = (point) => {
            if (Array.isArray(point) && point.length >= 2) {
              return [point[0] * scaleX, point[1] * scaleY];
            } else if (point && typeof point === 'object') {
              const originalX = point.x !== undefined ? point.x : (Array.isArray(point) ? point[0] : 0);
              const originalY = point.y !== undefined ? point.y : (Array.isArray(point) ? point[1] : 0);
              return [originalX * scaleX, originalY * scaleY];
            }
            return null;
          };

          // Vẽ các điểm landmarks với scale và nối chúng lại
          const drawLandmarks = (points, color = '#FFD700', radius = 1) => {
            const validPoints = [];
            
            if (Array.isArray(points)) {
              // Thu thập tất cả các điểm hợp lệ
              points.forEach((point) => {
                const coords = getPointCoords(point);
                if (coords && coords[0] > 0 && coords[1] > 0 && coords[0] < displayWidth && coords[1] < displayHeight) {
                  validPoints.push(coords);
                }
              });
            } else if (typeof points === 'object') {
              // Nếu là object, lấy tất cả các điểm
              Object.values(points).forEach((point) => {
                if (Array.isArray(point)) {
                  // Nếu là mảng các điểm, xử lý từng điểm
                  point.forEach((p) => {
                    const coords = getPointCoords(p);
                    if (coords && coords[0] > 0 && coords[1] > 0 && coords[0] < displayWidth && coords[1] < displayHeight) {
                      validPoints.push(coords);
                    }
                  });
                } else {
                  const coords = getPointCoords(point);
                  if (coords && coords[0] > 0 && coords[1] > 0 && coords[0] < displayWidth && coords[1] < displayHeight) {
                    validPoints.push(coords);
                  }
                }
              });
            }

            // Vẽ các điểm
            validPoints.forEach(([x, y]) => {
              ctx.beginPath();
              ctx.arc(x, y, radius, 0, 2 * Math.PI);
              ctx.fillStyle = color;
              ctx.fill();
              ctx.strokeStyle = '#FFA500';
              ctx.lineWidth = 3;
              ctx.stroke();
            });

            // Nối các điểm lại với nhau
            if (validPoints.length > 1) {
              ctx.beginPath();
              ctx.moveTo(validPoints[0][0], validPoints[0][1]);
              for (let i = 1; i < validPoints.length; i++) {
                ctx.lineTo(validPoints[i][0], validPoints[i][1]);
              }
              // Đóng đường nối nếu có nhiều hơn 2 điểm
              if (validPoints.length > 2) {
                ctx.closePath();
              }
              ctx.strokeStyle = color;
              ctx.lineWidth = 1;
              ctx.globalAlpha = 0.6;
              ctx.stroke();
              ctx.globalAlpha = 1.0;
            }
          };

          // Vẽ landmarks với các màu khác nhau cho các nhóm khác nhau
          const landmarkColors = {
            left_eye: '#00FF00',
            right_eye: '#00FF00',
            nose: '#FF00FF',
            mouth: '#00FFFF',
            left_eyebrow: '#FFFF00',
            right_eyebrow: '#FFFF00',
            jawline: '#FF0000',
            chin: '#FF0000',
          };

          // Thử vẽ landmarks theo nhiều cấu trúc khác nhau
          if (Array.isArray(landmarks)) {
            drawLandmarks(landmarks, '#FFD700', 1.5);
          } else {
            // Nếu là object, vẽ từng nhóm
            Object.keys(landmarks).forEach((key) => {
              const color = landmarkColors[key] || '#FFD700';
              drawLandmarks(landmarks[key], color, 1.5);
            });
          }

          // Vẽ các đường nối quan trọng (nếu có)
          // Ví dụ: nối các điểm mắt, mũi, miệng
          if (landmarks.left_eye && landmarks.right_eye) {
            const leftEye = Array.isArray(landmarks.left_eye) ? landmarks.left_eye[0] : landmarks.left_eye;
            const rightEye = Array.isArray(landmarks.right_eye) ? landmarks.right_eye[0] : landmarks.right_eye;
            
            if (leftEye && rightEye) {
              const leftX = (leftEye.x !== undefined ? leftEye.x : (Array.isArray(leftEye) ? leftEye[0] : 0)) * scaleX;
              const leftY = (leftEye.y !== undefined ? leftEye.y : (Array.isArray(leftEye) ? leftEye[1] : 0)) * scaleY;
              const rightX = (rightEye.x !== undefined ? rightEye.x : (Array.isArray(rightEye) ? rightEye[0] : 0)) * scaleX;
              const rightY = (rightEye.y !== undefined ? rightEye.y : (Array.isArray(rightEye) ? rightEye[1] : 0)) * scaleY;
              
              if (leftX > 0 && leftY > 0 && rightX > 0 && rightY > 0) {
                ctx.beginPath();
                ctx.moveTo(leftX, leftY);
                ctx.lineTo(rightX, rightY);
                ctx.strokeStyle = '#FFD700';
                ctx.lineWidth = 1;
                ctx.stroke();
              }
            }
          }
        }
      } catch (error) {
        console.error('Error drawing landmarks:', error);
      }
    }, 100);

    return () => clearTimeout(timeoutId);
  }, [processedImageSrc, landmarks, imageLoaded]);

  // Handle window resize để vẽ lại landmarks
  useEffect(() => {
    const handleResize = () => {
      if (imageLoaded) {
        // Trigger re-render bằng cách set lại imageLoaded
        setImageLoaded(false);
        setTimeout(() => setImageLoaded(true), 100);
      }
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, [imageLoaded]);

  const handleImageLoad = () => {
    const image = imageRef.current;
    if (image) {
      setImageError(false);
      // Đảm bảo ảnh đã có kích thước trước khi set loaded
      if (image.naturalWidth > 0 && image.naturalHeight > 0) {
        setImageLoaded(true);
      } else {
        // Nếu chưa có kích thước, thử lại sau một chút
        setTimeout(() => {
          if (image.naturalWidth > 0 && image.naturalHeight > 0) {
            setImageLoaded(true);
          }
        }, 100);
      }
    }
  };

  const handleImageError = () => {
    console.error('Error loading image:', processedImageSrc?.substring(0, 50));
    setImageError(true);
    setImageLoaded(false);
  };

  if (!processedImageSrc) {
    return (
      <div className="w-full aspect-square rounded-lg border-2 border-yellow-500/40 flex items-center justify-center bg-red-950/30">
        <p className="text-yellow-100/70 text-sm">Không có ảnh để hiển thị</p>
      </div>
    );
  }

  if (imageError) {
    return (
      <div className="w-full aspect-square rounded-lg border-2 border-red-500/40 flex items-center justify-center bg-red-950/30">
        <div className="text-center">
          <p className="text-red-200 text-sm mb-2">Lỗi khi tải ảnh</p>
          <p className="text-yellow-100/70 text-xs">Vui lòng kiểm tra lại định dạng ảnh</p>
        </div>
      </div>
    );
  }

  return (
    <div ref={containerRef} className="relative w-full">
      <div className="relative inline-block w-full" style={{ maxWidth: '100%' }}>
        <img
          ref={imageRef}
          src={processedImageSrc}
          alt="Phân tích khuôn mặt"
          onLoad={handleImageLoad}
          onError={handleImageError}
          className="w-full h-auto rounded-lg border-2 border-yellow-500/40 shadow-lg"
          style={{ display: 'block', maxWidth: '100%', height: 'auto' }}
        />
        <canvas
          ref={canvasRef}
          className="absolute top-0 left-0 pointer-events-none"
          style={{
            width: '100%',
            height: '100%',
            top: 0,
            left: 0,
            imageRendering: 'auto'
          }}
        />
      </div>
    </div>
  );
};

export default FaceImageWithLandmarks;

