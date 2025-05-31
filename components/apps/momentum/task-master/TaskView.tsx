"use client";

import React, { useState } from "react";

interface Task {
  id: string;
  title: string;
  dueDate?: string;
  completed?: boolean;
}

interface TasksViewProps {
  tasks: Task[];
  temporaryTasks: Task[];
  currentUser: boolean;
  onAddTask: (title: string, dueDate: string) => void;
  onToggleComplete: (id: string, completed: boolean) => void;
  onEditTask: (id: string, title: string, dueDate?: string) => void;
  onDeleteTask: (id: string) => void;
  themeClasses: {
    card: string;
    text: string;
    bg: string;
    border: string;
    input: string;
    inputText: string;
    btnPrimary: string;
  };
}

const TasksView: React.FC<TasksViewProps> = ({
  tasks,
  temporaryTasks,
  currentUser,
  onAddTask,
  onToggleComplete,
  onEditTask,
  onDeleteTask,
  themeClasses,
}) => {
  const [newTaskTitle, setNewTaskTitle] = useState("");
  const [newTaskDueDate, setNewTaskDueDate] = useState("");

  const handleAdd = () => {
    if (newTaskTitle.trim() === "") return;
    onAddTask(newTaskTitle.trim(), newTaskDueDate);
    setNewTaskTitle("");
    setNewTaskDueDate("");
  };

  const allTasksToDisplay = currentUser ? tasks : temporaryTasks;

  return (
    <div className="w-full max-w-full relative pb-24 space-y-3">
      {/* 
        pb-24: leave bottom padding so that the absolute “Add” bar 
        (height ~ 3rem) does not cover up the last task. 
      */}
      {allTasksToDisplay.map((task) => (
        <div
          key={task.id}
          id={`task-${task.id}`}
          className={`
            task-item 
            flex items-center justify-between 
            p-3 rounded-lg shadow 
            ${themeClasses.card} 
            ${"completed" in task && task.completed ? "opacity-60" : ""}
            ${!currentUser ? "opacity-70" : ""}
          `}
        >
          <div className="flex items-center flex-grow min-w-0">
            {/* If user is logged in, show checkbox; otherwise hide */}
            {currentUser && (
              <input
                type="checkbox"
                checked={!!task.completed}
                onChange={(e) => onToggleComplete(task.id, e.target.checked)}
                className="
                  form-checkbox 
                  h-5 w-5 text-blue-600 
                  rounded border-gray-300 
                  focus:ring-blue-500 
                  mr-3 flex-shrink-0
                "
              />
            )}
            <span
              className={`
                task-title 
                ${themeClasses.text} 
                ${"completed" in task && task.completed ? "line-through" : ""} 
                truncate
              `}
            >
              {task.title} {!currentUser && "(Unsaved)"}
            </span>
          </div>

          <div className="flex items-center space-x-2 flex-shrink-0 ml-2">
            {task.dueDate && (
              <span className={`text-xs ${themeClasses.text} opacity-70`}>
                {new Date(task.dueDate + "T00:00:00").toLocaleDateString("en-CA", {
                  month: "short",
                  day: "numeric",
                })}
              </span>
            )}

            {currentUser && (
              <>
                <button
                  onClick={() => onEditTask(task.id, task.title, task.dueDate)}
                  className="
                    text-blue-500 hover:text-blue-700 
                    dark:text-blue-400 dark:hover:text-blue-300
                  "
                >
                  <i className="fas fa-edit"></i>
                </button>
                <button
                  onClick={() => onDeleteTask(task.id)}
                  className="
                    text-red-500 hover:text-red-700 
                    dark:text-red-400 dark:hover:text-red-300
                  "
                >
                  <i className="fas fa-trash"></i>
                </button>
              </>
            )}
          </div>
        </div>
      ))}

      {allTasksToDisplay.length === 0 && (
        <p className={`${themeClasses.text} text-center opacity-70`}>
          {currentUser ? "No tasks yet. Add one below!" : "Add a task. Login or register to save."}
        </p>
      )}

      {/* 
        Use absolute positioning so this bar stays inside the iPhone screen.
        It’s at bottom:0 of the parent (<div className="relative"> above).
      */}
      <div
        className={`
          absolute bottom-0 left-0 right-0 
          px-3 py-2 
          ${themeClasses.bg} border-t ${themeClasses.border} 
          z-10
        `}
      >
        <div className="flex flex-wrap gap-2">
          <input
            type="text"
            value={newTaskTitle}
            onChange={(e) => setNewTaskTitle(e.target.value)}
            placeholder="New task..."
            className={`
              flex-grow 
              p-3 
              rounded-lg border 
              ${themeClasses.input} ${themeClasses.inputText} 
              focus:ring-2 focus:ring-blue-500 outline-none 
              max-w-full
            `}
          />
          <input
            type="date"
            value={newTaskDueDate}
            onChange={(e) => setNewTaskDueDate(e.target.value)}
            className={`
              p-3 
              rounded-lg border 
              ${themeClasses.input} ${themeClasses.inputText} 
              focus:ring-2 focus:ring-blue-500 outline-none 
              w-auto max-w-full
            `}
            title="Due Date"
          />
          <button
            onClick={handleAdd}
            className={`
              p-3 rounded-lg 
              ${themeClasses.btnPrimary} font-semibold 
              hover:opacity-90 
              w-auto 
              max-w-full
            `}
          >
            <i className="fas fa-plus"></i> Add
          </button>
        </div>
      </div>
    </div>
  );
};

export default TasksView;
