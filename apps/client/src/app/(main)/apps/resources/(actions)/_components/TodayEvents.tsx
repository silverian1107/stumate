'use client';

import React, { useEffect, useState } from 'react';

import type { TodoItem } from '@/service/rootApi';
import { useGetTodoQuery } from '@/service/rootApi';

const TodayEvents = () => {
  const [tasks, setTasks] = useState<TodoItem[]>([]);
  const response = useGetTodoQuery();

  useEffect(() => {
    if (response.isSuccess) {
      setTasks(response.data.data);
    }
  }, [response.data, response.isSuccess]);
  console.log(tasks);
  return (
    <div className="max-w-full  bg-white rounded-b-lg px-2 border-t border-primary-100  box-border pb-2 h-full ">
      <p className="text-lg font-bold text-center text-primary-950 mb-4">
        Today Event
      </p>
      <div className="overflow-auto h-20 py-2">
        {(tasks || []).length ? (
          <ul className="space-y-2  ">
            {(tasks || [])
              .filter((task) => task?.isCompleted === false)
              .map((event) => (
                <li
                  key={event._id}
                  className="flex items-center justify-between border-b border-gray-200 pb-2"
                >
                  <div className="flex items-center">
                    <span className="size-2 rounded-full  bg-primary-700 mr-3" />
                    <span className="text-xs font-medium text-gray-700 truncate max-w-xs overflow-hidden">
                      {event.todo}
                    </span>
                  </div>
                  <span className="text-xs text-gray-500 mr-2">
                    {event.createdAt.split('T')[1].slice(0, 5)}
                  </span>
                </li>
              ))}
          </ul>
        ) : (
          <p className="text-center text-gray-500">No event today</p>
        )}
      </div>
    </div>
  );
};

export default TodayEvents;
