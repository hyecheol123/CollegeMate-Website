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
    ...theme.typography.body2,
  },
}));

export default CustomBadge;
