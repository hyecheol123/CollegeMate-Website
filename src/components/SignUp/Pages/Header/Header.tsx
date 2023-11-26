/**
 * Component for the page of signup's header.
 * @author Heewon Kim <khw0285@gmail.com>
 */

// React
import React from 'react';

// Global Styles
import TitleStyle from '../../Styles/Title';

// Material UI
import { Box } from '@mui/material';

// Assets
import CollegeMateLogoWebp from '../../../../../assets/lg3 1.png?as=webp'
import CollegeMateLogo from '../../../../../assets/lg3 1.png'
import CollegeMateLogAvif from '../../../../../assets/lg3 1.png?as=avif'

/**
 * React Functional Component for SignUp page's first page
 * @return {React.ReactElement} Renders first page of about page
 */
function Header(): React.ReactElement {
    return (
        <Box sx={TitleStyle}>
            <source srcSet={CollegeMateLogAvif} type="image/avif" />
            <source srcSet={CollegeMateLogoWebp} type="image/webp" />
            <Box component="img"
                src={CollegeMateLogo}
                alt="CollegeMate Logo">
            </Box>
        </Box>
    );
}

export default Header;
