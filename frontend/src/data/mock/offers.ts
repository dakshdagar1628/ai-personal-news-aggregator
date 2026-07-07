export interface MockOffer {
  id: string; title: string; provider: string; description: string
  url: string; expiresAt?: string; value: string; type: 'credits' | 'free-tier' | 'trial' | 'discount'
}

export const MOCK_OFFERS: MockOffer[] = [
  { id: '1', title: 'Anthropic $5 Free Credits for New Users', provider: 'Anthropic', description: 'New API accounts get $5 in free credits to try Claude models.', url: '#', value: '$5', type: 'credits' },
  { id: '2', title: 'Vercel Hobby Plan — Always Free', provider: 'Vercel', description: 'Deploy unlimited personal projects with serverless functions for free.', url: '#', value: 'Free tier', type: 'free-tier' },
  { id: '3', title: 'GitHub Copilot Free for Students', provider: 'GitHub', description: 'Verified students get GitHub Copilot Pro at no cost through GitHub Education.', url: '#', value: 'Free', type: 'free-tier' },
]
