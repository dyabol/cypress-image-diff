"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = exports.Paths = exports.userConfig = void 0;

var _classCallCheck2 = _interopRequireDefault(require("@babel/runtime/helpers/classCallCheck"));

var _createClass2 = _interopRequireDefault(require("@babel/runtime/helpers/createClass"));

var _path = _interopRequireDefault(require("path"));

var _merge = _interopRequireDefault(require("lodash/merge"));

var _fsExtra = _interopRequireDefault(require("fs-extra"));

var _config = _interopRequireDefault(require("./config.default"));

function grab(flag) {
  var index = process.argv.indexOf(flag);
  return index === -1 ? null : process.argv[index + 1];
}

function getUserConfigFile() {
  try {
    if (_fsExtra["default"].existsSync(_path["default"].join(process.cwd(), 'cypress-image-diff.config.cjs'))) {
      // eslint-disable-next-line import/no-dynamic-require, global-require
      return require(_path["default"].join(process.cwd(), 'cypress-image-diff.config.cjs'));
    } // eslint-disable-next-line import/no-dynamic-require, global-require


    return require(_path["default"].join(process.cwd(), 'cypress-image-diff.config'));
  } catch (err) {
    return {};
  }
}

var configJson = grab('--cypress-image-config-json');
var userConfig = (0, _merge["default"])({}, _config["default"], getUserConfigFile(), JSON.parse(configJson));
exports.userConfig = userConfig;

var Paths = /*#__PURE__*/function () {
  function Paths(config) {
    (0, _classCallCheck2["default"])(this, Paths);
    this.rootDir = config.ROOT_DIR;
    this.screenshotFolderName = config.SCREENSHOTS_DIR;
    this.reportFolderName = config.REPORT_DIR;
  }

  (0, _createClass2["default"])(Paths, [{
    key: "report",
    value: function report(instance) {
      return _path["default"].join(this.reportDir, "".concat(this.reportFolderName).concat(instance, ".html"));
    }
  }, {
    key: "screenshotDir",
    get: function get() {
      return _path["default"].join(this.rootDir, this.screenshotFolderName);
    }
  }, {
    key: "baseline",
    get: function get() {
      return _path["default"].join(process.cwd(), this.screenshotDir, 'baseline');
    }
  }, {
    key: "comparison",
    get: function get() {
      return _path["default"].join(process.cwd(), this.screenshotDir, 'comparison');
    }
  }, {
    key: "diff",
    get: function get() {
      return _path["default"].join(process.cwd(), this.screenshotDir, 'diff');
    }
  }, {
    key: "image",
    get: function get() {
      var _this = this;

      return {
        baseline: function baseline(testName) {
          return _path["default"].join(_this.baseline, "".concat(testName, ".png"));
        },
        comparison: function comparison(testName) {
          return _path["default"].join(_this.comparison, "".concat(testName, ".png"));
        },
        diff: function diff(testName) {
          return _path["default"].join(_this.diff, "".concat(testName, ".png"));
        }
      };
    }
  }, {
    key: "dir",
    get: function get() {
      return {
        baseline: this.baseline,
        comparison: this.comparison,
        diff: this.diff
      };
    }
  }, {
    key: "reportDir",
    get: function get() {
      return _path["default"].join(process.cwd(), this.rootDir, this.reportFolderName);
    }
  }]);
  return Paths;
}();

exports.Paths = Paths;

var _default = new Paths(userConfig);

exports["default"] = _default;