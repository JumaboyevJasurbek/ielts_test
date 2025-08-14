export interface Question {
  id: number;
  questionText: string;
  options: string[];
  createdAt: string;
  updatedAt: string;
}

export interface QuestionWithAnswer extends Question {
  correctAnswer: number;
}

export interface TestResult {
  score: number;
  percentage: number;
  total: number;
}
