'use client';

import { useRef } from 'react';
import { TextareaHTMLAttributes } from 'react';

interface MarkdownEditorProps extends TextareaHTMLAttributes<HTMLTextAreaElement> {
  label?: string;
  error?: string;
}

function applyFormat(textarea: HTMLTextAreaElement, before: string, after = '') {
  const start = textarea.selectionStart;
  const end = textarea.selectionEnd;
  const value = textarea.value;
  const selected = value.slice(start, end);
  const newValue = value.slice(0, start) + before + selected + after + value.slice(end);
  const nativeInputValueSetter = Object.getOwnPropertyDescriptor(HTMLTextAreaElement.prototype, 'value')?.set;
  nativeInputValueSetter?.call(textarea, newValue);
  textarea.dispatchEvent(new Event('input', { bubbles: true }));
  textarea.setSelectionRange(
    start + before.length,
    selected ? end + before.length : start + before.length,
  );
  textarea.focus();
}

function prependToLine(textarea: HTMLTextAreaElement, prefix: string) {
  const start = textarea.selectionStart;
  const value = textarea.value;
  const lineStart = value.lastIndexOf('\n', start - 1) + 1;
  const newValue = value.slice(0, lineStart) + prefix + value.slice(lineStart);
  const nativeInputValueSetter = Object.getOwnPropertyDescriptor(HTMLTextAreaElement.prototype, 'value')?.set;
  nativeInputValueSetter?.call(textarea, newValue);
  textarea.dispatchEvent(new Event('input', { bubbles: true }));
  const newPos = start + prefix.length;
  textarea.setSelectionRange(newPos, newPos);
  textarea.focus();
}

export function MarkdownEditor({ label, error, id, rows = 8, onKeyDown, ...props }: MarkdownEditorProps) {
  const ref = useRef<HTMLTextAreaElement>(null);

  function handleKeyDown(e: React.KeyboardEvent<HTMLTextAreaElement>) {
    if ((e.ctrlKey || e.metaKey) && e.key === 'b') {
      e.preventDefault();
      if (ref.current) applyFormat(ref.current, '**', '**');
    }
    if ((e.ctrlKey || e.metaKey) && e.key === 'i') {
      e.preventDefault();
      if (ref.current) applyFormat(ref.current, '*', '*');
    }
    onKeyDown?.(e);
  }

  const toolbarButtons = [
    { label: 'B', title: 'Bold (Ctrl+B)', action: () => ref.current && applyFormat(ref.current, '**', '**') },
    { label: 'I', title: 'Italic (Ctrl+I)', action: () => ref.current && applyFormat(ref.current, '*', '*') },
    { label: 'H1', title: 'Heading 1', action: () => ref.current && prependToLine(ref.current, '# ') },
    { label: 'H2', title: 'Heading 2', action: () => ref.current && prependToLine(ref.current, '## ') },
    { label: '•', title: 'Bullet list', action: () => ref.current && prependToLine(ref.current, '- ') },
    { label: '1.', title: 'Numbered list', action: () => ref.current && prependToLine(ref.current, '1. ') },
  ];

  return (
    <div className="space-y-1">
      {label && (
        <label htmlFor={id} className="block text-sm font-medium text-foreground">
          {label}
        </label>
      )}
      <div className="overflow-hidden rounded-lg border border-border focus-within:border-primary-500 focus-within:ring-2 focus-within:ring-primary-500/20">
        <div className="flex items-center gap-1 border-b border-border bg-muted/40 px-2 py-1">
          {toolbarButtons.map(({ label: btnLabel, title, action }) => (
            <button
              key={btnLabel}
              type="button"
              title={title}
              onClick={action}
              className="rounded px-2 py-0.5 text-xs font-medium text-muted-foreground hover:bg-background hover:text-foreground"
            >
              {btnLabel}
            </button>
          ))}
        </div>
        <textarea
          ref={ref}
          id={id}
          rows={rows}
          onKeyDown={handleKeyDown}
          className="block w-full bg-white px-3 py-2 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none"
          {...props}
        />
      </div>
      {error && <p className="text-xs text-red-600">{error}</p>}
    </div>
  );
}
