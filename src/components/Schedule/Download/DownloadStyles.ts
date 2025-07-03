/**
 * DownloadPopup Stylesheet
 * @author Joomyoung Park <joommm516@gmail.com>
 */
import { styled } from '@mui/material/styles';
import { Box, Typography } from '@mui/material';
import VerifiedIcon from '@mui/icons-material/Verified';

/* DownloadDone */
export const DownloadDoneWrapper = styled(Box)(({ theme }) => ({
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  justifyContent: 'center',
  minHeight: 150,
  marginBottom: theme.spacing(3),
  gap: theme.spacing(1),
  cursor: 'pointer',
}));
export const DownloadDoneIcon = styled(VerifiedIcon)(({ theme }) => ({
  fontSize: 45,
  color: theme.palette.green.main,
}));
export const DownloadDoneMessage = styled(Typography)(({ theme }) => ({
  textAlign: 'center',
  marginTop: theme.spacing(3),
}));

/* DownloadError */
export const DownloadErrorWrapper = styled(Box)(({ theme }) => ({
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  gap: theme.spacing(3),
  marginTop: theme.spacing(5),
}));

/* DownloadLoading */
export const DownloadLoadingWrapper = styled(Box)(({ theme }) => ({
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  margin: theme.spacing(4),
  gap: theme.spacing(2),
  position: 'relative',
}));
export const DownloadLoadingInner = styled(Box)(({ theme }) => ({
  position: 'relative',
  margin: theme.spacing(5),
}));
