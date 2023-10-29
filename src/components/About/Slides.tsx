/**
 * Slides component to support full-page scroll in about page
 * @author Hyecheol (Jerry) Jang <hyecheol123@gmail.com>
 */

// React
import React from 'react';
// Material UI
import { Box, Typography } from '@mui/material';
// Material UI Icons
// Components
// Global Style

/**
 * Interface for SlideProps
 */
interface SlideProps {
  components: (React.ReactElement | React.ReactElement[])[];
}

/**
 * React Functional Component for full-page scroll wrapper
 * @param {SlideProps} props Properties that passed from the parent Component
 * @return {React.ReactElement} Renders full-page scroll wrapper
 */
function Slides(props: SlideProps): React.ReactElement {
  const { components } = props;

  // States
  const [verticalIdx, setVerticalIdx] = React.useState(0);

  return (
    <Box>
      {(components[verticalIdx] as any)?.length === undefined ? (
        components[verticalIdx]
      ) : (
        <Typography>Horizontal Scroll</Typography>
      )}
    </Box>
  );
}

export default Slides;
