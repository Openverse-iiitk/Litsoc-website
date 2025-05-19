import { motion } from 'framer-motion';
import styled from 'styled-components';
import { useRef, useState, useEffect } from 'react';
import React from 'react';
import usePageTransition from '../hooks/usePageTransition';
import PageTransition from '../components/PageTransition';

// Styled components
const PageContainer = styled.div`
  width: 100%;
  min-height: 100vh;
  background: linear-gradient(135deg, #000000 0%, #301934 100%);
  color: white;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: flex-start;
  padding: 2rem;
  position: relative;
  overflow: hidden;
`;

const ContentWrapper = styled.div`
  max-width: 1400px;
  width: 100%;
  z-index: 2;
  padding: 2rem;
  display: flex;
  flex-direction: column;
  align-items: center;
`;

const PageTitle = styled(motion.h1)`
  font-size: 5rem;
  font-weight: 900;
  text-transform: uppercase;
  margin-bottom: 1rem;
  text-align: center;
  background: linear-gradient(90deg, #ffcc00 0%, #ff6b6b 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  text-shadow: 0 0 15px rgba(255, 204, 0, 0.4);
  
  @media (max-width: 768px) {
    font-size: 3rem;
  }
`;

const Subtitle = styled(motion.h2)`
  font-size: 1.5rem;
  margin-bottom: 3rem;
  text-align: center;
  color: rgba(255, 255, 255, 0.7);
  max-width: 800px;
  
  @media (max-width: 768px) {
    font-size: 1.2rem;
  }
`;

const GalleryGrid = styled(motion.div)`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
  gap: 2rem;
  width: 100%;
  margin-top: 1rem;
  
  @media (max-width: 768px) {
    grid-template-columns: repeat(auto-fill, minmax(220px, 1fr));
    gap: 1.2rem;
  }
`;

const GalleryCard = styled(motion.div)`
  position: relative;
  height: 350px;
  border-radius: 12px;
  overflow: hidden;
  box-shadow: 0 15px 25px rgba(0, 0, 0, 0.4);
  cursor: pointer;
  background: rgba(25, 25, 35, 0.8);
  
  &:hover {
    transform: translateY(-5px);
    box-shadow: 0 20px 30px rgba(0, 0, 0, 0.6);
  }
  
  transition: all 0.3s ease-in-out;
  
  @media (max-width: 768px) {
    height: 250px;
  }
`;

const GalleryImage = styled.img`
  width: 100%;
  height: 100%;
  object-fit: cover;
  transition: transform 0.5s ease;
  
  ${GalleryCard}:hover & {
    transform: scale(1.05);
  }
`;

const GalleryCardOverlay = styled.div`
  position: absolute;
  bottom: 0;
  left: 0;
  width: 100%;
  padding: 1.5rem 1rem;
  background: linear-gradient(to top, rgba(0, 0, 0, 0.9), transparent);
  opacity: 0;
  transform: translateY(20px);
  transition: all 0.3s ease;
  
  ${GalleryCard}:hover & {
    opacity: 1;
    transform: translateY(0);
  }
`;

const GalleryCardTitle = styled.h3`
  font-size: 1.2rem;
  font-weight: 700;
  margin-bottom: 0.5rem;
  color: #ffcc00;
`;

const GalleryCardDescription = styled.p`
  font-size: 0.9rem;
  color: rgba(255, 255, 255, 0.8);
`;

const FilterContainer = styled(motion.div)`
  display: flex;
  justify-content: center;
  flex-wrap: wrap;
  gap: 1rem;
  margin-bottom: 2rem;
  width: 100%;
`;

const FilterButton = styled(motion.button)<{ $isActive: boolean }>`
  padding: 0.8rem 1.5rem;
  background: ${props => props.$isActive 
    ? 'linear-gradient(90deg, #ffcc00 0%, #ff6b6b 100%)' 
    : 'rgba(255, 255, 255, 0.1)'};
  color: ${props => props.$isActive ? '#000' : '#fff'};
  border: none;
  border-radius: 25px;
  font-size: 1rem;
  font-weight: ${props => props.$isActive ? '700' : '500'};
  cursor: pointer;
  transition: all 0.3s ease;
  
  &:hover {
    background: ${props => props.$isActive 
      ? 'linear-gradient(90deg, #ffcc00 0%, #ff6b6b 100%)' 
      : 'rgba(255, 255, 255, 0.2)'};
    transform: translateY(-2px);
  }
`;

const ModalOverlay = styled(motion.div)`
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(0, 0, 0, 0.9);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 100;
  padding: 2rem;
`;

const ModalContent = styled(motion.div)`
  position: relative;
  max-width: 900px;
  width: 90%;
  max-height: 90vh;
  background: rgba(30, 30, 40, 0.9);
  border-radius: 15px;
  overflow: hidden;
  box-shadow: 0 25px 50px rgba(0, 0, 0, 0.5);
`;

const ModalImage = styled.img`
  width: 100%;
  max-height: 70vh;
  object-fit: contain;
`;

const ModalInfo = styled.div`
  padding: 1.5rem;
`;

const ModalTitle = styled.h2`
  font-size: 2rem;
  margin-bottom: 0.5rem;
  background: linear-gradient(90deg, #ffcc00 0%, #ff6b6b 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
`;

const ModalDescription = styled.p`
  font-size: 1.1rem;
  color: rgba(255, 255, 255, 0.9);
  margin-bottom: 1rem;
`;

const ModalDetails = styled.div`
  display: flex;
  gap: 2rem;
  margin-top: 1rem;
  
  @media (max-width: 768px) {
    flex-direction: column;
    gap: 1rem;
  }
`;

const ModalDetail = styled.div`
  display: flex;
  flex-direction: column;
`;

const ModalDetailLabel = styled.span`
  font-size: 0.9rem;
  color: rgba(255, 255, 255, 0.6);
`;

const ModalDetailValue = styled.span`
  font-size: 1.1rem;
  color: rgba(255, 255, 255, 0.9);
`;

const CloseButton = styled(motion.button)`
  position: absolute;
  top: 1rem;
  right: 1rem;
  width: 2.5rem;
  height: 2.5rem;
  border-radius: 50%;
  background: rgba(0, 0, 0, 0.5);
  border: none;
  color: white;
  font-size: 1.5rem;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  z-index: 10;
  
  &:hover {
    background: rgba(255, 0, 0, 0.7);
  }
`;

const PaginationContainer = styled.div`
  display: flex;
  justify-content: center;
  margin-top: 3rem;
  margin-bottom: 2rem;
  gap: 0.5rem;
`;

const PageButton = styled.button<{ $isActive: boolean }>`
  width: 2.5rem;
  height: 2.5rem;
  border-radius: 50%;
  background: ${props => props.$isActive 
    ? 'linear-gradient(90deg, #ffcc00 0%, #ff6b6b 100%)' 
    : 'rgba(255, 255, 255, 0.1)'};
  color: ${props => props.$isActive ? '#000' : '#fff'};
  border: none;
  font-weight: ${props => props.$isActive ? '700' : '400'};
  cursor: pointer;
  transition: all 0.3s ease;
  
  &:hover {
    background: ${props => !props.$isActive && 'rgba(255, 255, 255, 0.2)'};
    transform: translateY(-2px);
  }
`;

const StarfieldBackground = styled.div`
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-image: 
    radial-gradient(2px 2px at 20px 30px, rgba(255, 255, 255, 0.9), rgba(0, 0, 0, 0)),
    radial-gradient(2px 2px at 40px 70px, rgba(255, 255, 255, 0.9), rgba(0, 0, 0, 0)),
    radial-gradient(2px 2px at 50px 160px, rgba(255, 255, 255, 0.9), rgba(0, 0, 0, 0)),
    radial-gradient(2px 2px at 90px 40px, rgba(255, 255, 255, 0.9), rgba(0, 0, 0, 0)),
    radial-gradient(2px 2px at 130px 80px, rgba(255, 255, 255, 0.9), rgba(0, 0, 0, 0)),
    radial-gradient(2px 2px at 160px 120px, rgba(255, 255, 255, 0.9), rgba(0, 0, 0, 0));
  background-repeat: repeat;
  background-size: 200px 200px;
  opacity: 0.3;
  animation: twinkle 5s infinite alternate;
  pointer-events: none;
  z-index: 0;
  
  @keyframes twinkle {
    0% {
      opacity: 0.3;
    }
    100% {
      opacity: 0.6;
    }
  }
`;

const AuroraEffect = styled.div`
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: linear-gradient(135deg, 
    rgba(255, 204, 0, 0) 0%, 
    rgba(255, 204, 0, 0.05) 25%, 
    rgba(255, 107, 107, 0.05) 75%, 
    rgba(255, 107, 107, 0) 100%);
  filter: blur(80px);
  opacity: 0.5;
  animation: aurora 15s infinite ease-in-out;
  pointer-events: none;
  z-index: 0;
  
  @keyframes aurora {
    0% {
      transform: translate(0, 0) rotate(0deg);
    }
    50% {
      transform: translate(5%, 5%) rotate(5deg);
    }
    100% {
      transform: translate(0, 0) rotate(0deg);
    }
  }
`;

const OrbEffect = styled.div`
  position: absolute;
  width: 150px;
  height: 150px;
  border-radius: 50%;
  background: linear-gradient(135deg, 
    rgba(255, 204, 0, 0.2) 0%, 
    rgba(255, 107, 107, 0.2) 100%);
  filter: blur(30px);
  opacity: 0.4;
  pointer-events: none;
  z-index: 0;
  animation: orb-float 20s infinite ease-in-out;
  
  @keyframes orb-float {
    0% {
      transform: translate(0, 0);
    }
    33% {
      transform: translate(10vw, 15vh);
    }
    66% {
      transform: translate(-15vw, 5vh);
    }
    100% {
      transform: translate(0, 0);
    }
  }
`;

const OrbEffect2 = styled(OrbEffect)`
  top: 70%;
  right: 10%;
  width: 200px;
  height: 200px;
  background: linear-gradient(135deg, 
    rgba(80, 200, 255, 0.2) 0%, 
    rgba(180, 100, 255, 0.2) 100%);
  animation-delay: -5s;
  animation-duration: 25s;
`;

const OrbEffect3 = styled(OrbEffect)`
  top: 30%;
  left: 15%;
  width: 180px;
  height: 180px;
  background: linear-gradient(135deg, 
    rgba(150, 255, 120, 0.15) 0%, 
    rgba(255, 150, 100, 0.15) 100%);
  animation-delay: -10s;
  animation-duration: 18s;
`;

const LoaderContainer = styled(motion.div)`
  display: flex;
  justify-content: center;
  align-items: center;
  height: 200px;
  width: 100%;
`;

const Loader = styled(motion.div)`
  width: 50px;
  height: 50px;
  border: 5px solid rgba(255, 255, 255, 0.1);
  border-top: 5px solid #ffcc00;
  border-radius: 50%;
`;

// Animation variants
const titleVariants = {
  enter: {
    y: 0,
    opacity: 1,
    transition: {
      duration: 0.8,
      ease: "easeOut"
    }
  },
  exit: {
    y: -50,
    opacity: 0,
    transition: {
      duration: 0.3,
      ease: "easeIn"
    }
  }
};

const subtitleVariants = {
  enter: {
    y: 0,
    opacity: 1,
    transition: {
      duration: 0.8,
      delay: 0.2,
      ease: "easeOut"
    }
  },
  exit: {
    y: 50,
    opacity: 0,
    transition: {
      duration: 0.3,
      ease: "easeIn"
    }
  }
};

const cardVariants = {
  hidden: { opacity: 0, y: 50 },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: {
      delay: i * 0.05,
      duration: 0.5,
      ease: "easeOut"
    }
  })
};

const filterContainerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
      delayChildren: 0.3
    }
  }
};

const filterButtonVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.4,
      ease: "easeOut"
    }
  }
};

const modalVariants = {
  hidden: { opacity: 0, scale: 0.8 },
  visible: { 
    opacity: 1, 
    scale: 1,
    transition: {
      duration: 0.4,
      ease: "easeOut"
    }
  },
  exit: { 
    opacity: 0, 
    scale: 0.8,
    transition: {
      duration: 0.3,
      ease: "easeIn"
    }
  }
};

// Function to generate gallery data
const generateGalleryData = () => {
  const categories = ['Event', 'Workshop', 'Reading', 'Competition', 'Exhibition'];
  const years = [2020, 2021, 2022, 2023, 2024, 2025];
  const locations = [
    'Main Auditorium', 'Library Hall', 'Open Air Theatre', 
    'Digital Media Center', 'Creative Commons', 'Virtual Space'
  ];
  
  // Image placeholder URLs
  const imageUrls = [
    'https://source.unsplash.com/random/600x800?literature',
    'https://source.unsplash.com/random/600x800?book',
    'https://source.unsplash.com/random/600x800?poetry',
    'https://source.unsplash.com/random/600x800?writing',
    'https://source.unsplash.com/random/600x800?author',
    'https://source.unsplash.com/random/600x800?reading',
    'https://source.unsplash.com/random/600x800?library',
    'https://source.unsplash.com/random/600x800?storytelling',
    'https://source.unsplash.com/random/600x800?workshop',
    'https://source.unsplash.com/random/600x800?bookshelf',
    'https://source.unsplash.com/random/600x800?novel',
    'https://source.unsplash.com/random/600x800?typewriter',
    'https://source.unsplash.com/random/600x800?pen',
    'https://source.unsplash.com/random/600x800?notebook',
    'https://source.unsplash.com/random/600x800?ink'
  ];
  
  const eventNames = [
    'Poetry Slam', 'Author Talk', 'Book Launch', 'Creative Writing Workshop',
    'Literary Quiz', 'Storytelling Night', 'Novel Writing Marathon', 'Literary Debate',
    'Character Development Masterclass', 'Literary Festival', 'Open Mic Night',
    'Book Club Meeting', 'Literary Journal Launch', 'Screenplay Writing Workshop',
    'Flash Fiction Contest', 'Literary Translation Talk', 'Memoir Writing Session',
    'Literary Film Screening', 'Writing Retreat', 'Literary Game Night',
    'Shakespeare Birthday Celebration', 'Fantasy World Building Workshop',
    'Literary History Lecture', 'Zine Making Workshop', 'Poetry in Translation',
    'Book Binding Workshop', 'Literary Walking Tour', 'Writing for Social Media',
    'Science Fiction Convention', 'Literary Award Ceremony'
  ];
  
  const eventDescriptions = [
    'A captivating showcase of poetic talent and creative expression.',
    'An intimate discussion with renowned authors about their craft and inspiration.',
    'Celebrating the release of groundbreaking new literary works.',
    'Hands-on sessions to develop and refine creative writing skills.',
    'Testing literary knowledge in a fun, competitive environment.',
    'Magical evenings of oral storytelling from diverse traditions.',
    'An immersive experience in novel creation and development.',
    'Engaging discussions on controversial literary topics and trends.',
    'Expert guidance on creating deep, memorable literary characters.',
    'A vibrant celebration of literature in all its forms.',
    'Community-driven performances of original works.',
    'In-depth discussions of contemporary and classic literature.',
    'Unveiling the latest collection of student-written works.',
    'Learning the art of writing compelling screenplays.',
    'Quick, impactful storytelling in confined word counts.',
    'Exploring the nuances of bringing literature across language barriers.',
    'Guidance on crafting personal narratives and life stories.',
    'Visual adaptations of literary classics and contemporary works.',
    'Focused time away for dedicated writing and creative development.',
    'Interactive literary-themed games and playful learning.',
    'Honoring the legacy of the Bard through performance and analysis.',
    'Creating cohesive, imaginative worlds for fiction.',
    'Explorations of literary movements and historical contexts.',
    'Creating small, self-published magazines of original content.',
    'Examining how poetry transforms across languages.',
    'Learning traditional book creation and binding techniques.',
    'Exploring literary landmarks and places of inspiration.',
    'Adapting literary skills for digital platforms.',
    'Celebrating speculative fiction in all its forms.',
    'Recognizing excellence in student literary achievements.'
  ];
  
  // Generate 120 unique items (enough for 30 pages with 4 items per page)
  return Array.from({ length: 120 }, (_, index) => {
    const randomCategoryIndex = Math.floor(Math.random() * categories.length);
    const randomYearIndex = Math.floor(Math.random() * years.length);
    const randomLocationIndex = Math.floor(Math.random() * locations.length);
    const randomImageIndex = Math.floor(Math.random() * imageUrls.length);
    const randomEventIndex = Math.floor(Math.random() * eventNames.length);
    const randomDescriptionIndex = Math.floor(Math.random() * eventDescriptions.length);
    
    return {
      id: index + 1,
      title: eventNames[randomEventIndex],
      description: eventDescriptions[randomDescriptionIndex],
      category: categories[randomCategoryIndex],
      year: years[randomYearIndex],
      location: locations[randomLocationIndex],
      imageUrl: `${imageUrls[randomImageIndex]}&sig=${index}`,  // Adding sig parameter to get unique images
      date: `${Math.floor(Math.random() * 28) + 1}/${Math.floor(Math.random() * 12) + 1}/${years[randomYearIndex]}`
    };
  });
};

// Main component
const GalleryPage: React.FC = () => {
  const { isAnimating } = usePageTransition();
  const [galleryData, setGalleryData] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedImage, setSelectedImage] = useState<any | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [activeFilter, setActiveFilter] = useState<string | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  
  const itemsPerPage = 12;
  const categories = ['Event', 'Workshop', 'Reading', 'Competition', 'Exhibition'];
  
  // Generate gallery data on component mount
  useEffect(() => {
    // Simulate loading data
    setTimeout(() => {
      const data = generateGalleryData();
      setGalleryData(data);
      setLoading(false);
    }, 1500);
  }, []);
  
  // Filter and paginate gallery items
  const filteredItems = activeFilter 
    ? galleryData.filter(item => item.category === activeFilter)
    : galleryData;
    
  const totalPages = Math.ceil(filteredItems.length / itemsPerPage);
  const displayedItems = filteredItems.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );
  
  // Handle page change
  const handlePageChange = (page: number) => {
    setCurrentPage(page);
    // Scroll to top of container
    if (containerRef.current) {
      containerRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  };
  
  // Handle filter change
  const handleFilterChange = (category: string) => {
    if (activeFilter === category) {
      setActiveFilter(null);
    } else {
      setActiveFilter(category);
    }
    setCurrentPage(1);
  };
  
  // Open modal with selected image
  const openModal = (item: any) => {
    setSelectedImage(item);
    document.body.style.overflow = 'hidden';
  };
  
  // Close modal
  const closeModal = () => {
    setSelectedImage(null);
    document.body.style.overflow = 'auto';
  };
  
  return (
    <PageTransition isActive={isAnimating}>
      <PageContainer>
        <StarfieldBackground />
        <AuroraEffect />
        <OrbEffect style={{ top: '20%', right: '20%' }} />
        <OrbEffect2 />
        <OrbEffect3 />
        
        <ContentWrapper ref={containerRef}>
          <PageTitle variants={titleVariants}>
            Literary Gallery
          </PageTitle>
          
          <Subtitle variants={subtitleVariants}>
            Explore our visual journey through literary moments, events, and creative 
            collaborations. Immerse yourself in captured memories and artistic expressions 
            from our vibrant community.
          </Subtitle>
          
          {/* Filter Buttons */}
          <FilterContainer 
            variants={filterContainerVariants}
            initial="hidden"
            animate="visible"
          >
            {categories.map((category) => (
              <FilterButton
                key={category}
                variants={filterButtonVariants}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                $isActive={activeFilter === category}
                onClick={() => handleFilterChange(category)}
              >
                {category}
              </FilterButton>
            ))}
          </FilterContainer>
          
          {/* Gallery Grid */}
          {loading ? (
            <LoaderContainer>
              <Loader
                animate={{ rotate: 360 }}
                transition={{ 
                  repeat: Infinity, 
                  duration: 1,
                  ease: "linear"
                }} 
              />
            </LoaderContainer>
          ) : (
            <GalleryGrid>
              {displayedItems.map((item, index) => (
                <GalleryCard 
                  key={item.id}
                  custom={index}
                  variants={cardVariants}
                  initial="hidden"
                  animate="visible"
                  whileHover={{ scale: 1.03 }}
                  onClick={() => openModal(item)}
                >
                  <GalleryImage 
                    src={item.imageUrl}
                    alt={item.title}
                    loading="lazy"
                  />
                  <GalleryCardOverlay>
                    <GalleryCardTitle>{item.title}</GalleryCardTitle>
                    <GalleryCardDescription>
                      {item.description.substring(0, 60)}...
                    </GalleryCardDescription>
                  </GalleryCardOverlay>
                </GalleryCard>
              ))}
            </GalleryGrid>
          )}
          
          {/* Pagination */}
          {!loading && totalPages > 1 && (
            <PaginationContainer>
              {/* Previous button */}
              <PageButton 
                onClick={() => currentPage > 1 && handlePageChange(currentPage - 1)}
                disabled={currentPage === 1}
                $isActive={false}
              >
                &lt;
              </PageButton>
              
              {/* Page numbers */}
              {Array.from({ length: totalPages }, (_, i) => i + 1)
                .filter(page => {
                  // Show current page, first, last, and nearby pages
                  return (
                    page === 1 || 
                    page === totalPages || 
                    (page >= currentPage - 1 && page <= currentPage + 1) ||
                    (currentPage === 1 && page <= 4) ||
                    (currentPage === totalPages && page >= totalPages - 3)
                  );
                })
                .map((page, index, array) => {
                  // Add ellipsis
                  if (index > 0 && array[index - 1] !== page - 1) {
                    return (
                      <React.Fragment key={`ellipsis-${page}`}>
                        <span style={{ color: 'white', margin: '0 0.5rem' }}>...</span>
                        <PageButton 
                          onClick={() => handlePageChange(page)}
                          $isActive={currentPage === page}
                        >
                          {page}
                        </PageButton>
                      </React.Fragment>
                    );
                  }
                  return (
                    <PageButton 
                      key={page}
                      onClick={() => handlePageChange(page)}
                      $isActive={currentPage === page}
                    >
                      {page}
                    </PageButton>
                  );
                })}
              
              {/* Next button */}
              <PageButton 
                onClick={() => currentPage < totalPages && handlePageChange(currentPage + 1)}
                disabled={currentPage === totalPages}
                $isActive={false}
              >
                &gt;
              </PageButton>
            </PaginationContainer>
          )}
        </ContentWrapper>
        
        {/* Modal */}
        {selectedImage && (
          <ModalOverlay
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={closeModal}
          >
            <ModalContent 
              variants={modalVariants}
              initial="hidden"
              animate="visible"
              exit="exit"
              onClick={(e) => e.stopPropagation()}
            >
              <CloseButton 
                onClick={closeModal}
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
              >
                ×
              </CloseButton>
              
              <ModalImage 
                src={selectedImage.imageUrl}
                alt={selectedImage.title}
              />
              
              <ModalInfo>
                <ModalTitle>{selectedImage.title}</ModalTitle>
                <ModalDescription>{selectedImage.description}</ModalDescription>
                
                <ModalDetails>
                  <ModalDetail>
                    <ModalDetailLabel>Category</ModalDetailLabel>
                    <ModalDetailValue>{selectedImage.category}</ModalDetailValue>
                  </ModalDetail>
                  
                  <ModalDetail>
                    <ModalDetailLabel>Date</ModalDetailLabel>
                    <ModalDetailValue>{selectedImage.date}</ModalDetailValue>
                  </ModalDetail>
                  
                  <ModalDetail>
                    <ModalDetailLabel>Location</ModalDetailLabel>
                    <ModalDetailValue>{selectedImage.location}</ModalDetailValue>
                  </ModalDetail>
                </ModalDetails>
              </ModalInfo>
            </ModalContent>
          </ModalOverlay>
        )}
      </PageContainer>
    </PageTransition>
  );
};

export default GalleryPage;
