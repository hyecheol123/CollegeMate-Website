/**
 * About Page Contents
 * @author Hyecheol (Jerry) Jang <hyecheol123@gmail.com>
 */

// React
import React from 'react';
// Material UI
// Material UI Icons
// Components
import Slides from './Slides';
import Welcome from './Pages/Welcome';
import Feature from './Pages/Feature';
import AboutUs from './Pages/AboutUs';
import Footer from './Pages/Footer';
// Global Style
// Assets
import feature1Png from '../../../assets/thumbnail_Feature1.png';
import feature1Webp from '../../../assets/thumbnail_Feature1.png?as=webp';
import feature1Avif from '../../../assets/thumbnail_Feature1.png?as=avif';
import feature2Png from '../../../assets/thumbnail_Feature2.png';
import feature2Webp from '../../../assets/thumbnail_Feature2.png?as=webp';
import feature2Avif from '../../../assets/thumbnail_Feature2.png?as=avif';
import feature3Png from '../../../assets/thumbnail_Feature3.png';
import feature3Webp from '../../../assets/thumbnail_Feature3.png?as=webp';
import feature3Avif from '../../../assets/thumbnail_Feature3.png?as=avif';

/**
 * React Functional Component to generate About page
 * @returns {React.ReactElement} Renders About page
 */
function AboutPage(): React.ReactElement {
  // Feature Data
  const featureData = [
    {
      title: 'Customize Schedule',
      body: "Customize your schedule effortlessly with CollegeMate - real-time data from UW's database at your fingertips. CollegeMate updates for you.",
      pngImage: feature1Png,
      webpImage: feature1Webp,
      avifImage: feature1Avif,
      imageAlt: 'Mockup of Schedule Customization',
    },
    {
      title: 'Share Schedule with Friends',
      body: 'Eliminate the "What\'s your schedule?" dilemma. CollegeMate simplifies viewing friends\' timetables. No back-and-forth. Stay connected in a snap',
      pngImage: feature2Png,
      webpImage: feature2Webp,
      avifImage: feature2Avif,
      imageAlt: "Mockup of Friend's Schedule",
    },
    {
      title: 'Set Schedule as Wallpaper',
      body: "Download your timetable to perfectly fit your phone's screen. Say goodbye to screenshots. Access your schedule whenever and wherever.",
      pngImage: feature3Png,
      webpImage: feature3Webp,
      avifImage: feature3Avif,
      imageAlt: 'Mockup of Wallpaper Download',
    },
  ];

  return (
    <Slides
      components={[
        <Welcome key={'welcome'} />,
        featureData.map((data, idx): React.ReactElement => {
          return <Feature {...data} key={`feature-${idx}`} />;
        }),
        <AboutUs key={'aboutus'} />,
        <Footer key={'footer'} />,
      ]}
    />
  );
}

export default AboutPage;
