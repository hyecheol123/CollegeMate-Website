/**
 * Term selector dropdown component for switching between academic terms
 * @author Daekyun Kim <daekyun97@gmail.com>
 */

import React from 'react';
import {
  FormControl,
  Select,
  MenuItem,
  Box,
  Typography,
  useTheme,
  useMediaQuery,
} from '@mui/material';
import type { SelectChangeEvent } from '@mui/material/Select';
import type { Term } from '../../data/Terms/getTerms';
import { formatTermCode } from '../../utils/termUtils';

interface TermSelectorProps {
  terms: Term[];
  selectedTerm: Term | null;
  onTermChange: (term: Term) => void;
  disabled?: boolean;
}

/**
 * TermSelector component renders a dropdown for selecting academic terms
 * Responsive design that adapts to mobile and desktop layouts
 * @param root0
 * @param root0.terms
 * @param root0.selectedTerm
 * @param root0.onTermChange
 * @param root0.disabled
 */
function TermSelector({
  terms,
  selectedTerm,
  onTermChange,
  disabled = false,
}: TermSelectorProps): React.ReactElement {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));

  const handleChange = (event: SelectChangeEvent<string>): void => {
    const selectedTermCode = event.target.value;
    const term = terms.find((t) => t.termCode === selectedTermCode);
    if (term) {
      onTermChange(term);
    }
  };

  if (terms.length === 0) {
    return (
      <Box
        sx={{
          display: 'flex',
          alignItems: 'center',
          minHeight: '40px',
        }}
      >
        <Typography
          variant="body2"
          color="text.secondary"
          sx={{ fontStyle: 'italic' }}
        >
          Loading terms...
        </Typography>
      </Box>
    );
  }

  return (
    <FormControl
      size="small"
      disabled={disabled}
      sx={{
        minWidth: isMobile ? '120px' : '140px',
        '& .MuiOutlinedInput-root': {
          fontSize: isMobile ? '0.875rem' : '0.9rem',
          height: isMobile ? '36px' : '40px',
          '&:hover .MuiOutlinedInput-notchedOutline': {
            borderColor: 'red.main',
          },
          '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
            borderColor: 'red.main',
          },
        },
      }}
    >
      <Select
        value={selectedTerm?.termCode || ''}
        onChange={handleChange}
        displayEmpty
        MenuProps={{
          PaperProps: {
            sx: {
              maxHeight: 300,
              '& .MuiMenuItem-root': {
                fontSize: isMobile ? '0.875rem' : '0.9rem',
                '&:hover': {
                  backgroundColor: 'rgba(178, 0, 0, 0.08)',
                },
                '&.Mui-selected': {
                  backgroundColor: 'rgba(178, 0, 0, 0.12)',
                  '&:hover': {
                    backgroundColor: 'rgba(178, 0, 0, 0.16)',
                  },
                },
              },
            },
          },
        }}
      >
        {selectedTerm === null && (
          <MenuItem value="" disabled>
            <em>Select a term</em>
          </MenuItem>
        )}

        {terms.map((term) => (
          <MenuItem key={term.termCode} value={term.termCode}>
            {formatTermCode(term.termCode)}
          </MenuItem>
        ))}
      </Select>
    </FormControl>
  );
}

export default TermSelector;
