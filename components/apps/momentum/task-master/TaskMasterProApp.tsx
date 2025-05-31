"use client"

import React, { useState, useEffect, useCallback, useMemo } from "react";
import { initializeApp } from "firebase/app";
import {
  getAuth,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  // signInWithPopup, GoogleAuthProvider, FacebookAuthProvider, 
  signOut,
  onAuthStateChanged,
  signInAnonymously,
  signInWithCustomToken,
} from "firebase/auth";
import {
  getFirestore,
  collection,
  addDoc,
  doc,
  deleteDoc,
  query,
  where,
  onSnapshot,
  serverTimestamp,
  updateDoc,
  setLogLevel, // For debugging Firestore
} from "firebase/firestore";
import { motion, AnimatePresence } from "framer-motion";

// --- Main App Component ---
interface TaskMasterProAppProps {
  firebaseConfig: object;
  appId: string;
  initialAuthToken?: string;
}

const TaskMasterProApp: React.FC<TaskMasterProAppProps> = ({
  firebaseConfig,
  appId,
  initialAuthToken,
}) => {
  // --- Firebase State ---
  const [authInstance, setAuthInstance] = useState<ReturnType<typeof getAuth> | null>(null);
  const [dbInstance, setDbInstance] = useState<ReturnType<typeof getFirestore> | null>(null);
  const [isFirebaseReady, setIsFirebaseReady] = useState(false);

  // --- App State ---
  const [currentUser, setCurrentUser] = useState<import("firebase/auth").User | null>(null);
  const [currentTheme, setCurrentTheme] = useState("light"); // 'light' or 'dark'
  const [currentView, setCurrentView] = useState("login"); // 'login', 'register', 'tasks', 'calendar', 'settings'
  interface Task {
    id: string;
    title: string;
    dueDate: string | null;
    completed?: boolean;
    createdAt?: any;
    [key: string]: any;
  }
  const [tasks, setTasks] = useState<Task[]>([]);
  const [unsubscribeTasks, setUnsubscribeTasks] = useState<(() => void) | null>(null);
  const [selectedDate, setSelectedDate] = useState(new Date());
  interface TempTask {
    id: string;
    title: string;
    dueDate: string | null;
  }
  const [temporaryTasks, setTemporaryTasks] = useState<TempTask[]>([]);
  const [isLoading, setIsLoading] = useState(true); // For initial auth check and loading
  const [modal, setModal] = useState<{
    isOpen: boolean;
    title: string;
    message: string;
    onConfirm: (() => void) | null;
    onCancel: (() => void) | null;
    confirmText: string;
    cancelText: string;
  }>({
    isOpen: false,
    title: "",
    message: "",
    onConfirm: null,
    onCancel: null,
    confirmText: "OK",
    cancelText: "Cancel",
  });
  const [toast, setToast] = useState({ isVisible: false, message: "", type: "success" });
  const [isAuthCheckComplete, setIsAuthCheckComplete] = useState(false);

  // --- Custom Theme Classes ---
  const themeClasses = useMemo(
    () =>
      currentTheme === "dark"
        ? {
            bg: "app-bg-dark",
            text: "app-text-dark",
            inputText: "text-white",
            input: "app-input-dark",
            btnPrimary: "app-button-primary-dark",
            btnSecondary: "app-button-secondary-dark",
            border: "app-border-dark",
            card: "app-card-dark",
          }
        : {
            bg: "app-bg-light",
            text: "app-text-light",
            inputText: "text-gray-900",
            input: "app-input-light",
            btnPrimary: "app-button-primary-light",
            btnSecondary: "app-button-secondary-light",
            border: "app-border-light",
            card: "app-card-light",
          },
    [currentTheme]
  );

  // --- Initialize Firebase and Auth Listener ---
  useEffect(() => {
    if (firebaseConfig && appId) {
      try {
        const app = initializeApp(firebaseConfig);
        const auth = getAuth(app);
        const db = getFirestore(app);
        setLogLevel("debug"); // Optional: for Firestore debugging

        setAuthInstance(auth);
        setDbInstance(db);
        setIsFirebaseReady(true);
        console.log("Firebase initialized.");

        const attemptSignIn = async () => {
          try {
            if (initialAuthToken) {
              console.log("Attempting sign in with custom token...");
              await signInWithCustomToken(auth, initialAuthToken);
              console.log("Successfully signed in with custom token.");
            } else {
              console.log(
                "No custom token, onAuthStateChanged will handle existing session or no user."
              );
            }
          } catch (error) {
            console.error("Error during initial custom token sign in:", error);
          } finally {
            // Regardless of custom token outcome, let onAuthStateChanged establish final user state
          }
        };

        attemptSignIn(); // Attempt sign-in before setting up the main listener

        const unsubscribeAuth = onAuthStateChanged(auth, async (user) => {
          setIsLoading(true);
          if (user) {
            setCurrentUser(user);
            console.log("User logged in (onAuthStateChanged):", user.uid, user.email);
            if (temporaryTasks.length > 0) {
              setModal({
                isOpen: true,
                title: "Save Pending Tasks?",
                message: `You have ${temporaryTasks.length} task(s) created before logging in. Save them?`,
                onConfirm: async () => {
                  for (const task of temporaryTasks) {
                    await addTaskToFirestore(task.title, task.dueDate, user, db);
                  }
                  setTemporaryTasks([]);
                  showToast("Pending tasks saved!");
                },
                onCancel: () => {
                  setTemporaryTasks([]);
                  showToast("Pending tasks discarded.", "error");
                },
                confirmText: "Save",
                cancelText: "Discard",
              });
            }
            setCurrentView("tasks"); // Default view after login
            // fetchTasks will be called by the useEffect that depends on currentUser and dbInstance
          } else {
            setCurrentUser(null);
            console.log("User logged out or not authenticated (onAuthStateChanged).");
            if (unsubscribeTasks) unsubscribeTasks(); // Call the function to unsubscribe
            setTasks([]);
            if (["tasks", "calendar", "settings"].includes(currentView)) {
              setCurrentView("login");
            }
          }
          setIsLoading(false);
          setIsAuthCheckComplete(true); // Mark auth check as complete
        });

        return () => {
          console.log("Cleaning up auth listener.");
          unsubscribeAuth();
          if (unsubscribeTasks) unsubscribeTasks(); // Also cleanup task listener here
        };
      } catch (error) {
        console.error("Firebase Initialization Error:", error);
        setIsLoading(false);
        setIsAuthCheckComplete(true);
        showToast("Error initializing Task App. Check console.", "error");
      }
    } else {
      console.warn("Firebase config or App ID is missing.");
      setIsLoading(false);
      setIsAuthCheckComplete(true);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [firebaseConfig, appId, initialAuthToken]); // initialAuthToken dependency added

  // --- Firestore Path Helper ---
  const getUserTasksCollectionPath = useCallback(
    (userId: string) => {
      if (!appId || !userId) {
        console.error("appId or userId missing for task path");
        return null;
      }
      return `artifacts/${appId}/users/${userId}/tasks`;
    },
    [appId]
  );

  // --- Fetch Tasks ---
  useEffect(() => {
    if (currentUser && dbInstance && isAuthCheckComplete) {
      setIsLoading(true);
      const tasksCollectionPath = getUserTasksCollectionPath(currentUser.uid);
      if (!tasksCollectionPath) {
        setIsLoading(false);
        return;
      }

      const q = query(collection(dbInstance, tasksCollectionPath));

      const unsubscribe = onSnapshot(
        q,
        (querySnapshot) => {
          let fetchedTasks: any[] = [];
          querySnapshot.forEach((doc) => {
            fetchedTasks.push({ id: doc.id, ...doc.data() });
          });
          fetchedTasks.sort((a, b) => {
            if (a.completed !== b.completed) return a.completed ? 1 : -1;
            const dateA = a.createdAt?.toDate ? a.createdAt.toDate() : new Date(0);
            const dateB = b.createdAt?.toDate ? b.createdAt.toDate() : new Date(0);
            return dateB - dateA;
          });
          setTasks(fetchedTasks);
          setIsLoading(false);
        },
        (error) => {
          console.error("Error fetching tasks:", error);
          showToast("Failed to load tasks: " + error.message, "error");
          setIsLoading(false);
        }
      );

      setUnsubscribeTasks(() => unsubscribe); // Store the unsubscribe function

      return () => {
        console.log("Cleaning up tasks listener.");
        unsubscribe(); // Unsubscribe on cleanup
      };
    } else if (!currentUser && isAuthCheckComplete) {
      setIsLoading(false); // Not logged in, stop loading
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentUser, dbInstance, getUserTasksCollectionPath, isAuthCheckComplete]);

  // --- Theme Toggle ---
  const toggleTheme = () => {
    setCurrentTheme((prev) => (prev === "light" ? "dark" : "light"));
  };

  // --- Toast Notification ---
  const showToast = (message: string, type = "success", duration = 3000) => {
    setToast({ isVisible: true, message, type });
    setTimeout(() => {
      setToast({ isVisible: false, message: "", type: "success" });
    }, duration);
  };

  // --- Add Task to Firestore (modified to accept user and db) ---
  const addTaskToFirestore = async (
    title: string,
    dueDate: string | null,
    user: import("firebase/auth").User | null,
    db: ReturnType<typeof getFirestore> | null
  ) => {
    if (!user) {
      showToast("You must be logged in to save tasks.", "error");
      return false;
    }
    if (!title.trim()) {
      showToast("Task title cannot be empty.", "error");
      return false;
    }
    const tasksPath = getUserTasksCollectionPath(user.uid);
    if (!tasksPath) {
      showToast("Error: Could not determine task storage location.", "error");
      return false;
    }
    if (!db) {
      showToast("Database connection not available.", "error");
      return false;
    }
    try {
      await addDoc(collection(db, tasksPath), {
        title: title.trim(),
        dueDate: dueDate || null,
        completed: false,
        createdAt: serverTimestamp(),
      });
      showToast("Task added!", "success");
      return true;
    } catch (error) {
      console.error("Error adding task:", error);
      showToast(
        "Failed to add task: " + (error instanceof Error ? error.message : String(error)),
        "error"
      );
      return false;
    }
  };

  // --- Auth Handlers ---
  const handleRegister = async (email: string, password: string, confirmPassword: string) => {
    if (password !== confirmPassword) {
      showToast("Passwords do not match.", "error");
      return;
    }
    if (!authInstance) {
      showToast("Auth service not ready.", "error");
      return;
    }
    setIsLoading(true);
    try {
      await createUserWithEmailAndPassword(authInstance, email, password);
      showToast("Registration successful!", "success");
      // onAuthStateChanged will handle view update
    } catch (error) {
      console.error("Registration error:", error);
      showToast(error instanceof Error ? error.message : String(error), "error");
    } finally {
      setIsLoading(false);
    }
  };

  const handleLogin = async (email: string, password: string) => {
    if (!authInstance) {
      showToast("Auth service not ready.", "error");
      return;
    }
    setIsLoading(true);
    try {
      await signInWithEmailAndPassword(authInstance, email, password);
      showToast("Login successful!", "success");
      // onAuthStateChanged will handle view update
    } catch (error) {
      console.error("Login error:", error);
      showToast(error instanceof Error ? error.message : String(error), "error");
    } finally {
      setIsLoading(false);
    }
  };

  const handleGoogleLogin = async () => {
    // const provider = new GoogleAuthProvider();
    // await signInWithPopup(authInstance, provider);
    showToast("Google Login (Simulated). Implement with signInWithPopup.", "info");
  };

  const handleFacebookLogin = async () => {
    // const provider = new FacebookAuthProvider();
    // await signInWithPopup(authInstance, provider);
    showToast("Facebook Login (Simulated). Implement with signInWithPopup.", "info");
  };

  const handleLogout = async () => {
    if (!authInstance) {
      showToast("Auth service not ready.", "error");
      return;
    }
    setIsLoading(true);
    try {
      await signOut(authInstance);
      showToast("Logged out successfully.", "success");
      // onAuthStateChanged handles UI update
    } catch (error) {
      console.error("Logout error:", error);
      showToast(error instanceof Error ? error.message : String(error), "error");
    } finally {
      setIsLoading(false);
    }
  };

  // --- Task Handlers ---
  const handleAddTask = async (title: string, dueDate: string | null) => {
    if (!title.trim()) {
      showToast("Task title cannot be empty.", "error");
      return;
    }
    if (!currentUser) {
      setTemporaryTasks((prev) => [
        ...prev,
        { title: title.trim(), dueDate: dueDate || null, id: `temp-${Date.now()}` },
      ]);
      showToast("Task added temporarily. Login to save.", "info");
      return;
    }
    await addTaskToFirestore(title, dueDate, currentUser, dbInstance);
  };

  interface HandleToggleTaskCompleteParams {
    taskId: string;
    isCompleted: boolean;
  }

  const handleToggleTaskComplete = async (taskId: string, isCompleted: boolean): Promise<void> => {
    if (!currentUser || !dbInstance) return;
    const tasksPath = getUserTasksCollectionPath(currentUser.uid);
    if (!tasksPath) return;
    const taskRef = doc(dbInstance, tasksPath, taskId);
    try {
      await updateDoc(taskRef, { completed: isCompleted });
      showToast(isCompleted ? "Task marked complete!" : "Task marked incomplete.", "success");
    } catch (error) {
      console.error("Error updating task:", error);
      showToast("Failed to update task.", "error");
    }
  };

  interface HandleEditTaskParams {
    taskId: string;
    currentTitle: string;
    currentDueDate: string | null;
  }

  const handleEditTask = async (
    taskId: string,
    currentTitle: string,
    currentDueDate: string | null
  ): Promise<void> => {
    if (!currentUser || !dbInstance) return;
    const tasksPath = getUserTasksCollectionPath(currentUser.uid);
    if (!tasksPath) return;

    // Using a modal for editing would be better than prompt in React
    const newTitle = prompt("Edit task title:", currentTitle);
    if (newTitle === null) return; // User cancelled

    const newDueDateRaw = prompt(
      "Edit due date (YYYY-MM-DD, leave blank for none):",
      currentDueDate ? currentDueDate.split("T")[0] : ""
    );
    if (newDueDateRaw === null) return; // User cancelled

    if (newTitle.trim() === "") {
      showToast("Title cannot be empty.", "error");
      return;
    }

    const taskRef = doc(dbInstance, tasksPath, taskId);
    try {
      await updateDoc(taskRef, {
        title: newTitle.trim(),
        dueDate: newDueDateRaw ? newDueDateRaw : null,
      });
      showToast("Task updated!", "success");
    } catch (error) {
      console.error("Error updating task:", error);
      showToast("Failed to update task.", "error");
    }
  };

  interface HandleDeleteTaskParams {
    taskId: string;
  }

  const handleDeleteTask = (taskId: string): void => {
    if (!currentUser || !dbInstance) return;
    const tasksPath = getUserTasksCollectionPath(currentUser.uid);
    if (!tasksPath) return;

    setModal({
      isOpen: true,
      title: "Confirm Delete",
      message: "Are you sure you want to delete this task?",
      onConfirm: async (): Promise<void> => {
        const taskRef = doc(dbInstance, tasksPath, taskId);
        try {
          await deleteDoc(taskRef);
          showToast("Task deleted!", "success");
        } catch (error) {
          console.error("Error deleting task:", error);
          showToast("Failed to delete task.", "error");
        }
      },
      onCancel: null,
      confirmText: "Delete",
      cancelText: "Cancel",
    });
  };

  // --- Modal Component ---
  const Modal = () => {
    if (!modal.isOpen) return null;
    return (
      <div className="modal-overlay">
        <div
          className={`modal-content ${themeClasses.card} ${themeClasses.text} p-6 rounded-xl shadow-2xl w-11/12 max-w-sm`}
        >
          <h3 className="text-xl font-semibold mb-4">{modal.title}</h3>
          <p className="mb-6 text-sm">{modal.message}</p>
          {isLoading && modal.title.toLowerCase().includes("loading") && (
            <div className="spinner mx-auto my-4"></div>
          )}
          <div className="flex justify-end space-x-3">
            {modal.onCancel && (
              <button
                onClick={() => {
                  if (modal.onCancel) {
                    modal.onCancel();
                  }
                  setModal({
                    isOpen: false,
                    title: "",
                    message: "",
                    onConfirm: null,
                    onCancel: null,
                    confirmText: "OK",
                    cancelText: "Cancel",
                  });
                }}
                className={`px-4 py-2 rounded-lg ${themeClasses.btnSecondary} font-medium`}
              >
                {modal.cancelText || "Cancel"}
              </button>
            )}
            {modal.onConfirm && (
              <button
                onClick={() => {
                  if (modal.onConfirm) {
                    modal.onConfirm();
                  }
                  setModal({
                    isOpen: false,
                    title: "",
                    message: "",
                    onConfirm: null,
                    onCancel: null,
                    confirmText: "OK",
                    cancelText: "Cancel",
                  });
                }}
                className={`px-4 py-2 rounded-lg ${themeClasses.btnPrimary} font-medium`}
              >
                {modal.confirmText || "OK"}
              </button>
            )}
          </div>
        </div>
      </div>
    );
  };

  // --- Toast Component ---
  const Toast = () => {
    if (!toast.isVisible) return null;

    let bgColor = "bg-green-500"; // default = success
    if (toast.type === "error") bgColor = "bg-red-500";
    if (toast.type === "info") bgColor = "bg-blue-500";

    return (
      <div
        className={`absolute bottom-20 left-4 right-4 z-50 p-3 rounded-lg text-white ${bgColor} shadow-lg transition-opacity duration-300 ${
          toast.isVisible ? "opacity-100" : "opacity-0"
        }`}
      >
        {toast.message}
      </div>
    );
  };

  // --- Render Logic ---
  const renderContent = () => {
    if (isLoading && !isAuthCheckComplete) {
      // Show initial loading spinner only before auth check is complete
      return (
        <div className="flex justify-center items-center h-full">
          <div className="spinner"></div>
          <p className={`${themeClasses.text} ml-2`}>Initializing App...</p>
        </div>
      );
    }

    if (currentView === "login" || currentView === "register") {
      return (
        <AuthScreen
          isLogin={currentView === "login"}
          onLogin={handleLogin}
          onRegister={handleRegister}
          onGoogleLogin={handleGoogleLogin}
          onFacebookLogin={handleFacebookLogin}
          switchToRegister={() => setCurrentView("register")}
          switchToLogin={() => setCurrentView("login")}
          themeClasses={themeClasses}
          isLoading={isLoading}
        />
      );
    }

    if (
      !currentUser &&
      (currentView === "tasks" || currentView === "calendar" || currentView === "settings")
    ) {
      // This case should ideally be handled by onAuthStateChanged redirecting to login.
      // If somehow reached, show loading or redirect.
      return (
        <div className="flex justify-center items-center h-full">
          <div className="spinner"></div>
          <p className={`${themeClasses.text} ml-2`}>Redirecting...</p>
        </div>
      );
    }

    if (currentUser) {
      return (
        <>
          <AppHeader
            themeClasses={themeClasses}
            currentTheme={currentTheme}
            toggleTheme={toggleTheme}
            currentUser={currentUser}
            showToast={showToast}
          />
          <div className="flex-grow overflow-y-auto p-4 space-y-4">
            {isLoading && <div className="spinner mx-auto my-2"></div>}
            {currentView === "tasks" && (
              <TasksView
                tasks={tasks}
                temporaryTasks={temporaryTasks}
                currentUser={currentUser}
                onAddTask={handleAddTask}
                onToggleComplete={handleToggleTaskComplete}
                onEditTask={handleEditTask}
                onDeleteTask={handleDeleteTask}
                themeClasses={themeClasses}
              />
            )}
            {currentView === "calendar" && (
              <CalendarView
                tasks={tasks}
                selectedDate={selectedDate}
                setSelectedDate={setSelectedDate}
                themeClasses={themeClasses}
              />
            )}
            {currentView === "settings" && (
              <SettingsView
                onLogout={handleLogout}
                currentTheme={currentTheme}
                toggleTheme={toggleTheme}
                themeClasses={themeClasses}
                currentUser={currentUser}
                appId={appId}
              />
            )}
          </div>
          <AppNavigation
            themeClasses={themeClasses}
            currentView={currentView}
            setCurrentView={setCurrentView}
          />
        </>
      );
    }
    // Fallback if no view matches (should not happen if logic is correct)
    return (
      <AuthScreen
        isLogin={true}
        onLogin={handleLogin}
        onRegister={handleRegister}
        onGoogleLogin={handleGoogleLogin}
        onFacebookLogin={handleFacebookLogin}
        switchToRegister={() => setCurrentView("register")}
        switchToLogin={() => setCurrentView("login")}
        themeClasses={themeClasses}
        isLoading={isLoading}
      />
    );
  };

  if (!isFirebaseReady && !firebaseConfig) {
    return (
      <div
        className={`flex flex-col h-full items-center justify-center p-4 ${themeClasses.bg} ${themeClasses.text}`}
      >
        <i className="fas fa-exclamation-triangle text-3xl text-red-500 mb-3"></i>
        <h2 className="text-xl font-semibold mb-2">Configuration Error</h2>
        <p className="text-center text-sm">
          Firebase configuration is missing. Please provide `firebaseConfig` and `appId` props to
          the TaskMasterProApp component.
        </p>
      </div>
    );
  }

  return (
    <div className={`flex flex-col h-full ${themeClasses.bg} ${themeClasses.text} relative`}>
      {renderContent()}
      <Modal />
      <Toast />
    </div>
  );
};

// --- Sub-Components ---

interface AppHeaderProps {
  themeClasses: {
    bg: string;
    text: string;
    inputText: string;
    input: string;
    btnPrimary: string;
    btnSecondary: string;
    border: string;
    card: string;
  };
  currentTheme: string;
  toggleTheme: () => void;
  currentUser: import("firebase/auth").User | null;
  showToast: (message: string, type?: string) => void;
}

const AppHeader: React.FC<AppHeaderProps> = ({
  themeClasses,
  currentTheme,
  toggleTheme,
  currentUser,
  showToast,
}) => (
  <div className={`p-4 flex justify-between items-center ${themeClasses.border} border-b`}>
    <h1 className={`text-xl font-semibold ${themeClasses.text}`}>TaskMaster</h1>
    <div>
      <button
        onClick={toggleTheme}
        className="p-2 rounded-md hover:bg-gray-200 dark:hover:bg-gray-700"
        aria-label="Toggle theme"
      >
        <i
          className={`fas ${currentTheme === "light" ? "fa-moon" : "fa-sun"} ${themeClasses.text}`}
        ></i>
      </button>
      {currentUser && (
        <button
          onClick={() => {
            navigator.clipboard
              .writeText(currentUser.uid)
              .then(() => showToast("User ID copied!"))
              .catch(() => showToast("Failed to copy UID.", "error"));
          }}
          className={`p-1 rounded-md text-xs ${themeClasses.text} ${currentTheme === "light" ? "bg-blue-100" : "bg-blue-800 bg-opacity-50"} ml-2`}
          title="Your User ID (click to copy)"
        >
          UID: {currentUser.uid.substring(0, 8)}...
        </button>
      )}
    </div>
  </div>
);

interface AppNavigationProps {
  themeClasses: {
    bg: string;
    text: string;
    inputText: string;
    input: string;
    btnPrimary: string;
    btnSecondary: string;
    border: string;
    card: string;
  };
  currentView: string;
  setCurrentView: (view: string) => void;
}

const AppNavigation: React.FC<AppNavigationProps> = ({
  themeClasses,
  currentView,
  setCurrentView,
}) => (
  <nav
    className={`p-2 flex justify-around ${themeClasses.border} border-t mt-auto sticky bottom-0 ${themeClasses.bg} z-10`}
  >
    <button
      onClick={() => setCurrentView("tasks")}
      className={`nav-btn p-2 rounded-md ${currentView === "tasks" ? themeClasses.btnPrimary : themeClasses.text} hover:opacity-80 w-1/3 text-center`}
    >
      <i className="fas fa-list-check fa-fw"></i> <span className="text-xs block">Tasks</span>
    </button>
    <button
      onClick={() => setCurrentView("calendar")}
      className={`nav-btn p-2 rounded-md ${currentView === "calendar" ? themeClasses.btnPrimary : themeClasses.text} hover:opacity-80 w-1/3 text-center`}
    >
      <i className="fas fa-calendar-alt fa-fw"></i> <span className="text-xs block">Calendar</span>
    </button>
    <button
      onClick={() => setCurrentView("settings")}
      className={`nav-btn p-2 rounded-md ${currentView === "settings" ? themeClasses.btnPrimary : themeClasses.text} hover:opacity-80 w-1/3 text-center`}
    >
      <i className="fas fa-cog fa-fw"></i> <span className="text-xs block">Settings</span>
    </button>
  </nav>
);

interface AuthScreenProps {
  isLogin: boolean;
  onLogin: (email: string, password: string) => void;
  onRegister: (email: string, password: string, confirmPassword: string) => void;
  onGoogleLogin: () => void;
  onFacebookLogin: () => void;
  switchToRegister: () => void;
  switchToLogin: () => void;
  themeClasses: {
    bg: string;
    text: string;
    inputText: string;
    input: string;
    btnPrimary: string;
    btnSecondary: string;
    border: string;
    card: string;
  };
  isLoading: boolean;
}

const AuthScreen: React.FC<AuthScreenProps> = ({
  isLogin,
  onLogin,
  onRegister,
  onGoogleLogin,
  onFacebookLogin,
  switchToRegister,
  switchToLogin,
  themeClasses,
  isLoading,
}) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  interface HandleSubmitEvent extends React.FormEvent<HTMLFormElement> {}

  const handleSubmit = (e: HandleSubmitEvent): void => {
    e.preventDefault();
    if (isLogin) {
      onLogin(email, password);
    } else {
      onRegister(email, password, confirmPassword);
    }
  };

  return (
    <div
      className={`flex flex-col justify-center items-center h-full p-6 space-y-5 ${themeClasses.bg}`}
    >
      <i
        className={`fas fa-check-circle text-5xl ${themeClasses.btnPrimary.split(" ")[0].replace("bg-", "text-")} mb-3`}
      ></i>
      <h2 className={`text-3xl font-bold ${themeClasses.text}`}>
        {isLogin ? "Welcome Back!" : "Create Account"}
      </h2>

      <form onSubmit={handleSubmit} className="w-full space-y-4">
        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="Email"
          required
          className={`w-full p-3 rounded-lg border ${themeClasses.input} ${themeClasses.inputText} focus:ring-2 focus:ring-blue-500 outline-none`}
        />
        <input
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder="Password"
          required
          className={`w-full p-3 rounded-lg border ${themeClasses.input} ${themeClasses.inputText} focus:ring-2 focus:ring-blue-500 outline-none`}
        />
        {!isLogin && (
          <input
            type="password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            placeholder="Confirm Password"
            required
            className={`w-full p-3 rounded-lg border ${themeClasses.input} ${themeClasses.inputText} focus:ring-2 focus:ring-blue-500 outline-none`}
          />
        )}
        <button
          type="submit"
          disabled={isLoading}
          className={`w-full p-3 rounded-lg ${themeClasses.btnPrimary} font-semibold hover:opacity-90 transition-opacity ${isLoading ? "opacity-50 cursor-not-allowed" : ""}`}
        >
          {isLoading ? (
            <div className="spinner-small mx-auto"></div>
          ) : isLogin ? (
            "Login"
          ) : (
            "Register"
          )}
        </button>
      </form>

      <p className={`${themeClasses.text} text-sm`}>Or {isLogin ? "login" : "sign up"} with:</p>
      <div className="flex space-x-4">
        <button
          onClick={onGoogleLogin}
          disabled={isLoading}
          className={`p-3 w-12 h-12 rounded-full ${themeClasses.btnSecondary} hover:opacity-90 ${isLoading ? "opacity-50 cursor-not-allowed" : ""}`}
        >
          <i className={`fab fa-google ${themeClasses.text}`}></i>
        </button>
        <button
          onClick={onFacebookLogin}
          disabled={isLoading}
          className={`p-3 w-12 h-12 rounded-full ${themeClasses.btnSecondary} hover:opacity-90 ${isLoading ? "opacity-50 cursor-not-allowed" : ""}`}
        >
          <i className={`fab fa-facebook-f ${themeClasses.text}`}></i>
        </button>
      </div>

      <button
        onClick={isLogin ? switchToRegister : switchToLogin}
        disabled={isLoading}
        className={`mt-3 ${themeClasses.text} hover:underline text-sm ${isLoading ? "opacity-50 cursor-not-allowed" : ""}`}
      >
        {isLogin ? "Need an account? Register" : "Already have an account? Login"}
      </button>
    </div>
  );
};

interface Task {
  id: string;
  title: string;
  dueDate: string | null;
  completed?: boolean;
  createdAt?: any;
  [key: string]: any;
}

interface TempTask {
  id: string;
  title: string;
  dueDate: string | null;
}

interface TasksViewProps {
  tasks: Task[];
  temporaryTasks: TempTask[];
  currentUser: import("firebase/auth").User | null;
  onAddTask: (title: string, dueDate: string | null) => void;
  onToggleComplete: (taskId: string, isCompleted: boolean) => void;
  onEditTask: (taskId: string, currentTitle: string, currentDueDate: string | null) => void;
  onDeleteTask: (taskId: string) => void;
  themeClasses: {
    bg: string;
    text: string;
    inputText: string;
    input: string;
    btnPrimary: string;
    btnSecondary: string;
    border: string;
    card: string;
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
  const [isExpanded, setIsExpanded] = useState(false);

  const allTasksToDisplay = currentUser ? tasks : temporaryTasks;

  const handleAdd = () => {
    if (!newTaskTitle.trim()) return;
    onAddTask(newTaskTitle.trim(), newTaskDueDate);
    setNewTaskTitle("");
    setNewTaskDueDate("");
    setIsExpanded(false); // Close the bubble after adding
  };

  return (
    <div className="w-full h-full flex flex-col relative">
      {/* Scrollable task list */}
      <div className="flex-1 overflow-y-auto hide-scroll pr-1 space-y-3 pb-36">
        {allTasksToDisplay.map((task) => (
          <div
            key={task.id}
            id={`task-${task.id}`}
            className={`task-item flex items-center justify-between p-3 rounded-lg shadow ${themeClasses.card} ${
              "completed" in task && task.completed ? "completed opacity-60" : ""
            } ${!currentUser ? "opacity-70" : ""}`}
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
                className={`task-title ${themeClasses.text} ${
                  "completed" in task && task.completed ? "line-through" : ""
                } truncate`}
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
                    className="text-blue-500 hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300"
                  >
                    <i className="fas fa-edit"></i>
                  </button>
                  <button
                    onClick={() => onDeleteTask(task.id)}
                    className="text-red-500 hover:text-red-700 dark:text-red-400 dark:hover:text-red-300"
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
            {currentUser
              ? "No tasks yet. Add one below!"
              : "Add a task. Login or register to save."}
          </p>
        )}
      </div>

      {/* Floating draggable + Button */}
      <motion.button
        drag
        dragConstraints={{ top: 0, bottom: 600, left: 0, right: 300 }}
        dragElastic={0.3}
        onClick={() => setIsExpanded((prev) => !prev)}
        className="absolute bottom-20 right-4 z-20 w-14 h-14 bg-blue-600 hover:bg-blue-700 text-white rounded-full shadow-lg flex items-center justify-center text-3xl"
      >
        {isExpanded ? "–" : "+"}
      </motion.button>

      {/* Add Task Bubble */}
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
                <i className="fas fa-plus mr-1"></i> Add Task
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

interface CalendarViewProps {
  tasks: Task[];
  selectedDate: Date;
  setSelectedDate: (date: Date) => void;
  themeClasses: {
    bg: string;
    text: string;
    inputText: string;
    input: string;
    btnPrimary: string;
    btnSecondary: string;
    border: string;
    card: string;
  };
}

const CalendarView: React.FC<CalendarViewProps> = ({
  tasks,
  selectedDate,
  setSelectedDate,
  themeClasses,
}) => {
  const today = useMemo(() => new Date(), []);
  const year = selectedDate.getFullYear();
  const month = selectedDate.getMonth();

  const firstDayOfMonth = useMemo(() => new Date(year, month, 1), [year, month]);
  const lastDayOfMonth = useMemo(() => new Date(year, month + 1, 0), [year, month]);
  const daysInMonth = lastDayOfMonth.getDate();
  const startDayOfWeek = firstDayOfMonth.getDay(); // 0 (Sun) - 6 (Sat)

  const tasksByDate = useMemo(() => {
    const map = new Map();
    tasks.forEach((task: Task) => {
      if (task.dueDate) {
        const dateStr = task.dueDate.split("T")[0]; // YYYY-MM-DD
        if (!map.has(dateStr)) map.set(dateStr, []);
        map.get(dateStr).push(task);
      }
    });
    return map;
  }, [tasks]);

  const calendarDays = [];
  for (let i = 0; i < startDayOfWeek; i++) {
    calendarDays.push(<div key={`empty-prev-${i}`} className="calendar-day other-month"></div>);
  }
  for (let day = 1; day <= daysInMonth; day++) {
    const currentDate = new Date(year, month, day);
    const dateString = currentDate.toISOString().split("T")[0];
    const tasksOnThisDay = tasksByDate.get(dateString) || [];
    const isSelected = selectedDate.toDateString() === currentDate.toDateString();
    const isToday = today.toDateString() === currentDate.toDateString();

    let dayClasses = `calendar-day ${themeClasses.border} border text-sm`;
    if (tasksOnThisDay.length > 0)
      dayClasses += ` has-task font-bold ${themeClasses.bg === "app-bg-light" ? "bg-blue-200" : "bg-blue-700"}`;
    if (isSelected) dayClasses += ` selected ${themeClasses.btnPrimary}`;
    if (isToday && !isSelected)
      dayClasses += ` ${themeClasses.bg === "app-bg-light" ? "bg-blue-100" : "bg-blue-900"}`;

    calendarDays.push(
      <div key={day} className={dayClasses} onClick={() => setSelectedDate(currentDate)}>
        {day}
      </div>
    );
  }
  // Fill remaining cells for grid structure if month doesn't end on Saturday
  const totalCells = startDayOfWeek + daysInMonth;
  const remainingCells = (7 - (totalCells % 7)) % 7;
  for (let i = 0; i < remainingCells; i++) {
    calendarDays.push(<div key={`empty-next-${i}`} className="calendar-day other-month"></div>);
  }

  const selectedDateString = selectedDate.toISOString().split("T")[0];
  const tasksForSelectedDate = tasksByDate.get(selectedDateString) || [];

  return (
    <div>
      <div className="flex justify-between items-center mb-4">
        <button
          onClick={() => setSelectedDate(new Date(year, month - 1, selectedDate.getDate()))}
          className={`p-2 rounded-md ${themeClasses.btnSecondary}`}
        >
          <i className="fas fa-chevron-left"></i>
        </button>
        <h3 className={`text-lg font-semibold ${themeClasses.text}`}>
          {selectedDate.toLocaleString("default", { month: "long" })} {year}
        </h3>
        <button
          onClick={() => setSelectedDate(new Date(year, month + 1, selectedDate.getDate()))}
          className={`p-2 rounded-md ${themeClasses.btnSecondary}`}
        >
          <i className="fas fa-chevron-right"></i>
        </button>
      </div>
      <div className={`calendar ${themeClasses.text}`}>
        {["S", "M", "T", "W", "T", "F", "S"].map((d) => (
          <div
            key={d}
            className={`font-semibold text-center text-xs ${themeClasses.text} opacity-70`}
          >
            {d}
          </div>
        ))}
        {calendarDays}
      </div>
      <div className="mt-6">
        <h4 className={`font-semibold ${themeClasses.text} mb-2`}>
          Tasks for{" "}
          {selectedDate.toLocaleDateString("en-CA", {
            weekday: "short",
            month: "long",
            day: "numeric",
          })}
          :
        </h4>
        {tasksForSelectedDate.length > 0 ? (
          tasksForSelectedDate.map((task: Task) => (
            <div
              key={task.id}
              className={`p-2 rounded ${themeClasses.card} ${themeClasses.border} border mb-2 text-sm ${task.completed ? "opacity-60 line-through" : ""}`}
            >
              {task.title}
            </div>
          ))
        ) : (
          <p className={`${themeClasses.text} opacity-70 text-sm`}>No tasks for this day.</p>
        )}
      </div>
    </div>
  );
};

interface SettingsViewProps {
  onLogout: () => void;
  currentTheme: string;
  toggleTheme: () => void;
  themeClasses: {
    bg: string;
    text: string;
    inputText: string;
    input: string;
    btnPrimary: string;
    btnSecondary: string;
    border: string;
    card: string;
  };
  currentUser: import("firebase/auth").User;
  appId: string;
}

const SettingsView: React.FC<SettingsViewProps> = ({
  onLogout,
  currentTheme,
  toggleTheme,
  themeClasses,
  currentUser,
  appId,
}) => (
  <div className="space-y-6">
    <div>
      <h3 className={`text-lg font-semibold ${themeClasses.text} mb-2`}>Appearance</h3>
      <button
        onClick={toggleTheme}
        className={`w-full p-3 rounded-lg ${themeClasses.btnSecondary} flex justify-between items-center`}
      >
        <span>Theme: {currentTheme === "light" ? "Light" : "Dark"}</span>
        <i className={`fas ${currentTheme === "light" ? "fa-moon" : "fa-sun"}`}></i>
      </button>
    </div>
    <div>
      <h3 className={`text-lg font-semibold ${themeClasses.text} mb-2`}>Account</h3>
      <p className={`${themeClasses.text} text-sm mb-1 break-all`}>
        Logged in as: {currentUser.email || `UID: ${currentUser.uid}`}
      </p>
      <button
        onClick={onLogout}
        className="w-full p-3 rounded-lg bg-red-500 text-white font-semibold hover:bg-red-600 transition-colors"
      >
        Logout
      </button>
    </div>
    <div>
      <h3 className={`text-lg font-semibold ${themeClasses.text} mb-2`}>About</h3>
      <p className={`${themeClasses.text} text-sm`}>TaskMaster Pro v1.0.0 (React)</p>
      <p className={`${themeClasses.text} text-sm`}>Developed by: Vikram Kumar</p>
    </div>
  </div>
);

export default TaskMasterProApp;

