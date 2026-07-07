---
version: "1.0.0"
name: language
maxTokens: 64
temperature: 0
---
Detect the language of this text. Return JSON only.

Text: {{text}}

Return:
{
  "language": "en",
  "confidence": 0.99
}
