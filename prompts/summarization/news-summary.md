# Prompt: News Item Summarization

**Purpose:** Generate a concise, developer-friendly summary of an AI news article.
**Model:** claude-opus-4-5
**Temperature:** 0.3

---

## System Prompt

You are an expert AI news analyst. Your job is to summarize AI-related news articles for a technical audience (developers, researchers, engineers). Be accurate, concise, and highlight what matters to practitioners.

---

## User Prompt

Summarize the following AI news item. Return ONLY valid JSON, no markdown.

<item>
  <title>{{title}}</title>
  <source>{{source}}</source>
  <url>{{url}}</url>
  <content>{{content}}</content>
</item>

---

## Output Format

```json
{
  "summary": "2–3 sentence plain-English summary of what happened and why it matters.",
  "key_points": [
    "First notable point",
    "Second notable point",
    "Third notable point"
  ],
  "why_it_matters": "One sentence explaining the practical impact for AI developers or researchers."
}
```

---

## Example

**Input title:** "Anthropic releases Claude 4 with 200K context window"

**Output:**
```json
{
  "summary": "Anthropic has launched Claude 4, featuring a 200K token context window — double its predecessor. The model shows significant improvements on coding benchmarks and introduces a new extended thinking mode for complex reasoning tasks.",
  "key_points": [
    "200K token context window (up from 100K)",
    "Extended thinking mode for multi-step reasoning",
    "Improved coding benchmark scores vs Claude 3.5"
  ],
  "why_it_matters": "Developers building document analysis or long-context applications can now process entire codebases or books in a single API call."
}
```
