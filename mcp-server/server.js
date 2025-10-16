#!/usr/bin/env node
import { stdin as input, stdout as output, stderr as error } from 'node:process';
import { parseRequest, routeRequest } from './protocol.js';
import { listDestinations, searchDestinations } from './handlers.js';

// Minimal MCP-like stdio server with destination business logic
// Supports: listDestinations, searchDestinations

function log(msg) {
  error.write(`[mcp-server] ${msg}\n`);
}

log('Starting travel-site MCP server');

// Register method handlers
const handlers = {
  listDestinations,
  searchDestinations
};

// Simple line buffer
let buffer = '';
input.on('data', (chunk) => {
  buffer += chunk.toString();
  if (buffer.includes('\n')) {
    const lines = buffer.split('\n');
    buffer = lines.pop();
    for (const line of lines) {
      const trimmed = line.trim();
      if (!trimmed) continue;
      
      // Parse request
      const parseResult = parseRequest(trimmed);
      
      if (!parseResult.valid) {
        // Send error response for invalid request
        output.write(JSON.stringify(parseResult.error) + '\n');
        continue;
      }
      
      // Route to handler and send response
      routeRequest(parseResult.request, handlers)
        .then(response => {
          output.write(JSON.stringify(response) + '\n');
        })
        .catch(err => {
          log(`Unexpected error: ${err.message}`);
          output.write(JSON.stringify({
            id: parseResult.request.id,
            error: { code: 'INTERNAL_ERROR', message: err.message }
          }) + '\n');
        });
    }
  }
});

input.on('end', () => log('Input stream ended'));
