"use client";

import { useEffect } from "react";

interface ToastProps {
  message: string;
  type?: "success" | "error" | "info";
  duration?: number;
  onClose: () => void;
}

export default function Toast({ message, type = "success", duration = 3000, onClose }: ToastProps) {
  useEffect(() => {
    const timer = setTimeout(onClose, duration);
    return () => clearTimeout(timer);
  }, [onClose, duration]);

  const styles = {
    success: "bg-green-600",
    error: "bg-red-500",
    info: "bg-blue-600",
  };

  const icons = {
    success: <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />,
    error: <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />,
    info: <path strokeLinecap="round" strokeLinejoin="round" d="M13 16h-1v-4h-1m1-4h.01M12 2a10 10 0 100 20 10 10 0 000-20z" />,
  };

  return (
    <div className={`fixed bottom-6 right-6 z-[100] flex items-center gap-2 rounded-lg px-4 py-3 text-sm font-medium text-white shadow-lg ${styles[type]}`}>
      <svg className="h-4 w-4 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
        {icons[type]}
      </svg>
      {message}
    </div>
  );
}
