export interface Option {
  option_id: string;
  option_text: string;
}

export interface QuestionData {
  number: number;
  text: string;
  options: Option[];
  test_id: string;
  question_id: string;
}

export interface Stats {
  attemptedQuestions: number;
  skippedQuestions: number;
}

export type ExamState = 'STARTED' | 'NOT_STARTED' | 'ENDED';
