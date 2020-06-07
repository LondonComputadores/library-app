# ember-jquery

[![Build Status](https://travis-ci.org/topaxi/ember-jquery.svg?branch=master)](https://travis-ci.org/topaxi/ember-jquery)

Easily add jquery to your ember applications

## Usage

```bash
ember install ember-jquery
```

## Addon Options

`ember-cli-build.js`:

```javascript
module.exports = function(defaults) {
  let app = new EmberAddon(defaults, {
    // Disable jQuery bundled with Ember.js
    vendorFiles: { 'jquery.js': null },
    // Example to include jQuery slim instead of default build
    jquery: {
      slim: true
    }
  });
}
```

Available options:

`slim` *boolean* (default false)

Use the [jQuery slim](https://blog.jquery.com/2016/06/09/jquery-3-0-final-released/) build, released with jQuery 3.0 and upwards.

## Installation

* `git clone <repository-url>` this repository
* `cd ember-jquery`
* `npm install`

## Running

* `ember serve`
* Visit your app at [http://localhost:4200](http://localhost:4200).

## Running Tests

* `npm test` (Runs `ember try:each` to test your addon against multiple Ember versions)
* `ember test`
* `ember test --server`

## Building

* `ember build`

For more information on using ember-cli, visit [https://ember-cli.com/](https://ember-cli.com/).
