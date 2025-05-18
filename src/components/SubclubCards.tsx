import React from 'react';
import styled from 'styled-components';
import { motion } from 'framer-motion';
import FlippableCard from './FlippableCard';

interface SubclubCardsProps {
  showCards: boolean;
}

// Container for the cards grid
const CardsContainer = styled(motion.div)`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
  gap: 2rem;
  width: 100%;
  max-width: 1200px;
  margin: 0 auto;
  padding: 1rem;
  
  @media (max-width: 768px) {
    grid-template-columns: repeat(auto-fill, minmax(220px, 1fr));
    gap: 1rem;
    padding: 0.5rem;
  }
`;

// Data for each subclub
const subclubsData = [
  {
    id: 1,
    title: "Ecury",
    description: "Our poetry subclub dedicated to the exploration of verse, rhythm, and rhyme in all its forms.",
    color: "#7928CA",
    secondaryColor: "#FF0080"
  },
  {
    id: 2,
    title: "Writing",
    description: "Dedicated to the craft of creative writing, from short stories to novels and everything in between.",
    color: "#1E40AF",
    secondaryColor: "#38BDF8"
  },
  {
    id: 3,
    title: "Debate and quizzing",
    description: "Sharpen your mind through intellectual discourse, argumentation, and competitive knowledge challenges.",
    color: "#047857",
    secondaryColor: "#34D399"
  },
  {
    id: 4,
    title: "Manga",
    description: "Explore the world of Japanese graphic novels and their unique storytelling techniques.",
    color: "#B91C1C",
    secondaryColor: "#FB923C"
  },
  {
    id: 5,
    title: "Gooners",
    description: "A subclub dedicated to those who love to discuss and analyze the beautiful game of football.",
    color: "#7B341E",
    secondaryColor: "#F97316"
  },
  {
    id: 6,
    title: "Manchan has no idea",
    description: "Our most mysterious subclub where all manner of unexplored literary adventures await.",
    color: "#581C87",
    secondaryColor: "#C026D3"
  }
];

// Animation variants for staggered appearance
const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1
    }
  }
};

const cardVariants = {
  hidden: { y: 50, opacity: 0 },
  visible: {
    y: 0,
    opacity: 1,
    transition: {
      type: "spring",
      stiffness: 100,
      damping: 20
    }
  }
};

const SubclubCards: React.FC<SubclubCardsProps> = ({ showCards }) => {
  return (
    <CardsContainer
      variants={containerVariants}
      initial="hidden"
      animate={showCards ? "visible" : "hidden"}
    >
      {subclubsData.map((subclub) => (
        <motion.div 
          key={subclub.id} 
          variants={cardVariants}
        >
          <FlippableCard
            id={String(subclub.id)}
            title={subclub.title}
            description={subclub.description}
            color={subclub.color}
            secondaryColor={subclub.secondaryColor}
          />
        </motion.div>
      ))}
    </CardsContainer>
  );
};

export default SubclubCards;
