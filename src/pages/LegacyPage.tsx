import { motion } from 'framer-motion';
import styled from 'styled-components';
import usePageTransition from '../hooks/usePageTransition';
import PageTransition from '../components/PageTransition';

// Styled components
const PageContainer = styled.div`
  width: 100%;
  min-height: 100vh;
  background: linear-gradient(135deg, #111 0%, #222 100%);
  color: white;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 2rem;
  position: relative;
  overflow: hidden;
`;

const GlowingOverlay = styled.div`
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: radial-gradient(circle at center, rgba(106, 17, 203, 0.1) 0%, rgba(0, 0, 0, 0) 60%);
  pointer-events: none;
  z-index: 1;
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
  background: linear-gradient(90deg, #6a11cb 0%, #2575fc 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  text-shadow: 0 0 15px rgba(106, 17, 203, 0.5);
  
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

const RetroLines = styled.div`
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: repeating-linear-gradient(
    0deg,
    rgba(0, 0, 0, 0),
    rgba(0, 0, 0, 0) 4px,
    rgba(106, 17, 203, 0.03) 4px,
    rgba(106, 17, 203, 0.03) 5px
  );
  pointer-events: none;
  opacity: 0.3;
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

const LegacyPage: React.FC = () => {
  const { controls } = usePageTransition();
  
  return (
    <PageTransition controls={controls}>
      <PageContainer>
        <RetroLines />
        <GlowingOverlay />
        
        <ContentWrapper>
          <PageTitle variants={titleVariants}>
            Legacy
          </PageTitle>
          
          <Subtitle variants={subtitleVariants}>
            Honoring the rich history and enduring traditions of our literary society. 
            Discover the stories of those who shaped our community and the timeless 
            works that continue to inspire generations.
          </Subtitle>
        </ContentWrapper>
      </PageContainer>
    </PageTransition>
  );
};

export default LegacyPage;