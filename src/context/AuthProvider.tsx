import axios from 'axios';
import React, { createContext, ReactNode, useContext, useReducer } from 'react';

interface State {
  username: string;
  loggedIn: boolean;
  authToken: string;
  totalQuestions: number;
  timePerQuestion: number; //in seconds
}

interface Props {
  children?: ReactNode;
}

const initialState: State = {
  username: '',
  loggedIn: false,
  authToken: '',
  totalQuestions: 0,
  timePerQuestion: 30,
};

const AuthContext = createContext<{
  authState: State;
  dispatch: React.Dispatch<Action>;
}>({
  authState: initialState,
  dispatch: () => null,
});

type Action =
  | {
      type: 'LOGIN';
      username: string;
      authToken: string;
      totalQuestions: number;
      timePerQuestion: number;
    }
  | { type: 'LOGOUT' };

const authReducer = (state: State, action: Action): State => {
  switch (action.type) {
    case 'LOGIN':
      return {
        username: action.username,
        loggedIn: true,
        authToken: action.authToken,
        totalQuestions: Number(action.totalQuestions),
        timePerQuestion: Number(action.timePerQuestion),
      };
    case 'LOGOUT':
      return initialState;
    default:
      return state;
  }
};

const AuthProvider: React.FC<Props> = ({ children }) => {
  const [authState, dispatch] = useReducer(authReducer, initialState);
  axios.defaults.headers.common['Authorization'] =
    `Bearer ${authState.authToken}}`;
  axios.defaults.baseURL = 'http://localhost:8000';

  return (
    <AuthContext.Provider value={{ authState, dispatch }}>
      {children}
    </AuthContext.Provider>
  );
};

const useAuth = () => {
  return useContext(AuthContext);
};

export default AuthProvider;
export { useAuth };
