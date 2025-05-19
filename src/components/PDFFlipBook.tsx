import React, { useState, useRef, useEffect } from 'react';
import { Document, Page, pdfjs } from 'react-pdf';
import styled from 'styled-components';
import { motion } from 'framer-motion';
import HTMLFlipBook from 'react-pageflip';

import 'react-pdf/dist/esm/Page/AnnotationLayer.css';
import 'react-pdf/dist/esm/Page/TextLayer.css';

// Set the worker source for react-pdf
pdfjs.GlobalWorkerOptions.workerSrc = `//unpkg.com/pdfjs-dist@${pdfjs.version}/build/pdf.worker.min.js`;

interface PDFFlipBookProps {
  pdfUrl: string;
}

interface BookRef {
  pageFlip: () => {
    flipPrev: () => void;
    flipNext: () => void;
  };
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
  display: flex;
  justify-content: center;
  align-items: center;
`;

const PageWrapper = styled.div`
  background-color: #fff;
  border-radius: 4px;
  box-shadow: 0 15px 25px rgba(0, 0, 0, 0.5);
  padding: 10px;
  position: relative;
  width: 100%;
  height: 100%;
  display: flex;
  justify-content: center;
  align-items: center;

  &:after {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background: linear-gradient(
      135deg,
      rgba(255, 255, 255, 0.2) 0%,
      rgba(255, 255, 255, 0) 50%,
      rgba(0, 0, 0, 0.1) 100%
    );
    pointer-events: none;
  }
`;

const Controls = styled.div`
  display: flex;
  justify-content: center;
  margin-top: 1rem;
  gap: 1rem;
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

const PageIndicator = styled.div`
  color: white;
  font-family: 'Pixelify Sans', sans-serif;
  padding: 0.5rem 1rem;
  border-radius: 4px;
  background: rgba(0, 0, 0, 0.7);
`;

const PDFFlipBook: React.FC<PDFFlipBookProps> = ({ pdfUrl }) => {
  const [error, setError] = useState<string | null>(null);
  const [numPages, setNumPages] = useState<number | null>(null);
  const [pageNumber, setPageNumber] = useState<number>(1);
  const [loading, setLoading] = useState<boolean>(true);
  const [pageWidth, setPageWidth] = useState<number>(600);
  const [pageHeight, setPageHeight] = useState<number>(800);
  
  const bookRef = useRef<BookRef>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  // Function to handle document loading
  const onDocumentLoadSuccess = ({ numPages }: { numPages: number }) => {
    setNumPages(numPages);
    setNumPages(numPages);
    setLoading(false);
    setError(null);
    
    // No need to pre-render pages, they'll be rendered in the HTMLFlipBook component
  };

  const onDocumentLoadError = (error: Error) => {
    console.error('Error loading PDF:', error);
    setError(`Failed to load PDF: ${error.message}`);
    setLoading(false);
  };

  useEffect(() => {
    // Log PDF URL for debugging
    console.log('PDF URL:', pdfUrl);
    
    // Check if URL is accessible
    fetch(pdfUrl)
      .then(response => {
        if (!response.ok) {
          setError(`PDF fetch failed: ${response.status} ${response.statusText}`);
          console.error('PDF fetch failed:', response.status, response.statusText);
        } else {
          console.log('PDF fetch successful');
        }
      })
      .catch(err => {
        setError(`PDF fetch error: ${err.message}`);
        console.error('PDF fetch error:', err);
      });
      
    const updateDimensions = () => {
      if (containerRef.current) {
        const containerWidth = containerRef.current.clientWidth;
        // Adjust page size based on container width
        const newWidth = Math.min(containerWidth / 2 - 40, 600);
        setPageWidth(newWidth);
        setPageHeight(newWidth * 1.414); // A4 ratio
      }
    };

    updateDimensions();
    window.addEventListener('resize', updateDimensions);
    
    return () => {
      window.removeEventListener('resize', updateDimensions);
    };
  }, [pdfUrl]);

  return (
    <BookContainer
      initial={{ opacity: 0, y: 50 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.8 }}
      ref={containerRef}
    >
      <FlipBookContainer>
        {loading ? (
          <div style={{ color: 'white' }}>Loading PDF from: {pdfUrl}...</div>
        ) : error ? (
          <div style={{ color: 'white', textAlign: 'center', padding: '2rem' }}>
            <h3>Error Loading PDF</h3>
            <p>{error}</p>
            <p>PDF URL: {pdfUrl}</p>
          </div>
        ) : (
          <>
            <Document
              file={pdfUrl}
              onLoadSuccess={onDocumentLoadSuccess}
              onLoadError={onDocumentLoadError}
              loading={<div style={{ color: 'white' }}>Loading PDF...</div>}
              error={<div style={{ color: 'white' }}>Failed to load PDF</div>}
            >
              {numPages && (
                <HTMLFlipBook
                  width={pageWidth}
                  height={pageHeight}
                  size="stretch"
                  minWidth={300}
                  maxWidth={1000}
                  minHeight={400}
                  maxHeight={1533}
                  maxShadowOpacity={0.5}
                  showCover={true}
                  mobileScrollSupport={true}
                  className="flip-book"
                  style={{ background: 'transparent' }}
                  startPage={0}
                  drawShadow={true}
                  flippingTime={1000}
                  usePortrait={false}
                  startZIndex={0}
                  autoSize={true}
                  showPageCorners={true}
                  disableFlipByClick={false}
                  swipeDistance={0}
                  clickEventForward={false}
                  useMouseEvents={true}
                  onFlip={(e: any) => {
                    setPageNumber(e.data + 1);
                  }}
                  ref={bookRef}
                >
                  {Array.from(new Array(numPages), (_, index) => (
                    <div key={`page_${index + 1}`} className="demoPage">
                      <PageWrapper>
                        <Page 
                          key={`page_${index + 1}`}
                          pageNumber={index + 1} 
                          width={pageWidth} 
                          renderTextLayer={false}
                          renderAnnotationLayer={false}
                        />
                      </PageWrapper>
                    </div>
                  ))}
                </HTMLFlipBook>
              )}
            </Document>
          </>
        )}
      </FlipBookContainer>
      
      {error && (
        <div style={{ marginTop: '2rem', width: '100%', textAlign: 'center' }}>
          <h3 style={{ color: 'white' }}>Fallback PDF View</h3>
          <object
            data={pdfUrl}
            type="application/pdf"
            width="100%"
            height="500px"
            style={{ border: 'none', borderRadius: '8px' }}
          >
            <p style={{ color: 'white' }}>
              Your browser doesn't support embedded PDFs. 
              <a href={pdfUrl} target="_blank" rel="noopener noreferrer" style={{ color: '#00ffcc', marginLeft: '8px' }}>
                Download the PDF
              </a> instead.
            </p>
          </object>
        </div>
      )}
      
      <Controls>
        <Button 
          onClick={() => {
            if (bookRef.current && bookRef.current.pageFlip) {
              bookRef.current.pageFlip().flipPrev();
            }
          }}
          disabled={pageNumber <= 1}
        >
          Previous
        </Button>
        
        <PageIndicator>
          {pageNumber} / {numPages || 0}
        </PageIndicator>
        
        <Button 
          onClick={() => {
            if (bookRef.current && bookRef.current.pageFlip) {
              bookRef.current.pageFlip().flipNext();
            }
          }}
          disabled={pageNumber >= (numPages || 0)}
        >
          Next
        </Button>
      </Controls>
    </BookContainer>
  );
};

export default PDFFlipBook; 
