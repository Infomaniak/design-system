'use strict';

const Module = require('module');

const originalRequire = Module.prototype.require;
const ts6Path = require.resolve('typescript6');

Module.prototype.require = function (id) {
  if (id === 'typescript') {
    return originalRequire.call(this, ts6Path);
  }
  return originalRequire.call(this, id);
};
