import { execFile } from 'node:child_process';
import { promisify } from 'node:util';

const exec = promisify(execFile);

export interface CliResult {
  stdout: string;
  stderr: string;
  exitCode: number;
}

export interface CliOptions {
  cwd?: string;
  timeout?: number;
  env?: Record<string, string>;
}

const DEFAULT_TIMEOUT = 120_000;

export async function runShopifyCli(
  args: string[],
  options: CliOptions = {}
): Promise<CliResult> {
  const { cwd, timeout = DEFAULT_TIMEOUT, env } = options;

  try {
    const { stdout, stderr } = await exec('shopify', args, {
      cwd,
      timeout,
      env: { ...process.env, ...env, NO_COLOR: '1', CI: '1' },
      maxBuffer: 10 * 1024 * 1024,
    });
    return { stdout, stderr, exitCode: 0 };
  } catch (error: unknown) {
    const err = error as { stdout?: string; stderr?: string; code?: number };
    return {
      stdout: err.stdout ?? '',
      stderr: err.stderr ?? String(error),
      exitCode: err.code ?? 1,
    };
  }
}

export function parseJsonOutput<T>(output: string): T | null {
  try {
    return JSON.parse(output) as T;
  } catch {
    return null;
  }
}
