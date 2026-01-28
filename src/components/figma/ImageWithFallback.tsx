'use client';

import React, { useState } from 'react';

interface ImageWithFallbackProps {
  src?: string | null;
  alt?: string;
  className?: string;
  style?: React.CSSProperties;
  onLoad?: () => void;
}

export function ImageWithFallback({
  src,
  alt = '',
  className = '',
  style,
  onLoad,
}: ImageWithFallbackProps) {
  const [didError, setDidError] = useState(false);

  const handleError = () => {
    setDidError(true);
  };

  if (!src || didError) {
    return (
      <div
        className={`flex items-center justify-center bg-gray-100 ${className}`}
        style={style}
      >
        <svg
          width="48"
          height="48"
          viewBox="0 0 88 88"
          xmlns="http://www.w3.org/2000/svg"
          stroke="#9ca3af"
          strokeLinejoin="round"
          opacity="0.5"
          fill="none"
          strokeWidth="3.7"
        >
          <rect x="16" y="16" width="56" height="56" rx="6" />
          <path d="m16 58 16-18 32 32" />
          <circle cx="53" cy="35" r="7" />
        </svg>
      </div>
    );
  }

  return (
    // eslint-disable-next-line @next/next/no-img-element
    <img
      src={src}
      alt={alt}
      className={className}
      style={style}
      onError={handleError}
      onLoad={onLoad}
    />
  );
}
