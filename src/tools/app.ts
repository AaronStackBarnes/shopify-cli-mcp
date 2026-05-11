import { z } from 'zod';
import { runShopifyCli } from '../cli.js';
import type { McpServer } from '@modelcontextprotocol/sdk/server/mcp.js';

const PathSchema = z.object({
  path: z.string().optional().describe('Path to Shopify app project directory'),
  config: z.string().optional().describe('Name of the app configuration to use'),
});

export function registerAppTools(server: McpServer) {
  server.tool(
    'app_info',
    'Get information about the current Shopify app, including API keys, extensions, and configuration',
    { ...PathSchema.shape },
    async ({ path, config }) => {
      const args = ['app', 'info', '--json'];
      if (path) args.push('--path', path);
      if (config) args.push('--config', config);

      const result = await runShopifyCli(args, { cwd: path });
      return {
        content: [{ type: 'text' as const, text: result.stdout || result.stderr }],
        isError: result.exitCode !== 0,
      };
    }
  );

  server.tool(
    'app_build',
    'Build the Shopify app and its extensions without deploying',
    { ...PathSchema.shape },
    async ({ path, config }) => {
      const args = ['app', 'build'];
      if (path) args.push('--path', path);
      if (config) args.push('--config', config);

      const result = await runShopifyCli(args, { cwd: path, timeout: 300_000 });
      return {
        content: [{ type: 'text' as const, text: result.stdout || result.stderr }],
        isError: result.exitCode !== 0,
      };
    }
  );

  server.tool(
    'app_deploy',
    'Build and deploy app configuration and extensions to Shopify. This is destructive — it pushes to production.',
    {
      ...PathSchema.shape,
      message: z.string().optional().describe('Deploy version message'),
      version: z.string().optional().describe('Existing version tag to deploy'),
      noRelease: z.boolean().optional().describe('Create version without releasing it'),
    },
    async ({ path, config, message, version, noRelease }) => {
      const args = ['app', 'deploy', '--force'];
      if (path) args.push('--path', path);
      if (config) args.push('--config', config);
      if (message) args.push('--message', message);
      if (version) args.push('--version', version);
      if (noRelease) args.push('--no-release');

      const result = await runShopifyCli(args, { cwd: path, timeout: 600_000 });
      return {
        content: [{ type: 'text' as const, text: result.stdout || result.stderr }],
        isError: result.exitCode !== 0,
      };
    }
  );

  server.tool(
    'app_dev',
    'Start the local development server for the Shopify app. Returns the dev server URL.',
    {
      ...PathSchema.shape,
      store: z.string().optional().describe('Development store domain (e.g. my-store.myshopify.com)'),
      tunnelUrl: z.string().optional().describe('Custom tunnel URL instead of auto-generated'),
    },
    async ({ path, config, store, tunnelUrl }) => {
      const args = ['app', 'dev'];
      if (path) args.push('--path', path);
      if (config) args.push('--config', config);
      if (store) args.push('--store', store);
      if (tunnelUrl) args.push('--tunnel-url', tunnelUrl);

      const result = await runShopifyCli(args, { cwd: path, timeout: 30_000 });
      return {
        content: [{
          type: 'text' as const,
          text: result.exitCode === 0
            ? `Dev server started.\n${result.stdout}`
            : `Dev server output:\n${result.stdout}\n${result.stderr}`,
        }],
        isError: result.exitCode !== 0,
      };
    }
  );

  server.tool(
    'app_generate_extension',
    'Generate a new app extension from a template',
    {
      ...PathSchema.shape,
      name: z.string().describe('Name for the new extension'),
      template: z.string().optional().describe('Extension template to use'),
      flavor: z.string().optional().describe('Extension flavor (e.g. react, vanilla-js, typescript-react)'),
    },
    async ({ path, config, name, template, flavor }) => {
      const args = ['app', 'generate', 'extension', '--name', name];
      if (path) args.push('--path', path);
      if (config) args.push('--config', config);
      if (template) args.push('--template', template);
      if (flavor) args.push('--flavor', flavor);

      const result = await runShopifyCli(args, { cwd: path, timeout: 120_000 });
      return {
        content: [{ type: 'text' as const, text: result.stdout || result.stderr }],
        isError: result.exitCode !== 0,
      };
    }
  );

  server.tool(
    'app_config_validate',
    'Validate the Shopify app TOML configuration and extension configs against their schemas',
    { ...PathSchema.shape },
    async ({ path, config }) => {
      const args = ['app', 'config', 'validate'];
      if (path) args.push('--path', path);
      if (config) args.push('--config', config);

      const result = await runShopifyCli(args, { cwd: path });
      return {
        content: [{ type: 'text' as const, text: result.stdout || result.stderr }],
        isError: result.exitCode !== 0,
      };
    }
  );

  server.tool(
    'app_logs',
    'Fetch recent app logs from Shopify',
    {
      ...PathSchema.shape,
      store: z.string().optional().describe('Store to fetch logs from'),
      source: z.string().optional().describe('Log source filter'),
      status: z.enum(['success', 'failure']).optional().describe('Filter by status'),
    },
    async ({ path, config, store, source, status }) => {
      const args = ['app', 'logs', '--json'];
      if (path) args.push('--path', path);
      if (config) args.push('--config', config);
      if (store) args.push('--store', store);
      if (source) args.push('--source', source);
      if (status) args.push('--status', status);

      const result = await runShopifyCli(args, { cwd: path, timeout: 30_000 });
      return {
        content: [{ type: 'text' as const, text: result.stdout || result.stderr }],
        isError: result.exitCode !== 0,
      };
    }
  );

  server.tool(
    'app_versions_list',
    'List all deployed versions of the app',
    { ...PathSchema.shape },
    async ({ path, config }) => {
      const args = ['app', 'versions', 'list', '--json'];
      if (path) args.push('--path', path);
      if (config) args.push('--config', config);

      const result = await runShopifyCli(args, { cwd: path });
      return {
        content: [{ type: 'text' as const, text: result.stdout || result.stderr }],
        isError: result.exitCode !== 0,
      };
    }
  );

  server.tool(
    'graphql_execute',
    'Execute an Admin API GraphQL query against a Shopify store',
    {
      ...PathSchema.shape,
      query: z.string().describe('GraphQL query string'),
      variables: z.string().optional().describe('JSON string of query variables'),
      store: z.string().optional().describe('Target store domain'),
      apiVersion: z.string().optional().describe('API version (e.g. 2025-01)'),
    },
    async ({ path, config, query, variables, store, apiVersion }) => {
      const args = ['app', 'execute', '--query', query];
      if (path) args.push('--path', path);
      if (config) args.push('--config', config);
      if (variables) args.push('--variables', variables);
      if (store) args.push('--store', store);
      if (apiVersion) args.push('--version', apiVersion);

      const result = await runShopifyCli(args, { cwd: path });
      return {
        content: [{ type: 'text' as const, text: result.stdout || result.stderr }],
        isError: result.exitCode !== 0,
      };
    }
  );

  server.tool(
    'webhook_trigger',
    'Trigger a sample webhook delivery for testing',
    {
      ...PathSchema.shape,
      topic: z.string().describe('Webhook topic (e.g. orders/create)'),
      address: z.string().optional().describe('Webhook delivery address'),
      deliveryMethod: z.enum(['http', 'pubsub', 'eventbridge']).optional(),
    },
    async ({ path, config, topic, address, deliveryMethod }) => {
      const args = ['app', 'webhook', 'trigger', '--topic', topic];
      if (path) args.push('--path', path);
      if (config) args.push('--config', config);
      if (address) args.push('--address', address);
      if (deliveryMethod) args.push('--delivery-method', deliveryMethod);

      const result = await runShopifyCli(args, { cwd: path });
      return {
        content: [{ type: 'text' as const, text: result.stdout || result.stderr }],
        isError: result.exitCode !== 0,
      };
    }
  );
}
