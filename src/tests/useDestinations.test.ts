import { describe, it, expect } from 'vitest';
import { useDestinations } from '../composables/useDestinations';
import { destinations } from '../data/destinations';

describe('useDestinations composable', () => {
  it('filters by search term', () => {
    const { search, filtered } = useDestinations();
    search.value = destinations[0].name.slice(0,2);
    expect(filtered.value.length).toBeGreaterThanOrEqual(1);
  });
  it('filters by category', () => {
    const { category, filtered } = useDestinations();
    category.value = 'island';
    expect(filtered.value.every(d => d.category === 'island')).toBe(true);
  });
});
