'use strict';

define("library-app/tests/helpers/create-offline-ref", ["exports", "firebase"], function (_exports, _firebase) {
  "use strict";

  Object.defineProperty(_exports, "__esModule", {
    value: true
  });
  _exports.default = createOfflineRef;

  /**
   * Creates an offline firebase reference with optional initial data and url.
   *
   * Be sure to `stubfirebase()` and `unstubfirebase()` in your tests!
   *
   * @param  {!Object} [initialData]
   * @param  {string} [url]
   * @param  {string} [apiKey]
   * @return {!firebase.database.Reference}
   */
  function createOfflineRef(initialData, url = 'https://emberfire-tests-2c814.firebaseio.com', apiKey = 'AIzaSyC9-ndBb1WR05rRF1msVQDV6EBqB752m6o') {
    if (!_firebase.default._unStub) {
      throw new Error('Please use stubFirebase() before calling this method');
    }

    const config = {
      apiKey: apiKey,
      authDomain: 'emberfire-tests-2c814.firebaseapp.com',
      databaseURL: url,
      storageBucket: ''
    };
    let app;

    try {
      app = _firebase.default.app();
    } catch (e) {
      app = _firebase.default.initializeApp(config);
    }

    const ref = app.database().ref();
    app.database().goOffline(); // must be called after the ref is created

    if (initialData) {
      ref.set(initialData);
    }

    return ref;
  }
});
define("library-app/tests/helpers/destroy-firebase-apps", ["exports", "firebase"], function (_exports, _firebase) {
  "use strict";

  Object.defineProperty(_exports, "__esModule", {
    value: true
  });
  _exports.default = destroyFirebaseApps;
  const {
    run
  } = Ember;
  /**
   * Destroy all Firebase apps.
   */

  function destroyFirebaseApps() {
    const deletions = _firebase.default.apps.map(app => app.delete());

    Ember.RSVP.all(deletions).then(() => run(() => {// NOOP to delay run loop until the apps are destroyed
    }));
  }
});
define("library-app/tests/helpers/replace-app-ref", ["exports"], function (_exports) {
  "use strict";

  Object.defineProperty(_exports, "__esModule", {
    value: true
  });
  _exports.default = replaceAppRef;

  /**
   * Updates the supplied app adapter's Firebase reference.
   *
   * @param  {!Ember.Application} app
   * @param  {!firebase.database.Reference} ref
   * @param  {string} [model]  The model, if overriding a model specific adapter
   */
  function replaceAppRef(app, ref, model = 'application') {
    app.register('service:firebaseMock', ref, {
      instantiate: false,
      singleton: true
    });
    app.inject('adapter:firebase', 'firebase', 'service:firebaseMock');
    app.inject('adapter:' + model, 'firebase', 'service:firebaseMock');
  }
});
define("library-app/tests/helpers/replace-firebase-app-service", ["exports"], function (_exports) {
  "use strict";

  Object.defineProperty(_exports, "__esModule", {
    value: true
  });
  _exports.default = replaceFirebaseAppService;

  /**
   * Replaces the `firebaseApp` service with your own using injection overrides.
   *
   * This is usually not needed in test modules, where you can re-register over
   * existing names in the registry, but in acceptance tests, some registry/inject
   * magic is needed.
   *
   * @param  {!Ember.Application} app
   * @param  {!Object} newService
   */
  function replaceFirebaseAppService(app, newService) {
    app.register('service:firebaseAppMock', newService, {
      instantiate: false,
      singleton: true
    });
    app.inject('torii-provider:firebase', 'firebaseApp', 'service:firebaseAppMock');
    app.inject('torii-adapter:firebase', 'firebaseApp', 'service:firebaseAppMock');
  }
});
define("library-app/tests/helpers/stub-firebase", ["exports", "firebase"], function (_exports, _firebase) {
  "use strict";

  Object.defineProperty(_exports, "__esModule", {
    value: true
  });
  _exports.default = stubFirebase;

  /**
   * When a reference is in offline mode it will not call any callbacks
   * until it goes online and resyncs. The ref will have already
   * updated its internal cache with the changed values so we shortcut
   * the process and call the supplied callbacks immediately (asynchronously).
   */
  function stubFirebase() {
    // check for existing stubbing
    if (!_firebase.default._unStub) {
      var originalSet = _firebase.default.database.Reference.prototype.set;
      var originalUpdate = _firebase.default.database.Reference.prototype.update;
      var originalRemove = _firebase.default.database.Reference.prototype.remove;

      _firebase.default._unStub = function () {
        _firebase.default.database.Reference.prototype.set = originalSet;
        _firebase.default.database.Reference.prototype.update = originalUpdate;
        _firebase.default.database.Reference.prototype.remove = originalRemove;
      };

      _firebase.default.database.Reference.prototype.set = function (data, cb) {
        originalSet.call(this, data);

        if (typeof cb === 'function') {
          setTimeout(cb, 0);
        }
      };

      _firebase.default.database.Reference.prototype.update = function (data, cb) {
        originalUpdate.call(this, data);

        if (typeof cb === 'function') {
          setTimeout(cb, 0);
        }
      };

      _firebase.default.database.Reference.prototype.remove = function (cb) {
        originalRemove.call(this);

        if (typeof cb === 'function') {
          setTimeout(cb, 0);
        }
      };
    }
  }
});
define("library-app/tests/helpers/unstub-firebase", ["exports", "firebase"], function (_exports, _firebase) {
  "use strict";

  Object.defineProperty(_exports, "__esModule", {
    value: true
  });
  _exports.default = unstubFirebase;

  function unstubFirebase() {
    if (typeof _firebase.default._unStub === 'function') {
      _firebase.default._unStub();

      delete _firebase.default._unStub;
    }
  }
});
define("library-app/tests/lint/app.lint-test", [], function () {
  "use strict";

  QUnit.module('ESLint | app');
  QUnit.test('adapters/application.js', function (assert) {
    assert.expect(1);
    assert.ok(true, 'adapters/application.js should pass ESLint\n\n');
  });
  QUnit.test('app.js', function (assert) {
    assert.expect(1);
    assert.ok(true, 'app.js should pass ESLint\n\n');
  });
  QUnit.test('controllers/contact.js', function (assert) {
    assert.expect(1);
    assert.ok(true, 'controllers/contact.js should pass ESLint\n\n');
  });
  QUnit.test('controllers/index.js', function (assert) {
    assert.expect(1);
    assert.ok(true, 'controllers/index.js should pass ESLint\n\n');
  });
  QUnit.test('models/invitation.js', function (assert) {
    assert.expect(1);
    assert.ok(true, 'models/invitation.js should pass ESLint\n\n');
  });
  QUnit.test('router.js', function (assert) {
    assert.expect(1);
    assert.ok(true, 'router.js should pass ESLint\n\n');
  });
  QUnit.test('routes/about.js', function (assert) {
    assert.expect(1);
    assert.ok(true, 'routes/about.js should pass ESLint\n\n');
  });
  QUnit.test('routes/contact.js', function (assert) {
    assert.expect(1);
    assert.ok(true, 'routes/contact.js should pass ESLint\n\n');
  });
});
define("library-app/tests/lint/templates.template.lint-test", [], function () {
  "use strict";

  QUnit.module('TemplateLint');
  QUnit.test('library-app/templates/about.hbs', function (assert) {
    assert.expect(1);
    assert.ok(true, 'library-app/templates/about.hbs should pass TemplateLint.\n\n');
  });
  QUnit.test('library-app/templates/application.hbs', function (assert) {
    assert.expect(1);
    assert.ok(false, 'library-app/templates/application.hbs should pass TemplateLint.\n\nlibrary-app/templates/application.hbs\n  12:8  error  You are using the component {{link-to}} with curly component syntax. You should use <LinkTo> instead. If it is actually a helper you must manually add it to the \'no-curly-component-invocation\' rule configuration, e.g. `\'no-curly-component-invocation\': { allow: [\'link-to\'] }`.  no-curly-component-invocation\n  13:8  error  You are using the component {{link-to}} with curly component syntax. You should use <LinkTo> instead. If it is actually a helper you must manually add it to the \'no-curly-component-invocation\' rule configuration, e.g. `\'no-curly-component-invocation\': { allow: [\'link-to\'] }`.  no-curly-component-invocation\n  14:8  error  You are using the component {{link-to}} with curly component syntax. You should use <LinkTo> instead. If it is actually a helper you must manually add it to the \'no-curly-component-invocation\' rule configuration, e.g. `\'no-curly-component-invocation\': { allow: [\'link-to\'] }`.  no-curly-component-invocation\n  19:14  error  You are using the component {{link-to}} with curly component syntax. You should use <LinkTo> instead. If it is actually a helper you must manually add it to the \'no-curly-component-invocation\' rule configuration, e.g. `\'no-curly-component-invocation\': { allow: [\'link-to\'] }`.  no-curly-component-invocation\n  20:14  error  You are using the component {{link-to}} with curly component syntax. You should use <LinkTo> instead. If it is actually a helper you must manually add it to the \'no-curly-component-invocation\' rule configuration, e.g. `\'no-curly-component-invocation\': { allow: [\'link-to\'] }`.  no-curly-component-invocation\n  21:14  error  You are using the component {{link-to}} with curly component syntax. You should use <LinkTo> instead. If it is actually a helper you must manually add it to the \'no-curly-component-invocation\' rule configuration, e.g. `\'no-curly-component-invocation\': { allow: [\'link-to\'] }`.  no-curly-component-invocation\n  23:12  error  HTML comment detected  no-html-comments\n  24:10  error  HTML comment detected  no-html-comments\n');
  });
  QUnit.test('library-app/templates/contact.hbs', function (assert) {
    assert.expect(1);
    assert.ok(false, 'library-app/templates/contact.hbs should pass TemplateLint.\n\nlibrary-app/templates/contact.hbs\n  14:53  error  Do not use `action` as <button {{action ...}} />. Instead, use the `on` modifier and `fn` helper.  no-action\n  8:4  error  You are using the component {{input}} with curly component syntax. You should use <Input> instead. If it is actually a helper you must manually add it to the \'no-curly-component-invocation\' rule configuration, e.g. `\'no-curly-component-invocation\': { allow: [\'input\'] }`.  no-curly-component-invocation\n  11:4  error  You are using the component {{textarea}} with curly component syntax. You should use <Textarea> instead. If it is actually a helper you must manually add it to the \'no-curly-component-invocation\' rule configuration, e.g. `\'no-curly-component-invocation\': { allow: [\'textarea\'] }`.  no-curly-component-invocation\n  18:37  error  You are using the component {{responseMessage}} with curly component syntax. You should use <ResponseMessage> instead. If it is actually a helper you must manually add it to the \'no-curly-component-invocation\' rule configuration, e.g. `\'no-curly-component-invocation\': { allow: [\'responseMessage\'] }`.  no-curly-component-invocation\n  3:16  error  Ambiguous path \'Us\' is not allowed. Use \'@Us\' if it is a named argument or \'this.Us\' if it is a property on \'this\'. If it is a helper or component that has no arguments you must manually add it to the \'no-implicit-this\' rule configuration, e.g. \'no-implicit-this\': { allow: [\'Us\'] }.  no-implicit-this\n  8:31  error  Ambiguous path \'emailAddress\' is not allowed. Use \'@emailAddress\' if it is a named argument or \'this.emailAddress\' if it is a property on \'this\'. If it is a helper or component that has no arguments you must manually add it to the \'no-implicit-this\' rule configuration, e.g. \'no-implicit-this\': { allow: [\'emailAddress\'] }.  no-implicit-this\n  11:104  error  Ambiguous path \'message\' is not allowed. Use \'@message\' if it is a named argument or \'this.message\' if it is a property on \'this\'. If it is a helper or component that has no arguments you must manually add it to the \'no-implicit-this\' rule configuration, e.g. \'no-implicit-this\': { allow: [\'message\'] }.  no-implicit-this\n  14:89  error  Ambiguous path \'isDisabled\' is not allowed. Use \'@isDisabled\' if it is a named argument or \'this.isDisabled\' if it is a property on \'this\'. If it is a helper or component that has no arguments you must manually add it to the \'no-implicit-this\' rule configuration, e.g. \'no-implicit-this\': { allow: [\'isDisabled\'] }.  no-implicit-this\n  17:8  error  Ambiguous path \'responseMessage\' is not allowed. Use \'@responseMessage\' if it is a named argument or \'this.responseMessage\' if it is a property on \'this\'. If it is a helper or component that has no arguments you must manually add it to the \'no-implicit-this\' rule configuration, e.g. \'no-implicit-this\': { allow: [\'responseMessage\'] }.  no-implicit-this\n  18:39  error  Ambiguous path \'responseMessage\' is not allowed. Use \'@responseMessage\' if it is a named argument or \'this.responseMessage\' if it is a property on \'this\'. If it is a helper or component that has no arguments you must manually add it to the \'no-implicit-this\' rule configuration, e.g. \'no-implicit-this\': { allow: [\'responseMessage\'] }.  no-implicit-this\n  14:4  error  All `<button>` elements should have a valid `type` attribute  require-button-type\n');
  });
  QUnit.test('library-app/templates/index.hbs', function (assert) {
    assert.expect(1);
    assert.ok(false, 'library-app/templates/index.hbs should pass TemplateLint.\n\nlibrary-app/templates/index.hbs\n  14:56  error  Do not use `action` as <button {{action ...}} />. Instead, use the `on` modifier and `fn` helper.  no-action\n  3:7  error  You are using the component {{headerMessage}} with curly component syntax. You should use <HeaderMessage> instead. If it is actually a helper you must manually add it to the \'no-curly-component-invocation\' rule configuration, e.g. `\'no-curly-component-invocation\': { allow: [\'headerMessage\'] }`.  no-curly-component-invocation\n  11:7  error  You are using the component {{input}} with curly component syntax. You should use <Input> instead. If it is actually a helper you must manually add it to the \'no-curly-component-invocation\' rule configuration, e.g. `\'no-curly-component-invocation\': { allow: [\'input\'] }`.  no-curly-component-invocation\n  19:38  error  You are using the component {{responseMessage}} with curly component syntax. You should use <ResponseMessage> instead. If it is actually a helper you must manually add it to the \'no-curly-component-invocation\' rule configuration, e.g. `\'no-curly-component-invocation\': { allow: [\'responseMessage\'] }`.  no-curly-component-invocation\n  3:9  error  Ambiguous path \'headerMessage\' is not allowed. Use \'@headerMessage\' if it is a named argument or \'this.headerMessage\' if it is a property on \'this\'. If it is a helper or component that has no arguments you must manually add it to the \'no-implicit-this\' rule configuration, e.g. \'no-implicit-this\': { allow: [\'headerMessage\'] }.  no-implicit-this\n  11:34  error  Ambiguous path \'emailAddress\' is not allowed. Use \'@emailAddress\' if it is a named argument or \'this.emailAddress\' if it is a property on \'this\'. If it is a helper or component that has no arguments you must manually add it to the \'no-implicit-this\' rule configuration, e.g. \'no-implicit-this\': { allow: [\'emailAddress\'] }.  no-implicit-this\n  14:95  error  Ambiguous path \'isDisabled\' is not allowed. Use \'@isDisabled\' if it is a named argument or \'this.isDisabled\' if it is a property on \'this\'. If it is a helper or component that has no arguments you must manually add it to the \'no-implicit-this\' rule configuration, e.g. \'no-implicit-this\': { allow: [\'isDisabled\'] }.  no-implicit-this\n  18:9  error  Ambiguous path \'responseMessage\' is not allowed. Use \'@responseMessage\' if it is a named argument or \'this.responseMessage\' if it is a property on \'this\'. If it is a helper or component that has no arguments you must manually add it to the \'no-implicit-this\' rule configuration, e.g. \'no-implicit-this\': { allow: [\'responseMessage\'] }.  no-implicit-this\n  19:40  error  Ambiguous path \'responseMessage\' is not allowed. Use \'@responseMessage\' if it is a named argument or \'this.responseMessage\' if it is a property on \'this\'. If it is a helper or component that has no arguments you must manually add it to the \'no-implicit-this\' rule configuration, e.g. \'no-implicit-this\': { allow: [\'responseMessage\'] }.  no-implicit-this\n  14:7  error  All `<button>` elements should have a valid `type` attribute  require-button-type\n');
  });
});
define("library-app/tests/lint/tests.lint-test", [], function () {
  "use strict";

  QUnit.module('ESLint | tests');
  QUnit.test('test-helper.js', function (assert) {
    assert.expect(1);
    assert.ok(true, 'test-helper.js should pass ESLint\n\n');
  });
  QUnit.test('unit/controllers/contact-test.js', function (assert) {
    assert.expect(1);
    assert.ok(true, 'unit/controllers/contact-test.js should pass ESLint\n\n');
  });
  QUnit.test('unit/controllers/index-test.js', function (assert) {
    assert.expect(1);
    assert.ok(true, 'unit/controllers/index-test.js should pass ESLint\n\n');
  });
  QUnit.test('unit/models/invitation-test.js', function (assert) {
    assert.expect(1);
    assert.ok(true, 'unit/models/invitation-test.js should pass ESLint\n\n');
  });
  QUnit.test('unit/routes/about-test.js', function (assert) {
    assert.expect(1);
    assert.ok(true, 'unit/routes/about-test.js should pass ESLint\n\n');
  });
  QUnit.test('unit/routes/contact-test.js', function (assert) {
    assert.expect(1);
    assert.ok(true, 'unit/routes/contact-test.js should pass ESLint\n\n');
  });
});
define("library-app/tests/test-helper", ["library-app/app", "library-app/config/environment", "@ember/test-helpers", "ember-qunit"], function (_app, _environment, _testHelpers, _emberQunit) {
  "use strict";

  (0, _testHelpers.setApplication)(_app.default.create(_environment.default.APP));
  (0, _emberQunit.start)();
});
define("library-app/tests/unit/controllers/contact-test", ["qunit", "ember-qunit"], function (_qunit, _emberQunit) {
  "use strict";

  (0, _qunit.module)('Unit | Controller | contact', function (hooks) {
    (0, _emberQunit.setupTest)(hooks); // Replace this with your real tests.

    (0, _qunit.test)('it exists', function (assert) {
      let controller = this.owner.lookup('controller:contact');
      assert.ok(controller);
    });
  });
});
define("library-app/tests/unit/controllers/index-test", ["qunit", "ember-qunit"], function (_qunit, _emberQunit) {
  "use strict";

  (0, _qunit.module)('Unit | Controller | index', function (hooks) {
    (0, _emberQunit.setupTest)(hooks); // Replace this with your real tests.

    (0, _qunit.test)('it exists', function (assert) {
      let controller = this.owner.lookup('controller:index');
      assert.ok(controller);
    });
  });
});
define("library-app/tests/unit/models/invitation-test", ["qunit", "ember-qunit"], function (_qunit, _emberQunit) {
  "use strict";

  (0, _qunit.module)('Unit | Model | invitation', function (hooks) {
    (0, _emberQunit.setupTest)(hooks); // Replace this with your real tests.

    (0, _qunit.test)('it exists', function (assert) {
      let store = this.owner.lookup('service:store');
      let model = store.createRecord('invitation', {});
      assert.ok(model);
    });
  });
});
define("library-app/tests/unit/routes/about-test", ["qunit", "ember-qunit"], function (_qunit, _emberQunit) {
  "use strict";

  (0, _qunit.module)('Unit | Route | about', function (hooks) {
    (0, _emberQunit.setupTest)(hooks);
    (0, _qunit.test)('it exists', function (assert) {
      let route = this.owner.lookup('route:about');
      assert.ok(route);
    });
  });
});
define("library-app/tests/unit/routes/contact-test", ["qunit", "ember-qunit"], function (_qunit, _emberQunit) {
  "use strict";

  (0, _qunit.module)('Unit | Route | contact', function (hooks) {
    (0, _emberQunit.setupTest)(hooks);
    (0, _qunit.test)('it exists', function (assert) {
      let route = this.owner.lookup('route:contact');
      assert.ok(route);
    });
  });
});
define('library-app/config/environment', [], function() {
  var prefix = 'library-app';
try {
  var metaName = prefix + '/config/environment';
  var rawConfig = document.querySelector('meta[name="' + metaName + '"]').getAttribute('content');
  var config = JSON.parse(decodeURIComponent(rawConfig));

  var exports = { 'default': config };

  Object.defineProperty(exports, '__esModule', { value: true });

  return exports;
}
catch(err) {
  throw new Error('Could not read config from meta tag with name "' + metaName + '".');
}

});

require('library-app/tests/test-helper');
EmberENV.TESTS_FILE_LOADED = true;
//# sourceMappingURL=tests.map
