import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { motion, AnimatePresence } from 'framer-motion';
import { playAudio } from '../utils/audioUtils';

interface PDFFlipBookProps {
  pdfUrl: string;
}

const BookContainer = styled(motion.div)`
  width: 100%;
  height: 80vh;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  margin: 2rem auto;
`;

const FlipBookContainer = styled.div`
  width: 100%;
  height: 100%;
  max-width: 1000px;
  margin: 0 auto;
  position: relative;
  overflow: hidden;
  border-radius: 12px;
  box-shadow: 0 15px 30px rgba(0, 0, 0, 0.6);
  background-color: #f5f5f5;
`;

const PDFFrame = styled.iframe`
  width: 100%;
  height: 100%;
  border: none;
`;

const Controls = styled.div`
  display: flex;
  justify-content: center;
  margin-top: 1rem;
  gap: 1rem;
  flex-wrap: wrap;
`;

const Button = styled.button`
  background: rgba(0, 0, 0, 0.7);
  color: white;
  border: none;
  border-radius: 4px;
  padding: 0.5rem 1rem;
  cursor: pointer;
  font-family: 'Pixelify Sans', sans-serif;
  transition: all 0.2s ease;
  
  &:hover {
    background: rgba(0, 0, 0, 0.9);
    transform: translateY(-2px);
  }
  
  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
    transform: none;
  }
`;

const PageCorner = styled.div<{ side: 'left' | 'right' }>`
  position: absolute;
  top: 0;
  ${props => props.side === 'left' ? 'left: 0;' : 'right: 0;'}
  width: 15%;
  height: 100%;
  cursor: pointer;
  z-index: 10;
  background: linear-gradient(
    ${props => props.side === 'left' ? 'to right' : 'to left'},
    rgba(0, 0, 0, 0.1) 0%,
    rgba(0, 0, 0, 0) 100%
  );
  opacity: 0;
  transition: opacity 0.3s ease;

  &:hover {
    opacity: 0.5;
  }
  
  &:before {
    content: "${props => props.side === 'left' ? '←' : '→'}";
    position: absolute;
    top: 50%;
    ${props => props.side === 'left' ? 'left: 20px;' : 'right: 20px;'}
    transform: translateY(-50%);
    font-size: 2rem;
    color: white;
    text-shadow: 0 0 10px rgba(0, 0, 0, 0.5);
  }
`;

const LoadingOverlay = styled.div`
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  background-color: rgba(245, 245, 245, 0.9);
  color: #333;
  z-index: 10;
  font-family: 'Pixelify Sans', sans-serif;
  font-size: 1.2rem;
`;

const Spinner = styled.div`
  border: 5px solid rgba(0, 0, 0, 0.1);
  border-radius: 50%;
  border-top: 5px solid #333;
  width: 40px;
  height: 40px;
  animation: spin 1s linear infinite;
  margin-bottom: 15px;

  @keyframes spin {
    0% { transform: rotate(0deg); }
    100% { transform: rotate(360deg); }
  }
`;

const ErrorMessage = styled.div`
  padding: 20px;
  background-color: rgba(255, 0, 0, 0.1);
  border-radius: 8px;
  text-align: center;
  border-left: 4px solid #ff6b6b;
  margin: 20px 0;
  color: #333;
`;

// Animation for page turning
const pageFlipAnimation = {
  initial: {
    opacity: 0,
    rotateY: -90,
  },
  animate: {
    opacity: 1,
    rotateY: 0,
    transition: {
      duration: 0.5,
    },
  },
  exit: {
    opacity: 0,
    rotateY: 90,
    transition: {
      duration: 0.5,
    },
  },
};

const SimplePDFFlipBook: React.FC<PDFFlipBookProps> = ({ pdfUrl }) => {
  const [currentPage, setCurrentPage] = useState(1);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [totalPages, setTotalPages] = useState<number | null>(null);
  const [audioEnabled, setAudioEnabled] = useState(true);
  
  // Pre-load audio
  useEffect(() => {
    if (audioEnabled) {
      try {
        const audio = new Audio('/audio/page-turn.mp3');
        audio.preload = 'auto';
        audio.load();
      } catch (err) {
        console.warn('Could not preload audio:', err);
      }
    }
    
    // Set a maximum loading time
    const timeout = setTimeout(() => {
      if (loading) {
        setLoading(false);
        if (!error) {
          setError('PDF loading timed out. You can try refreshing the page or using another viewer option.');
        }
      }
    }, 10000);
    
    return () => clearTimeout(timeout);
  }, [loading, error, audioEnabled]);
  
  // Play flip sound when changing pages
  const handlePageTurn = (direction: 'prev' | 'next') => {
    if (audioEnabled) {
      playAudio('/audio/page-turn.mp3');
    }
    
    if (direction === 'prev' && currentPage > 1) {
      setCurrentPage(currentPage - 1);
    } else if (direction === 'next') {
      // If we know the total pages, check that we're not on the last page
      if (totalPages === null || currentPage < totalPages) {
        setCurrentPage(currentPage + 1);
      }
    }
  };
  
  // Handle iframe load
  const handleIframeLoad = (event: React.SyntheticEvent<HTMLIFrameElement>) => {
    try {
      setLoading(false);
      
      // Try to determine total pages (this may not work with all PDFs)
      const iframe = event.currentTarget;
      if (iframe.contentWindow) {
        // This is a very simplistic approach that might not work with all PDFs
        const pdfViewer = iframe.contentWindow.document.querySelector('.pdfViewer');
        if (pdfViewer) {
          const pageCount = pdfViewer.querySelectorAll('.page').length;
          if (pageCount > 0) {
            setTotalPages(pageCount);
          }
        }
      }
    } catch (err) {
      console.error('Error in iframe load handler:', err);
    }
  };
  
  // Handle iframe errors
  const handleIframeError = () => {
    setLoading(false);
    setError('Failed to load the PDF. Please try another viewer option or open the PDF directly.');
  };
  
  // Function to jump to a specific page
  const jumpToPage = (page: number) => {
    if (page >= 1 && (totalPages === null || page <= totalPages)) {
      if (audioEnabled) {
        playAudio('/audio/page-turn.mp3');
      }
      setCurrentPage(page);
    }
  };
  
  return (
    <BookContainer
      initial={{ opacity: 0, y: 50 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.8 }}
    >
      {error ? (
        <ErrorMessage>
          <h3>PDF Viewer Error</h3>
          <p>{error}</p>
          <p>Please try another viewer option or open the PDF directly.</p>
        </ErrorMessage>
      ) : (
        <FlipBookContainer>
          {loading && (
            <LoadingOverlay>
              <Spinner />
              <div>Loading PDF...</div>
            </LoadingOverlay>
          )}
          
          <AnimatePresence mode="wait">
            <motion.div
              key={currentPage}
              variants={pageFlipAnimation}
              initial="initial"
              animate="animate"
              exit="exit"
              style={{ width: '100%', height: '100%' }}
            >
              <PDFFrame 
                src={`${pdfUrl}#page=${currentPage}`} 
                title={`PDF Page ${currentPage}`}
                onLoad={handleIframeLoad}
                onError={handleIframeError}
              />
            </motion.div>
          </AnimatePresence>
          
          <PageCorner 
            side="left" 
            onClick={() => handlePageTurn('prev')}
          />
          <PageCorner 
            side="right" 
            onClick={() => handlePageTurn('next')}
          />
        </FlipBookContainer>
      )}
      
      <Controls>
        <Button 
          onClick={() => handlePageTurn('prev')}
          disabled={currentPage <= 1 || !!error}
        >
          Previous Page
        </Button>
        
        <div style={{ 
          display: 'flex',
          alignItems: 'center',
          padding: '0.5rem 1rem',
          background: 'rgba(0, 0, 0, 0.7)',
          borderRadius: '4px',
          color: 'white',
          fontFamily: 'Pixelify Sans, sans-serif'
        }}>
          Page {currentPage}{totalPages ? ` of ${totalPages}` : ''}
        </div>
        
        <Button 
          onClick={() => handlePageTurn('next')}
          disabled={totalPages !== null && currentPage >= totalPages || !!error}
        >
          Next Page
        </Button>
        
        {totalPages && totalPages > 10 && (
          <Button 
            onClick={() => {
              const page = prompt(`Enter page number (1-${totalPages}):`, currentPage.toString());
              if (page) {
                const pageNum = parseInt(page, 10);
                if (!isNaN(pageNum)) {
                  jumpToPage(pageNum);
                }
              }
            }}
            disabled={!!error}
          >
            Jump to Page
          </Button>
        )}
      </Controls>
      
      <div style={{ display: 'flex', alignItems: 'center', marginTop: '10px' }}>
        <input
          type="checkbox"
          id="audio-toggle-simple"
          checked={audioEnabled}
          onChange={(e) => setAudioEnabled(e.target.checked)}
          style={{ marginRight: '8px' }}
        />
        <label htmlFor="audio-toggle-simple" style={{ color: 'white', fontSize: '14px' }}>
          Page flip sound effects
        </label>
      </div>
    </BookContainer>
  );
};

export default SimplePDFFlipBook;
