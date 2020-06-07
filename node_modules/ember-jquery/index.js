/* eslint-env node */
'use strict'

module.exports = {
  name: 'ember-jquery',

  included: function(app) {
    this._super.included.apply(this, arguments)

    // see: https://github.com/ember-cli/ember-cli/issues/3718
    while (typeof app.import !== 'function' && app.app) {
      app = app.app
    }

    this.app = app
    this.jqueryOptions = this.getConfig()

    var vendor = this.treePaths.vendor

    app.import(vendor + '/shims/jquery.js', { prepend: true });

    if (this.jqueryOptions.slim) {
      app.import({
        development: vendor + '/jquery/jquery.slim.js',
        production: vendor + '/jquery/jquery.slim.min.js'
      }, { prepend: true })
    }
    else {
      app.import({
        development: vendor + '/jquery/jquery.js',
        production: vendor + '/jquery/jquery.min.js'
      }, { prepend: true })
    }
  },

  getConfig: function() {
    var path = require('path')
    var jqueryOptions = this.app.options.jquery || {}
    var jqueryPath = path.dirname(require.resolve('jquery'))

    var config = Object.assign({ slim: false }, jqueryOptions, {
      path: jqueryPath
    })

    return config
  },

  treeForVendor: function(vendorTree) {
    var Funnel = require('broccoli-funnel')
    var mergeTrees = require('broccoli-merge-trees')
    var map = require('broccoli-stew').map;
    var trees = []

    if (vendorTree) {
      trees.push(vendorTree)
    }

    var jquery = new Funnel(this.jqueryOptions.path, {
      destDir: 'jquery'
    });

    jquery = map(jquery, function(content) {
      return 'if (typeof FastBoot === \'undefined\') {'
        + content +
      '}';
    });

    trees.push(jquery)

    return mergeTrees(trees)
  }
}
