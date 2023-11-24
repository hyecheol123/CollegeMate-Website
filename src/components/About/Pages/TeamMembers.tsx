/**
 * Component for the third page of about page.
 * @author Daekyun Kim <daekyun97@gmail.com>
 */

// React
import React, { useMemo } from 'react';
// Material UI
import {
  Box,
  Card,
  CardContent,
  Typography,
  Link,
  CardMedia,
  IconButton,
} from '@mui/material';
// Material UI Icons
import LinkedInIcon from '@mui/icons-material/LinkedIn';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
// Import statements for team profiles
import Daekyun from '../../../../assets/Profile/Daekyun.png';
import Heewon from '../../../../assets/Profile/Heewon.png';
import Janice from '../../../../assets/Profile/Janice.png';
import Jerry from '../../../../assets/Profile/Jerry.png';
import Jihae from '../../../../assets/Profile/Jihae.png';
import Steve from '../../../../assets/Profile/Steve.png';
import Jeonghyun from '../../../../assets/Profile/Jeonghyun.png';
import Rachel from '../../../../assets/Profile/Rachel.png';

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
      },
      {
        name: 'Hyechoel Jang',
        title: 'Tech Lead',
        linkedin: 'https://www.linkedin.com/in/jhyecheol/',
        image: Jerry,
      },
      {
        name: 'Seok-hee Han',
        title: 'Lead Engineer',
        linkedin: 'https://www.linkedin.com/in/seok-hee-han-2a2723a9/',
        image: Steve,
      },
      {
        name: 'Jihyun Ahn',
        title: 'Software Engineer',
        linkedin: 'https://www.linkedin.com/in/jihyun-ahn-4b6037225/',
        image: Janice,
      },
      {
        name: 'Jeonghyeon Park',
        title: 'Software Engineer',
        linkedin: 'https://www.linkedin.com/in/jeonghyeon-park-8116ab17b/',
        image: Jeonghyun,
      },
      {
        name: 'Heewon Kim',
        title: 'Software Engineer',
        linkedin: 'https://www.linkedin.com/in/heewon-kim-hkim/',
        image: Heewon,
      },
      {
        name: 'Rachel Yun',
        title: 'UX/UI Designer',
        linkedin: 'https://www.linkedin.com/in/rachelyyun/',
        image: Rachel,
      },
      {
        name: 'Jihae Choi',
        title: 'Marketing Director',
        linkedin: 'https://www.linkedin.com/in/jihae-choi/',
        image: Jihae,
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
          <Card
            key={member.name}
            sx={{
              elevation: 0,
            }}
          >
            <CardMedia
              component="img"
              sx={{
                width: 156,
                height: 156,
                objectFit: 'cover',
                margin: 'auto',
              }}
              image={member.image}
              alt={`Image of ${member.name}`}
            />
            <CardContent>
              <Box
                sx={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                }}
              >
                <Typography variant="body1" color="red.main" component="div">
                  {member.name}
                </Typography>
                <Link
                  href={member.linkedin}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <LinkedInIcon sx={{ color: 'red.main' }} />
                </Link>
              </Box>
              <Typography variant="body3" color="#000000">
                {member.title}
              </Typography>
            </CardContent>
          </Card>
        ))}
      </Box>
    </Box>
  );
};

export default React.memo(TeamMembers);
