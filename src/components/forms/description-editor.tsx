"use client";

import { useRef } from "react";

interface DescriptionEditorProps {
  id: string;
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  rows?: number;
  required?: boolean;
  className?: string;
}

type Format = "bold" | "italic" | "normal";

export function DescriptionEditor({
  id,
  value,
  onChange,
  placeholder,
  rows = 5,
  required,
  className,
}: DescriptionEditorProps) {
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  function applyFormat(format: Format) {
    const textarea = textareaRef.current;
    if (!textarea) return;

    const start = textarea.selectionStart;
    const end = textarea.selectionEnd;
    const selected = value.slice(start, end);
    if (!selected) {
      textarea.focus();
      return;
    }

    let replacement = selected;
    let selectionOffset = 0;

    if (format === "normal") {
      for (const marker of ["***", "**", "*"]) {
        const wrappedBefore = value.slice(Math.max(0, start - marker.length), start);
        const wrappedAfter = value.slice(end, end + marker.length);
        if (wrappedBefore === marker && wrappedAfter === marker) {
          const nextValue =
            value.slice(0, start - marker.length) +
            selected +
            value.slice(end + marker.length);
          onChange(nextValue);
          requestAnimationFrame(() => {
            textarea.focus();
            textarea.setSelectionRange(start - marker.length, end - marker.length);
          });
          return;
        }
      }

      replacement = selected
        .replace(/\*\*\*([^*\n]+)\*\*\*/g, "$1")
        .replace(/\*\*([^*\n]+)\*\*/g, "$1")
        .replace(/\*([^*\n]+)\*/g, "$1");
    } else {
      const marker = format === "bold" ? "**" : "*";
      const wrappedBefore = value.slice(Math.max(0, start - marker.length), start);
      const wrappedAfter = value.slice(end, end + marker.length);

      if (wrappedBefore === marker && wrappedAfter === marker) {
        const nextValue =
          value.slice(0, start - marker.length) +
          selected +
          value.slice(end + marker.length);
        onChange(nextValue);
        requestAnimationFrame(() => {
          textarea.focus();
          textarea.setSelectionRange(start - marker.length, end - marker.length);
        });
        return;
      }

      replacement = `${marker}${selected}${marker}`;
      selectionOffset = marker.length;
    }

    onChange(value.slice(0, start) + replacement + value.slice(end));
    requestAnimationFrame(() => {
      textarea.focus();
      textarea.setSelectionRange(
        start + selectionOffset,
        start + replacement.length - selectionOffset,
      );
    });
  }

  const buttonClass =
    "flex h-8 min-w-8 items-center justify-center rounded-[6px] border border-border bg-white px-2 text-[13px] font-bold text-charcoal transition-colors hover:border-ink hover:bg-surface focus:outline-none focus:ring-2 focus:ring-cta/20";

  return (
    <div className={`overflow-hidden rounded-input border border-border bg-white focus-within:border-cta focus-within:ring-3 focus-within:ring-cta/10 ${className ?? ""}`}>
      <div className="flex items-center gap-1 border-b border-border bg-surface/40 p-2">
        <button
          type="button"
          title="Tebal"
          aria-label="Tebalkan teks terpilih"
          onMouseDown={(event) => event.preventDefault()}
          onClick={() => applyFormat("bold")}
          className={buttonClass}
        >
          B
        </button>
        <button
          type="button"
          title="Miring"
          aria-label="Miringkan teks terpilih"
          onMouseDown={(event) => event.preventDefault()}
          onClick={() => applyFormat("italic")}
          className={`${buttonClass} italic`}
        >
          I
        </button>
        <button
          type="button"
          title="Hapus format"
          aria-label="Hapus format teks terpilih"
          onMouseDown={(event) => event.preventDefault()}
          onClick={() => applyFormat("normal")}
          className={`${buttonClass} ml-1 font-normal`}
        >
          Tx
        </button>
      </div>
      <textarea
        ref={textareaRef}
        id={id}
        rows={rows}
        value={value}
        onChange={(event) => onChange(event.target.value)}
        placeholder={placeholder}
        required={required}
        className="block w-full resize-y bg-white p-3 text-[14px] leading-6 text-charcoal placeholder:text-muted focus:outline-none"
      />
    </div>
  );
}
