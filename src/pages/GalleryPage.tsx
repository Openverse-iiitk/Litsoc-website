import { motion } from 'framer-motion';
import styled from 'styled-components';
import usePageTransition from '../hooks/usePageTransition';
import PageTransition from '../components/PageTransition';

// Styled components
const PageContainer = styled.div`
  width: 100%;
  min-height: 100vh;
  background: linear-gradient(135deg, #000000 0%, #301934 100%);
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
  background: linear-gradient(90deg, #ffcc00 0%, #ff6b6b 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  text-shadow: 0 0 15px rgba(255, 204, 0, 0.4);
  
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

const StarfieldBackground = styled.div`
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-image: 
    radial-gradient(2px 2px at 20px 30px, rgba(255, 255, 255, 0.9), rgba(0, 0, 0, 0)),
    radial-gradient(2px 2px at 40px 70px, rgba(255, 255, 255, 0.9), rgba(0, 0, 0, 0)),
    radial-gradient(2px 2px at 50px 160px, rgba(255, 255, 255, 0.9), rgba(0, 0, 0, 0)),
    radial-gradient(2px 2px at 90px 40px, rgba(255, 255, 255, 0.9), rgba(0, 0, 0, 0)),
    radial-gradient(2px 2px at 130px 80px, rgba(255, 255, 255, 0.9), rgba(0, 0, 0, 0)),
    radial-gradient(2px 2px at 160px 120px, rgba(255, 255, 255, 0.9), rgba(0, 0, 0, 0));
  background-repeat: repeat;
  background-size: 200px 200px;
  opacity: 0.3;
  animation: twinkle 5s infinite alternate;
  pointer-events: none;
  z-index: 0;
  
  @keyframes twinkle {
    0% {
      opacity: 0.3;
    }
    100% {
      opacity: 0.6;
    }
  }
`;

const AuroraEffect = styled.div`
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: linear-gradient(135deg, 
    rgba(255, 204, 0, 0) 0%, 
    rgba(255, 204, 0, 0.05) 25%, 
    rgba(255, 107, 107, 0.05) 75%, 
    rgba(255, 107, 107, 0) 100%);
  filter: blur(80px);
  opacity: 0.5;
  animation: aurora 15s infinite ease-in-out;
  pointer-events: none;
  z-index: 0;
  
  @keyframes aurora {
    0% {
      transform: translate(0, 0) rotate(0deg);
    }
    50% {
      transform: translate(5%, 5%) rotate(5deg);
    }
    100% {
      transform: translate(0, 0) rotate(0deg);
    }
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

const GalleryPage: React.FC = () => {
  const { isAnimating } = usePageTransition();
  
  return (
    <PageTransition isActive={isAnimating}>
      <PageContainer>
        <StarfieldBackground />
        <AuroraEffect />
        
        <ContentWrapper>
          <PageTitle variants={titleVariants}>
            Gallery
          </PageTitle>
          
          <Subtitle variants={subtitleVariants}>
            A visual journey through our literary moments, events, and creative 
            collaborations. Explore captured memories and artistic expressions 
            from our community gatherings.
          </Subtitle>
        </ContentWrapper>
      </PageContainer>
    </PageTransition>
  );
};

export default GalleryPage;