import { useRef } from 'react';
import type { ReactNode } from 'react';
import styled from 'styled-components';
import { motion } from 'framer-motion';


interface PageTransitionProps {
  children: ReactNode;
  isActive: boolean;
  direction?: 'left' | 'right' | 'up' | 'down';
}

const PageWrapper = styled(motion.div)`
  position: absolute;
  inset: 0;
  background-color: var(--bg-color);
  perspective: 1200px;
  transform-style: preserve-3d;
  overflow: hidden;
  will-change: transform;
`;

const PageContent = styled.div`
  position: absolute;
  inset: 0;
  background-color: var(--bg-color);
  perspective: 1200px;
  transform-style: preserve-3d;
  overflow: hidden;
  will-change: transform;

  &::after {
    content: '';
    position: absolute;
    top: 0;
    right: 0;
    width: 100%;
    height: 100%;
    background: linear-gradient(
      to left,
      rgba(0, 0, 0, 0.2) 0%,
      rgba(0, 0, 0, 0) 20%
    );
    pointer-events: none;
    opacity: 0;
    transition: opacity 0.3s;
  }

  &.turning::after {
    opacity: 1;
  }
`;

const pageVariants = {
  enter: (direction: 'left' | 'right' | 'up' | 'down') => {
    const xOffset = direction === 'left' ? 100 : direction === 'right' ? -100 : 0;
    const yOffset = direction === 'up' ? 100 : direction === 'down' ? -100 : 0;
    
    return {
      x: `${xOffset}%`,
      y: `${yOffset}%`,
      opacity: 0,
    };
  },
  center: {
    x: 0,
    y: 0,
    opacity: 1,
  },
  exit: (direction: 'left' | 'right' | 'up' | 'down') => {
    const xOffset = direction === 'left' ? -100 : direction === 'right' ? 100 : 0;
    const yOffset = direction === 'up' ? -100 : direction === 'down' ? 100 : 0;
    
    return {
      x: `${xOffset}%`,
      y: `${yOffset}%`,
      opacity: 0,
    };
  },
};

const PageTransition: React.FC<PageTransitionProps> = ({
  children,
  isActive,
  direction = 'right',
}) => {
  const contentRef = useRef<HTMLDivElement>(null);
  const wrapperRef = useRef<HTMLDivElement>(null);

  
  return (
    <PageWrapper
      ref={wrapperRef}
      initial="enter"
      animate="center"
      exit="exit"
      variants={pageVariants}
      custom={direction}
      transition={{
        x: { type: "spring", stiffness: 300, damping: 30 },
        y: { type: "spring", stiffness: 300, damping: 30 },
        opacity: { duration: 0.2 }
      }}
    >
      <PageContent 
        ref={contentRef}
        className={isActive ? 'turning' : ''}
      >
        {children}
      </PageContent>
    </PageWrapper>
  );
};

export default PageTransition;