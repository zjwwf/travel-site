/**
 * MCP handlers for destination-related operations
 */

import { destinations } from './destinations.js';

// Valid destination categories
const VALID_CATEGORIES = ['island', 'city', 'mountain', 'nature', 'culture'];

/**
 * Handler for listDestinations method
 * Returns simplified destination data: id, name, category, basePrice
 * @returns {Promise<Array>} Array of simplified destinations
 */
export async function listDestinations() {
  return destinations.map(dest => ({
    id: dest.id,
    name: dest.name,
    category: dest.category,
    basePrice: dest.basePrice
  }));
}

/**
 * Handler for searchDestinations method
 * Filters destinations by keyword (name/shortDescription) and/or category
 * @param {object} params - { keyword?: string, category?: string }
 * @returns {Promise<Array>} Filtered array of simplified destinations
 */
export async function searchDestinations(params = {}) {
  const { keyword, category } = params;
  let filtered = destinations;
  
  // Filter by category if provided
  // If category is invalid, return empty results (no error)
  if (category) {
    if (!VALID_CATEGORIES.includes(category)) {
      return [];
    }
    filtered = filtered.filter(dest => dest.category === category);
  }
  
  // Filter by keyword if provided (case-insensitive match in name, id, or shortDescription)
  if (keyword) {
    const lowerKeyword = keyword.toLowerCase();
    filtered = filtered.filter(dest => {
      const nameMatch = dest.name.toLowerCase().includes(lowerKeyword);
      const idMatch = dest.id.toLowerCase().includes(lowerKeyword);
      const descMatch = dest.shortDescription?.toLowerCase().includes(lowerKeyword);
      return nameMatch || idMatch || descMatch;
    });
  }
  
  // Return simplified format
  return filtered.map(dest => ({
    id: dest.id,
    name: dest.name,
    category: dest.category,
    basePrice: dest.basePrice
  }));
}
