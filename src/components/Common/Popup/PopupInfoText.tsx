import React from 'react';
import { PopupInfoWrapper, PopupInfoText, PopupInfoIcon } from './PopupStyles';

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
    <PopupInfoWrapper>
      <PopupInfoIcon />
      <PopupInfoText variant="body3">{text}</PopupInfoText>
    </PopupInfoWrapper>
  );
}
