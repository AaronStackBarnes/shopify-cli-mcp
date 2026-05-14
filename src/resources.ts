import { readFile } from 'node:fs/promises';
import { join } from 'node:path';
import { runShopifyCli } from './cli.js';
import type { McpServer } from '@modelcontextprotocol/sdk/server/mcp.js';

export function registerResources(server: McpServer) {
  server.resource(
    'app-config',
    'shopify://app/config',
    { description: 'Current Shopify app TOML configuration', mimeType: 'application/toml' },
    async () => {
      const configPaths = [
        'shopify.app.toml',
        'shopify.app.development.toml',
        'shopify.app.staging.toml',
      ];

      const contents: Array<{ uri: string; text: string }> = [];
      for (const configPath of configPaths) {
        try {
          const fullPath = join(process.cwd(), configPath);
          const text = await readFile(fullPath, 'utf-8');
          contents.push({ uri: `shopify://app/config/${configPath}`, text });
        } catch {
          // Config file doesn't exist, skip
        }
      }

      if (contents.length === 0) {
        return { contents: [{ uri: 'shopify://app/config', text: 'No shopify.app.toml found in current directory' }] };
      }
      return { contents };
    }
  );

  server.resource(
    'app-info',
    'shopify://app/info',
    { description: 'Shopify app details from the CLI (API keys, extensions, config)', mimeType: 'application/json' },
    async () => {
      const result = await runShopifyCli(['app', 'info', '--json']);
      return {
        contents: [{ uri: 'shopify://app/info', text: result.stdout || result.stderr }],
      };
    }
  );

  server.resource(
    'theme-list',
    'shopify://themes',
    { description: 'List of themes on the connected store', mimeType: 'application/json' },
    async () => {
      const result = await runShopifyCli(['theme', 'list', '--json']);
      return {
        contents: [{ uri: 'shopify://themes', text: result.stdout || result.stderr }],
      };
    }
  );
}
