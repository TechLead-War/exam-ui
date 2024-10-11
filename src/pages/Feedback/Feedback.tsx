import { useState } from 'react';
import axios from 'axios';

import Button from '../../components/Button';

import { useAuth } from '../../context/AuthProvider';

const Feedback = () => {
  const [feedbackText, setFeedbackText] = useState<string>('');
  const [isFeedbackSubmitted, setIsFeedbackSubmitted] =
    useState<boolean>(false);

  const { authState } = useAuth();

  const submitFeedback = async () => {
    try {
      await axios.post('api/submit/feedback', {
        username: authState.username,
        feedback: feedbackText,
      });
    } catch (error) {
    } finally {
      setIsFeedbackSubmitted(true);
    }
  };

  return (
    <div className="max-w-sm mx-auto mt-[2rem]">
      {isFeedbackSubmitted ? (
        <div className="text-green-500 mt-[1rem]">
          Your test has been submitted successfully. You can now exit the
          window.
        </div>
      ) : (
        <>
          <label
            htmlFor="message"
            className="block mb-2 text-sm font-medium text-gray-900"
          >
            <h1 className="text-2xl">Feedback</h1>
          </label>
          <textarea
            id="message"
            rows={4}
            value={feedbackText}
            onChange={(e) => setFeedbackText(e.target.value)}
            className="block p-2.5 w-full text-sm text-gray-900 bg-gray-50 rounded-lg border border-gray-300 focus:ring-blue-500 focus:border-blue-500"
            placeholder="Leave a feedback..."
          ></textarea>
          <div className="mt-[1rem]">
            <Button onClick={submitFeedback}>Submit</Button>
          </div>
        </>
      )}
    </div>
  );
};

export default Feedback;
