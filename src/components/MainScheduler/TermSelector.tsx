/**
 * Term selector dropdown component for switching between academic terms
 * @author Generated for CollegeMate
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
    <Box
      sx={{
        display: 'flex',
        alignItems: 'center',
        gap: isMobile ? '8px' : '12px',
      }}
    >
      <Typography
        variant="body2"
        color="text.secondary"
        sx={{
          minWidth: 'max-content',
          fontSize: isMobile ? '0.875rem' : '0.9rem',
        }}
      >
        Term:
      </Typography>

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
            <MenuItem
              key={term.termCode}
              value={term.termCode}
              sx={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'flex-start',
                py: 1,
              }}
            >
              <Typography variant="body2" fontWeight="medium">
                {formatTermCode(term.termCode)}
              </Typography>
              <Typography
                variant="caption"
                color="text.secondary"
                sx={{ lineHeight: 1.2 }}
              >
                {term.longDescription}
              </Typography>
            </MenuItem>
          ))}
        </Select>
      </FormControl>
    </Box>
  );
}

export default TermSelector;
