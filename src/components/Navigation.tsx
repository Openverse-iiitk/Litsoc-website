import { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import styled, { keyframes } from 'styled-components';
import { motion, AnimatePresence } from 'framer-motion';

const float = keyframes`
  0% { transform: translateY(0px) rotateX(0deg); }
  50% { transform: translateY(-5px) rotateX(2deg); }
  100% { transform: translateY(0px) rotateX(0deg); }
`;

// Removed background and border, adjusted padding
const NavContainer = styled(motion.nav)`
  position: fixed;
  top: 2rem;
  left: 2rem;
  z-index: 100;
  display: flex;
  flex-direction: column;
  gap: 0.2rem; // Significantly reduced gap for closer spacing
  padding: 1rem;
  border-radius: 1rem;
  backdrop-filter: blur(8px);
  perspective: 1000px;
  transform-style: preserve-3d;
  animation: ${float} 6s ease-in-out infinite;
  
  @media (max-width: 768px) {
    display: none;
  }
`;

const glow = keyframes`
  0% { text-shadow: 0 0 5px #ff00ff, 0 0 10px #ff00ff; }
  50% { text-shadow: 0 0 10px #00ffff, 0 0 20px #00ffff; }
  100% { text-shadow: 0 0 5px #ff00ff, 0 0 10px #ff00ff; }
`;

const NavLink = styled(Link)<{ $active?: boolean }>`
  font-family: var(--font-heading);
  font-size: 1.25rem;
  color: ${props => props.$active ? '#ff00ff' : 'white'};
  text-decoration: none;
  transition: all 0.4s cubic-bezier(0.16, 1, 0.3, 1);
  position: relative;
  padding: 0.3rem 1rem; // Reduced vertical padding
  text-transform: uppercase;
  letter-spacing: 0.5px; // Reduced letter spacing
  transform-style: preserve-3d;
  
  &::before {
    content: '';
    position: absolute;
    left: 0;
    top: 50%;
    transform: translateY(-50%);
    width: 3px;
    height: ${props => props.$active ? '80%' : '0'};
    background: linear-gradient(to bottom, #ff00ff, #00ffff);
    transition: height 0.3s ease;
    box-shadow: 0 0 10px rgba(255, 0, 255, 0.5);
  }
  
  &:hover {
    color: #ff00ff;
    transform: translateX(0.5rem) translateZ(10px);
    animation: ${glow} 2s ease-in-out infinite;
    
    &::before {
      height: 80%;
    }
  }
`;

const HamburgerButton = styled(motion.button)`
  display: none;
  position: fixed;
  top: 1rem;
  left: 1rem;
  background: none;
  border: none;
  cursor: pointer;
  z-index: 101;
  padding: 0.5rem;
  color: var(--text-color);
  
  @media (max-width: 768px) {
    display: block;
  }
`;

// Changed the mobile menu to be transparent with blur backdrop
const MobileMenu = styled(motion.div)`
  display: none;
  position: fixed;
  inset: 0;
  background: rgba(4, 0, 18, 0.8); // Semi-transparent background
  backdrop-filter: blur(12px);
  z-index: 99;
  padding: 4rem 2rem;
  
  @media (max-width: 768px) {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    gap: 0.5rem; // Reduced gap for mobile menu links too
  }
`;

const navItems = [
  { path: '/', label: 'Home' },
  { path: '/legacy', label: 'Legacy' },
  { path: '/kronicles', label: 'Kronicles' },
  { path: '/subclubs', label: 'Subclubs' },
  { path: '/gallery', label: 'Gallery' },
  { path: '/events', label: 'Events' },
];

const Navigation = () => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const location = useLocation();
  
  return (
    <>
      <NavContainer
        initial={{ x: -100, opacity: 0 }}
        animate={{ x: 0, opacity: 1 }}
        transition={{ duration: 0.5, type: 'spring' }}
      >
        {navItems.map(({ path, label }) => (
          <NavLink 
            key={path} 
            to={path} 
            $active={location.pathname === path}
          >
            {label}
          </NavLink>
        ))}
      </NavContainer>

      <HamburgerButton
        onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.9 }}
      >
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          {isMobileMenuOpen ? (
            <path d="M18 6L6 18M6 6l12 12" />
          ) : (
            <path d="M3 12h18M3 6h18M3 18h18" />
          )}
        </svg>
      </HamburgerButton>

      <AnimatePresence>
        {isMobileMenuOpen && (
          <MobileMenu
            initial={{ opacity: 0, x: '-100%' }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: '-100%' }}
            transition={{ type: 'spring', stiffness: 300, damping: 30 }}
          >
            {navItems.map(({ path, label }) => (
              <NavLink
                key={path}
                to={path}
                $active={location.pathname === path}
                onClick={() => setIsMobileMenuOpen(false)}
              >
                {label}
              </NavLink>
            ))}
          </MobileMenu>
        )}
      </AnimatePresence>
    </>
  );
};

export default Navigation;