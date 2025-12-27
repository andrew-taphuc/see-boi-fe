export const lerp = (current, target, speed) => {
  return (target - current) * speed;
};

export const easeInOut = (progress) => {
  return progress < 0.5 
    ? 2 * progress * progress 
    : 1 - Math.pow(-2 * progress + 2, 2) / 2;
};

export const calculateCardOffset = (rotationRad, cardOffset, pushDistance) => {
  return {
    x: -Math.sin(rotationRad) * cardOffset * pushDistance,
    y: Math.cos(rotationRad) * cardOffset * pushDistance
  };
};

export const getCardFanPosition = (index, totalCards, progress, spreadCenter, FAN_ANGLE, FAN_RADIUS) => {
  const angleStep = FAN_ANGLE / (totalCards - 1);
  let baseAngle = (index * angleStep) - (FAN_ANGLE / 2);
  
  if (index === 0) {
    baseAngle = baseAngle + 0;
  }
  
  const adjustedAngle = baseAngle;
  const finalAngleRad = ((adjustedAngle + 90) * Math.PI) / 180;

  const stackOffset = index / 2;
  
  const START_X_OFFSET_FROM_CENTER = 1500;
  const centerX = spreadCenter.x > 0 ? spreadCenter.x : window.innerWidth / 2;
  const startX = centerX - START_X_OFFSET_FROM_CENTER + stackOffset;
  
  const MIN_START_X = 50;
  const finalStartX = Math.max(MIN_START_X, startX);
  
  const START_Y_PERCENT = 0;
  const startY = (window.innerHeight * START_Y_PERCENT - 200) + stackOffset;
  const startRotation = 90;

  let endX = spreadCenter.x + Math.cos(finalAngleRad) * FAN_RADIUS;
  let endY = spreadCenter.y + Math.sin(finalAngleRad) * FAN_RADIUS;
  
  if (index === 0) {
    endX = endX + 100;
    endY = endY + 30;
  }
  
  const endRotation = adjustedAngle;

  const startAngle = Math.atan2(startY - spreadCenter.y, finalStartX - centerX);
  const endAngle = finalAngleRad;
  
  const startRadius = Math.sqrt(
    Math.pow(finalStartX - centerX, 2) + Math.pow(startY - spreadCenter.y, 2)
  );
  const endRadius = FAN_RADIUS;
  
  const easeProgress = easeInOut(progress);
  
  const currentAngle = startAngle + (endAngle - startAngle) * easeProgress;
  const currentRadius = startRadius + (endRadius - startRadius) * easeProgress;
  
  const x = spreadCenter.x + Math.cos(currentAngle) * currentRadius;
  const y = spreadCenter.y + Math.sin(currentAngle) * currentRadius;
  const rotation = startRotation + (endRotation - startRotation) * progress;

  return { x, y, rotation };
};

export const calculateSelectedCardAnimation = (
  position, 
  targetPos, 
  cardOffset, 
  rotationRad, 
  pushDistance, 
  moveToPositionProgress
) => {
  if (!targetPos) return { offsetX: 0, offsetY: 0, finalRotation: position.rotation };
  
  const currentOffset = calculateCardOffset(rotationRad, cardOffset, pushDistance);
  const currentX = position.x + currentOffset.x;
  const currentY = position.y + currentOffset.y;
  
  const easeProgress = easeInOut(moveToPositionProgress);
  
  return {
    offsetX: (targetPos.x - currentX) * easeProgress,
    offsetY: (targetPos.y - currentY) * easeProgress,
    finalRotation: position.rotation * (1 - easeProgress)
  };
};

export const calculateUnselectedCardAnimation = (
  position,
  highestZIndexCardPosition,
  spreadCenter,
  moveToHighestProgress
) => {
  if (!highestZIndexCardPosition) return { offsetX: 0, offsetY: 0, finalRotation: position.rotation };
  
  const currentX = position.x;
  const currentY = position.y;
  const targetX = highestZIndexCardPosition.x;
  const targetY = highestZIndexCardPosition.y;
  
  const currentAngle = Math.atan2(currentY - spreadCenter.y, currentX - spreadCenter.x);
  const targetAngle = Math.atan2(targetY - spreadCenter.y, targetX - spreadCenter.x);
  const currentRadius = Math.sqrt(
    Math.pow(currentX - spreadCenter.x, 2) + Math.pow(currentY - spreadCenter.y, 2)
  );
  const targetRadius = Math.sqrt(
    Math.pow(targetX - spreadCenter.x, 2) + Math.pow(targetY - spreadCenter.y, 2)
  );
  
  const easeProgress = easeInOut(moveToHighestProgress);
  
  const interpolatedAngle = currentAngle + (targetAngle - currentAngle) * easeProgress;
  const interpolatedRadius = currentRadius + (targetRadius - currentRadius) * easeProgress;
  
  const newX = spreadCenter.x + Math.cos(interpolatedAngle) * interpolatedRadius;
  const newY = spreadCenter.y + Math.sin(interpolatedAngle) * interpolatedRadius;
  
  const targetRotation = highestZIndexCardPosition.rotation;
  
  return {
    offsetX: newX - currentX,
    offsetY: newY - currentY,
    finalRotation: position.rotation + (targetRotation - position.rotation) * easeProgress
  };
};

export const findMaxTopEdgeHeight = (cardCountToUse, newSelectedCards, getCardFanPosition, cardProgressRefs) => {
  const CARD_HEIGHT = 227;
  let maxTopEdgeHeight = Infinity;
  
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
  
  return maxTopEdgeHeight;
};

export const findHighestZIndexCardIndex = (cardCountToUse, newSelectedCards) => {
  let highestZIndexCardIndex = -1;
  for (let i = 0; i < cardCountToUse; i++) {
    if (!newSelectedCards.includes(i)) {
      if (highestZIndexCardIndex === -1 || i < highestZIndexCardIndex) {
        highestZIndexCardIndex = i;
      }
    }
  }
  return highestZIndexCardIndex;
};

export const calculateTargetPositions = (
  card1Position,
  card2Position,
  card1Offset,
  card2Offset,
  leftTargetX,
  rightTargetX
) => {
  const PUSH_DISTANCE = 50;
  const card1RotationRad = (card1Position.rotation * Math.PI) / 180;
  const card2RotationRad = (card2Position.rotation * Math.PI) / 180;
  const card1OffsetX = -Math.sin(card1RotationRad) * card1Offset * PUSH_DISTANCE;
  const card2OffsetX = -Math.sin(card2RotationRad) * card2Offset * PUSH_DISTANCE;
  
  const card1CurrentX = card1Position.x + card1OffsetX;
  const card2CurrentX = card2Position.x + card2OffsetX;
  
  const card1ToLeft = Math.abs(card1CurrentX - leftTargetX);
  const card1ToRight = Math.abs(card1CurrentX - rightTargetX);
  const card2ToLeft = Math.abs(card2CurrentX - leftTargetX);
  const card2ToRight = Math.abs(card2CurrentX - rightTargetX);
  
  if (card1ToLeft + card2ToRight < card1ToRight + card2ToLeft) {
    return {
      card1TargetX: leftTargetX,
      card2TargetX: rightTargetX
    };
  } else {
    return {
      card1TargetX: rightTargetX,
      card2TargetX: leftTargetX
    };
  }
};

export const calculateMultipleTargetPositions = (
  selectedCardIndices,
  cardPositions,
  cardOffsets,
  spreadCenter,
  screenWidth,
  targetY
) => {
  const numCards = selectedCardIndices.length;
  
  if (numCards === 1) {
    return {
      [selectedCardIndices[0]]: { x: screenWidth / 2, y: targetY }
    };
  }
  
  const CARD_WIDTH = 150;
  const SPACING = 20;
  const centerX = screenWidth / 2;
  const middleIndex = Math.floor(numCards / 2);
  
  const targetPositions = {};
  
  selectedCardIndices.forEach((cardIndex, idx) => {
    let targetX;
    
    if (idx === middleIndex) {
      targetX = centerX;
    } else {
      const offsetFromCenter = (idx - middleIndex) * (CARD_WIDTH + SPACING);
      targetX = centerX + offsetFromCenter;
    }
    
    targetPositions[cardIndex] = { x: targetX, y: targetY };
  });
  
  return targetPositions;
};

