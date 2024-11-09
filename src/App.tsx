import { useEffect } from 'react';
import './App.css';
import { useAuth } from './context/AuthProvider';
import Login from './pages/auth/Login';
import ExamHelper from './pages/testScreen/ExamHelper';

const App = () => {
  const { authState } = useAuth();


  useEffect(() => {
    // Function to check window size
    const checkWindowSize = () => {
      const windowWidth = window.innerWidth;
      const windowHeight = window.innerHeight;
      if (windowWidth < 1024 || windowHeight < 768) {
        document.body.innerHTML = '<div class="flex h-screen w-full flex-col text-center items-center justify-center"><h1 class="font-bold text-xl">Screen size is not supported for test</h1><p class="text-sm font-semibold text-gray-500">Seems like you are not using laptop or desktop</p></div>';
      }
    };

    // Initial check (Only this will work otherwise use state variable to track without destroying DOM node)
    checkWindowSize();

    // Add event listener for resize (Will not work due to destroyed DOM node reason: document.body.innerHTML) 
    window.addEventListener('resize', checkWindowSize);

    // Cleanup listener on component unmount
    return () => window.removeEventListener('resize', checkWindowSize);
  }, []);


  return (
      <div className="App">{authState.loggedIn ? <ExamHelper /> : <Login />}</div>
  );
};

export default App;
