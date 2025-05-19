import React, { useRef, useEffect } from 'react';
import styled from 'styled-components';
import { motion, useInView, useAnimation } from 'framer-motion';
import TimelineCard from './TimelineCard';

interface TimelineNodeData {
  year: string;
  leaders: Array<{
    id: string;
    name: string;
    quote: string;
    imageUrl: string;
    color: string;
  }>;
}

interface TimelineProps {
  data: TimelineNodeData[];
}

// Styled Components
const TimelineContainer = styled.div`
  width: 100%;
  max-width: 1400px;
  margin: 0 auto;
  padding: 2rem 0;
  position: relative;
`;

const VerticalLine = styled(motion.div)`
  position: absolute;
  width: 4px;
  height: 100%;
  background: linear-gradient(
    to bottom,
    rgba(106, 17, 203, 0.2),
    rgba(106, 17, 203, 0.5) 10%,
    rgba(106, 17, 203, 0.8) 50%,
    rgba(106, 17, 203, 0.5) 90%,
    rgba(106, 17, 203, 0.2)
  );
  left: 50%;
  transform: translateX(-50%);
  z-index: 1;
  
  &::before, &::after {
    content: '';
    position: absolute;
    width: 20px;
    height: 20px;
    border-radius: 50%;
    background: #6a11cb;
    left: 50%;
    transform: translateX(-50%);
    box-shadow: 0 0 15px #6a11cb;
  }
  
  &::before {
    top: 0;
  }
  
  &::after {
    bottom: 0;
  }
  
  @media (max-width: 768px) {
    left: 30px;
  }
`;

const TimelineNodeWrapper = styled.div`
  width: 100%;
  margin: 5rem 0;
  position: relative;
  display: flex;
  
  @media (max-width: 768px) {
    flex-direction: column;
    margin: 3rem 0;
  }
`;

const YearMarker = styled(motion.div)`
  position: absolute;
  width: 60px;
  height: 60px;
  border-radius: 50%;
  background: linear-gradient(135deg, #6a11cb 0%, #2575fc 100%);
  display: flex;
  justify-content: center;
  align-items: center;
  left: 50%;
  top: 0;
  transform: translateX(-50%);
  z-index: 2;
  box-shadow: 0 0 20px rgba(106, 17, 203, 0.7);
  border: 3px solid rgba(255, 255, 255, 0.3);
  
  @media (max-width: 768px) {
    left: 30px;
  }
`;

const YearText = styled.span`
  font-weight: bold;
  color: white;
  font-size: 1.2rem;
  font-family: 'Pixelify Sans', sans-serif;
`;

const NodeContent = styled.div<{ isEven: boolean }>`
  width: 50%;
  padding: ${props => props.isEven ? '0 2rem 0 0' : '0 0 0 2rem'};
  margin-top: 3rem;
  
  @media (max-width: 768px) {
    width: 100%;
    padding: 0 0 0 5rem;
    margin-top: 2rem;
  }
`;

const CardsContainer = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 1.5rem;
  justify-content: center;
  
  @media (max-width: 768px) {
    justify-content: flex-start;
  }
`;

const Decorations = styled.div`
  position: absolute;
  width: 100%;
  height: 100%;
  pointer-events: none;
  overflow: hidden;
  z-index: 0;
`;

const Decoration = styled(motion.div)<{ size: number; top: string; left: string; color: string }>`
  position: absolute;
  width: ${props => props.size}px;
  height: ${props => props.size}px;
  top: ${props => props.top};
  left: ${props => props.left};
  background: ${props => props.color};
  opacity: 0.15;
  border-radius: 50%;
  filter: blur(${props => props.size / 10}px);
`;

const TimelineNode: React.FC<{ data: TimelineNodeData; index: number }> = ({ data, index }) => {
  const isEven = index % 2 === 0;
  const ref = useRef(null);
  const isInView = useInView(ref, { once: false, amount: 0.3 });
  const controls = useAnimation();
  
  useEffect(() => {
    if (isInView) {
      controls.start('visible');
    }
  }, [isInView, controls]);
  
  const nodeVariants = {
    hidden: { 
      opacity: 0, 
      y: 50, 
      x: isEven ? -20 : 20 
    },
    visible: {
      opacity: 1,
      y: 0,
      x: 0,
      transition: {
        duration: 0.8,
        ease: "easeOut",
        staggerChildren: 0.2
      }
    }
  };
  
  const yearVariants = {
    hidden: { scale: 0, opacity: 0 },
    visible: { 
      scale: 1, 
      opacity: 1,
      transition: {
        type: "spring",
        stiffness: 200,
        damping: 20,
        duration: 0.5
      }
    }
  };
  
  return (
    <TimelineNodeWrapper ref={ref}>
      <YearMarker
        variants={yearVariants}
        initial="hidden"
        animate={controls}
      >
        <YearText>{data.year}</YearText>
      </YearMarker>
      
      <NodeContent 
        isEven={isEven}
        as={motion.div}
        variants={nodeVariants}
        initial="hidden"
        animate={controls}
      >
        <CardsContainer>
          {data.leaders.map((leader, idx) => (
            <TimelineCard
              key={leader.id}
              id={leader.id}
              name={leader.name}
              quote={leader.quote}
              imageUrl={leader.imageUrl}
              color={leader.color}
              delay={idx * 0.1}
            />
          ))}
        </CardsContainer>
      </NodeContent>
    </TimelineNodeWrapper>
  );
};

const VerticalTimeline: React.FC<TimelineProps> = ({ data }) => {
  const decorations = [
    { size: 120, top: '10%', left: '5%', color: 'rgba(106, 17, 203, 0.5)' },
    { size: 80, top: '30%', left: '85%', color: 'rgba(37, 117, 252, 0.5)' },
    { size: 150, top: '60%', left: '15%', color: 'rgba(106, 17, 203, 0.5)' },
    { size: 100, top: '80%', left: '80%', color: 'rgba(37, 117, 252, 0.5)' },
  ];
  
  const lineVariants = {
    hidden: { 
      scaleY: 0, 
      opacity: 0 
    },
    visible: { 
      scaleY: 1, 
      opacity: 1,
      transition: { 
        duration: 1.5, 
        ease: "easeOut" 
      }
    }
  };
  
  const decorationVariants = {
    hidden: { 
      scale: 0.5, 
      opacity: 0 
    },
    visible: (i: number) => ({ 
      scale: 1, 
      opacity: 1,
      transition: { 
        delay: i * 0.2,
        duration: 1, 
        ease: "easeOut" 
      }
    })
  };
  
  return (
    <TimelineContainer>
      <VerticalLine
        variants={lineVariants}
        initial="hidden"
        animate="visible"
      />
      
      <Decorations>
        {decorations.map((decoration, i) => (
          <Decoration
            key={i}
            size={decoration.size}
            top={decoration.top}
            left={decoration.left}
            color={decoration.color}
            variants={decorationVariants}
            custom={i}
            initial="hidden"
            animate="visible"
          />
        ))}
      </Decorations>
      
      {data.map((node, index) => (
        <TimelineNode key={node.year} data={node} index={index} />
      ))}
    </TimelineContainer>
  );
};

export default VerticalTimeline;
