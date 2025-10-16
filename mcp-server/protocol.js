/**
 * MCP protocol handler for request/response envelopes
 * Envelope format: { id, method, params?, result?, error? }
 * Error format: { code, message }
 */

/**
 * Create a success response
 * @param {number|string|null} id - Request ID
 * @param {any} result - Result data
 * @returns {object} Response envelope
 */
export function createSuccessResponse(id, result) {
  return {
    id,
    result
  };
}

/**
 * Create an error response
 * @param {number|string|null} id - Request ID
 * @param {string} code - Error code
 * @param {string} message - Error message
 * @returns {object} Error response envelope
 */
export function createErrorResponse(id, code, message) {
  return {
    id,
    error: {
      code,
      message
    }
  };
}

/**
 * Parse and validate incoming request
 * @param {string} line - Raw input line
 * @returns {{ valid: boolean, request?: object, error?: object }}
 */
export function parseRequest(line) {
  try {
    const request = JSON.parse(line);
    
    // Check if method is present
    if (!request.method) {
      return {
        valid: false,
        error: createErrorResponse(
          request.id ?? null,
          'BAD_REQUEST',
          'Missing required field: method'
        )
      };
    }
    
    return {
      valid: true,
      request
    };
  } catch (e) {
    return {
      valid: false,
      error: createErrorResponse(
        null,
        'BAD_REQUEST',
        'Invalid JSON input'
      )
    };
  }
}

/**
 * Route request to appropriate handler
 * @param {object} request - Parsed request
 * @param {object} handlers - Map of method names to handler functions
 * @returns {Promise<object>} Response envelope
 */
export async function routeRequest(request, handlers) {
  const { id, method, params } = request;
  
  // Check if handler exists for this method
  if (!handlers[method]) {
    return createErrorResponse(
      id,
      'METHOD_NOT_FOUND',
      `Unknown method: ${method}`
    );
  }
  
  try {
    const result = await handlers[method](params || {});
    return createSuccessResponse(id, result);
  } catch (error) {
    return createErrorResponse(
      id,
      'INTERNAL_ERROR',
      error.message || 'Internal server error'
    );
  }
}
