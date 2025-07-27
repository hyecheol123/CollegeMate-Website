/**
 * Popup Stylesheet
 * @author Joomyoung Park <joommm516@gmail.com>
 */
import React, { ReactElement } from 'react';
import { styled } from '@mui/material/styles';
import InfoOutlinedIcon from '@mui/icons-material/InfoOutlined';
import {
  Box,
  Button,
  Paper,
  FormControl,
  Select,
  SelectProps,
  MenuItem,
  Typography,
} from '@mui/material';

/* PopupBox */
interface PopupPaperProps {
  width?: string | number;
  maxWidth?: string | number;
}
export const StyledPopupPaper = styled(Paper, {
  shouldForwardProp: (prop) => prop !== 'maxWidth',
})<PopupPaperProps>(({ theme, width, maxWidth }) => ({
  position: 'fixed',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  width,
  maxWidth,
  borderRadius: theme.spacing(0.5),
  padding: theme.spacing(2),
  zIndex: 1300,
  [theme.breakpoints.up('md')]: {
    width: width ?? '100%',
  },
}));
export const PopupContentWrapper = styled(Box)(({ theme }) => ({
  display: 'flex',
  flexDirection: 'column',
  width: '100%',
  padding: theme.spacing(1), //Give difference padding between close button and children
  gap: theme.spacing(1), // responsive gap for mibile
  [theme.breakpoints.up('sm')]: {
    gap: theme.spacing(2),
  },
}));

/* PopupButton */
export const PopupButtonsWrapper = styled(Box)(({ theme }) => ({
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  gap: theme.spacing(2),
  marginTop: theme.spacing(1),
  width: '100%',
}));
export const StyledPopupButton = styled(Button)({
  height: 40,
  maxWidth: '100%',
  textTransform: 'none', //Disable automatic capitalization
});

/* PopupDropdown */
export const PopupDropdownWrapper = styled(FormControl)(({ theme }) => ({
  maxWidth: '100%',
  alignSelf: 'center',
  borderColor: theme.palette.red.main,
}));
// A styled Select component with fixed string type
const BaseSelect = (props: SelectProps<string>): ReactElement =>
  React.createElement(Select<string>, props);
export const StyledPopupSelect = styled(BaseSelect)(({ theme }) => ({
  justifyContent: 'center',
  height: 40,
  color: theme.palette.darkGrey.main,
  ...theme.typography.body2,
}));
export const StyledPopupItem = styled(MenuItem)(({ theme }) => ({
  minHeight: 40,
  paddingTop: theme.spacing(1),
  paddingBottom: theme.spacing(1),
  ...theme.typography.body2,
}));

/* PopupHeader */
export const PopupHeaderWrapper = styled(Box)<{ align?: 'center' | 'start' }>(
  ({ align = 'center', theme }) => ({
    display: 'flex',
    justifyContent: align,
    marginTop: theme.spacing(1),
    marginBottom: theme.spacing(1),
  }),
);
export const PopupHeaderText = styled(Typography)({
  textAlign: 'center',
});

/* PopupInfoText */
export const PopupInfoWrapper = styled(Box)(({ theme }) => ({
  display: 'flex',
  alignItems: 'flex-start',
  justifyContent: 'center',
  gap: theme.spacing(1),
  marginTop: theme.spacing(1),
}));
export const PopupInfoIcon = styled(InfoOutlinedIcon)(({ theme }) => ({
  opacity: 0.4,
  fontSize: theme.typography.body2.lineHeight,
}));
export const PopupInfoText = styled(Typography)({
  alignSelf: 'center',
});
