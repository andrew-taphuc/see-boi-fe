import React, { useState, useRef, useEffect } from 'react';

/**
 * Component hiển thị thumbnail với logic tự động điều chỉnh kích thước:
 * - Ảnh ngang: chiều ngang nhỏ hơn để căn giữa đẹp hơn (75%)
 * - Ảnh dọc: cố định chiều cao để tránh ảnh quá to (400px hoặc maxHeight nếu được chỉ định)
 */
const ThumbnailImage = ({ 
  src, 
  alt = '', 
  className = '', 
  containerClassName = '',
  maxHeight = '400px', // Cho phép tùy chỉnh maxHeight cho ảnh dọc
  onError 
}) => {
  const [imageStyle, setImageStyle] = useState({
    maxWidth: '100%',
    height: 'auto',
  });
  const imgRef = useRef(null);
  
  const updateImageStyle = (img) => {
    if (!img || !img.naturalWidth || !img.naturalHeight) return;
    
    const width = img.naturalWidth;
    const height = img.naturalHeight;
    
    // Phát hiện ảnh ngang hay dọc
    if (width > height) {
      // Ảnh ngang: chiều ngang nhỏ hơn để căn giữa đẹp hơn (75%)
      setImageStyle({
        maxWidth: '75%',
        height: 'auto',
      });
    } else {
      // Ảnh dọc: cố định chiều cao để tránh ảnh quá to
      setImageStyle({
        maxHeight: maxHeight,
        width: 'auto',
      });
    }
  };
  
  const handleImageLoad = (e) => {
    updateImageStyle(e.target);
  };
  
  const handleError = (e) => {
    if (onError) {
      onError(e);
    }
  };
  
  // Xử lý trường hợp ảnh đã được cache (onLoad có thể không fire)
  useEffect(() => {
    // Reset style về mặc định khi src thay đổi
    setImageStyle({
      maxWidth: '100%',
      height: 'auto',
    });
    
    // Kiểm tra nếu ảnh đã load sẵn (cached)
    if (imgRef.current && imgRef.current.complete && imgRef.current.naturalWidth > 0) {
      updateImageStyle(imgRef.current);
    }
  }, [src]);
  
  if (!src) return null;
  
  return (
    <div className={containerClassName || 'w-full overflow-hidden flex justify-center'}>
      <img
        ref={imgRef}
        src={src}
        alt={alt}
        className={className || 'h-auto object-cover rounded-xl'}
        style={{
          ...imageStyle,
          display: 'block',
          margin: '0 auto',
        }}
        onLoad={handleImageLoad}
        onError={handleError}
      />
    </div>
  );
};

export default ThumbnailImage;

