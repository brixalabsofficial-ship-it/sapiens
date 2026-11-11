import React from 'react';

export function ProductGridSkeleton({ count = 8 }) {
  return (
    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 sm:gap-8">
      {Array.from({ length: count }).map((_, i) => (
        <div key={i} className="flex flex-col animate-pulse">
          <div className="aspect-[3/4] bg-black/5" />
          <div className="pt-4 space-y-2">
            <div className="h-3 bg-black/5 w-1/3" />
            <div className="h-4 bg-black/5 w-3/4" />
            <div className="h-4 bg-black/5 w-1/4" />
          </div>
        </div>
      ))}
    </div>
  );
}

export function ProductDetailSkeleton() {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 animate-pulse">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
        <div className="aspect-square bg-black/5" />
        <div className="space-y-6">
          <div className="h-4 bg-black/5 w-1/4" />
          <div className="h-8 bg-black/5 w-3/4" />
          <div className="h-6 bg-black/5 w-1/3" />
          <div className="h-24 bg-black/5 w-full" />
          <div className="h-12 bg-black/5 w-full" />
        </div>
      </div>
    </div>
  );
}

export function Spinner({ size = 18, className = "" }) {
  return (
    <svg
      className={`animate-spin text-current inline-block ${className}`}
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <circle
        className="opacity-25"
        cx="12"
        cy="12"
        r="10"
        stroke="currentColor"
        strokeWidth="3"
      />
      <path
        className="opacity-75"
        fill="currentColor"
        d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z"
      />
    </svg>
  );
}

export function ConfirmationDialog({ isOpen, title, message, confirmLabel = "Delete", onConfirm, onCancel, isDanger = true }) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm animate-fadeIn">
      <div className="bg-white max-w-md w-full p-6 shadow-2xl border border-black/10">
        <h3 className="text-base font-bold text-black uppercase tracking-wider mb-2">
          {title}
        </h3>
        <p className="text-sm text-black/70 mb-6 leading-relaxed">
          {message}
        </p>
        <div className="flex justify-end gap-3">
          <button
            onClick={onCancel}
            className="px-4 py-2 border border-black/20 text-xs uppercase font-semibold tracking-wider hover:bg-black/5 transition-colors"
          >
            Cancel
          </button>
          <button
            onClick={onConfirm}
            className={`px-4 py-2 text-white text-xs uppercase font-semibold tracking-wider transition-colors ${
              isDanger ? "bg-red-600 hover:bg-red-700" : "bg-[#FF5500] hover:bg-[#e04b00]"
            }`}
          >
            {confirmLabel}
          </button>
        </div>
      </div>
    </div>
  );
}
