import React, { useRef, useEffect, useState, useCallback } from 'react';
import './TarotCardSpread.css';

const TarotCardSpread = ({ 
  cards = [], 
  cardCount = 22,
  cardBackImage = "https://tarotoo.com/wp-content/themes/tarotootheme/assets/card-back/card-back-usual.jpg.webp"
}) => {
  const containerRef = useRef(null);
  const rotateContainerRef = useRef(null);
  const animationFrameRef = useRef(null);
  
  // State cho animation
  const [isAnimating, setIsAnimating] = useState(false);
  const [animationProgress, setAnimationProgress] = useState(0); // 0 = stacked, 1 = spread
  const [selectedCards, setSelectedCards] = useState([]); // Mảng các card đã được chọn (tối đa 2)
  const [cardOffsets, setCardOffsets] = useState({}); // Offset của từng card khi được click
  const [phase, setPhase] = useState('spreading'); // 'spreading', 'selecting', 'moving-to-position'
  const [moveToPositionProgress, setMoveToPositionProgress] = useState(0); // Progress cho animation di chuyển đến vị trí
  const [cardTargetPositions, setCardTargetPositions] = useState({}); // Vị trí đích của từng card
  const [highestZIndexCardPosition, setHighestZIndexCardPosition] = useState(null); // Vị trí của lá bài có z-index cao nhất
  const [moveToHighestProgress, setMoveToHighestProgress] = useState(0); // Progress cho animation di chuyển về lá bài cao nhất

  const cardRefs = useRef({});
  const animationProgressRef = useRef(0);
  const cardProgressRefs = useRef({}); // Progress riêng cho từng card (staggered)

  // Tính toán các tham số
  // Bỏ lá bài ở giữa nếu số lượng lẻ, hoặc chỉ lấy số chẵn
  let cardCountToUse = cards.length > 0 ? Math.min(cards.length, cardCount) : cardCount;
  // Nếu số lẻ, bỏ 1 card ở giữa
  if (cardCountToUse % 2 === 1) {
    cardCountToUse = cardCountToUse - 1;
  }
  
  // Lấy cards và bỏ card ở giữa
  const allCards = cards.slice(0, cardCount);
  const middleIndex = Math.floor(allCards.length / 2);
  const displayCards = allCards.filter((_, index) => index !== middleIndex).slice(0, cardCountToUse);
  
  // Tham số cánh quạt
  const FAN_ANGLE = 70; // Góc cánh quạt (độ) - đối xứng (giảm để các lá bài xếp sát nhau hơn)
  const FAN_RADIUS = 780; // Bán kính cánh quạt (px)
  const STACK_X = 50; // Vị trí X ban đầu (bên trái màn hình)
  const STACK_Y = 0; // Vị trí Y ban đầu (sẽ được tính động)
  
  // Sử dụng state để tính toán tâm cánh quạt động
  const [spreadCenter, setSpreadCenter] = useState({ x: 0, y: 0 });
  
  useEffect(() => {
    // Tính toán tâm cánh quạt dựa trên kích thước container
    // Đặt tâm để cánh quạt trải từ trái sang phải
    const updateSpreadCenter = () => {
      if (containerRef.current) {
        // Sử dụng window.innerWidth/innerHeight để lấy kích thước viewport thực tế
        const screenWidth = typeof window !== 'undefined' ? window.innerWidth : 1920;
        const screenHeight = typeof window !== 'undefined' ? window.innerHeight : 1080;
        
        // Lấy rect của container để tính toán vị trí tương đối (nếu cần)
        const rect = containerRef.current.getBoundingClientRect();
        
        // Tính toán để bộ bài cách đáy màn hình một khoảng cố định
        const BOTTOM_MARGIN = 80;
        const CARD_REACH = 900;
        
        // Tính chiều ngang của bộ bài (từ lá đầu đến lá cuối)
        const firstCardAngle = -FAN_ANGLE / 2;
        const lastCardAngle = FAN_ANGLE / 2;
        const firstCardFinalAngle = (firstCardAngle + 90) * Math.PI / 180;
        const lastCardFinalAngle = (lastCardAngle + 90) * Math.PI / 180;
        
        const firstCardX = Math.cos(firstCardFinalAngle) * FAN_RADIUS;
        const lastCardX = Math.cos(lastCardFinalAngle) * FAN_RADIUS;
        const FAN_SPREAD_WIDTH = Math.abs(firstCardX - lastCardX);
        
        const CENTER_OFFSET = 90; //Giá trị 65 là chính giữa màn hình
        
        setSpreadCenter({
          // Sử dụng screenWidth thay vì rect.width để đảm bảo tính chính xác
          x: screenWidth / 2 - CENTER_OFFSET,
          // Sử dụng screenHeight thay vì rect.height
          y: screenHeight - BOTTOM_MARGIN - CARD_REACH - 200
        });
      }
    };    
    // Delay nhỏ để đảm bảo DOM đã render
    const timeoutId = setTimeout(updateSpreadCenter, 100);
    window.addEventListener('resize', updateSpreadCenter);
    
    return () => {
      clearTimeout(timeoutId);
      window.removeEventListener('resize', updateSpreadCenter);
    };
  }, []);

  // Hàm lerp (linear interpolation)
  const lerp = useCallback((current, target, speed) => {
    return (target - current) * speed;
  }, []);

  // Tính toán vị trí card trong cánh quạt
  const getCardFanPosition = useCallback((index, totalCards, progress) => {
    // Tính góc của card trong cánh quạt - đối xứng, hướng lên trên
    // Góc từ -FAN_ANGLE/2 đến +FAN_ANGLE/2 (ví dụ: -62.5 đến +62.5 độ)
    // Đảm bảo đối xứng hoàn toàn: card đầu = -62.5°, card cuối = +62.5°
    const angleStep = FAN_ANGLE / (totalCards - 1);
    let baseAngle = (index * angleStep) - (FAN_ANGLE / 2); // Bắt đầu từ -FAN_ANGLE/2
    
    // Điều chỉnh vị trí dừng của card đầu tiên để cân đối
    if (index === 0) {
      // Điều chỉnh baseAngle của card đầu để vị trí dừng cân đối hơn
      // Có thể điều chỉnh nhẹ để card đầu không quá lệch
      baseAngle = baseAngle + 0; // Có thể điều chỉnh nếu cần
    }
    
    const adjustedAngle = baseAngle;
    
    // Chuyển đổi để hướng lên trên: 
    // - Trong hệ tọa độ Math: 0° = phải, 90° = lên, -90° = xuống
    // - Để cánh quạt hướng lên: cộng 90 độ vào góc
    // - Góc 0° trong cánh quạt = hướng thẳng lên trên
    const finalAngleRad = ((adjustedAngle + 90) * Math.PI) / 180;

    // ===== ĐIỂM BẮT ĐẦU HIỆU ỨNG (Khi các lá bài xếp chồng) =====
    // Vị trí ban đầu (xếp chồng) - bên trái màn hình
    // Mỗi card có offset nhỏ để tạo hiệu ứng xếp chồng
    const stackOffset = index / 2; // Offset nhỏ cho mỗi card khi xếp chồng
    
    // X: Tính dựa trên spreadCenter.x để đảm bảo luôn ở bên trái của tâm
    // Đặt ở bên trái của tâm một khoảng đủ lớn để luôn ở bên trái màn hình
    // Nếu spreadCenter.x chưa được tính (bằng 0), sử dụng giá trị fallback
    const START_X_OFFSET_FROM_CENTER = 1500; // Khoảng cách từ tâm sang trái (px)
    const centerX = spreadCenter.x > 0 ? spreadCenter.x : window.innerWidth / 2;
    const startX = centerX - START_X_OFFSET_FROM_CENTER + stackOffset;
    
    // Đảm bảo startX luôn ở bên trái màn hình (ít nhất 50px từ lề trái)
    // Nếu tính toán ra giá trị dương nhỏ (gần lề trái), đặt về 50px
    const MIN_START_X = 50;
    const finalStartX = Math.max(MIN_START_X, startX);
    
    // Y: Vị trí cố định cao hơn, không phụ thuộc vào spreadCenter.y
    // Đặt ở 20% từ đầu trang để cao hơn điểm kết thúc
    const START_Y_PERCENT = 0; // 20% từ đầu trang
    const startY = (window.innerHeight * START_Y_PERCENT - 200) + stackOffset;
    const startRotation = 90; // Xoay ngang

    // Vị trí cuối (cánh quạt) - hướng lên trên
    // Vì tâm ở giữa màn hình, các card sẽ xòe ra xung quanh tâm này
    // Điều chỉnh vị trí cuối của card đầu để cân đối (theo log: adjustedAngle = -56.88)
    let endX = spreadCenter.x + Math.cos(finalAngleRad) * FAN_RADIUS;
    let endY = spreadCenter.y + Math.sin(finalAngleRad) * FAN_RADIUS;
    
    // Điều chỉnh vị trí dừng của card đầu tiên để cân đối
    if (index === 0) {
      // Điều chỉnh nhẹ vị trí X để card đầu không quá lệch về bên trái
      endX = endX +100; // Dịch sang phải một chút để cân đối
      endY = endY + 30; // Điều chỉnh Y để cân đối
    }
    
    // Rotation: adjustedAngle (góc của card trong cánh quạt, đã đối xứng)
    const endRotation = adjustedAngle;

    // Tính toán quỹ đạo vòng cung tròn
    // Thay vì di chuyển thẳng, card sẽ di chuyển theo đường tròn từ vị trí ban đầu đến vị trí cuối
    
    // Tính góc từ tâm đến vị trí ban đầu (sử dụng finalStartX và centerX đã tính ở trên)
    const startAngle = Math.atan2(startY - spreadCenter.y, finalStartX - centerX);
    // Góc từ tâm đến vị trí cuối (đã tính ở trên)
    const endAngle = finalAngleRad;
    
    // Tính bán kính ban đầu từ tâm đến vị trí xếp chồng (sử dụng finalStartX)
    const startRadius = Math.sqrt(
      Math.pow(finalStartX - centerX, 2) + Math.pow(startY - spreadCenter.y, 2)
    );
    // Bán kính cuối
    const endRadius = FAN_RADIUS;
    
    // Interpolate góc theo quỹ đạo tròn (smooth interpolation)
    // Sử dụng ease-in-out để tạo chuyển động mượt
    const easeProgress = progress < 0.5 
      ? 2 * progress * progress 
      : 1 - Math.pow(-2 * progress + 2, 2) / 2;
    
    const currentAngle = startAngle + (endAngle - startAngle) * easeProgress;
    const currentRadius = startRadius + (endRadius - startRadius) * easeProgress;
    
    // Vị trí hiện tại trên quỹ đạo tròn
    const x = spreadCenter.x + Math.cos(currentAngle) * currentRadius;
    const y = spreadCenter.y + Math.sin(currentAngle) * currentRadius;
    const rotation = startRotation + (endRotation - startRotation) * progress;

    return { x, y, rotation };
  }, [spreadCenter]);

  // Animation loop - xòe bài với staggered animation
  useEffect(() => {
    if (!isAnimating) return;

    const animate = () => {
      const STAGGER_DELAY = 0.05; // Delay giữa mỗi card (0.05 = 5% progress)
      const ANIMATION_SPEED = 0.03; // Tốc độ animation (chậm hơn: 0.02 thay vì 0.05)

      // Cập nhật animation progress cho từng card riêng biệt (staggered)
      displayCards.forEach((card, index) => {
        const cardKey = card.id || index;
        
        // Khởi tạo progress cho card nếu chưa có
        if (cardProgressRefs.current[cardKey] === undefined) {
          cardProgressRefs.current[cardKey] = 0;
        }

        // Tính delay cho card này (card đầu tiên delay 0, card tiếp theo delay thêm STAGGER_DELAY)
        const cardDelay = index * STAGGER_DELAY;
        const targetProgress = animationProgressRef.current > cardDelay 
          ? Math.min(1, (animationProgressRef.current - cardDelay) / (1 - cardDelay))
          : 0;

        // Cập nhật progress cho card này
        if (cardProgressRefs.current[cardKey] < targetProgress) {
          cardProgressRefs.current[cardKey] = cardProgressRefs.current[cardKey] + lerp(
            cardProgressRefs.current[cardKey],
            targetProgress,
            ANIMATION_SPEED
          );
          
          if (cardProgressRefs.current[cardKey] > 1) {
            cardProgressRefs.current[cardKey] = 1;
          }
        }

        // Cập nhật transform cho card này
        const cardProgress = cardProgressRefs.current[cardKey];
        const position = getCardFanPosition(index, cardCountToUse, cardProgress);
        
        // Tính toán offset khi card được click (tiến theo chiều ngược lại của lá bài)
        const PUSH_DISTANCE = 50; // Khoảng cách tiến ra (px)
        const cardOffset = cardOffsets[index] || 0;
        
        // Tính hướng tiến dựa trên góc rotation hiện tại của lá bài
        // Góc rotation là góc nghiêng của card trong cánh quạt
        // Vector hướng tiến: ngược lại với chiều nghiêng của card (hướng xuống dưới và vào trong)
        const rotationRad = (position.rotation * Math.PI) / 180;
        // Vector hướng ngược lại: -sin(angle) cho X (vào trong), cos(angle) cho Y (xuống dưới)
        // Đảo ngược vector để card tiến theo chiều ngược lại
        let offsetX = -Math.sin(rotationRad) * cardOffset * PUSH_DISTANCE;
        let offsetY = Math.cos(rotationRad) * cardOffset * PUSH_DISTANCE;
        let finalRotation = position.rotation;
        
        // Nếu đang ở phase 'moving-to-position'
        const isSelected = selectedCards.includes(index);
        if (phase === 'moving-to-position') {
          if (isSelected) {
            // Lấy vị trí đích đã được tính toán trước đó (trong handleCardClick)
            const targetPos = cardTargetPositions[index];
            if (targetPos) {
              // Tính vị trí hiện tại bao gồm cả offset khi click
              const currentOffsetX = cardOffset ? -Math.sin(rotationRad) * PUSH_DISTANCE : 0;
              const currentOffsetY = cardOffset ? Math.cos(rotationRad) * PUSH_DISTANCE : 0;
              const currentX = position.x + currentOffsetX;
              const currentY = position.y + currentOffsetY;
              
              // Interpolate từ vị trí hiện tại (bao gồm offset) đến vị trí đích
              const easeProgress = moveToPositionProgress < 0.5 
                ? 2 * moveToPositionProgress * moveToPositionProgress 
                : 1 - Math.pow(-2 * moveToPositionProgress + 2, 2) / 2;
              
              offsetX = (targetPos.x - currentX) * easeProgress;
              offsetY = (targetPos.y - currentY) * easeProgress;
              
              // Xoay thẳng (rotation = 0)
              finalRotation = position.rotation * (1 - easeProgress);
            }
          } else if (highestZIndexCardPosition) {
            // Các lá bài không được chọn di chuyển về vị trí lá bài có z-index cao nhất
            // Tính vị trí hiện tại
            const currentX = position.x;
            const currentY = position.y;
            const targetX = highestZIndexCardPosition.x;
            const targetY = highestZIndexCardPosition.y;
            
            // Di chuyển theo vòng cung: tính góc và bán kính từ spreadCenter
            const currentAngle = Math.atan2(currentY - spreadCenter.y, currentX - spreadCenter.x);
            const targetAngle = Math.atan2(targetY - spreadCenter.y, targetX - spreadCenter.x);
            const currentRadius = Math.sqrt(
              Math.pow(currentX - spreadCenter.x, 2) + Math.pow(currentY - spreadCenter.y, 2)
            );
            const targetRadius = Math.sqrt(
              Math.pow(targetX - spreadCenter.x, 2) + Math.pow(targetY - spreadCenter.y, 2)
            );
            
            // Interpolate theo vòng cung với ease-in-out
            const easeProgress = moveToHighestProgress < 0.5 
              ? 2 * moveToHighestProgress * moveToHighestProgress 
              : 1 - Math.pow(-2 * moveToHighestProgress + 2, 2) / 2;
            
            const interpolatedAngle = currentAngle + (targetAngle - currentAngle) * easeProgress;
            const interpolatedRadius = currentRadius + (targetRadius - currentRadius) * easeProgress;
            
            const newX = spreadCenter.x + Math.cos(interpolatedAngle) * interpolatedRadius;
            const newY = spreadCenter.y + Math.sin(interpolatedAngle) * interpolatedRadius;
            
            offsetX = newX - currentX;
            offsetY = newY - currentY;
            
            // Xoay về góc của lá bài cao nhất
            const targetRotation = highestZIndexCardPosition.rotation;
            finalRotation = position.rotation + (targetRotation - position.rotation) * easeProgress;
          }
        }
        
        const cardElement = cardRefs.current[cardKey];
        if (cardElement) {
          cardElement.style.transform = `translate(${position.x + offsetX}px, ${position.y + offsetY}px) rotate(${finalRotation}deg)`;
          
          // Xử lý opacity
          if (phase === 'moving-to-position' && !isSelected && highestZIndexCardPosition) {
            // Fade out khi gần đến vị trí lá bài cao nhất
            const fadeStart = 0.7; // Bắt đầu fade từ 70% progress
            if (moveToHighestProgress > fadeStart) {
              const fadeProgress = (moveToHighestProgress - fadeStart) / (1 - fadeStart);
              cardElement.style.opacity = 1 - fadeProgress;
            } else {
              cardElement.style.opacity = 1;
            }
          } else {
            // Luôn hiển thị với opacity = 1 cho các trường hợp khác
            cardElement.style.opacity = 1;
          }
        }
      });

      // Cập nhật global progress
      if (animationProgressRef.current < 1) {
        animationProgressRef.current = animationProgressRef.current + lerp(
          animationProgressRef.current,
          1,
          ANIMATION_SPEED
        );
        
        if (animationProgressRef.current > 1) {
          animationProgressRef.current = 1;
        }
      }
      
      setAnimationProgress(animationProgressRef.current);
      
      // Xử lý animation cho phase 'moving-to-position'
      if (phase === 'moving-to-position') {
        if (moveToPositionProgress < 1) {
          setMoveToPositionProgress(prev => Math.min(1, prev + 0.015)); // Tăng progress cho 2 lá bài được chọn
        }
        if (moveToHighestProgress < 1) {
          setMoveToHighestProgress(prev => Math.min(1, prev + 0.02)); // Tăng progress cho các lá bài khác
        }
      }

      animationFrameRef.current = requestAnimationFrame(animate);
    };

    animationFrameRef.current = requestAnimationFrame(animate);

    return () => {
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }
    };
  }, [isAnimating, displayCards, cardCountToUse, getCardFanPosition, lerp, cardOffsets, selectedCards, phase]);

  // Bắt đầu animation khi component mount
  useEffect(() => {
    if (displayCards.length === 0) return;
    
    // Bắt đầu animation sau một chút delay
    const timeoutId = setTimeout(() => {
      setIsAnimating(true);
    }, 300);

    return () => clearTimeout(timeoutId);
  }, [displayCards.length]);

  // Xử lý click vào card để nhô ra
  const handleCardClick = useCallback((index, e) => {
    e.stopPropagation(); // Ngăn event bubble
    
    // Chỉ cho phép chọn khi đang ở phase 'spreading' hoặc 'selecting'
    if (phase !== 'spreading' && phase !== 'selecting') {
      return;
    }
    
    // Nếu card này đã được chọn, bỏ chọn
    if (selectedCards.includes(index)) {
      setSelectedCards(prev => prev.filter(i => i !== index));
      setCardOffsets(prev => ({ ...prev, [index]: 0 }));
      setPhase('spreading');
    } else {
      // Thêm card vào danh sách đã chọn (tối đa 2)
      if (selectedCards.length < 2) {
        const newSelectedCards = [...selectedCards, index];
        setSelectedCards(newSelectedCards);
        setCardOffsets(prev => ({ ...prev, [index]: 1 }));
        setPhase('selecting');
        
        // Khi đã chọn đủ 2 lá, bắt đầu di chuyển đến vị trí
        if (newSelectedCards.length === 2) {
          // Đợi animation click xong (khoảng 300ms)
          setTimeout(() => {
            // Tính toán vị trí đích cho cả 2 lá bài
            // Sử dụng spreadCenter làm điểm mốc để căn vị trí 2 lá bài
            const screenWidth = typeof window !== 'undefined' ? window.innerWidth : 1920;
            const screenHeight = typeof window !== 'undefined' ? window.innerHeight : 1080;
            const offsetFromCenter = screenWidth / 8; // 1/6 chiều rộng màn hình
            
            // Tính chiều cao cạnh mép trên của dãy bài (card cao nhất)
            const CARD_HEIGHT = 227; // Desktop - có thể responsive
            let maxTopEdgeHeight = Infinity; // Giá trị nhỏ nhất = cao nhất trên màn hình
            
            // Duyệt qua tất cả các card không được chọn để tìm card cao nhất
            for (let i = 0; i < cardCountToUse; i++) {
              if (!newSelectedCards.includes(i)) {
                const cardProgress = cardProgressRefs.current[i] !== undefined ? cardProgressRefs.current[i] : 1;
                const cardPosition = getCardFanPosition(i, cardCountToUse, cardProgress);
                const cardRotationRad = (cardPosition.rotation * Math.PI) / 180;
                const topEdgeOffsetY = -Math.cos(cardRotationRad) * (CARD_HEIGHT / 2);
                const topEdgeHeight = cardPosition.y + topEdgeOffsetY;
                
                if (topEdgeHeight < maxTopEdgeHeight) {
                  maxTopEdgeHeight = topEdgeHeight;
                }
              }
            }
            
            // Nếu không có card nào không được chọn, sử dụng giá trị mặc định
            if (maxTopEdgeHeight === Infinity) {
              maxTopEdgeHeight = spreadCenter.y - FAN_RADIUS;
              console.log("hehehehehehehehe")
            }
            
            // Tính targetY: chính giữa màn hình + 30px, nhưng phải cách dãy bài ít nhất 20px
            const centerY = screenHeight / 2;
            const preferredY = centerY - 300;
            const minY = 0; // Cách dãy bài ít nhất 20px
            const targetY = Math.max(preferredY, minY);
            
            // 2 vị trí đích: trái và phải của tâm xòe quạt (spreadCenter)
            const leftTargetX = spreadCenter.x + 35 - offsetFromCenter;
            const rightTargetX = spreadCenter.x + 35 + offsetFromCenter;
            
            // Tính vị trí hiện tại của 2 lá bài
            const card1Index = newSelectedCards[0];
            const card2Index = newSelectedCards[1];
            const card1Progress = cardProgressRefs.current[card1Index] !== undefined ? cardProgressRefs.current[card1Index] : 1;
            const card2Progress = cardProgressRefs.current[card2Index] !== undefined ? cardProgressRefs.current[card2Index] : 1;
            const card1Position = getCardFanPosition(card1Index, cardCountToUse, card1Progress);
            const card2Position = getCardFanPosition(card2Index, cardCountToUse, card2Progress);
            
            const card1Offset = cardOffsets[card1Index] || 0;
            const card2Offset = cardOffsets[card2Index] || 0;
            const PUSH_DISTANCE = 50;
            const card1RotationRad = (card1Position.rotation * Math.PI) / 180;
            const card2RotationRad = (card2Position.rotation * Math.PI) / 180;
            const card1OffsetX = -Math.sin(card1RotationRad) * card1Offset * PUSH_DISTANCE;
            const card2OffsetX = -Math.sin(card2RotationRad) * card2Offset * PUSH_DISTANCE;
            
            const card1CurrentX = card1Position.x + card1OffsetX;
            const card2CurrentX = card2Position.x + card2OffsetX;
            
            // Tính khoảng cách của cả 2 lá bài đến 2 vị trí đích
            const card1ToLeft = Math.abs(card1CurrentX - leftTargetX);
            const card1ToRight = Math.abs(card1CurrentX - rightTargetX);
            const card2ToLeft = Math.abs(card2CurrentX - leftTargetX);
            const card2ToRight = Math.abs(card2CurrentX - rightTargetX);
            
            // Phân bổ vị trí: tối ưu tổng khoảng cách
            let card1TargetX, card2TargetX;
            if (card1ToLeft + card2ToRight < card1ToRight + card2ToLeft) {
              // Card 1 đến trái, Card 2 đến phải
              card1TargetX = leftTargetX;
              card2TargetX = rightTargetX;
            } else {
              // Card 1 đến phải, Card 2 đến trái
              card1TargetX = rightTargetX;
              card2TargetX = leftTargetX;
            }
            
            setCardTargetPositions({
              [card1Index]: { x: card1TargetX, y: targetY },
              [card2Index]: { x: card2TargetX, y: targetY }
            });
            
            // Tìm lá bài có z-index cao nhất (index nhỏ nhất) trong các lá bài không được chọn
            let highestZIndexCardIndex = -1;
            for (let i = 0; i < cardCountToUse; i++) {
              if (!newSelectedCards.includes(i)) {
                if (highestZIndexCardIndex === -1 || i < highestZIndexCardIndex) {
                  highestZIndexCardIndex = i;
                }
              }
            }
            
            // Lưu vị trí của lá bài có z-index cao nhất
            if (highestZIndexCardIndex !== -1) {
              const highestCardProgress = cardProgressRefs.current[highestZIndexCardIndex] !== undefined 
                ? cardProgressRefs.current[highestZIndexCardIndex] 
                : 1;
              const highestCardPosition = getCardFanPosition(highestZIndexCardIndex, cardCountToUse, highestCardProgress);
              setHighestZIndexCardPosition(highestCardPosition);
            }
            
            setPhase('moving-to-position');
            setMoveToPositionProgress(0); // Reset progress
            setMoveToHighestProgress(0); // Reset progress cho animation di chuyển về lá bài cao nhất
          }, 300);
        }
      }
    }
  }, [selectedCards, phase, cardCountToUse, getCardFanPosition, cardOffsets]);


  if (displayCards.length === 0) {
    return (
      <div className="tarot-card-spread-container">
        <div className="tarot-card-spread-card-placeholder" style={{ width: '100%', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <p style={{ color: '#d9b193' }}>Không có lá bài để hiển thị</p>
        </div>
      </div>
    );
  }

  return (
    <div className="tarot-card-spread-container">
      <div 
        ref={containerRef}
        className="tarot-card-spread-container-inner"
      >
        <div 
          ref={rotateContainerRef}
          className="tarot-card-spread-rotate-container"
        >
          {displayCards.map((card, index) => {
            const initialPosition = getCardFanPosition(index, cardCountToUse, 0);
            // Z-index: Giữ nguyên thứ tự - card bên trái (index nhỏ) ở trên, card bên phải (index lớn) ở dưới
            // Card đầu tiên (index 0) = z-index cao nhất, card cuối (index cao) = z-index thấp nhất
            // Điều này đảm bảo card bên trái luôn che card bên phải
            const zIndex = cardCountToUse - index; // index 0 = z-index cao nhất, index cuối = z-index 1
            return (
              <div
                key={card.id || index}
                ref={(el) => {
                  if (el) cardRefs.current[card.id || index] = el;
                }}
                className="tarot-card-spread-card"
                style={{
                  transform: `translate(${initialPosition.x}px, ${initialPosition.y}px) rotate(${initialPosition.rotation}deg)`,
                  opacity: 1, // Bỏ hiệu ứng nhấp nháy - hiển thị ngay từ đầu
                  zIndex: zIndex, // Giữ nguyên z-index, không thay đổi khi click
                  cursor: 'pointer', // Hiển thị cursor pointer khi hover
                }}
                onClick={(e) => handleCardClick(index, e)}
              >
                <div className="tarot-card-spread-card-inner">
                  <img 
                    src={cardBackImage} 
                    alt="Tarot card back" 
                    className="tarot-card-spread-card-back"
                  />
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default TarotCardSpread;
