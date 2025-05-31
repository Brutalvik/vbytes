import { ToastProps } from "./types";

const Toast: React.FC<ToastProps> = ({ toast }) => {
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

export default Toast;
