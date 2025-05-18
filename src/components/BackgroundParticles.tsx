import { useState, useEffect } from 'react';
import styled from 'styled-components';
import { motion } from 'framer-motion';

// Types
interface Particle {
  id: number;
  x: number;
  y: number;
  size: number;
  color: string;
  opacity: number;
  speed: number;
}

// Constants
const COLORS = ['#ff00ff', '#00ffff', '#7f00ff', '#ff5500', '#ffaa00'];
const PARTICLE_COUNT = 30;

// Styled components
const ParticleContainer = styled.div`
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  pointer-events: none;
  z-index: 8;
  display: none;
  
  @media (max-width: 768px) {
    display: block;
  }
`;

const ParticleElement = styled(motion.div)<{ $size: number; $color: string; $opacity: number }>`
  position: absolute;
  border-radius: 50%;
  width: ${props => props.$size}px;
  height: ${props => props.$size}px;
  background-color: ${props => props.$color};
  opacity: ${props => props.$opacity};
  box-shadow: 0 0 10px ${props => props.$color};
  pointer-events: none;
`;

const BackgroundParticles: React.FC = () => {
  const [particles, setParticles] = useState<Particle[]>([]);
  
  // Generate particles on component mount
  useEffect(() => {
    const newParticles: Particle[] = [];
    
    for (let i = 0; i < PARTICLE_COUNT; i++) {
      newParticles.push({
        id: i,
        x: Math.random() * 100, // percentage
        y: Math.random() * 100, // percentage
        size: Math.random() * 4 + 2, // between 2-6px
        color: COLORS[Math.floor(Math.random() * COLORS.length)],
        opacity: Math.random() * 0.5 + 0.3, // between 0.3-0.8
        speed: Math.random() * 5 + 2 // animation speed multiplier
      });
    }
    
    setParticles(newParticles);
  }, []);
  
  return (
    <ParticleContainer>
      {particles.map(particle => (
        <ParticleElement
          key={particle.id}
          $size={particle.size}
          $color={particle.color}
          $opacity={particle.opacity}
          initial={{ 
            x: `${particle.x}vw`, 
            y: `${particle.y}vh`,
            scale: 0
          }}
          animate={{ 
            y: [`${particle.y}vh`, `${(particle.y + 20) % 100}vh`, `${particle.y}vh`],
            x: [`${particle.x}vw`, `${(particle.x + (Math.random() * 10 - 5)) % 100}vw`, `${particle.x}vw`],
            scale: [0, 1, 0],
            opacity: [0, particle.opacity, 0]
          }}
          transition={{
            duration: 10 / particle.speed,
            repeat: Infinity,
            ease: "easeInOut",
            delay: Math.random() * 5
          }}
        />
      ))}
    </ParticleContainer>
  );
};

export default BackgroundParticles;
