import { useState, useEffect } from "react";

interface Task {
  id: number;
  text: string;
  completed: boolean;
  createdAt: string;
}

function App() {
  const [taskInput, setTaskInput] = useState("");
  const [tasks, setTasks] = useState<Task[]>([]);
  const [editingTaskId, setEditingTaskId] = useState<number | null>(null);
  const [editingText, setEditingText] = useState("");

  const [newTaskId, setNewTaskId] = useState<number | null>(null);
  const [deletingTaskId, setDeletingTaskId] = useState<number | null>(null);

  useEffect(() => {
    const savedTasks = localStorage.getItem("todolist-tasks");
    if (savedTasks) {
      try {
        const parsedTasks = JSON.parse(savedTasks).map((task: unknown) => ({
          ...(task as Task),
          createdAt: new Date((task as Task).createdAt).toISOString(),
        }));
        setTasks(parsedTasks);
      } catch (error) {
        console.error("Error loading tasks from localStorage:", error);
      }
    }
  }, []);

  useEffect(() => {
    if (tasks.length > 0) {
      localStorage.setItem("todolist-tasks", JSON.stringify(tasks));
    } else {
      localStorage.removeItem("todolist-tasks");
    }
  }, [tasks]);

  const handleAddTask = () => {
    if (taskInput.trim() !== "") {
      const taskId = Date.now();
      const newTask: Task = {
        id: taskId,
        text: taskInput.trim(),
        completed: false,
        createdAt: new Date().toISOString(),
      };

      setNewTaskId(taskId);

      setTasks((prevTasks) => [...prevTasks, newTask]);
      setTaskInput("");

      setTimeout(() => setNewTaskId(null), 500);
    }
  };

  const toggleTask = (taskId: number) => {
    setTasks((prevTasks) =>
      prevTasks.map((task) =>
        task.id === taskId ? { ...task, completed: !task.completed } : task
      )
    );
  };

  const deleteTask = (taskId: number) => {
    setDeletingTaskId(taskId);

    setTimeout(() => {
      setTasks((prevTasks) => prevTasks.filter((task) => task.id !== taskId));
      setDeletingTaskId(null);
    }, 300);
  };

  const startEditing = (taskId: number, currentText: string) => {
    setEditingTaskId(taskId);
    setEditingText(currentText);
  };

  const cancelEditing = () => {
    setEditingTaskId(null);
    setEditingText("");
  };

  const saveEdit = () => {
    if (editingText.trim() && editingTaskId !== null) {
      setTasks((prevTasks) =>
        prevTasks.map((task) =>
          task.id === editingTaskId
            ? { ...task, text: editingText.trim() }
            : task
        )
      );
      setEditingTaskId(null);
      setEditingText("");
    }
  };

  const handleEditKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      saveEdit();
    } else if (e.key === "Escape") {
      cancelEditing();
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      handleAddTask();
    }
  };

  return (
    <div className="min-h-screen bg-white py-8">
      <div className="max-w-md md:max-w-2xl mx-auto px-8">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-800 mb-2 text-start">
            Lista de Tareas
          </h1>
          <p className="text-sm text-gray-500 text-start">
            {tasks.length === 0
              ? "No hay tareas"
              : `${
                  tasks.filter((task) => !task.completed).length
                } pendientes de ${tasks.length} total`}
          </p>
        </div>

        <div className="mb-6">
          <div className="flex items-center gap-2">
            <div className="flex-1 relative">
              <input
                type="text"
                value={taskInput}
                onChange={(e) => setTaskInput(e.target.value)}
                onKeyPress={handleKeyPress}
                placeholder="Añadir nueva tarea..."
                className="placeholder:text-sm text-sm w-full px-1 py-2 text-gray-700 bg-transparent border-0 border-b-2 border-gray-300 focus:border-gray-500 focus:outline-none transition-colors duration-300 placeholder-gray-400"
              />
            </div>

            <button
              onClick={handleAddTask}
              className="size-8 bg-gray-500 hover:bg-gray-600 text-white rounded-sm flex items-center justify-center transition-colors duration-200"
            >
              <svg
                className="size-4 "
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 4v16m8-8H4"
                />
              </svg>
            </button>
          </div>
        </div>

        <div className="space-y-3">
          {tasks.map((task) => (
            <div
              key={task.id}
              className={`bg-white rounded-lg shadow-sm border border-gray-200 p-4 transition-all duration-300 hover:shadow-md ${
                newTaskId === task.id ? "animate-fade-in-down" : ""
              } ${
                deletingTaskId === task.id
                  ? "animate-fade-out opacity-0 transform translate-y-4 scale-95"
                  : ""
              }`}
            >
              <div className="flex items-center gap-3">
                <button
                  onClick={() => toggleTask(task.id)}
                  className={`size-4 rounded-full border-2 flex items-center justify-center transition-colors duration-200 ${
                    task.completed
                      ? "bg-gray-500 border-gray-500 text-white"
                      : "border-gray-300 hover:border-gray-400"
                  }`}
                >
                  {task.completed && (
                    <svg
                      className="w-3 h-3"
                      fill="currentColor"
                      viewBox="0 0 20 20"
                    >
                      <path
                        fillRule="evenodd"
                        d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                        clipRule="evenodd"
                      />
                    </svg>
                  )}
                </button>

                <div className="flex-1">
                  {editingTaskId === task.id ? (
                    <div className="flex items-center gap-2">
                      <input
                        type="text"
                        value={editingText}
                        onChange={(e) => setEditingText(e.target.value)}
                        onKeyPress={handleEditKeyPress}
                        onBlur={saveEdit}
                        autoFocus
                        className="flex-1 px-2 py-1 text-gray-800 bg-gray-50 border border-gray-300 rounded focus:outline-none  transition-colors duration-200 text-sm"
                      />
                    </div>
                  ) : (
                    <span
                      className={`block text-sm transition-all duration-200 ${
                        task.completed
                          ? "text-gray-500 line-through"
                          : "text-gray-800"
                      }`}
                    >
                      {task.text}
                    </span>
                  )}
                </div>

                <div className="flex items-center gap-1">
                  {editingTaskId === task.id ? (
                    <>
                      <button
                        onClick={saveEdit}
                        className="w-8 h-8 text-green-600 hover:bg-green-50 rounded-full flex items-center justify-center transition-colors duration-200"
                        title="Guardar"
                      >
                        <svg
                          className="w-4 h-4"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M5 13l4 4L19 7"
                          />
                        </svg>
                      </button>
                      <button
                        onClick={cancelEditing}
                        className="w-8 h-8 text-gray-500 hover:bg-gray-50 rounded-full flex items-center justify-center transition-colors duration-200"
                        title="Cancelar"
                      >
                        <svg
                          className="w-4 h-4"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M6 18L18 6M6 6l12 12"
                          />
                        </svg>
                      </button>
                    </>
                  ) : (
                    <>
                      <button
                        onClick={() => startEditing(task.id, task.text)}
                        disabled={task.completed}
                        className={`size-7 rounded-full flex items-center justify-center transition-colors duration-200 ${
                          task.completed
                            ? "text-gray-400 cursor-not-allowed"
                            : "text-gray-600 bg-gray-100 hover:bg-gray-200"
                        }`}
                        title="Editar"
                      >
                        <svg
                          className="size-4"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"
                          />
                        </svg>
                      </button>
                      <button
                        onClick={() => deleteTask(task.id)}
                        className="size-7 text-red-600 bg-red-100 hover:bg-red-200 rounded-full flex items-center justify-center transition-colors duration-200"
                        title="Eliminar"
                      >
                        <svg
                          className="size-4"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                          />
                        </svg>
                      </button>
                    </>
                  )}
                </div>
              </div>
            </div>
          ))}

          {tasks.length === 0 && (
            <div className="text-center py-12 text-gray-500">
              <div className="text-6xl mb-4">📝</div>
              <p className="text-lg">No hay tareas aún</p>
              <p className="text-sm">¡Agrega tu primera tarea con emojis!</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default App;
