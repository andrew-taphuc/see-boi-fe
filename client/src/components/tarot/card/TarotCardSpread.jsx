import React, { useRef, useEffect, useState, useCallback } from 'react';
import './TarotCardSpread.css';
import TarotFlipCard from './TarotFlipCard';
import {
  lerp,
  easeInOut,
  calculateCardOffset,
  getCardFanPosition as getCardFanPositionUtil,
  calculateSelectedCardAnimation,
  calculateUnselectedCardAnimation,
  findMaxTopEdgeHeight,
  findHighestZIndexCardIndex,
  calculateTargetPositions,
  calculateMultipleTargetPositions
} from './tarotCardSpreadUtils';

const TarotCardSpread = ({ 
  cards = [], 
  cardCount = 22,
  cardBackImage = "https://tarotoo.com/wp-content/themes/tarotootheme/assets/card-back/card-back-usual.jpg.webp",
  maxSelectedCards = 2,
  onProgressChange,
  onCardSelected,
  onCardFlipped
}) => {
  const validMaxSelectedCards = [1, 2, 3, 5].includes(maxSelectedCards) ? maxSelectedCards : 2;
  const containerRef = useRef(null);
  const rotateContainerRef = useRef(null);
  const animationFrameRef = useRef(null);
  
  const [isAnimating, setIsAnimating] = useState(false);
  const [animationProgress, setAnimationProgress] = useState(0);
  const [selectedCards, setSelectedCards] = useState([]);
  const [cardOffsets, setCardOffsets] = useState({});
  const [phase, setPhase] = useState('spreading');
  const [moveToPositionProgress, setMoveToPositionProgress] = useState(0);
  const [cardTargetPositions, setCardTargetPositions] = useState({});
  const [highestZIndexCardPosition, setHighestZIndexCardPosition] = useState(null);
  const [moveToHighestProgress, setMoveToHighestProgress] = useState(0);
  const [canFlipCards, setCanFlipCards] = useState(false);
  const [flippedCards, setFlippedCards] = useState(new Set());
  const [hoveredCard, setHoveredCard] = useState(null);
  const [hoverOffsets, setHoverOffsets] = useState({});
  // Tỉ lệ thẻ bài gốc: 300:500 = 0.6
  const CARD_ASPECT_RATIO = 300 / 500;
  const [cardSize, setCardSize] = useState({ width: 130, height: Math.round(130 / CARD_ASPECT_RATIO) });

  const cardRefs = useRef({});
  const animationProgressRef = useRef(0);
  const cardProgressRefs = useRef({});

  let cardCountToUse = cards.length > 0 ? Math.min(cards.length, cardCount) : cardCount;
  if (cardCountToUse % 2 === 1) {
    cardCountToUse = cardCountToUse - 1;
  }
  
  const allCards = cards.slice(0, cardCount);
  const middleIndex = Math.floor(allCards.length / 2);
  const displayCards = allCards.filter((_, index) => index !== middleIndex).slice(0, cardCountToUse);
  
  const FAN_ANGLE = 70;
  const FAN_RADIUS = 780;
  const STACK_X = 50;
  const STACK_Y = 0;
  
  const [spreadCenter, setSpreadCenter] = useState({ x: 0, y: 0 });
  
  useEffect(() => {
    const updateSpreadCenter = () => {
      if (containerRef.current) {
        const screenWidth = typeof window !== 'undefined' ? window.innerWidth : 1920;
        const screenHeight = typeof window !== 'undefined' ? window.innerHeight : 1080;
        
        const rect = containerRef.current.getBoundingClientRect();
        
        const BOTTOM_MARGIN = 80;
        const CARD_REACH = 900;
        
        const firstCardAngle = -FAN_ANGLE / 2;
        const lastCardAngle = FAN_ANGLE / 2;
        const firstCardFinalAngle = (firstCardAngle + 90) * Math.PI / 180;
        const lastCardFinalAngle = (lastCardAngle + 90) * Math.PI / 180;
        
        const firstCardX = Math.cos(firstCardFinalAngle) * FAN_RADIUS;
        const lastCardX = Math.cos(lastCardFinalAngle) * FAN_RADIUS;
        const FAN_SPREAD_WIDTH = Math.abs(firstCardX - lastCardX);
        
        const CENTER_OFFSET = 90;
        
        setSpreadCenter({
          x: screenWidth / 2 - CENTER_OFFSET,
          y: screenHeight - BOTTOM_MARGIN - CARD_REACH - 200
        });
      }
    };
    
    const updateCardSize = () => {
      if (typeof window !== 'undefined') {
        // Tỉ lệ thẻ bài gốc: 300:500 = 0.6
        const CARD_ASPECT_RATIO = 300 / 500; // 0.6
        
        if (window.innerWidth <= 480) {
          const width = 90;
          setCardSize({ width, height: Math.round(width / CARD_ASPECT_RATIO) }); // 150px
        } else if (window.innerWidth <= 768) {
          const width = 110;
          setCardSize({ width, height: Math.round(width / CARD_ASPECT_RATIO) }); // 183px
        } else {
          const width = 130;
          setCardSize({ width, height: Math.round(width / CARD_ASPECT_RATIO) }); // 217px
        }
      }
    };
    
    updateCardSize();
    const timeoutId = setTimeout(updateSpreadCenter, 100);
    
    const handleResize = () => {
      updateSpreadCenter();
      updateCardSize();
    };
    
    window.addEventListener('resize', handleResize);
    
    return () => {
      clearTimeout(timeoutId);
      window.removeEventListener('resize', handleResize);
    };
  }, []);

  const getCardFanPosition = useCallback((index, totalCards, progress) => {
    return getCardFanPositionUtil(index, totalCards, progress, spreadCenter, FAN_ANGLE, FAN_RADIUS);
  }, [spreadCenter]);

  useEffect(() => {
    if (!isAnimating) return;

    const animate = () => {
      const STAGGER_DELAY = 0.05;
      const ANIMATION_SPEED = 0.03;

      displayCards.forEach((card, index) => {
        const cardKey = card.id || index;
        
        if (cardProgressRefs.current[cardKey] === undefined) {
          cardProgressRefs.current[cardKey] = 0;
        }

        const cardDelay = index * STAGGER_DELAY;
        const targetProgress = animationProgressRef.current > cardDelay 
          ? Math.min(1, (animationProgressRef.current - cardDelay) / (1 - cardDelay))
          : 0;

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

        const cardProgress = cardProgressRefs.current[cardKey];
        const position = getCardFanPosition(index, cardCountToUse, cardProgress);
        
        const PUSH_DISTANCE = 50;
        const HOVER_OFFSET_AMOUNT = 0.3; // Nhẹ hơn khi chọn (chọn = 1.0)
        const cardOffset = cardOffsets[index] || 0;
        const hoverOffset = hoverOffsets[index] || 0;
        // Tổng offset = cardOffset (khi chọn) + hoverOffset (khi hover, chỉ khi chưa chọn)
        const totalOffset = cardOffset > 0 ? cardOffset : hoverOffset;
        const rotationRad = (position.rotation * Math.PI) / 180;
        const isSelected = selectedCards.includes(index);
        
        let offsetX, offsetY, finalRotation;
        
        if (phase === 'moving-to-position') {
          if (isSelected) {
            const targetPos = cardTargetPositions[index];
            const result = calculateSelectedCardAnimation(
              position,
              targetPos,
              cardOffset,
              rotationRad,
              PUSH_DISTANCE,
              moveToPositionProgress
            );
            offsetX = result.offsetX;
            offsetY = result.offsetY;
            finalRotation = result.finalRotation;
          } else if (highestZIndexCardPosition) {
            const result = calculateUnselectedCardAnimation(
              position,
              highestZIndexCardPosition,
              spreadCenter,
              moveToHighestProgress
            );
            offsetX = result.offsetX;
            offsetY = result.offsetY;
            finalRotation = result.finalRotation;
          } else {
            const offset = calculateCardOffset(rotationRad, totalOffset, PUSH_DISTANCE);
            offsetX = offset.x;
            offsetY = offset.y;
            finalRotation = position.rotation;
          }
        } else {
          const offset = calculateCardOffset(rotationRad, totalOffset, PUSH_DISTANCE);
          offsetX = offset.x;
          offsetY = offset.y;
          finalRotation = position.rotation;
        }
        
        const cardElement = cardRefs.current[cardKey];
        if (cardElement) {
          // Tăng scale dần từ 1 đến 1.4 khi di chuyển (chỉ khi chọn 1 lá bài)
          let scale = 1;
          if (validMaxSelectedCards === 1 && isSelected && phase === 'moving-to-position') {
            // Scale tăng dần từ 1 đến 1.4 theo moveToPositionProgress
            const scaleProgress = moveToPositionProgress;
            scale = 1 + (scaleProgress * 0.4); // 1 + (progress * 0.4) = từ 1 đến 1.4
          } else if (validMaxSelectedCards === 1 && isSelected && canFlipCards) {
            // Giữ scale 1.4 sau khi đã đến đích
            scale = 1.4;
          }
          
          cardElement.style.transform = `translate(${position.x + offsetX}px, ${position.y + offsetY}px) rotate(${finalRotation}deg) scale(${scale})`;
          cardElement.style.transformOrigin = 'center center';
          
          if (phase === 'moving-to-position' && !isSelected && highestZIndexCardPosition) {
            const fadeStart = 0.7;
            if (moveToHighestProgress > fadeStart) {
              const fadeProgress = (moveToHighestProgress - fadeStart) / (1 - fadeStart);
              cardElement.style.opacity = 1 - fadeProgress;
            } else {
              cardElement.style.opacity = 1;
            }
          } else {
            cardElement.style.opacity = 1;
          }
        }
      });

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
      
      // Gọi callback khi progress thay đổi (chỉ trong phase spreading)
      if (phase === 'spreading' && onProgressChange) {
        onProgressChange(animationProgressRef.current);
      }
      
      if (phase === 'moving-to-position') {
        if (moveToPositionProgress < 1) {
          setMoveToPositionProgress(prev => Math.min(1, prev + 0.015));
        }
        if (moveToHighestProgress < 1) {
          setMoveToHighestProgress(prev => Math.min(1, prev + 0.02));
        }
        
        // Cho phép flip khi animation đã hoàn thành
        if (moveToPositionProgress >= 1 && moveToHighestProgress >= 1 && !canFlipCards) {
          setCanFlipCards(true);
        }
      } else {
        // Không cho phép flip khi đang trong các phase khác
        if (canFlipCards) {
          setCanFlipCards(false);
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
  }, [
    isAnimating, 
    displayCards, 
    cardCountToUse, 
    getCardFanPosition, 
    cardOffsets, 
    hoverOffsets,
    selectedCards, 
    phase,
    cardTargetPositions,
    highestZIndexCardPosition,
    spreadCenter,
    moveToPositionProgress,
    moveToHighestProgress,
    canFlipCards,
    validMaxSelectedCards,
    onProgressChange,
    onCardFlipped
  ]);

  useEffect(() => {
    if (displayCards.length === 0) return;
    
    const timeoutId = setTimeout(() => {
      setIsAnimating(true);
    }, 300);

    return () => clearTimeout(timeoutId);
  }, [displayCards.length]);

  const handleCardHover = useCallback((index) => {
    // Chỉ disable hover khi đã chọn đủ số thẻ tối đa
    // Nếu chưa đủ thì vẫn hover được (trừ thẻ đã chọn)
    const isMaxSelected = selectedCards.length >= validMaxSelectedCards;
    if (phase === 'spreading' && !selectedCards.includes(index) && !isMaxSelected) {
      setHoveredCard(index);
      setHoverOffsets(prev => ({ ...prev, [index]: 0.7 }));
    }
  }, [phase, selectedCards, validMaxSelectedCards]);

  const handleCardLeave = useCallback((index) => {
    setHoveredCard(null);
    setHoverOffsets(prev => {
      const newOffsets = { ...prev };
      delete newOffsets[index];
      return newOffsets;
    });
  }, []);

  const handleCardClick = useCallback((index, e) => {
    e.stopPropagation();
    
    if (phase !== 'spreading' && phase !== 'selecting') {
      return;
    }
    
    // Không cho phép unselect - chỉ cho phép chọn card mới
    if (selectedCards.includes(index)) {
      return;
    }
    
    if (selectedCards.length < validMaxSelectedCards) {
      if (selectedCards.length < validMaxSelectedCards) {
        const newSelectedCards = [...selectedCards, index];
        setSelectedCards(newSelectedCards);
        setCardOffsets(prev => ({ ...prev, [index]: 1 }));
        // Reset hover khi chọn thẻ
        setHoverOffsets(prev => {
          const newOffsets = { ...prev };
          delete newOffsets[index];
          return newOffsets;
        });
        setHoveredCard(null);
        setPhase('selecting');
        
        // Gọi callback khi card được chọn với card name
        if (onCardSelected) {
          const selectedCard = displayCards[index];
          if (selectedCard?.card_name) {
            onCardSelected(selectedCard.card_name);
          }
        }
        
        if (newSelectedCards.length === validMaxSelectedCards) {
          setTimeout(() => {
            const screenWidth = typeof window !== 'undefined' ? window.innerWidth : 1920;
            const screenHeight = typeof window !== 'undefined' ? window.innerHeight : 1080;
            
            let maxTopEdgeHeight = findMaxTopEdgeHeight(
              cardCountToUse, 
              newSelectedCards, 
              getCardFanPosition, 
              cardProgressRefs
            );
            
            if (maxTopEdgeHeight === Infinity) {
              maxTopEdgeHeight = spreadCenter.y - FAN_RADIUS;
              console.log("hehehehehehehehe")
            }
            
            const centerY = screenHeight / 2;
            const preferredY = centerY - 300;
            const minY = 0;
            const targetY = Math.max(preferredY, minY);
            
            const cardPositions = {};
            const cardOffsetsMap = {};
            
            newSelectedCards.forEach(cardIndex => {
              const cardProgress = cardProgressRefs.current[cardIndex] !== undefined 
                ? cardProgressRefs.current[cardIndex] 
                : 1;
              cardPositions[cardIndex] = getCardFanPosition(cardIndex, cardCountToUse, cardProgress);
              cardOffsetsMap[cardIndex] = cardOffsets[cardIndex] || 0;
            });
            
            let targetPositions = {};
            
            if (validMaxSelectedCards === 2) {
              const offsetFromCenter = screenWidth / 8;
              const leftTargetX = spreadCenter.x + 35 - offsetFromCenter;
              const rightTargetX = spreadCenter.x + 35 + offsetFromCenter;
              
              const card1Index = newSelectedCards[0];
              const card2Index = newSelectedCards[1];
              const card1Position = cardPositions[card1Index];
              const card2Position = cardPositions[card2Index];
              const card1Offset = cardOffsetsMap[card1Index];
              const card2Offset = cardOffsetsMap[card2Index];
              
              const { card1TargetX, card2TargetX } = calculateTargetPositions(
                card1Position,
                card2Position,
                card1Offset,
                card2Offset,
                leftTargetX,
                rightTargetX
              );
              
              targetPositions = {
                [card1Index]: { x: card1TargetX, y: targetY },
                [card2Index]: { x: card2TargetX, y: targetY }
              };
            } else {
              targetPositions = calculateMultipleTargetPositions(
                newSelectedCards,
                cardPositions,
                cardOffsetsMap,
                spreadCenter,
                screenWidth,
                targetY
              );
            }
            
            setCardTargetPositions(targetPositions);
            
            const highestZIndexCardIndex = findHighestZIndexCardIndex(cardCountToUse, newSelectedCards);
            
            if (highestZIndexCardIndex !== -1) {
              const highestCardProgress = cardProgressRefs.current[highestZIndexCardIndex] !== undefined 
                ? cardProgressRefs.current[highestZIndexCardIndex] 
                : 1;
              const highestCardPosition = getCardFanPosition(highestZIndexCardIndex, cardCountToUse, highestCardProgress);
              setHighestZIndexCardPosition(highestCardPosition);
            }
            
            setPhase('moving-to-position');
            setMoveToPositionProgress(0);
            setMoveToHighestProgress(0);
            setCanFlipCards(false);
            // Reset flipped cards khi bắt đầu di chuyển
            setFlippedCards(new Set());
          }, 300);
        }
      }
    }
  }, [
    selectedCards, 
    phase, 
    cardCountToUse, 
    getCardFanPosition, 
    cardOffsets,
    spreadCenter,
    validMaxSelectedCards
  ]);


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
            const zIndex = cardCountToUse - index;
            const isSelected = selectedCards.includes(index);
            // Chỉ cho phép flip các thẻ đã được chọn và đã di chuyển đến vị trí
            const canFlip = canFlipCards && isSelected;
            // Hiển thị tên khi thẻ đã vào vị trí VÀ đã được lật
            const isFlipped = flippedCards.has(index);
            const showName = canFlipCards && isSelected && isFlipped;
            
            const handleCardFlip = () => {
              setFlippedCards(prev => new Set([...prev, index]));
              // Gọi callback khi card được flip với card name (cho one-card)
              if (onCardSelected && card?.card_name) {
                onCardSelected(card.card_name);
              }
              // Gọi callback khi card được flip với card name và index (cho daily - track thứ tự)
              if (onCardFlipped && card?.card_name) {
                onCardFlipped(card.card_name, index);
              }
            };
            
            return (
              <div
                key={card.id || index}
                ref={(el) => {
                  if (el) cardRefs.current[card.id || index] = el;
                }}
                className="tarot-card-spread-card"
                style={{
                  transform: `translate(${initialPosition.x}px, ${initialPosition.y}px) rotate(${initialPosition.rotation}deg)`,
                  opacity: 1,
                  zIndex: zIndex,
                  cursor: phase === 'spreading' || phase === 'selecting' ? 'pointer' : 'default',
                }}
                onMouseEnter={() => handleCardHover(index)}
                onMouseLeave={() => handleCardLeave(index)}
                onClick={(e) => handleCardClick(index, e)}
              >
                <TarotFlipCard 
                  card={card}
                  cardBackImage={cardBackImage}
                  width={cardSize.width}
                  height={cardSize.height}
                  canFlip={canFlip}
                  showCardName={showName}
                  allowUnflip={false}
                  onFlip={handleCardFlip}
                />
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default TarotCardSpread;
