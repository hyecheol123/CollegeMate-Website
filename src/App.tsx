/**
 * Entry point of the application
 * @author Hyecheol (Jerry) Jang <hyecheol123@gmail.com>
 */

// React
import React from 'react';
import { render } from 'react-dom';

// Material UI
import { ThemeProvider, createTheme, ThemeOptions } from '@mui/material/styles';
import { CssBaseline } from '@mui/material';

// Router
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';

// Font imports
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

// Define an interface for the custom palette colors
interface CustomPaletteColors {
  main: string;
}

// Define a custom palette using the specified colors
interface CustomPalette {
  red: CustomPaletteColors;
  yellow: CustomPaletteColors;
  darkGrey: CustomPaletteColors;
  grey: CustomPaletteColors;
  whiteGrey: CustomPaletteColors;
  white: CustomPaletteColors;
  green: CustomPaletteColors;
}

// Material-UI Theme configuration
declare module '@mui/material/styles' {
  interface TypographyVariantsOptions {
    h1?: React.CSSProperties;
    h2?: React.CSSProperties;
    h3?: React.CSSProperties;
    h4?: React.CSSProperties;
    h5?: React.CSSProperties;
    body1?: React.CSSProperties;
    body2?: React.CSSProperties;
    body3?: React.CSSProperties;
    caption?: React.CSSProperties;
    footnote?: React.CSSProperties;
  }

  // Disabling h1, h2, and h5
  interface TypographyPropsVariantOverrides {
    h1: false;
    h2: false;
    h3: true;
    h4: true;
    h5: false;
    body1: true;
    body2: true;
    body3: true;
    caption: true;
    footnote: true;
  }

  interface Palette {
    custom: CustomPalette;
  }

  interface PaletteOptions {
    custom: CustomPalette;
  }
}

const theme = createTheme({
  breakpoints,
  typography: {
    fontFamily: 'Roboto, Lato, sans-serif',
    h1: {
      fontWeight: 400,
      fontSize: 57,
      lineHeight: 67,
      letterSpacing: 0
    },
    h2: {
      fontWeight: 400,
      fontSize: 45,
      lineHeight: 53,
      letterSpacing: 0
    },
    h3: {
      fontWeight: 400,
      fontSize: 38,
      lineHeight: 44,
      letterSpacing: 0,
    },
    h4: {
      fontWeight: 400,
      fontSize: 26,
      lineHeight: 26,
      letterSpacing: 0,
    },
    h5: {
      fontWeight: 400,
      fontSize: 22,
      lineHeight: 26,
      letterSpacing: 0,
    },
    body1: {
      fontWeight: 400,
      fontSize: 21,
      lineHeight: 28,
      letterSpacing: 0,
    },
    body2: {
      fontWeight: 400,
      fontSize: 16,
      lineHeight: 19,
      letterSpacing: 0,
    },
    body3: {
      fontWeight: 400,
      fontSize: 14,
      lineHeight: 18,
      letterSpacing: 0,
      opacity: 0.5,
    },
    caption: {
      fontWeight: 400,
      fontSize: 14,
      lineHeight: 18,
      letterSpacing: 0,
    },
    footnote: {
      fontWeight: 400,
      fontSize: 11,
      lineHeight: 13,
      letterSpacing: 0,
    },
  },
  palette: {
    custom: {
      red: {
        main: '#B20000',
      },
      yellow: {
        main: '#FFC700',
      },
      darkGrey: {
        main: '#494949',
      },
      grey: {
        main: '#DEE3E5',
      },
      whiteGrey: {
        main: '#f7f7f7',
      },
      white: {
        main: '#ffffff',
      },
      green: {
        main: '#1CC82D',
      },
    },
  },
});

/**
 * React functional component to render the application's content
 * @return {React.ReactElement} The content of the application
 */
function App(): React.ReactElement {
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      {/* <Router basename={'collegemate'}>
        <Routes>
          <Route path="/" element={false ? <></> : <Loading />} />
        </Routes>
      </Router> */}
      <Loading />
    </ThemeProvider>
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