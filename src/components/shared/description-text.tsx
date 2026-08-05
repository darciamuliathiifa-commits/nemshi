import type { ReactNode } from "react";

const INLINE_FORMAT_PATTERN =
  /(\*\*\*([^*\n]+)\*\*\*|\*\*([^*\n]+)\*\*|\*([^*\n]+)\*)/g;

function renderInlineFormatting(value: string) {
  const content: ReactNode[] = [];
  let cursor = 0;

  for (const match of value.matchAll(INLINE_FORMAT_PATTERN)) {
    const index = match.index;
    if (index > cursor) {
      content.push(value.slice(cursor, index));
    }

    if (match[2]) {
      content.push(
        <strong key={index}>
          <em>{match[2]}</em>
        </strong>,
      );
    } else if (match[3]) {
      content.push(<strong key={index}>{match[3]}</strong>);
    } else {
      content.push(<em key={index}>{match[4]}</em>);
    }

    cursor = index + match[0].length;
  }

  if (cursor < value.length) {
    content.push(value.slice(cursor));
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
