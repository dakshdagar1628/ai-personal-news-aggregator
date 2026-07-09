import fs from 'fs';
import path from 'path';

interface PromptMeta { version: string; name: string; maxTokens?: number; temperature?: number; }
interface LoadedPrompt extends PromptMeta { template: string; }

const cache = new Map<string, LoadedPrompt>();

export function loadPrompt(name: string): LoadedPrompt {
  if (cache.has(name)) return cache.get(name)!;
  const filePath = path.join(process.cwd(), 'src/lib/ai/prompts', `${name}.md`);
  const raw = fs.readFileSync(filePath, 'utf-8');
  const match = raw.match(/^---\r?\n([\s\S]*?)\r?\n---\r?\n([\s\S]*)$/);
  if (!match) throw new Error(`Invalid prompt format: ${name}`);
  const meta: Record<string, string | number> = {};
  for (const line of match[1].split(/\r?\n/)) {
    const [k, ...v] = line.split(':');
    if (k && v.length) {
      const val = v.join(':').trim().replace(/^"|"$/g, '');
      meta[k.trim()] = isNaN(Number(val)) ? val : Number(val);
    }
  }
  const prompt: LoadedPrompt = {
    version:     String(meta.version ?? '1.0.0'),
    name:        String(meta.name ?? name),
    maxTokens:   meta.maxTokens as number | undefined,
    temperature: meta.temperature as number | undefined,
    template:    match[2].trim(),
  };
  cache.set(name, prompt);
  return prompt;
}

export function renderPrompt(name: string, vars: Record<string, string | number | undefined>): { text: string; maxTokens?: number; temperature?: number; version: string } {
  const prompt = loadPrompt(name);
  let text = prompt.template;
  for (const [k, v] of Object.entries(vars)) {
    text = text.replaceAll(`{{${k}}}`, String(v ?? ''));
  }
  return { text, maxTokens: prompt.maxTokens, temperature: prompt.temperature, version: prompt.version };
}
