/**
 * Base Popup Box
 * @author Joomyoung Park <joommm516@gmail.com>
 */

import React from 'react';
import { PopupButtonsWrapper, StyledPopupButton } from './PopupStyles';

interface PopupButton {
  label?: string;
  borderColor?: string;
  backgroundColor?: string;
  textColor?: string;
  variant?: 'text' | 'outlined' | 'contained';
  onClick?: () => void;
}

interface PopupButtonProps {
  buttons: PopupButton[];
}

/**
 * PopupFooter - A flexible footer that supports rendering any number of action buttons.
 * @param {object} props - Component props
 * @param {PopupButtonProps[]} props.buttons - Array of button configs to be rendered
 * @returns {React.ReactElement} Footer with dynamically rendered buttons
 */
export default function PopupButton({
  buttons,
}: PopupButtonProps): React.ReactElement {
  //Define pop-up button default values
  const defaultButton: Required<PopupButton> = {
    label: 'Button',
    borderColor: 'grey.main',
    backgroundColor: 'white.main',
    variant: 'outlined',
    textColor: 'darkGrey.main',
    onClick: () => {},
  };
  return (
    <PopupButtonsWrapper>
      {buttons.map(({ ...rest }, idx) => {
        const merged = { ...defaultButton, ...rest };
        return (
          <StyledPopupButton
            key={idx}
            variant={merged.variant}
            onClick={merged.onClick}
            fullWidth
            sx={{
              color: merged.textColor,
              borderColor: merged.borderColor,
              backgroundColor: merged.backgroundColor,
            }}
          >
            {merged.label}
          </StyledPopupButton>
        );
      })}
    </PopupButtonsWrapper>
  );
}
