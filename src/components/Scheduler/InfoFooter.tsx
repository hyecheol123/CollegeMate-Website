/**
 * Component for the Footer which contains
 * Classes, Credits and view exam options
 * @author Daekyun Kim <daekyun97@gmail.com>
 */
// React
import { Typography, Box } from '@mui/material';
import React from 'react';

const footerStyle = {
  display: 'flex',
  flexDirection: 'column',
  py: '0.7em',
  px: '0.5em',
  width: '91%', // Make sure it takes the full width of its parent if needed
  margin: 'auto',
};

/**
 * React Functional Component Main Header for Home Page
 * @return {React.ReactElement} Renders Main Header for Home Page
 */
function InfoFooter(): React.ReactElement {
  return (
    <Box sx={footerStyle}>
      <Typography variant="body2" color="text.secondary">
        Online classes: ART 354, ASIAN 352
      </Typography>
      <Typography variant="body2" color="text.secondary">
        13 credits
      </Typography>
      <Typography variant="body1" color="error">
        View Exam Schedule
      </Typography>
    </Box>
  );
}

export default InfoFooter;
