import { useRef, useState, useEffect } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';
import styled, { keyframes } from 'styled-components';
import { Canvas } from '@react-three/fiber';
import { Suspense } from 'react';
import usePageTransition from '../hooks/usePageTransition';
import PageTransition from '../components/PageTransition';
import ModelViewer from '../components/ModelViewer';
import BackgroundParticles from '../components/BackgroundParticles';


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

const BackgroundGlow = styled.div`
  position: absolute;
  width: 100%;
  height: 100%;
  background: radial-gradient(circle at 50% 50%, rgba(255, 0, 255, 0.15), transparent 60%),
              radial-gradient(circle at 85% 30%, rgba(0, 255, 255, 0.1), transparent 50%);
  pointer-events: none;
  z-index: 6;
  opacity: 0.7;
  mix-blend-mode: screen;
`;

const ShimmerEffect = styled(motion.div)`
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: linear-gradient(
    45deg,
    transparent 0%,
    rgba(255, 255, 255, 0.03) 50%,
    transparent 100%
  );
  pointer-events: none;
  z-index: 7;
  mix-blend-mode: overlay;
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
  top: 2rem;
  right: 2rem;
  width: auto;
  display: flex;
  flex-direction: column;
  align-items: flex-end;
  color: white;
  z-index: 10;
  
  @media (max-width: 768px) {
    top: 1rem;
    right: 1rem;
    align-items: flex-end;
    text-align: right;
  }
`;

const FooterText = styled(motion.div)`
  position: absolute;
  bottom: 1rem;
  left: 0;
  right: 0;
  text-align: center;
  font-family: 'Pixelify Sans', sans-serif;
  font-size: 14px;
  color: white;
  z-index: 10;
  letter-spacing: 1px;
`;

// Create a shimmer animation keyframe
const textShimmer = keyframes`
  0% { text-shadow: 0 0 4px rgba(255, 105, 180, 0.7), 0 0 10px rgba(255, 105, 180, 0.5); }
  25% { text-shadow: 0 0 4px rgba(0, 255, 255, 0.7), 0 0 10px rgba(0, 255, 255, 0.5); }
  50% { text-shadow: 0 0 4px rgba(127, 0, 255, 0.7), 0 0 10px rgba(127, 0, 255, 0.5); }
  75% { text-shadow: 0 0 4px rgba(255, 255, 0, 0.7), 0 0 10px rgba(255, 255, 0, 0.5); }
  100% { text-shadow: 0 0 4px rgba(255, 105, 180, 0.7), 0 0 10px rgba(255, 105, 180, 0.5); }
`;

// Add this to make the heart animation
const HeartBeat = styled.span`
  display: inline-block;
  color: #ff3366;
  animation: heartbeat 1.5s infinite;
  
  @keyframes heartbeat {
    0%, 100% { transform: scale(1); }
    50% { transform: scale(1.2); }
  }
`;

const HomePage: React.FC = () => {
  const { isAnimating } = usePageTransition();
  const containerRef = useRef<HTMLDivElement>(null);
  
  // Add this state for responsive design
  const [isMobile, setIsMobile] = useState(window.innerWidth <= 768);
  
  // Add this effect to handle window resizing
  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth <= 768);
    };
    
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end end"]
  });
  
  const backgroundColor = useTransform(
    scrollYProgress,
    [0, 0.4, 0.6],
    ["#0a010f", "#0a010f", "#0a010f"]
  );
  
  return (
    <PageTransition isActive={isAnimating}>
      <HomeContainer ref={containerRef}>
        <StickyContainer>
          <motion.div
            style={{ position: 'absolute', inset: 0, backgroundColor }}
          />
          
          <BackgroundGlow />
          <ShimmerEffect 
            animate={{
              x: ["0%", "100%"],
              opacity: [0.2, 0.5, 0.2]
            }}
            transition={{
              duration: 8,
              repeat: Infinity,
              ease: "linear"
            }}
          />
          
          <BackgroundParticles />
          
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
              <motion.h1 
                style={{ 
                  fontFamily: 'Pixelify Sans',
                  marginBottom: '1rem',
                  textShadow: '0 0 10px rgba(255, 0, 255, 0.8)',
                  fontSize: '2rem'
                }}
                animate={{ 
                  textShadow: ['0 0 5px rgba(255, 0, 255, 0.8)', '0 0 15px rgba(255, 0, 255, 0.8)', '0 0 5px rgba(255, 0, 255, 0.8)'] 
                }}
                transition={{ 
                  duration: 2, 
                  repeat: Infinity,
                  ease: "easeInOut" 
                }}
              >
                
              </motion.h1>
              
              <motion.div
                style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap', justifyContent: 'flex-end' }}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 1, duration: 0.6 }}
              >
                <motion.button
                  style={{
                    background: 'rgba(106, 17, 203, 0.3)',
                    backdropFilter: 'blur(5px)',
                    border: '1px solid rgba(255, 255, 255, 0.2)',
                    padding: isMobile ? '0.5rem 1rem' : '0.75rem 1.5rem',
                    borderRadius: '4px',
                    color: 'white',
                    fontFamily: 'Pixelify Sans',
                    cursor: 'pointer',
                    position: 'relative',
                    overflow: 'hidden',
                    fontSize: isMobile ? '0.9rem' : '1.2rem'
                  }}
                  whileHover={{ 
                    scale: 1.05,
                    boxShadow: '0 0 15px rgba(255, 0, 255, 0.7)' 
                  }}
                  whileTap={{ scale: 0.98 }}
                >
                  <motion.span
                    style={{
                      position: 'absolute',
                      top: 0,
                      left: 0,
                      width: '100%',
                      height: '100%',
                      background: 'linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.2), transparent)',
                      transform: 'translateX(-100%)'
                    }}
                    animate={{ translateX: ['100%', '-100%'] }}
                    transition={{ 
                      duration: 1.5, 
                      repeat: Infinity,
                      repeatDelay: 0.5,
                      ease: "easeInOut"
                    }}
                  />
                  Explore Events
                </motion.button>
                
                <motion.button
                  style={{
                    background: 'rgba(0, 0, 0, 0.3)',
                    backdropFilter: 'blur(5px)',
                    border: '1px solid rgba(255, 255, 255, 0.2)',
                    padding: isMobile ? '0.5rem 1rem' : '0.75rem 1.5rem',
                    borderRadius: '4px',
                    color: 'white',
                    fontFamily: 'Pixelify Sans',
                    cursor: 'pointer',
                    position: 'relative',
                    overflow: 'hidden',
                    fontSize: isMobile ? '0.9rem' : '1.2rem'
                  }}
                  whileHover={{ 
                    scale: 1.05,
                    boxShadow: '0 0 15px rgba(0, 255, 255, 0.7)' 
                  }}
                  whileTap={{ scale: 0.98 }}
                >
                  <motion.span
                    style={{
                      position: 'absolute',
                      top: 0,
                      left: 0,
                      width: '100%',
                      height: '100%',
                      background: 'linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.2), transparent)',
                      transform: 'translateX(-100%)'
                    }}
                    animate={{ translateX: ['100%', '-100%'] }}
                    transition={{ 
                      duration: 1.5, 
                      repeat: Infinity,
                      repeatDelay: 0.8,
                      ease: "easeInOut"
                    }}
                  />
                  Join Us
                </motion.button>
              </motion.div>
            </motion.div>
          </ContentSection>

          <FooterText
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 1, delay: 2 }}
          >
            Made with <HeartBeat>❤️</HeartBeat> by Openverse
          </FooterText>
        </StickyContainer>
      </HomeContainer>
    </PageTransition>
  );
};

export default HomePage;