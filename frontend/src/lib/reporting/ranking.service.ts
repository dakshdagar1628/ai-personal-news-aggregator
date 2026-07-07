export interface RankInput {
  importance_score: number;
  developer_score:  number;
  learning_score:   number;
  business_score:   number;
  urgency_score:    number;
  innovation_score: number;
  confidence_score: number;
}

const WEIGHTS = {
  importance: 0.30,
  developer:  0.25,
  urgency:    0.15,
  innovation: 0.15,
  learning:   0.10,
  confidence: 0.05,
};

export function rankScore(s: Partial<RankInput>): number {
  return Math.round(
    (s.importance_score ?? 50) * WEIGHTS.importance +
    (s.developer_score  ?? 50) * WEIGHTS.developer  +
    (s.urgency_score    ?? 50) * WEIGHTS.urgency     +
    (s.innovation_score ?? 50) * WEIGHTS.innovation  +
    (s.learning_score   ?? 50) * WEIGHTS.learning    +
    (s.confidence_score ?? 50) * WEIGHTS.confidence
  );
}

export function sortByRank<T extends Partial<RankInput>>(items: T[]): T[] {
  return [...items].sort((a, b) => rankScore(b) - rankScore(a));
}
