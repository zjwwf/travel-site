#!/usr/bin/env node
import { stdin as input, stdout as output } from 'node:process';

// Minimal MCP-like stdio echo server scaffold
// Adjust protocol handling if integrating with actual Model Context Protocol implementation.

function log(msg) {
  output.write(`[mcp-server] ${msg}\n`);
}

log('Starting travel-site MCP server');

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
      // For demonstration, respond with a JSON envelope
      try {
        const parsed = JSON.parse(trimmed);
        const response = {
          id: parsed.id ?? null,
          echo: parsed,
          server: 'travel-site-mcp',
          timestamp: new Date().toISOString()
        };
        output.write(JSON.stringify(response) + '\n');
      } catch (e) {
        output.write(JSON.stringify({ error: 'Invalid JSON', raw: trimmed }) + '\n');
      }
    }
  }
});

input.on('end', () => log('Input stream ended'));
