import ReactMarkdown from 'react-markdown';

interface MarkdownContentProps {
  children: string;
  className?: string;
}

export function MarkdownContent({ children, className }: MarkdownContentProps) {
  return (
    <div className={className}>
      <ReactMarkdown
        components={{
          h1: ({ children }) => <h1 className="mb-2 text-xl font-semibold">{children}</h1>,
          h2: ({ children }) => <h2 className="mb-2 text-lg font-semibold">{children}</h2>,
          h3: ({ children }) => <h3 className="mb-2 text-base font-semibold">{children}</h3>,
          p: ({ children }) => <p className="mb-2 last:mb-0">{children}</p>,
          ul: ({ children }) => <ul className="mb-2 ml-4 list-disc space-y-1">{children}</ul>,
          ol: ({ children }) => <ol className="mb-2 ml-4 list-decimal space-y-1">{children}</ol>,
          strong: ({ children }) => <strong className="font-semibold">{children}</strong>,
          em: ({ children }) => <em className="italic">{children}</em>,
          code: ({ children }) => <code className="rounded bg-muted px-1 font-mono text-xs">{children}</code>,
        }}
      >
        {children}
      </ReactMarkdown>
    </div>
  );
}
