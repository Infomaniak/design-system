import { spawn, type SpawnOptions } from 'node:child_process';
import process from 'node:process';

/**
 * Runs "command" into the terminal.
 *
 * @param {string} command
 * @param {readonly string[]} args
 * @param {SpawnOptions | undefined} options
 * @returns {Promise<void>} A Promise that resolves when the command exits (ends with code 0) or rejects if the command fails.
 */
export async function cmd(
  command: string,
  args: readonly string[] = [],
  options: SpawnOptions | undefined = undefined,
): Promise<void> {
  return new Promise<void>((resolve: () => void, reject: (reason?: any) => void): void => {
    console.log(`> ${command} ${args.join(' ')}`);

    const childProcess = spawn(command, args, {
      cwd: process.cwd(),
      shell: process.platform === 'win32',
      detached: false,
      stdio: 'inherit',
      ...options,
    });

    childProcess.on('exit', (code) => {
      if (code === 0) {
        resolve();
      } else {
        reject(new Error(`Exit with code ${code}.`));
      }
    });

    childProcess.on('error', (err) => {
      reject(err);
    });

    // process.on('SIGINT', () => {
    //   childProcess.kill('SIGINT');
    // });
    //
    // process.on('SIGTERM', () => {
    //   childProcess.kill('SIGTERM');
    // });
    //
    // process.on('SIGBREAK', () => {
    //   childProcess.kill('SIGBREAK');
    // });
  });
}
