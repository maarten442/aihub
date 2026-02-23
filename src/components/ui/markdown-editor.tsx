'use client';

import { useRef, useState } from 'react';
import { TextareaHTMLAttributes } from 'react';
import { MarkdownContent } from './markdown-content';

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

export function MarkdownEditor({
  label,
  error,
  id,
  rows = 8,
  onKeyDown,
  onChange,
  value,
  defaultValue,
  ...props
}: MarkdownEditorProps) {
  const ref = useRef<HTMLTextAreaElement>(null);
  const [mode, setMode] = useState<'write' | 'preview'>('write');
  const [content, setContent] = useState<string>(
    String(value ?? defaultValue ?? ''),
  );

  function handleChange(e: React.ChangeEvent<HTMLTextAreaElement>) {
    setContent(e.target.value);
    onChange?.(e);
  }

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

  const inlineButtons = [
    { label: 'B', title: 'Bold (Ctrl+B)', action: () => ref.current && applyFormat(ref.current, '**', '**') },
    { label: 'I', title: 'Italic (Ctrl+I)', action: () => ref.current && applyFormat(ref.current, '*', '*') },
  ];

  const blockButtons = [
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
        {/* Header row */}
        <div className="flex items-center justify-between border-b border-border bg-muted/30 px-2 py-1">
          {/* Left: formatting toolbar */}
          <div
            className={`flex items-center gap-1 transition-opacity ${mode === 'preview' ? 'pointer-events-none opacity-0' : 'opacity-100'}`}
          >
            {inlineButtons.map(({ label: btnLabel, title, action }) => (
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
            <span className="mx-1 h-3 w-px bg-border" />
            {blockButtons.map(({ label: btnLabel, title, action }) => (
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

          {/* Right: Write/Preview pill toggle */}
          <div className="rounded-full bg-muted p-0.5 flex items-center gap-0.5">
            {(['write', 'preview'] as const).map((m) => (
              <button
                key={m}
                type="button"
                onClick={() => setMode(m)}
                className={`rounded-full px-2.5 py-0.5 text-xs font-medium capitalize transition-all ${
                  mode === m
                    ? 'bg-white text-foreground shadow-sm'
                    : 'text-muted-foreground hover:text-foreground'
                }`}
              >
                {m}
              </button>
            ))}
          </div>
        </div>

        {/* Body */}
        {mode === 'write' ? (
          <textarea
            ref={ref}
            id={id}
            rows={rows}
            value={content}
            onChange={handleChange}
            onKeyDown={handleKeyDown}
            className="block w-full bg-white px-3 py-2 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none"
            {...props}
          />
        ) : (
          <>
            <textarea hidden value={content} onChange={() => {}} {...props} />
            <div className="min-h-[8lh] px-3 py-2 text-sm text-foreground">
              {content ? (
                <MarkdownContent>{content}</MarkdownContent>
              ) : (
                <span className="text-muted-foreground">Nothing to preview yet.</span>
              )}
            </div>
          </>
        )}
      </div>
      {error && <p className="text-xs text-red-600">{error}</p>}
    </div>
  );
}
