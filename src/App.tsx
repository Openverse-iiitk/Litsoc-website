import { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import styled, { keyframes } from 'styled-components';
import { motion, AnimatePresence } from 'framer-motion';
import Navigation from './components/Navigation';
import HomePage from './pages/HomePage';
import LegacyPage from './pages/LegacyPage';
import KroniclesPage from './pages/KroniclesPage';
import SubclubsPage from './pages/SubclubsPage';
import GalleryPage from './pages/GalleryPage';

// Styled components
const AppWrapper = styled.div`
  position: relative;
  width: 100%;
  min-height: 100vh;
  background-color: var(--bg-color);
  color: var(--text-color);
`;

const LoadingScreen = styled(motion.div)`
  position: fixed;
  inset: 0;
  background-color: var(--bg-color);
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  z-index: 9999;
`;

const LoadingTitle = styled.h2`
  font-family: var(--font-heading);
  font-size: 2rem;
  margin-bottom: 1.5rem;
  text-transform: uppercase;
  letter-spacing: 3px;
  background: var(--gradient-primary);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  text-shadow: 0 0 15px rgba(106, 17, 203, 0.3);
`;

const LoadingProgressBar = styled.div<{ progress: number }>`
  width: 300px;
  height: 10px;
  background-color: rgba(255, 255, 255, 0.1);
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
    background: var(--gradient-primary);
    border-radius: 5px;
    transition: width 0.3s ease-in-out;
  }
`;

function App() {
  const [loading, setLoading] = useState(true);
  const [progress, setProgress] = useState(0);
  
  useEffect(() => {
    const timer = setInterval(() => {
      setProgress(prev => {
        if (prev >= 100) {
          clearInterval(timer);
          setTimeout(() => setLoading(false), 500);
          return 100;
        }
        return prev + 2;
      });
    }, 50);

    return () => clearInterval(timer);
  }, []);
  
  return (
    <AppWrapper>
      <Router>
        <Navigation />
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/legacy" element={<LegacyPage />} />
          <Route path="/kronicles" element={<KroniclesPage />} />
          <Route path="/subclubs" element={<SubclubsPage />} />
          <Route path="/gallery" element={<GalleryPage />} />
        </Routes>
      </Router>
      
      <AnimatePresence>
        {loading && (
          <LoadingScreen
            initial={{ opacity: 1 }}
            exit={{ opacity: 0, transition: { duration: 0.8 } }}
          >
            <LoadingTitle>Literary Society</LoadingTitle>
            <LoadingProgressBar progress={progress} />
          </LoadingScreen>
        )}
      </AnimatePresence>
    </AppWrapper>
  );
}

export default App;
