import { detectDifferences, type DiffSegment } from "@/lib/diffUtils";

interface DiffHighlightProps {
  text1: string;
  text2: string;
  index: 0 | 1;
}

export function DiffHighlight({ text1, text2, index }: DiffHighlightProps) {
  const { segments1, segments2 } = detectDifferences(text1, text2);
  const segments = index === 0 ? segments1 : segments2;

  return (
    <div className="whitespace-pre-wrap">
      {segments.map((segment, i) => (
        <span
          key={i}
          className={
            segment.type === 'different'
              ? 'bg-yellow-200 dark:bg-yellow-900/50 px-0.5 rounded'
              : ''
          }
        >
          {segment.text}
        </span>
      ))}
    </div>
  );
}
