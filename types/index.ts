export interface Message {
  role: 'User' | 'Assistant';
  content: string;
}

export interface SemanticBlock {
  id: string;
  category: string;
  emoji: string;
  color: string;
  messages: Message[];
  keywords: string[];
}
