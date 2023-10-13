/**
 * Entry point of the application
 * @author Hyecheol (Jerry) Jang <hyecheol123@gmail.com>
 */

// React
import React from 'react';
import { render } from 'react-dom';
// Material UI
import { ThemeProvider, createTheme } from '@mui/material/styles';
import { CssBaseline } from '@mui/material';
// Router
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import '@fontsource/roboto/300.css';
import '@fontsource/roboto/400.css';
import '@fontsource/roboto/500.css';
import '@fontsource/roboto/700.css';
// Elements
import Loading from './components/Loading/Loading';
// import { LoginContextProvider, useLoginContext } from './LoginData';
// const Calendar = React.lazy(() => import('./Calendar'));
// const EventDetail = React.lazy(() => import('./EventDetail'));
// const EventParticipants = React.lazy(() => import('./EventParticipants'));
// const Login = React.lazy(() => import('./Login'));
// const ChangePW = React.lazy(() => import('./ChangePW'));

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
// displayLarge,displayMedium and subHead is not currently using.
declare module '@mui/material/styles' {
  interface TypographyVariantsOptions {
    // displayLarge?: React.CSSProperties;
    // displayMedium?: React.CSSProperties;
    displaySmall?: React.CSSProperties;
    headline?: React.CSSProperties;
    // subHead?: React.CSSProperties;
    aboutDesktopBody?: React.CSSProperties;
    bigBody?: React.CSSProperties;
    placeHolder?: React.CSSProperties;
    smallBody?: React.CSSProperties;
    footerLegal?: React.CSSProperties;
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
    headLine: true;
    // subHead?: React.CSSProperties;
    aboutDesktopBody: true;
    bigBody: true;
    placeHolder: true;
    smallBody: true;
    footerLegal: true;
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
    headline: {
      fontWeight: 400,
      fontSize: 26,
      lineHeight: 26,
      letterSpacing: 0,
    },
    // subHead: {
    //   fontWeight: 400,
    //   fontSize: 22,
    //   lineHeight: 26,
    //   letterSpacing: 0,
    // },
    // Body for Landing Page (About).
    // This is only for Desktop & Tablet version of landing page.
    // Otherwise, BodySmall will be used for landing page for mobile.
    aboutDesktopBody: {
      fontWeight: 400,
      fontSize: 21,
      lineHeight: 28,
      letterSpacing: 0,
    },
    bigBody: {
      fontWeight: 400,
      fontSize: 16,
      lineHeight: 19,
      letterSpacing: 0,
    },
    placeHolder: {
      fontWeight: 400,
      fontSize: 14,
      lineHeight: 18,
      letterSpacing: 0,
      opacity: 0.5,
    },
    smallBody: {
      fontWeight: 400,
      fontSize: 14,
      lineHeight: 18,
      letterSpacing: 0,
    },
    // Footer legal Information
    footerLegal: {
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

/**
 * React functional component to render the application's content
 * @return {React.ReactElement} The content of the application
 */
function App(): React.ReactElement {
  return (
    // <ThemeProvider theme={theme}>
    <>
      <CssBaseline />
      {/* <Router basename={'collegemate'}>
        <Routes>
          <Route path="/" element={false ? <></> : <Loading />} />
        </Routes>
      </Router> */}
      <Loading />
    </>
    // </ThemeProvider>
  );
}

/**
 * React functional component to render the application's entry point
 * @return {React.ReactElement} The entry point of the application
 */
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
