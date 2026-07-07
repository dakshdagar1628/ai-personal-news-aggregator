export interface MockPaper {
  id: string; title: string; authors: string[]; abstract: string
  url: string; publishedAt: string; category: string; stars?: number
}

export const MOCK_PAPERS: MockPaper[] = [
  { id: '1', title: 'Scaling Laws for Neural Language Models', authors: ['J. Kaplan', 'S. McCandlish'], abstract: 'We study empirical scaling laws for language model performance on cross-entropy loss, finding power-law relationships.', url: '#', publishedAt: '2026-07-05T00:00:00Z', category: 'LLM Theory', stars: 2341 },
  { id: '2', title: 'Chain-of-Thought Prompting Elicits Reasoning in Large Language Models', authors: ['J. Wei', 'X. Wang'], abstract: 'We explore how generating a chain of thought can significantly improve performance on complex reasoning tasks.', url: '#', publishedAt: '2026-07-04T00:00:00Z', category: 'Prompting', stars: 1876 },
  { id: '3', title: 'LoRA: Low-Rank Adaptation of Large Language Models', authors: ['E. Hu', 'Y. Shen'], abstract: 'We propose LoRA, which freezes pretrained model weights and injects trainable rank decomposition matrices.', url: '#', publishedAt: '2026-07-03T00:00:00Z', category: 'Fine-tuning', stars: 3102 },
]
