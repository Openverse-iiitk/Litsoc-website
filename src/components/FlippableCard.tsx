import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import styled from 'styled-components';
import { useNavigate } from 'react-router-dom';
import ReactCardFlip from 'react-card-flip';
import { playAudio } from '../utils/audioUtils';

// Styled components for card
const CardContainer = styled(motion.div)`
  width: 100%;
  height: 100%;
`;

const CardFace = styled.div<{ bgColor: string }>`
  width: 280px;
  height: 380px;
  border-radius: 12px;
  overflow: hidden;
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.5);
  background: ${props => props.bgColor};
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  cursor: pointer;
  transition: transform 0.3s ease;
  
  &:hover {
    transform: translateY(-10px);
  }
  
  @media (max-width: 768px) {
    width: 220px;
    height: 300px;
  }
`;

const CardContent = styled.div`
  padding: 1.5rem;
  display: flex;
  flex-direction: column;
  height: 100%;
`;

const CardTitle = styled.h3`
  font-size: 1.8rem;
  margin-bottom: 1rem;
  color: white;
  font-family: 'Pixelify Sans', sans-serif;
  text-shadow: 0 0 5px rgba(255, 255, 255, 0.5);
`;



const CardDescription = styled.p`
  font-size: 1rem;
  color: rgba(255, 255, 255, 0.8);
  line-height: 1.5;
  flex: 1;
`;

const CardButton = styled.button`
  background: rgba(255, 255, 255, 0.15);
  border: 1px solid rgba(255, 255, 255, 0.3);
  color: white;
  padding: 0.8rem 1.5rem;
  border-radius: 4px;
  cursor: pointer;
  font-family: 'Pixelify Sans', sans-serif;
  font-size: 1rem;
  transition: all 0.2s ease;
  margin-top: 1rem;
  
  &:hover {
    background: rgba(255, 255, 255, 0.25);
    transform: translateY(-2px);
  }
`;

interface FlippableCardProps {
 id: string;
  title: string;
  description: string;
  color: string;
  secondaryColor?: string;
  delay?: number;
}
const FlippableCard: React.FC<FlippableCardProps> = ({ id, title, description, color, secondaryColor, delay = 0 }) => {
  const [isFlipped, setIsFlipped] = useState(false);
  const cardBackgroundColor = isFlipped && secondaryColor ? secondaryColor : color;
  const navigate = useNavigate();
  
  // Preload the audio file when component mounts
  useEffect(() => {
    const audio = new Audio('/music.mp3');
    return () => {
      audio.pause();
      audio.src = '';
    };
  }, []);

  const handleFlip = (e: React.MouseEvent) => {
    e.preventDefault();
    // Play the flip sound
    playAudio('/music.mp3');
    setIsFlipped(!isFlipped);
  };

  const handleViewDetails = (e: React.MouseEvent) => {
    e.stopPropagation(); // Prevent triggering the flip
    navigate(`/subclubs/${id}`);
  };

  return (
    <CardContainer
      initial={{ opacity: 0, y: 50 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay, duration: 0.5 }}
    >
      <ReactCardFlip isFlipped={isFlipped} flipDirection="vertical">
        {/* Front face */}
        <CardFace bgColor={cardBackgroundColor} onClick={handleFlip}>
          <CardContent>
            <CardTitle>{title}</CardTitle>
            <CardDescription>
              {description.substring(0, 80)}...
            </CardDescription>
            <CardButton onClick={handleFlip}>
              Click to flip
            </CardButton>
          </CardContent>
        </CardFace>

        {/* Back face */}
        <CardFace bgColor={cardBackgroundColor} onClick={handleFlip}>
          <CardContent>
            <CardTitle>{title}</CardTitle>
            <CardDescription>
              {description}
            </CardDescription>
            <CardButton onClick={handleViewDetails}>
              View Details
            </CardButton>
          </CardContent>
        </CardFace>
      </ReactCardFlip>
    </CardContainer>
  );
};

export default FlippableCard;
