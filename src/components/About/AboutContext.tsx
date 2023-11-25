/**
 * React Context to store About Page's control information globally
 * @author Hyecheol (Jerry) Jang <hyecheol123@gmail.com>
 */

import React from 'react';

// Type definition for props of AboutContextProvider
type AboutContextProviderProps = { children: React.ReactNode };

// Type for all actions
type Action = { type: 'ENABLE_SCROLL' } | { type: 'DISABLE_SCROLL' };

// Type definition for state
type State = {
  isFullpageScrollEnabled: boolean;
  dispatch: React.Dispatch<Action>;
};

// Initial Cotnext of reducer
const initialContext: State = {
  isFullpageScrollEnabled: true,
  dispatch: () => {},
};

/**
 * Reducer to modify the state
 * @param {State} state Current State
 * @param {Action} action Action to modify the State
 * @return {State} New State
 */
function reducer(state: State, action: Action): State {
  switch (action.type) {
    case 'ENABLE_SCROLL':
      return { ...state, isFullpageScrollEnabled: true };
    case 'DISABLE_SCROLL':
      return { ...state, isFullpageScrollEnabled: false };
    default:
      return state;
  }
}

// Context for about page
const AboutContext = React.createContext<State>(initialContext);

/**
 * React functional component for AboutContext
 * @param {AboutContextProviderProps} props properties that passed from the
 *   parent component.
 * @return {React.ReactElement} Renders AboutContextProvider
 */
export function AboutContextProvider(
  props: AboutContextProviderProps,
): React.ReactElement {
  // State
  const [state, dispatch] = React.useReducer(reducer, initialContext);

  // Context value
  const value = { ...state, dispatch };

  return (
    <AboutContext.Provider value={value}>
      {props.children}
    </AboutContext.Provider>
  );
}

/**
 * React custom hooks to use the About Context
 * @return {State} current global state (About Context)
 */
export function useAboutContext(): State {
  const state = React.useContext(AboutContext);
  if (!state) throw new Error('Cannot find AboutContext');
  return state;
}
