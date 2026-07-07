---
version: "1.0.0"
name: recommendation
maxTokens: 512
temperature: 0.2
---
Based on this article, recommend developer actions. Return JSON only.

Title: {{title}}
Summary: {{summary}}
Categories: {{categories}}
Scores: importance={{importance_score}}, developer={{developer_score}}, learning={{learning_score}}

Return:
{
  "recommended_action": "primary action: should_read | should_watch | should_install | should_star | should_learn | should_ignore",
  "action_explanation": "one sentence explaining the primary recommendation",
  "action_details": {
    "read": true,
    "watch": false,
    "install": false,
    "star": false,
    "learn": false,
    "ignore": false,
    "reasons": {
      "read": "why or why not",
      "install": "why or why not",
      "learn": "why or why not"
    }
  }
}
