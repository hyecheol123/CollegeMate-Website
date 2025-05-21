/**
 * Popup Dropdown
 * @author Joomyoung Park <joommm516@gmail.com>
 */
import React from 'react';
import {
  Select,
  MenuItem,
  FormControl,
  SelectChangeEvent,
} from '@mui/material';

interface PopupDropdownProps {
  items: string[];
  value: string;
  onChange: (event: SelectChangeEvent<string>) => void;
}

/**
 * PopupDropdown - A reusable dropdown component for popup UIs.
 * @param {object} props - Component props
 * @param {string[]} props.items - Array of selectable string items
 * @param {string} props.value - Currently selected value
 * @param {(event: SelectChangeEvent<string>) => void} props.onChange - Handler for value change
 * @returns {React.ReactElement} Reusable dropdown select
 */
export default function PopupDropdown({
  items,
  value,
  onChange,
}: PopupDropdownProps): React.ReactElement {
  return (
    <FormControl
      fullWidth
      sx={{ maxWidth: 420, borderColor: 'red.main', alignSelf: 'center' }}
    >
      <Select
        value={value}
        onChange={onChange}
        sx={(theme) => ({
          justifyContent: 'center',
          height: 40,
          color: theme.palette.darkGrey.main,
          ...theme.typography.body2,
        })}
      >
        {items.map((item, i) => (
          <MenuItem
            sx={(theme) => ({
              minHeight: 40,
              py: 1,
              ...theme.typography.body2,
            })}
            key={i}
            value={item}
          >
            {item}
          </MenuItem>
        ))}
      </Select>
    </FormControl>
  );
}
