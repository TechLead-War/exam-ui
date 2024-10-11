import Button from '../../components/Button';

interface Props {
  startExam: () => void;
}
const Instructions: React.FC<Props> = ({ startExam }) => {
  return (
    <div className="p-[2rem]">
      <h1 className="font-bold text-3xl">Instructions</h1>
      <ol className="list-decimal ml-[2rem] mt-[1rem]">
        <li>Exiting full screen or switching tabs will exit the exam.</li>
        <li>
          If an option is selected and time for that question time expires, the
          response will be automatically submitted
        </li>
        <li>
          In case you want to skip the question but selected an response, please
          make sure to reset the answer
        </li>
        <li>Right click is disabled during the exam.</li>
        <li>All the best !!</li>
      </ol>
      <div className="mt-[1rem]">
        <Button onClick={() => startExam()}>Start Test</Button>
      </div>
    </div>
  );
};

export default Instructions;
