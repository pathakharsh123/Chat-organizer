'use client';

interface SearchBarProps {
  query: string;
  onQueryChange: (q: string) => void;
  totalBlocks: number;
  matchedBlocks: number;
}

export default function SearchBar({ query, onQueryChange, totalBlocks, matchedBlocks }: SearchBarProps) {
  return (
    <div className="w-full">
      <div className="flex items-baseline gap-3 mb-4">
        <h2 className="font-display text-2xl font-bold text-ink">Search Blocks</h2>
        <span className="text-xs font-mono text-ink/40 uppercase tracking-widest">Step 03</span>
      </div>

      <div className="relative flex items-center">
        {/* Search icon */}
        <span className="absolute left-3.5 text-ink/40 pointer-events-none">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
            <circle cx="11" cy="11" r="8" />
            <path d="m21 21-4.35-4.35" />
          </svg>
        </span>

        <input
          type="text"
          value={query}
          onChange={(e) => onQueryChange(e.target.value)}
          placeholder="Search by topic or keyword…"
          className="w-full pl-10 pr-10 py-3 bg-paper-soft border-2 border-ink/10 rounded-lg
            font-mono text-sm text-ink placeholder:text-ink/30
            focus:border-accent-primary/60 transition-all duration-200"
        />

        {query && (
          <button
            onClick={() => onQueryChange('')}
            className="absolute right-3 text-ink/30 hover:text-ink/60 transition-colors"
          >
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
              <path d="M18 6 6 18M6 6l12 12" />
            </svg>
          </button>
        )}
      </div>

      {/* Stats */}
      <div className="mt-2 flex items-center gap-2 text-xs font-mono text-ink/40">
        {query ? (
          <>
            <span className={matchedBlocks === 0 ? 'text-accent-primary' : 'text-accent-secondary'}>
              {matchedBlocks}
            </span>
            <span>of {totalBlocks} blocks match</span>
            {matchedBlocks === 0 && <span className="text-accent-primary">— no results found</span>}
          </>
        ) : (
          <span>{totalBlocks} blocks total</span>
        )}
      </div>
    </div>
  );
}
