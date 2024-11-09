import { useEffect, useState } from 'react';
import axios from 'axios';

import Question from './question/Question';
import TimerBar from './TimerBar';

import { CodingQuestionData, ExamState, QuestionData, Stats } from '../../types/Exam';

import { useAuth } from '../../context/AuthProvider';

import './exam.scss';
import CodeScreen from '../code/CodeScreen';

let questionNumber: number = 0;
const _questionData: QuestionData = {
  number: 1,
  text: '',
  options: [],
  question_id: '',
  test_id: '',
};
const _codingQuestionData: CodingQuestionData = {
  number: 1,
  title: 'Two',
  desc: 'Given an array of integers nums and an integer target, return indices of the two numbers such that they add up to target.\n\nYou may assume that each input would have exactly one solution, and you may not use the same element twice.\n\nYou can return the answer in any order.\n\n\nExample 1:\n\nInput: nums = [2,7,11,15], target = 9\nOutput: [0,1]\nExplanation: Because nums[0] + nums[1] == 9, we return [0, 1].\nExample 2:\n\nInput: nums = [3,2,4], target = 6\nOutput: [1,2]\nExample 3:\nInput: nums = [3,3], target = 6\nOutput: [0,1]\n\nConstraints:\n\n2 <= nums.length <= 104\n-109 <= nums[i] <= 109\n-109 <= target <= 109\nOnly one valid answer exists.\n\nFollow-up: Can you come up with an algorithm that is less than O(n2) time complexity?',
  test_id: '',
  examples: [],
  testcases: []
};

interface Props {
  toggleFullScreen: (val: boolean) => void;
  setExamState: (val: ExamState) => void;
}

const Exam: React.FC<Props> = ({ toggleFullScreen, setExamState }) => {
  const { authState } = useAuth();

  const [seconds, setSeconds] = useState<number>(authState.timePerQuestion);
  const [questionData, setQuestionData] = useState<QuestionData>(_questionData);
  const [codingQuestionData, setCodingQuestionData] = useState<CodingQuestionData>(_codingQuestionData);
  const [stats, setStats] = useState<Stats>({
    attemptedQuestions: 0,
    skippedQuestions: 0,
  });
  const [animationKey, setAnimationKey] = useState<number>(0); //when key changes timer component will re render and hence the animation
  const [isLoading, setIsLoading] = useState<boolean>(false);

  useEffect(() => {
    const interval = setInterval(() => {
      if (seconds > 0) setSeconds(seconds - 1);
      else clearInterval(interval);
    }, 1000);
    return () => {
      clearInterval(interval);
    };
  }, [seconds]);



  const getNextQuestion = async () => {
    setIsLoading(true);
    try {
      const response = await axios.post('/api/question', {
        username: authState.username,
        token: authState.authToken,
      });
      if (response.status === 200) {
        if (authState.testType === 'code') {
          setCodingQuestionData(response.data);
        } else {
          setQuestionData({ ...response.data, number: ++questionNumber });
        }
        // restart the animation
        setAnimationKey((prev) => prev + 1);
        setIsLoading(false);
      }
    } catch (error) {
      // instead show a loading state also
      // alert('Ending exam due to technical glitch');
      // setExamState('ENDED');
    }
  };

  const handleNextButtonClick = () => {
    // this method is called after the submission of response of the quesion
    if (questionNumber === authState.totalQuestions) {
      endExam();
      return;
    }
    getNextQuestion();
    setSeconds(authState.timePerQuestion);
  };

  const endExam = async () => {
    toggleFullScreen(false);
    setExamState('ENDED');
  };

  useEffect(() => {
    // get first question on initial render
    getNextQuestion();
  }, []);


  
  return (
    <div className="question_container bg-white relative">
      {!isLoading ? (
        <div className="h-[100vh] w-[100vw] ml-[-2rem] mt-[-1rem] bg-slate-300 opacity-75 absolute top-0 flex items-center justify-center">
          <span className="text-xl">Please wait...</span>
        </div>
      ) : (
        <>
          <TimerBar key={animationKey} />
          <div className="bg-white p-[1rem] text-center font-bold text-xl border-b-2 border-slate-200 relative">
            <p className="bg-blue-400 text-center text-white py-[0.25rem] px-[1rem] inline-block rounded-lg absolute top-[10px] left-0 text-base font-normal">
              Time left: {seconds} seconds
            </p>
            Question {questionData.number} of {authState.totalQuestions}
            <p
              onClick={endExam}
              className="ml-[1rem] cursor-pointer bg-red-700 text-white font-bold py-[0.25rem] px-[1rem] rounded-lg inline-block absolute top-[10px] right-0"
            >
              End Test
            </p>
          </div>
          {
            authState.testType === "code"
              ?
              <CodeScreen
                handleNextButtonClick={handleNextButtonClick}
                questionData={codingQuestionData}
                stats={stats}
                setStats={setStats}
                seconds={seconds}
              />
              :
              <Question
                handleNextButtonClick={handleNextButtonClick}
                questionData={questionData}
                stats={stats}
                setStats={setStats}
                seconds={seconds}
              />
          }
          <div className="mt-[2rem]">
            <span className="ml-[1rem] bg-green-400 text-white font-bold py-[0.25rem] px-[1rem]">
              Attempted: {stats.attemptedQuestions}
            </span>
            <span className="ml-[1rem] bg-red-400 text-white font-bold py-[0.25rem] px-[1rem]">
              Skipped: {stats.skippedQuestions}
            </span>
          </div>
        </>
      )}
    </div>
  );
};

export default Exam;
