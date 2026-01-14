import React from 'react';
import { Loader2, LucideIcon } from 'lucide-react';

interface LoadingButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  loading?: boolean;
  icon?: LucideIcon;
  variant?: 'primary' | 'secondary' | 'danger' | 'ghost';
  size?: 'sm' | 'md' | 'lg';
  children: React.ReactNode;
}

export function LoadingButton({
  loading = false,
  icon: Icon,
  variant = 'primary',
  size = 'md',
  children,
  disabled,
  className = '',
  ...props
}: LoadingButtonProps) {
  const baseStyles = 'inline-flex items-center justify-center gap-2 font-medium rounded-md transition-all disabled:opacity-50 disabled:cursor-not-allowed';
  
  const variantStyles = {
    primary: 'bg-[#800000] text-white hover:bg-[#660000] focus:ring-2 focus:ring-[#800000] focus:ring-offset-2',
    secondary: 'bg-white text-gray-700 border border-gray-300 hover:bg-gray-50 focus:ring-2 focus:ring-[#800000] focus:ring-offset-2',
    danger: 'bg-red-600 text-white hover:bg-red-700 focus:ring-2 focus:ring-red-500 focus:ring-offset-2',
    ghost: 'bg-transparent text-gray-700 hover:bg-gray-100 focus:ring-2 focus:ring-gray-300'
  };
  
  const sizeStyles = {
    sm: 'px-3 py-1.5 text-sm',
    md: 'px-4 py-2.5 text-sm',
    lg: 'px-6 py-3 text-base'
  };

  return (
    <button
      className={`${baseStyles} ${variantStyles[variant]} ${sizeStyles[size]} ${className}`}
      disabled={disabled || loading}
      {...props}
    >
      {loading ? (
        <Loader2 className="w-4 h-4 animate-spin" aria-hidden="true" />
      ) : Icon ? (
        <Icon className="w-4 h-4" aria-hidden="true" />
      ) : null}
      <span>{children}</span>
      {loading && <span className="sr-only">Loading...</span>}
    </button>
  );
}
