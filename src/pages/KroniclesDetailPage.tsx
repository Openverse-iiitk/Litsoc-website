import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import styled from 'styled-components';
import { motion } from 'framer-motion';
import usePageTransition from '../hooks/usePageTransition';
import PageTransition from '../components/PageTransition';
import TurnJSFlipBook from '../components/TurnJSFlipBook';

// Data for each Kronicle edition
const kroniclesData = [
  {
    id: "edition1",
    title: "Edition 1",
    description: "The inaugural edition of our literary magazine, featuring poetry, prose, and artwork from our members.",
    color: "linear-gradient(135deg, #ff00cc 0%, #3333ff 100%)",
    coverImage: "/edition1.png",
    pdfPath: "/pdfs/edition1.pdf"
  },
  {
    id: "edition2",
    title: "Edition 2",
    description: "Our second literary collection showcases growth and diversity in the club's creative expressions.",
    color: "linear-gradient(135deg, #00ffcc 0%, #3333ff 100%)",
    coverImage: "/edition2.png",
    pdfPath: "/pdfs/edition2.pdf"
  }
];

// Styled Components
const PageContainer = styled.div`
  width: 100%;
  min-height: 100vh;
  background: linear-gradient(135deg, #1a0033 0%, #000011 100%);
  color: white;
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 1rem; /* Reduced from 2rem to 1rem */
  position: relative;
  overflow-x: hidden;
`;

const ContentWrapper = styled.div`
  max-width: 1400px; /* Increased from 1200px to 1400px for a wider viewer */
  width: 100%;
  padding: 2rem 1rem;
  z-index: 2;
  display: flex;
  flex-direction: column;
  align-items: center;
  position: relative;
  
  @media (max-width: 768px) {
    padding: 1rem 0.5rem;
  }
`;

const Header = styled(motion.div)<{ bgColor: string }>`
  width: 100%;
  padding: 1.5rem; /* Reduced from 2rem to 1.5rem */
  border-radius: 12px;
  background: ${props => props.bgColor};
  margin-bottom: 1rem; /* Reduced from 2rem to 1rem */
  text-align: center;
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.5);
`;

const Title = styled(motion.h1)`
  font-size: 3rem; /* Reduced from 3.5rem to 3rem */
  font-weight: 900;
  margin-bottom: 0.75rem; /* Reduced from 1rem to 0.75rem */
  color: white;
  text-shadow: 0 0 15px rgba(255, 255, 255, 0.4);
  
  @media (max-width: 768px) {
    font-size: 2.5rem;
  }
`;

const Description = styled(motion.p)`
  font-size: 1.2rem;
  line-height: 1.6;
  color: rgba(255, 255, 255, 0.9);
  margin-bottom: 1rem;
  
  @media (max-width: 768px) {
    font-size: 1rem;
  }
`;

const Button = styled(motion.button)`
  background: rgba(0, 0, 0, 0.5);
  border: 1px solid rgba(255, 255, 255, 0.2);
  color: white;
  padding: 0.8rem 1.5rem;
  border-radius: 4px;
  font-size: 1rem;
  cursor: pointer;
  margin-top: 1rem;
  font-family: 'Pixelify Sans', sans-serif;
  
  &:hover {
    background: rgba(0, 0, 0, 0.7);
  }
`;

const GridOverlay = styled.div`
  position: fixed;
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
  position: fixed;
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

const BackButton = styled(motion.button)`
  position: fixed;
  top: 2rem;
  left: 2rem;
  background: rgba(0, 0, 0, 0.5);
  border: 1px solid rgba(255, 255, 255, 0.2);
  color: white;
  padding: 0.5rem 1rem;
  border-radius: 4px;
  font-size: 0.9rem;
  cursor: pointer;
  z-index: 100;
  backdrop-filter: blur(8px);
  display: flex;
  align-items: center;
  gap: 0.5rem;
  
  &:hover {
    background: rgba(0, 0, 0, 0.7);
  }
`;

// Animation variants
const containerVariants = {
  hidden: { opacity: 0 },
  visible: { 
    opacity: 1,
    transition: { 
      duration: 0.8,
      staggerChildren: 0.3
    }
  },
  exit: { 
    opacity: 0,
    transition: { duration: 0.5 }
  }
};

const itemVariants = {
  hidden: { y: 50, opacity: 0 },
  visible: { 
    y: 0, 
    opacity: 1,
    transition: { 
      type: "spring", 
      stiffness: 100, 
      damping: 15 
    }
  }
};

const KroniclesDetailPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { isAnimating } = usePageTransition();
  const [fullPdfPath, setFullPdfPath] = useState('');
  
  // Find the kronicle data based on the ID
  const kronicle = kroniclesData.find(k => k.id === id);
  
  useEffect(() => {
    // Scroll to top when component mounts
    window.scrollTo(0, 0);
    
    // Set the full path for the PDF
    if (kronicle) {
      // In development, paths are relative to the public directory
      // In production, they are relative to the deployed root
      const path = window.location.hostname === 'localhost' 
        ? `/pdfs/${kronicle.id}.pdf` 
        : kronicle.pdfPath;
        
      setFullPdfPath(path);
      console.log('Full PDF path:', path);
    }
  }, [kronicle]);
  
  // If kronicle not found, redirect to the kronicles page
  if (!kronicle) {
    return (
      <PageContainer>
        <div style={{ color: 'white', textAlign: 'center', marginTop: '40vh' }}>
          Kronicle edition not found. Redirecting...
          {setTimeout(() => navigate('/kronicles'), 2000)}
        </div>
      </PageContainer>
    );
  }
  
  return (
    <PageTransition isActive={isAnimating}>
      <PageContainer>
        <GridOverlay />
        <NeonGlow />
        
        <BackButton 
          onClick={() => navigate('/kronicles')}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          ← Back to Kronicles
        </BackButton>
        
        <ContentWrapper
          as={motion.div}
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          exit="exit"
        >
          <Header 
            bgColor={kronicle.color}
            variants={itemVariants}
          >
            <Title>{kronicle.title}</Title>
            <Description>{kronicle.description}</Description>
            <Description style={{ fontSize: '0.9rem', opacity: 0.8, marginTop: '0.5rem' }}>
              Use the navigation controls at the bottom to flip through pages, toggle sound effects, or enter fullscreen mode.
            </Description>
            <Button 
              as="a"
              href={fullPdfPath}
              target="_blank"
              rel="noopener noreferrer"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              Open PDF Directly
            </Button>
          </Header>
          
          <motion.div variants={itemVariants} style={{ width: '100%' }}>
            <TurnJSFlipBook pdfUrl={fullPdfPath} />
          </motion.div>
        </ContentWrapper>
      </PageContainer>
    </PageTransition>
  );
};

export default KroniclesDetailPage;
