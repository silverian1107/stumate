export interface QuizCreateDto {
  noteId?: string;
  name: string;
  description?: string;
  numberOfQuestion: number;
  duration: number;
}

export interface QuizAnswer {
  _id?: string;
  option: string;
  isCorrect: boolean;
}

export interface QuizQuestion {
  _id?: string;
  question: string;
  questionType: 'multiple' | 'single' | 'short_answer';
  answerOptions?: QuizAnswer[];
  answerText?: string;
}
