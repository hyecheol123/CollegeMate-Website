/**
 * Component for the third page of about page.
 * @author Daekyun Kim <daekyun97@gmail.com>
 * @author Hyecheol (Jerry) Jang <hyecheol123@gmail.com>
 */
// React
import React from 'react';
// Material UI
import {
  Card,
  Box,
  CardContent,
  CardMedia,
  Typography,
  Link,
  IconButton,
} from '@mui/material';
// Material UI Icons
import LinkedInIcon from '@mui/icons-material/LinkedIn';

/**
 * Define an interface for the props
 */
interface ITeamMemberCardProps {
  name: string;
  title: string;
  linkedinUrl: string;
  image: {
    imageWebp: string;
    imagePng: string;
    imageAvif: string;
  };
}

const cardStyle = { elevation: 0 };
const imageStyle = { width: '156px', height: '156px', margin: 'auto' };
const nameWrapperStyle = {
  display: 'flex',
  justifyContent: 'space-between',
  alignItems: 'center',
};

/**
 * React Functional Component for displaying a single team member profile card.
 * It includes their name, title, profile picture,
 *   and a link to their LinkedIn profile.
 * @param {ITeamMemberCardProps} props The props containing
 *   the team member's information.
 * @returns {React.ReactElement} Renders the profile card of a single team member
 */
function MemberCard(props: ITeamMemberCardProps): React.ReactElement {
  const { name, title, linkedinUrl, image } = props;

  return (
    <Card sx={cardStyle}>
      <picture style={imageStyle}>
        <source srcSet={image.imageWebp} type="image/webp" />
        <source srcSet={image.imageAvif} type="image/avif" />
        <CardMedia
          component="img"
          sx={{ ...imageStyle, objectFit: 'cover' }}
          image={image.imagePng}
          alt={`Image of ${name}`}
        />
      </picture>
      <CardContent>
        <Box sx={nameWrapperStyle}>
          <Typography variant="body1" color="red.main">
            {name}
          </Typography>
          <Link href={linkedinUrl} target="_blank" rel="noopener noreferrer">
            <IconButton>
              <LinkedInIcon sx={{ color: 'red.main' }} />
            </IconButton>
          </Link>
        </Box>
        <Typography variant="body2" color="darkGrey.dark">
          {title}
        </Typography>
      </CardContent>
    </Card>
  );
}

export default MemberCard;
