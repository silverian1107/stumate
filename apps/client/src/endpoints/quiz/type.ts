export interface QuizCreateDto {
  noteId?: string;
  name: string;
  description?: string;
  numberOfQuestion: number;
  duration: number;
}

export interface QuizAnswer {
  _id?: string;
  option: string; // it mean text
  isCorrect: boolean;
}

export interface QuizQuestion {
  _id?: string;
  question: string;
  questionType: 'multiple' | 'single';
  answerOptions: QuizAnswer[];
}
