# shopify-cli-mcp

An MCP server that wraps the [Shopify CLI](https://shopify.dev/docs/api/shopify-cli) so AI assistants can manage your Shopify apps, themes, and Hydrogen storefronts.

Works with Claude Code, Cursor, Windsurf, and any MCP-compatible client.

## Why?

Shopify's official [`@shopify/dev-mcp`](https://www.npmjs.com/package/@shopify/dev-mcp) is great for docs and schema validation, but it doesn't actually run CLI commands. This server fills that gap &mdash; it lets your AI assistant build, deploy, test webhooks, run GraphQL queries, and manage themes using the real Shopify CLI under the hood.

## Quick Start

Make sure you have the [Shopify CLI](https://shopify.dev/docs/api/shopify-cli#installation) installed:

```bash
npm install -g @shopify/cli
```

### Claude Code

Add to your project's `.mcp.json`:

```json
{
  "mcpServers": {
    "shopify": {
      "command": "npx",
      "args": ["-y", "@gbrlxvii/shopify-cli-mcp"]
    }
  }
}
```

### Cursor / Windsurf

Add to your MCP settings:

```json
{
  "shopify-cli": {
    "command": "npx",
    "args": ["-y", "@gbrlxvii/shopify-cli-mcp"]
  }
}
```

## Tools

### App Development

| Tool | Description |
|------|-------------|
| `app_info` | Get app details, API keys, and extension list |
| `app_build` | Build the app and extensions |
| `app_deploy` | Build and deploy to Shopify |
| `app_dev` | Start the local dev server |
| `app_generate_extension` | Scaffold a new extension |
| `app_config_validate` | Validate TOML configuration |
| `app_logs` | Fetch app logs from Shopify |
| `app_versions_list` | List deployed versions |
| `graphql_execute` | Run Admin API GraphQL queries |
| `webhook_trigger` | Test webhook deliveries |

### Themes

| Tool | Description |
|------|-------------|
| `theme_list` | List themes on the store |
| `theme_info` | Get theme environment info |
| `theme_push` | Upload theme files |
| `theme_pull` | Download theme files |
| `theme_check` | Run Theme Check linter |
| `theme_dev` | Start theme dev server |

### Hydrogen

| Tool | Description |
|------|-------------|
| `hydrogen_dev` | Start Hydrogen dev server |
| `hydrogen_build` | Production build |
| `hydrogen_deploy` | Deploy to Oxygen |
| `hydrogen_codegen` | Generate Storefront API types |
| `hydrogen_check` | Check route implementations |
| `hydrogen_env_list` | List environment variables |

## Resources

| Resource | URI | Description |
|----------|-----|-------------|
| App Config | `shopify://app/config` | Reads `shopify.app.toml` from the project |
| App Info | `shopify://app/info` | Live app details via `shopify app info` |
| Theme List | `shopify://themes` | Themes on the connected store |

## Examples

Deploy an app with a version message:
```
Deploy my app with the message "v2.1 - new checkout extension"
```

Run a GraphQL query:
```
Query the Admin API for the 5 most recent orders on my dev store
```

Push theme changes:
```
Push my theme changes but ignore the config/ directory
```

## Requirements

- Node.js 18+
- [Shopify CLI](https://shopify.dev/docs/api/shopify-cli#installation) installed and authenticated
- An existing Shopify app or theme project

## Development

```bash
git clone https://github.com/gbrlxvii/shopify-cli-mcp.git
cd shopify-cli-mcp
npm install
npm run build
```

Test locally:

```bash
node dist/index.js
```

## License

MIT
