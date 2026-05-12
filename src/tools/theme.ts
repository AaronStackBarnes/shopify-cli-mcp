import { z } from 'zod';
import { runShopifyCli } from '../cli.js';
import type { McpServer } from '@modelcontextprotocol/sdk/server/mcp.js';

export function registerThemeTools(server: McpServer) {
  server.tool(
    'theme_list',
    'List all themes on a Shopify store with their IDs and statuses',
    {
      store: z.string().optional().describe('Store domain (e.g. my-store.myshopify.com)'),
      path: z.string().optional().describe('Path to theme project directory'),
    },
    async ({ store, path }) => {
      const args = ['theme', 'list', '--json'];
      if (store) args.push('--store', store);

      const result = await runShopifyCli(args, { cwd: path });
      return {
        content: [{ type: 'text' as const, text: result.stdout || result.stderr }],
        isError: result.exitCode !== 0,
      };
    }
  );

  server.tool(
    'theme_info',
    'Get information about the current theme environment',
    {
      store: z.string().optional().describe('Store domain'),
      path: z.string().optional().describe('Path to theme project directory'),
    },
    async ({ store, path }) => {
      const args = ['theme', 'info'];
      if (store) args.push('--store', store);

      const result = await runShopifyCli(args, { cwd: path });
      return {
        content: [{ type: 'text' as const, text: result.stdout || result.stderr }],
        isError: result.exitCode !== 0,
      };
    }
  );

  server.tool(
    'theme_push',
    'Upload local theme files to a Shopify store. Can target specific themes or create unpublished ones.',
    {
      store: z.string().optional().describe('Store domain'),
      path: z.string().optional().describe('Path to theme project directory'),
      theme: z.string().optional().describe('Target theme ID or name'),
      unpublished: z.boolean().optional().describe('Upload as a new unpublished theme'),
      only: z.array(z.string()).optional().describe('Only upload files matching these patterns'),
      ignore: z.array(z.string()).optional().describe('Ignore files matching these patterns'),
      nodelete: z.boolean().optional().describe('Do not delete remote files not present locally'),
    },
    async ({ store, path, theme, unpublished, only, ignore, nodelete }) => {
      const args = ['theme', 'push', '--json'];
      if (store) args.push('--store', store);
      if (theme) args.push('--theme', theme);
      if (unpublished) args.push('--unpublished');
      if (nodelete) args.push('--nodelete');
      only?.forEach(p => args.push('--only', p));
      ignore?.forEach(p => args.push('--ignore', p));

      const result = await runShopifyCli(args, { cwd: path, timeout: 300_000 });
      return {
        content: [{ type: 'text' as const, text: result.stdout || result.stderr }],
        isError: result.exitCode !== 0,
      };
    }
  );

  server.tool(
    'theme_pull',
    'Download theme files from a Shopify store to the local project',
    {
      store: z.string().optional().describe('Store domain'),
      path: z.string().optional().describe('Path to theme project directory'),
      theme: z.string().optional().describe('Source theme ID or name'),
      only: z.array(z.string()).optional().describe('Only download files matching these patterns'),
      ignore: z.array(z.string()).optional().describe('Ignore files matching these patterns'),
    },
    async ({ store, path, theme, only, ignore }) => {
      const args = ['theme', 'pull'];
      if (store) args.push('--store', store);
      if (theme) args.push('--theme', theme);
      only?.forEach(p => args.push('--only', p));
      ignore?.forEach(p => args.push('--ignore', p));

      const result = await runShopifyCli(args, { cwd: path, timeout: 300_000 });
      return {
        content: [{ type: 'text' as const, text: result.stdout || result.stderr }],
        isError: result.exitCode !== 0,
      };
    }
  );

  server.tool(
    'theme_check',
    'Run Theme Check linter to find errors and best practice violations in theme code',
    {
      path: z.string().optional().describe('Path to theme project directory'),
    },
    async ({ path }) => {
      const args = ['theme', 'check'];
      const result = await runShopifyCli(args, { cwd: path });
      return {
        content: [{ type: 'text' as const, text: result.stdout || result.stderr }],
        isError: result.exitCode !== 0,
      };
    }
  );

  server.tool(
    'theme_dev',
    'Start a local theme development server with hot reload',
    {
      store: z.string().optional().describe('Store domain'),
      path: z.string().optional().describe('Path to theme project directory'),
      theme: z.string().optional().describe('Theme ID to use for dev'),
      port: z.number().optional().describe('Local port for the dev server'),
    },
    async ({ store, path, theme, port }) => {
      const args = ['theme', 'dev'];
      if (store) args.push('--store', store);
      if (theme) args.push('--theme', theme);
      if (port) args.push('--port', String(port));

      const result = await runShopifyCli(args, { cwd: path, timeout: 30_000 });
      return {
        content: [{ type: 'text' as const, text: result.stdout || result.stderr }],
        isError: result.exitCode !== 0,
      };
    }
  );
}
