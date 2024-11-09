// types.ts
export type ResourceType = 'quizzes' | 'decks' | 'assessment';

export interface ResourceElement {
  id?: string;
  front: string;
  back: string;
}

export interface Resource {
  id?: string;
  name: string;
  description: string;
  elements: ResourceElement[];
}
