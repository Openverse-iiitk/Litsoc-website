import React, { useState } from 'react';
import { motion } from 'framer-motion';
import styled from 'styled-components';
import ReactCardFlip from 'react-card-flip';
import { playAudio } from '../utils/audioUtils';

// Styled components for the timeline card
const CardContainer = styled(motion.div)`
  width: 100%;
  height: 100%;
  margin-bottom: 1.5rem;
  position: relative;
`;

const CardFrame = styled.div`
  position: absolute;
  top: -5px;
  left: -5px;
  right: -5px;
  bottom: -5px;
  border: 2px solid rgba(255, 69, 0, 0.5);
  border-radius: 14px;
  pointer-events: none;
  z-index: 1;
  opacity: 0;
  transition: opacity 0.3s ease;
  
  &::before, &::after {
    content: '';
    position: absolute;
    width: 10px;
    height: 10px;
    background-color: rgba(255, 69, 0, 0.8);
  }
  
  /* Corner pixels */
  &::before {
    top: -5px;
    left: -5px;
  }
  
  &::after {
    bottom: -5px;
    right: -5px;
  }
  
  /* After pseudo-element */
  ${CardContainer}:hover & {
    opacity: 1;
  }
`;

const CardFace = styled.div<{ bgColor: string }>`
  width: 250px;
  height: 320px;
  border-radius: 12px;
  overflow: hidden;
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.5);
  background: ${props => props.bgColor};
  background-image: linear-gradient(
    135deg, 
    ${props => props.bgColor} 0%, 
    ${props => props.bgColor}dd 70%, 
    ${props => props.bgColor}99 100%
  );
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  cursor: pointer;
  transition: all 0.3s cubic-bezier(0.25, 0.8, 0.25, 1);
  position: relative;
  
  &:hover {
    transform: translateY(-10px) rotate(2deg);
    box-shadow: 0 15px 35px rgba(0, 0, 0, 0.5), 0 0 15px rgba(255, 255, 255, 0.2);
  }
  
  @media (max-width: 768px) {
    width: 200px;
    height: 270px;
  }
`;

const CardGlow = styled.div`
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  border-radius: 12px;
  background: radial-gradient(circle at 50% 50%, rgba(255, 255, 255, 0.1) 0%, rgba(0, 0, 0, 0) 80%);
  opacity: 0;
  transition: opacity 0.3s ease;
  
  ${CardFace}:hover & {
    opacity: 1;
  }
`;

const CardImage = styled.div<{ imageUrl: string }>`
  height: 60%;
  background-image: url(${props => props.imageUrl});
  background-size: cover;
  background-position: center;
  position: relative;
  
  &::after {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: linear-gradient(to bottom, rgba(0, 0, 0, 0) 70%, rgba(0, 0, 0, 0.7) 100%);
  }
`;

// New component for pixelated effect
const PixelCorners = styled.div`
  position: absolute;
  width: 100%;
  height: 100%;
  pointer-events: none;
  z-index: 2;
  
  &::before, &::after {
    content: '';
    position: absolute;
    width: 8px;
    height: 8px;
    background-color: #fff;
    opacity: 0;
    transition: opacity 0.3s ease;
  }
  
  &::before {
    top: 5px;
    left: 5px;
    box-shadow: 8px 0 0 rgba(255,255,255,0.5), 0 8px 0 rgba(255,255,255,0.5);
  }
  
  &::after {
    bottom: 5px;
    right: 5px;
    box-shadow: -8px 0 0 rgba(255,255,255,0.5), 0 -8px 0 rgba(255,255,255,0.5);
  }
  
  ${CardContainer}:hover &::before, ${CardContainer}:hover &::after {
    opacity: 0.7;
  }
`;

const CardContent = styled.div`
  padding: 1.2rem;
  display: flex;
  flex-direction: column;
  height: 40%;
  position: relative;
  
  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: 10px;
    right: 10px;
    height: 1px;
    background: linear-gradient(to right, transparent, rgba(255, 255, 255, 0.3), transparent);
  }
`;

const CardName = styled.h3`
  font-size: 1.6rem;
  margin: 0;
  color: white;
  font-family: 'Pixelify Sans', sans-serif;
  text-shadow: 0 0 5px rgba(255, 255, 255, 0.5);
`;

const CardQuote = styled.p`
  font-size: 0.9rem;
  color: rgba(255, 255, 255, 0.9);
  line-height: 1.4;
  margin-top: 0.5rem;
  font-style: italic;
  overflow: hidden;
  text-overflow: ellipsis;
  display: -webkit-box;
  -webkit-line-clamp: 3;
  -webkit-box-orient: vertical;
`;

const BackContent = styled.div`
  padding: 1.5rem;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  height: 100%;
  text-align: center;
  position: relative;
  
  &::before, &::after {
    content: '';
    position: absolute;
    width: 70%;
    height: 1px;
    background: linear-gradient(to right, transparent, rgba(255, 255, 255, 0.5), transparent);
    left: 15%;
  }
  
  &::before {
    top: 20px;
  }
  
  &::after {
    bottom: 20px;
  }
`;

const BackQuote = styled.p`
  font-size: 1.1rem;
  color: white;
  line-height: 1.6;
  margin-bottom: 1rem;
  font-style: italic;
  text-shadow: 0 0 5px rgba(0, 0, 0, 0.7);
`;

const BackName = styled.h3`
  font-size: 1.6rem;
  color: white;
  margin-top: 1rem;
  font-family: 'Pixelify Sans', sans-serif;
  text-shadow: 0 0 10px rgba(255, 255, 255, 0.7);
`;

interface TimelineCardProps {
  id: string;
  name: string;
  quote: string;
  imageUrl: string;
  color: string;
  delay?: number;
}

const TimelineCard: React.FC<TimelineCardProps> = ({ 
  name, 
  quote, 
  imageUrl, 
  color, 
  delay = 0 
}) => {
  const [isFlipped, setIsFlipped] = useState(false);
  
  const handleFlip = (e: React.MouseEvent) => {
    e.preventDefault();
    // Play flip sound
    playAudio('public/audio/page-turn.mp3');
    setIsFlipped(!isFlipped);
  };

  return (
    <CardContainer
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay, duration: 0.5 }}
      whileHover={{ scale: 1.03 }}
    >
      <CardFrame />
      <PixelCorners />
      <ReactCardFlip isFlipped={isFlipped} flipDirection="horizontal">
        {/* Front face */}
        <CardFace bgColor={color} onClick={handleFlip}>
          <CardGlow />
          <CardImage imageUrl={imageUrl} />
          <CardContent>
            <CardName>{name}</CardName>
            <CardQuote>"{quote}"</CardQuote>
          </CardContent>
        </CardFace>

        {/* Back face */}
        <CardFace bgColor={color} onClick={handleFlip}>
          <CardGlow />
          <BackContent>
            <BackQuote>"{quote}"</BackQuote>
            <BackName>{name}</BackName>
          </BackContent>
        </CardFace>
      </ReactCardFlip>
    </CardContainer>
  );
};

export default TimelineCard;
