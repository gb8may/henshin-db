import React from 'react';

export function Button({ children, onClick, className = "", variant = "primary", icon, ...props }) {
  const baseClasses = variant === "ghost" 
    ? "btn-ghost"
    : "btn-primary";
  
  return (
    <button
      className={`${baseClasses} ${className}`}
      onClick={onClick}
      {...props}
    >
      {icon && <span className="flex-shrink-0">{icon}</span>}
      <span className="flex-1 text-left">{children}</span>
    </button>
  );
}

export function CategoryButton({ label, hint, icon, onClick, className = "" }) {
  return (
    <button
      onClick={onClick}
      className={`btn-primary group ${className}`}
    >
      <div className="flex items-center gap-3 flex-1 min-w-0">
        {icon && (
          <span className="flex-shrink-0 text-toku-rider-primary group-hover:scale-110 transition-transform">
            {icon}
          </span>
        )}
        <div className="flex flex-col items-start min-w-0 flex-1">
          <span className="font-semibold text-[15px] leading-tight truncate w-full">{label}</span>
          {hint && <small className="text-xs text-toku-muted leading-tight">{hint}</small>}
        </div>
      </div>
    </button>
  );
}


