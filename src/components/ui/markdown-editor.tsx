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
  placeholder,
  ...props
}: MarkdownEditorProps) {
  const ref = useRef<HTMLTextAreaElement>(null);
  const [editing, setEditing] = useState(false);
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
      <div
        className={`overflow-hidden rounded-lg border border-border transition-all ${
          editing ? 'border-primary-500 ring-2 ring-primary-500/20' : 'hover:border-border/80'
        }`}
      >
        {/* Always in DOM for FormData */}
        <textarea hidden name={props.name} value={content} onChange={() => {}} />

        {/* Toolbar: only shown when editing */}
        {editing && (
          <div className="flex items-center gap-1 border-b border-border bg-muted/30 px-2 py-1">
            {inlineButtons.map(({ label: btnLabel, title, action }) => (
              <button
                key={btnLabel}
                type="button"
                title={title}
                onMouseDown={(e) => e.preventDefault()}
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
                onMouseDown={(e) => e.preventDefault()}
                onClick={action}
                className="rounded px-2 py-0.5 text-xs font-medium text-muted-foreground hover:bg-background hover:text-foreground"
              >
                {btnLabel}
              </button>
            ))}
          </div>
        )}

        {/* Body */}
        {editing ? (
          <textarea
            ref={ref}
            id={id}
            rows={rows}
            value={content}
            onChange={handleChange}
            onKeyDown={handleKeyDown}
            onBlur={() => setEditing(false)}
            autoFocus
            className="block w-full bg-white px-3 py-2 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none"
            {...props}
            name={undefined}
          />
        ) : (
          <div
            onClick={() => setEditing(true)}
            className="cursor-text min-h-[10rem] px-3 py-2 text-sm"
          >
            {content ? (
              <MarkdownContent>{content}</MarkdownContent>
            ) : (
              <span className="text-muted-foreground">{placeholder ?? 'Add a description...'}</span>
            )}
          </div>
        )}
      </div>
      {error && <p className="text-xs text-red-600">{error}</p>}
    </div>
  );
}
