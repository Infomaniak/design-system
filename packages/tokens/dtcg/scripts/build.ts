import { cmd } from '../../../../scripts/helpers/cmd.ts';

export async function build(): Promise<void> {
  console.log('build');

  await cmd('echo', ['build']);
}

build();
