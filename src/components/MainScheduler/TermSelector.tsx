/**
 * Term Selector Dropdown Component
 * Allows users to switch between different academic terms
 * @author Daekyun Kim <daekyun97@gmail.com>
 */

import React from 'react';
import {
  FormControl,
  Select,
  MenuItem,
  SelectChangeEvent,
  Box,
  Typography,
  useTheme,
  useMediaQuery,
} from '@mui/material';
import type { TermData } from '../../types/term';
import { formatTermForDisplay } from '../../utils/termUtils';

interface TermSelectorProps {
  terms: TermData[];
  selectedTermCode: string;
  onTermChange: (termCode: string) => void;
  currentTermCode?: string;
}

/**
 * TermSelector component for switching between academic terms
 * @param {TermSelectorProps} props - Props including terms array and handlers
 * @return {React.ReactElement} The rendered term selector dropdown
 */
function TermSelector({
  terms,
  selectedTermCode,
  onTermChange,
  currentTermCode,
}: TermSelectorProps): React.ReactElement {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));

  const handleChange = (event: SelectChangeEvent<string>): void => {
    onTermChange(event.target.value);
  };

  const selectedTerm = terms.find((term) => term.termCode === selectedTermCode);

  return (
    <Box
      sx={{
        display: 'flex',
        flexDirection: isMobile ? 'column' : 'row',
        alignItems: isMobile ? 'flex-start' : 'center',
        gap: isMobile ? 1 : 2,
        mb: 2,
      }}
    >
      <Typography
        variant={isMobile ? 'h6' : 'h5'}
        component="h1"
        sx={{
          color: 'red.main',
          fontWeight: 'bold',
          flexShrink: 0,
        }}
      >
        {selectedTerm ? formatTermForDisplay(selectedTerm) : 'Schedule'}
        {currentTermCode === selectedTermCode && (
          <Typography
            component="span"
            variant="body2"
            sx={{
              ml: 1,
              color: 'text.secondary',
              fontWeight: 'normal',
            }}
          >
            (Current)
          </Typography>
        )}
      </Typography>

      <FormControl
        size="small"
        sx={{
          minWidth: isMobile ? '100%' : 180,
          maxWidth: isMobile ? '100%' : 220,
        }}
      >
        <Select
          value={selectedTermCode}
          onChange={handleChange}
          displayEmpty
          sx={{
            bgcolor: 'background.paper',
            '& .MuiOutlinedInput-notchedOutline': {
              borderColor: 'red.main',
            },
            '&:hover .MuiOutlinedInput-notchedOutline': {
              borderColor: 'red.dark',
            },
            '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
              borderColor: 'red.main',
            },
          }}
        >
          {terms.map((term) => (
            <MenuItem key={term.termCode} value={term.termCode}>
              <Box sx={{ display: 'flex', flexDirection: 'column' }}>
                <Typography variant="body2">
                  {formatTermForDisplay(term)}
                </Typography>
                {currentTermCode === term.termCode && (
                  <Typography
                    variant="caption"
                    sx={{ color: 'text.secondary', fontStyle: 'italic' }}
                  >
                    Current Term
                  </Typography>
                )}
              </Box>
            </MenuItem>
          ))}
        </Select>
      </FormControl>
    </Box>
  );
}

export default TermSelector;
