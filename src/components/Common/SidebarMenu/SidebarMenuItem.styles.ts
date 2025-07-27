/**
 * SidebarMenuItem Stylesheet
 * - Contains styled components for SidebarMenuItem
 * - Centralizes layout, spacing, and consistent design
 * @author Daekyun Kim <daekyun97@gmail.com>
 */

import { styled } from '@mui/material/styles';
import { ListItemButton, ListItemText, Divider } from '@mui/material';

// Styled ListItemButton
export const StyledListItemButton = styled(ListItemButton)({
  width: '100%',
  paddingTop: '20px',
  paddingBottom: '20px',
  marginLeft: '4px',
  verticalAlign: 'center',
});

// Styled ListItemText (we keep default for now)
export const StyledListItemText = styled(ListItemText)({});

// Styled Divider
export const StyledDivider = styled(Divider)({});
