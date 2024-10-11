import './App.css';

import { useAuth } from './context/AuthProvider';

import Login from './pages/auth/Login';
import ExamHelper from './pages/testScreen/ExamHelper';

const App = () => {
  const { authState } = useAuth();

  return (
    <div className="App">{authState.loggedIn ? <ExamHelper /> : <Login />}</div>
  );
};

export default App;
