/**
 * Simple Header component with only centered logo
 * - Simplified version of MainHeader for MVP
 * @author Daekyun Kim <daekyun97@gmail.com>
 */

// React
import React from 'react';
// Components
import CustomImage from '../../Common/Styles/CustomImage';
// Assets
import LogoImg from '../../../../assets/logo.png';
import LogoWebp from '../../../../assets/logo.png?as=webp';
import LogoAvif from '../../../../assets/logo.png?as=avif';
// Styles
import { HeaderContainer, LogoContainer } from './SimpleHeader.styles';

/**
 * SimpleHeader component rendering top bar with only centered logo.
 * @returns {React.ReactElement} The rendered SimpleHeader component
 */
function SimpleHeader(): React.ReactElement {
  return (
    <HeaderContainer>
      <LogoContainer>
        <CustomImage
          png={LogoImg}
          webp={LogoWebp}
          avif={LogoAvif}
          alt="CollegeMate Logo"
          height="20px"
          width="auto"
        />
      </LogoContainer>
    </HeaderContainer>
  );
}

export default SimpleHeader;
