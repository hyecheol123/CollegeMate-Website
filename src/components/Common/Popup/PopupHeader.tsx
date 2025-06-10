/**
 * Popup Header
 * @author Joomyoung Park <joommm516@gmail.com>
 */

import React from 'react';
import { PopupHeaderText, PopupHeaderWrapper } from './';

interface PopupHeaderProps {
  title?: string;
  align?: 'center' | 'start';
}

/**
 * Popup Header - Title to be displayed at the top of the popup
 * @param {object} props - Component props
 * @param {string} props.title - Title text
 * @param {string} props.align - Title align
 * @returns {React.ReactElement} Rendered popup component
 */
export default function PopupHeader({
  title = 'Popup Title',
  align = 'center',
}: PopupHeaderProps): React.ReactElement {
  return (
    <PopupHeaderWrapper align={align}>
      <PopupHeaderText variant="body1">{title}</PopupHeaderText>
    </PopupHeaderWrapper>
  );
}
