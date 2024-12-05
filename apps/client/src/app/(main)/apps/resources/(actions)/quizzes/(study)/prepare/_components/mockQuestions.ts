import type { Question } from '@/redux/slices/quizSlice';

export const mockQuestions: Question[] = [
  {
    _id: '1',
    text: 'What is the capital of France?',
    type: 'single',
    answers: [
      { _id: 'a', text: 'London', isCorrect: false },
      { _id: 'b', text: 'Paris', isCorrect: true },
      { _id: 'c', text: 'Berlin', isCorrect: false },
      { _id: 'd', text: 'Madrid', isCorrect: false }
    ]
  },
  {
    _id: '2',
    text: 'Which of the following are primary colors?',
    type: 'multiple',
    answers: [
      { _id: 'a', text: 'Red', isCorrect: true },
      { _id: 'b', text: 'Green', isCorrect: false },
      { _id: 'c', text: 'Blue', isCorrect: true },
      { _id: 'd', text: 'Yellow', isCorrect: true }
    ]
  },
  {
    _id: '3',
    text: 'Who wrote "Romeo and Juliet"?',
    type: 'single',
    answers: [
      { _id: 'a', text: 'Charles Dickens', isCorrect: false },
      { _id: 'b', text: 'William Shakespeare', isCorrect: true },
      { _id: 'c', text: 'Jane Austen', isCorrect: false },
      { _id: 'd', text: 'Mark Twain', isCorrect: false }
    ]
  },
  {
    _id: '4',
    text: 'Which of these elements are noble gases?',
    type: 'multiple',
    answers: [
      { _id: 'a', text: 'Helium', isCorrect: true },
      { _id: 'b', text: 'Oxygen', isCorrect: false },
      { _id: 'c', text: 'Neon', isCorrect: true },
      { _id: 'd', text: 'Argon', isCorrect: true }
    ]
  },
  {
    _id: '5',
    text: 'What is the largest planet in our solar system?',
    type: 'single',
    answers: [
      { _id: 'a', text: 'Earth', isCorrect: false },
      { _id: 'b', text: 'Mars', isCorrect: false },
      { _id: 'c', text: 'Jupiter', isCorrect: true },
      { _id: 'd', text: 'Saturn', isCorrect: false }
    ]
  },
  {
    _id: '6',
    text: 'Which of these countries are in Africa?',
    type: 'multiple',
    answers: [
      { _id: 'a', text: 'Nigeria', isCorrect: true },
      { _id: 'b', text: 'Brazil', isCorrect: false },
      { _id: 'c', text: 'Kenya', isCorrect: true },
      { _id: 'd', text: 'Thailand', isCorrect: false }
    ]
  },
  {
    _id: '7',
    text: 'Who painted the Mona Lisa?',
    type: 'single',
    answers: [
      { _id: 'a', text: 'Vincent van Gogh', isCorrect: false },
      { _id: 'b', text: 'Leonardo da Vinci', isCorrect: true },
      { _id: 'c', text: 'Pablo Picasso', isCorrect: false },
      { _id: 'd', text: 'Michelangelo', isCorrect: false }
    ]
  },
  {
    _id: '8',
    text: 'Which of these are programming languages?',
    type: 'multiple',
    answers: [
      { _id: 'a', text: 'Python', isCorrect: true },
      { _id: 'b', text: 'Cobra', isCorrect: false },
      { _id: 'c', text: 'Java', isCorrect: true },
      { _id: 'd', text: 'Ruby', isCorrect: true }
    ]
  },
  {
    _id: '9',
    text: 'What is the chemical symbol for gold?',
    type: 'single',
    answers: [
      { _id: 'a', text: 'Go', isCorrect: false },
      { _id: 'b', text: 'Gd', isCorrect: false },
      { _id: 'c', text: 'Au', isCorrect: true },
      { _id: 'd', text: 'Ag', isCorrect: false }
    ]
  },
  {
    _id: '10',
    text: 'Which of these are mammals?',
    type: 'multiple',
    answers: [
      { _id: 'a', text: 'Dolphin', isCorrect: true },
      { _id: 'b', text: 'Shark', isCorrect: false },
      { _id: 'c', text: 'Bat', isCorrect: true },
      { _id: 'd', text: 'Penguin', isCorrect: false }
    ]
  }
];
