/**
 * Color Selection Modal component for customizing class colors
 * @author Claude AI Assistant
 */

import React from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Grid,
  Box,
  Typography,
} from '@mui/material';

// Color options as specified in requirements
const COLOR_OPTIONS = [
  { label: 'Dusty Blue', hex: '#758EA8' },
  { label: 'Sky Blue', hex: '#A6DDFF' },
  { label: 'Aqua Blue', hex: '#D9F6FF' },
  { label: 'Pale Mint', hex: '#CFF3E7' },
  { label: 'Red', hex: '#B20000' },
  { label: 'Rose Pink', hex: '#D46478' },
  { label: 'Baby Pink', hex: '#F3B8DF' },
  { label: 'Coral Pink', hex: '#F3ADA3' },
  { label: 'Mint', hex: '#00D0C5' },
  { label: 'Lime', hex: '#D7DF5A' },
  { label: 'Tangerine', hex: '#FFA944' },
  { label: 'Lemon', hex: '#F4EF56' },
  { label: 'Black', hex: '#000000' },
  { label: 'Dark Gray', hex: '#494949' },
  { label: 'Mild Gray', hex: '#A0A0A0' },
  { label: 'Light Gray', hex: '#E8E8E8' },
];

interface ColorSelectionModalProps {
  open: boolean;
  onClose: () => void;
  onColorSelect: (color: string) => void;
  selectedColor?: string;
}

/**
 * ColorSelectionModal component for selecting custom colors
 * @param {ColorSelectionModalProps} props - Props including modal state and handlers
 * @returns {React.ReactElement} The rendered ColorSelectionModal component
 */
function ColorSelectionModal({
  open,
  onClose,
  onColorSelect,
  selectedColor,
}: ColorSelectionModalProps): React.ReactElement {
  const [currentSelection, setCurrentSelection] = React.useState<string>(
    selectedColor || COLOR_OPTIONS[0].hex,
  );

  React.useEffect(() => {
    if (selectedColor) {
      setCurrentSelection(selectedColor);
    }
  }, [selectedColor]);

  const handleColorClick = (color: string): void => {
    setCurrentSelection(color);
  };

  const handleConfirm = (): void => {
    onColorSelect(currentSelection);
    onClose();
  };

  const handleCancel = (): void => {
    setCurrentSelection(selectedColor || COLOR_OPTIONS[0].hex);
    onClose();
  };

  return (
    <Dialog
      open={open}
      onClose={handleCancel}
      maxWidth="sm"
      fullWidth
      PaperProps={{
        sx: {
          borderRadius: '4px',
          padding: '8px',
        },
      }}
    >
      <DialogTitle
        sx={{
          textAlign: 'center',
          color: 'red.main',
          fontWeight: 600,
          fontSize: '1.5rem',
          paddingBottom: '16px',
        }}
      >
        Customize Color
      </DialogTitle>

      <DialogContent sx={{ padding: '20px' }}>
        <Grid container spacing={2}>
          {COLOR_OPTIONS.map((colorOption) => (
            <Grid item xs={3} key={colorOption.hex}>
              <Box
                sx={{
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  cursor: 'pointer',
                }}
                onClick={() => handleColorClick(colorOption.hex)}
              >
                <Box
                  sx={{
                    width: '100%',
                    height: '48px',
                    backgroundColor: colorOption.hex,
                    borderRadius: '4px',
                    border:
                      currentSelection === colorOption.hex
                        ? '2px solid #1976d2'
                        : '1px solid rgba(0,0,0,0.12)',
                    marginBottom: '6px',
                  }}
                />
                <Typography
                  variant="caption"
                  sx={{
                    fontSize: '11px',
                    color: 'text.primary',
                    textAlign: 'center',
                    lineHeight: 1.2,
                    fontWeight: 400,
                  }}
                >
                  {colorOption.label}
                </Typography>
              </Box>
            </Grid>
          ))}
        </Grid>
      </DialogContent>

      <DialogActions sx={{ padding: '16px 24px 24px 24px', gap: '12px' }}>
        <Button
          onClick={handleCancel}
          variant="outlined"
          sx={{
            flex: 1,
            padding: '12px',
            fontWeight: 600,
          }}
        >
          Cancel
        </Button>
        <Button
          onClick={handleConfirm}
          variant="contained"
          color="primary"
          sx={{
            flex: 1,
            padding: '12px',
            fontWeight: 600,
          }}
        >
          Add
        </Button>
      </DialogActions>
    </Dialog>
  );
}

export default ColorSelectionModal;
