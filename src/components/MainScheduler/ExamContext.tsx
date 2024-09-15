/**
 * React Context to store Exam Page's control information globally
 * @author Daekyun Kim <daekyun97@gmail.com>
 * @author Hyecheol (Jerry) Jang <hyecheol123@gmail.com>
 */

import React from 'react';

// Type definition for props of ExamContextProvider
type ExamContextProviderProps = { children: React.ReactNode };

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
  dispatch: () => { },
};

/**
 * Reducer to modify the state
 * @param {State} state Current State
 * @param {Action} action Action to modify the State
 * @returns {State} New State
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

// Context for Exam page
const ExamContext = React.createContext<State>(initialContext);

/**
 * React functional component for ExamContext
 * @param {ExamContextProviderProps} props properties that passed from the
 *   parent component.
 * @returns {React.ReactElement} Renders ExamContextProvider
 */
export function ExamContextProvider(
  props: ExamContextProviderProps,
): React.ReactElement {
  // State
  const [state, dispatch] = React.useReducer(reducer, initialContext);

  // Context value
  const value = { ...state, dispatch };

  return (
    <ExamContext.Provider value={value}>{props.children}</ExamContext.Provider>
  );
}

/**
 * React custom hooks to use the Exam Context
 * @returns {State} current global state (Exam Context)
 */
export function useExamContext(): State {
  const state = React.useContext(ExamContext);
  if (!state) throw new Error('Cannot find ExamContext');
  return state;
}
