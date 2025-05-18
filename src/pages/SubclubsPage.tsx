import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import styled from 'styled-components';
import usePageTransition from '../hooks/usePageTransition';
import PageTransition from '../components/PageTransition';
import SubclubCards from '../components/SubclubCards';

// Styled components
const PageContainer = styled.div`
  width: 100%;
  min-height: 100vh;
  background: linear-gradient(135deg, #2c3e50 0%, #000000 100%);
  background-attachment: fixed;
  color: white;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: flex-start;
  padding: 2rem;
  position: relative;
  overflow-x: hidden;
  overflow-y: auto;
`;

const ContentWrapper = styled.div`
  max-width: 1200px;
  width: 100%;
  z-index: 2;
  padding: 2rem 1rem 4rem 1rem;
  display: flex;
  flex-direction: column;
  align-items: center;
  position: relative;
  
  @media (max-width: 768px) {
    padding: 1rem 0.5rem 3rem 0.5rem;
  }
`;

const PageTitle = styled(motion.h1)`
  font-size: 5rem;
  font-weight: 900;
  text-transform: uppercase;
  margin-bottom: 2rem;
  text-align: center;
  background: linear-gradient(90deg, #00b8d4 0%, #76ff03 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  text-shadow: 0 0 15px rgba(0, 184, 212, 0.4);
  
  @media (max-width: 768px) {
    font-size: 3rem;
  }
`;

const Subtitle = styled(motion.h2)`
  font-size: 1.5rem;
  margin-bottom: 4rem;
  text-align: center;
  color: rgba(255, 255, 255, 0.7);
  max-width: 800px;
  
  @media (max-width: 768px) {
    font-size: 1.2rem;
  }
`;

const CircuitLines = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-image: url("data:image/svg+xml,%3Csvg width='100' height='100' viewBox='0 0 100 100' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M0 0h100v100H0z' fill='none'/%3E%3Cpath d='M0 0h50v50H0z' fill='none' stroke='rgba(0, 184, 212, 0.1)' stroke-width='0.5'/%3E%3Cpath d='M50 0h50v50H50z' fill='none' stroke='rgba(0, 184, 212, 0.1)' stroke-width='0.5'/%3E%3Cpath d='M0 50h50v50H0z' fill='none' stroke='rgba(118, 255, 3, 0.1)' stroke-width='0.5'/%3E%3Cpath d='M50 50h50v50H50z' fill='none' stroke='rgba(118, 255, 3, 0.1)' stroke-width='0.5'/%3E%3C/svg%3E");
  background-size: 100px 100px;
  opacity: 0.5;
  pointer-events: none;
  z-index: 0;
`;

const Orbs = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  overflow: hidden;
  z-index: 0;
  
  &::before, &::after {
    content: '';
    position: absolute;
    border-radius: 50%;
    filter: blur(60px);
  }
  
  &::before {
    width: 300px;
    height: 300px;
    top: -100px;
    left: -100px;
    background: rgba(0, 184, 212, 0.15);
  }
  
  &::after {
    width: 250px;
    height: 250px;
    bottom: -100px;
    right: -100px;
    background: rgba(118, 255, 3, 0.15);
  }
`;



// Animation variants
const titleVariants = {
  enter: {
    y: 0,
    opacity: 1,
    transition: {
      duration: 0.8,
      ease: "easeOut"
    }
  },
  exit: {
    y: -50,
    opacity: 0,
    transition: {
      duration: 0.3,
      ease: "easeIn"
    }
  }
};

const subtitleVariants = {
  enter: {
    y: 0,
    opacity: 1,
    transition: {
      duration: 0.8,
      delay: 0.2,
      ease: "easeOut"
    }
  },
  exit: {
    y: 50,
    opacity: 0,
    transition: {
      duration: 0.3,
      ease: "easeIn"
    }
  }
};

const SubclubsPage: React.FC = () => {
  const { isAnimating } = usePageTransition();
  const [showCards, setShowCards] = useState(false);
  
  // Animation to fade in cards after page load
  useEffect(() => {
    const timer = setTimeout(() => {
      setShowCards(true);
    }, 1000);
    
    return () => clearTimeout(timer);
  }, []);
  
  return (
    <PageTransition isActive={isAnimating}>
      <PageContainer>
        <CircuitLines />
        <Orbs />
        
        <ContentWrapper>
          <PageTitle variants={titleVariants}>
            Subclubs
          </PageTitle>
          
          <Subtitle variants={subtitleVariants}>
            Discover our specialized communities within the Literary Society. 
            From poetry circles to storytelling workshops, our subclubs offer 
            focused spaces for honing specific literary crafts.
          </Subtitle>
          
          {/* 2D cards with flip animation */}
          <SubclubCards showCards={showCards} />
        </ContentWrapper>
      </PageContainer>
    </PageTransition>
  );
};



export default SubclubsPage;