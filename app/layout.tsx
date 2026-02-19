import type { Metadata } from 'next';
import { Playfair_Display, Source_Serif_4, JetBrains_Mono } from 'next/font/google';
import './globals.css';

const playfair = Playfair_Display({
  subsets: ['latin'],
  variable: '--font-display',
  display: 'swap',
});

const sourceSerif = Source_Serif_4({
  subsets: ['latin'],
  variable: '--font-body',
  weight: ['300', '400', '600'],
  display: 'swap',
});

const jetbrains = JetBrains_Mono({
  subsets: ['latin'],
  variable: '--font-mono',
  weight: ['400', '500'],
  display: 'swap',
});

export const metadata: Metadata = {
  title: 'Chat Organizer',
  description: 'Paste a conversation, split it into semantic blocks, and search through them.',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${playfair.variable} ${sourceSerif.variable} ${jetbrains.variable}`}>
      <body className="bg-paper font-body text-ink antialiased">{children}</body>
    </html>
  );
}
