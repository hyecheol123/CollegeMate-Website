import React from 'react';
import { Box, Card, CardContent, Typography, Link, CardMedia, IconButton } from '@mui/material';
import LinkedInIcon from '@mui/icons-material/LinkedIn';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';

// Sample placeholder image import, replace with actual image paths
import Daekyun from '../../../../assets/Profile/Daekyun.png';
import Heewon from '../../../../assets/Profile/Heewon.png';
import Janice from '../../../../assets/Profile/Janice.png';
import Jerry from '../../../../assets/Profile/Jerry.png';
import Jihae from '../../../../assets/Profile/Jihae.png';
import Steve from '../../../../assets/Profile/Steve.png';
import Yongsang from '../../../../assets/Profile/Yongsang.png';
import Jeonghyun from '../../../../assets/Profile/Jeonghyun.png';
import Rachel from '../../../../assets/Profile/Rachel.png';


interface TeamMember {
    name: string;
    title: string;
    linkedin: string;
    image: string;
}

interface TeamMembersProps {
    onBack: () => void; // Define the type for the onBack function
}


const teamMembers: TeamMember[] = [
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
        name: 'Yongsang Park',
        title: 'Lead Engineer',
        linkedin: 'https://www.linkedin.com/in/yongsang-park-57a4a3222/',
        image: Yongsang,
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
];

const TeamMembers: React.FC<TeamMembersProps> = ({ onBack }) => {
    // Scroll event handler with proper typing
    const handleScroll = (e: React.UIEvent<HTMLElement>) => {
        e.stopPropagation();
    };


    return (
        <Box onScroll={handleScroll} sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', width: '100%' }}>
            {/* Flex container for the back arrow, title, and invisible spacer */}
            <Box sx={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                width: '100%',
                mb: 4
            }}>
                <IconButton onClick={onBack} aria-label="back" sx={{ mr: 'auto' }}>
                    <ArrowBackIcon />
                </IconButton>
                <Typography variant="h2" color="red.main" sx={{ textAlign: 'center' }}>
                    Founding Team
                </Typography>
                {/* Invisible spacer with the same dimensions as IconButton to balance the layout */}
                <Box sx={{ width: 48, height: 48, mr: 'auto' }}></Box>
            </Box>
            <Box sx={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fill, minmax(170px, 4fr))', // Adjusted minmax values
                gap: 4,
                width: '100%', // Ensure the grid takes up the full width
                maxWidth: '1200px', // Optional: you can set a max-width to the grid container
            }}>
                {teamMembers.map((member) => (
                    <Card key={member.name}>
                        <CardMedia
                            component="img"
                            sx={{ width: 180, height: 180, objectFit: 'cover', margin: 'auto' }}
                            image={member.image}
                            alt={`Image of ${member.name}`}
                        />
                        <CardContent>
                            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                <Typography variant="body1" color="red.main" component="div" >
                                    {member.name}
                                </Typography>
                                <Link href={member.linkedin} target="_blank" rel="noopener noreferrer">
                                    <LinkedInIcon sx={{ color: 'red.main' }} /> {/* LinkedIn color */}
                                </Link>
                            </Box>
                            <Typography variant="body2" color='#000000'>
                                {member.title}
                            </Typography>
                        </CardContent>
                    </Card>
                ))}
            </Box>
        </Box>
    );
};

export default TeamMembers;