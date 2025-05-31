import { ModalProps } from "./types";

const Modal: React.FC<ModalProps> = ({ modal, themeClasses, isLoading, setModal }) => {
  if (!modal.isOpen) return null;
  return (
    <div className="modal-overlay">
      <div
        className={`modal-content ${themeClasses.card} ${themeClasses.text} p-6 rounded-xl shadow-2xl w-11/12 max-w-sm max-h-[90%] overflow-y-auto`}
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

export default Modal
