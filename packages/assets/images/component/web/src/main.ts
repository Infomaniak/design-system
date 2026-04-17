import { IconifyApi } from './api/iconify-api.ts';
import { EsdsSVGComponent } from './svg-component/esds-svg.component.ts';

function main(): void {
  EsdsSVGComponent.init(
    new IconifyApi({
      // ALTERNATIVE endpoint: https://iconify.infomaniak.com
      resources: ['https://iconify.preprod.dev.infomaniak.ch'],
    }),
  );

  // EsdsSVGComponent.api.search({ prefix: 'esds', query: 'size 16 @all' }).then(console.log);
}

main();
