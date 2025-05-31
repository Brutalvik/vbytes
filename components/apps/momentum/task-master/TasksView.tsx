import React, { useRef, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPenToSquare, faTrash } from "@fortawesome/free-solid-svg-icons";
import { doc, updateDoc } from "firebase/firestore";
import { Task, TasksViewProps } from "./types";

const TasksView: React.FC<TasksViewProps> = ({
  tasks,
  temporaryTasks,
  currentUser,
  onAddTask,
  onToggleComplete,
  onDeleteTask,
  themeClasses,
  dbInstance,
  getUserTasksCollectionPath,
  showToast,
}) => {
  const containerRef = useRef(null);
  const [newTaskTitle, setNewTaskTitle] = useState("");
  const [newTaskDueDate, setNewTaskDueDate] = useState("");
  const [isExpanded, setIsExpanded] = useState(false);

  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [editTaskId, setEditTaskId] = useState<string | null>(null);
  const [editTitle, setEditTitle] = useState("");
  const [editDueDate, setEditDueDate] = useState("");

  const allTasksToDisplay = currentUser ? tasks : temporaryTasks;

  const handleAdd = () => {
    if (!newTaskTitle.trim()) return;
    onAddTask(newTaskTitle.trim(), newTaskDueDate);
    setNewTaskTitle("");
    setNewTaskDueDate("");
    setIsExpanded(false);
  };

  const handleEditTask = (taskId: string, currentTitle: string, currentDueDate: string | null) => {
    setEditTaskId(taskId);
    setEditTitle(currentTitle);
    setEditDueDate(currentDueDate?.split("T")[0] || "");
    setIsEditModalOpen(true);
  };

  const handleUpdateTask = async () => {
    if (!editTitle.trim()) {
      showToast("Title cannot be empty.", "error");
      return;
    }
    if (!currentUser || !dbInstance || !editTaskId) return;
    const tasksPath = getUserTasksCollectionPath(currentUser.uid);
    const taskRef = doc(dbInstance, tasksPath, editTaskId);
    try {
      await updateDoc(taskRef, {
        title: editTitle.trim(),
        dueDate: editDueDate || null,
      });
      showToast("Task updated!", "success");
      setIsEditModalOpen(false);
      setEditTaskId(null);
    } catch (err) {
      console.error("Update failed:", err);
      showToast("Failed to update task.", "error");
    }
  };

  return (
    <div className="w-full h-full flex flex-col relative overflow-hidden">
      <div className="flex-1 overflow-y-auto hide-scroll pr-1 space-y-3 pb-36">
        {allTasksToDisplay.map((task) => (
          <div
            key={`task-${task.id}`}
            className={`task-item flex items-center justify-between p-3 rounded-lg shadow ${themeClasses.card} ${"completed" in task && task.completed ? "completed opacity-60" : ""} ${!currentUser ? "opacity-70" : ""}`}
          >
            <div className="flex items-center flex-grow min-w-0">
              {currentUser && (
                <input
                  type="checkbox"
                  checked={!!(task as Task).completed}
                  onChange={(e) => onToggleComplete(task.id, e.target.checked)}
                  className="form-checkbox h-5 w-5 text-blue-600 rounded border-gray-300 focus:ring-blue-500 mr-3 flex-shrink-0"
                />
              )}
              <span
                className={`task-title ${themeClasses.text} ${"completed" in task && task.completed ? "line-through" : ""} truncate`}
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
                    onClick={() => handleEditTask(task.id, task.title, task.dueDate)}
                    className="ml-2 text-blue-500 hover:text-blue-700"
                  >
                    <FontAwesomeIcon icon={faPenToSquare} />
                  </button>
                  <button
                    onClick={() => onDeleteTask(task.id)}
                    className="text-red-500 hover:text-red-700 cursor-pointer"
                  >
                    <FontAwesomeIcon icon={faTrash} />
                  </button>
                </>
              )}
            </div>
          </div>
        ))}

        {allTasksToDisplay.length === 0 && (
          <p className={`${themeClasses.text} text-center opacity-70`}>
            {currentUser
              ? "No tasks yet. Add one below!"
              : "Add a task. Login or register to save."}
          </p>
        )}
      </div>

      <div ref={containerRef} className="absolute inset-0 z-10 pointer-events-none">
        <motion.button
          drag
          dragConstraints={containerRef}
          dragElastic={0}
          dragMomentum={false}
          className="absolute bottom-20 right-4 w-14 h-14 bg-blue-600 hover:bg-blue-700 text-white rounded-full shadow-lg flex items-center justify-center text-3xl z-20 pointer-events-auto"
          onClick={() => setIsExpanded((prev) => !prev)}
        >
          {isExpanded ? "–" : "+"}
        </motion.button>
      </div>

      <AnimatePresence>
        {isExpanded && (
          <motion.div
            initial={{ scale: 0, opacity: 0, originX: 1, originY: 1 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0, opacity: 0 }}
            transition={{ type: "spring", stiffness: 400, damping: 20 }}
            className={`absolute bottom-36 right-4 left-4 sm:left-auto sm:right-4 sm:w-[calc(100%-2rem)] p-4 rounded-2xl ${themeClasses.bg} border border-gray-600 shadow-2xl z-10`}
          >
            <div className="flex flex-col gap-3">
              <input
                type="text"
                value={newTaskTitle}
                onChange={(e) => setNewTaskTitle(e.target.value)}
                placeholder="New task..."
                className="h-10 w-full p-2 rounded-md border border-gray-600 bg-white text-black focus:ring-2 focus:ring-blue-500 outline-none"
              />
              <input
                type="date"
                value={newTaskDueDate}
                onChange={(e) => setNewTaskDueDate(e.target.value)}
                className="h-10 w-full p-2 rounded-md border border-gray-600 bg-white text-black focus:ring-2 focus:ring-blue-500 outline-none"
              />
              <button
                onClick={handleAdd}
                className="h-10 w-full rounded-md border border-gray-600 bg-blue-600 text-white font-semibold hover:bg-blue-700"
              >
                + Add Task
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {isEditModalOpen && (
        <div className="absolute inset-0 z-50 flex items-center">
          <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-lg max-w-sm w-full">
            <h2 className="text-lg font-semibold mb-4 text-gray-900 dark:text-gray-100">
              Edit Task
            </h2>
            <input
              type="text"
              value={editTitle}
              onChange={(e) => setEditTitle(e.target.value)}
              placeholder="Task Title"
              className="mb-3 w-full p-2 border border-gray-300 rounded focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
            />
            <input
              type="date"
              value={editDueDate}
              onChange={(e) => setEditDueDate(e.target.value)}
              className="mb-4 w-full p-2 border border-gray-300 rounded focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
            />
            <div className="flex justify-end gap-2">
              <button
                onClick={() => {
                  setIsEditModalOpen(false);
                  setEditTaskId(null);
                }}
                className="px-4 py-2 rounded bg-gray-300 hover:bg-gray-400 text-gray-800"
              >
                Cancel
              </button>
              <button
                onClick={handleUpdateTask}
                className="px-4 py-2 rounded bg-blue-600 hover:bg-blue-700 text-white"
              >
                Update
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default TasksView;
