import type { ReactNode } from "react";

const INLINE_FORMAT_PATTERN =
  /(\*\*\*([^*\n]+)\*\*\*|\*\*([^*\n]+)\*\*|\*([^*\n]+)\*)/g;

const URL_PATTERN = /(https?:\/\/[^\s<>"')\]]+|www\.[^\s<>"')\]]+)/gi;

function linkify(text: string, keyPrefix: string): ReactNode[] {
  const parts: ReactNode[] = [];
  let cursor = 0;
  let matchCount = 0;

  for (const match of text.matchAll(URL_PATTERN)) {
    const index = match.index ?? 0;
    if (index > cursor) {
      parts.push(text.slice(cursor, index));
    }

    let url = match[0];
    let trailing = "";
    // Sentence punctuation right after a URL usually isn't part of it.
    const trailingMatch = url.match(/[.,!?;:)\]]+$/);
    if (trailingMatch) {
      trailing = trailingMatch[0];
      url = url.slice(0, url.length - trailing.length);
    }

    const href = url.startsWith("http") ? url : `https://${url}`;
    parts.push(
      <a
        key={`${keyPrefix}-link-${matchCount++}`}
        href={href}
        target="_blank"
        rel="noopener noreferrer"
        className="font-bold text-cta underline underline-offset-2 hover:text-highlight"
      >
        {url}
      </a>,
    );
    if (trailing) parts.push(trailing);

    cursor = index + match[0].length;
  }

  if (cursor < text.length) {
    parts.push(text.slice(cursor));
  }

  return parts;
}

function renderInlineFormatting(value: string) {
  const content: ReactNode[] = [];
  let cursor = 0;

  for (const match of value.matchAll(INLINE_FORMAT_PATTERN)) {
    const index = match.index;
    if (index > cursor) {
      content.push(...linkify(value.slice(cursor, index), `pre-${index}`));
    }

    if (match[2]) {
      content.push(
        <strong key={index}>
          <em>{linkify(match[2], `bi-${index}`)}</em>
        </strong>,
      );
    } else if (match[3]) {
      content.push(<strong key={index}>{linkify(match[3], `b-${index}`)}</strong>);
    } else {
      content.push(<em key={index}>{linkify(match[4], `i-${index}`)}</em>);
    }

    cursor = index + match[0].length;
  }

  if (cursor < value.length) {
    content.push(...linkify(value.slice(cursor), "tail"));
  }

  return content;
}

export function DescriptionText({
  value,
  className,
}: {
  value: string;
  className?: string;
}) {
  return (
    <div className={`whitespace-pre-wrap ${className ?? ""}`}>
      {renderInlineFormatting(value)}
    </div>
  );
}
