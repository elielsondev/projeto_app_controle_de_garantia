import { useEffect, useState } from "react";
import { CheckCircle, XCircle, AlertCircle, X } from "lucide-react";

export type ToastType = "success" | "error" | "warning" | "info";

export interface Toast {
     id: string;
     message: string;
     type: ToastType;
}

interface ToastProps {
     toast: Toast;
     onClose: (id: string) => void;
}

const ToastItem = ({ toast, onClose }: ToastProps) => {
     const [isVisible, setIsVisible] = useState(false);

     useEffect(() => {
          // Animação de entrada
          setTimeout(() => setIsVisible(true), 10);

          // Auto-remover após 3 segundos
          const timer = setTimeout(() => {
               setIsVisible(false);
               setTimeout(() => onClose(toast.id), 300);
          }, 3000);

          return () => clearTimeout(timer);
     }, [toast.id, onClose]);

     const getIcon = () => {
          switch (toast.type) {
               case "success":
                    return <CheckCircle className="w-5 h-5 text-green-500" />;
               case "error":
                    return <XCircle className="w-5 h-5 text-red-500" />;
               case "warning":
                    return <AlertCircle className="w-5 h-5 text-yellow-500" />;
               default:
                    return <AlertCircle className="w-5 h-5 text-blue-500" />;
          }
     };

     const getBgColor = () => {
          switch (toast.type) {
               case "success":
                    return "bg-green-50 border-green-200";
               case "error":
                    return "bg-red-50 border-red-200";
               case "warning":
                    return "bg-yellow-50 border-yellow-200";
               default:
                    return "bg-blue-50 border-blue-200";
          }
     };

     return (
          <div
               className={`
        ${getBgColor()}
        border rounded-lg shadow-lg p-4 mb-3
        flex items-center gap-3 min-w-[300px] max-w-[400px]
        transform transition-all duration-300 ease-in-out
        ${isVisible ? "translate-x-0 opacity-100" : "translate-x-full opacity-0"}
      `}
          >
               {getIcon()}
               <p className="flex-1 text-sm text-gray-800">{toast.message}</p>
               <button
                    onClick={() => {
                         setIsVisible(false);
                         setTimeout(() => onClose(toast.id), 300);
                    }}
                    className="text-gray-400 hover:text-gray-600 transition-colors"
               >
                    <X className="w-4 h-4" />
               </button>
          </div>
     );
};

interface ToastContainerProps {
     toasts: Toast[];
     onClose: (id: string) => void;
}

export const ToastContainer = ({ toasts, onClose }: ToastContainerProps) => {
     if (toasts.length === 0) return null;

     return (
          <div className="fixed bottom-4 right-4 z-50 flex flex-col-reverse">
               {toasts.map((toast) => (
                    <ToastItem key={toast.id} toast={toast} onClose={onClose} />
               ))}
          </div>
     );
};
