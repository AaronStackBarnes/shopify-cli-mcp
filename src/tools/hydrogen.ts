import { z } from 'zod';
import { runShopifyCli } from '../cli.js';
import type { McpServer } from '@modelcontextprotocol/sdk/server/mcp.js';

export function registerHydrogenTools(server: McpServer) {
  server.tool(
    'hydrogen_dev',
    'Start a local Hydrogen development server with Oxygen-emulating runtime',
    {
      path: z.string().optional().describe('Path to Hydrogen project directory'),
      port: z.number().optional().describe('Port for the dev server'),
    },
    async ({ path, port }) => {
      const args = ['hydrogen', 'dev'];
      if (port) args.push('--port', String(port));

      const result = await runShopifyCli(args, { cwd: path, timeout: 30_000 });
      return {
        content: [{ type: 'text' as const, text: result.stdout || result.stderr }],
        isError: result.exitCode !== 0,
      };
    }
  );

  server.tool(
    'hydrogen_build',
    'Build the Hydrogen storefront for production deployment',
    {
      path: z.string().optional().describe('Path to Hydrogen project directory'),
    },
    async ({ path }) => {
      const args = ['hydrogen', 'build'];
      const result = await runShopifyCli(args, { cwd: path, timeout: 300_000 });
      return {
        content: [{ type: 'text' as const, text: result.stdout || result.stderr }],
        isError: result.exitCode !== 0,
      };
    }
  );

  server.tool(
    'hydrogen_deploy',
    'Build and deploy the Hydrogen storefront to Shopify Oxygen',
    {
      path: z.string().optional().describe('Path to Hydrogen project directory'),
    },
    async ({ path }) => {
      const args = ['hydrogen', 'deploy', '--force'];
      const result = await runShopifyCli(args, { cwd: path, timeout: 600_000 });
      return {
        content: [{ type: 'text' as const, text: result.stdout || result.stderr }],
        isError: result.exitCode !== 0,
      };
    }
  );

  server.tool(
    'hydrogen_codegen',
    'Generate TypeScript types from Storefront API GraphQL queries',
    {
      path: z.string().optional().describe('Path to Hydrogen project directory'),
    },
    async ({ path }) => {
      const args = ['hydrogen', 'codegen'];
      const result = await runShopifyCli(args, { cwd: path });
      return {
        content: [{ type: 'text' as const, text: result.stdout || result.stderr }],
        isError: result.exitCode !== 0,
      };
    }
  );

  server.tool(
    'hydrogen_check',
    'Check the Hydrogen project for standard Shopify route implementations',
    {
      path: z.string().optional().describe('Path to Hydrogen project directory'),
    },
    async ({ path }) => {
      const args = ['hydrogen', 'check'];
      const result = await runShopifyCli(args, { cwd: path });
      return {
        content: [{ type: 'text' as const, text: result.stdout || result.stderr }],
        isError: result.exitCode !== 0,
      };
    }
  );

  server.tool(
    'hydrogen_env_list',
    'List environment variables for the linked Hydrogen storefront',
    {
      path: z.string().optional().describe('Path to Hydrogen project directory'),
    },
    async ({ path }) => {
      const args = ['hydrogen', 'env', 'list'];
      const result = await runShopifyCli(args, { cwd: path });
      return {
        content: [{ type: 'text' as const, text: result.stdout || result.stderr }],
        isError: result.exitCode !== 0,
      };
    }
  );
}
