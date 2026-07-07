export interface MockVideo {
  id: string; title: string; channel: string; thumbnail: string
  url: string; publishedAt: string; duration: string; views: string
}

export const MOCK_VIDEOS: MockVideo[] = [
  { id: '1', title: 'Building AI Agents with Claude 4 — Full Tutorial', channel: 'Andrej Karpathy', thumbnail: '', url: '#', publishedAt: '2026-07-06T10:00:00Z', duration: '45:12', views: '124K' },
  { id: '2', title: 'MCP Servers Explained: The Future of AI Tools', channel: 'Fireship', thumbnail: '', url: '#', publishedAt: '2026-07-05T16:00:00Z', duration: '8:34', views: '89K' },
  { id: '3', title: 'GPT-5 vs Claude 4 — Real-World Benchmark Comparison', channel: 'Two Minute Papers', thumbnail: '', url: '#', publishedAt: '2026-07-04T12:00:00Z', duration: '12:45', views: '201K' },
]
