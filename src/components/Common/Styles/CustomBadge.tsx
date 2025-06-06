/**
 * Custom styled MUI Badge component for consistent badge appearance
 * - Applies red background with white text
 * - Uses body2 typography from theme
 * @author Daekyun Kim
 */

import { styled } from '@mui/material/styles';
import Badge from '@mui/material/Badge';

const CustomBadge = styled(Badge)(({ theme }) => ({
  '& .MuiBadge-badge': {
    backgroundColor: theme.palette.red.main,
    color: theme.palette.common.white,
    fontSize: theme.typography.body3.fontSize,
    transform: 'translate(30%, 15%)',
    height: '14px',
    minWidth: '14px',
    padding: 0,
  },
}));

export default CustomBadge;
