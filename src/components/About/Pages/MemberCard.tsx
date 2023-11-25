/**
 * Component for the third page of about page.
 * @author Daekyun Kim <daekyun97@gmail.com>
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
// Define an interface for the props
interface TeamMemberCardProps {
  name: string;
  title: string;
  linkedin: string;
  image: {
    imageWebp: string;
    imagePng: string;
    imageAvif: string;
  };
}

/**
 * React Functional Component for displaying a single team member's profile card.
 * It includes their name, title, profile picture, and a link to their LinkedIn profile.
 * @param {TeamMemberCardProps} props - The props containing the team member's information.
 * @return {React.ReactElement} - Renders the profile card of a single team member.
 */
function MemberCard(props: TeamMemberCardProps): React.ReactElement {
  const { name, title, linkedin, image } = props;
  return (
    <Card sx={{ elevation: 0 }}>
      <picture>
        <source srcSet={image.imageWebp} type="image/webp" />
        <source srcSet={image.imageAvif} type="image/avif" />
        <CardMedia
          component="img"
          sx={{
            width: 156,
            height: 156,
            objectFit: 'cover',
            margin: 'auto',
          }}
          image={image.imagePng}
          alt={`Image of ${name}`}
        />
      </picture>
      <CardContent>
        <Box
          sx={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
          }}
        >
          <Typography variant="body1" color="red.main">
            {name}
          </Typography>
          <Link href={linkedin} target="_blank" rel="noopener noreferrer">
            <IconButton>
              <LinkedInIcon sx={{ color: 'red.main' }} />
            </IconButton>
          </Link>
        </Box>
        <Typography variant="body2" color="#000000">
          {title}
        </Typography>
      </CardContent>
    </Card>
  );
}

export default MemberCard;
