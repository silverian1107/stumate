import React from 'react';

import QuizControls from './QuizControls';
import QuizCreator from './QuizCreator';

const QuizCreateElement: React.FC = () => {
  return (
    <div className="flex flex-col h-full">
      <h3 className="text-lg font-semibold mb-4">Total Quizzes (1)</h3>
      <div className="flex-1 overflow-hidden flex flex-col">
        <div className="flex-1 overflow-y-auto">
          <QuizCreator />
        </div>
        <div className="sticky bottom-0 mt-2">
          <QuizControls />
        </div>
      </div>
    </div>
  );
};

export default QuizCreateElement;
