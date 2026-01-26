export async function onTagScript(): Promise<void> {
  console.log('github repo tagged');
}

await onTagScript();
