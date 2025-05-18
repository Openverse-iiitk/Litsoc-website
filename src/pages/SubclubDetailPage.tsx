import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import styled from 'styled-components';
import { motion } from 'framer-motion';
import usePageTransition from '../hooks/usePageTransition';
import PageTransition from '../components/PageTransition';

// Data for each subclub - matching what's in SubclubCards.tsx
const subclubsData = [
  {
    id: 1,
    title: "Ecury",
    description: "Our Book and movie subclub dedicated to the exploration of verse, rhythm, and rhyme in all its forms.",
    color: "#7928CA",
    secondaryColor: "#FF0080",
    longDescription: `The Ecury Book and Movie Subclub is our sanctuary for poetry lovers and creators. Here, members explore various poetic forms, from sonnets to free verse, and engage in enlightening discussions on techniques, themes, and notable poets.

Regular activities include poetry reading circles, themed writing challenges, and constructive critique sessions. Members hone their skills by engaging with classical and contemporary poetry alike, and exploring the relationship between poetic expression and the broader literary world.

Whether you're a seasoned poet or a curious newcomer, Ecury offers a supportive community where words dance and emotions find their rhythm.`
  },
  {
    id: 2,
    title: "Writing",
    description: "Dedicated to the craft of creative writing, from short stories to novels and everything in between.",
    color: "#1E40AF",
    secondaryColor: "#38BDF8",
    longDescription: `The Writing Subclub forms the heart of our literary community, focused on mastering the craft of creative prose in all its forms. Our members explore various genres and formats, from flash fiction to sprawling novel drafts.

Our sessions involve writing workshops, plot development exercises, character-building techniques, and discussions on narrative structure. We regularly engage in writing sprints, peer reviews, and collaborative storytelling projects.

This subclub serves as an incubator for emerging writers, providing them with the tools, feedback, and encouragement needed to refine their voice and develop their unique creative vision.`
  },
  {
    id: 3,
    title: "Debate and quizzing",
    description: "Sharpen your mind through intellectual discourse, argumentation, and competitive knowledge challenges.",
    color: "#047857",
    secondaryColor: "#34D399",
    longDescription: `The Debate and Quizzing Subclub combines the art of persuasive argumentation with the thrill of knowledge competitions. This intellectually stimulating group focuses on developing critical thinking, research skills, and effective communication.

We organize regular formal debates on literary topics, philosophical questions, and contemporary issues. Our quizzing activities range from casual literary trivia to structured competitive formats, challenging members to expand their knowledge across varied domains.

Through mock debates, impromptu speaking exercises, and research-based discussions, members develop confidence in presenting arguments and responding thoughtfully to opposing viewpoints.`
  },
  {
    id: 4,
    title: "Manga",
    description: "Explore the world of Japanese graphic novels and their unique storytelling techniques.",
    color: "#B91C1C",
    secondaryColor: "#FB923C",
    longDescription: `The Manga Subclub celebrates the rich visual storytelling tradition of Japanese comics and graphic novels. We explore the artistic techniques, narrative structures, and cultural contexts that make manga a unique and influential medium worldwide.

Our activities include manga reading circles, discussions of different genres and art styles, and explorations of the relationships between manga and other literary forms. We occasionally host drawing workshops where members can try their hand at manga-inspired illustration techniques.

The subclub also examines the global influence of manga on contemporary visual storytelling, animation, and pop culture, making connections between Eastern and Western artistic traditions.`
  },
  {
    id: 5,
    title: "Gooners",
    description: "A subclub dedicated to those who love to discuss and analyze the beautiful game of football.",
    color: "#7B341E",
    secondaryColor: "#F97316",
    longDescription: `The Gooners Subclub unites literature enthusiasts who share a passion for football, particularly Arsenal FC. This unique intersection creates a space where members analyze sportswriting, football narratives, and the cultural impact of the beautiful game.

We engage in discussions about outstanding sports journalism, football memoirs, and fictional works centered around football. The subclub regularly hosts viewing parties for significant matches, followed by analytical discussions that draw parallels between game strategies and narrative structures.

Members also try their hand at sports writing, from match reports to creative pieces that capture the drama, emotion, and community spirit of football, exploring how the language of sports enriches literary expression.`
  },
  {
    id: 6,
    title: "Manchan has no idea",
    description: "Our most mysterious subclub where all manner of unexplored literary adventures await.",
    color: "#581C87",
    secondaryColor: "#C026D3",
    longDescription: `The "Manchan has no idea" Subclub embraces the unexpected and experimental aspects of literature and creative expression. As our most enigmatic group, we deliberately leave our focus open-ended, allowing for spontaneous exploration of unconventional literary forms and interdisciplinary approaches.

Sessions might involve surrealist writing games, exploration of obscure literary movements, experiments with digital literature, or collaborations with other art forms. The subclub serves as a laboratory for ideas that don't fit neatly into traditional categories.

What unites our members is curiosity, a willingness to venture into uncharted creative territory, and the shared understanding that sometimes the most interesting literary experiences come from embracing the unknown.`
  }
];

// Styled Components
const PageContainer = styled.div`
  width: 100%;
  min-height: 100vh;
  background: linear-gradient(135deg, #2c3e50 0%, #000000 100%);
  background-attachment: fixed;
  color: white;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: flex-start;
  padding: 2rem;
  position: relative;
  overflow-x: hidden;
`;

const ContentWrapper = styled.div`
  max-width: 1000px;
  width: 100%;
  padding: 3rem 2rem;
  z-index: 2;
  display: flex;
  flex-direction: column;
  align-items: center;
  position: relative;
  
  @media (max-width: 768px) {
    padding: 2rem 1rem;
  }
`;

const CircuitLines = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-image: url("data:image/svg+xml,%3Csvg width='100' height='100' viewBox='0 0 100 100' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M0 0h100v100H0z' fill='none'/%3E%3Cpath d='M0 0h50v50H0z' fill='none' stroke='rgba(0, 184, 212, 0.1)' stroke-width='0.5'/%3E%3Cpath d='M50 0h50v50H50z' fill='none' stroke='rgba(0, 184, 212, 0.1)' stroke-width='0.5'/%3E%3Cpath d='M0 50h50v50H0z' fill='none' stroke='rgba(118, 255, 3, 0.1)' stroke-width='0.5'/%3E%3Cpath d='M50 50h50v50H50z' fill='none' stroke='rgba(118, 255, 3, 0.1)' stroke-width='0.5'/%3E%3C/svg%3E");
  background-size: 100px 100px;
  opacity: 0.5;
  pointer-events: none;
  z-index: 0;
`;

const Header = styled(motion.div)<{ bgColor: string }>`
  width: 100%;
  padding: 3rem 2rem;
  border-radius: 12px;
  background: ${props => props.bgColor};
  margin-bottom: 2rem;
  text-align: center;
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.5);
`;

const Title = styled(motion.h1)`
  font-size: 4rem;
  font-weight: 900;
  margin-bottom: 1rem;
  background: linear-gradient(90deg, #ffffff 0%, rgba(255, 255, 255, 0.8) 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  text-shadow: 0 0 15px rgba(255, 255, 255, 0.4);
  
  @media (max-width: 768px) {
    font-size: 2.5rem;
  }
`;

const Description = styled(motion.p)`
  font-size: 1.2rem;
  line-height: 1.6;
  color: rgba(255, 255, 255, 0.9);
  margin-bottom: 2rem;
  
  @media (max-width: 768px) {
    font-size: 1rem;
  }
`;

const ContentSection = styled(motion.div)`
  width: 100%;
  background: rgba(0, 0, 0, 0.3);
  backdrop-filter: blur(10px);
  border-radius: 12px;
  padding: 2rem;
  margin-bottom: 2rem;
  border: 1px solid rgba(255, 255, 255, 0.1);
`;

const SectionTitle = styled.h2`
  font-size: 1.8rem;
  margin-bottom: 1rem;
  color: rgba(255, 255, 255, 0.9);
`;

const Paragraph = styled.p`
  font-size: 1.1rem;
  line-height: 1.8;
  color: rgba(255, 255, 255, 0.8);
  margin-bottom: 1.5rem;
`;

const BackButton = styled(motion.button)`
  position: fixed;
  top: 2rem;
  left: 2rem;
  background: rgba(0, 0, 0, 0.5);
  border: 1px solid rgba(255, 255, 255, 0.2);
  color: white;
  padding: 0.5rem 1rem;
  border-radius: 4px;
  font-size: 0.9rem;
  cursor: pointer;
  z-index: 100;
  backdrop-filter: blur(8px);
  display: flex;
  align-items: center;
  gap: 0.5rem;
  
  &:hover {
    background: rgba(0, 0, 0, 0.7);
  }
`;

// Animation variants
const containerVariants = {
  hidden: { opacity: 0 },
  visible: { 
    opacity: 1,
    transition: { 
      duration: 0.8,
      staggerChildren: 0.3
    }
  },
  exit: { 
    opacity: 0,
    transition: { duration: 0.5 }
  }
};

const itemVariants = {
  hidden: { y: 50, opacity: 0 },
  visible: { 
    y: 0, 
    opacity: 1,
    transition: { 
      type: "spring", 
      stiffness: 100, 
      damping: 15 
    }
  }
};

const SubclubDetailPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { isAnimating } = usePageTransition();
  
  // Find the subclub data based on the ID
  const subclub = subclubsData.find(club => club.id === Number(id));
  
  // If subclub not found, redirect to the subclubs page
  if (!subclub) {
    return <div>Subclub not found</div>; // Or handle more gracefully
  }
  
  const gradientBg = `linear-gradient(135deg, ${subclub.color} 0%, ${subclub.secondaryColor} 100%)`;
  
  return (
    <PageTransition isActive={isAnimating}>
      <PageContainer>
        <CircuitLines />
        
        <BackButton 
          onClick={() => navigate('/subclubs')}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          ← Back to Subclubs
        </BackButton>
        
        <ContentWrapper
          as={motion.div}
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          exit="exit"
        >
          <Header 
            bgColor={gradientBg}
            variants={itemVariants}
          >
            <Title>{subclub.title}</Title>
            <Description>{subclub.description}</Description>
          </Header>
          
          <ContentSection variants={itemVariants}>
            <SectionTitle>About This Subclub</SectionTitle>
            <Paragraph>{subclub.longDescription}</Paragraph>
          </ContentSection>
          
          <ContentSection variants={itemVariants}>
            <SectionTitle>Upcoming Events</SectionTitle>
            <Paragraph>
              Stay tuned for our upcoming events and activities. We regularly organize 
              workshops, discussions, and collaborative projects to engage our members.
            </Paragraph>
          </ContentSection>
          
          <ContentSection variants={itemVariants}>
            <SectionTitle>How to Join</SectionTitle>
            <Paragraph>
              If you're interested in joining the {subclub.title} subclub, please reach out to 
              us through our main Literary Society contact channels. We welcome members of all 
              experience levels who share our passion for {subclub.title.toLowerCase()}.
            </Paragraph>
          </ContentSection>
        </ContentWrapper>
      </PageContainer>
    </PageTransition>
  );
};

export default SubclubDetailPage;
