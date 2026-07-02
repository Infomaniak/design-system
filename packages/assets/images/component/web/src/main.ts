import { IconifyApi } from '@infomaniak-design-system/components';
import { EsdsIconComponent } from './esds-icon/esds-icon.component.ts';

function main(): void {
  EsdsIconComponent.init(
    new IconifyApi({
      // ALTERNATIVE endpoint: https://iconify.infomaniak.com
      resources: ['https://iconify.preprod.dev.infomaniak.ch'],
    }),
  );

  // EsdsIconComponent.api.search({ prefix: 'esds', query: 'size 16 @all' }).then(console.log);
}

main();
