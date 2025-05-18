import { motion } from 'framer-motion';
import styled from 'styled-components';
import usePageTransition from '../hooks/usePageTransition';
import PageTransition from '../components/PageTransition';

// Styled components
const PageContainer = styled.div`
  width: 100%;
  min-height: 100vh;
  background: linear-gradient(135deg, #1a0033 0%, #000011 100%);
  color: white;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 2rem;
  position: relative;
  overflow: hidden;
`;

const ContentWrapper = styled.div`
  max-width: 1200px;
  width: 100%;
  z-index: 2;
  padding: 2rem;
  display: flex;
  flex-direction: column;
  align-items: center;
`;

const PageTitle = styled(motion.h1)`
  font-size: 5rem;
  font-weight: 900;
  text-transform: uppercase;
  margin-bottom: 2rem;
  text-align: center;
  color: transparent;
  background: linear-gradient(135deg, #ff00cc 0%, #3333ff 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  text-shadow: 0 0 20px rgba(255, 0, 204, 0.4);
  letter-spacing: -2px;
  
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

const GridOverlay = styled.div`
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-size: 50px 50px;
  background-image:
    linear-gradient(to right, rgba(255, 0, 204, 0.05) 1px, transparent 1px),
    linear-gradient(to bottom, rgba(51, 51, 255, 0.05) 1px, transparent 1px);
  transform: perspective(500px) rotateX(60deg) scale(2.5) translateY(-10%);
  transform-origin: center;
  pointer-events: none;
  opacity: 0.6;
  z-index: 0;
`;

const NeonGlow = styled.div`
  position: absolute;
  bottom: 0;
  left: 0;
  width: 100%;
  height: 50%;
  background: linear-gradient(to top, 
    rgba(255, 0, 204, 0.1) 0%, 
    rgba(51, 51, 255, 0.05) 40%, 
    transparent 100%);
  pointer-events: none;
  z-index: 0;
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

const KroniclesPage: React.FC = () => {
 const { isAnimating } = usePageTransition();
  
  return (
    <PageTransition isActive={isAnimating}>
      <PageContainer>
        <GridOverlay />
        <NeonGlow />
        
        <ContentWrapper>
          <PageTitle variants={titleVariants}>
            Kronicles
          </PageTitle>
          
          <Subtitle variants={subtitleVariants}>
            The digital archives of our collective literary journey. Explore our 
            publications, events, and creative milestones that define the evolving 
            narrative of our society.
          </Subtitle>
        </ContentWrapper>
      </PageContainer>
    </PageTransition>
  );
};

export default KroniclesPage;