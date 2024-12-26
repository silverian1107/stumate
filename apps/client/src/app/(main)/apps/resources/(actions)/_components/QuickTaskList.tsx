import { ChartColumn, MoreVertical, Plus } from 'lucide-react';
import React, { useEffect, useState } from 'react';

import type { TodoItem } from '@/service/rootApi';
import {
  useAddTodoMutation,
  useCompleteTodoMutation,
  useDeleteTodoMutation,
  useEditTodoMutation,
  useGetTodoQuery
} from '@/service/rootApi';

const QuickTasksList = () => {
  const [tasks, setTasks] = useState<TodoItem[]>([]);
  const response = useGetTodoQuery();
  const [completeTodo] = useCompleteTodoMutation();
  const [deleteTodo] = useDeleteTodoMutation();
  const [editTodo] = useEditTodoMutation();
  const [addTodo] = useAddTodoMutation();

  const [newTask, setNewTask] = useState('');
  const [activePopup, setActivePopup] = useState<string | null>(null); // Track active popup
  const [editingTaskId, setEditingTaskId] = useState<string | null>(null);
  const [editValue, setEditValue] = useState<string>('');

  useEffect(() => {
    if (response.isSuccess) {
      setTasks(response.data.data);
    }
  }, [response.data, response.isSuccess]);

  const addTask = async () => {
    if (newTask.trim()) {
      try {
        await addTodo({ todo: newTask }).unwrap();
      } catch (error) {
        console.error('Failed to add task:', error);
      }
      setNewTask('');
    }
  };

  const handleCompleteTodo = async (id: string) => {
    try {
      await completeTodo({ id }).unwrap();
    } catch (error) {
      console.error('Failed to complete the task:', error);
    }
  };

  const handleDeleteTodo = async (id: string) => {
    try {
      await deleteTodo({ id }).unwrap();
    } catch (error) {
      console.error('Failed to delete the task:', error);
    }
  };

  const handleEditTodo = async (id: string, newTodo: string) => {
    try {
      await editTodo({ id, todo: newTodo }).unwrap();
    } catch (error) {
      console.error('Failed to edit the task:', error);
    }
  };

  const handleKeyDown = async (e: React.KeyboardEvent, taskId: string) => {
    if (e.key === 'Enter') {
      await handleEditTodo(taskId, editValue);
      setEditingTaskId(null);
    } else if (e.key === 'Escape') {
      setEditingTaskId(null);
    }
  };

  return (
    <div className="element-dashboard row-span-2">
      <h2 className="font-bold text-lg text-primary-950 flex items-center gap-5 mb-2 mt-1">
        Quick tasks list <ChartColumn className="size-4" />
      </h2>
      <div className="w-full h-36 overflow-auto">
        {(tasks || []).length > 0 ? (
          <ul className="space-y-1 ">
            {tasks.map((task) => (
              <li
                key={task._id}
                className={`flex items-center justify-between px-2   ${
                  task.isCompleted ? 'bg-primary-100' : ''
                }`}
              >
                <div className="flex items-center">
                  <input
                    type="checkbox"
                    checked={task.isCompleted}
                    onChange={() => handleCompleteTodo(task._id)}
                    className="mr-2"
                  />
                  {editingTaskId === task._id ? (
                    <input
                      type="text"
                      value={editValue}
                      onChange={(e) => setEditValue(e.target.value)}
                      onKeyDown={(e) => handleKeyDown(e, task._id)}
                      className="p-1 border rounded"
                    />
                  ) : (
                    <span
                      className={`text-nowrap max-w-[10vw] overflow-hidden text-ellipsis text-primary-800 ${
                        task.isCompleted ? 'line-through text-gray-500' : ''
                      }`}
                    >
                      {task.todo}
                    </span>
                  )}
                </div>
                <div className="relative">
                  <button
                    type="button"
                    className="flex items-center justify-center size-8 bg-transparent border-none cursor-pointer"
                    onClick={() =>
                      setActivePopup(activePopup === task._id ? null : task._id)
                    }
                  >
                    <MoreVertical className="size-4" />
                  </button>
                  {activePopup === task._id && (
                    <div className="absolute right-0 mt-2 w-32 bg-white border rounded shadow-lg z-10">
                      <button
                        type="button"
                        className="block w-full px-4 py-2 text-left hover:bg-gray-100"
                        onClick={() => {
                          setEditingTaskId(task._id);
                          setEditValue(task.todo);
                          setActivePopup(null);
                        }}
                      >
                        Edit
                      </button>
                      <button
                        type="button"
                        className="block w-full px-4 py-2 text-left hover:bg-gray-100 text-red-500"
                        onClick={() => {
                          handleDeleteTodo(task._id);
                          setActivePopup(null);
                        }}
                      >
                        Remove
                      </button>
                    </div>
                  )}
                </div>
              </li>
            ))}
          </ul>
        ) : (
          <p className="text-center text-slate-500">No todo today</p>
        )}
      </div>
      <div className=" flex items-center border px-1 bg-primary-100 rounded-lg">
        <input
          type="text"
          placeholder="Add new..."
          value={newTask}
          onChange={(e) => setNewTask(e.target.value)}
          className="p-2  rounded grow bg-primary-100 text-primary-950"
        />
        <button
          type="button"
          onClick={addTask}
          className="ml-2  text-white bg-primary-500 hover:bg-primary-300 rounded-lg"
        >
          <Plus className="size-5" />
        </button>
      </div>
    </div>
  );
};

export default QuickTasksList;
