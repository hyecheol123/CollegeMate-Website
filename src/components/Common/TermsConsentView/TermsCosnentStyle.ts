/**
 * Content Render Stylesheet
 * @author Joomyoung Park <joommm516@gmail.com>
 */

import { Typography } from '@mui/material';
import { styled } from '@mui/material/styles';

export const TncH2 = styled(Typography)(({ theme }) => ({
  marginTop: theme.spacing(1.5),
  marginBottom: theme.spacing(1),
  color: theme.palette.red.main,
  ...theme.typography.body1,
}));

export const TncH3 = styled(Typography)(({ theme }) => ({
  color: theme.palette.darkGrey.main,
  marginBottom: theme.spacing(0.5),
  ...theme.typography.body1,
}));

export const TncH4 = styled(Typography)(({ theme }) => ({
  color: theme.palette.darkGrey.main,
  marginBottom: theme.spacing(0.5),
  fontWeight: 500,
  fontSize: '15px',
  lineHeight: '19px',
  letterSpacing: 0,
}));

export const TncBody = styled(Typography)(({ theme }) => ({
  color: theme.palette.darkGrey.main,
  ...theme.typography.body2,
}));

export const TncList = styled('ul')(({ theme }) => ({
  color: theme.palette.darkGrey.main,
  paddingLeft: theme.spacing(2),
  margin: 0,
  listStyleType: 'disc',
}));
