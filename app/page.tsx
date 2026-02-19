'use client';

import { useState, useCallback, useEffect } from 'react';
import ChatInput from '@/components/ChatInput';
import SearchBar from '@/components/SearchBar';
import BlockCard from '@/components/BlockCard';
import LoadingSkeleton from '@/components/LoadingSkeleton';
import { buildSemanticBlocks } from '@/lib/categorizer';
import { SemanticBlock } from '@/types';

const STORAGE_KEY = 'chat_organizer_blocks';

export default function Home() {
  const [blocks, setBlocks] = useState<SemanticBlock[]>([]);
  const [query, setQuery] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [hasIngested, setHasIngested] = useState(false);

  // Load persisted blocks from localStorage on mount
  useEffect(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) {
        const parsed = JSON.parse(saved) as SemanticBlock[];
        if (Array.isArray(parsed) && parsed.length > 0) {
          setBlocks(parsed);
          setHasIngested(true);
        }
      }
    } catch {
      // ignore
    }
  }, []);

  const handleIngest = useCallback((text: string) => {
    setIsLoading(true);
    setQuery('');

    // Simulate async processing for UX (gives loading skeleton time to show)
    setTimeout(() => {
      try {
        const result = buildSemanticBlocks(text);
        setBlocks(result);
        setHasIngested(true);
        // Persist to localStorage
        localStorage.setItem(STORAGE_KEY, JSON.stringify(result));
      } catch (err) {
        console.error('Failed to parse conversation:', err);
        setBlocks([]);
      } finally {
        setIsLoading(false);
      }
    }, 600);
  }, []);

  // Filter blocks by search query
  const filteredBlocks = query.trim()
    ? blocks.filter(
        (block) =>
          block.category.toLowerCase().includes(query.toLowerCase()) ||
          block.messages.some((m) =>
            m.content.toLowerCase().includes(query.toLowerCase())
          )
      )
    : blocks;

  const handleClearAll = () => {
    setBlocks([]);
    setHasIngested(false);
    setQuery('');
    localStorage.removeItem(STORAGE_KEY);
  };

  return (
    <div className="min-h-screen bg-paper">
      {/* Decorative top bar */}
      <div className="h-1.5 bg-gradient-to-r from-accent-primary via-accent-gold to-accent-secondary" />

      {/* Header */}
      <header className="border-b border-ink/8 bg-paper-warm/50 backdrop-blur-sm sticky top-0 z-10">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 py-4 flex items-center justify-between">
          <div className="flex items-baseline gap-3">
            <h1 className="font-display text-2xl font-bold text-ink">
              Chat<span className="text-accent-primary">Organizer</span>
            </h1>
          </div>
          {hasIngested && (
            <button
              onClick={handleClearAll}
              className="text-xs font-mono text-ink/40 hover:text-accent-primary transition-colors px-3 py-1.5 rounded-lg hover:bg-accent-primary/5"
            >
              ↺ Start over
            </button>
          )}
        </div>
      </header>

      <main className="max-w-6xl mx-auto px-4 sm:px-6 py-8 md:py-12">
        {/* Two-column layout on large screens */}
        <div className="grid grid-cols-1 lg:grid-cols-[1fr_1.6fr] gap-8 lg:gap-12 items-start">

          {/* Left column: Input */}
          <div className="lg:sticky lg:top-24">
            <ChatInput onIngest={handleIngest} isLoading={isLoading} />

            {/* Divider with label */}
            {hasIngested && (
              <div className="mt-8 pt-8 border-t border-ink/10">
                <SearchBar
                  query={query}
                  onQueryChange={setQuery}
                  totalBlocks={blocks.length}
                  matchedBlocks={filteredBlocks.length}
                />
              </div>
            )}

            {/* Tips */}
            {!hasIngested && (
              <div className="mt-8 p-4 bg-paper-warm rounded-xl border border-ink/8">
                <p className="text-xs font-mono text-ink/40 uppercase tracking-widest mb-3">How it works</p>
                <ol className="space-y-2">
                  {[
                    'Paste your User/Assistant conversation',
                    'Click "Ingest & Organize"',
                    'Browse semantic blocks by topic',
                    'Use search to find specific content',
                  ].map((step, i) => (
                    <li key={i} className="flex items-start gap-2.5 text-sm text-ink/60">
                      <span className="flex-shrink-0 w-5 h-5 rounded-full bg-ink/8 flex items-center justify-center text-xs font-mono font-bold text-ink/40 mt-0.5">
                        {i + 1}
                      </span>
                      {step}
                    </li>
                  ))}
                </ol>
              </div>
            )}
          </div>

          {/* Right column: Blocks */}
          <div>
            {!hasIngested && !isLoading ? (
              /* Empty state */
              <div className="flex flex-col items-center justify-center py-20 text-center">
                <div className="w-20 h-20 rounded-2xl bg-paper-warm border-2 border-ink/8 flex items-center justify-center text-3xl mb-5">
                  🗂️
                </div>
                <h3 className="font-display text-xl font-bold text-ink/60 mb-2">
                  No blocks yet
                </h3>
                <p className="text-sm text-ink/40 max-w-xs leading-relaxed">
                  Paste a conversation on the left and click "Ingest & Organize" to see semantic blocks appear here.
                </p>
              </div>
            ) : isLoading ? (
              /* Loading */
              <div>
                <div className="flex items-baseline gap-3 mb-6">
                  <h2 className="font-display text-2xl font-bold text-ink">Semantic Blocks</h2>
                  <span className="text-xs font-mono text-ink/40 uppercase tracking-widest">Step 02</span>
                </div>
                <LoadingSkeleton />
              </div>
            ) : (
              /* Blocks */
              <div>
                <div className="flex items-baseline gap-3 mb-6">
                  <h2 className="font-display text-2xl font-bold text-ink">Semantic Blocks</h2>
                  <span className="text-xs font-mono text-ink/40 uppercase tracking-widest">Step 02</span>
                </div>

                {filteredBlocks.length === 0 ? (
                  <div className="text-center py-12">
                    <div className="text-4xl mb-3">🔍</div>
                    <p className="font-display text-lg text-ink/50">No blocks match your search</p>
                    <p className="text-sm text-ink/35 mt-1">Try a different keyword</p>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {filteredBlocks.map((block, idx) => (
                      <BlockCard
                        key={block.id}
                        block={block}
                        index={idx}
                        query={query}
                        isFiltered={!!query}
                      />
                    ))}
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="mt-20 border-t border-ink/8 py-6 text-center">
        <p className="text-xs font-mono text-ink/25">
          Built with Next.js, TypeScript & Tailwind CSS
        </p>
      </footer>
    </div>
  );
}
