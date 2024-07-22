/**
 * React Context to store globally shared data
 * @author Hyecheol (Jerry) Jang <hyecheol123@gmail.com>
 */

import React from 'react';

// Type definition for props of GlobalContextProvider
type GlobalContextProviderProps = { children: React.ReactNode };

// Type for all actions
type Action =
  | { type: 'LOGIN'; email: string }
  | { type: 'LOGOUT' }
  | { type: 'SET_NEW_TNC' }
  | { type: 'UNSET_NEW_TNC' }
  | { type: 'INITIALIZE'; login: boolean; email: string; newTnC: boolean };

// Type definition for state
type State = {
  login: boolean;
  email: string;
  newTnC: boolean;
  initialized: boolean;
  dispatch: React.Dispatch<Action>;
};

// Initial Data of reducer
const initialData: State = {
  login: false,
  email: '',
  newTnC: false,
  initialized: false,
  dispatch: () => {},
};

/**
 * Reducer to modify the state
 * @param {State} state Current State
 * @param {Action} action Action to modify the State
 * @returns {State} New State
 */
function reducer(state: State, action: Action): State {
  switch (action.type) {
    case 'LOGIN':
      return { ...state, login: true, email: action.email };
    case 'LOGOUT':
      return { ...state, login: false };
    case 'SET_NEW_TNC':
      return { ...state, newTnC: true };
    case 'UNSET_NEW_TNC':
      return { ...state, newTnC: false };
    case 'INITIALIZE':
      return {
        ...state,
        login: action.login,
        email: action.email,
        newTnC: action.newTnC,
        initialized: true,
      };
    default:
      return state;
  }
}

// Context used globally
const GlobalContext = React.createContext<State>(initialData);

/**
 * React Functional Component for GlobalContext
 * @param {GlobalContextProviderProps} props Properties that passed from the
 *   parent Component.
 * @returns {React.ReactElement} Renders GlobalContextProvider
 */
export function GlobalContextProvider(
  props: GlobalContextProviderProps,
): React.ReactElement {
  // State
  const [state, dispatch] = React.useReducer(reducer, initialData);

  // Context Value
  const value = { ...state, dispatch };

  return (
    <GlobalContext.Provider value={value}>
      {props.children}
    </GlobalContext.Provider>
  );
}

/**
 * React Custom Hooks to use the Global Context
 * @returns {State} current global state (Global Context)
 */
export function useGlobalContext(): State {
  const state = React.useContext(GlobalContext);
  if (!state) throw new Error('Cannot Find GlobalContext');
  return state;
}
