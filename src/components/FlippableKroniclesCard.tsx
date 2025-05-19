import React, { useState } from 'react';
import ReactCardFlip from 'react-card-flip';
import styled from 'styled-components';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { playAudio } from '../utils/audioUtils';

interface KroniclesCardProps {
  id: string;
  title: string;
  description: string;
  color: string;
  coverImage: string;
  delay?: number;
}

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

const CardImage = styled.div<{ image: string }>`
  width: 100%;
  height: 60%;
  background-image: url(${props => props.image});
  background-size: cover;
  background-position: center;
`;

const CardContent = styled.div`
  padding: 1.5rem;
  display: flex;
  flex-direction: column;
  height: 40%;
  background: rgba(0, 0, 0, 0.7);
`;

const CardTitle = styled.h3`
  font-size: 1.8rem;
  margin-bottom: 0.5rem;
  color: white;
  font-family: 'Pixelify Sans', sans-serif;
  text-shadow: 0 0 5px rgba(255, 255, 255, 0.5);
`;

const CardDescription = styled.p`
  font-size: 0.9rem;
  color: rgba(255, 255, 255, 0.8);
  line-height: 1.5;
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

const FlippableKroniclesCard: React.FC<KroniclesCardProps> = ({ 
  id, 
  title, 
  description, 
  color, 
  coverImage,
  delay = 0 
}) => {
  const [isFlipped, setIsFlipped] = useState(false);
  const [isZooming, setIsZooming] = useState(false);
  const navigate = useNavigate();

  const handleFlip = (e: React.MouseEvent) => {
    e.preventDefault();
    // Play the flip sound
    playAudio('/music.mp3');
    setIsFlipped(!isFlipped);
  };

  const handleViewDetails = (e: React.MouseEvent) => {
    e.stopPropagation(); // Prevent triggering the flip
    setIsZooming(true);
    
    // Play the transition sound
    playAudio('/music.mp3');
    
    // Add a delay before navigation to allow zoom animation to complete
    setTimeout(() => {
      navigate(`/kronicles/${id}`);
    }, 500);
  };

  return (
    <CardContainer
      initial={{ opacity: 0, y: 50 }}
      animate={{ 
        opacity: isZooming ? 0 : 1, 
        y: isZooming ? -50 : 0,
        scale: isZooming ? 1.5 : 1,
      }}
      transition={{ 
        delay: isZooming ? 0 : delay, 
        duration: 0.5
      }}
    >
      <ReactCardFlip 
        isFlipped={isFlipped} 
        flipDirection="vertical"
        containerStyle={{ height: '100%' }}
      >
        {/* Front face */}
        <CardFace bgColor={color} onClick={handleFlip}>
          <CardImage image={coverImage} />
          <CardContent>
            <CardTitle>{title}</CardTitle>
            <CardDescription>
              {description.length > 60 ? description.substring(0, 60) + '...' : description}
            </CardDescription>
          </CardContent>
        </CardFace>

        {/* Back face */}
        <CardFace bgColor={color} onClick={handleFlip}>
          <CardContent style={{ height: '100%', justifyContent: 'space-between' }}>
            <CardTitle>{title}</CardTitle>
            <CardDescription>{description}</CardDescription>
            <CardButton onClick={handleViewDetails}>
              Read Kronicle
            </CardButton>
          </CardContent>
        </CardFace>
      </ReactCardFlip>
    </CardContainer>
  );
};

export default FlippableKroniclesCard;
