/**
 * Entry point of the application
 * @author Hyecheol (Jerry) Jang <hyecheol123@gmail.com>
 */

// React
import React from 'react';
import { createRoot } from 'react-dom/client';
// Material UI
import { ThemeProvider, createTheme } from '@mui/material/styles';
import { CssBaseline } from '@mui/material';
// Router
import {
  Routes,
  Route,
  createBrowserRouter,
  RouterProvider,
  Outlet,
} from 'react-router-dom';
// Font
import '@fontsource/roboto/300.css';
import '@fontsource/roboto/400.css';
import '@fontsource/roboto/500.css';
import '@fontsource/roboto/700.css';
// Elements
import Loading from './components/Common/Loading/Loading';
const About = React.lazy(() => import('./About'));

// MUI Theme (Setup Font family and Palette Color)
declare module '@mui/material/styles' {
  interface TypographyVariantsOptions {
    body3?: React.CSSProperties;
    body4?: React.CSSProperties;
  }
  interface Palette {
    red: Palette['primary'];
    yellow: Palette['primary'];
    darkGrey: Palette['primary'];
    defGrey: Palette['primary'];
    whiteGrey: Palette['primary'];
    white: Palette['primary'];
    green: Palette['primary'];
  }
  interface PaletteOptions {
    red?: PaletteOptions['primary'];
    yellow?: PaletteOptions['primary'];
    darkGrey?: PaletteOptions['primary'];
    defGrey?: PaletteOptions['primary'];
    whiteGrey?: PaletteOptions['primary'];
    white?: PaletteOptions['primary'];
    green?: PaletteOptions['primary'];
  }
}
declare module '@mui/material/Typography' {
  interface TypographyPropsVariantOverrides {
    h4: false;
    h5: false;
    h6: false;
    subtitle1: false;
    subtitle2: false;
    body3: true;
    body4: true;
    button: false;
    caption: false;
    overline: false;
  }
}
declare module '@mui/material/Button' {
  interface ButtonPropsColorOverrides {
    whiteGrey: true;
  }
}

const breakpoints = {
  values: {
    xs: 0,
    sm: 600,
    md: 900,
    lg: 1200,
    xl: 1536,
  },
};
let theme = createTheme({
  breakpoints,
  typography: {
    fontFamily: '"Roboto", sans-serif',
    h1: {
      fontWeight: 700,
      fontSize: '38px',
      lineHeight: '44px',
      letterSpacing: 0,
    },
    h2: {
      fontWeight: 700,
      fontSize: '26px',
      lineHeight: '30px',
      letterSpacing: 0,
    },
    h3: {
      fontWeight: 400,
      fontSize: '21px',
      lineHeight: '28px',
      letterSpacing: 0,
    },
    body1: {
      fontWeight: 400,
      fontSize: '16px',
      lineHeight: '19px',
      letterSpacing: 0,
    },
    body2: {
      fontWeight: 400,
      fontSize: '14px',
      lineHeight: '18px',
      letterSpacing: 0,
    },
    body3: {
      fontWeight: 400,
      fontSize: '14px',
      lineHeight: '18px',
      letterSpacing: 0,
      opacity: 0.5,
    },
    body4: {
      fontWeight: 400,
      fontSize: '11px',
      lineHeight: '13px',
      letterSpacing: 0,
    },
  },
  palette: {
    primary: { main: '#B20000' },
  },
});
theme = createTheme(theme, {
  palette: {
    red: theme.palette.augmentColor({
      color: { main: '#B20000' },
      name: 'red',
    }),
    yellow: theme.palette.augmentColor({
      color: { main: '#FFC700' },
      name: 'yellow',
    }),
    darkGrey: theme.palette.augmentColor({
      color: { main: '#494949' },
      name: 'darkGrey',
    }),
    grey: theme.palette.augmentColor({
      color: { main: '#DEE3E5' },
      name: 'grey',
    }),
    whiteGrey: theme.palette.augmentColor({
      color: { main: '#f7f7f7' },
      name: 'whiteGray',
    }),
    white: theme.palette.augmentColor({
      color: { main: '#ffffff' },
      name: 'white',
    }),
    green: theme.palette.augmentColor({
      color: { main: '#1CC82D' },
      name: 'green',
    }),
  },
});

/**
 * React functional component to setup App Layout
 * @return {React.ReactElement} The Layout setup for this application
 */
function Layout(): React.ReactElement {
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Outlet />
    </ThemeProvider>
  );
}

/**
 * React functional component to render the application's content
 * @return {React.ReactElement} The content of the application
 */
function App(): React.ReactElement {
  return (
    <Routes>
      <Route element={<Layout />}>
        <Route path="/" element={<About />} />
      </Route>
    </Routes>
  );
}

const router = createBrowserRouter([{ path: '*', Component: App }]);

/**
 * React functional component to render the application's entry point
 * @return {React.ReactElement} The entry point of the application
 */
function AppWrapper(): React.ReactElement {
  return (
    <React.StrictMode>
      <React.Suspense fallback={<Loading />}>
        <RouterProvider router={router} />
      </React.Suspense>
    </React.StrictMode>
  );
}

const container = document.getElementById('root') as HTMLElement;
const root = createRoot(container);
root.render(<AppWrapper />);
