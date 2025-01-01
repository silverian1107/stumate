export type ResourceType = 'decks' | 'quizzes';

export type EntityAction = 'create' | 'update' | 'delete';

export type DeckCreateDto = {
  name: string;
  noteId?: string;
  description?: string;
};

export interface BaseResource {
  _id?: string;
  name: string;
  description?: string;
  isArchived?: boolean;
}

export interface FlashcardElement {
  _id?: string;
  front: string;
  back: string;
  deckId?: string;
}

export interface QuizElement {
  id?: string;
  question: string;
  questionType: string;
  answerOptions: {
    option: string;
    isCorrect: boolean;
  }[];
  answerText: string;
  point: number;
  quizTestId: string;
}

export interface FlashcardElementWithAction extends FlashcardElement {
  action?: 'create' | 'update' | 'delete';
  originalAction?: 'create' | 'update';
  isDeleted?: boolean;
  frontError: boolean;
  backError: boolean;
}

export interface Deck extends BaseResource {
  flashcards: FlashcardElementWithAction[];
}

export interface Quiz extends BaseResource {
  updatedAt: string | number | Date;
  numberOfQuestion: number;
  duration: number;
  elements: QuizElement[];
  sharedWithUsers?: [];
}

export type Resource = Deck | Quiz;

export type DeckFromServer = {
  _id: string;
  name: string;
  description: string;
  ownerId: string;
  noteId: string | null;
  studyStatus: {
    totalCards: number;
    reviewedCards: number;
    dueToday: number;
    progress: number;
    lastStudied: Date;
  };
  tags: string[];
  isCloned: boolean;
  sharedWithUsers: string[];
  createdBy: {
    _id: string;
    username: string;
  };
  isArchived: boolean;
  archivedAt: string | null;
  deleted: boolean;
  createdAt: string;
  updatedAt: string;
};
