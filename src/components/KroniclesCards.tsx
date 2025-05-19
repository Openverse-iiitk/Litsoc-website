import React from 'react';
import styled from 'styled-components';
import { motion } from 'framer-motion';
import FlippableKroniclesCard from './FlippableKroniclesCard';

interface KroniclesCardsProps {
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

// Data for each Kronicle edition
const kroniclesData = [
  {
    id: "edition1",
    title: "Edition 1",
    description: "The inaugural edition of our literary magazine, featuring poetry, prose, and artwork from our members.",
    color: "linear-gradient(135deg, #ff00cc 0%, #3333ff 100%)",
    coverImage: "/edition1.png",
    pdfPath: "/pdfs/edition1.pdf"
  },
  {
    id: "edition2",
    title: "Edition 2",
    description: "Our second literary collection showcases growth and diversity in the club's creative expressions.",
    color: "linear-gradient(135deg, #00ffcc 0%, #3333ff 100%)",
    coverImage: "/edition2.png",
    pdfPath: "/pdfs/edition2.pdf"
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

const KroniclesCards: React.FC<KroniclesCardsProps> = ({ showCards }) => {
  return (
    <CardsContainer
      variants={containerVariants}
      initial="hidden"
      animate={showCards ? "visible" : "hidden"}
    >
      {kroniclesData.map((kronicle, index) => (
        <motion.div 
          key={kronicle.id} 
          variants={cardVariants}
        >
          <FlippableKroniclesCard
            id={kronicle.id}
            title={kronicle.title}
            description={kronicle.description}
            color={kronicle.color}
            coverImage={kronicle.coverImage}
            delay={index * 0.1}
          />
        </motion.div>
      ))}
    </CardsContainer>
  );
};

export default KroniclesCards;
