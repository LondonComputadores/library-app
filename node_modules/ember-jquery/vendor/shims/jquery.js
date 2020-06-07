(function() {
  function vendorModule() {
    'use strict';

    return {
      'default': self['jQuery'],
      __esModule: true,
    };
  }

  if (typeof FastBoot === 'undefined') {
    define('jquery', [], vendorModule);
  }
})();
