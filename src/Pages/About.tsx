/**
 * About Page
 * @author Hyecheol (Jerry) Jang <hyecheol123@gmail.com>
 */

// React
import React from 'react';
// Components
import AboutPage from '../components/About/AboutPage';
import { AboutContextProvider } from '../components/About/AboutContext';

/**
 * React functional component to render about page
 * @return {React.ReactElement} the entry point for About page
 */
function About(): React.ReactElement {
  return (
    <AboutContextProvider>
      <AboutPage />
    </AboutContextProvider>
  );
}

export default About;
