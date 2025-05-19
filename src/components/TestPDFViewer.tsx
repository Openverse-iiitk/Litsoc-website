import React, { useState } from 'react';
import { Document, Page, pdfjs } from 'react-pdf';
import styled from 'styled-components';
import 'react-pdf/dist/esm/Page/AnnotationLayer.css';
import 'react-pdf/dist/esm/Page/TextLayer.css';

// Set worker source
pdfjs.GlobalWorkerOptions.workerSrc = `//unpkg.com/pdfjs-dist@${pdfjs.version}/build/pdf.worker.min.js`;

const Container = styled.div`
  width: 100%;
  padding: 20px;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
`;

const PageContainer = styled.div`
  margin: 10px;
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.5);
  background: white;
  border-radius: 8px;
  overflow: hidden;
`;

const Controls = styled.div`
  display: flex;
  margin: 10px 0;
  gap: 10px;
`;

const Button = styled.button`
  padding: 8px 16px;
  background: #333;
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  
  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }
`;

const TestPDFViewer: React.FC<{ pdfUrl: string }> = ({ pdfUrl }) => {
  const [numPages, setNumPages] = useState<number | null>(null);
  const [pageNumber, setPageNumber] = useState<number>(1);
  const [error, setError] = useState<string | null>(null);
  
  const onDocumentLoadSuccess = ({ numPages }: { numPages: number }) => {
    setNumPages(numPages);
    setError(null);
  };
  
  const onDocumentLoadError = (error: Error) => {
    console.error('Error loading PDF:', error);
    setError(`Failed to load PDF: ${error.message}`);
  };
  
  return (
    <Container>
      <h2>Test PDF Viewer</h2>
      <p>Trying to load PDF from: {pdfUrl}</p>
      
      {error ? (
        <div style={{ color: 'red', margin: '20px 0' }}>
          <h3>Error:</h3>
          <p>{error}</p>
        </div>
      ) : (
        <>
          <Controls>
            <Button 
              disabled={pageNumber <= 1} 
              onClick={() => setPageNumber(prev => Math.max(prev - 1, 1))}
            >
              Previous
            </Button>
            <p>
              Page {pageNumber} of {numPages || '--'}
            </p>
            <Button 
              disabled={!numPages || pageNumber >= numPages} 
              onClick={() => setPageNumber(prev => numPages ? Math.min(prev + 1, numPages) : prev)}
            >
              Next
            </Button>
          </Controls>
          
          <PageContainer>
            <Document
              file={pdfUrl}
              onLoadSuccess={onDocumentLoadSuccess}
              onLoadError={onDocumentLoadError}
              loading={<div>Loading PDF...</div>}
              error={<div>Could not load PDF</div>}
            >
              <Page 
                pageNumber={pageNumber}
                width={600}
                renderTextLayer={false}
                renderAnnotationLayer={false}
              />
            </Document>
          </PageContainer>
        </>
      )}
      
      <div style={{ marginTop: '20px' }}>
        <h3>Fallback PDF View</h3>
        <iframe
          src={pdfUrl}
          width="600"
          height="400"
          style={{ border: 'none', borderRadius: '8px' }}
          title="PDF Viewer"
        />
      </div>
    </Container>
  );
};

export default TestPDFViewer;
