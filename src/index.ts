#!/usr/bin/env node
import { McpServer } from '@modelcontextprotocol/sdk/server/mcp.js';
import { StdioServerTransport } from '@modelcontextprotocol/sdk/server/stdio.js';
import { registerAppTools } from './tools/app.js';
import { registerThemeTools } from './tools/theme.js';
import { registerHydrogenTools } from './tools/hydrogen.js';
import { registerResources } from './resources.js';

const server = new McpServer({
  name: 'shopify-cli-mcp',
  version: '0.3.0',
});

registerAppTools(server);
registerThemeTools(server);
registerHydrogenTools(server);
registerResources(server);

async function main() {
  const transport = new StdioServerTransport();
  await server.connect(transport);
}

main().catch((error) => {
  console.error('Failed to start Shopify CLI MCP server:', error);
  process.exit(1);
});
