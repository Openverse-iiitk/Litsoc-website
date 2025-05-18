import { motion, useInView } from 'framer-motion';
import styled from 'styled-components';
import { useRef } from 'react';

// Styled components
const ContentContainer = styled(motion.div)`
  position: absolute;
  top: 0;
  left: 0;
  width: 50%;
  height: 100%;
  padding: 4rem;
  display: flex;
  flex-direction: column;
  justify-content: center;
  z-index: 15;
`;

const ContentTitle = styled(motion.h2)`
  font-size: 3rem;
  font-weight: bold;
  margin-bottom: 1.5rem;
  color: #000;
`;

const ContentParagraph = styled(motion.p)`
  font-size: 1.25rem;
  line-height: 1.6;
  margin-bottom: 1.5rem;
  color: #000;
`;

const contentVariants = {
  hidden: { opacity: 0, x: -50 },
  visible: (custom: number) => ({
    opacity: 1,
    x: 0,
    transition: {
      duration: 0.8,
      delay: 0.2 + custom * 0.1,
      ease: "easeOut"
    }
  })
};

interface ContentSectionProps {
  opacity: any; // Accept framer-motion useTransform value
  children?: React.ReactNode; // Add children prop
}

const ContentSection: React.FC<ContentSectionProps> = ({ opacity, children }) => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: false, amount: 0.3 });
  
  return (
    <ContentContainer style={{ opacity }} ref={ref}>
      {children ? (
        children
      ) : (
        <>
          <ContentTitle
            variants={contentVariants}
            initial="hidden"
            animate={isInView ? "visible" : "hidden"}
            custom={0}
          >
            Literary Society
          </ContentTitle>

          <ContentParagraph
            variants={contentVariants}
            initial="hidden"
            animate={isInView ? "visible" : "hidden"}
            custom={1}
          >
            We are a community of creative writers, poets, and literary enthusiasts from IIIT Kottayam.
          </ContentParagraph>

          <ContentParagraph
            variants={contentVariants}
            initial="hidden"
            animate={isInView ? "visible" : "hidden"}
            custom={2}
          >
            Our mission is to foster a love for literature and provide a platform for students to express themselves through words.
          </ContentParagraph>

          <ContentParagraph
            variants={contentVariants}
            initial="hidden"
            animate={isInView ? "visible" : "hidden"}
            custom={3}
          >
            Join us in exploring the power of language and storytelling!
          </ContentParagraph>
        </>
      )}
    </ContentContainer>
  );
};

export default ContentSection;
