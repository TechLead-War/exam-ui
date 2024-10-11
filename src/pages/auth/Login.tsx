import { useState } from 'react';
import axios from 'axios';

import Button from '../../components/Button';
import { useAuth } from '../../context/AuthProvider';

const Login = () => {
  const { dispatch } = useAuth();

  const [username, setUsername] = useState<string>('');
  const [errorMessage, setErrorMessage] = useState<string>('');

  const handleLogin = async (e: Event) => {
    setErrorMessage('');
    e.preventDefault();
    if (!username) {
      setErrorMessage('Please enter username');
      return;
    }
    try {
      const response = await axios.post('/api/login', {
        username,
      });
      if (response.status === 200) {
        dispatch({
          type: 'LOGIN',
          username: username,
          authToken: response.data.token,
          totalQuestions: response.data.question_limit,
          timePerQuestion: response.data.time_per_question,
        });
      } else {
        setErrorMessage('Some error occured. Please try again');
      }
    } catch (error: any) {
      if (axios.isAxiosError(error)) {
        error.response && error.response.status === 406
          ? setErrorMessage(JSON.parse(error.request.responseText).error)
          : setErrorMessage('Some error occurred. Please try again');
      } else {
        setErrorMessage('Some error occurred. Please try again');
      }
    }
  };
  return (
    <div
      className="text-center flex items-center justify-center"
      style={{
        backgroundImage:
          'url("https://student.gehu.ac.in/Images/LoginImg/gehuHome.jpg")',
        backgroundAttachment: 'fixed',
        backgroundRepeat: 'no-repeat',
        backgroundPosition: 'center',
        minHeight: '100vh',
      }}
    >
      <div className="bg-white max-w-[500px] rounded-lg p-[2rem]">
        <div className="text-center">
          <h1 className="text-blue-700 text-2xl font-bold">Welcome!!</h1>
          <p>Please enter your ID to continue</p>
        </div>
        <form action="" className="mt-[1rem]">
          <input
            type="text"
            name=""
            id=""
            placeholder="Enrollment ID"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            className="shadow appearance-none border rounded-lg max-w-[250px] py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
          />
          {errorMessage && (
            <div className="text-red-500 mt-[1rem]">{errorMessage}</div>
          )}
          <div className="mt-[1rem]">
            <Button onClick={handleLogin}>Login</Button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Login;
