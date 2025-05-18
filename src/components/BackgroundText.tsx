
import React, { type ReactNode } from 'react';
import styled, { keyframes } from 'styled-components';

const glowAnimation = keyframes`
  0% { filter: drop-shadow(0 0 2px #ff00ff) drop-shadow(0 0 4px #ff00ff); }
  50% { filter: drop-shadow(0 0 8px #00ffff) drop-shadow(0 0 12px #00ffff); }
  100% { filter: drop-shadow(0 0 2px #ff00ff) drop-shadow(0 0 4px #ff00ff); }
`;



const TextContainer = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  z-index: 0;
  width: 100%;
  height: 100vh;
  display: flex;
  justify-content: space-between;
  align-items: center;
  pointer-events: none;
  overflow: hidden;
`;

const TextColumn = styled.div<{ delay: number }>`
  font-family: var(--font-heading);
  font-size: 20vw;
  font-weight: bold;
  writing-mode: vertical-rl;
  text-orientation: upright;
  color: transparent;
  -webkit-text-stroke: 1px #ff00ff;
  opacity: 0.1;
  animation: ${glowAnimation} 3s infinite;
  animation-delay: ${props => props.delay}s;
  mix-blend-mode: screen;
  letter-spacing: -0.2em;
  filter: blur(1px);
  text-shadow: 0 0 20px rgba(255, 0, 255, 0.5);
`;

const BackgroundText = () => {
  return (
    <TextContainer>
      <TextColumn delay={0}>LITSOC</TextColumn>
      <TextColumn delay={1}>LITSOC</TextColumn>
      <TextColumn delay={2}>LITSOC</TextColumn>
    </TextContainer>
  );
};

export default BackgroundText;
