"use client";

import React, { createContext, useContext, useState, useCallback } from 'react';

const ToastContext = createContext();

export function ToastProvider({ children }) {
  const [toasts, setToasts] = useState([]);

  const removeToast = useCallback((id) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  }, []);

  const addToast = useCallback((toast) => {
    const id = Math.random().toString(36).substring(2);
    const duration = toast.duration || 5000;

    setToasts((prev) => [...prev, { ...toast, id }]);

    setTimeout(() => {
      removeToast(id);
    }, duration);
  }, [removeToast]);

  const success = (message, duration) => addToast({ type: "success", message, duration });
  const error = (message, duration) => addToast({ type: "error", message, duration });
  const info = (message, duration) => addToast({ type: "info", message, duration });
  const warning = (message, duration) => addToast({ type: "warning", message, duration });

  return (
    <ToastContext.Provider value={{ toasts, success, error, info, warning, remove: removeToast }}>
      {children}
      
      {/* Global Toast Container */}
      <div className="fixed bottom-4 right-4 z-[200] flex flex-col gap-2">
        {toasts.map((toast) => (
          <div
            key={toast.id}
            className={`px-4 py-3 rounded-xl shadow-2xl backdrop-blur-md border border-white/10 animate-in slide-in-from-right-10 duration-300 ${
              toast.type === 'success' ? 'bg-green-500/20 text-green-400' :
              toast.type === 'error' ? 'bg-red-500/20 text-red-400' :
              'bg-slate-900/80 text-white'
            }`}
          >
            <div className="flex items-center gap-3">
               <span className="font-bold text-sm">{toast.message}</span>
               <button onClick={() => removeToast(toast.id)} className="text-white/40 hover:text-white transition-colors">
                 <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M6 18L18 6M6 6l12 12" /></svg>
               </button>
            </div>
          </div>
        ))}
      </div>
    </ToastContext.Provider>
  );
}

export const useToast = () => useContext(ToastContext);
