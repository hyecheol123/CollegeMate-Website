import React from 'react';
import { Box, Typography } from '@mui/material';
import InfoOutlinedIcon from '@mui/icons-material/InfoOutlined';

interface PopupHelperTextProps {
  text: string;
}

/**
 * PopupHelperText - Informational helper text with an icon.
 * @param {object} props - Component props
 * @param {string} props.text - Text content to be displayed
 * @returns {React.ReactElement} Helper text component
 */
export default function PopupHelperText({
  text,
}: PopupHelperTextProps): React.ReactElement {
  return (
    <Box
      display="flex"
      alignItems="flex-start"
      justifyContent="center"
      gap={1}
      mt={1}
    >
      <InfoOutlinedIcon fontSize="small" sx={{ opacity: 0.4 }} />
      <Typography variant="body3" alignSelf="center">
        {text}
      </Typography>
    </Box>
  );
}
