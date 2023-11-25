/**
 * Component for the third page of about page.
 * @author Daekyun Kim <daekyun97@gmail.com>
 */
// React
import React, { useMemo } from 'react';
// Material UI
import { Box, Typography, IconButton } from '@mui/material';
// Material UI Icons
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
// Import statements
import MemberCard from './MemberCard';
import Daekyun from '../../../../assets/Profile/Daekyun.png';
import DaekyunWebp from '../../../../assets/Profile/Daekyun.png?as=webp';
import Heewon from '../../../../assets/Profile/Heewon.png';
import HeewonWebp from '../../../../assets/Profile/Heewon.png?as=webp';
import Janice from '../../../../assets/Profile/Janice.png';
import JaniceWebp from '../../../../assets/Profile/Janice.png?as=webp';
import Jerry from '../../../../assets/Profile/Jerry.png';
import JerryWebp from '../../../../assets/Profile/Jerry.png?as=webp';
import Jihae from '../../../../assets/Profile/Jihae.png';
import JihaeWebp from '../../../../assets/Profile/Jihae.png?as=webp';
import Steve from '../../../../assets/Profile/Steve.png';
import SteveWebp from '../../../../assets/Profile/Steve.png?as=webp';
import Jeonghyun from '../../../../assets/Profile/Jeonghyun.png';
import JeonghyunWebp from '../../../../assets/Profile/Jeonghyun.png?as=webp';
import Rachel from '../../../../assets/Profile/Rachel.png';
import RachelWebp from '../../../../assets/Profile/Rachel.png?as=webp';

interface TeamMembersProps {
  onBack: () => void;
}

/**
 * React Functional Component for for the pop up of third page of the About page.
 * Displays a list of founding team members with their names, titles, pictures, and LinkedIn links.
 * @param {TeamMembersProps} props - Properties passed from the parent component, including a function to handle the 'back' action.
 * @return {React.ReactElement} - Renders the pop up of third page of the About page with team members' profiles.
 */
const TeamMembers: React.FC<TeamMembersProps> = ({ onBack }) => {
  const teamMembers = useMemo(
    () => [
      {
        name: 'Daekyun Kim',
        title: 'Product Manager & Software Engineer',
        linkedin: 'https://www.linkedin.com/in/dkim97',
        image: Daekyun,
        imageWebp: DaekyunWebp,
      },
      {
        name: 'Hyechoel Jang',
        title: 'Tech Lead',
        linkedin: 'https://www.linkedin.com/in/jhyecheol/',
        image: Jerry,
        imageWebp: JerryWebp,
      },
      {
        name: 'Seok-hee Han',
        title: 'Lead Engineer',
        linkedin: 'https://www.linkedin.com/in/seok-hee-han-2a2723a9/',
        image: Steve,
        imageWebp: SteveWebp,
      },
      {
        name: 'Jihyun Ahn',
        title: 'Software Engineer',
        linkedin: 'https://www.linkedin.com/in/jihyun-ahn-4b6037225/',
        image: Janice,
        imageWebp: JaniceWebp,
      },
      {
        name: 'Jeonghyeon Park',
        title: 'Software Engineer',
        linkedin: 'https://www.linkedin.com/in/jeonghyeon-park-8116ab17b/',
        image: Jeonghyun,
        imageWebp: JeonghyunWebp,
      },
      {
        name: 'Heewon Kim',
        title: 'Software Engineer',
        linkedin: 'https://www.linkedin.com/in/heewon-kim-hkim/',
        image: Heewon,
        imageWebp: HeewonWebp,
      },
      {
        name: 'Rachel Yun',
        title: 'UX/UI Designer',
        linkedin: 'https://www.linkedin.com/in/rachelyyun/',
        image: Rachel,
        imageWebp: RachelWebp,
      },
      {
        name: 'Jihae Choi',
        title: 'Marketing Director',
        linkedin: 'https://www.linkedin.com/in/jihae-choi/',
        image: Jihae,
        imageWebp: JihaeWebp,
      },
    ],
    [],
  );

  // Scroll event handler with proper typing
  // TO DO: Make it works...
  const handleScroll = (e: React.UIEvent<HTMLElement>): void => {
    e.stopPropagation();
  };

  return (
    <Box
      onScroll={handleScroll}
      sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}
    >
      <Box
        sx={{
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          width: '100%',
          mb: 4,
          position: 'relative',
        }}
      >
        <Box sx={{ position: 'absolute', left: -10 }}>
          <IconButton onClick={onBack} aria-label="back">
            <ArrowBackIcon />
          </IconButton>
        </Box>
        <Typography variant="h2" color="red.main" sx={{ textAlign: 'center' }}>
          Founding Team
        </Typography>
      </Box>
      <Box
        sx={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fill, minmax(180px, 1fr))',
          gap: 2,
          width: '100%',
        }}
      >
        {teamMembers.map((member) => (
          <MemberCard
            key={member.name}
            name={member.name}
            title={member.title}
            linkedin={member.linkedin}
            image={{ imagePng: member.image, imageWebp: member.imageWebp }} // TO DO: Add imageAvif: member.imageAvif
          />
        ))}
      </Box>
    </Box>
  );
};

export default React.memo(TeamMembers);
