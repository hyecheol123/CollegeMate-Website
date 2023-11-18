// React
import React from 'react';
// Material UI
import { Box, Typography } from '@mui/material';
// Global Styles
import PageWrapperStyle from '../Styles/PageWrapper';
// Assets
import feature1 from '../../../../assets/thumbnail_Feature1.png';

const pictureWrapperStyle = { flex: 1 };
const pictureStyle = {
    margin: 'auto',
    display: 'block',
    height: 0,
    minHeight: '80%',
    width: 0,
    minWidth: '80%',
    objectFit: 'contain',
};

/**
 * React Functional Component for Schedule customization page
 * @return {React.ReactElement} Renders the Schedule customization page
 */
function Page2(): React.ReactElement {
    return (
        <Box sx={PageWrapperStyle}>
            <Typography variant="h1" color="red.main" align="center" marginTop="30px">
                Customize Schedule
            </Typography>
            <Typography variant="body1" align="center" marginTop="30px" mb="30px">
                Customize your schedule effortlessly with CollegeMate - real-time data from UW's database at your fingertips. CollegeMate updates for you.
            </Typography>
            <Box sx={pictureWrapperStyle}>
                <picture>
                    <source srcSet={feature1} type="image/webp" />
                    <Box
                        sx={pictureStyle}
                        component="img"
                        src={feature1}
                        alt="Mockup of Schedule Customization"
                    />
                </picture>
            </Box>
        </Box>
    );
}

export default React.memo(Page2);
