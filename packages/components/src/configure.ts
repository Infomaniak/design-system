import { IconifyApi } from '@infomaniak-design-system/esds-icon';

let _api: IconifyApi | undefined;

export function configure(api: IconifyApi): void {
  if (_api !== undefined) {
    throw new Error('configure() can only be called once.');
  }
  _api = api;
}

export function getApi(): IconifyApi {
  if (_api === undefined) {
    _api = new IconifyApi();
  }
  return _api;
}

export type { IconifyApi };
