import { motion } from 'framer-motion';
import styled, { keyframes } from 'styled-components';
import { useEffect, useState } from 'react';
import usePageTransition from '../hooks/usePageTransition';
import PageTransition from '../components/PageTransition';

// Define types for our events
interface EventType {
  id: string;
  title: string;
  description: string;
  date: Date;
  time: string;
  location: string;
  imageUrl: string;
  category: 'workshop' | 'competition' | 'meeting' | 'special';
}

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
  z-index: 1; // Lower z-index than navigation
`;

const GlowingOverlay = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: radial-gradient(circle at center, rgba(0, 255, 255, 0.15) 0%, rgba(0, 0, 0, 0) 70%);
  pointer-events: none; // This ensures clicks pass through
  z-index: 1;
  opacity: 0.8;
`;

const RetroGrid = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-image: linear-gradient(rgba(0, 255, 255, 0.05) 1px, transparent 1px),
                    linear-gradient(90deg, rgba(0, 255, 255, 0.05) 1px, transparent 1px);
  background-size: 30px 30px;
  perspective: 500px;
  transform: perspective(500px) rotateX(30deg) scale(1.5);
  transform-origin: center center;
  pointer-events: none;
  opacity: 0.4;
  z-index: 0;
  animation: gridMove 20s linear infinite;
  
  @keyframes gridMove {
    0% {
      background-position: 0 0;
    }
    100% {
      background-position: 30px 30px;
    }
  }
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
  pointer-events: none; // Ensure clicks pass through
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
  pointer-events: none; // Ensure clicks pass through
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
  margin-top: 60px;
  z-index: 4;
`;

const ContentContainer = styled.div`
  width: 100%;
  max-width: 1200px;
  min-height: 100vh;
  padding: 2rem;
  position: relative;
  margin: 0 auto;
  
  @media (max-width: 768px) {
    padding: 1rem;
  }
`;

const HeaderContainer = styled.div`
  padding: 4rem 2rem 3rem;
  text-align: center;
  background: rgba(0, 0, 0, 0.5);
  z-index: 10;
  backdrop-filter: blur(5px);
  border-bottom: 1px solid rgba(0, 255, 255, 0.2);
  position: relative;
  width: 100%;
  margin-bottom: 2rem;
  border-radius: 12px;
  
  &::after {
    content: '';
    position: absolute;
    bottom: 0;
    left: 0;
    width: 100%;
    height: 3px;
    background: linear-gradient(90deg, transparent, rgba(0, 255, 255, 0.8), transparent);
  }
  
  @media (max-width: 768px) {
    padding: 3rem 1rem 2rem;
  }
`;

const PageTitle = styled(motion.h1)`
  font-size: 4rem;
  font-weight: 800;
  margin-bottom: 1rem;
  background: linear-gradient(90deg, #00ffff 0%, #0088ff 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  text-shadow: 0 0 15px rgba(0, 255, 255, 0.5);
  font-family: 'Pixelify Sans', sans-serif;
  
  @media (max-width: 768px) {
    font-size: 2.5rem;
  }
`;

const Subtitle = styled(motion.p)`
  font-size: 1.2rem;
  max-width: 800px;
  margin: 0 auto;
  opacity: 0.8;
  line-height: 1.6;
  
  @media (max-width: 768px) {
    font-size: 1rem;
  }
`;

const pulse = keyframes`
  0%, 100% {
    box-shadow: 0 0 20px rgba(0, 255, 255, 0.3);
  }
  50% {
    box-shadow: 0 0 40px rgba(0, 255, 255, 0.6);
  }
`;

const CountdownContainer = styled(motion.div)`
  width: 100%;
  background: rgba(0, 0, 0, 0.5);
  backdrop-filter: blur(10px);
  border-radius: 12px;
  padding: 2rem;
  margin-bottom: 3rem;
  border: 1px solid rgba(0, 255, 255, 0.2);
  display: flex;
  flex-direction: column;
  align-items: center;
  animation: ${pulse} 3s ease-in-out infinite;
  position: relative;
  overflow: hidden;
  
  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    width: 200%;
    height: 100%;
    background: linear-gradient(90deg, transparent, rgba(0, 255, 255, 0.2), transparent);
    transform: translateX(-100%);
    animation: shine 8s infinite;
  }
  
  @keyframes shine {
    0% {
      transform: translateX(-100%);
    }
    20%, 100% {
      transform: translateX(100%);
    }
  }
  
  @media (max-width: 768px) {
    padding: 1.5rem;
  }
`;

const CountdownTitle = styled.h2`
  font-size: 2rem;
  margin-bottom: 1rem;
  color: #00ffff;
  text-shadow: 0 0 10px rgba(0, 255, 255, 0.5);
  font-family: 'Pixelify Sans', sans-serif;
  text-align: center;
  
  @media (max-width: 768px) {
    font-size: 1.5rem;
  }
`;

const EventName = styled.h3`
  font-size: 1.8rem;
  margin-bottom: 1.5rem;
  background: linear-gradient(90deg, #00ffff 0%, #0088ff 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  font-family: 'Pixelify Sans', sans-serif;
  text-align: center;
  
  @media (max-width: 768px) {
    font-size: 1.3rem;
  }
`;

const TimerDisplay = styled.div`
  display: flex;
  gap: 1.5rem;
  margin: 1rem 0;
  
  @media (max-width: 768px) {
    gap: 0.8rem;
  }
`;

const glow = keyframes`
  0%, 100% {
    box-shadow: 0 0 10px rgba(0, 255, 255, 0.5);
  }
  50% {
    box-shadow: 0 0 20px rgba(0, 255, 255, 0.8);
  }
`;

const TimeUnit = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  background: rgba(0, 0, 0, 0.7);
  border: 1px solid rgba(0, 255, 255, 0.3);
  border-radius: 10px;
  width: 100px;
  height: 100px;
  animation: ${glow} 3s ease-in-out infinite;
  position: relative;
  
  &::after {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    height: 1px;
    background: linear-gradient(90deg, transparent, rgba(0, 255, 255, 0.8), transparent);
  }
  
  @media (max-width: 768px) {
    width: 70px;
    height: 70px;
  }
`;

const TimeNumber = styled.span`
  font-size: 2.5rem;
  font-weight: bold;
  color: #00ffff;
  font-family: 'Pixelify Sans', sans-serif;
  
  @media (max-width: 768px) {
    font-size: 1.8rem;
  }
`;

const TimeLabel = styled.span`
  font-size: 0.9rem;
  color: rgba(255, 255, 255, 0.7);
  text-transform: uppercase;
  margin-top: 0.3rem;
  
  @media (max-width: 768px) {
    font-size: 0.7rem;
  }
`;

const CalendarContainer = styled(motion.div)`
  width: 100%;
  background: rgba(0, 0, 0, 0.5);
  backdrop-filter: blur(10px);
  border-radius: 12px;
  padding: 2rem;
  border: 1px solid rgba(0, 255, 255, 0.2);
  display: flex;
  flex-direction: column;
  position: relative;
  overflow: hidden;
  
  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    height: 1px;
    background: linear-gradient(90deg, transparent, rgba(0, 255, 255, 0.8), transparent);
  }
  
  @media (max-width: 768px) {
    padding: 1rem;
  }
`;

const CalendarTitle = styled.h2`
  font-size: 2rem;
  margin-bottom: 1.5rem;
  color: #00ffff;
  text-shadow: 0 0 10px rgba(0, 255, 255, 0.5);
  font-family: 'Pixelify Sans', sans-serif;
  text-align: center;
  
  @media (max-width: 768px) {
    font-size: 1.5rem;
    margin-bottom: 1rem;
  }
`;

const MonthNavigation = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1.5rem;
`;

const MonthTitle = styled.h3`
  font-size: 1.5rem;
  color: white;
  font-family: 'Pixelify Sans', sans-serif;
`;

const NavButton = styled(motion.button)`
  background: rgba(0, 0, 0, 0.5);
  border: 1px solid rgba(0, 255, 255, 0.3);
  color: #00ffff;
  font-size: 1rem;
  padding: 0.5rem 1rem;
  border-radius: 5px;
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 0.5rem;
  transition: all 0.3s ease;
  
  &:hover {
    background: rgba(0, 255, 255, 0.1);
  }
`;

const CalendarGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(7, 1fr);
  gap: 0.5rem;
  
  @media (max-width: 768px) {
    gap: 0.2rem;
  }
`;

const WeekdayHeader = styled.div`
  text-align: center;
  padding: 0.5rem;
  font-weight: bold;
  color: rgba(255, 255, 255, 0.7);
  text-transform: uppercase;
  font-size: 0.8rem;
  
  @media (max-width: 768px) {
    font-size: 0.7rem;
    padding: 0.3rem;
  }
`;

const DayCell = styled(motion.div)<{ $isCurrentMonth: boolean; $hasEvent: boolean; $isToday: boolean }>`
  aspect-ratio: 1;
  background: ${(props) => 
    props.$isToday 
      ? 'rgba(0, 255, 255, 0.2)' 
      : props.$hasEvent 
        ? 'rgba(0, 255, 255, 0.1)' 
        : 'rgba(0, 0, 0, 0.3)'};
  border: 1px solid ${(props) => 
    props.$isToday 
      ? 'rgba(0, 255, 255, 0.8)' 
      : props.$hasEvent 
        ? 'rgba(0, 255, 255, 0.4)' 
        : 'rgba(255, 255, 255, 0.1)'};
  border-radius: 5px;
  color: ${(props) => props.$isCurrentMonth ? 'white' : 'rgba(255, 255, 255, 0.4)'};
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  cursor: ${(props) => (props.$hasEvent ? 'pointer' : 'default')};
  position: relative;
  overflow: hidden;
  
  ${(props) => props.$hasEvent && `
    &::after {
      content: '';
      position: absolute;
      bottom: 5px;
      width: 6px;
      height: 6px;
      background: #00ffff;
      border-radius: 50%;
      box-shadow: 0 0 5px rgba(0, 255, 255, 0.8);
    }
  `}
  
  &:hover {
    transform: ${(props) => (props.$hasEvent ? 'scale(1.05)' : 'none')};
    z-index: ${(props) => (props.$hasEvent ? '10' : '1')};
  }
`;

const DayNumber = styled.span`
  font-size: 1rem;
  font-weight: ${(props) => (props.color === 'white' ? 'bold' : 'normal')};
  
  @media (max-width: 768px) {
    font-size: 0.8rem;
  }
`;

const EventsListContainer = styled(motion.div)`
  width: 100%;
  background: rgba(0, 0, 0, 0.5);
  backdrop-filter: blur(10px);
  border-radius: 12px;
  padding: 2rem;
  margin-top: 3rem;
  border: 1px solid rgba(0, 255, 255, 0.2);
  
  @media (max-width: 768px) {
    padding: 1rem;
  }
`;

const EventsList = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
  gap: 1.5rem;
  margin-top: 1.5rem;
  
  @media (max-width: 768px) {
    grid-template-columns: 1fr;
    gap: 1rem;
  }
`;

const EventsTitle = styled.h2`
  font-size: 2rem;
  margin-bottom: 1.5rem;
  color: #00ffff;
  text-shadow: 0 0 10px rgba(0, 255, 255, 0.5);
  font-family: 'Pixelify Sans', sans-serif;
  text-align: center;
  
  @media (max-width: 768px) {
    font-size: 1.5rem;
  }
`;

const EventCard = styled(motion.div)<{ $category: string }>`
  background: rgba(0, 0, 0, 0.7);
  border-radius: 10px;
  overflow: hidden;
  border: 1px solid rgba(0, 255, 255, 0.2);
  position: relative;
  
  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    width: 5px;
    height: 100%;
    background: ${props => {
      switch(props.$category) {
        case 'workshop': return 'linear-gradient(to bottom, #00ffff, #0088ff)';
        case 'competition': return 'linear-gradient(to bottom, #ff00ff, #ff0088)';
        case 'meeting': return 'linear-gradient(to bottom, #ffff00, #ffaa00)';
        case 'special': return 'linear-gradient(to bottom, #ff0000, #aa0000)';
        default: return 'linear-gradient(to bottom, #00ffff, #0088ff)';
      }
    }};
  }
`;

const EventImageContainer = styled.div`
  width: 100%;
  height: 150px;
  overflow: hidden;
  position: relative;
`;

const EventImage = styled.img`
  width: 100%;
  height: 100%;
  object-fit: cover;
  transition: transform 0.5s ease;
  
  ${EventCard}:hover & {
    transform: scale(1.1);
  }
`;

const EventInfo = styled.div`
  padding: 1.5rem;
`;

const EventCardTitle = styled.h3`
  font-size: 1.2rem;
  margin-bottom: 0.5rem;
  color: white;
  font-family: 'Pixelify Sans', sans-serif;
`;

const EventDate = styled.div`
  font-size: 0.9rem;
  color: #00ffff;
  margin-bottom: 0.5rem;
  display: flex;
  align-items: center;
  gap: 0.5rem;
`;

const EventLocation = styled.div`
  font-size: 0.9rem;
  color: rgba(255, 255, 255, 0.7);
  margin-bottom: 1rem;
  display: flex;
  align-items: center;
  gap: 0.5rem;
`;

const EventDescription = styled.p`
  font-size: 0.9rem;
  color: rgba(255, 255, 255, 0.9);
  line-height: 1.5;
`;

const CategoryBadge = styled.span<{ $category: string }>`
  position: absolute;
  top: 10px;
  right: 10px;
  padding: 0.3rem 0.8rem;
  border-radius: 20px;
  font-size: 0.7rem;
  font-weight: bold;
  text-transform: uppercase;
  background: ${props => {
    switch(props.$category) {
      case 'workshop': return 'rgba(0, 255, 255, 0.2)';
      case 'competition': return 'rgba(255, 0, 255, 0.2)';
      case 'meeting': return 'rgba(255, 255, 0, 0.2)';
      case 'special': return 'rgba(255, 0, 0, 0.2)';
      default: return 'rgba(0, 255, 255, 0.2)';
    }
  }};
  color: ${props => {
    switch(props.$category) {
      case 'workshop': return '#00ffff';
      case 'competition': return '#ff00ff';
      case 'meeting': return '#ffff00';
      case 'special': return '#ff5555';
      default: return '#00ffff';
    }
  }};
  backdrop-filter: blur(5px);
  border: 1px solid ${props => {
    switch(props.$category) {
      case 'workshop': return 'rgba(0, 255, 255, 0.5)';
      case 'competition': return 'rgba(255, 0, 255, 0.5)';
      case 'meeting': return 'rgba(255, 255, 0, 0.5)';
      case 'special': return 'rgba(255, 0, 0, 0.5)';
      default: return 'rgba(0, 255, 255, 0.5)';
    }
  }};
  box-shadow: 0 0 10px ${props => {
    switch(props.$category) {
      case 'workshop': return 'rgba(0, 255, 255, 0.3)';
      case 'competition': return 'rgba(255, 0, 255, 0.3)';
      case 'meeting': return 'rgba(255, 255, 0, 0.3)';
      case 'special': return 'rgba(255, 0, 0, 0.3)';
      default: return 'rgba(0, 255, 255, 0.3)';
    }
  }};
`;

const ModalOverlay = styled(motion.div)`
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(0, 0, 0, 0.8);
  backdrop-filter: blur(10px);
  z-index: 100;
  display: flex;
  align-items: flex-start;  // Changed from center
  justify-content: center;
  padding: 2rem;
  
  @media (max-width: 768px) {
    padding: 1rem;
  }
`;

const EventModal = styled(motion.div)<{ $top?: number; $left?: number }>`
  background: rgba(10, 10, 10, 0.9);
  border-radius: 12px;
  border: 1px solid rgba(0, 255, 255, 0.3);
  width: 100%;
  max-width: 600px;
  max-height: 80vh;
  overflow-y: auto;
  position: absolute;
  top: ${props => props.$top ? `${props.$top}px` : '50%'};
  left: ${props => props.$left ? `${props.$left}px` : '50%'};
  transform: ${props => props.$top && props.$left ? 
    'translate(-50%, 0)' : 'translate(-50%, -50%)'};
  
  &::-webkit-scrollbar {
    width: 5px;
  }
  
  &::-webkit-scrollbar-track {
    background: rgba(0, 0, 0, 0.2);
  }
  
  &::-webkit-scrollbar-thumb {
    background: rgba(0, 255, 255, 0.5);
    border-radius: 5px;
  }
`;

const ModalHeader = styled.div`
  padding: 1.5rem;
  border-bottom: 1px solid rgba(0, 255, 255, 0.2);
  position: relative;
`;

const ModalTitle = styled.h2`
  color: white;
  font-size: 1.8rem;
  margin-bottom: 0.5rem;
  font-family: 'Pixelify Sans', sans-serif;
`;

const ModalClose = styled(motion.button)`
  position: absolute;
  top: 1.5rem;
  right: 1.5rem;
  background: rgba(0, 0, 0, 0.3);
  border: 1px solid rgba(255, 255, 255, 0.2);
  color: white;
  width: 32px;
  height: 32px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  
  &:hover {
    background: rgba(255, 0, 0, 0.2);
  }
`;

const ModalBody = styled.div`
  padding: 1.5rem;
`;

const ModalImage = styled.img`
  width: 100%;
  height: 250px;
  object-fit: cover;
  border-radius: 8px;
  margin-bottom: 1.5rem;
  border: 1px solid rgba(0, 255, 255, 0.2);
`;

const ModalInfo = styled.div`
  margin-bottom: 1.5rem;
`;

const ModalDescription = styled.p`
  color: rgba(255, 255, 255, 0.9);
  line-height: 1.8;
  margin-bottom: 2rem;
  font-size: 1rem;
`;

// Animation variants
const titleVariants = {
  hidden: { opacity: 0, y: -50 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.8, ease: "easeOut" }
  }
};

const subtitleVariants = {
  hidden: { opacity: 0, y: 30 },
  visible: {
    opacity: 0.8,
    y: 0,
    transition: { duration: 0.8, delay: 0.3, ease: "easeOut" }
  }
};

const EventsPage: React.FC = () => {
  const { isAnimating } = usePageTransition();
  const [selectedMonth, setSelectedMonth] = useState(new Date(2025, 5, 1)); // June 2025
  const [selectedEvent, setSelectedEvent] = useState<EventType | null>(null);
  const [countdown, setCountdown] = useState({ days: 0, hours: 0, minutes: 0, seconds: 0 });
  // Add state to track click position
  const [clickPosition, setClickPosition] = useState({ x: 0, y: 0 });
  
  // Sample events data
  const events: EventType[] = [
    // Events for 2025-2026
    {
      id: "e1",
      title: "Summer Kickoff Reading",
      description: "Join us for our summer kickoff event with readings from new members and refreshments on the lawn. Bring a book to exchange!",
      date: new Date(2025, 5, 12), // June 12, 2025
      time: "4:00 PM - 7:00 PM",
      location: "Main Campus Lawn",
      imageUrl: "https://source.unsplash.com/random/600x400/?summer-reading&sig=26",
      category: "meeting"
    },
    {
      id: "e2",
      title: "Creative Writing Masterclass",
      description: "World-renowned author James Chen leads this exclusive masterclass on narrative techniques and character development.",
      date: new Date(2025, 5, 25), // June 25, 2025
      time: "10:00 AM - 3:00 PM",
      location: "Writers' Workshop Center",
      imageUrl: "https://source.unsplash.com/random/600x400/?writing&sig=27",
      category: "workshop"
    },
    {
      id: "e3",
      title: "Independence Day Poetry Slam",
      description: "Express your thoughts on freedom, independence, and national identity in our themed poetry competition.",
      date: new Date(2025, 6, 4), // July 4, 2025
      time: "7:00 PM - 10:00 PM",
      location: "Student Union Terrace",
      imageUrl: "https://source.unsplash.com/random/600x400/?poetry-slam&sig=28",
      category: "competition"
    },
    {
      id: "e4",
      title: "Literary Adaptation Film Night",
      description: "Watch and discuss film adaptations of classic novels. This month: 'Pride and Prejudice' various adaptations compared.",
      date: new Date(2025, 6, 18), // July 18, 2025
      time: "6:30 PM - 9:30 PM",
      location: "Media Center Screening Room",
      imageUrl: "https://source.unsplash.com/random/600x400/?film&sig=29",
      category: "meeting"
    },
    {
      id: "e5",
      title: "August Writing Retreat",
      description: "Escape the daily grind with our weekend writing retreat. Workshops, quiet writing time, and peer feedback sessions included.",
      date: new Date(2025, 7, 8), // August 8, 2025
      time: "Friday 2:00 PM - Sunday 4:00 PM",
      location: "Lakeview Retreat Center",
      imageUrl: "https://source.unsplash.com/random/600x400/?retreat&sig=30",
      category: "special"
    },
    {
      id: "e6",
      title: "Back to School Literary Mixer",
      description: "Meet fellow literature enthusiasts at our beginning-of-semester social event. Great opportunity for new members to connect!",
      date: new Date(2025, 7, 28), // August 28, 2025
      time: "5:00 PM - 8:00 PM",
      location: "English Department Courtyard",
      imageUrl: "https://source.unsplash.com/random/600x400/?mixer&sig=31",
      category: "meeting"
    },
    {
      id: "e7",
      title: "Banned Books Week Discussion",
      description: "Explore the history and implications of literary censorship with our panel of professors and free speech advocates.",
      date: new Date(2025, 8, 15), // September 15, 2025
      time: "4:00 PM - 6:00 PM",
      location: "University Library Special Collections",
      imageUrl: "https://source.unsplash.com/random/600x400/?banned-books&sig=32",
      category: "meeting"
    },
    {
      id: "e8",
      title: "Fall Fiction Contest Launch",
      description: "Our annual fiction writing contest begins today! This year's theme: 'Transitions'. Max word count: 5,000.",
      date: new Date(2025, 8, 30), // September 30, 2025
      time: "Submissions open until October 30",
      location: "Online Submission",
      imageUrl: "https://source.unsplash.com/random/600x400/?contest&sig=33",
      category: "competition"
    },
    {
      id: "e9",
      title: "Halloween Horror Writing Workshop",
      description: "Learn techniques for creating suspense, dread, and terror in your writing with horror author Mia Rodriguez.",
      date: new Date(2025, 9, 25), // October 25, 2025
      time: "7:00 PM - 10:00 PM",
      location: "Old Campus Bell Tower",
      imageUrl: "https://source.unsplash.com/random/600x400/?horror&sig=34",
      category: "workshop"
    },
    {
      id: "e10",
      title: "NaNoWriMo Kickoff Party",
      description: "Prepare for National Novel Writing Month with our planning workshop and writing sprint. Develop your novel idea and meet writing buddies!",
      date: new Date(2025, 10, 1), // November 1, 2025
      time: "10:00 AM - 2:00 PM",
      location: "Creative Writing Center",
      imageUrl: "https://source.unsplash.com/random/600x400/?nanowrimo&sig=35",
      category: "special"
    },
    {
      id: "e11",
      title: "NaNoWriMo Writing Sessions",
      description: "Drop-in writing sessions every Tuesday and Thursday throughout November. Come write with fellow NaNoWriMo participants!",
      date: new Date(2025, 10, 15), // November 15, 2025
      time: "6:00 PM - 9:00 PM",
      location: "University Coffee Shop",
      imageUrl: "https://source.unsplash.com/random/600x400/?writing-group&sig=36",
      category: "meeting"
    },
    {
      id: "e12",
      title: "Winter Tales Reading Night",
      description: "Share your original winter-themed stories or poems at our cozy reading night. Hot chocolate and cookies provided!",
      date: new Date(2025, 11, 10), // December 10, 2025
      time: "7:00 PM - 9:00 PM",
      location: "Fireside Lounge",
      imageUrl: "https://source.unsplash.com/random/600x400/?winter-tales&sig=37",
      category: "meeting"
    },
    {
      id: "e13",
      title: "End of Year Celebration",
      description: "Celebrate our literary accomplishments of 2025 with awards, readings, and a look ahead to next year's events.",
      date: new Date(2025, 11, 18), // December 18, 2025
      time: "6:00 PM - 10:00 PM",
      location: "Faculty Club Ballroom",
      imageUrl: "https://source.unsplash.com/random/600x400/?celebration&sig=38",
      category: "special"
    },
    {
      id: "e14",
      title: "New Year's Writing Resolutions",
      description: "Set your writing goals for 2026 with our guided workshop on creating achievable literary resolutions.",
      date: new Date(2026, 0, 10), // January 10, 2026
      time: "1:00 PM - 3:00 PM",
      location: "Student Center Workshop Room",
      imageUrl: "https://source.unsplash.com/random/600x400/?resolutions&sig=39",
      category: "workshop"
    },
    {
      id: "e15",
      title: "Winter Book Exchange",
      description: "Bring a book you've enjoyed to exchange with fellow members. Discover new reads and connect over literary discussions.",
      date: new Date(2026, 0, 24), // January 24, 2026
      time: "3:00 PM - 5:00 PM",
      location: "English Department Lounge",
      imageUrl: "https://source.unsplash.com/random/600x400/?book-exchange&sig=40",
      category: "meeting"
    },
    {
      id: "e16",
      title: "Love in Literature Symposium",
      description: "Explore representations of love across different literary periods and genres in this Valentine's-themed academic event.",
      date: new Date(2026, 1, 14), // February 14, 2026
      time: "10:00 AM - 4:00 PM",
      location: "Humanities Building Lecture Hall",
      imageUrl: "https://source.unsplash.com/random/600x400/?love-literature&sig=41",
      category: "special"
    },
    {
      id: "e17",
      title: "Playwriting Workshop Series",
      description: "Learn the fundamentals of dramatic writing in this three-week workshop led by playwright and screenwriter David Washington.",
      date: new Date(2026, 1, 28), // February 28, 2026
      time: "3:00 PM - 6:00 PM (First session)",
      location: "Theater Department Studio",
      imageUrl: "https://source.unsplash.com/random/600x400/?playwriting&sig=42",
      category: "workshop"
    },
    {
      id: "e18",
      title: "Women's History Month Reading Series",
      description: "Join us every Tuesday in March for readings celebrating women writers throughout history.",
      date: new Date(2026, 2, 10), // March 10, 2026
      time: "5:30 PM - 7:00 PM",
      location: "Women's Center",
      imageUrl: "https://source.unsplash.com/random/600x400/?women-writers&sig=43",
      category: "meeting"
    },
    {
      id: "e19",
      title: "Spring Poetry Competition",
      description: "Our annual poetry competition is now accepting submissions. Theme: 'Renewal'. Cash prizes and publication opportunities.",
      date: new Date(2026, 2, 25), // March 25, 2026
      time: "Submission deadline: 11:59 PM",
      location: "Online Submission",
      imageUrl: "https://source.unsplash.com/random/600x400/?poetry-competition&sig=44",
      category: "competition"
    },
    {
      id: "e20",
      title: "Literary Humor Workshop",
      description: "Discover techniques for incorporating humor into your writing with satirist and essayist Tanya Patel.",
      date: new Date(2026, 3, 1), // April 1, 2026
      time: "4:00 PM - 6:30 PM",
      location: "Creative Writing Center",
      imageUrl: "https://source.unsplash.com/random/600x400/?humor&sig=45",
      category: "workshop"
    },
    {
      id: "e21",
      title: "Earth Day Nature Writing Excursion",
      description: "Join us for an outdoor writing experience at the botanical gardens, focusing on nature observation and description.",
      date: new Date(2026, 3, 22), // April 22, 2026
      time: "10:00 AM - 2:00 PM",
      location: "University Botanical Gardens",
      imageUrl: "https://source.unsplash.com/random/600x400/?nature-writing&sig=46",
      category: "special"
    },
    {
      id: "e22",
      title: "Finals Week Writing Break",
      description: "Take a creative break from studying with short writing exercises and literary games. Snacks provided!",
      date: new Date(2026, 4, 5), // May 5, 2026
      time: "1:00 PM - 3:00 PM",
      location: "Student Center Relaxation Zone",
      imageUrl: "https://source.unsplash.com/random/600x400/?writing-break&sig=47",
      category: "meeting"
    },
    {
      id: "e23",
      title: "Graduation Literary Send-Off",
      description: "A special event honoring our graduating seniors featuring readings from their work and alumni networking.",
      date: new Date(2026, 4, 20), // May 20, 2026
      time: "5:00 PM - 8:00 PM",
      location: "Alumni Center Garden",
      imageUrl: "https://source.unsplash.com/random/600x400/?graduation&sig=48",
      category: "special"
    },
    
    // Original events from June 2026 onwards remain unchanged
    {
      id: "1",
      title: "Summer Literary Workshop",
      description: "Join us for an intensive workshop on creative writing techniques, led by renowned author Aisha Kumar. This workshop will focus on building compelling characters and crafting engaging dialogue.",
      date: new Date(2026, 5, 15), // June 15, 2026
      time: "10:00 AM - 2:00 PM",
      location: "Central Library, Room 202",
      imageUrl: "https://source.unsplash.com/random/600x400/?workshop&sig=1",
      category: "workshop"
    },
    {
      id: "2",
      title: "Poetry Slam Competition",
      description: "Showcase your poetic talents in our annual Poetry Slam! Open to all members, this event features cash prizes and publication opportunities for top performers.",
      date: new Date(2026, 5, 28), // June 28, 2026
      time: "6:00 PM - 9:00 PM",
      location: "Student Center Auditorium",
      imageUrl: "https://source.unsplash.com/random/600x400/?poetry&sig=2",
      category: "competition"
    },
    {
      id: "3",
      title: "Monthly Book Club Meeting",
      description: "This month we're discussing 'The Midnight Library' by Matt Haig. Come prepared with your thoughts and questions about this exploration of the choices that make a life worth living.",
      date: new Date(2026, 6, 10), // July 10, 2026
      time: "5:30 PM - 7:00 PM",
      location: "Coffee House Lounge",
      imageUrl: "https://source.unsplash.com/random/600x400/?books&sig=3",
      category: "meeting"
    },
    {
      id: "4",
      title: "Author Spotlight: Maya Iyer",
      description: "Join us for an evening with acclaimed novelist Maya Iyer, who will read from her latest work and discuss her creative process. Book signing to follow the talk.",
      date: new Date(2026, 6, 22), // July 22, 2026
      time: "7:00 PM - 9:00 PM",
      location: "Main Hall Auditorium",
      imageUrl: "https://source.unsplash.com/random/600x400/?author&sig=4",
      category: "special"
    },
    {
      id: "5",
      title: "Flash Fiction Contest",
      description: "Challenge yourself to tell a complete story in just 500 words! Submit your entries by the deadline for a chance to be featured in our annual anthology.",
      date: new Date(2026, 7, 5), // August 5, 2026
      time: "Submission deadline: 11:59 PM",
      location: "Online Submission",
      imageUrl: "https://source.unsplash.com/random/600x400/?writing&sig=5",
      category: "competition"
    },
    {
      id: "6",
      title: "Character Development Workshop",
      description: "Learn techniques for creating memorable, three-dimensional characters that leap off the page. This hands-on workshop will include writing exercises and group feedback.",
      date: new Date(2026, 7, 18), // August 18, 2026
      time: "1:00 PM - 4:00 PM",
      location: "Creative Writing Center, Room 101",
      imageUrl: "https://source.unsplash.com/random/600x400/?characters&sig=6",
      category: "workshop"
    },
    {
      id: "7",
      title: "Literary Society Annual Gala",
      description: "Our most prestigious event of the year! Join us for a formal evening celebrating literary achievement, featuring keynote speaker and Booker Prize winner Rahul Mehta.",
      date: new Date(2026, 8, 10), // September 10, 2026
      time: "7:00 PM - 11:00 PM",
      location: "Grand Ballroom, University Hotel",
      imageUrl: "https://source.unsplash.com/random/600x400/?gala&sig=7",
      category: "special"
    },
    {
      id: "8",
      title: "Speculative Fiction Workshop",
      description: "Dive into the worlds of science fiction, fantasy, and magical realism with award-winning author Zara Kapoor. Learn how to build convincing alternate realities.",
      date: new Date(2026, 8, 25), // September 25, 2026
      time: "3:00 PM - 6:00 PM",
      location: "Sci-Fi Library Annex",
      imageUrl: "https://source.unsplash.com/random/600x400/?fantasy&sig=8",
      category: "workshop"
    },
    {
      id: "9",
      title: "Literary Journal Launch Party",
      description: "Celebrate the release of this year's edition of our literary journal 'Echoes'. Meet the contributors and enjoy readings from selected works.",
      date: new Date(2026, 9, 8), // October 8, 2026
      time: "6:30 PM - 8:30 PM",
      location: "Art Gallery Lounge",
      imageUrl: "https://source.unsplash.com/random/600x400/?journal&sig=9",
      category: "special"
    },
    {
      id: "10",
      title: "Story Structure Masterclass",
      description: "Master the art of plotting and structuring compelling narratives in this intensive masterclass with visiting professor and novelist Vikram Reddy.",
      date: new Date(2026, 9, 20), // October 20, 2026
      time: "9:00 AM - 4:00 PM",
      location: "Writers' Workshop Center",
      imageUrl: "https://source.unsplash.com/random/600x400/?structure&sig=10",
      category: "workshop"
    },
    {
      id: "11",
      title: "Open Mic Night",
      description: "Share your original work in a supportive environment. All genres welcome - poetry, prose, drama, or experimental forms. Sign up in advance or on the night.",
      date: new Date(2026, 10, 5), // November 5, 2026
      time: "8:00 PM - 10:00 PM",
      location: "Campus Coffee Shop",
      imageUrl: "https://source.unsplash.com/random/600x400/?microphone&sig=11",
      category: "meeting"
    },
    {
      id: "12",
      title: "Literary Translation Panel",
      description: "Explore the art and challenges of literary translation with our panel of multilingual writers and translators. Discussion will cover both technical and creative aspects.",
      date: new Date(2026, 10, 18), // November 18, 2026
      time: "4:00 PM - 6:00 PM",
      location: "Modern Languages Building, Room 305",
      imageUrl: "https://source.unsplash.com/random/600x400/?translation&sig=12",
      category: "meeting"
    },
    {
      id: "13",
      title: "Winter Writing Retreat",
      description: "Escape the hustle and focus on your writing during our weekend retreat. Includes workshops, one-on-one consultations, and plenty of time for personal writing.",
      date: new Date(2026, 11, 10), // December 10, 2026
      time: "Friday 4:00 PM - Sunday 2:00 PM",
      location: "Mountain View Lodge",
      imageUrl: "https://source.unsplash.com/random/600x400/?retreat&sig=13",
      category: "special"
    },
    {
      id: "14",
      title: "Year-End Literary Quiz Night",
      description: "Test your knowledge of literature in our fun, competitive quiz night. Form teams of up to 4 people and vie for the title of Literary Champions!",
      date: new Date(2026, 11, 20), // December 20, 2026
      time: "7:00 PM - 10:00 PM",
      location: "Student Union Game Room",
      imageUrl: "https://source.unsplash.com/random/600x400/?quiz&sig=14",
      category: "competition"
    },
    {
      id: "15",
      title: "New Year Literary Resolutions Workshop",
      description: "Set meaningful writing goals for the coming year in this focused workshop. We'll help you create actionable plans to achieve your literary ambitions.",
      date: new Date(2027, 0, 15), // January 15, 2027
      time: "2:00 PM - 5:00 PM",
      location: "Career Development Center",
      imageUrl: "https://source.unsplash.com/random/600x400/?goals&sig=15",
      category: "workshop"
    },
    {
      id: "16",
      title: "Monthly Book Club: Winter Edition",
      description: "Our first book club meeting of the year will discuss 'Cloud Atlas' by David Mitchell. Hot chocolate and snacks provided!",
      date: new Date(2027, 0, 28), // January 28, 2027
      time: "6:00 PM - 8:00 PM",
      location: "Fireside Lounge, Student Center",
      imageUrl: "https://source.unsplash.com/random/600x400/?winter-books&sig=16",
      category: "meeting"
    },
    {
      id: "17",
      title: "Valentine's Poetry Exchange",
      description: "Celebrate the season of love with our annual poetry exchange. Write an original love poem and receive one in return from a fellow society member.",
      date: new Date(2027, 1, 12), // February 12, 2027
      time: "3:00 PM - 5:00 PM",
      location: "Rose Garden Pavilion",
      imageUrl: "https://source.unsplash.com/random/600x400/?valentine&sig=17",
      category: "special"
    },
    {
      id: "18",
      title: "Literary Criticism Symposium",
      description: "A day-long exploration of contemporary approaches to literary criticism. Features keynote speakers and breakout discussion sessions.",
      date: new Date(2027, 1, 24), // February 24, 2027
      time: "9:00 AM - 4:00 PM",
      location: "Humanities Building Conference Hall",
      imageUrl: "https://source.unsplash.com/random/600x400/?criticism&sig=18",
      category: "meeting"
    },
    {
      id: "19",
      title: "March Short Story Competition",
      description: "Our annual short story competition is now open for entries! This year's theme is 'Boundaries'. Maximum length: 3,000 words.",
      date: new Date(2027, 2, 10), // March 10, 2027
      time: "Submission deadline: 11:59 PM",
      location: "Online Submission",
      imageUrl: "https://source.unsplash.com/random/600x400/?story&sig=19",
      category: "competition"
    },
    {
      id: "20",
      title: "Publishing Industry Panel",
      description: "Meet representatives from publishing houses, literary agencies, and self-publishing platforms to learn about the various paths to publication.",
      date: new Date(2027, 2, 25), // March 25, 2027
      time: "5:00 PM - 7:30 PM",
      location: "Business School Auditorium",
      imageUrl: "https://source.unsplash.com/random/600x400/?publishing&sig=20",
      category: "meeting"
    },
    {
      id: "21",
      title: "National Poetry Month Celebration",
      description: "A month-long series of events celebrating poetry, including readings, workshops, and installations around campus.",
      date: new Date(2027, 3, 5), // April 5, 2027
      time: "Various times throughout April",
      location: "Multiple Campus Locations",
      imageUrl: "https://source.unsplash.com/random/600x400/?poetry-month&sig=21",
      category: "special"
    },
    {
      id: "22",
      title: "Environmental Writing Workshop",
      description: "In honor of Earth Day, join us for a workshop focused on nature writing and environmental themes in literature.",
      date: new Date(2027, 3, 22), // April 22, 2027
      time: "1:00 PM - 4:00 PM",
      location: "Botanical Gardens Classroom",
      imageUrl: "https://source.unsplash.com/random/600x400/?nature-writing&sig=22",
      category: "workshop"
    },
    {
      id: "23",
      title: "Spring Literary Festival",
      description: "Our biggest event of the spring semester! Features author readings, book signings, panel discussions, and a book fair with local publishers.",
      date: new Date(2027, 4, 8), // May 8, 2027
      time: "10:00 AM - 6:00 PM",
      location: "University Quad",
      imageUrl: "https://source.unsplash.com/random/600x400/?festival&sig=23",
      category: "special"
    },
    {
      id: "24",
      title: "Memoir Writing Intensive",
      description: "Learn how to transform your personal experiences into compelling narrative in this intensive workshop led by memoirist Priya Singh.",
      date: new Date(2027, 4, 20), // May 20, 2027
      time: "10:00 AM - 3:00 PM",
      location: "Alumni Center Conference Room",
      imageUrl: "https://source.unsplash.com/random/600x400/?memoir&sig=24",
      category: "workshop"
    },
    {
      id: "25",
      title: "Summer Reading Kickoff Party",
      description: "Launch into summer with our reading kickoff event! Get book recommendations, join summer reading challenges, and mingle with fellow book lovers.",
      date: new Date(2027, 5, 5), // June 5, 2027
      time: "4:00 PM - 7:00 PM",
      location: "University Lawn",
      imageUrl: "https://source.unsplash.com/random/600x400/?summer-reading&sig=25",
      category: "special"
    }
  ];
  
  // Find the next upcoming event
  const getNextEvent = () => {
    const now = new Date();
    const futureEvents = events.filter(event => event.date > now);
    return futureEvents.sort((a, b) => a.date.getTime() - b.date.getTime())[0];
  };
  
  const nextEvent = getNextEvent();
  
  // Update countdown timer
  useEffect(() => {
    const updateCountdown = () => {
      const now = new Date();
      if (!nextEvent) return;
      
      const difference = nextEvent.date.getTime() - now.getTime();
      
      if (difference <= 0) {
        setCountdown({ days: 0, hours: 0, minutes: 0, seconds: 0 });
        return;
      }
      
      const days = Math.floor(difference / (1000 * 60 * 60 * 24));
      const hours = Math.floor((difference % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
      const minutes = Math.floor((difference % (1000 * 60 * 60)) / (1000 * 60));
      const seconds = Math.floor((difference % (1000 * 60)) / 1000);
      
      setCountdown({ days, hours, minutes, seconds });
    };
    
    updateCountdown();
    const interval = setInterval(updateCountdown, 1000);
    
    return () => clearInterval(interval);
  }, [nextEvent]);
  
  // Get days for calendar
  const getDaysInMonth = (year: number, month: number) => {
    return new Date(year, month + 1, 0).getDate();
  };
  
  const getFirstDayOfMonth = (year: number, month: number) => {
    return new Date(year, month, 1).getDay();
  };
  
  const renderCalendar = () => {
    const year = selectedMonth.getFullYear();
    const month = selectedMonth.getMonth();
    
    const daysInMonth = getDaysInMonth(year, month);
    const firstDayOfMonth = getFirstDayOfMonth(year, month);
    
    // Get days from previous month to fill the calendar
    const daysInPrevMonth = getDaysInMonth(year, month - 1);
    const prevMonthDays = Array.from({ length: firstDayOfMonth }, (_, i) => ({
      day: daysInPrevMonth - firstDayOfMonth + i + 1,
      currentMonth: false,
      hasEvent: false,
      isToday: false
    }));
    
    // Current month days
    const today = new Date();
    const currentMonthDays = Array.from({ length: daysInMonth }, (_, i) => {
      const day = i + 1;
      const date = new Date(year, month, day);
      
      const hasEvent = events.some(event => 
        event.date.getDate() === day && 
        event.date.getMonth() === month && 
        event.date.getFullYear() === year
      );
      
      const isToday = 
        today.getDate() === day && 
        today.getMonth() === month && 
        today.getFullYear() === year;
      
      return { day, currentMonth: true, hasEvent, isToday, date };
    });
    
    // Next month days to fill the calendar
    const totalDaysDisplayed = prevMonthDays.length + currentMonthDays.length;
    const nextMonthDays = Array.from({ length: 42 - totalDaysDisplayed }, (_, i) => ({
      day: i + 1,
      currentMonth: false,
      hasEvent: false,
      isToday: false
    }));
    
    return [...prevMonthDays, ...currentMonthDays, ...nextMonthDays];
  };
  
  const handlePrevMonth = () => {
    setSelectedMonth(new Date(
      selectedMonth.getFullYear(),
      selectedMonth.getMonth() - 1,
      1
    ));
  };
  
  const handleNextMonth = () => {
    setSelectedMonth(new Date(
      selectedMonth.getFullYear(),
      selectedMonth.getMonth() + 1,
      1
    ));
  };
  
  const handleDayClick = (day: any, event: React.MouseEvent) => {
    if (day.hasEvent && day.currentMonth) {
      // Store the click position
      setClickPosition({ 
        x: event.clientX, 
        y: event.clientY 
      });
      
      const clickedDate = day.date;
      const eventsOnDay = events.filter(event => 
        event.date.getDate() === clickedDate.getDate() && 
        event.date.getMonth() === clickedDate.getMonth() && 
        event.date.getFullYear() === clickedDate.getFullYear()
      );
      
      if (eventsOnDay.length > 0) {
        setSelectedEvent(eventsOnDay[0]);
      }
    }
  };
  
  const monthNames = [
    'January', 'February', 'March', 'April',
    'May', 'June', 'July', 'August',
    'September', 'October', 'November', 'December'
  ];
  
  const weekdays = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
  
  // Filter events for the current month
  const currentMonthEvents = events.filter(event => 
    event.date.getMonth() === selectedMonth.getMonth() && 
    event.date.getFullYear() === selectedMonth.getFullYear()
  ).sort((a, b) => a.date.getTime() - b.date.getTime());
  
  return (
    <PageTransition isActive={isAnimating}>
      <RetroGrid />
      <GlowingOverlay />
      <ScanlineEffect />
      <Vignette />
      <PageContainer>
        <MainLayout>
          <ContentContainer>
            <HeaderContainer>
              <PageTitle
                initial="hidden"
                animate="visible"
                variants={titleVariants}
              >
                Events & Gatherings
              </PageTitle>
              
              <Subtitle
                initial="hidden"
                animate="visible"
                variants={subtitleVariants}
              >
                Discover upcoming literary adventures, workshops, competitions, and gatherings. 
                Join us in celebrating the written word through interactive and engaging events.
              </Subtitle>
            </HeaderContainer>
            
            {/* Countdown Section */}
            <CountdownContainer
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
            >
              <CountdownTitle>Next Event Countdown</CountdownTitle>
              {nextEvent && (
                <EventName>{nextEvent.title}</EventName>
              )}
              
              <TimerDisplay>
                <TimeUnit>
                  <TimeNumber>{countdown.days}</TimeNumber>
                  <TimeLabel>Days</TimeLabel>
                </TimeUnit>
                <TimeUnit>
                  <TimeNumber>{countdown.hours}</TimeNumber>
                  <TimeLabel>Hours</TimeLabel>
                </TimeUnit>
                <TimeUnit>
                  <TimeNumber>{countdown.minutes}</TimeNumber>
                  <TimeLabel>Minutes</TimeLabel>
                </TimeUnit>
                <TimeUnit>
                  <TimeNumber>{countdown.seconds}</TimeNumber>
                  <TimeLabel>Seconds</TimeLabel>
                </TimeUnit>
              </TimerDisplay>
              
              {nextEvent && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.5 }}
                >
                  <EventDate>
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <rect x="3" y="4" width="18" height="18" rx="2" ry="2" />
                      <line x1="16" y1="2" x2="16" y2="6" />
                      <line x1="8" y1="2" x2="8" y2="6" />
                      <line x1="3" y1="10" x2="21" y2="10" />
                    </svg>
                    {nextEvent.date.toLocaleDateString('en-US', { 
                      weekday: 'long', 
                      year: 'numeric', 
                      month: 'long', 
                      day: 'numeric' 
                    })} | {nextEvent.time}
                  </EventDate>
                  
                  <EventLocation>
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" />
                      <circle cx="12" cy="10" r="3" />
                    </svg>
                    {nextEvent.location}
                  </EventLocation>
                </motion.div>
              )}
            </CountdownContainer>
            
            {/* Calendar Section */}
            <CalendarContainer
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.2 }}
            >
              <CalendarTitle>Events Calendar</CalendarTitle>
              
              <MonthNavigation>
                <NavButton
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={handlePrevMonth}
                >
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M15 18l-6-6 6-6" />
                  </svg>
                  Prev
                </NavButton>
                
                <MonthTitle>
                  {monthNames[selectedMonth.getMonth()]} {selectedMonth.getFullYear()}
                </MonthTitle>
                
                <NavButton
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={handleNextMonth}
                >
                  Next
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M9 18l6-6-6-6" />
                  </svg>
                </NavButton>
              </MonthNavigation>
              
              <CalendarGrid>
                {weekdays.map(day => (
                  <WeekdayHeader key={day}>{day}</WeekdayHeader>
                ))}
                
                {renderCalendar().map((day, index) => (
                  <DayCell
                    key={index}
                    $isCurrentMonth={day.currentMonth}
                    $hasEvent={day.hasEvent}
                    $isToday={day.isToday}
                    whileHover={day.hasEvent ? { scale: 1.05, zIndex: 10 } : {}}
                    whileTap={day.hasEvent ? { scale: 0.95 } : {}}
                    onClick={(e) => handleDayClick(day, e)}  // Pass the event object
                  >
                    <DayNumber color={day.isToday ? '#00ffff' : day.currentMonth ? 'white' : 'rgba(255,255,255,0.4)'}>
                      {day.day}
                    </DayNumber>
                  </DayCell>
                ))}
              </CalendarGrid>
            </CalendarContainer>
            
            {/* Events List for Current Month */}
            {currentMonthEvents.length > 0 && (
              <EventsListContainer
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.4 }}
              >
                <EventsTitle>
                  Events in {monthNames[selectedMonth.getMonth()]} {selectedMonth.getFullYear()}
                </EventsTitle>
                
                <EventsList>
                  {currentMonthEvents.map((event, index) => (
                    <EventCard
                      key={event.id}
                      $category={event.category}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.5, delay: index * 0.1 }}
                      whileHover={{ y: -10 }}
                      onClick={() => setSelectedEvent(event)}
                    >
                      <EventImageContainer>
                        <EventImage src={event.imageUrl} alt={event.title} />
                        <CategoryBadge $category={event.category}>
                          {event.category}
                        </CategoryBadge>
                      </EventImageContainer>
                      
                      <EventInfo>
                        <EventCardTitle>{event.title}</EventCardTitle>
                        
                        <EventDate>
                          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                            <rect x="3" y="4" width="18" height="18" rx="2" ry="2" />
                            <line x1="16" y1="2" x2="16" y2="6" />
                            <line x1="8" y1="2" x2="8" y2="6" />
                            <line x1="3" y1="10" x2="21" y2="10" />
                          </svg>
                          {event.date.toLocaleDateString('en-US', { 
                            month: 'short', 
                            day: 'numeric' 
                          })} | {event.time}
                        </EventDate>
                        
                        <EventLocation>
                          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                            <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" />
                            <circle cx="12" cy="10" r="3" />
                          </svg>
                          {event.location}
                        </EventLocation>
                        
                        <EventDescription>
                          {event.description.length > 100 
                            ? `${event.description.substring(0, 100)}...` 
                            : event.description}
                        </EventDescription>
                      </EventInfo>
                    </EventCard>
                  ))}
                </EventsList>
              </EventsListContainer>
            )}
          </ContentContainer>
        </MainLayout>
      </PageContainer>
      
      {/* Event Detail Modal */}
      {selectedEvent && (
        <ModalOverlay
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={() => setSelectedEvent(null)}
        >
          <EventModal
            $top={clickPosition.y + 20} // Position below the click point
            $left={window.innerWidth / 2} // Center horizontally
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.9, opacity: 0 }}
            transition={{ type: 'spring' }}
            onClick={(e) => e.stopPropagation()}
          >
            <ModalHeader>
              <ModalTitle>{selectedEvent.title}</ModalTitle>
              <CategoryBadge $category={selectedEvent.category} style={{ position: 'relative', top: 'auto', right: 'auto', display: 'inline-block', marginTop: '0.5rem' }}>
                {selectedEvent.category}
              </CategoryBadge>
              <ModalClose
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                onClick={() => setSelectedEvent(null)}
              >
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3">
                  <path d="M18 6L6 18M6 6l12 12" />
                </svg>
              </ModalClose>
            </ModalHeader>
            
            <ModalBody>
              <ModalImage src={selectedEvent.imageUrl} alt={selectedEvent.title} />
              
              <ModalInfo>
                <EventDate style={{ fontSize: '1rem', marginBottom: '0.8rem' }}>
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <rect x="3" y="4" width="18" height="18" rx="2" ry="2" />
                    <line x1="16" y1="2" x2="16" y2="6" />
                    <line x1="8" y1="2" x2="8" y2="6" />
                    <line x1="3" y1="10" x2="21" y2="10" />
                  </svg>
                  {selectedEvent.date.toLocaleDateString('en-US', { 
                    weekday: 'long', 
                    year: 'numeric', 
                    month: 'long', 
                    day: 'numeric' 
                  })} | {selectedEvent.time}
                </EventDate>
                
                <EventLocation style={{ fontSize: '1rem', marginBottom: '1.5rem' }}>
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" />
                    <circle cx="12" cy="10" r="3" />
                  </svg>
                  {selectedEvent.location}
                </EventLocation>
              </ModalInfo>
              
              <ModalDescription>
                {selectedEvent.description}
              </ModalDescription>
              
              <motion.button
                style={{
                  background: 'rgba(0, 255, 255, 0.2)',
                  border: '1px solid rgba(0, 255, 255, 0.5)',
                  borderRadius: '5px',
                  padding: '0.8rem 1.5rem',
                  color: '#00ffff',
                  fontWeight: 'bold',
                  cursor: 'pointer',
                  width: '100%',
                  display: 'flex',
                  justifyContent: 'center',
                  alignItems: 'center',
                  gap: '0.5rem'
                }}
                whileHover={{ background: 'rgba(0, 255, 255, 0.3)' }}
                whileTap={{ scale: 0.95 }}
              >
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M19 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11l5 5v11a2 2 0 0 1-2 2z"></path>
                  <polyline points="17 21 17 13 7 13 7 21"></polyline>
                  <polyline points="7 3 7 8 15 8"></polyline>
                </svg>
                Add to Calendar
              </motion.button>
            </ModalBody>
          </EventModal>
        </ModalOverlay>
      )}
    </PageTransition>
  );
};

export default EventsPage;
