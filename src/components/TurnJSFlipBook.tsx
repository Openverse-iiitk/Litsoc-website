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
  height: 95vh; /* Increased from 90vh to 95vh for larger viewing area */
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  margin: 0; /* Removed margins to maximize space */
  position: relative;
  
  @media (max-width: 768px) {
    height: 90vh;
    margin: 0;
  }
`;

const FlipBookFrame = styled(Iframe)`
  width: 100%;
  height: 100%;
  border: none;
  border-radius: 8px; /* Reduced border-radius for more viewing area */
  box-shadow: 0 10px 20px rgba(0, 0, 0, 0.4);
  min-height: 650px; /* Increased from 600px for larger viewing area */
  
  @media (max-width: 768px) {
    min-height: 450px; /* Increased from 400px for larger viewing area */
    box-shadow: 0 8px 15px rgba(0, 0, 0, 0.4);
  }
`;

const Controls = styled.div`
  display: flex;
  align-items: center;
  margin-top: 15px;
  padding: 15px 20px;
  gap: 15px;
  flex-wrap: wrap;
  justify-content: center;
  background: rgba(0, 0, 0, 0.7);
  border-radius: 8px;
  backdrop-filter: blur(10px);
  box-shadow: 0 5px 15px rgba(0, 0, 0, 0.3);
  position: relative;
  z-index: 100;
  
  @media (max-width: 768px) {
    padding: 10px;
    gap: 10px;
  }
`;

const ControlButton = styled.button<{ disabled?: boolean }>`
  background: ${props => props.disabled ? 'rgba(50, 50, 50, 0.7)' : 'rgba(0, 0, 0, 0.7)'};
  color: ${props => props.disabled ? 'rgba(255, 255, 255, 0.5)' : 'white'};
  border: 1px solid ${props => props.disabled ? 'rgba(255, 255, 255, 0.1)' : 'rgba(255, 255, 255, 0.2)'};
  padding: 8px 16px;
  border-radius: 4px;
  cursor: ${props => props.disabled ? 'not-allowed' : 'pointer'};
  font-size: 14px;
  display: flex;
  align-items: center;
  gap: 5px;
  transition: all 0.2s;
  
  &:hover {
    background: ${props => props.disabled ? 'rgba(50, 50, 50, 0.7)' : 'rgba(51, 51, 255, 0.5)'};
    transform: ${props => props.disabled ? 'none' : 'translateY(-2px)'};
  }
  
  &:active {
    transform: ${props => props.disabled ? 'none' : 'translateY(1px)'};
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
  background: rgba(0, 0, 0, 0.4);
  padding: 5px 10px;
  border-radius: 4px;
  
  input[type="checkbox"] {
    accent-color: #3333ff;
    transform: scale(1.2);
    margin-right: 8px;
  }
`;

const PageInfo = styled.div`
  color: white;
  font-size: 14px;
  background: rgba(0, 0, 0, 0.5);
  padding: 7px 12px;
  border-radius: 4px;
  min-width: 100px;
  text-align: center;
  font-weight: bold;
`;

const ErrorContainer = styled.div`
  padding: 20px;
  background-color: rgba(255, 0, 0, 0.1);
  border-radius: 8px;
  text-align: center;
  border-left: 4px solid #ff6b6b;
  margin: 20px 0;
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
  const [initializationAttempt, setInitializationAttempt] = useState(0); // Track attempts to load
  const [loadError, setLoadError] = useState<string | null>(null);
  const [audioEnabled, setAudioEnabled] = useState(true);
  const [iframeKey, setIframeKey] = useState(Date.now().toString()); // Used to force iframe reload
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(0);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [, setIframeInitialized] = useState(false); // Track if iframe is ready
  
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
      
      if (event.data && event.data.type === 'pdfInitialized') {
        // PDF viewer is ready to receive commands
        console.log('PDF viewer initialization complete');
        setIframeInitialized(true);
        setIsLoading(false);
      } else if (event.data && event.data.type === 'pageFlipped') {
        if (audioEnabled) {
          playAudio('/audio/page-turn.mp3');
        }
        
        // Update page counter
        if (event.data.page) {
          setCurrentPage(event.data.page);
        }
        
        // Update total pages if provided
        if (event.data.totalPages && event.data.totalPages > 0) {
          setTotalPages(event.data.totalPages);
        }
      } else if (event.data && event.data.type === 'pdfLoaded') {
        console.log('PDF loaded successfully, pages:', event.data.pages);
        setIsLoading(false);
        if (event.data.pages && event.data.pages > 0) {
          setTotalPages(event.data.pages);
        }
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
        
        // Only set error if we haven't tried multiple times already
        if (initializationAttempt === 0) {
          setLoadError('Loading timed out. The PDF may be too large or there might be connection issues. Please try again or use a different viewer.');
        }
      }
    }, 15000); // Reduced from 20s to 15s
    
    return () => {
      window.removeEventListener('message', handleMessage);
      clearTimeout(loadingTimeout);
    };
  }, [audioEnabled, isLoading, initializationAttempt]);

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
      setLoadError('use your mouse to turn pages');
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
    console.log('Iframe loaded, waiting for PDF to render...');
    
    // Check if we can access the iframe content
    try {
      const iframe = iframeRef.current;
      if (iframe && iframe.contentWindow) {
        console.log('Iframe content window accessible');
        
        // Send initialization attempt number to the iframe
        // This helps the iframe know if this is a retry
        iframe.contentWindow.postMessage({ 
          type: 'initializationAttempt', 
          attempt: initializationAttempt 
        }, '*');
        
        // Send audio state immediately
        iframe.contentWindow.postMessage({ 
          type: 'audioToggle', 
          enabled: audioEnabled 
        }, '*');
        
        // Check iframe status after a short delay
        setTimeout(() => {
          if (isLoading && iframe && iframe.contentWindow) {
            // Send a ping to check if iframe is responsive
            iframe.contentWindow.postMessage({ type: 'ping' }, '*');
            
            // Force navigation commands to be initialized
            iframe.contentWindow.postMessage({
              type: 'initNavigation'
            }, '*');
          }
        }, 2000);
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
        console.log(`Sending navigation command: ${direction}`);
        iframe.contentWindow.postMessage({ 
          type: 'navigate', 
          direction 
        }, '*');
        
        // Additionally play sound locally if enabled
        // This ensures sound plays even if iframe communication fails
        if (audioEnabled && direction) {
          playAudio('/audio/page-turn.mp3');
        }
        
        // Update page counter locally even if iframe doesn't respond
        if (direction === 'prev' && currentPage > 1) {
          setCurrentPage(prev => prev - 1);
        } else if (direction === 'next' && currentPage < totalPages) {
          setCurrentPage(prev => prev + 1);
        }
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
        <ErrorContainer style={{ backgroundColor: 'rgba(0, 0, 0, 0.7)', border: 'none' }}>
          <Spinner />
          <h3>Loading PDF Flipbook...</h3>
          <p>Please wait while we prepare your interactive reading experience</p>
          <p style={{ fontSize: '14px', marginTop: '10px', opacity: '0.7' }}>
            This may take a moment for large PDFs
          </p>
          {initializationAttempt > 0 && (
            <p style={{ fontSize: '12px', marginTop: '15px', opacity: '0.8' }}>
              Attempt {initializationAttempt+1} to load the PDF viewer...
            </p>
          )}
        </ErrorContainer>
      )}
      
      {loadError ? (
        <ErrorContainer>
          <h3>Loading PDF</h3>
          <p>{loadError}</p>
          <p>Press the button below to open the pdf.</p>
          <details style={{ marginTop: '10px', textAlign: 'left', fontSize: '12px', cursor: 'pointer' }}>
            <summary>Technical Details</summary>
            <p>PDF URL: {pdfUrl}</p>
            <p>Viewer URL: {viewerUrl}</p>
            <p>Attempt: {initializationAttempt + 1}</p>
            <p>Time: {new Date().toLocaleString()}</p>
          </details>
          <div style={{ display: 'flex', gap: '10px', justifyContent: 'center', marginTop: '15px' }}>
            <button 
              onClick={() => {
                setLoadError(null);
                setIsLoading(true);
                setInitializationAttempt(prev => prev + 1);
                // Force iframe reload by resetting the key
                setIframeKey(Date.now().toString());
                
                // Reset state
                setCurrentPage(1);
                setTotalPages(0);
                setIframeInitialized(false);
              }}
              style={{
                background: 'rgba(0, 0, 0, 0.7)',
                color: 'white',
                border: '1px solid rgba(255, 255, 255, 0.2)',
                padding: '8px 16px',
                borderRadius: '4px',
                cursor: 'pointer'
              }}
            >
              Open PDF
            </button>
            <a 
              href={pdfUrl}
              target="_blank"
              rel="noopener noreferrer"
              style={{
                background: 'rgba(51, 51, 255, 0.5)',
                color: 'white',
                border: '1px solid rgba(255, 255, 255, 0.2)',
                padding: '8px 16px',
                borderRadius: '4px',
                cursor: 'pointer',
                textDecoration: 'none',
                display: 'inline-block'
              }}
            >
              Open PDF Directly
            </a>
          </div>
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
      {/* Bottom controls removed to maximize reading area */}
    </BookContainer>
  );
};

export default TurnJSFlipBook;
