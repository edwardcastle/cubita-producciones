'use client';

import ReactMarkdown from 'react-markdown';

interface RichTextProps {
  content: string;
  className?: string;
}

export default function RichText({ content, className = '' }: RichTextProps) {
  if (!content) return null;

  return (
    <div className={`prose prose-sm md:prose-lg max-w-none ${className}`}>
      <ReactMarkdown
        components={{
          // Customize heading styles
          h1: ({ children }) => (
            <h1 className="text-2xl md:text-4xl font-bold text-gray-900 mb-4">{children}</h1>
          ),
          h2: ({ children }) => (
            <h2 className="text-xl md:text-3xl font-bold text-gray-900 mb-3">{children}</h2>
          ),
          h3: ({ children }) => (
            <h3 className="text-lg md:text-2xl font-semibold text-gray-900 mb-2">{children}</h3>
          ),
          // Paragraph styling
          p: ({ children }) => (
            <p className="mb-3 md:mb-4 text-sm md:text-base leading-relaxed text-gray-600">{children}</p>
          ),
          // List styling
          ul: ({ children }) => (
            <ul className="list-disc list-inside mb-4 space-y-1 text-gray-600">{children}</ul>
          ),
          ol: ({ children }) => (
            <ol className="list-decimal list-inside mb-4 space-y-1 text-gray-600">{children}</ol>
          ),
          li: ({ children }) => (
            <li className="text-sm md:text-base">{children}</li>
          ),
          // Link styling
          a: ({ href, children }) => (
            <a
              href={href}
              target="_blank"
              rel="noopener noreferrer"
              className="text-amber-600 hover:text-amber-700 underline transition-colors"
            >
              {children}
            </a>
          ),
          // Strong/bold
          strong: ({ children }) => (
            <strong className="font-semibold text-gray-900">{children}</strong>
          ),
          // Emphasis/italic
          em: ({ children }) => (
            <em className="italic">{children}</em>
          ),
          // Blockquote
          blockquote: ({ children }) => (
            <blockquote className="border-l-4 border-amber-500 pl-4 my-4 italic text-gray-600">
              {children}
            </blockquote>
          ),
        }}
      >
        {content}
      </ReactMarkdown>
    </div>
  );
}
