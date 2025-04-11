'use strict';

Object.defineProperty(exports, '__esModule', {
  value: true
});

var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ('value' in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } }

var _path = require('path');

var _path2 = _interopRequireDefault(_path);

var _lodashMerge = require('lodash/merge');

var _lodashMerge2 = _interopRequireDefault(_lodashMerge);

var _fsExtra = require('fs-extra');

var _fsExtra2 = _interopRequireDefault(_fsExtra);

var _configDefault = require('./config.default');

var _configDefault2 = _interopRequireDefault(_configDefault);

function getUserConfigFile() {
  try {
    if (_fsExtra2['default'].existsSync(_path2['default'].join(process.cwd(), 'cypress-image-diff.config.cjs'))) {
      // eslint-disable-next-line import/no-dynamic-require, global-require
      return require(_path2['default'].join(process.cwd(), 'cypress-image-diff.config.cjs'));
    }
    // eslint-disable-next-line import/no-dynamic-require, global-require
    return require(_path2['default'].join(process.cwd(), 'cypress-image-diff.config'));
  } catch (err) {
    return {};
  }
}

var userConfig = (0, _lodashMerge2['default'])({}, _configDefault2['default'], getUserConfigFile(), process.env.CYPRESS_IMAGE_CONFIG_JSON ? JSON.parse(process.env.CYPRESS_IMAGE_CONFIG_JSON) : {}, process.env.CYPRESS_IMAGE_ROOT_DIR ? { ROOT_DIR: process.env.CYPRESS_IMAGE_ROOT_DIR } : {});

exports.userConfig = userConfig;

var Paths = (function () {
  function Paths(config) {
    _classCallCheck(this, Paths);

    this.rootDir = config.ROOT_DIR;
    this.screenshotFolderName = config.SCREENSHOTS_DIR;
    this.reportFolderName = config.REPORT_DIR;
  }

  _createClass(Paths, [{
    key: 'report',
    value: function report(instance) {
      return _path2['default'].join(this.reportDir, '' + this.reportFolderName + instance + '.html');
    }
  }, {
    key: 'screenshotDir',
    get: function get() {
      return _path2['default'].join(this.rootDir, this.screenshotFolderName);
    }
  }, {
    key: 'baseline',
    get: function get() {
      return _path2['default'].join(process.cwd(), this.screenshotDir, 'baseline');
    }
  }, {
    key: 'comparison',
    get: function get() {
      return _path2['default'].join(process.cwd(), this.screenshotDir, 'comparison');
    }
  }, {
    key: 'diff',
    get: function get() {
      return _path2['default'].join(process.cwd(), this.screenshotDir, 'diff');
    }
  }, {
    key: 'image',
    get: function get() {
      var _this = this;

      return {
        baseline: function baseline(testName) {
          return _path2['default'].join(_this.baseline, testName + '.png');
        },
        comparison: function comparison(testName) {
          return _path2['default'].join(_this.comparison, testName + '.png');
        },
        diff: function diff(testName) {
          return _path2['default'].join(_this.diff, testName + '.png');
        }
      };
    }
  }, {
    key: 'dir',
    get: function get() {
      return {
        baseline: this.baseline,
        comparison: this.comparison,
        diff: this.diff
      };
    }
  }, {
    key: 'reportDir',
    get: function get() {
      return _path2['default'].join(process.cwd(), this.rootDir, this.reportFolderName);
    }
  }]);

  return Paths;
})();

exports.Paths = Paths;
exports['default'] = new Paths(userConfig);