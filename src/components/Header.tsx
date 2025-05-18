import { motion } from 'framer-motion';
import styled from 'styled-components';

// Styled Components
const TextContainer = styled.div`
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
  justify-content: space-around;
  align-items: center;
  z-index: 10;
  padding: 2rem 0;
  pointer-events: none;
`;

const StyledText = styled(motion.h1)`
  font-size: 15vw;
  font-weight: bold;
  color: transparent;
  -webkit-text-stroke: 1px white;
  text-stroke: 1px white;
  font-family: var(--font-heading);
  mix-blend-mode: screen;
  line-height: 1;
  margin: 0;
  padding: 0;
  text-align: center;
  width: 100%;
`;

// Animation variants
const textVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { 
    opacity: 1, 
    y: 0,
    transition: { 
      duration: 1.5, 
      ease: "easeOut"
    }
  }
};

// Header component with animated text
const Header: React.FC = () => {
  return (
    <TextContainer>
      <StyledText
        variants={textVariants}
        initial="hidden"
        animate="visible"
        transition={{ delay: 0.3 }}
      >
        LITSOC
      </StyledText>
      
      <StyledText
        variants={textVariants}
        initial="hidden"
        animate="visible"
        transition={{ delay: 0.6 }}
      >
        LITSOC
      </StyledText>
      
      <StyledText
        variants={textVariants}
        initial="hidden"
        animate="visible"
        transition={{ delay: 0.9 }}
      >
        LITSOC
      </StyledText>
    </TextContainer>
  );
};

export default Header;
