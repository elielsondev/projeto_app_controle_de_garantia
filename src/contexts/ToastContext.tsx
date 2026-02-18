import { createContext, useContext, useState, useCallback } from "react";
import type { ReactNode } from "react";
import type { Toast, ToastType } from "../components/Toast";

interface ToastContextType {
     showToast: (message: string, type?: ToastType) => void;
     toasts: Toast[];
     removeToast: (id: string) => void;
}

const ToastContext = createContext<ToastContextType | undefined>(undefined);

let toastIdCounter = 0;

export const ToastProvider = ({ children }: { children: ReactNode }) => {
     const [toasts, setToasts] = useState<Toast[]>([]);

     const showToast = useCallback((message: string, type: ToastType = "info") => {
          const id = `toast-${++toastIdCounter}`;
          const newToast: Toast = { id, message, type };

          setToasts((prev) => [...prev, newToast]);
     }, []);

     const removeToast = useCallback((id: string) => {
          setToasts((prev) => prev.filter((toast) => toast.id !== id));
     }, []);

     return (
          <ToastContext.Provider value={{ showToast, toasts, removeToast }}>
               {children}
          </ToastContext.Provider>
     );
};

export const useToast = () => {
     const context = useContext(ToastContext);
     if (!context) {
          throw new Error("useToast must be used within a ToastProvider");
     }
     return context;
};
