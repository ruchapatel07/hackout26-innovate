import React from 'react';
import { useToast } from '../context/ToastContext';

export const ToastContainer = () => {
  const { toasts } = useToast();

  if (toasts.length === 0) return null;

  return (
    <div id="toastContainer">
      {toasts.map((toast) => (
        <div
          key={toast.id}
          className={`toast ${toast.type === 'error' ? 'error' : ''}`}
        >
          {toast.message}
        </div>
      ))}
    </div>
  );
};
