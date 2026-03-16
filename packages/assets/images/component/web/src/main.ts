import { IconifyApi } from './api/iconify-api.ts';
import { EsdsSVGComponent } from './svg-component/esds-svg.component.ts';

function main(): void {
  EsdsSVGComponent.init(
    new IconifyApi({
      resources: ['https://svg-design-system.preprod.dev.infomaniak.ch'],
    }),
  );

  // EsdsSVGComponent.api.searchIconsOptimized({ prefix: 'ik', query: 'mail cog' }).then(console.log);
}

main();
