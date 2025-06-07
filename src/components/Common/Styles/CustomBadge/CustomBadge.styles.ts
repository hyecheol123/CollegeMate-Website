/**
 * CustomBadge Stylesheet
 * - Contains styled components for consistent badge appearance
 * - Centralizes badge positioning, size, and typography
 * @author Daekyun Kim <daekyun97@gmail.com>
 */

import { styled } from '@mui/material/styles';
import Badge from '@mui/material/Badge';

export const StyledBadge = styled(Badge)(({ theme }) => ({
  '& .MuiBadge-badge': {
    backgroundColor: theme.palette.red.main,
    color: theme.palette.common.white,
    fontSize: theme.typography.body3.fontSize,
    transform: 'translate(30%, 15%)',
    height: '14px',
    minWidth: '14px',
    padding: 0,
    lineHeight: 1,
  },
}));
