/**
 * Entry point of the application
 * @author Hyecheol (Jerry) Jang <hyecheol123@gmail.com>
 */

import React from 'react';
import { render } from 'react-dom';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import { CssBaseline } from '@mui/material';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import '@fontsource/roboto/300.css';
import '@fontsource/roboto/400.css';
import '@fontsource/roboto/500.css';
import '@fontsource/roboto/700.css';
import Loading from './components/Loading/Loading';

// Define breakpoints
const breakpoints = {
  values: {
    xs: 0,
    sm: 600,
    md: 900,
    lg: 1200,
    xl: 1536,
  },
};

// Material-UI Theme configuration
// displayLarge,displayMedium and SubHead is not currently using.
declare module '@mui/material/styles' {
  interface TypographyVariantsOptions {
    // displayLarge?: React.CSSProperties;
    // displayMedium?: React.CSSProperties;
    displaySmall?: React.CSSProperties;
    Headline?: React.CSSProperties;
    // SubHead?: React.CSSProperties;
    AboutDesktopBody?: React.CSSProperties;
    BigBody?: React.CSSProperties;
    PlaceHolder?: React.CSSProperties;
    SmallBody?: React.CSSProperties;
    FooterLegal?: React.CSSProperties;
  }

  interface PaletteOptions {
    primary?: {
      red: string;
      darkGrey: string;
      lightGrey: string;
      whiteGrey: string;
      white: string;
    };
    secondary?: {
      yellow: string;
      green: string;
    };
  }
  
  interface TypographyPropsVariantOverrides {
    // displayLarge?: React.CSSProperties;
    // displayMedium?: React.CSSProperties;
    displaySmall: true;
    HeadLine: true;
    // SubHead?: React.CSSProperties;
    AboutDesktopBody: true;
    BigBody: true;
    PlaceHolder: true;
    SmallBody: true;
    FooterLegal: true;
  }
}

const theme = createTheme({
  breakpoints,
  typography: {
    fontFamily: 'Roboto',
    // displayLarge and displayMedium, SubHead is not currently using.
    // displayLarge: { 
    //   fontWeight: 400, 
    //   fontSize: 57,
    //   lineHeight:67,
    //   letterSpacing:0
    // },
    // displayMedium: {
    //   fontWeight: 400,
    //   fontSize: 45,
    //   lineHeight: 53,
    //   letterSpacing:0
    // },
    // Landing Page (About)'s Tagline and Title.
    displaySmall: {
      fontWeight: 400,
      fontSize: 38,
      lineHeight: 44,
      letterSpacing: 0,
    },
    // Web App's Title for each categories.
    Headline: {
      fontWeight: 400,
      fontSize: 26,
      lineHeight: 26,
      letterSpacing: 0,
    },
    // SubHead: {
    //   fontWeight: 400,
    //   fontSize: 22,
    //   lineHeight: 26,
    //   letterSpacing: 0,
    // },
    // Body for Landing Page (About).
    // This is only for Desktop & Tablet version of landing page.
    // Otherwise, BodySmall will be used for landing page for mobile.
    AboutDesktopBody: {
      fontWeight: 400,
      fontSize: 21,
      lineHeight: 28,
      letterSpacing: 0,
    },
    BigBody: {
      fontWeight: 400,
      fontSize: 16,
      lineHeight: 19,
      letterSpacing: 0,
    },
    PlaceHolder: {
      fontWeight: 400,
      fontSize: 14,
      lineHeight: 18,
      letterSpacing: 0,
      opacity: 0.5,
    },
    SmallBody: {
      fontWeight: 400,
      fontSize: 14,
      lineHeight: 18,
      letterSpacing: 0,
    },
    // Footer legal Information
    FooterLegal: {
      fontWeight: 400,
      fontSize: 11,
      lineHeight: 13,
      letterSpacing: 0,
    },
  },
  palette: {
    primary: {
      red: '#B20000',
      darkGrey: '#494949',
      lightGrey: '#DEE3E5',
      whiteGrey: '#f7f7f7',
      white: '#ffffff',
    },
    secondary: {
      yellow: '#FFC700',
      green: '#1CC82D',
    },
  },
});

function App(): React.ReactElement {
  return (
    <ThemeProvider theme={theme}>
      <>
        <CssBaseline />
        <Loading />
      </>
    </ThemeProvider>
  );
}

function AppWrapper(): React.ReactElement {
  return (
    <React.StrictMode>
      <React.Suspense fallback={<Loading />}>
        <App />
      </React.Suspense>
    </React.StrictMode>
  );
}

render(<AppWrapper />, document.getElementById('root'));
