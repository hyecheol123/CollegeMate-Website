/**
 * Setting Page
 * @author Jihyun (Janice) Ahn <jihyun.ahn.ai@gmail.com>
 */

// React
import React from 'react';
// Components
import SettingPage from '../components/Setting/View/SettingPage';
// API call
import getUserProfile from '../data/User/Profile/getUserProfile';

/**
 * React functional component to render about page
 * @return {React.ReactElement} the entry point for About page
 */
function Setting(): React.ReactElement {
  return (
    <SettingPage/>
  );
}

export default Setting;
