import type { CollectorDefinition, CollectorRegistry, ScheduleKey } from './collector-types';
import registryData from './collector-registry.json';

const registry = registryData as CollectorRegistry;

export function getRegistry(): CollectorRegistry {
  return registry;
}

export function getAllCollectors(): CollectorDefinition[] {
  return registry.collectors;
}

export function getEnabledCollectors(): CollectorDefinition[] {
  return registry.collectors.filter(c => c.enabled);
}

export function getCollectorById(id: string): CollectorDefinition | undefined {
  return registry.collectors.find(c => c.id === id);
}

export function getCollectorBySlug(slug: string): CollectorDefinition | undefined {
  return registry.collectors.find(c => c.slug === slug);
}

export function getCollectorsByGroup(group: string): CollectorDefinition[] {
  return registry.collectors.filter(c => c.group === group);
}

export function getCronForCollector(id: string): string | null {
  const c = getCollectorById(id);
  if (!c) return null;
  return registry.schedules[c.scheduleKey as ScheduleKey] ?? null;
}

export function getSchedules(): Record<ScheduleKey, string> {
  return registry.schedules;
}
