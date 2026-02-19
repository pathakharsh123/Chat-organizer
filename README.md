# Chat Organizer

A semantic conversation organizer built with **Next.js 14**, **TypeScript**, and **Tailwind CSS**.

## Live Demo

> Add your deployed URL here after deployment

## Setup

```bash
# 1. Clone the repository
git clone <your-repo-url>
cd chat-organizer

# 2. Install dependencies
npm install

# 3. Run development server
npm run dev

# 4. Open in browser
open http://localhost:3000
```

## Environment Variables

No environment variables are required for the default build (keyword-based categorization).

## How It Works

### Parsing

The conversation text is scanned line-by-line. Lines starting with `User:`, `Human:`, or `You:` are classified as user messages; lines starting with `Assistant:`, `AI:` are classified as assistant messages. Multi-line messages are joined.

### Semantic Categorization

1. Messages are grouped into **exchanges** (a User message + its Assistant reply).
2. Each exchange is scored against **8 category rules** (Pricing Strategy, Competitor Analysis, Sales & Growth, Team Building, Product Strategy, Marketing, Free Trial & Onboarding, Customer Success). Each rule has an associated keyword list.
3. The category with the highest keyword-hit score wins. Ties fall back to "General Discussion".
4. Consecutive exchanges sharing the same category are **merged** into a single block to avoid fragmentation.

This approach is deterministic, fast, and requires no external API — while still producing logically coherent groupings for the kinds of conversations the app is designed for.

### Search

Simple case-insensitive substring matching against both category names and message content. Matching terms are highlighted inline using `<mark>` elements.

### Persistence

Blocks are stored in `localStorage` and rehydrated on page load, so organized conversations survive a page refresh.

## Project Structure

```
chat-organizer/
├── app/
│   ├── globals.css       # Tailwind + custom styles + animations
│   ├── layout.tsx        # Root layout with Google Fonts
│   └── page.tsx          # Main page (state management, two-column layout)
├── components/
│   ├── ChatInput.tsx     # Textarea, ingest button, sample loader
│   ├── SearchBar.tsx     # Search input with stats
│   ├── BlockCard.tsx     # Individual semantic block card with highlighting
│   └── LoadingSkeleton.tsx # Animated loading state
├── lib/
│   └── categorizer.ts    # Core logic: parsing, scoring, block building, filtering
├── types/
│   └── index.ts          # Shared TypeScript types
└── README.md
```

## Assumptions

- Conversations follow a `Role: message` pattern (one role switch per line, with multi-line support).
- The keyword lists cover the most common startup/SaaS conversation topics but can be extended in `categorizer.ts`.

## Future Improvements

- **OpenAI categorization**: Call GPT-4o with the full conversation to get richer, AI-generated categories — especially useful for non-SaaS domains where keyword lists fall short.
- **Drag-to-reorder blocks**: Let users reorganize the semantic groupings manually.
- **Export**: Download blocks as Markdown or JSON.
- **Multi-conversation history**: Store and switch between multiple ingested conversations.
- **Semantic search**: Use embeddings (e.g., `text-embedding-3-small`) for similarity-based retrieval instead of substring matching.
- **Confidence scores**: Show how confident the categorizer is for each block.
