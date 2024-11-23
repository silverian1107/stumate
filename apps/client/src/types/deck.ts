export type ResourceType = 'decks' | 'quizzes';

export type ENTITY_ACTION = 'create' | 'update' | 'delete';

export interface BaseResource {
  _id?: string;
  name: string;
  description?: string;
}

export interface FlashcardElement {
  _id?: string;
  front: string;
  back: string;
}

export interface QuizElement {
  id?: string;
  question: string;
  answers: {
    id?: string;
    text: string;
    correct: boolean;
  }[];
}

export interface FlashcardElementWithAction extends FlashcardElement {
  action?: 'create' | 'update' | 'delete';
  originalAction?: 'create' | 'update';
  isDeleted?: boolean;
}

export interface Deck extends BaseResource {
  flashcards: FlashcardElementWithAction[];
}

export interface Quiz extends BaseResource {
  elements: QuizElement[];
}

export type Resource = Deck | Quiz;
