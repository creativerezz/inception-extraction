// Placeholder identity. Swap these for your own product; the extracted
// design system is brand-neutral apart from the logo artwork, which is not bundled.
export const brand = {
  name: 'Chat',
  tagline: 'Fast answers, resolved as you type',
  ctaLabel: 'Try our API',
  ctaHref: '#api',
  legal: { terms: '#terms', privacy: '#privacy' },
}

export const playgrounds = [
  { key: 'voice', title: 'Voice', description: 'Call a realtime voice agent', href: '#voice' },
  { key: 'search', title: 'Search', description: 'Watch a retrieval pipeline run', href: '#search' },
  { key: 'decide', title: 'Decide', description: 'Classify and score in milliseconds', href: '#decide' },
] as const

export type PlaygroundKey = (typeof playgrounds)[number]['key']
