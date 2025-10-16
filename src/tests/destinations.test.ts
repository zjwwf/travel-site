import { describe, it, expect } from 'vitest';
import { destinations } from '../data/destinations';

describe('destinations data', () => {
  it('should have at least 3 destinations', () => {
    expect(destinations.length).toBeGreaterThanOrEqual(3);
  });
  it('each destination has required fields', () => {
    for (const d of destinations) {
      expect(d.id).toBeTruthy();
      expect(d.name).toBeTruthy();
      expect(d.imageUrl).toMatch(/^https:\/\//);
    }
  });
});
