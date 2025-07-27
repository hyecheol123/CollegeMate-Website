/**
 * React Context to store globally shared data
 * @author Hyecheol (Jerry) Jang <hyecheol123@gmail.com>
 */

import React from 'react';

// Type for a single friend request
export type FriendRequestType = {
  requestId: string;
  from: string;
};

// Type for a single announcement
export type AnnouncementType = {
  id: string;
  title: string;
  content: string;
  datetime: string;
};

// Type definition for props of GlobalContextProvider
type GlobalContextProviderProps = { children: React.ReactNode };

// Type for all actions
type Action =
  | { type: 'LOGIN'; email: string }
  | { type: 'LOGOUT' }
  | { type: 'SET_NEW_TNC' }
  | { type: 'UNSET_NEW_TNC' }
  | { type: 'INITIALIZE'; login: boolean; email: string; newTnC: boolean }
  | {
      type: 'SET_FRIEND_REQUESTS';
      requests: FriendRequestType[];
      fetchedAt: number;
    }
  | { type: 'INVALIDATE_FRIEND_REQUESTS' }
  | {
      type: 'SET_ANNOUNCEMENTS';
      announcements: AnnouncementType[];
      fetchedAt: number;
    }
  | { type: 'INVALIDATE_ANNOUNCEMENTS' };

// Type definition for state
type State = {
  login: boolean;
  email: string;
  newTnC: boolean;
  initialized: boolean;
  dispatch: React.Dispatch<Action>;
  friendRequests: FriendRequestType[];
  friendRequestsFetchedAt: number | null;
  announcements: AnnouncementType[];
  announcementsFetchedAt: number | null;
};

// Initial Data of reducer
const initialData: State = {
  login: false,
  email: '',
  newTnC: false,
  initialized: false,
  dispatch: () => {},
  friendRequests: [],
  friendRequestsFetchedAt: null,
  announcements: [],
  announcementsFetchedAt: null,
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
    case 'SET_FRIEND_REQUESTS':
      return {
        ...state,
        friendRequests: action.requests,
        friendRequestsFetchedAt: action.fetchedAt,
      };
    case 'INVALIDATE_FRIEND_REQUESTS':
      return {
        ...state,
        friendRequests: [],
        friendRequestsFetchedAt: null,
      };
    case 'SET_ANNOUNCEMENTS':
      return {
        ...state,
        announcements: action.announcements,
        announcementsFetchedAt: action.fetchedAt,
      };
    case 'INVALIDATE_ANNOUNCEMENTS':
      return {
        ...state,
        announcements: [],
        announcementsFetchedAt: null,
      };
    default:
      return state;
  }
}

// Context used globally
const GlobalContext = React.createContext<State>(initialData);

/**
 * React Functional Component for GlobalContext
 * @param {GlobalContextProviderProps} props Properties that passed from the parent Component.
 * @returns {React.ReactElement} Renders GlobalContextProvider
 */
export function GlobalContextProvider(
  props: GlobalContextProviderProps,
): React.ReactElement {
  const [state, dispatch] = React.useReducer(reducer, initialData);
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
