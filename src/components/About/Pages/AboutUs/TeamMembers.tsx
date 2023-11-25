/**
 * Component for the third page of about page.
 * @author Daekyun Kim <daekyun97@gmail.com>
 * @author Hyecheol (Jerry) Jang <hyecheol123@gmail.com>
 */
// React
import React from 'react';
// Material UI
import { Box, Typography, IconButton } from '@mui/material';
// Material UI Icons
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
// Components
import MemberCard from './MemberCard';
// Assets
import Daekyun from '../../../../../assets/Profile/Daekyun.png';
import DaekyunWebp from '../../../../../assets/Profile/Daekyun.png?as=webp';
import DaekyunAvif from '../../../../../assets/Profile/Daekyun.png?as=avif';
import Heewon from '../../../../../assets/Profile/Heewon.png';
import HeewonWebp from '../../../../../assets/Profile/Heewon.png?as=webp';
import HeewonAvif from '../../../../../assets/Profile/Heewon.png?as=avif';
import Janice from '../../../../../assets/Profile/Janice.png';
import JaniceWebp from '../../../../../assets/Profile/Janice.png?as=webp';
import JaniceAvif from '../../../../../assets/Profile/Janice.png?as=avif';
import Jerry from '../../../../../assets/Profile/Jerry.png';
import JerryWebp from '../../../../../assets/Profile/Jerry.png?as=webp';
import JerryAvif from '../../../../../assets/Profile/Jerry.png?as=avif';
import Jihae from '../../../../../assets/Profile/Jihae.png';
import JihaeWebp from '../../../../../assets/Profile/Jihae.png?as=webp';
import JihaeAvif from '../../../../../assets/Profile/Jihae.png?as=avif';
import Steve from '../../../../../assets/Profile/Steve.png';
import SteveWebp from '../../../../../assets/Profile/Steve.png?as=webp';
import SteveAvif from '../../../../../assets/Profile/Steve.png?as=avif';
import Jeonghyun from '../../../../../assets/Profile/Jeonghyun.png';
import JeonghyunWebp from '../../../../../assets/Profile/Jeonghyun.png?as=webp';
import JeonghyunAvif from '../../../../../assets/Profile/Jeonghyun.png?as=avif';
import Rachel from '../../../../../assets/Profile/Rachel.png';
import RachelWebp from '../../../../../assets/Profile/Rachel.png?as=webp';
import RachelAvif from '../../../../../assets/Profile/Rachel.png?as=avif';

/**
 * Interface for TeamMember modal
 */
interface ITeamMembersProps {
  onBack: () => void;
}

const modalStyle = {
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
};
const titleWrapperStyle = {
  display: 'flex',
  justifyContent: 'center',
  alignItems: 'center',
  width: '100%',
  mb: '20px',
  position: 'relative',
};
const backIconStyle = { paddingLeft: 0 };
const titleStyle = { textAlign: 'center', flex: 1 };
const cardWrapperStyle = {
  display: 'grid',
  gridTemplateColumns: 'repeat(auto-fill, minmax(180px, 1fr))',
  gap: '16px',
  width: '100%',
};

/**
 * React Functional Component for for the modal of third page of the About page.
 * Displays a list of founding team members with their names, titles, pictures,
 *   and LinkedIn links.
 * @param {ITeamMembersProps} props Properties passed from the parent component,
 *   including a function to handle the 'back' action.
 * @return {React.ReactElement} Renders the pop up of third page of the About
 *   page with team members' profiles.
 */
function TeamMembers(props: ITeamMembersProps): React.ReactElement {
  const teamMembers = [
    {
      name: 'Daekyun Kim',
      title: 'Product Manager & Software Engineer',
      linkedin: 'https://www.linkedin.com/in/dkim97',
      image: Daekyun,
      imageWebp: DaekyunWebp,
      imageAvif: DaekyunAvif,
    },
    {
      name: 'Hyechoel Jang',
      title: 'Tech Lead',
      linkedin: 'https://www.linkedin.com/in/jhyecheol/',
      image: Jerry,
      imageWebp: JerryWebp,
      imageAvif: JerryAvif,
    },
    {
      name: 'Seok-hee Han',
      title: 'Lead Engineer',
      linkedin: 'https://www.linkedin.com/in/seok-hee-han-2a2723a9/',
      image: Steve,
      imageWebp: SteveWebp,
      imageAvif: SteveAvif,
    },
    {
      name: 'Jihyun Ahn',
      title: 'Software Engineer',
      linkedin: 'https://www.linkedin.com/in/jihyun-ahn-4b6037225/',
      image: Janice,
      imageWebp: JaniceWebp,
      imageAvif: JaniceAvif,
    },
    {
      name: 'Jeonghyeon Park',
      title: 'Software Engineer',
      linkedin: 'https://www.linkedin.com/in/jeonghyeon-park-8116ab17b/',
      image: Jeonghyun,
      imageWebp: JeonghyunWebp,
      imageAvif: JeonghyunAvif,
    },
    {
      name: 'Heewon Kim',
      title: 'Software Engineer',
      linkedin: 'https://www.linkedin.com/in/heewon-kim-hkim/',
      image: Heewon,
      imageWebp: HeewonWebp,
      imageAvif: HeewonAvif,
    },
    {
      name: 'Rachel Yun',
      title: 'UX/UI Designer',
      linkedin: 'https://www.linkedin.com/in/rachelyyun/',
      image: Rachel,
      imageWebp: RachelWebp,
      imageAvif: RachelAvif,
    },
    {
      name: 'Jihae Choi',
      title: 'Marketing Director',
      linkedin: 'https://www.linkedin.com/in/jihae-choi/',
      image: Jihae,
      imageWebp: JihaeWebp,
      imageAvif: JihaeAvif,
    },
  ];

  return (
    <Box sx={modalStyle}>
      <Box sx={titleWrapperStyle}>
        <IconButton sx={backIconStyle} onClick={props.onBack} aria-label="back">
          <ArrowBackIcon />
        </IconButton>
        <Typography variant="h2" color="red.main" sx={titleStyle}>
          Founding Team
        </Typography>
      </Box>
      <Box sx={cardWrapperStyle}>
        {teamMembers.map(
          (member): React.ReactElement => (
            <MemberCard
              key={member.name}
              name={member.name}
              title={member.title}
              linkedinUrl={member.linkedin}
              image={{
                imagePng: member.image,
                imageWebp: member.imageWebp,
                imageAvif: member.imageAvif,
              }}
            />
          ),
        )}
      </Box>
    </Box>
  );
}

export default React.memo(TeamMembers);
