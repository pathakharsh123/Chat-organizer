import { Message, SemanticBlock } from '@/types';

interface CategoryRule {
  category: string;
  emoji: string;
  color: string;
  keywords: string[];
}

const CATEGORY_RULES: CategoryRule[] = [
  {
    category: 'Pricing Strategy',
    emoji: '💰',
    color: 'accent-primary',
    keywords: [
      'price', 'pricing', 'cost', 'charge', 'fee', 'subscription',
      'tier', 'plan', 'revenue', 'monetize', 'monetization', 'freemium',
      'discount', 'coupon', 'ltv', 'cac', 'margin', 'value-based',
    ],
  },
  {
    category: 'Competitor Analysis',
    emoji: '🔍',
    color: 'accent-secondary',
    keywords: [
      'competitor', 'competition', 'rival', 'market', 'benchmark',
      'compare', 'comparison', 'industry', 'landscape', 'analyze', 'analysis',
      'similarweb', 'g2', 'capterra', 'positioning', 'differentiati',
    ],
  },
  {
    category: 'Sales & Growth',
    emoji: '📈',
    color: 'accent-gold',
    keywords: [
      'sales', 'sell', 'selling', 'growth', 'pipeline', 'lead', 'funnel',
      'conversion', 'close', 'deal', 'outreach', 'prospect', 'quota',
      'revenue', 'arr', 'mrr', 'churn', 'retention', 'upsell',
    ],
  },
  {
    category: 'Team Building',
    emoji: '👥',
    color: 'blue-500',
    keywords: [
      'hire', 'hiring', 'team', 'staff', 'employee', 'headcount', 'role',
      'account executive', 'sdr', 'vp', 'manager', 'founder', 'recruit',
      'onboard', 'culture', 'organization', 'structure', 'talent',
    ],
  },
  {
    category: 'Product Strategy',
    emoji: '🚀',
    color: 'purple-500',
    keywords: [
      'product', 'feature', 'roadmap', 'launch', 'mvp', 'iteration',
      'feedback', 'user', 'customer', 'experience', 'ux', 'design',
      'build', 'develop', 'release', 'sprint', 'agile',
    ],
  },
  {
    category: 'Marketing',
    emoji: '📣',
    color: 'pink-500',
    keywords: [
      'market', 'marketing', 'brand', 'content', 'seo', 'ads', 'campaign',
      'social', 'email', 'newsletter', 'traffic', 'acquisition', 'awareness',
      'inbound', 'outbound', 'landing page', 'copy', 'messaging',
    ],
  },
  {
    category: 'Free Trial & Onboarding',
    emoji: '🎯',
    color: 'teal-500',
    keywords: [
      'free trial', 'trial', 'freemium', 'onboard', 'onboarding', 'signup',
      'demo', 'credit card', 'activation', 'setup', 'getting started',
    ],
  },
  {
    category: 'Customer Success',
    emoji: '⭐',
    color: 'yellow-500',
    keywords: [
      'customer success', 'support', 'satisfaction', 'nps', 'review',
      'churn', 'retain', 'retention', 'renewal', 'account management',
      'feedback', 'complaint', 'escalation',
    ],
  },
];

const DEFAULT_CATEGORY: CategoryRule = {
  category: 'General Discussion',
  emoji: '💬',
  color: 'gray-500',
  keywords: [],
};

/**
 * Parse raw conversation text into Message objects.
 * Handles formats like:
 *   "User: ..."
 *   "Assistant: ..."
 *   "Human: ..."
 *   "AI: ..."
 */
export function parseConversation(text: string): Message[] {
  const lines = text.split('\n').filter((l) => l.trim());
  const messages: Message[] = [];
  let currentRole: 'User' | 'Assistant' | null = null;
  let currentContent: string[] = [];

  const flush = () => {
    if (currentRole && currentContent.length > 0) {
      messages.push({ role: currentRole, content: currentContent.join(' ').trim() });
      currentContent = [];
    }
  };

  for (const line of lines) {
    const userMatch = line.match(/^(User|Human|You)\s*:\s*/i);
    const assistantMatch = line.match(/^(Assistant|AI|Bot|Claude|GPT)\s*:\s*/i);

    if (userMatch) {
      flush();
      currentRole = 'User';
      currentContent.push(line.replace(userMatch[0], '').trim());
    } else if (assistantMatch) {
      flush();
      currentRole = 'Assistant';
      currentContent.push(line.replace(assistantMatch[0], '').trim());
    } else if (currentRole) {
      currentContent.push(line.trim());
    }
  }

  flush();
  return messages;
}

/**
 * Score a text against a category's keywords.
 */
function scoreText(text: string, keywords: string[]): number {
  const lower = text.toLowerCase();
  return keywords.reduce((score, kw) => {
    return lower.includes(kw.toLowerCase()) ? score + 1 : score;
  }, 0);
}

/**
 * Group consecutive messages into exchanges (User + Assistant pairs).
 * Returns arrays of indices into the messages array.
 */
function groupIntoExchanges(messages: Message[]): number[][] {
  const exchanges: number[][] = [];
  let i = 0;
  while (i < messages.length) {
    const group: number[] = [];
    // Collect a user message and its assistant reply
    if (messages[i]?.role === 'User') {
      group.push(i++);
      if (i < messages.length && messages[i]?.role === 'Assistant') {
        group.push(i++);
      }
    } else if (messages[i]?.role === 'Assistant') {
      group.push(i++);
    } else {
      i++;
    }
    if (group.length > 0) exchanges.push(group);
  }
  return exchanges;
}

/**
 * Categorize a single exchange of messages.
 */
function categorizeExchange(exchangeMessages: Message[]): CategoryRule {
  const combinedText = exchangeMessages.map((m) => m.content).join(' ');
  let bestScore = 0;
  let bestCategory = DEFAULT_CATEGORY;

  for (const rule of CATEGORY_RULES) {
    const score = scoreText(combinedText, rule.keywords);
    if (score > bestScore) {
      bestScore = score;
      bestCategory = rule;
    }
  }

  return bestCategory;
}

/**
 * Main function: parse text → semantic blocks.
 * Merges consecutive exchanges that belong to the same category.
 */
export function buildSemanticBlocks(rawText: string): SemanticBlock[] {
  const messages = parseConversation(rawText);
  if (messages.length === 0) return [];

  const exchanges = groupIntoExchanges(messages);

  // Assign a category to each exchange
  const categorized: Array<{ rule: CategoryRule; indices: number[] }> = exchanges.map((idxs) => ({
    rule: categorizeExchange(idxs.map((i) => messages[i])),
    indices: idxs,
  }));

  // Merge consecutive exchanges with the same category
  const merged: Array<{ rule: CategoryRule; indices: number[] }> = [];
  for (const item of categorized) {
    const last = merged[merged.length - 1];
    if (last && last.rule.category === item.rule.category) {
      last.indices.push(...item.indices);
    } else {
      merged.push({ rule: item.rule, indices: [...item.indices] });
    }
  }

  return merged.map((item, idx) => ({
    id: `block-${idx}`,
    category: item.rule.category,
    emoji: item.rule.emoji,
    color: item.rule.color,
    messages: item.indices.map((i) => messages[i]),
    keywords: item.rule.keywords,
  }));
}

/**
 * Filter blocks by search query (case-insensitive text match).
 */
export function filterBlocks(blocks: SemanticBlock[], query: string): SemanticBlock[] {
  if (!query.trim()) return blocks;
  const lower = query.toLowerCase();
  return blocks.filter(
    (block) =>
      block.category.toLowerCase().includes(lower) ||
      block.messages.some((m) => m.content.toLowerCase().includes(lower))
  );
}

/**
 * Highlight occurrences of query inside text. Returns array of {text, highlight} segments.
 */
export function highlightText(
  text: string,
  query: string
): Array<{ text: string; highlight: boolean }> {
  if (!query.trim()) return [{ text, highlight: false }];
  const regex = new RegExp(`(${query.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')})`, 'gi');
  const parts = text.split(regex);
  return parts.map((part) => ({
    text: part,
    highlight: regex.test(part),
  }));
}
