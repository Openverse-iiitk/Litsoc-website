import { motion, useAnimationControls } from 'framer-motion';
import styled from 'styled-components';
import usePageTransition from '../hooks/usePageTransition';
import PageTransition from '../components/PageTransition';
import { useEffect } from 'react';
import TimelineCard from '../components/TimelineCard';

// Styled components
const PageContainer = styled.div`
  width: 100%;
  min-height: 100vh;
  background: linear-gradient(135deg, #0a0a0a 0%, #1a1a1a 100%);
  color: white;
  position: relative;
  overflow: hidden;
  display: flex;
  flex-direction: column;
`;

const GlowingOverlay = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: radial-gradient(circle at center, rgba(255, 69, 0, 0.15) 0%, rgba(0, 0, 0, 0) 70%);
  pointer-events: none;
  z-index: 1;
  opacity: 0.8;
`;



const RetroLines = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: repeating-linear-gradient(
    0deg,
    rgba(0, 0, 0, 0),
    rgba(0, 0, 0, 0) 4px,
    rgba(255, 69, 0, 0.03) 4px,
    rgba(255, 69, 0, 0.03) 5px
  );
  pointer-events: none;
  opacity: 0.4;
  z-index: 0;
`;

const ScanlineEffect = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: linear-gradient(
    0deg,
    rgba(0, 0, 0, 0.1) 0%,
    rgba(0, 0, 0, 0) 50%,
    rgba(0, 0, 0, 0.1) 100%
  );
  background-size: 100% 4px;
  pointer-events: none;
  opacity: 0.2;
  z-index: 2;
  animation: scanline 10s linear infinite;
  
  @keyframes scanline {
    0% {
      background-position: 0 0;
    }
    100% {
      background-position: 0 100%;
    }
  }
`;

// Add a new vignette effect for more depth
const Vignette = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: radial-gradient(
    ellipse at center,
    rgba(0, 0, 0, 0) 0%,
    rgba(0, 0, 0, 0.5) 100%
  );
  pointer-events: none;
  z-index: 3;
  opacity: 0.7;
  mix-blend-mode: multiply;
`;

const MainLayout = styled.div`
  width: 100%;
  min-height: 100vh;
  position: relative;
  display: flex;
  flex-direction: column;
  align-items: center;
`;

const TimelineSection = styled.div`
  width: 100%;
  max-width: 1200px;
  min-height: 100vh;
  overflow-y: auto;
  padding: 2rem;
  background: rgba(10, 10, 10, 0.5);
  backdrop-filter: blur(5px);
  position: relative;
  margin: 0 auto;
  
  &::-webkit-scrollbar {
    width: 5px;
  }
  
  &::-webkit-scrollbar-track {
    background: rgba(0, 0, 0, 0.2);
  }
  
  &::-webkit-scrollbar-thumb {
    background: rgba(255, 69, 0, 0.5);
    border-radius: 5px;
  }
  
  @media (max-width: 768px) {
    padding: 1rem;
  }
`;


// Fire particles styling
const QuoteContainer = styled.div`
  background: rgba(10, 10, 10, 0.7);
  border: 1px solid rgba(255, 69, 0, 0.3);
  border-radius: 8px;
  padding: 1.5rem;
  margin: 1rem 0;
  position: relative;
  overflow: hidden;
  
  &::before {
    content: '"';
    position: absolute;
    top: 0;
    left: 10px;
    font-size: 3rem;
    color: rgba(255, 69, 0, 0.2);
    font-family: 'Georgia', serif;
  }
  
  &::after {
    content: '"';
    position: absolute;
    bottom: -15px;
    right: 10px;
    font-size: 3rem;
    color: rgba(255, 69, 0, 0.2);
    font-family: 'Georgia', serif;
  }
`;

const QuoteText = styled.p`
  font-style: italic;
  line-height: 1.6;
  font-size: 1.1rem;
  color: rgba(255, 255, 255, 0.9);
  margin-bottom: 0.5rem;
`;

const QuoteAuthor = styled.p`
  text-align: right;
  color: #ff8c00;
  font-weight: 500;
  font-size: 0.9rem;
`;

const QuotesList = styled(motion.div)`
  width: 100%;
  overflow: hidden;
  margin: 1.5rem 0;
`;

const ImageGalleryGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  grid-template-rows: repeat(2, 1fr);
  gap: 0.75rem;
  width: 100%;
  max-height: 250px;
  margin: 1.5rem 0;
`;

const GridImage = styled(motion.div)<{ $imageUrl: string }>`
  border-radius: 8px;
  overflow: hidden;
  background-image: url(${props => props.$imageUrl});
  background-size: cover;
  background-position: center;
  height: 120px;
  box-shadow: 0 4px 15px rgba(0, 0, 0, 0.5);
  border: 1px solid rgba(255, 69, 0, 0.3);
  position: relative;
  
  &::after {
    content: '';
    position: absolute;
    inset: 0;
    background: linear-gradient(to bottom, transparent 50%, rgba(0, 0, 0, 0.7) 100%);
  }
  
  &:hover {
    transform: scale(1.03);
    transition: transform 0.3s ease;
  }
`;

const ScrollableShowcase = styled.div`
  height: 100%;
  overflow-y: auto;
  padding: 2rem;
  
  &::-webkit-scrollbar {
    width: 5px;
  }
  
  &::-webkit-scrollbar-track {
    background: rgba(0, 0, 0, 0.2);
  }
  
  &::-webkit-scrollbar-thumb {
    background: rgba(255, 69, 0, 0.5);
    border-radius: 5px;
  }
`;

const ShowcaseSection = styled.div`
  margin-bottom: 2rem;
  padding-bottom: 2rem;
  border-bottom: 1px solid rgba(255, 69, 0, 0.2);
  
  &:last-child {
    border-bottom: none;
  }
`;

const SectionTitle = styled.h3`
  font-size: 1.5rem;
  color: #ff8c00;
  margin-bottom: 1rem;
  font-family: 'Pixelify Sans', sans-serif;
  position: relative;
  display: inline-block;
  
  &::after {
    content: '';
    position: absolute;
    bottom: -5px;
    left: 0;
    width: 100%;
    height: 2px;
    background: linear-gradient(90deg, #ff4500, transparent);
  }
`;


const CardContainer = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
  gap: 2rem;
  padding: 1rem;
  
  @media (max-width: 768px) {
    grid-template-columns: repeat(auto-fill, minmax(220px, 1fr));
    gap: 1rem;
  }
`;

const YearSection = styled(motion.div)`
  margin-bottom: 3rem;
  position: relative;
  
  &::after {
    content: '';
    position: absolute;
    left: 0;
    bottom: -1.5rem;
    width: 100%;
    height: 1px;
    background: linear-gradient(90deg, rgba(255, 69, 0, 0.5), transparent);
  }
  
  &:last-child::after {
    display: none;
  }
`;

const FeaturedSection = styled(motion.div)`
  width: 100%;
  margin-bottom: 4rem;
  position: relative;
  padding: 2rem;
  background: rgba(0, 0, 0, 0.3);
  border-radius: 12px;
  border: 1px solid rgba(255, 69, 0, 0.2);
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.5);
  
  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background: radial-gradient(circle at center, rgba(255, 69, 0, 0.15) 0%, rgba(0, 0, 0, 0) 70%);
    pointer-events: none;
    z-index: -1;
  }
  
  @media (max-width: 768px) {
    padding: 1.5rem;
    margin-bottom: 3rem;
  }
`;

const HistorySection = styled.div`
  margin: 6rem 0 3rem;
  position: relative;
  padding: 3rem 2rem;
  background: rgba(10, 10, 10, 0.7);
  border-radius: 12px;
  border: 1px solid rgba(255, 69, 0, 0.3);
  box-shadow: 0 15px 35px rgba(0, 0, 0, 0.5);
  
  @media (max-width: 768px) {
    padding: 2rem 1rem;
    margin: 4rem 0 2rem;
  }
`;

const SectionDivider = styled.div`
  position: absolute;
  top: -30px;
  left: 50%;
  transform: translateX(-50%);
  width: 60px;
  height: 60px;
  background: linear-gradient(135deg, #ff4500 0%, #ff8c00 100%);
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  box-shadow: 0 5px 15px rgba(0, 0, 0, 0.5);
  
  &::before {
    content: '';
    position: absolute;
    width: 40px;
    height: 40px;
    background: rgba(10, 10, 10, 0.9);
    border-radius: 50%;
  }
  
  &::after {
    content: '';
    position: absolute;
    width: 20px;
    height: 20px;
    background: linear-gradient(135deg, #ff4500 0%, #ff8c00 100%);
    border-radius: 50%;
  }
`;

const HistorySectionTitle = styled.h2`
  font-size: 2.5rem;
  text-align: center;
  margin-bottom: 2rem;
  color: white;
  font-family: 'Pixelify Sans', sans-serif;
  background: linear-gradient(90deg, #ff4500 0%, #ff8c00 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  text-shadow: 0 0 10px rgba(255, 69, 0, 0.3);
  
  @media (max-width: 768px) {
    font-size: 2rem;
  }
`;

const HistoryContent = styled.div`
  position: relative;
  
  p {
    font-size: 1.1rem;
    line-height: 1.8;
    color: rgba(255, 255, 255, 0.9);
    margin-bottom: 2rem;
    text-align: center;
    max-width: 800px;
    margin-left: auto;
    margin-right: auto;
  }
`;

const YearTitle = styled(motion.h2)`
  font-size: 2.5rem;
  margin-bottom: 1.5rem;
  color: white;
  font-family: 'Pixelify Sans', sans-serif;
  position: relative;
  display: inline-block;
  padding-bottom: 0.5rem;
  
  &::after {
    content: '';
    position: absolute;
    bottom: 0;
    left: 0;
    width: 100%;
    height: 3px;
    background: linear-gradient(90deg, #ff4500, #ff8c00, transparent);
  }
  
  @media (max-width: 768px) {
    font-size: 2rem;
  }
`;

// New component for the left side showcase
const LegacyShowcase = styled.div`
  width: 100%;
  height: 100%;
  position: relative;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  align-items: center;
  padding: 2.5rem;
  background: rgba(0, 0, 0, 0.2);
  backdrop-filter: blur(2px);
  border-radius: 8px;
  margin: 1rem;
  box-shadow: inset 0 0 20px rgba(0, 0, 0, 0.3);
  border: 1px solid rgba(255, 69, 0, 0.15);
  overflow-y: auto;
  
  &::-webkit-scrollbar {
    width: 5px;
  }
  
  &::-webkit-scrollbar-track {
    background: rgba(0, 0, 0, 0.2);
  }
  
  &::-webkit-scrollbar-thumb {
    background: rgba(255, 69, 0, 0.5);
    border-radius: 5px;
  }
  
  @media (max-width: 768px) {
    padding: 1.5rem;
    margin: 0.5rem;
  }
`;

const ShowcaseTitle = styled(motion.h2)`
  font-size: 3.5rem;
  font-weight: 800;
  margin-bottom: 2rem;
  text-align: center;
  background: linear-gradient(90deg, #ff4500 0%, #ff8c00 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  text-shadow: 0 0 15px rgba(255, 69, 0, 0.5);
  font-family: 'Pixelify Sans', sans-serif;
  
  @media (max-width: 768px) {
    font-size: 2.5rem;
  }
`;

const FeaturedQuote = styled(motion.p)`
  font-size: 1.5rem;
  font-style: italic;
  text-align: center;
  max-width: 80%;
  margin: 0 auto 2rem;
  color: rgba(255, 255, 255, 0.9);
  line-height: 1.6;
  
  @media (max-width: 768px) {
    font-size: 1.2rem;
  }
`;

const ImageGallery = styled.div`
  width: 100%;
  height: 300px;
  position: relative;
  overflow: hidden;
  border-radius: 12px;
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.7);
  border: 2px solid rgba(255, 69, 0, 0.3);
  margin: 1.5rem 0;
  
  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    height: 1px;
    background: linear-gradient(90deg, transparent, rgba(255, 140, 0, 0.8), transparent);
    z-index: 4;
  }
  
  @media (max-width: 768px) {
    height: 200px;
  }
`;

const GalleryImage = styled(motion.div)<{ $imageUrl: string }>`
  position: absolute;
  inset: 0;
  background-image: url(${props => props.$imageUrl});
  background-size: cover;
  background-position: center;
  opacity: 0;
  transform-origin: center;
  filter: saturate(1.2) contrast(1.1);
  
  &::before {
    content: '';
    position: absolute;
    inset: 0;
    background: radial-gradient(circle at center, transparent 30%, rgba(0, 0, 0, 0.6) 100%);
    z-index: 1;
  }
`;

const ImageOverlay = styled.div`
  position: absolute;
  inset: 0;
  background: linear-gradient(
    to bottom,
    transparent 60%,
    rgba(0, 0, 0, 0.8) 100%
  );
  z-index: 2;
`;

const FireEffect = styled.div`
  position: absolute;
  bottom: 0;
  left: 0;
  right: 0;
  height: 150px;
  background: linear-gradient(
    to top,
    rgba(255, 69, 0, 0.4) 0%,
    transparent 100%
  );
  z-index: 1;
  
  &::after {
    content: '';
    position: absolute;
    bottom: 0;
    left: 0;
    right: 0;
    height: 3px;
    background: #ff4500;
    box-shadow: 0 0 20px 5px #ff4500;
  }
`;

const EmberContainer = styled.div`
  position: absolute;
  bottom: 0;
  left: 0;
  width: 100%;
  height: 100%;
  pointer-events: none;
  z-index: 3;
`;

const Ember = styled(motion.div)<{ $size: number }>`
  position: absolute;
  bottom: 0;
  width: ${props => props.$size}px;
  height: ${props => props.$size}px;
  border-radius: 50%;
  background: #ff4500;
  filter: blur(2px);
`;

const HistoryHighlight = styled(motion.div)`
  margin-top: 2rem;
  padding: 1.5rem;
  background: rgba(10, 10, 10, 0.7);
  border: 1px solid rgba(255, 69, 0, 0.3);
  border-radius: 8px;
  max-width: 90%;
  
  h3 {
    font-size: 1.8rem;
    margin-bottom: 1rem;
    color: #ff8c00;
    font-family: 'Pixelify Sans', sans-serif;
  }
  
  p {
    font-size: 1rem;
    line-height: 1.6;
    color: rgba(255, 255, 255, 0.8);
  }
`;

// Animation variants



const ImageCaption = styled(motion.div)`
  position: absolute;
  left: 0;
  right: 0;
  bottom: 0;
  padding: 1rem;
  z-index: 5;
  color: white;
  text-align: center;
  
  h4 {
    font-size: 1.2rem;
    margin-bottom: 0.5rem;
    font-family: 'Pixelify Sans', sans-serif;
    color: #ff8c00;
  }
  
  p {
    font-size: 0.9rem;
    font-style: italic;
    opacity: 0.9;
  }
`;

const QuotesCarousel = () => {
  const quotes = [
    {
      text: "Books are a uniquely portable magic.",
      author: "Stephen King"
    },
    {
      text: "Literature is the most agreeable way of ignoring life.",
      author: "Fernando Pessoa"
    },
    {
      text: "A reader lives a thousand lives before he dies. The man who never reads lives only one.",
      author: "George R.R. Martin"
    },
    {
      text: "The reading of all good books is like conversation with the finest minds of past centuries.",
      author: "René Descartes"
    }
  ];
  
  return (
    <QuotesList
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 1, delay: 1 }}
    >
      {quotes.map((quote, index) => (
        <motion.div
          key={index}
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: index * 0.1 }}
          viewport={{ once: true, margin: "-50px" }}
        >
          <QuoteContainer>
            <QuoteText>{quote.text}</QuoteText>
            <QuoteAuthor>— {quote.author}</QuoteAuthor>
          </QuoteContainer>
        </motion.div>
      ))}
    </QuotesList>
  );
};

const EmberEffect = () => {
  const embers = Array.from({ length: 20 }, (_, i) => ({
    id: i,
    x: Math.random() * 100,
    size: Math.random() * 6 + 2,
    duration: Math.random() * 3 + 2,
    delay: Math.random() * 2
  }));
  
  return (
    <EmberContainer>
      {embers.map(ember => (
        <Ember
          key={ember.id}
          $size={ember.size}
          style={{ left: `${ember.x}%` }}
          initial={{ y: 0, opacity: 0 }}
          animate={{
            y: [0, -Math.random() * 300 - 100],
            x: [0, (Math.random() - 0.5) * 80],
            opacity: [0, 0.8, 0],
          }}
          transition={{
            duration: ember.duration,
            repeat: Infinity,
            delay: ember.delay,
            ease: "easeOut"
          }}
        />
      ))}
    </EmberContainer>
  );
};

const GallerySlideshow = () => {
  const galleryContent = [
    {
      imageUrl: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTirCLLs6VbMYzTtTrpuAIe9qV6ogvhP4C50g&s',
      title: 'The Ancient Archives',
      description: 'Repositories of wisdom through the ages'
    },
    {
      imageUrl: 'https://source.unsplash.com/random/800x800/?typewriter',
      title: 'Words Immortalized',
      description: 'The tools that brought stories to life'
    },
    {
      imageUrl: 'https://source.unsplash.com/random/800x800/?medieval-manuscript',
      title: 'Legacy of Letters',
      description: 'Handcrafted artistry of literary heritage'
    },
    {
      imageUrl: 'https://source.unsplash.com/random/800x800/?poetry-reading',
      title: 'Spoken Word',
      description: 'Bringing emotions to life through performance'
    },
    {
      imageUrl: 'https://source.unsplash.com/random/800x800/?vintage-books',
      title: 'Pages Through Time',
      description: 'Stories that transcend generations'
    }
  ];
  
  return (
    <ImageGallery>
      {galleryContent.map((content, index) => (
        <GalleryImage
          key={index}
          $imageUrl={content.imageUrl}
          initial={{ opacity: 0, scale: 1.05 }}
          animate={{
            opacity: [0, 1, 1, 0],
            scale: [1.05, 1, 1, 1.05]
          }}
          transition={{
            duration: 8,
            times: [0, 0.1, 0.9, 1],
            repeat: Infinity,
            repeatDelay: 0,
            delay: index * 8
          }}
        >
          <ImageCaption
            initial={{ opacity: 0, y: 20 }}
            animate={{
              opacity: [0, 1, 1, 0],
              y: [20, 0, 0, 20]
            }}
            transition={{
              duration: 8,
              times: [0, 0.15, 0.85, 1],
              repeat: Infinity,
              repeatDelay: 0,
              delay: index * 8
            }}
          >
            <h4>{content.title}</h4>
            <p>{content.description}</p>
          </ImageCaption>
        </GalleryImage>
      ))}
      <ImageOverlay />
      <FireEffect />
      <EmberEffect />
    </ImageGallery>
  );
};

const LegacyPage: React.FC = () => {
  const { isAnimating } = usePageTransition();
  const modelCaptionControls = useAnimationControls();
  
  // Handle model caption animation
  useEffect(() => {
    const glowAnimation = async () => {
      await modelCaptionControls.start({
        textShadow: ['0 0 5px rgba(255, 69, 0, 0.5)', '0 0 15px rgba(255, 69, 0, 0.8)', '0 0 5px rgba(255, 69, 0, 0.5)'],
        transition: { duration: 2.5, repeat: Infinity, ease: "easeInOut" }
      });
    };
    
    glowAnimation();
  }, [modelCaptionControls]);
  
  // Sample timeline data - replace with real data later
  const timelineData = [
    {
      year: "2023",
      leaders: [
        {
          id: "2023-1",
          name: "Aisha Kumar",
          quote: "Literature is the mirror of society that reveals our shared humanity.",
          imageUrl: "https://source.unsplash.com/random/300x300/?portrait&sig=1",
          color: "#7928CA"
        },
        {
          id: "2023-2",
          name: "Rahul Mehta",
          quote: "Words have the power to shape thoughts; thoughts have the power to shape worlds.",
          imageUrl: "https://source.unsplash.com/random/300x300/?portrait&sig=2",
          color: "#1E40AF"
        },
        {
          id: "2023-3",
          name: "Priya Singh",
          quote: "In the tapestry of life, literature adds the most vibrant threads.",
          imageUrl: "https://source.unsplash.com/random/300x300/?portrait&sig=3",
          color: "#047857"
        }
      ]
    },
    {
      year: "2024",
      leaders: [
        {
          id: "2024-1",
          name: "Vikram Reddy",
          quote: "The pen may not be mightier than the sword, but it certainly outlasts it.",
          imageUrl: "https://source.unsplash.com/random/300x300/?portrait&sig=4",
          color: "#B91C1C"
        },
        {
          id: "2024-2",
          name: "Ananya Patel",
          quote: "Every story we tell is a light we cast against the darkness of our times.",
          imageUrl: "https://source.unsplash.com/random/300x300/?portrait&sig=5",
          color: "#7B341E"
        },
        {
          id: "2024-3",
          name: "Kabir Sharma",
          quote: "Literature is not just about reading stories, but about living countless lives.",
          imageUrl: "https://source.unsplash.com/random/300x300/?portrait&sig=6",
          color: "#581C87"
        }
      ]
    },
    {
      year: "2025",
      leaders: [
        {
          id: "2025-1",
          name: "Nikhil Varma",
          quote: "The goal of literature is to make the familiar strange and the strange familiar.",
          imageUrl: "https://source.unsplash.com/random/300x300/?portrait&sig=7",
          color: "#6a11cb"
        },
        {
          id: "2025-2",
          name: "Zara Kapoor",
          quote: "A book is a dream you hold in your hands; a literary society is where dreams converge.",
          imageUrl: "https://source.unsplash.com/random/300x300/?portrait&sig=8",
          color: "#2575fc"
        },
        {
          id: "2025-3",
          name: "Arjun Nair",
          quote: "Words build bridges between isolated islands of thought.",
          imageUrl: "https://source.unsplash.com/random/300x300/?portrait&sig=9",
          color: "#4c1d95"
        }
      ]
    },
    {
      year: "2026",
      leaders: [
        {
          id: "2026-1",
          name: "Maya Iyer",
          quote: "Literature doesn't just reflect society; it imagines what society could become.",
          imageUrl: "https://source.unsplash.com/random/300x300/?portrait&sig=10",
          color: "#0e7490"
        },
        {
          id: "2026-2",
          name: "Rohan Desai",
          quote: "Every letter is a step in the journey of human consciousness.",
          imageUrl: "https://source.unsplash.com/random/300x300/?portrait&sig=11",
          color: "#6d28d9"
        },
        {
          id: "2026-3",
          name: "Nisha Roy",
          quote: "We read to know we are not alone in how we feel and think.",
          imageUrl: "https://source.unsplash.com/random/300x300/?portrait&sig=12",
          color: "#c026d3"
        }
      ]
    }
  ];
  
  return (
    <PageTransition isActive={isAnimating}>
      <RetroLines />
      <GlowingOverlay />
      <ScanlineEffect />
      <Vignette /> {/* Added Vignette component for depth */}
      <PageContainer>
        <MainLayout>
          <TimelineSection>
            
            
            {/* Featured Content Section - showing some of the content from previous left side */}
            <FeaturedSection
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
              viewport={{ once: true, amount: 0.3 }}
            >
              <ShowcaseTitle
                initial={{ y: -30, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ duration: 0.8, delay: 0.3 }}
              >
                The Burning Pages
              </ShowcaseTitle>
              
              <FeaturedQuote
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 1, delay: 0.8 }}
              >
                "We are the keepers of stories, the guardians of words that ignite minds and set souls ablaze."
              </FeaturedQuote>
              
              {/* Using ImageGalleryGrid component to showcase key moments */}
              <ImageGalleryGrid>
                <GridImage 
                  $imageUrl="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTirCLLs6VbMYzTtTrpuAIe9qV6ogvhP4C50g&s"
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.5, delay: 0.2 }}
                />
                <GridImage 
                  $imageUrl="https://source.unsplash.com/random/600x400/?writing&sig=2"
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.5, delay: 0.4 }}
                />
                <GridImage 
                  $imageUrl="https://source.unsplash.com/random/600x400/?books&sig=3"
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.5, delay: 0.6 }}
                />
                <GridImage 
                  $imageUrl="https://source.unsplash.com/random/600x400/?typewriter&sig=4"
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.5, delay: 0.8 }}
                />
              </ImageGalleryGrid>
              
              <GallerySlideshow />
            </FeaturedSection>
            
            {/* Legacy Showcase Section using LegacyShowcase component */}
            
            
            {timelineData.map((yearData, index) => (
              <YearSection 
                key={yearData.year}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ 
                  duration: 0.8,
                  delay: index * 0.1 
                }}
                viewport={{ once: true, amount: 0.3 }}
              >
                <YearTitle
                  initial={{ x: -30, opacity: 0 }}
                  whileInView={{ x: 0, opacity: 1 }}
                  transition={{ duration: 0.5, delay: 0.2 }}
                  viewport={{ once: true }}
                >
                  {yearData.year}
                </YearTitle>
                <CardContainer>
                  {yearData.leaders.map((leader, idx) => (
                    <motion.div
                      key={leader.id}
                      initial={{ opacity: 0, scale: 0.9, y: 20 }}
                      whileInView={{ opacity: 1, scale: 1, y: 0 }}
                      transition={{ 
                        duration: 0.5,
                        delay: idx * 0.15 
                      }}
                      viewport={{ once: true, amount: 0.3 }}
                    >
                      <TimelineCard
                        id={leader.id}
                        name={leader.name}
                        quote={leader.quote}
                        imageUrl={leader.imageUrl}
                        color={leader.color}
                        delay={idx * 0.15}
                      />
                    </motion.div>
                  ))}
                </CardContainer>
              </YearSection>
            ))}
            <LegacyShowcase>
              <SectionTitle>Literary Milestones</SectionTitle>
              <ScrollableShowcase>
                <ShowcaseSection>
                  <h4>First Major Publication</h4>
                  <p>In 2023, our society launched its first digital anthology, "Echoes of Tomorrow," featuring works from over 50 student authors.</p>
                </ShowcaseSection>
                
                <ShowcaseSection>
                  <h4>National Recognition</h4>
                  <p>Our 2024 poetry competition attracted entries from across the country, establishing us as a hub for emerging literary talent.</p>
                </ShowcaseSection>
                
                <ShowcaseSection>
                  <h4>Digital Transformation</h4>
                  <p>The society embraced new media in 2025, creating interactive narrative experiences that blend traditional storytelling with digital innovation.</p>
                </ShowcaseSection>
              </ScrollableShowcase>
            </LegacyShowcase>
            
            
            {/* History Section */}
            <HistorySection>
              
              <SectionDivider />
              <HistorySectionTitle>Our Fiery Beginning</HistorySectionTitle>
              <HistoryHighlight
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.8 }}
                  viewport={{ once: true, amount: 0.3 }}
                >
                  <h3>Founding Moment</h3>
                  <p>In 2022, five passionate literature students gathered in the old campus library annex during a rainstorm. By candlelight, they drafted the society's mission statement: "To ignite imagination, foster connection, and preserve our collective stories."</p>
                </HistoryHighlight>
                
                <HistoryHighlight
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.8, delay: 0.2 }}
                  viewport={{ once: true, amount: 0.3 }}
                >
                  <h3>First Public Reading</h3>
                  <p>The society's inaugural event drew over a hundred attendees, far exceeding expectations. The night featured poetry, short fiction, and a dramatic reading of an original play that later won the university's arts prize.</p>
                </HistoryHighlight>
                
              <HistoryContent>
                
                
                <QuotesCarousel />
                
                {/* Add HistoryHighlight component for key historical moments */}
                
                <EmberEffect />
              </HistoryContent>
            </HistorySection>
          </TimelineSection>
        </MainLayout>
      </PageContainer>
    </PageTransition>
  );
};


export default LegacyPage;