import { useState, useCallback, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAnimation, type AnimationControls } from 'framer-motion';
import { gsap } from 'gsap';

interface PageTransitionState {
  isAnimating: boolean;
  nextPage: string;
}

interface UsePageTransitionReturnType {
  isAnimating: boolean;
  controls: AnimationControls;
  navigateTo: (path: string) => void;
}

interface PageTransitionOptions {
  direction?: 'left' | 'right' | 'up' | 'down';
  duration?: number;
  ease?: string;
  onComplete?: () => void;
}

const defaultOptions: Required<PageTransitionOptions> = {
  direction: 'right',
  duration: 1,
  ease: 'power2.inOut',
  onComplete: () => {},
};

/**
 * Custom hook for managing page transitions with a 3D page-turn effect
 */
export const usePageTransition = (): UsePageTransitionReturnType => {
  const [state, setState] = useState<PageTransitionState>({
    isAnimating: false,
    nextPage: '',
  });
  
  const navigate = useNavigate();
  const controls = useAnimation();
  const elementRef = useRef<HTMLDivElement>(null);

  const mergedOptions = { ...defaultOptions };

  const navigateTo = useCallback((path: string) => {
    // If already animating, ignore the request
    if (state.isAnimating) return;
    
    // Start the animation
    setState({ isAnimating: true, nextPage: path });
    
    // Play the transition animation
    controls.start('exit').then(() => {
      // Create the page turning animation with GSAP
      const pageTurn = document.createElement('div');
      pageTurn.id = 'page-turn-effect';
      pageTurn.style.cssText = `
        position: fixed;
        top: 0;
        left: 0;
        width: 100vw;
        height: 100vh;
        background: linear-gradient(135deg, rgba(0,0,0,0.8) 0%, rgba(50,50,50,0.7) 100%);
        z-index: 1000;
        perspective: 1200px;
        transform-style: preserve-3d;
        overflow: hidden;
      `;
      
      const pageContent = document.createElement('div');
      pageContent.style.cssText = `
        position: absolute;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        background: rgba(20, 20, 20, 0.9);
        transform-origin: left center;
        box-shadow: 5px 0 25px rgba(0, 0, 0, 0.5);
      `;
      
      pageTurn.appendChild(pageContent);
      document.body.appendChild(pageTurn);
      
      gsap.fromTo(
        pageContent,
        { rotationY: 0, boxShadow: '5px 0 25px rgba(0, 0, 0, 0.5)' },
        {
          duration: 1.2,
          rotationY: -180,
          boxShadow: '0 0 0 rgba(0, 0, 0, 0)',
          ease: 'power3.inOut',
          onComplete: () => {
            // Remove the effect element
            document.body.removeChild(pageTurn);
            
            // Navigate to the new page
            navigate(state.nextPage);
            
            // Reset state and animate content in
            setTimeout(() => {
              controls.start('enter');
              setState({ isAnimating: false, nextPage: '' });
            }, 100);
          }
        }
      );
    });
  }, [state, navigate, controls]);

  useEffect(() => {
    if (!elementRef.current) return;

    const element = elementRef.current;
    const { direction, duration, ease, onComplete } = mergedOptions;

    // Define the animation properties based on direction
    const getAnimationProps = (dir: 'left' | 'right' | 'up' | 'down') => {
      switch (dir) {
        case 'left':
          return { x: state.isAnimating ? '100%' : '-100%' };
        case 'right':
          return { x: state.isAnimating ? '-100%' : '100%' };
        case 'up':
          return { y: state.isAnimating ? '100%' : '-100%' };
        case 'down':
          return { y: state.isAnimating ? '-100%' : '100%' };
      }
    };

    // Reset position
    gsap.set(element, {
      ...getAnimationProps(direction),
      opacity: 0,
    });

    // Animate in/out
    gsap.to(element, {
      x: 0,
      y: 0,
      opacity: 1,
      duration,
      ease,
      onComplete,
    });

    // Cleanup
    return () => {
      gsap.killTweensOf(element);
    };
  }, [state, mergedOptions]);

  return {
    isAnimating: state.isAnimating,
    controls,
    navigateTo,
  };
};

export const usePageTurnEffect = (
  element: HTMLElement | null,
  progress: number
) => {
  useEffect(() => {
    if (!element) return;

    gsap.to(element, {
      rotationY: progress * -180,
      duration: 0,
      transformOrigin: 'right center',
      ease: 'none',
    });
  }, [element, progress]);
};

export default usePageTransition;