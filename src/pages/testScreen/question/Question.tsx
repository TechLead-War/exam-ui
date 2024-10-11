import { useEffect, useState } from 'react';
import { MdOutlineRefresh } from 'react-icons/md';
import axios from 'axios';

import { QuestionData } from '../../../types/Exam';

import Button from '../../../components/Button';

import { useAuth } from '../../../context/AuthProvider';

import './question.scss';

interface QuestionProps {
  handleNextButtonClick: () => void;
  questionData: QuestionData;
  stats: any;
  setStats: any;
  seconds: number;
}

const Question: React.FC<QuestionProps> = ({
  handleNextButtonClick,
  questionData,
  stats,
  setStats,
  seconds,
}) => {
  const [optionId, setOptionId] = useState<string | null>(null);

  const { authState } = useAuth();

  useEffect(() => {
    if (seconds === 0) submitAnswer();
  }, [seconds]);

  const handleRadioClick = (val: string) => {
    setOptionId(val);
  };

  const submitAnswer = async () => {
    if (!optionId) {
      setStats({ ...stats, skippedQuestions: stats.skippedQuestions + 1 });
    } else {
      try {
        const response = await axios.post('/api/answer/submit', {
          question_id: questionData.question_id,
          option_id: optionId,
          username: authState.username,
          token: authState.authToken,
        });
        if (response.status === 200) {
          setStats({
            ...stats,
            attemptedQuestions: stats.attemptedQuestions + 1,
          });
        }
      } catch (error) {
        if (axios.isAxiosError(error)) {
          error.response && error.response.status !== 200
            ? alert(JSON.parse(error.request.responseText).error)
            : alert('Some error occurred. Please try again');
        } else {
          alert('Some error occurred. Please try again');
        }
      }
    }
    handleNextButtonClick();
  };

  return (
    <div className="question_container">
      <p className="mt-[2rem]">
        <span className="font-bold">Q{questionData.number}: </span>
        {questionData.text}
      </p>
      <div className="options_list ml-[2rem]">
        {questionData.options.map((option) => (
          <div key={option.option_id}>
            <input
              type="radio"
              id={String(option.option_id)}
              value={option.option_id}
              checked={optionId === option.option_id}
              onChange={() => handleRadioClick(option.option_id)}
              name="answer"
            />
            <label htmlFor={String(option.option_id)}>
              {option.option_text}
            </label>
          </div>
        ))}
        <div className="reset_answer">
          <span
            className="flex items-center text-blue-400"
            onClick={() => setOptionId(null)}
          >
            <MdOutlineRefresh className="mt-[1rem] mr-[0.5rem]" />
            <p className="mt-[1rem]">Reset answer</p>
          </span>
        </div>
      </div>
      <div className="text-right mt-[2rem] mr-[2rem]">
        <Button onClick={submitAnswer}>
          {questionData.number === authState.totalQuestions ? 'Submit' : 'Next'}
        </Button>
      </div>
    </div>
  );
};

export default Question;
