import axios from 'axios';
import React, { createContext, ReactNode, useContext, useReducer } from 'react';

interface State {
  username: string;
  loggedIn: boolean;
  authToken: string;
  totalQuestions: number;
  timePerQuestion: number; //in seconds
  testType: string;
}

interface Props {
  children?: ReactNode;
}

const initialState: State = {
  username: '',
  loggedIn: false,
  authToken: '',
  totalQuestions: 2,
  timePerQuestion: 600,
  testType: 'code'
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
      testType: string;
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
        testType: action.testType
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
