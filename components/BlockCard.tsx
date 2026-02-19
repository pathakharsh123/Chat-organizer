'use client';

import { SemanticBlock } from '@/types';

// Map of color names to actual Tailwind classes (needed because Tailwind purges unused classes)
const colorMap: Record<string, { border: string; badge: string; dot: string }> = {
  'accent-primary': {
    border: 'border-[#C84B31]',
    badge: 'bg-[#C84B31]/10 text-[#C84B31]',
    dot: 'bg-[#C84B31]',
  },
  'accent-secondary': {
    border: 'border-[#2D6A4F]',
    badge: 'bg-[#2D6A4F]/10 text-[#2D6A4F]',
    dot: 'bg-[#2D6A4F]',
  },
  'accent-gold': {
    border: 'border-[#D4A853]',
    badge: 'bg-[#D4A853]/15 text-[#B8872D]',
    dot: 'bg-[#D4A853]',
  },
  'blue-500': {
    border: 'border-blue-400',
    badge: 'bg-blue-50 text-blue-600',
    dot: 'bg-blue-500',
  },
  'purple-500': {
    border: 'border-purple-400',
    badge: 'bg-purple-50 text-purple-600',
    dot: 'bg-purple-500',
  },
  'pink-500': {
    border: 'border-pink-400',
    badge: 'bg-pink-50 text-pink-600',
    dot: 'bg-pink-500',
  },
  'teal-500': {
    border: 'border-teal-400',
    badge: 'bg-teal-50 text-teal-600',
    dot: 'bg-teal-500',
  },
  'yellow-500': {
    border: 'border-yellow-400',
    badge: 'bg-yellow-50 text-yellow-600',
    dot: 'bg-yellow-500',
  },
  'gray-500': {
    border: 'border-gray-300',
    badge: 'bg-gray-100 text-gray-500',
    dot: 'bg-gray-400',
  },
};

interface HighlightedTextProps {
  text: string;
  query: string;
}

function HighlightedText({ text, query }: HighlightedTextProps) {
  if (!query.trim()) return <span>{text}</span>;

  const regex = new RegExp(`(${query.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')})`, 'gi');
  const parts = text.split(regex);

  return (
    <span>
      {parts.map((part, i) =>
        regex.test(part) ? (
          <mark key={i}>{part}</mark>
        ) : (
          <span key={i}>{part}</span>
        )
      )}
    </span>
  );
}

interface BlockCardProps {
  block: SemanticBlock;
  index: number;
  query: string;
  isFiltered?: boolean;
}

export default function BlockCard({ block, index, query, isFiltered }: BlockCardProps) {
  const colors = colorMap[block.color] ?? colorMap['gray-500'];
  const staggerClass = `stagger-${Math.min(index + 1, 8)}`;

  return (
    <div
      className={`
        opacity-0 animate-fade-up ${staggerClass}
        bg-paper-soft rounded-xl border-l-4 ${colors.border}
        shadow-sm hover:shadow-md transition-all duration-300
        overflow-hidden group
        ${isFiltered ? 'ring-2 ring-accent-gold/40' : ''}
      `}
    >
      {/* Card Header */}
      <div className="px-5 py-4 border-b border-ink/5 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <span className="text-xl" role="img" aria-label={block.category}>
            {block.emoji}
          </span>
          <div>
            <h3 className="font-display font-bold text-base text-ink leading-tight">
              {block.category}
            </h3>
            <p className="text-xs font-mono text-ink/40 mt-0.5">
              {block.messages.length} message{block.messages.length !== 1 ? 's' : ''}
            </p>
          </div>
        </div>
        <span className={`text-xs font-mono font-medium px-2.5 py-1 rounded-full ${colors.badge}`}>
          #{String(index + 1).padStart(2, '0')}
        </span>
      </div>

      {/* Messages */}
      <div className="px-5 py-4 space-y-4">
        {block.messages.map((msg, mIdx) => (
          <div key={mIdx} className="flex gap-3">
            {/* Role indicator */}
            <div className="flex-shrink-0 mt-1">
              <div
                className={`w-1.5 h-1.5 rounded-full mt-1.5 ${
                  msg.role === 'User' ? `${colors.dot}` : 'bg-ink/20'
                }`}
              />
            </div>

            <div className="flex-1 min-w-0">
              <span className={`text-xs font-mono font-semibold uppercase tracking-widest ${
                msg.role === 'User' ? 'text-ink/60' : 'text-ink/35'
              }`}>
                {msg.role}
              </span>
              <p className="mt-1 text-sm text-ink/80 leading-relaxed">
                <HighlightedText text={msg.content} query={query} />
              </p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
