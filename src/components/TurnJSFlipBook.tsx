import React, { useEffect, useRef, useState } from 'react';
import styled from 'styled-components';
import Iframe from 'react-iframe';
import { motion } from 'framer-motion';
import { playAudio } from '../utils/audioUtils';

interface TurnJSFlipBookProps {
  pdfUrl: string;
}

const BookContainer = styled(motion.div)`
  width: 100%;
  height: 90vh; /* Increased from 80vh to 90vh */
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  margin: 0.5rem auto; /* Reduced top/bottom margin from 1rem to 0.5rem */
  position: relative;
  
  @media (max-width: 768px) {
    height: 85vh;
    margin: 0.25rem auto;
  }
`;

const FlipBookFrame = styled(Iframe)`
  width: 100%;
  height: 100%;
  border: none;
  border-radius: 12px;
  box-shadow: 0 15px 30px rgba(0, 0, 0, 0.6);
  min-height: 600px; /* Ensure minimum height on smaller screens */
  
  @media (max-width: 768px) {
    min-height: 400px;
    box-shadow: 0 10px 20px rgba(0, 0, 0, 0.5);
  }
`;

const Controls = styled.div`
  display: flex;
  align-items: center;
  margin-top: 15px;
  gap: 15px;
  flex-wrap: wrap;
  justify-content: center;
  background: rgba(0, 0, 0, 0.5);
  padding: 10px 20px;
  border-radius: 8px;
  backdrop-filter: blur(10px);
`;

const ControlButton = styled.button`
  background: rgba(0, 0, 0, 0.7);
  color: white;
  border: none;
  padding: 8px 16px;
  border-radius: 4px;
  cursor: pointer;
  font-size: 14px;
  display: flex;
  align-items: center;
  gap: 5px;
  transition: all 0.2s;
  
  &:hover {
    background: rgba(51, 51, 255, 0.5);
  }
  
  svg {
    width: 16px;
    height: 16px;
  }
`;

const AudioToggle = styled.div`
  display: flex;
  align-items: center;
  color: white;
  font-size: 14px;
`;

const PageInfo = styled.div`
  color: white;
  font-size: 14px;
  background: rgba(0, 0, 0, 0.5);
  padding: 5px 10px;
  border-radius: 4px;
`;

const ErrorContainer = styled.div`
  padding: 20px;
  background-color: rgba(255, 0, 0, 0.1);
  border-radius: 8px;
  text-align: center;
  border-left: 4px solid #ff6b6b;
  margin: 20px 0;
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
  background-color: rgba(0, 0, 0, 0.7);
  border-radius: 12px;
  color: white;
  z-index: 10;
`;

const Spinner = styled.div`
  border: 5px solid rgba(255, 255, 255, 0.2);
  border-radius: 50%;
  border-top: 5px solid white;
  width: 50px;
  height: 50px;
  animation: spin 1s linear infinite;
  margin-bottom: 20px;

  @keyframes spin {
    0% { transform: rotate(0deg); }
    100% { transform: rotate(360deg); }
  }
`;

const TurnJSFlipBook: React.FC<TurnJSFlipBookProps> = ({ pdfUrl }) => {
  const iframeRef = useRef<any>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [loadError, setLoadError] = useState<string | null>(null);
  const [audioEnabled, setAudioEnabled] = useState(true);
  const [iframeKey, setIframeKey] = useState(Date.now().toString()); // Used to force iframe reload
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(0);
  const [isFullscreen, setIsFullscreen] = useState(false);
  
  // When the component mounts, we'll need to set up a way to communicate with the iframe
  useEffect(() => {
    // Pre-load the audio file
    if (audioEnabled) {
      try {
        const audio = new Audio('/audio/page-turn.mp3');
        audio.preload = 'auto';
        audio.load();
      } catch (error) {
        console.warn('Could not preload audio:', error);
      }
    }
    
    // Function to handle messages from the iframe
    const handleMessage = (event: MessageEvent) => {
      console.log('Received message from iframe:', event.data);
      
      if (event.data && event.data.type === 'pageFlipped') {
        if (audioEnabled) {
          playAudio('/audio/page-turn.mp3');
        }
        setCurrentPage(event.data.page || 1);
      } else if (event.data && event.data.type === 'pdfLoaded') {
        console.log('PDF loaded successfully, pages:', event.data.pages);
        setIsLoading(false);
        setTotalPages(event.data.pages || 0);
      } else if (event.data && event.data.type === 'pdfError') {
        console.error('PDF error received:', event.data.message);
        setLoadError(event.data.message || 'Could not load PDF');
        setIsLoading(false);
      } else if (event.data && event.data.type === 'fullscreenChange') {
        console.log('Fullscreen state changed:', event.data.isFullscreen);
        setIsFullscreen(event.data.isFullscreen);
      }
    };

    window.addEventListener('message', handleMessage);
    
    // Set a timeout to clear the loading state even if we don't get a callback
    const loadingTimeout = setTimeout(() => {
      if (isLoading) {
        console.warn('PDF viewer loading timeout reached');
        setIsLoading(false);
        setLoadError('Loading timed out. The PDF may be too large or there might be connection issues. Please try again or use a different viewer.');
      }
    }, 20000);
    
    return () => {
      window.removeEventListener('message', handleMessage);
      clearTimeout(loadingTimeout);
    };
  }, [audioEnabled, isLoading]);

  // Function to handle audio toggle
  useEffect(() => {
    // When audioEnabled changes, we need to notify the iframe
    try {
      const iframe = iframeRef.current;
      if (iframe && iframe.contentWindow) {
        iframe.contentWindow.postMessage({ 
          type: 'audioToggle', 
          enabled: audioEnabled 
        }, '*');
      }
    } catch (error) {
      console.error('Error sending audio toggle command:', error);
    }
  }, [audioEnabled]);

  // Validate PDF URL
  useEffect(() => {
    if (!pdfUrl) {
      setLoadError('No PDF URL provided');
      setIsLoading(false);
      return;
    }

    // Check if the URL is accessible
    const checkUrl = async () => {
      try {
        const response = await fetch(pdfUrl, { method: 'HEAD' });
        if (!response.ok) {
          setLoadError(`PDF file not accessible (${response.status}: ${response.statusText})`);
          setIsLoading(false);
        }
      } catch (error) {
        console.warn('Could not verify PDF URL:', error);
        // Don't set error here, let the iframe handle it
      }
    };

    checkUrl();
  }, [pdfUrl]);

  // Function to handle iframe load event
  const handleIframeLoad = () => {
    // Give it a bit more time for the PDF to load within the iframe
    // The actual loading status will be communicated via postMessage
    console.log('Iframe loaded, waiting for PDF to render...');
    
    // Check if we can access the iframe content
    try {
      const iframe = iframeRef.current;
      if (iframe && iframe.contentWindow) {
        console.log('Iframe content window accessible');
        
        // Attempt to send a test message to the iframe
        iframe.contentWindow.postMessage({ type: 'test' }, '*');
      } else {
        console.warn('Iframe content window not accessible');
      }
    } catch (error) {
      console.error('Error accessing iframe content:', error);
    }
  };
  
  // Function to handle page navigation commands
  const navigateToPage = (direction: 'prev' | 'next') => {
    try {
      const iframe = iframeRef.current;
      if (iframe && iframe.contentWindow) {
        iframe.contentWindow.postMessage({ 
          type: 'navigate', 
          direction 
        }, '*');
      }
    } catch (error) {
      console.error('Error sending navigation command:', error);
    }
  };
  
  // Effect to track fullscreen changes
  useEffect(() => {
    const handleFullscreenChange = () => {
      setIsFullscreen(!!document.fullscreenElement);
    };
    
    document.addEventListener('fullscreenchange', handleFullscreenChange);
    return () => document.removeEventListener('fullscreenchange', handleFullscreenChange);
  }, []);

  // Construct the URL for the PDF viewer
  const viewerUrl = `/pdf-viewer/custom-viewer.html?file=${encodeURIComponent(pdfUrl)}`;

  return (
    <BookContainer
      initial={{ opacity: 0, y: 50 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.8 }}
    >
      {isLoading && (
        <LoadingOverlay>
          <Spinner />
          <p>Loading PDF Flipbook...</p>
          <p style={{ fontSize: '14px', marginTop: '10px', opacity: '0.8' }}>
            Please wait while we prepare your interactive reading experience
          </p>
        </LoadingOverlay>
      )}
      
      {loadError ? (
        <ErrorContainer>
          <h3>Error Loading PDF</h3>
          <p>{loadError}</p>
          <p>Try using another viewer option or opening the PDF directly.</p>
          <details style={{ marginTop: '10px', textAlign: 'left', fontSize: '12px', cursor: 'pointer' }}>
            <summary>Technical Details</summary>
            <p>PDF URL: {pdfUrl}</p>
            <p>Viewer URL: {viewerUrl}</p>
            <p>Time: {new Date().toLocaleString()}</p>
          </details>
          <button 
            onClick={() => {
              setLoadError(null);
              setIsLoading(true);
              // Force iframe reload by resetting the key
              setIframeKey(Date.now().toString());
            }}
            style={{
              background: 'rgba(0, 0, 0, 0.7)',
              color: 'white',
              border: 'none',
              padding: '8px 16px',
              borderRadius: '4px',
              cursor: 'pointer',
              marginTop: '10px'
            }}
          >
            Try Again
          </button>
        </ErrorContainer>
      ) : (
        <FlipBookFrame
          url={viewerUrl}
          width="100%"
          height="100%"
          id="pdf-flipbook"
          key={iframeKey}
          frameBorder={0}
          styles={{ borderRadius: '12px' }}
          ref={iframeRef}
          allowFullScreen
          onLoad={handleIframeLoad}
        />
      )}
      
      <Controls>
        <ControlButton onClick={() => navigateToPage('prev')} disabled={currentPage <= 1}>
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M15 18L9 12L15 6" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
          Previous
        </ControlButton>
        
        <PageInfo>
          Page {currentPage} of {totalPages}
        </PageInfo>
        
        <ControlButton onClick={() => navigateToPage('next')} disabled={currentPage >= totalPages}>
          Next
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M9 6L15 12L9 18" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
        </ControlButton>
        
        <AudioToggle>
          <input
            type="checkbox"
            id="audio-toggle"
            checked={audioEnabled}
            onChange={(e) => setAudioEnabled(e.target.checked)}
            style={{ marginRight: '8px' }}
          />
          <label htmlFor="audio-toggle">
            Sound Effects
          </label>
        </AudioToggle>
        
        <ControlButton 
          onClick={() => {
            try {
              const iframe = iframeRef.current;
              if (iframe && iframe.contentWindow) {
                // Send fullscreen message to iframe
                iframe.contentWindow.postMessage({ 
                  type: 'fullscreen'
                }, '*');
              } else if (iframe && iframe.node) {
                // Fallback to direct fullscreen API on the iframe element
                if (document.fullscreenElement) {
                  document.exitFullscreen();
                } else {
                  const iframeElement: HTMLIFrameElement = iframe.node as HTMLIFrameElement;
                  iframeElement.requestFullscreen().catch((err: Error) => {
                    console.error('Could not enter fullscreen mode:', err);
                  });
                }
              }
            } catch (error) {
              console.error('Error with fullscreen command:', error);
            }
          }}
        >
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            {isFullscreen ? (
              <>
                <path d="M8 3H5V6" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                <path d="M16 3H19V6" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                <path d="M8 21H5V18" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                <path d="M16 21H19V18" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              </>
            ) : (
              <>
                <path d="M4 8V4H8" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                <path d="M4 16V20H8" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                <path d="M16 4H20V8" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                <path d="M16 20H20V16" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              </>
            )}
          </svg>
          {isFullscreen ? 'Exit Fullscreen' : 'Fullscreen'}
        </ControlButton>
      </Controls>
    </BookContainer>
  );
};

export default TurnJSFlipBook;
