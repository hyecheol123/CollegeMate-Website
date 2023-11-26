/**
 * Signup Page
 * @author Heewon Kim <khw0285@gmail.com>
 */

// React
import React from 'react';
// Components
import SignUpTerms from './components/SignUp/Pages/SignUpTerms';

/**
 * React functional component to render signUp page
 * @return {React.ReactElement} the entry point for About page
 */
function SignUp(): React.ReactElement {
  return (
    // all compoments should be in this wrapper
    <SignUpTerms></SignUpTerms>
    // need to add sign up info components in wrapper
  );
}

export default SignUp;
