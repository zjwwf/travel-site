/**
 * Tests for MCP server protocol and handlers
 */

import { describe, it, expect } from 'vitest';
import { parseRequest, createSuccessResponse, createErrorResponse, routeRequest } from '../protocol.js';
import { listDestinations, searchDestinations } from '../handlers.js';

describe('MCP Protocol', () => {
  describe('parseRequest', () => {
    it('should parse valid request', () => {
      const result = parseRequest('{"id":1,"method":"test"}');
      expect(result.valid).toBe(true);
      expect(result.request).toEqual({ id: 1, method: 'test' });
    });

    it('should return error for invalid JSON', () => {
      const result = parseRequest('not json');
      expect(result.valid).toBe(false);
      expect(result.error.error.code).toBe('BAD_REQUEST');
      expect(result.error.error.message).toBe('Invalid JSON input');
    });

    it('should return error for missing method', () => {
      const result = parseRequest('{}');
      expect(result.valid).toBe(false);
      expect(result.error.error.code).toBe('BAD_REQUEST');
      expect(result.error.error.message).toContain('method');
    });

    it('should handle request with id null', () => {
      const result = parseRequest('{"method":"test"}');
      expect(result.valid).toBe(true);
    });
  });

  describe('createSuccessResponse', () => {
    it('should create response with result', () => {
      const response = createSuccessResponse(1, { data: 'test' });
      expect(response).toEqual({
        id: 1,
        result: { data: 'test' }
      });
    });
  });

  describe('createErrorResponse', () => {
    it('should create error response', () => {
      const response = createErrorResponse(1, 'TEST_ERROR', 'Test message');
      expect(response).toEqual({
        id: 1,
        error: {
          code: 'TEST_ERROR',
          message: 'Test message'
        }
      });
    });
  });

  describe('routeRequest', () => {
    it('should route to handler and return success', async () => {
      const handlers = {
        test: async () => ({ success: true })
      };
      const response = await routeRequest({ id: 1, method: 'test' }, handlers);
      expect(response.id).toBe(1);
      expect(response.result).toEqual({ success: true });
    });

    it('should return error for unknown method', async () => {
      const handlers = {};
      const response = await routeRequest({ id: 1, method: 'unknown' }, handlers);
      expect(response.id).toBe(1);
      expect(response.error.code).toBe('METHOD_NOT_FOUND');
    });

    it('should handle handler errors', async () => {
      const handlers = {
        failing: async () => { throw new Error('Handler failed'); }
      };
      const response = await routeRequest({ id: 1, method: 'failing' }, handlers);
      expect(response.id).toBe(1);
      expect(response.error.code).toBe('INTERNAL_ERROR');
    });
  });
});

describe('MCP Handlers', () => {
  describe('listDestinations', () => {
    it('should return array of destinations', async () => {
      const result = await listDestinations();
      expect(Array.isArray(result)).toBe(true);
      expect(result.length).toBeGreaterThan(0);
    });

    it('should return simplified fields', async () => {
      const result = await listDestinations();
      const first = result[0];
      expect(first).toHaveProperty('id');
      expect(first).toHaveProperty('name');
      expect(first).toHaveProperty('category');
      expect(first).toHaveProperty('basePrice');
      // Should not have full fields
      expect(first).not.toHaveProperty('description');
      expect(first).not.toHaveProperty('imageUrl');
    });
  });

  describe('searchDestinations', () => {
    it('should return all destinations with no params', async () => {
      const result = await searchDestinations({});
      expect(result.length).toBeGreaterThan(0);
    });

    it('should filter by keyword (id match)', async () => {
      const result = await searchDestinations({ keyword: 'mal' });
      expect(result.length).toBeGreaterThan(0);
      expect(result[0].id).toBe('maldives');
    });

    it('should filter by keyword (name match)', async () => {
      const result = await searchDestinations({ keyword: '马尔' });
      expect(result.length).toBeGreaterThan(0);
      expect(result[0].name).toContain('马尔');
    });

    it('should filter by keyword (description match)', async () => {
      const result = await searchDestinations({ keyword: '印度洋' });
      expect(result.length).toBeGreaterThan(0);
    });

    it('should be case-insensitive', async () => {
      const result = await searchDestinations({ keyword: 'MAL' });
      expect(result.length).toBeGreaterThan(0);
    });

    it('should filter by category', async () => {
      const result = await searchDestinations({ category: 'island' });
      expect(result.every(d => d.category === 'island')).toBe(true);
    });

    it('should return empty for invalid category', async () => {
      const result = await searchDestinations({ category: 'invalid' });
      expect(result).toEqual([]);
    });

    it('should combine keyword and category filters', async () => {
      const result = await searchDestinations({ keyword: '文化', category: 'culture' });
      expect(result.length).toBeGreaterThan(0);
      expect(result.every(d => d.category === 'culture')).toBe(true);
    });

    it('should return empty when filters match nothing', async () => {
      const result = await searchDestinations({ keyword: 'xyz123notfound' });
      expect(result).toEqual([]);
    });
  });
});
