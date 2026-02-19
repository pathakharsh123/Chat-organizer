'use client';

import { useState } from 'react';

const SAMPLE_CONVERSATION = `User: How should I price my new SaaS product?
Assistant: For SaaS pricing, consider value-based pricing. Analyze what value your product provides to customers and price accordingly. Research shows companies using value-based pricing grow 20% faster. Start with 3 pricing tiers: Basic, Professional, and Enterprise.

User: What's a good starting price point?
Assistant: For B2B SaaS, typical starting prices range from $29-99/month for basic plans. Consider your customer acquisition cost (CAC) and lifetime value (LTV). Your price should allow for a healthy LTV:CAC ratio of at least 3:1.

User: How do I analyze competitors?
Assistant: Start by identifying your top 5 competitors. Create a spreadsheet comparing: pricing models, features, target customers, and positioning. Use tools like SimilarWeb to estimate their traffic and market share. Look at their review sites like G2 and Capterra to understand customer pain points.

User: Should I offer a free trial?
Assistant: Yes, free trials are standard in SaaS. 14-day trials are most common. Studies show 30-day trials don't significantly increase conversion rates. Require a credit card for higher-quality leads, or offer "freemium" to maximize top-of-funnel.

User: How do I structure my early sales team?
Assistant: For early-stage startups, start with founder-led sales. Once you hit $100K ARR, hire your first Account Executive. At $500K ARR, add a Sales Development Rep (SDR) for lead qualification. Don't hire a VP of Sales until you've proven the sales process works and hit $1-2M ARR.`;

interface ChatInputProps {
  onIngest: (text: string) => void;
  isLoading: boolean;
}

export default function ChatInput({ onIngest, isLoading }: ChatInputProps) {
  const [text, setText] = useState('');
  const [error, setError] = useState('');

  const handleIngest = () => {
    if (!text.trim()) {
      setError('Please paste a conversation before organizing.');
      return;
    }
    if (!text.includes(':')) {
      setError('Conversation should contain "User:" and "Assistant:" prefixes.');
      return;
    }
    setError('');
    onIngest(text);
  };

  const handleLoadSample = () => {
    setText(SAMPLE_CONVERSATION);
    setError('');
  };

  return (
    <div className="w-full">
      {/* Header */}
      <div className="mb-6">
        <div className="flex items-baseline gap-3 mb-1">
          <h2 className="font-display text-2xl font-bold text-ink">Paste Conversation</h2>
          <span className="text-xs font-mono text-ink/40 uppercase tracking-widest">Step 01</span>
        </div>
        <p className="text-ink/60 text-sm leading-relaxed">
          Format each line as{' '}
          <code className="font-mono text-xs bg-paper-warm px-1.5 py-0.5 rounded text-accent-primary">
            User:
          </code>{' '}
          or{' '}
          <code className="font-mono text-xs bg-paper-warm px-1.5 py-0.5 rounded text-accent-primary">
            Assistant:
          </code>{' '}
          followed by the message.
        </p>
      </div>

      {/* Textarea */}
      <div className="relative">
        <textarea
          value={text}
          onChange={(e) => {
            setText(e.target.value);
            if (error) setError('');
          }}
          placeholder={"User: How do I price my SaaS product?\nAssistant: Consider value-based pricing...\nUser: What about competitors?\nAssistant: Research your top 5 rivals..."}
          className={`
            w-full h-64 md:h-80 p-4 resize-none
            bg-paper-soft border-2 rounded-lg
            font-mono text-sm text-ink leading-relaxed
            placeholder:text-ink/25
            transition-all duration-200
            ${error ? 'border-accent-primary' : 'border-ink/10 focus:border-accent-primary/60'}
          `}
        />
        {/* Character count */}
        <span className="absolute bottom-3 right-3 text-xs font-mono text-ink/30">
          {text.length} chars
        </span>
      </div>

      {/* Error */}
      {error && (
        <p className="mt-2 text-sm text-accent-primary font-mono flex items-center gap-1.5">
          <span>⚠</span> {error}
        </p>
      )}

      {/* Actions */}
      <div className="mt-4 flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
        <button
          onClick={handleIngest}
          disabled={isLoading}
          className={`
            flex-1 sm:flex-none sm:min-w-[200px] px-6 py-3 rounded-lg
            font-display font-bold text-base tracking-wide
            transition-all duration-200
            ${isLoading
              ? 'bg-ink/30 text-paper/60 cursor-not-allowed'
              : 'bg-ink text-paper hover:bg-accent-primary hover:-translate-y-0.5 hover:shadow-lg active:translate-y-0'
            }
          `}
        >
          {isLoading ? (
            <span className="flex items-center justify-center gap-2">
              <svg className="animate-spin w-4 h-4" viewBox="0 0 24 24" fill="none">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z" />
              </svg>
              Organizing…
            </span>
          ) : (
            '⚡ Ingest & Organize'
          )}
        </button>

        <button
          onClick={handleLoadSample}
          disabled={isLoading}
          className="px-4 py-3 rounded-lg border-2 border-ink/20 text-ink/60 text-sm font-mono
            hover:border-accent-primary/60 hover:text-accent-primary transition-all duration-200"
        >
          Load Sample
        </button>

        {text && (
          <button
            onClick={() => { setText(''); setError(''); }}
            disabled={isLoading}
            className="px-4 py-3 rounded-lg border-2 border-ink/10 text-ink/40 text-sm font-mono
              hover:border-ink/30 hover:text-ink/60 transition-all duration-200"
          >
            Clear
          </button>
        )}
      </div>
    </div>
  );
}
