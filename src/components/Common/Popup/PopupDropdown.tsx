/**
 * Popup Dropdown
 * @author Joomyoung Park <joommm516@gmail.com>
 */
import React from 'react';
import { SelectChangeEvent } from '@mui/material';
import { PopupDropdownWrapper, StyledPopupItem, StyledPopupSelect } from './';

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
    <PopupDropdownWrapper fullWidth>
      <StyledPopupSelect value={value} onChange={onChange}>
        {items.map((item, i) => (
          <StyledPopupItem key={i} value={item}>
            {item}
          </StyledPopupItem>
        ))}
      </StyledPopupSelect>
    </PopupDropdownWrapper>
  );
}
