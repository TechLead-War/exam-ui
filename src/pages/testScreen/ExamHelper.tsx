import { useRef, useState, useEffect } from 'react';

import Exam from './Exam';
import Instructions from './Instructions';
import Feedback from '../Feedback/Feedback';

import { ExamState } from '../../types/Exam';

const ExamHelper = () => {
  const elementRef = useRef<HTMLDivElement>(null);
  const [examState, setExamState] = useState<ExamState>('NOT_STARTED');

  useEffect(() => {
    const handleFullScreenChange = () => {
      if (!document.fullscreenElement) {
        onFullScreenExit();
      }
    };

    document.addEventListener('fullscreenchange', handleFullScreenChange);
    document.addEventListener('visibilitychange', handleFullScreenChange);

    // add right click disable event
    const handleContextMenu = (event: Event) => {
      event.preventDefault();
    };
    document.addEventListener('contextmenu', handleContextMenu);

    return () => {
      document.removeEventListener('fullscreenchange', handleFullScreenChange);
      document.removeEventListener('visibilitychange', handleFullScreenChange);

      // remove the right click event
      document.removeEventListener('contextmenu', handleContextMenu);
    };
  }, []);

  const requestFullScreen = (element: HTMLElement) => {
    if (element.requestFullscreen) {
      element.requestFullscreen();
    } else if ((element as any).mozRequestFullScreen) {
      // Firefox
      (element as any).mozRequestFullScreen();
    } else if ((element as any).webkitRequestFullscreen) {
      // Chrome, Safari and Opera
      (element as any).webkitRequestFullscreen();
    } else if ((element as any).msRequestFullscreen) {
      // IE/Edge
      (element as any).msRequestFullscreen();
    }
  };

  const exitFullScreen = () => {
    if (document.exitFullscreen) {
      document.exitFullscreen();
    } else if ((document as any).mozCancelFullScreen) {
      // Firefox
      (document as any).mozCancelFullScreen();
    } else if ((document as any).webkitExitFullscreen) {
      // Chrome, Safari and Opera
      (document as any).webkitExitFullscreen();
    } else if ((document as any).msExitFullscreen) {
      // IE/Edge
      (document as any).msExitFullscreen();
    }
  };

  const toggleFullScreen = (shouldEnterFullScreen: boolean) => {
    if (shouldEnterFullScreen) {
      if (elementRef.current) {
        requestFullScreen(elementRef.current);
      }
    } else {
      if (document.fullscreenElement) {
        exitFullScreen();
      }
    }
  };

  const onFullScreenExit = async () => {
    // exit the test here
    setExamState('ENDED');
  };

  const startExam = () => {
    toggleFullScreen(true);
    setExamState('STARTED');
  };

  // not keeipng separate if condition as full screen will be triggered only when div with reference is rendered
  return (
    <div ref={elementRef} className="bg-white">
      {examState === 'NOT_STARTED' && <Instructions startExam={startExam} />}
      {examState === 'STARTED' && (
        <Exam toggleFullScreen={toggleFullScreen} setExamState={setExamState} />
      )}
      {examState === 'ENDED' && <Feedback />}
    </div>
  );
};

export default ExamHelper;
