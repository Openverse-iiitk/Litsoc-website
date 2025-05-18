import { Suspense, useState, useEffect, useRef } from 'react';
import { Canvas } from '@react-three/fiber';
import styled from 'styled-components';
import { motion, AnimatePresence, useScroll, useTransform } from 'framer-motion';
import ModelViewer from './components/ModelViewer';
import Header from './components/Header';

// Styled components for the app layout
const AppContainer = styled.div`
  width: 100%;
  height: 300vh; /* Make it 3x the viewport height for scrolling */
  margin: 0;
  padding: 0;
  position: relative;
`;

const StickyContainer = styled.div`
  position: sticky;
  top: 0;
  left: 0;
  width: 100vw;
  height: 100vh;
  overflow: hidden;
`;

const BackgroundTransition = styled(motion.div)`
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  z-index: 1;
  background-color: black;
`;

const CanvasContainer = styled.div`
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  z-index: 5;
`;

const ContentSection = styled(motion.div)`
  position: absolute;
  top: 0;
  left: 0;
  width: 40%;
  height: 100%;
  padding: 4rem;
  display: flex;
  flex-direction: column;
  justify-content: center;
  color: black;
  z-index: 10;
  pointer-events: none;
`;

const InfoTitle = styled(motion.h2)`
  font-size: 3rem;
  font-weight: bold;
  margin-bottom: 1.5rem;
`;

const InfoText = styled(motion.p)`
  font-size: 1.25rem;
  line-height: 1.6;
  margin-bottom: 1rem;
`;

const LoadingMessage = styled(motion.div)`
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  color: white;
  font-size: 2rem;
  z-index: 30;
  padding: 20px;
  background: rgba(0, 0, 0, 0.7);
  border-radius: 8px;
  display: flex;
  flex-direction: column;
  align-items: center;
`;

const ProgressBar = styled.div<{ progress: number }>`
  width: 300px;
  height: 10px;
  background-color: #333;
  border-radius: 5px;
  margin-top: 10px;
  position: relative;
  overflow: hidden;
  
  &::after {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    height: 100%;
    width: ${props => props.progress}%;
    background-color: white;
    border-radius: 5px;
    transition: width 0.3s ease-in-out;
  }
`;

const ErrorMessage = styled.div`
  position: absolute;
  top: 10px;
  left: 10px;
  color: red;
  font-size: 1rem;
  z-index: 30;
  background: rgba(0, 0, 0, 0.7);
  padding: 10px;
  border-radius: 4px;
`;

function App() {
  const [loading, setLoading] = useState(true);
  const [progress, setProgress] = useState(0);
  const [error] = useState<string | null>(null);
  const containerRef = useRef(null);
  
  // Setup scroll animation
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end end"]
  });
  
  // Define animations based on scroll
  const backgroundColor = useTransform(
    scrollYProgress,
    [0, 0.4, 0.6],
    ["#000000", "#000000", "#ffffff"]
  );
  
  const contentOpacity = useTransform(
    scrollYProgress,
    [0.4, 0.7],
    [0, 1]
  );
  
  // Simulate loading progress
  useEffect(() => {
    const timer = setInterval(() => {
      setProgress(prev => {
        const newProgress = prev + 1;
        if (newProgress >= 100) {
          clearInterval(timer);
          // Add slight delay before removing loading screen
          setTimeout(() => setLoading(false), 500);
          return 100;
        }
        return newProgress;
      });
    }, 50);

    return () => clearInterval(timer);
  }, []);
  
  return (
    <AppContainer ref={containerRef}>
      <StickyContainer>
        <BackgroundTransition style={{ backgroundColor }} />
        
        <CanvasContainer>
          <Canvas>
            <Suspense fallback={null}>
              <ModelViewer />
            </Suspense>
          </Canvas>
        </CanvasContainer>
        
        <ContentSection style={{ opacity: contentOpacity }}>
          <InfoTitle initial={{ x: -50, opacity: 0 }} animate={{ x: 0, opacity: 1 }} transition={{ delay: 0.3 }}>
            Literary Society
          </InfoTitle>
          <InfoText initial={{ x: -50, opacity: 0 }} animate={{ x: 0, opacity: 1 }} transition={{ delay: 0.5 }}>
            We are a community of creative writers, poets, and literary enthusiasts from IIIT Kottayam.
          </InfoText>
          <InfoText initial={{ x: -50, opacity: 0 }} animate={{ x: 0, opacity: 1 }} transition={{ delay: 0.7 }}>
            Our mission is to foster a love for literature and provide a platform for students to express themselves through words.
          </InfoText>
          <InfoText initial={{ x: -50, opacity: 0 }} animate={{ x: 0, opacity: 1 }} transition={{ delay: 0.9 }}>
            Join us in exploring the power of language and storytelling!
          </InfoText>
        </ContentSection>
        
        <Header />
        
        <AnimatePresence>
          {loading && (
            <LoadingMessage
              initial={{ opacity: 1 }}
              exit={{ opacity: 0, transition: { duration: 0.5 } }}
            >
              Loading 3D model...
              <ProgressBar progress={progress} />
            </LoadingMessage>
          )}
        </AnimatePresence>
        
        {error && <ErrorMessage>Error: {error}</ErrorMessage>}
      </StickyContainer>
    </AppContainer>
  );
}

export default App;
