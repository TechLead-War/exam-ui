import { useAuth } from '../../context/AuthProvider';

// not reading key prop here as its a special prop in react and whenever it will change in the parent component, it will re render this component
const TimerBar: React.FC = () => {
  const { authState } = useAuth();
  return (
    <div className="progress-bar-wrapper my-[1rem]">
      <div
        className="progress-bar bg-blue-500"
        style={{ animationDuration: `${authState.timePerQuestion}s` }}
      ></div>
    </div>
  );
};

export default TimerBar;
