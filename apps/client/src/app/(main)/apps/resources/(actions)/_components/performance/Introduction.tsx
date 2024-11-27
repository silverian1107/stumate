import React from 'react';

const Introduction = () => {
  return (
    <div className="flex flex-col item-center  mb-2 text-xs text-gray-500 ">
      <div className="flex items-center mr-4">
        <div className="size-4 bg-primary-50 border mr-2" />
        <span>0</span>
      </div>
      <div className="flex items-center mr-4">
        <div className="size-4 bg-primary-200 border mr-2" />
        <span>{`>`}2</span>
      </div>
      <div className="flex items-center mr-4">
        <div className="size-4 bg-primary-400 border mr-2" />
        <span>{`>`}4</span>
      </div>
      <div className="flex items-center mr-4">
        <div className="size-4 bg-primary-600 border mr-2" />
        <span>5+</span>
      </div>
      <div className="flex items-center mr-4">
        <div className="size-4 bg-primary-800 border mr-2" />
        <span>5+</span>
      </div>
    </div>
  );
};

export default Introduction;
