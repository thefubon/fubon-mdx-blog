// src/components/mdx/FileDownload.tsx
import React from 'react';

interface FileDownloadProps {
  url: string;
  filename: string;
  size?: string;
  icon?: React.ReactNode;
  variant?: 'primary' | 'secondary' | 'outline';
}

export default function FileDownload({
  url,
  filename,
  size,
  variant = 'primary',
  icon = (
    <svg
      className="w-4 h-4 mr-2"
      fill="currentColor"
      viewBox="0 0 20 20">
      <path
        fillRule="evenodd"
        d="M3 17a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm3.293-7.707a1 1 0 011.414 0L10 11.586l2.293-2.293a1 1 0 111.414 1.414l-3 3a1 1 0 01-1.414 0l-3-3a1 1 0 010-1.414z"
        clipRule="evenodd"
      />
      <path
        fillRule="evenodd"
        d="M10 3a1 1 0 011 1v9.586l2.293-2.293a1 1 0 111.414 1.414l-3 3a1 1 0 01-1.414 0l-3-3a1 1 0 111.414-1.414L9 13.586V4a1 1 0 011-1z"
        clipRule="evenodd"
      />
    </svg>
  ),
}: FileDownloadProps) {
  const variantStyles = {
    primary: 'bg-blue-600 hover:bg-blue-700 text-white',
    secondary: 'bg-gray-600 hover:bg-gray-700 text-white',
    outline: 'bg-white border border-gray-300 hover:bg-gray-50 text-gray-700',
  }

  return (
    <div className="my-4 flex justify-center">
      <a
        href={url}
        download={filename}
        className={`inline-flex items-center px-4 py-2 rounded-lg text-sm font-medium ${variantStyles[variant]}`}>
        {icon}
        <span className="flex flex-col items-start">
          <span>Скачать {filename}</span>
          {size && <span className="text-xs opacity-80">{size}</span>}
        </span>
      </a>
    </div>
  )
}
