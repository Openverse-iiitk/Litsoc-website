import { useRef } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';
import styled from 'styled-components';
import { Canvas } from '@react-three/fiber';
import { Suspense } from 'react';
import usePageTransition from '../hooks/usePageTransition';
import PageTransition from '../components/PageTransition';
import ModelViewer from '../components/ModelViewer';


// Styled components for the home page
const HomeContainer = styled.div`
  width: 100%;
  height: 300vh;
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

const CanvasContainer = styled.div`
  position: absolute;
  inset: 0;
  z-index: 5;
  
  canvas {
    touch-action: none;
  }
`;

const ContentSection = styled(motion.div)`
  position: absolute;
  top: 0;
  right: 0;
  width: 40%;
  height: 100%;
  padding: 4rem;
  display: flex;
  flex-direction: column;
  justify-content: center;
  color: white;
  z-index: 10;
  
  @media (max-width: 768px) {
    width: 90%;
    padding: 2rem;
    align-items: center;
    text-align: center;
  }
`;

const HomePage: React.FC = () => {
  const { isAnimating } = usePageTransition();
  const containerRef = useRef<HTMLDivElement>(null);
  
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end end"]
  });
  
  const backgroundColor = useTransform(
    scrollYProgress,
    [0, 0.4, 0.6],
    ["#211d24", "#211d24", "#211d24"]
  );
  
  return (
    <PageTransition isActive={isAnimating}>
      <HomeContainer ref={containerRef}>
        <StickyContainer>
          <motion.div
            style={{ position: 'absolute', inset: 0, backgroundColor }}
          />
          
         
          
          <CanvasContainer>
            <Canvas
              camera={{ position: [0, 0, 5], fov: 50 }}
              dpr={window.devicePixelRatio}
            >
              <Suspense fallback={null}>
                <ModelViewer />
              </Suspense>
            </Canvas>
          </CanvasContainer>
          
          <ContentSection>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.5 }}
            >
              {/* Your content here */}
            </motion.div>
          </ContentSection>
        </StickyContainer>
      </HomeContainer>
    </PageTransition>
  );
};

export default HomePage;