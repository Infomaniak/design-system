import { describe, expect, it } from 'vitest';
import type { Logger } from '../log/logger.ts';
import { ExecCommandError, execCommand, execCommandInherit } from './exec-command.ts';

const logger = { log: (): void => {} } as unknown as Logger;

describe('execCommand', () => {
  it('should return the output', async () => {
    expect(await execCommand(logger, 'node', ['-e', "process.stdout.write('a b')"])).toBe('a b');
  });

  it('should not block nor alter an output larger than the pipe buffer', async () => {
    const size: number = 5_000_000;
    const output: string = await execCommand(logger, 'node', [
      '-e',
      `process.stdout.write('x'.repeat(${size}))`,
    ]);
    expect(output).toBe('x'.repeat(size));
  });

  it('should not corrupt multi-byte characters split across chunks', async () => {
    const count: number = 1_000_000;
    const output: string = await execCommand(logger, 'node', [
      '-e',
      `process.stdout.write('é'.repeat(${count}))`,
    ]);
    expect(output).toBe('é'.repeat(count));
  });

  it('should reject with stderr on failure', async () => {
    const promise: Promise<string> = execCommand(logger, 'node', [
      '-e',
      "console.error('boom'); process.exit(2)",
    ]);
    await expect(promise).rejects.toBeInstanceOf(ExecCommandError);
    await expect(promise).rejects.toMatchObject({ exitCode: 2, stderr: 'boom\n' });
  });

  it('should reject with exitCode -1 if killed', async () => {
    await expect(
      execCommand(logger, 'node', ['-e', "process.kill(process.pid, 'SIGKILL')"]),
    ).rejects.toMatchObject({ exitCode: -1 });
  });

  it('should build the error without stderr', () => {
    expect(new ExecCommandError({ command: 'a', exitCode: 3 }).message).toContain(
      'exit with code 3',
    );
  });

  it('should default to no arguments', async () => {
    await expect(execCommandInherit(logger, 'pwd')).resolves.toBe('');
  });

  it('should reject if the command does not exist', async () => {
    await expect(execCommand(logger, 'this-command-does-not-exist')).rejects.toThrow();
  });

  it('should support quoting arguments with spaces', async () => {
    expect(await execCommand(logger, 'node', ['-p', '"a b"'])).toBe('a b\n');
  });

  it('should return an empty string with inherited stdio', async () => {
    expect(await execCommandInherit(logger, 'node', ['-e', ''])).toBe('');
  });
});
