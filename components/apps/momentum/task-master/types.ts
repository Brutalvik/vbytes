import { User } from "firebase/auth";

export interface TaskMasterProAppProps {
  firebaseConfig: object;
  appId: string;
  initialAuthToken?: string;
}

export interface Task {
  id: string;
  title: string;
  dueDate: string | null;
  completed?: boolean;
  createdAt?: any;
  [key: string]: any;
}


export interface TasksViewProps {
  tasks: Task[];
  temporaryTasks: Task[];
  currentUser: User | null;
  onAddTask: (title: string, dueDate: string) => void;
  onToggleComplete: (taskId: string, completed: boolean) => void;
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
  dbInstance: any;
  getUserTasksCollectionPath: (uid: string) => string;
  showToast: (message: string, type: "success" | "error" | "info") => void;
}

export interface TempTask {
  id: string;
  title: string;
  dueDate: string | null;
}

export interface ToastProps {
  toast: {
    isVisible: boolean;
    type: "success" | "error" | "info";
    message: string;
  };
}

export interface HandleEditTaskParams {
  taskId: string;
  currentTitle: string;
  currentDueDate: string | null;
}

export interface HandleDeleteTaskParams {
  taskId: string;
}

export interface SettingsViewProps {
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
}

export interface ModalProps {
  modal: {
    isOpen: boolean;
    title: string;
    message: string;
    onConfirm: (() => void) | null;
    onCancel: (() => void) | null;
    confirmText: string;
    cancelText: string;
  };
  themeClasses: any;
  isLoading: boolean;
  setModal: React.Dispatch<
    React.SetStateAction<{
      isOpen: boolean;
      title: string;
      message: string;
      onConfirm: (() => void) | null;
      onCancel: (() => void) | null;
      confirmText: string;
      cancelText: string;
    }>
  >;
}

export interface CalendarViewProps {
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

export interface HandleToggleTaskCompleteParams {
  taskId: string;
  isCompleted: boolean;
}

